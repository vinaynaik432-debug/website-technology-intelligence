"""Bounded Apify runs. Reserve cost before POST; never retry a run-start request."""
from __future__ import annotations

import json
import math
import re
import threading
import time
from contextlib import contextmanager
from email.utils import parsedate_to_datetime
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import HTTPRedirectHandler, Request, build_opener

ACTORS = {
    "technology": {"id": "postatelier~website-tech-stack", "build": "0.1.9"},
    "firmographics": {"id": "deepmine~company-data-enrichment", "build": "0.4.15"},
}
TERMINAL = {"SUCCEEDED", "FAILED", "TIMED-OUT", "ABORTED"}
LOCK = threading.Lock()


@contextmanager
def ledger_lock(path):
    """Serialize budget reservations across dashboard processes on macOS/Linux."""
    import fcntl
    lock_path = Path(path).with_suffix(".lock")
    lock_path.parent.mkdir(parents=True, exist_ok=True)
    with LOCK, lock_path.open("a") as handle:
        fcntl.flock(handle, fcntl.LOCK_EX)
        try:
            yield
        finally:
            fcntl.flock(handle, fcntl.LOCK_UN)


def now():
    return datetime.now(timezone.utc).isoformat()


def save_json(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")
    tmp.replace(path)


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


class Apify:
    def __init__(self, token):
        if not token or not token.strip():
            raise ValueError("Enter your Apify API token to run live research.")
        self.token = token.strip()
        self.opener = build_opener(NoRedirect)

    def request(self, path, method="GET", body=None, query=None):
        if not re.fullmatch(r"/[A-Za-z0-9_~./-]+", path):
            raise ValueError("Invalid API path")
        url = "https://api.apify.com/v2" + path
        if query:
            url += "?" + urlencode(query)
        headers = {"Authorization": "Bearer " + self.token, "Accept": "application/json"}
        payload = None
        if body is not None:
            payload = json.dumps(body).encode()
            headers["Content-Type"] = "application/json"
        for attempt in range(3 if method == "GET" else 1):
            try:
                with self.opener.open(Request(url, data=payload, headers=headers, method=method), timeout=40) as response:
                    return json.load(response)
            except HTTPError as error:
                # Never include headers, API response bodies or credentials in errors.
                if method == "GET" and error.code in {429, 500, 502, 503, 504} and attempt < 2:
                    retry = error.headers.get("Retry-After", "") if error.headers else ""
                    try:
                        delay = float(retry) if retry.isdigit() else (parsedate_to_datetime(retry) - datetime.now(timezone.utc)).total_seconds()
                    except (ValueError, TypeError, OverflowError):
                        delay = 2 * (attempt + 1)
                    if delay > 60:
                        raise RuntimeError("Apify requested a longer pause. Wait before trying again; existing run IDs are saved.") from None
                    time.sleep(max(0, delay))
                    continue
                raise RuntimeError(f"Apify returned HTTP {error.code}. Check your account or Actor run in Apify.") from None
            except (URLError, TimeoutError, OSError):
                if method == "GET" and attempt < 2:
                    time.sleep(2)
                    continue
                raise RuntimeError("Apify request did not complete. Run-start requests are not retried; check Apify before another scan.") from None

    def dataset(self, dataset_id):
        rows, offset = [], 0
        while True:
            batch = self.request(f"/datasets/{dataset_id}/items", query={"format": "json", "clean": "false", "offset": offset, "limit": 1000})
            if not isinstance(batch, list):
                raise RuntimeError("Unexpected dataset response")
            rows.extend(batch)
            if len(batch) < 1000:
                return rows
            offset += len(batch)


def budget_status(path):
    path = Path(path)
    if not path.exists():
        return {"limit_usd": 5.0, "reserved_usd": 0.0, "reported_cost_usd": 0.0, "reservations": []}
    return json.loads(path.read_text())


def reserve(path, batch_id, amount):
    with ledger_lock(path):
        budget = budget_status(path)
        if not math.isfinite(amount) or amount <= 0 or amount > 5:
            raise ValueError("Run allowance must be between $0.01 and $5.")
        if budget["reserved_usd"] + amount > budget["limit_usd"] + 1e-8:
            raise ValueError("The project's $5 test allowance is fully reserved. Saved results remain available without spending.")
        budget["reserved_usd"] = round(budget["reserved_usd"] + amount, 6)
        budget["reservations"].append({"batch_id": batch_id, "cap_usd": amount, "created_at": now()})
        save_json(path, budget)


def update_cost(path, batch_id, cost):
    with ledger_lock(path):
        budget = budget_status(path)
        for item in budget["reservations"]:
            if item["batch_id"] == batch_id:
                item["reported_cost_usd"] = cost
        budget["reported_cost_usd"] = round(sum(x.get("reported_cost_usd", 0) for x in budget["reservations"]), 6)
        save_json(path, budget)


def inputs(domains, render_js=True):
    return {
        "technology": {"urls": ["https://" + d for d in domains], "renderJs": render_js,
                       "checkDns": True, "outputFormat": "technologies", "categories": [],
                       "minConfidence": 0, "monitorChanges": False, "maxConcurrency": 1, "timeoutSecs": 60},
        "firmographics": {"companies": domains, "includeFunding": True, "includeContacts": False,
                          "includeRecentJobs": False, "maxPostsPerCompany": 0, "maxCompanies": len(domains)},
    }


def run_timeout(kind, domain_count):
    # Websites are processed serially, with a 60-second per-site timeout.
    return max(300, domain_count * 75 + 60) if kind == "technology" else 300


def collect(token, domains, directory, budget_path, allowance=1.0, render_js=True, progress=lambda _: None, retry_source=None):
    directory = Path(directory)
    directory.mkdir(parents=True, exist_ok=False)
    batch_id = directory.name
    api = Apify(token)
    payloads = inputs(domains, render_js)
    active_actors = {"technology": ACTORS["technology"]} if retry_source else ACTORS
    per_actor = math.floor(allowance / len(active_actors) * 1000000) / 1000000
    if retry_source:
        payloads["technology"]["urls"] = ["https://www." + d for d in domains]
    manifest = {"id": batch_id, "created_at": now(), "domains": domains, "mode": "live",
                "allowance_usd": allowance, "render_js": render_js, "runs": {}, "status": "Preparing"}
    save_json(directory / "manifest.json", manifest)
    for kind, cfg in active_actors.items():
        meta = api.request("/acts/" + cfg["id"])["data"]
        prices = [p for p in meta.get("pricingInfos", []) if p.get("startedAt", "") <= now()]
        price = sorted(prices, key=lambda p: p.get("startedAt", ""))[-1] if prices else {}
        if price.get("pricingModel") != "PAY_PER_EVENT" or (price.get("minimalMaxTotalChargeUsd") or 0) > per_actor:
            raise RuntimeError("Actor pricing changed or exceeds this allowance. Review pricing before running.")
        manifest["runs"][kind] = {"actor": cfg["id"], "build": cfg["build"], "cap_usd": per_actor,
                                   "input": payloads[kind], "pricing": price, "status": "Not started"}
    if retry_source:
        previous = json.loads((Path(retry_source) / "manifest.json").read_text())
        manifest["retry_of"] = previous["id"]
        manifest["domains"] = previous["domains"]
        manifest["retry_domains"] = domains
        manifest["prior_runs"] = previous.get("runs", {})
    reserve(budget_path, batch_id, allowance)
    try:
        for kind, cfg in active_actors.items():
            entry = manifest["runs"][kind]
            entry["status"] = "Start outcome unknown"
            save_json(directory / "manifest.json", manifest)
            progress(f"Starting {kind} research…")
            run = api.request("/acts/" + cfg["id"] + "/runs", method="POST", body=payloads[kind],
                              query={"build": cfg["build"], "timeout": run_timeout(kind, len(domains)), "memory": 1024,
                                     "maxTotalChargeUsd": per_actor, "restartOnError": "false"})["data"]
            entry.update({"id": run["id"], "status": run["status"], "url": "https://console.apify.com/actors/runs/" + run["id"]})
            entry.update({k: run[k] for k in ("defaultDatasetId", "defaultKeyValueStoreId", "usageTotalUsd", "chargedEventCounts", "pricingInfo", "finishedAt") if k in run})
            save_json(directory / "manifest.json", manifest)
            effective = run.get("options", {}).get("maxTotalChargeUsd")
            if (not isinstance(effective, (int, float)) or isinstance(effective, bool)
                    or not math.isfinite(effective) or effective < 0 or effective > per_actor + 1e-8):
                api.request("/actor-runs/" + run["id"] + "/abort", method="POST")
                raise RuntimeError("Apify did not acknowledge the spending cap; the run was asked to stop.")
        deadline = time.monotonic() + max(run_timeout(kind, len(domains)) for kind in active_actors) + 120
        while any(e["status"] not in TERMINAL for e in manifest["runs"].values()):
            if time.monotonic() >= deadline:
                raise RuntimeError("Monitoring timed out. Check the saved Apify run links before starting another scan.")
            for kind, entry in manifest["runs"].items():
                if entry["status"] in TERMINAL:
                    continue
                run = api.request("/actor-runs/" + entry["id"])["data"]
                entry.update({k: run[k] for k in ("status", "defaultDatasetId", "defaultKeyValueStoreId", "usageTotalUsd", "chargedEventCounts", "pricingInfo", "finishedAt") if k in run})
                progress(f"{kind.title()}: {run['status'].lower().replace('-', ' ')}")
            save_json(directory / "manifest.json", manifest)
            if any(e["status"] not in TERMINAL for e in manifest["runs"].values()):
                time.sleep(3)
        for kind, entry in manifest["runs"].items():
            rows = api.dataset(entry["defaultDatasetId"]) if entry.get("defaultDatasetId") else []
            if kind == "technology":
                rows = [{**r, "_run_status": entry["status"], "_run_source": entry.get("url")} for r in rows]
            save_json(directory / f"{kind}.json", rows)
            summary_key = "SUMMARY" if kind == "technology" else "OUTPUT"
            if entry.get("defaultKeyValueStoreId"):
                try:
                    summary = api.request(f"/key-value-stores/{entry['defaultKeyValueStoreId']}/records/{summary_key}")
                    save_json(directory / f"{kind}-summary.json", summary)
                except RuntimeError:
                    entry["summary_available"] = False
            entry["records"] = len(rows)
        if retry_source:
            from .model import maybe_domain
            old = Path(retry_source)
            old_tech = json.loads((old / "technology.json").read_text()) if (old / "technology.json").exists() else []
            old_run = previous.get("runs", {}).get("technology", {})
            old_tech = [{**r, "_run_status": r.get("_run_status", old_run.get("status")), "_run_source": r.get("_run_source", old_run.get("url"))} for r in old_tech]
            new_tech = json.loads((directory / "technology.json").read_text())
            # Retry results replace only the requested companies; previous snapshots stay untouched.
            retained = [r for r in old_tech if maybe_domain(r.get("url") or r.get("domain")) not in domains]
            save_json(directory / "technology.json", retained + new_tech)
            firm = json.loads((old / "firmographics.json").read_text()) if (old / "firmographics.json").exists() else []
            save_json(directory / "firmographics.json", firm)
            manifest["runs"]["firmographics"] = {**previous.get("runs", {}).get("firmographics", {}), "reused": True, "usageTotalUsd": 0}
        from .model import maybe_domain
        from .recovery import dns_fallback
        rows = json.loads((directory / "technology.json").read_text())
        failures = {maybe_domain(r.get("url") or r.get("domain")) for r in rows if r.get("status") == "error"}
        dns_records = []
        for domain in domains:
            if domain in failures:
                progress(f"Website unavailable for {domain}; checking independent DNS signals…")
                evidence = dns_fallback(domain)
                dns_records.append(evidence)
                rows.extend([{**r, "_run_status": "SUCCEEDED", "_run_source": "https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/"} for r in evidence["observations"]])
        save_json(directory / "technology.json", rows)
        if dns_records:
            save_json(directory / "dns-fallback.json", dns_records)
        manifest["status"] = "Complete" if not failures and all(e.get("status") == "SUCCEEDED" for e in manifest["runs"].values()) else "Partial"
    except Exception as error:
        manifest["status"] = "Needs attention"
        manifest["error"] = str(error).replace(token, "[redacted]")
        # Preserve run IDs and reserved budget even if a network failure hides the result.
        raise
    finally:
        manifest["reported_cost_usd"] = round(sum(e.get("usageTotalUsd", 0) for e in manifest["runs"].values()), 6)
        save_json(directory / "manifest.json", manifest)
        update_cost(budget_path, batch_id, manifest["reported_cost_usd"])
    return manifest
