"""Explicit, bounded recovery and independent public DNS observations."""
import json
import re
from datetime import datetime, timezone
from urllib.parse import urlencode
from urllib.request import Request, build_opener, HTTPRedirectHandler
from .model import normalize, domain_name

COOLDOWN_SECONDS = 300


def retry_plan(directory, now=None):
    report = normalize(directory)
    if report['mode'] == 'synthetic':
        raise ValueError('Sample companies cannot be scanned. Enter real company domains for live research.')
    stamp = datetime.fromisoformat(report['created_at'].replace('Z', '+00:00'))
    now = now or datetime.now(timezone.utc)
    remaining = COOLDOWN_SECONDS - (now - stamp).total_seconds()
    if remaining > 0:
        raise ValueError(f'Wait {int(remaining) + 1} seconds before retrying this batch. Repeated requests can prolong rate limits.')
    failed = [c['domain'] for c in report['companies'] if c['scan_status'] != 'Complete']
    if not failed:
        raise ValueError('There are no incomplete website scans in this batch.')
    return failed


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args):
        return None


def dns_fallback(domain, lookup=None):
    """Read TXT/MX without contacting the website. A small, explicit positive-only ruleset.

    Anthropic marker documented at support.claude.com/en/articles/13132885.
    MX host suffixes identify routing providers, not every product in their suites.
    Missing signatures NEVER establish absence. Verification payloads are redacted.
    """
    domain = domain_name(domain)
    stamp = datetime.now(timezone.utc).isoformat()
    opener = build_opener(NoRedirect)
    def resolve(kind):
        url = 'https://cloudflare-dns.com/dns-query?' + urlencode({'name': domain, 'type': kind})
        req = Request(url, headers={'Accept': 'application/dns-json', 'User-Agent': 'WebsiteTechnologyIntelligence/1.0'})
        with opener.open(req, timeout=10) as response:
            return json.load(response)
    resolve = lookup or resolve
    rows, notes = [], []
    for kind, code in [('TXT', 16), ('MX', 15)]:
        try:
            answer = resolve(kind)
            if answer.get('Status') != 0:
                notes.append(f'{kind}: DNS lookup did not return a successful response.')
                continue
            matches = {}
            for record in answer.get('Answer', []):
                if record.get('type') != code:
                    continue
                value = str(record.get('data', ''))
                if kind == 'TXT':
                    value = ''.join(re.findall(r'"([^"]*)"', value)) or value
                    if value.startswith('anthropic-domain-verification-'):
                        matches['Anthropic'] = ('Artificial Intelligence', 'TXT prefix: anthropic-domain-verification- [verification value redacted]')
                else:
                    host = value.split()[-1].lower().rstrip('.') if value.split() else ''
                    if host.endswith(('.google.com', '.googlemail.com')) or host == 'smtp.google.com':
                        matches['Google Workspace'] = ('Email', 'MX mail route: ' + host)
                    elif host.endswith('.mail.protection.outlook.com'):
                        matches['Microsoft 365'] = ('Email', 'MX mail route: ' + host)
            for name, (category, evidence) in matches.items():
                rows.append({'url': 'https://' + domain, 'domain': domain, 'technology': name,
                             'categories': [category], 'status': 'ok', 'confidence': 100, 'foundIn': 'dns',
                             'detectedBy': ['dns:' + kind], 'checkedAt': stamp, 'evidence': evidence,
                             'provider': 'Independent DNS lookup via Cloudflare', 'impliedBy': []})
            notes.append(f'{kind}: lookup succeeded; only supported positive signatures are classified.')
        except Exception:
            notes.append(f'{kind}: DNS lookup unavailable; no inference made.')
    return {'domain': domain, 'checked_at': stamp, 'observations': rows, 'notes': notes,
            'coverage': 'Limited positive-only fallback; does not establish absence or active use.'}
