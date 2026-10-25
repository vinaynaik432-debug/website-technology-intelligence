"""Normalize provider records without turning missing research into negative evidence."""
from __future__ import annotations

import csv
import io
import ipaddress
import json
import re
from pathlib import Path
from urllib.parse import urlsplit

UNKNOWN = "Unknown"
SUCCESS = {"ok", "no_technologies_detected"}


def domain_name(value):
    raw = str(value or "").strip()
    if not raw or any(c.isspace() for c in raw):
        raise ValueError("Use a domain such as n26.com, not a company name or search phrase.")
    parsed = urlsplit(raw if "://" in raw else "https://" + raw)
    if parsed.scheme not in {"http", "https"} or parsed.username or parsed.password:
        raise ValueError("Enter an ordinary public website domain or URL.")
    if parsed.port not in {None, 80, 443}:
        raise ValueError("Custom ports are not supported.")
    host = (parsed.hostname or "").rstrip(".").lower().encode("idna").decode("ascii")
    if host.startswith("www."):
        host = host[4:]
    try:
        ipaddress.ip_address(host)
    except ValueError:
        pass
    else:
        raise ValueError("Use a public company domain, not an IP address.")
    if len(host) > 253 or "." not in host or host.endswith((".local", ".localhost", ".internal", ".test", ".invalid")):
        raise ValueError("Use a public company domain.")
    if not all(re.fullmatch(r"[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?", label) for label in host.split(".")):
        raise ValueError("Invalid domain name.")
    return host


def maybe_domain(value):
    try:
        return domain_name(value)
    except (ValueError, UnicodeError):
        return None


def parse_domains(text):
    text = text.lstrip("\ufeff").strip()
    if not text:
        raise ValueError("Enter at least one domain.")
    # CSV headers may include metadata; only the selected domain column is consumed.
    try:
        dialect = csv.Sniffer().sniff(text[:4096], delimiters=",;\t")
    except csv.Error:
        dialect = csv.excel
    rows = list(csv.reader(io.StringIO(text), dialect))
    headers = [h.strip().lower() for h in rows[0]]
    recognized = next((i for i, h in enumerate(headers) if h in {"domain", "website", "url", "company domain"}), None)
    values = [r[recognized] for r in rows[1:] if len(r) > recognized] if recognized is not None else [v for r in rows for v in r]
    result = list(dict.fromkeys(domain_name(v) for v in values if v.strip()))
    if not result:
        raise ValueError("No domains found in the input.")
    if len(result) > 100:
        raise ValueError("Use at most 100 unique domains per scan.")
    return result


def as_text(value):
    if value is None or value == "" or value == [] or value == {}:
        return UNKNOWN
    if isinstance(value, (list, dict)):
        return json.dumps(value, ensure_ascii=False)
    return value


def joined(values):
    return "; ".join(dict.fromkeys(str(v) for v in values if v is not None and v != "")) or UNKNOWN


def technology_rows(records):
    result = []
    for row in records:
        if "technologies" in row:
            for tool in row.get("technologies") or []:
                result.append({**{k: v for k, v in row.items() if k not in {"technologies", "byCategory", "dnsServices"}}, **tool})
        elif row.get("technology"):
            result.append(row)
    return result


