# StackSignal — Website Technology Intelligence

**Turn company domains into a sourced GTM research shortlist.**

StackSignal combines public technology observations with company profiles, lets you filter for combinations such as **HubSpot AND Figma**, and exports a company-level Excel workbook. It treats uncertain evidence as uncertain: a vendor's DNS marker is a research signal, not proof of an active subscription.

**[Open the interactive demo](https://vinaynaik432-debug.github.io/website-technology-intelligence/)** · [Source code](https://github.com/vinaynaik432-debug/website-technology-intelligence)

![StackSignal dashboard with HubSpot and Figma selected](docs/assets/dashboard.png)

> The public demo uses eight fictional companies and synthetic observations. It does not make claims about real companies or run paid scans. Run the Python app locally to research real domains with your own Apify account.

## The GTM problem

A list of companies is only a starting point. A useful research workflow should answer:

- Which companies fit the location, industry and size criteria?
- Which show signals of relevant tools or categories?
- Do they match **all** required tools, or **any** of several alternatives?
- How was each signal found, and what still needs verification?
- Can the shortlist be handed to another person in a usable spreadsheet?

For example, someone exploring an integration between a CRM and a design workflow could start with companies showing both HubSpot and Figma signals. That combination can justify further research; it does **not** establish a workflow problem, purchase intent or an opportunity to replace either product.

## Try it in 60 seconds

1. Open the public demo and click **Try HubSpot + Figma**.
2. The default **All selected (AND)** filter returns **Acme Studio** and **Rivet Cloud**, two fictional companies.
3. Switch to **Any selected (OR)** to see five companies with at least one of those signals.
4. Switch back to AND. Under **More filters & columns**, set minimum LinkedIn employees to `100`: only Rivet Cloud remains.
5. Open a company to see its evidence and a rule-based shortlist rationale.
6. Choose **Export Excel** to download the filtered companies. The workbook retains every tool column in the batch.

A blocked fictional company and a weak Figma observation demonstrate why **Unknown** must remain different from **Not detected**.

## Features

| Capability | Public Pages demo | Local Python app |
| --- | --- | --- |
| Search company name/domain | Yes | Yes |
| Add multiple tools and choose AND/OR | Yes | Yes |
| Filter category, country, industry and employee count | Yes | Yes |
| Separate website observations from DNS signals | Yes | Yes |
| Inspect detection method, score and available evidence | Synthetic examples | Returned provider evidence |
| Explain shortlist matches and suggested verification | Yes, explicit rules | Yes, explicit rules |
| Export filtered `.xlsx` or JSON | Yes | Yes |
| Enter domains / upload CSV or TXT | No live scanning | Yes, up to 100 domains per batch |
| Run Apify technology and company enrichment Actors | No | Yes, with your token |
| Browse saved research without another scan | Fixed sample | Yes |
| Retry incomplete websites and collect fallback DNS evidence | Demonstrated only | Yes |

GitHub Pages serves static files and cannot execute the Python backend. This separation makes the public demo usable without exposing credentials or funding visitors' scans.

## Run locally

### Requirements

- Python **3.9+**, macOS or Linux. The budget ledger uses a POSIX file lock; native Windows is not currently supported.
- An Apify account/token for live research. No token is required for the fictional demo or saved local results.
- `openpyxl` for portable Excel export. Node.js is optional, for browser-engine verification only.

```bash
git clone https://github.com/vinaynaik432-debug/website-technology-intelligence.git
cd website-technology-intelligence
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 app.py
```

Open **http://127.0.0.1:8917/**. If that port is occupied:

```bash
python3 app.py --port 8918
```

On macOS, `Start Dashboard.command` starts the app when Python is already configured. For Excel export, activate the virtual environment first or use the commands above.

### Run a scan

1. Enter domains, one per line, or upload CSV/TXT. Supported CSV headers: `domain`, `website`, `url`, `company domain`.
2. Expand **Connection & scan settings** and enter your Apify token. Alternatively, provide `APIFY_TOKEN` through the process environment. The app does not automatically load `.env` files.
3. Set a maximum scan charge and click **Research domains**.
4. Choose a saved result, add target technologies, and filter the company list.
5. Inspect each company's evidence before using a signal in outreach.
6. Export Excel or JSON.

Inputs are normalized and deduplicated. A URL becomes its domain: `/pricing` or `/careers` paths are not independently scanned. Company-name search does not discover new domains; it searches the loaded results.

## Filter semantics

Select one technology at a time from **Add a technology**. Selected technologies appear as removable chips.

- **All selected (AND):** each selected technology must have the chosen signal status.
- **Any selected (OR):** at least one selected technology must have that status.
- Country, industry, company search, category and employee conditions always combine with AND.
- **Detected** is the default signal status. Selecting **Unknown** can create a queue for additional research.
- **Website observations** excludes DNS-only signals; **DNS signals** excludes website observations.
- The minimum match score applies to both the table and export.
- Size filters use **LinkedIn-associated employee profiles**, not independently verified headcount. Missing counts do not satisfy numeric filters.
- The tool selector contains tools observed somewhere in the loaded batch, not the provider's entire technology dictionary.

## Read the evidence correctly

| Displayed state | Exact meaning |
| --- | --- |
| **Detected** | At least one matching observation meets the selected score threshold and evidence scope. |
| **Not detected** | No matching observation was returned in a completed scan within that scope. This is not verified absence. |
| **Unknown** | The scan is missing/incomplete, or a matching observation exists below the threshold. |

The internal filtering API retains `Yes`, `No` and `Unknown` for compatibility; the interface and Excel export use the clearer labels above.

**Website evidence** may include script URLs, cookies, HTML, headers or browser runtime observations. **DNS evidence** may indicate mail routing or that the company verified its domain with a service. Verification records can remain after a subscription ends.

The scanner's **0–100 score describes fingerprint matching**, not a calibrated probability of active use, commercial fit or buying intent. A score of 100 does not prove that employees use a specific product or that the company excludes competing products.

Each company detail shows the method, collection time and original matching snippet **when supplied**. If the provider omits the snippet, the app says so. An observation without its underlying snippet has not been independently verified by this project.

## Company data and completeness

The current enrichment Actor matches a domain to company profiles and returns available fields including industry, founding year, employee range, LinkedIn-associated employee count, headquarters, offices and funding.

- **Founders remain Unknown:** the selected provider does not currently supply them. Founder research needs a separate verified source; this version does not invent names or infer them from executive titles.
- Offices reflect the provider's reported office cards. They are not a complete list of operating countries or sales markets.
- Missing values remain Unknown. Founding year is not inferred from a copyright date or domain registration.
- A profile linked to a different website is flagged for review; ambiguous multiple matches are not silently selected.
- Company-profile and funding source links are retained when supplied. Source coverage and freshness vary by field.

## Recovering from HTTP 429 and blocked sites

A 429 response means a request was rate limited. The saved status alone cannot establish whether the cause was request frequency, an IP restriction or another protection rule.

The local recovery flow:

1. Keeps missing technology results Unknown instead of declaring that the company has no tools.
2. Exposes **Retry incomplete websites**, with a five-minute minimum pause from the selected batch's creation time.
3. Retries only the incomplete domains, using their `www` address and one concurrent website request. The retry is an explicit action and consumes a new capped reservation.
4. Reuses company profiles and retains successful companies from the original batch in a new snapshot. Original snapshots are not overwritten.
5. Runs a separate public DNS lookup after a website error. The limited fallback recognizes documented Anthropic verification prefixes and Google/Microsoft mail-routing signatures. It reports only positive matches; missing signatures do not prove absence.
6. Redacts DNS verification payloads while retaining the matched prefix, source and time.

The Apify API client also respects `Retry-After` on retryable read requests. If Apify requests more than a minute's pause, it stops with a clear message. The website Actor does not expose the target website's response headers, so the app cannot honor a site-specific `Retry-After` value it never receives.

**Limits:** `www` is an alternative to test, not a guaranteed fix. The selected Actor has no configurable proxy input. This app does not solve CAPTCHAs. DNS fallback is narrower than the main technology scanner and cannot repair a blocked website scan. Recovery behavior is covered by mocked tests; it is not a claim that a particular protected website has been unblocked.

## Excel output

**One Companies sheet, one row per company.** Columns contain:

1. Company information and source/scan details.
2. Export settings, including evidence scope and minimum match score.
3. Technology category columns.
4. Individual tool columns, named `Tool | Category | Tool name`.
5. In local exports, the complete returned company and technology JSON, split into numbered cells to preserve long records.

Both exports have frozen headers/company identifiers and column filters. Local Excel also includes a styled table and detection-state validation. The public demo uses a small dependency-free OOXML writer; it produces real `.xlsx` files in the browser, with literal strings rather than executable formulas.

Exporting uses the active filters but includes all tool columns in the batch. Editing a downloaded workbook does not update the dashboard or trigger research. The JSON export includes the applied filters and selected company records.

## Architecture

```mermaid
flowchart TD
    A[Domains or CSV/TXT] --> B[Normalize and deduplicate]
    B --> C[Reserve capped test budget]
    C --> D[Apify technology Actor]
    C --> E[Apify company enrichment Actor]
    D --> F[Local source snapshots]
    E --> F
    D -->|Website error| G[Limited public DNS fallback]
    G --> F
    F --> H[Normalize company facts and observations]
    H --> I[Evidence-aware AND/OR filters]
    I --> J[Shortlist rationale and company details]
    I --> K[Excel / JSON export]
    L[Fictional fixtures only] --> M[Static Pages build]
    M --> N[Browser filters and local file export]
```

The Python server uses the standard library and binds only to loopback. The frontend is plain HTML, CSS and JavaScript. Browser and Python filter implementations have parity tests. No n8n subscription or frontend build framework is required.

Excel export can optionally use a locally installed Artifact Tool runtime. On a normal installation, `openpyxl` is the portable exporter; no proprietary runtime or Node dependency is required to use the app.

### Providers

| Purpose | Provider | Pinned build |
| --- | --- | --- |
| Main technology detection | [postatelier/website-tech-stack](https://apify.com/postatelier/website-tech-stack) | `0.1.9` |
| Company enrichment | [deepmine/company-data-enrichment](https://apify.com/deepmine/company-data-enrichment) | `0.4.15` |
| Limited fallback DNS lookup | [Cloudflare DNS over HTTPS](https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/dns-json/) | Public JSON endpoint |

Provider schemas were reviewed on 25 October 2026. Pins reduce interface drift but cannot guarantee future availability, pricing or coverage. The technology Actor uses its own hosted fingerprint set; this repository does not bundle that third-party database. The independent Anthropic marker follows [the vendor's domain verification documentation](https://support.claude.com/en/articles/13132885-set-up-single-sign-on-sso).

## Spending controls

This portfolio pilot starts with a **US$5 cumulative reservation ceiling** in the local `data/budget.json` ledger.

- A scan reserves its whole selected maximum before starting Actors.
- A normal scan splits the cap between the two Actors. A website-only retry assigns the cap to its technology Actor.
- The app requires compatible pay-per-event pricing and checks that Apify acknowledged the requested cap.
- Reservations remain counted after failures or ambiguous network outcomes. They are deliberately conservative and are not the same as billed usage.
- Run-start POST requests are never automatically retried: a timeout could hide an accepted, billable run.
- Run IDs and console links are saved locally for recovery. Reported cost can lag billing settlement.
- A file lock prevents simultaneous processes from overspending the ledger; use one dashboard process for a straightforward workflow.

Do not reset the ledger to evade the test ceiling. Any larger pilot needs an explicitly reviewed budget and provider pricing. These safeguards apply to the configured Actors; adding a proxy or another paid provider requires separate cost accounting.

## Privacy and publication boundaries

The public repository contains application source, tests, documentation and fictional fixtures. The Pages build reads only `examples/demo`, never `data/runs`.

- Apify credentials remain in process/browser memory and are sent only to Apify. They are not written into results or exports.
- Live research is sent to the configured Apify Actors. On fallback, the requested company domain is also queried through Cloudflare's DNS resolver.
- Local research, exports, `.env` files, temporary publishing tools and provider snapshots are ignored by Git.
- The local server checks Host, Origin and a session token on data-changing requests. It is not designed to be exposed as a public multi-user service.
- The public page contains no credential input, analytics or external scripts. Its content security policy disables application data connections. GitHub still serves and operates the hosting infrastructure.
- CSV export neutralizes formula-like text. The browser workbook stores text as literal cells. Untrusted source strings are rendered as text rather than injected HTML.
- Never publish real datasets by simply copying your local `data` or `outputs` folders into `docs`.

See [SECURITY.md](SECURITY.md) for reporting and operational boundaries.

## Verification

```bash
python3 -m unittest discover -s tests -v
```

The release includes **23 automated tests** covering input normalization, ambiguous/missing data, tri-state evidence, AND/OR filtering, scope and confidence, browser/Python parity, Excel safety, public-demo isolation, budget reservations, non-retried run starts, cooldowns, DNS redaction and retry preservation.

Node-dependent checks are skipped when Node is unavailable; Python application tests still run. Browser checks also verified the two-company AND result, five-company OR result and filtered Excel download. The downloaded workbook was reopened to verify both companies, both tool signals, frozen headers and filters.

These checks validate application behavior. They do not independently validate every third-party company fact or technology observation. The initial live pilot covered three domains; large-batch performance has not been benchmarked.

### Rebuild the Pages demo

```bash
python3 scripts/build_demo.py
python3 -m http.server 8920 --bind 127.0.0.1 --directory docs
```

The public build rejects non-synthetic fixtures or domains outside the demonstration's `example.com` subdomains. Commit the reviewed `docs` output. In GitHub repository settings, configure Pages to deploy from **main → /docs**. `.nojekyll` keeps the assets buildless.

## What this project demonstrates

- **GTM systems thinking:** turn a commercial research question into explicit, reusable selection rules.
- **Automation design:** orchestrate providers, normalize output, preserve sources, handle partial failure and control cost.
- **Data quality judgment:** separate observations from conclusions, retain Unknown, and make uncertainty visible.
- **Product execution:** provide a usable dashboard, spreadsheet handoff and credential-free portfolio demo.
- **Evaluation discipline:** test selection logic, exports and recovery rather than claiming business outcomes from a technical demo.

This version does **not** call an LLM. Shortlist rationales use explicit rules and do not invent facts or buying intent. An AI layer should be added only with a defined task, source-linked output, measured factual accuracy and human review; a plausible use would be drafting a research brief from verified observations.

## Current limits and next steps

- Add a verified, source-linked founder enrichment provider.
- Benchmark detection quality across a larger, labeled set of company websites.
- Capture original website/DNS snippets more consistently and evaluate alternative providers for blocked sites.
- Support user-defined integration/replacement playbooks with explainable scoring.
- Add scheduled refreshes and technology change history if a real workflow needs them.
- Evaluate an optional grounded AI research brief against a rule-based baseline.

No revenue lift, interview outcomes or sales conversions are claimed by this repository.

## Project structure

```text
app.py                    Local dashboard and API
intelligence/             Collection, normalization, recovery and export
static/                   Shared dashboard UI and browser engines
examples/demo/            Fictional public demonstration data
examples/domains.csv      Domain import example
scripts/build_demo.py     Safe static Pages build
scripts/audit_public.py    Publication inventory and secret-pattern checks
tests/                    Unit, parity, recovery and publication tests
docs/                     Generated GitHub Pages site and demo screenshot
data/                     Local research and cost ledger (ignored)
outputs/                  Local exports and checks (ignored)
```

## License

The original application code is available under the [MIT License](LICENSE). Third-party services, returned data and their underlying detection databases retain their own terms and licenses. Vendor names are used descriptively; this project is not affiliated with those vendors.
