"""Run with: python3 app.py. The dashboard listens only on this computer."""
from __future__ import annotations

import argparse
import hashlib
import json
import mimetypes
import os
import re
import secrets
import threading
import uuid
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

from intelligence.apify import budget_status, collect, save_json
from intelligence.export import csv_bytes, write_excel
from intelligence.model import catalog, matrix, normalize, parse_domains, select_companies
from intelligence.recovery import retry_plan

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
TOKEN = secrets.token_urlsafe(32)
RUN_LOCK = threading.Lock()
EXPORT_LOCK = threading.Lock()
JOBS = {}


def run_directory(run_id):
    if not re.fullmatch(r"[A-Za-z0-9_-]{1,100}", run_id):
        raise ValueError("Invalid saved scan.")
    directory = DATA / "runs" / run_id
    if run_id == "demo":
        directory = ROOT / "examples/demo"
    if not (directory / "manifest.json").exists():
        raise ValueError("Saved scan not found.")
    return directory


def runs():
    found = []
    for p in sorted((DATA / "runs").glob("*/manifest.json"), reverse=True):
        try:
            m = json.loads(p.read_text())
            found.append({"id": m["id"], "created_at": m["created_at"], "status": m["status"], "domains": m["domains"], "mode": m.get("mode", "live")})
        except (ValueError, KeyError):
            continue
    found.sort(key=lambda r: r["created_at"], reverse=True)
    found.append({"id": "demo", "created_at": "", "status": "Sample data", "domains": [], "mode": "synthetic"})
    return found


def validated_filters(data):
    f = data.get("filters", {})
    if not isinstance(f, dict):
        raise ValueError("Invalid filters")
    result = {k: str(f.get(k, ""))[:200] for k in ("query", "country", "industry")}
    result["scope"] = f.get("scope", "all")
    result["tool_match"] = f.get("tool_match", "all")
    if result["tool_match"] not in {"all", "any"}:
        raise ValueError("Choose all or any selected tools")
    if result["scope"] not in {"all", "website", "dns"}:
        raise ValueError("Invalid evidence scope")
    result["confidence"] = int(f.get("confidence", 50))
    if not 0 <= result["confidence"] <= 100:
        raise ValueError("Confidence must be between 0 and 100")
    for key in ("tools", "categories"):
        values = f.get(key, [])
        if not isinstance(values, list) or len(values) > 100:
            raise ValueError("Invalid tool/category selection")
        result[key] = [str(v)[:200] for v in values]
    result["states"] = f.get("states", ["Yes"])
    if not isinstance(result["states"], list) or not set(result["states"]) <= {"Yes", "No", "Unknown"}:
        raise ValueError("Invalid detection state")
    for key in ("min_employees", "max_employees"):
        v = f.get(key)
        result[key] = None if v in {None, ""} else int(v)
        if result[key] is not None and result[key] < 0:
            raise ValueError("Employee filters cannot be negative")
    if result["min_employees"] is not None and result["max_employees"] is not None and result["min_employees"] > result["max_employees"]:
        raise ValueError("Minimum employees cannot exceed maximum employees")
    return result


def view(data, raw=False):
    report = normalize(run_directory(str(data.get("id", "demo"))))
    filters = validated_filters(data)
    chosen = select_companies(report, **filters)
    table = matrix(report, chosen, scope=filters["scope"], confidence=filters["confidence"], raw=raw)
    return report, chosen, table