def normalize(directory):
    directory = Path(directory)
    manifest = json.loads((directory / "manifest.json").read_text())
    tech_raw = json.loads((directory / "technology.json").read_text()) if (directory / "technology.json").exists() else []
    firm_raw = json.loads((directory / "firmographics.json").read_text()) if (directory / "firmographics.json").exists() else []
    detections = technology_rows(tech_raw)
    companies = []
    for domain in manifest["domains"]:
        scans = [r for r in tech_raw if maybe_domain(r.get("url") or r.get("domain")) == domain]
        candidates = [r for r in firm_raw if maybe_domain(r.get("input")) == domain]
        if not candidates:
            candidates = [r for r in firm_raw if maybe_domain(r.get("website")) == domain]
        firm = candidates[0] if len(candidates) == 1 else {}
        tools = []
        seen = set()
        for t in detections:
            if maybe_domain(t.get("url") or t.get("domain")) != domain:
                continue
            identity = (t.get("technology") or t.get("name"), t.get("foundIn"), str(t.get("detectedBy")))
            if identity in seen:
                continue
            seen.add(identity)
            cats = [c.get("name", "Uncategorized") if isinstance(c, dict) else str(c) for c in t.get("categories", [])]
            tools.append({"name": str(t.get("technology") or t.get("name")), "categories": cats or ["Uncategorized"],
                          "confidence": t.get("confidence"), "location": t.get("foundIn", "unknown"),
                          "version": t.get("version"), "detected_by": t.get("detectedBy", []),
                          "evidence": t.get("evidence"), "provider": t.get("provider", "Apify technology Actor"), "implied_by": t.get("impliedBy", []),
                          "url": t.get("finalUrl") or t.get("url"), "checked_at": t.get("checkedAt") or manifest["created_at"]})
        states = {r.get("status", "unknown") for r in scans}
        default_run_status = manifest.get("runs", {}).get("technology", {}).get("status")
        run_ok = bool(scans) and all(r.get("_run_status", default_run_status) == "SUCCEEDED" for r in scans)
        status = "Complete" if scans and states <= SUCCESS and run_ok else ("Partial" if tools else "Unknown")
        offices = firm.get("offices") or []
        notes = []
        for r in scans:
            if r.get("error"):
                notes.append(str(r["error"]))
        if not scans:
            notes.append("No technology result returned; not evidence of an empty stack.")
        if not firm:
            notes.append("No unique company profile returned.")
        linked_domain = maybe_domain(firm.get("website"))
        match = "Matched by provider"
        if linked_domain and linked_domain != domain:
            match = "Review website difference"
            notes.append("Company profile links to " + linked_domain + "; review brand/group scope.")
        if not firm:
            match = UNKNOWN
        facts = {
            "Company": firm.get("name") or domain,
            "Domain": domain,
            "Industry": as_text(firm.get("industry")),
            "Company type": as_text(firm.get("companyType")),
            "Founded year": as_text(firm.get("foundedYear")),
            "Founders": as_text(firm.get("founders")),
            "Employee size band": as_text(firm.get("companySize")),
            "Employees on LinkedIn": as_text(firm.get("employeeCount")),
            "Employee range minimum": as_text(firm.get("employeeCountMin")),
            "Employee range maximum": as_text(firm.get("employeeCountMax")),
            "Headquarters": as_text(firm.get("headquarters")),
            "HQ city": as_text(firm.get("headquartersCity")),
            "HQ region": as_text(firm.get("headquartersRegion")),
            "HQ country": as_text(firm.get("headquartersCountryName") or firm.get("headquartersCountry")),
            "HQ street": as_text(firm.get("headquartersStreet")),
            "HQ postal code": as_text(firm.get("headquartersPostalCode")),
            "Office countries (reported)": joined(o.get("countryName") or o.get("country") for o in offices),
            "Office cities (reported)": joined(o.get("city") for o in offices),
            "Office addresses (reported)": joined(firm.get("locations") or []),
            "Description": as_text(firm.get("description")),
            "Specialties": joined(firm.get("specialties") or []),
            "Total funding (USD)": as_text(firm.get("totalFundingUsd")),
            "Last funding round": as_text(firm.get("lastFundingRound")),
            "Last funding date": as_text(firm.get("lastFundingDate")),
            "Company website from profile": as_text(firm.get("website")),
            "Company profile source": as_text(firm.get("linkedinUrl")),
            "Funding source": as_text(firm.get("fundingSource")),
            "Company match": match,
            "Company data checked (UTC)": firm.get("scrapedAt") or UNKNOWN,
            "Website scan": status,
            "Website checked (UTC)": next((r.get("checkedAt") for r in scans if r.get("checkedAt")), manifest["created_at"]),
            "Scan notes": joined(notes),
        }
        companies.append({"domain": domain, "facts": facts, "technologies": tools,
                          "raw_company": candidates, "raw_technology": scans,
                          "scan_status": status})
    return {"id": manifest["id"], "mode": manifest.get("mode", "live"), "created_at": manifest["created_at"],
            "manifest": manifest, "companies": companies}


