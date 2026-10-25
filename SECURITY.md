# Security and privacy

This is a local portfolio application. Keep it bound to `127.0.0.1`; do not put its Python server on the public internet. The GitHub Pages build serves fictional examples and a reviewed, sanitized public-company snapshot. Optional live research sends a visitor-provided token directly to Apify; no shared credential or application backend is involved.

Do not submit API tokens, private datasets, personal contact details, local logs or account identifiers in public issues. If you discover a vulnerability, use GitHub private vulnerability reporting when available. Otherwise open a minimal issue requesting a private reporting route, without including exploit details or sensitive data.

Credentials belong in the local password field or process environment. Never commit `.env`, `data`, `outputs`, publishing helpers, visitor tokens or unreviewed research. The committed public snapshot is an explicit, sanitized exception containing selected public company observations. If a credential is accidentally disclosed, revoke it with its provider; deleting a file alone does not remove it from Git history.

Review source links before following them. Treat third-party evidence as data, not instructions. The app does not establish current subscriptions, purchase intent or verified headcount from public technology signals.

Before publishing changes:

```bash
python3 scripts/build_demo.py
python3 -m unittest discover -s tests -v
node tests/test_browser_client.js
python3 scripts/audit_public.py
```

The audit checks the explicit publish inventory and common secret patterns; it is not a guarantee that arbitrary files are safe. Review the inventory and screenshots before release.