def start_job(data):
    source = None
    if data.get("retry_id"):
        source = run_directory(str(data["retry_id"]))
        domains = retry_plan(source)
    else:
        domains = parse_domains(str(data.get("domains", "")))
    token = str(data.get("token") or os.environ.get("APIFY_TOKEN", ""))
    if not token:
        raise ValueError("Enter an Apify token. It is used in memory and never saved.")
    allowance = float(data.get("allowance", 1.0))
    if not .1 <= allowance <= 5:
        raise ValueError("Choose a scan allowance between $0.10 and $5.")
    if not RUN_LOCK.acquire(blocking=False):
        raise ValueError("A scan is already running. Wait for it to finish.")
    batch = datetime.now(timezone.utc).strftime("scan-%Y%m%d-%H%M%S-") + uuid.uuid4().hex[:6]
    JOBS[batch] = {"id": batch, "status": "running", "message": "Preparing research…"}
    def worker():
        try:
            collect(token, domains, DATA / "runs" / batch, DATA / "budget.json", allowance,
                    bool(data.get("render_js", True)), lambda msg: JOBS[batch].update(message=msg),
                    retry_source=source)
            saved = normalize(DATA / "runs" / batch)
            missing = sum(c["scan_status"] != "Complete" for c in saved["companies"])
            JOBS[batch].update(status="done", message=f"Research saved. {missing} website scans still need review." if missing else "Research saved. Your company table is ready.")
        except Exception as error:
            JOBS[batch].update(status="error", message=str(error).replace(token, "[redacted]"))
        finally:
            RUN_LOCK.release()
    threading.Thread(target=worker, daemon=True).start()
    return {"id": batch}


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass

    def send(self, body, content_type="application/json", status=200, filename=None):
        if isinstance(body, (dict, list)):
            body = json.dumps(body, ensure_ascii=False).encode()
        if isinstance(body, str):
            body = body.encode()
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Content-Security-Policy", "default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'")
        if filename:
            self.send_header("Content-Disposition", f'attachment; filename="{filename}"')
        self.end_headers()
        self.wfile.write(body)

    def host_ok(self):
        return self.headers.get("Host") in {f"127.0.0.1:{self.server.server_port}", f"localhost:{self.server.server_port}"}

    def do_GET(self):
        if not self.host_ok():
            return self.send({"error": "Invalid host"}, status=403)
        url = urlsplit(self.path)
        if url.path == "/api/bootstrap":
            return self.send({"csrf": TOKEN, "runs": runs(), "budget": budget_status(DATA / "budget.json"), "has_token": bool(os.environ.get("APIFY_TOKEN"))})
        if url.path == "/api/job":
            job_id = parse_qs(url.query).get("id", [""])[0]
            return self.send(JOBS.get(job_id, {"status": "error", "message": "Job not in this session. Check saved scans and Apify run links."}))
        files = {"/": "index.html", "/app.js": "app.js", "/style.css": "style.css", "/engine.js": "engine.js", "/xlsx.js": "xlsx.js"}
        if url.path in files:
            p = ROOT / "static" / files[url.path]
            return self.send(p.read_bytes(), mimetypes.guess_type(p.name)[0] or "text/plain")
        return self.send({"error": "Not found"}, status=404)

    def do_POST(self):
        if not self.host_ok() or self.headers.get("X-Session-Token") != TOKEN:
            return self.send({"error": "Reload the dashboard to reconnect."}, status=403)
        origin = self.headers.get("Origin")
        if origin and origin not in {f"http://127.0.0.1:{self.server.server_port}", f"http://localhost:{self.server.server_port}"}:
            return self.send({"error": "Invalid origin"}, status=403)
        try:
            length = int(self.headers.get("Content-Length", 0))
            if not 0 < length <= 200000:
                raise ValueError("Input is empty or too large.")
            data = json.loads(self.rfile.read(length))
            if not isinstance(data, dict):
                raise ValueError("Expected a request object.")
            if self.path == "/api/scan":
                return self.send(start_job(data))
            if self.path == "/api/view":
                report, chosen, table = view(data)
                return self.send({"report": report, "selected_domains": [c["domain"] for c in chosen], "table": table, "catalog": catalog(report)})
            if self.path == "/api/export":
                report, chosen, table = view(data, raw=True)
                kind = data.get("format", "xlsx")
                if kind == "json":
                    return self.send({**report, "companies": chosen, "applied_filters": validated_filters(data)}, filename="company-research.json")
                if kind == "csv":
                    return self.send(csv_bytes(table), "text/csv; charset=utf-8", filename="companies.csv")
                if kind != "xlsx":
                    raise ValueError("Unknown export format.")
                if not chosen:
                    raise ValueError("No companies match these filters. Clear a filter before exporting.")
                digest = hashlib.sha256(json.dumps(validated_filters(data), sort_keys=True).encode()).hexdigest()[:8]
                output = ROOT / "outputs" / report["id"] / f"companies-{digest}.xlsx"
                with EXPORT_LOCK:
                    write_excel(table, output)
                    content = output.read_bytes()
                return self.send(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename="companies.xlsx")
            return self.send({"error": "Not found"}, status=404)
        except (ValueError, TypeError, RuntimeError, OSError, KeyError) as error:
            return self.send({"error": str(error)[:1000]}, status=400)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8917)
    args = parser.parse_args()
    server = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
    print(f"Website Technology Intelligence: http://127.0.0.1:{args.port}", flush=True)
    print("Press Ctrl+C to stop. Saved research remains in data/runs.", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