def catalog(report):
    tools = {}
    for company in report["companies"]:
        for t in company["technologies"]:
            tools.setdefault(t["name"], set()).update(t["categories"])
    return [{"name": name, "categories": sorted(cats)} for name, cats in sorted(tools.items(), key=lambda x: x[0].lower())]


def detection_state(company, name=None, category=None, scope="all", confidence=50):
    matches = [t for t in company["technologies"] if (name is None or t["name"] == name)
               and (category is None or category in t["categories"])
               and (scope == "all" or t["location"] == scope)]
    if any(isinstance(t["confidence"], (int, float)) and t["confidence"] >= confidence for t in matches):
        return "Yes"
    if matches or company["scan_status"] != "Complete":
        return UNKNOWN
    return "No"


def select_companies(report, query="", tools=(), categories=(), states=("Yes",), country="", industry="",
                     min_employees=None, max_employees=None, scope="all", confidence=50, tool_match="all", **_):
    selected = []
    for c in report["companies"]:
        f = c["facts"]
        if query and query.casefold() not in (str(f["Company"]) + " " + c["domain"]).casefold():
            continue
        if country and f["HQ country"] != country:
            continue
        if industry and f["Industry"] != industry:
            continue
        size = f["Employees on LinkedIn"]
        if min_employees is not None and (not isinstance(size, (int, float)) or size < min_employees):
            continue
        if max_employees is not None and (not isinstance(size, (int, float)) or size > max_employees):
            continue
        if tools:
            checks = [detection_state(c, name=t, scope=scope, confidence=confidence) in states for t in tools]
            if not (any(checks) if tool_match == "any" else all(checks)):
                continue
        if any(detection_state(c, category=t, scope=scope, confidence=confidence) not in states for t in categories):
            continue
        selected.append(c)
    return selected


def matrix(report, companies=None, scope="all", confidence=50, raw=False):
    companies = report["companies"] if companies is None else companies
    all_tools = catalog(report)
    categories = sorted({cat for t in all_tools for cat in t["categories"]})
    headers = list(report["companies"][0]["facts"]) if report["companies"] else []
    headers += ["Evidence scope", "Minimum detection confidence", "Technology run source", "Firmographics run source"]
    metadata_count = len(headers)
    headers += ["Category | " + cat for cat in categories]
    tool_headers = ["Tool | " + ", ".join(t["categories"]) + " | " + t["name"] for t in all_tools]
    headers += tool_headers
    rows = []
    for c in companies:
        runs = report["manifest"].get("runs", {})
        technology_source = joined(r.get("_run_source") for r in c["raw_technology"])
        if technology_source == UNKNOWN:
            technology_source = runs.get("technology", {}).get("url", UNKNOWN)
        row = list(c["facts"].values()) + [scope, confidence, technology_source, runs.get("firmographics", {}).get("url", UNKNOWN)]
        labels = {"Yes": "Detected", "No": "Not detected", "Unknown": "Unknown"}
        row += [labels[detection_state(c, category=cat, scope=scope, confidence=confidence)] for cat in categories]
        row += [labels[detection_state(c, name=t["name"], scope=scope, confidence=confidence)] for t in all_tools]
        rows.append(row)
    if raw:
        # Preserve every provider field on the same company row, even beyond Excel's per-cell limit.
        for label, key in [("Full company source JSON", "raw_company"), ("Full technology source JSON", "raw_technology")]:
            values = [json.dumps(c[key], ensure_ascii=False, separators=(",", ":")) for c in companies]
            count = max([1] + [(len(v) + 11999) // 12000 for v in values])
            for chunk in range(count):
                headers.append(f"{label} {chunk + 1}")
                for row, value in zip(rows, values):
                    row.append(value[chunk * 12000:(chunk + 1) * 12000])
    return {"headers": headers, "rows": rows, "metadata_count": metadata_count,
            "state_count": len(categories) + len(all_tools), "created_at": report["created_at"],
            "mode": report["mode"], "scope": scope, "confidence": confidence}
