/* Reviewed public snapshot; private run IDs and raw records omitted. */
window.TEST_REPORT = {
  "id": "test-sample",
  "mode": "public-snapshot",
  "created_at": "2026-10-25T16:47:13.325271+00:00",
  "sample_note": "Sanitized public company and technology observations from the 25 October 2026 test run. Not rescanned on page load; detections do not prove active use. Private run identifiers, billing and raw provider records are omitted.",
  "companies": [
    {
      "domain": "hellofresh.com",
      "facts": {
        "Company": "HelloFresh",
        "Domain": "hellofresh.com",
        "Industry": "Consumer Services",
        "Founded year": "Unknown",
        "Founders": "Unknown",
        "Employee size band": "10,001+ employees",
        "Employees on LinkedIn": 17593,
        "HQ city": "Berlin",
        "HQ country": "Germany",
        "Office countries (reported)": "Germany; Canada; United Kingdom; United States; Netherlands; Australia",
        "Company profile source": "https://www.linkedin.com/company/hellofresh",
        "Company match": "Matched by provider",
        "Company data checked (UTC)": "2026-10-25T16:47:21Z",
        "Website scan": "Complete",
        "Website checked (UTC)": "2026-10-25T16:47:20.327Z",
        "Scan notes": "Unknown",
        "Headquarters": "Berlin, Germany"
      },
      "technologies": [
        {
          "name": "Criteo",
          "categories": [
            "Advertising",
            "Retargeting"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "js:Criteo",
            "js:criteo_q"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Adjust",
          "categories": [
            "Analytics"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "dom:div[data-adjust*='app.adjust.com/'], a[href*='app.adjust...."
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Statsig",
          "categories": [
            "Analytics",
            "Feature management"
          ],
          "confidence": 100,
          "location": "website",
          "version": "3.25.3",
          "detected_by": [
            "js:__STATSIG__",
            "js:__STATSIG__.SDK_VERSION"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Vercel Speed Insights",
          "categories": [
            "Analytics"
          ],
          "confidence": 100,
          "location": "website",
          "version": "1.2.0",
          "detected_by": [
            "dom:script[data-sdkn='@vercel/speed-insights/next']",
            "js:si",
            "scriptSrc"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Cloudflare",
          "categories": [
            "CDN"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "headers:cf-cache-status",
            "headers:cf-ray",
            "headers:server"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Contentful",
          "categories": [
            "CMS"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "xhr"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Emotion",
          "categories": [
            "Development",
            "JavaScript frameworks"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "dom:style[data-emotion], style[data-emotion-css]"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "styled-components",
          "categories": [
            "Development",
            "JavaScript frameworks"
          ],
          "confidence": 100,
          "location": "website",
          "version": "5.3.5",
          "detected_by": [
            "dom:style[data-styled-version]",
            "dom:style[data-styled], style[data-styled-components], [sc-co..."
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Sentry",
          "categories": [
            "Issue trackers"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "js:__SENTRY__"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "React",
          "categories": [
            "JavaScript frameworks"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [],
          "implied_by": [
            "Next.js",
            "styled-components"
          ],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "core-js",
          "categories": [
            "JavaScript libraries"
          ],
          "confidence": 100,
          "location": "website",
          "version": "3.48.0",
          "detected_by": [
            "js:__core-js_shared__",
            "js:__core-js_shared__.versions.0.version"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Open Graph",
          "categories": [
            "Miscellaneous"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "dom:meta[property*='og:']"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Webpack",
          "categories": [
            "Miscellaneous"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [],
          "implied_by": [
            "Next.js"
          ],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Amazon Web Services",
          "categories": [
            "PaaS"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "dns:NS",
            "scripts"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Vercel",
          "categories": [
            "PaaS"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "headers:x-vercel-cache",
            "headers:x-vercel-id"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Priority Hints",
          "categories": [
            "Performance"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "dom:iframe[fetchpriority], img[fetchpriority], script[fetchpr..."
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Cloudflare Bot Management",
          "categories": [
            "Security"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "cookies:__cf_bm"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "HSTS",
          "categories": [
            "Security"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "headers:strict-transport-security"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Next.js",
          "categories": [
            "Static site generator",
            "Web frameworks",
            "JavaScript frameworks",
            "Web servers"
          ],
          "confidence": 100,
          "location": "website",
          "version": "15.5.27",
          "detected_by": [
            "headers:x-powered-by",
            "js:__NEXT_DATA__",
            "js:next.version"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Sprig",
          "categories": [
            "Surveys",
            "Analytics"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "js:UserLeap"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Google Tag Manager",
          "categories": [
            "Tag managers"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "js:google_tag_data",
            "js:google_tag_manager",
            "scriptSrc"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Mixpanel",
          "categories": [
            "Analytics"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Anthropic",
          "categories": [
            "Artificial Intelligence"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Cursor",
          "categories": [
            "Artificial Intelligence"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Docker",
          "categories": [
            "Containers"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "MongoDB Atlas",
          "categories": [
            "Databases"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Atlassian Cloud",
          "categories": [
            "Development"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Amazon SES",
          "categories": [
            "Email"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Mailjet",
          "categories": [
            "Email"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Sendgrid",
          "categories": [
            "Email"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Amazon Route 53",
          "categories": [
            "Hosting"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:NS",
            "dns:SOA"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "HPE GreenLake",
          "categories": [
            "IaaS"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "HubSpot",
          "categories": [
            "Marketing automation"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "DocuSign",
          "categories": [
            "Miscellaneous"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Figma",
          "categories": [
            "Miscellaneous"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Meta",
          "categories": [
            "Miscellaneous"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Miro",
          "categories": [
            "Miscellaneous"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Zoom",
          "categories": [
            "Miscellaneous"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "TeamViewer",
          "categories": [
            "Network devices",
            "Control systems"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Jamf",
          "categories": [
            "Security"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Wiz",
          "categories": [
            "Security"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Apple iCloud Mail",
          "categories": [
            "Webmail"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Google Workspace",
          "categories": [
            "Webmail",
            "Email"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:MX"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        },
        {
          "name": "Microsoft 365",
          "categories": [
            "Webmail",
            "Email"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://www.hellofresh.com/",
          "checked_at": "2026-10-25T16:47:20.327Z"
        }
      ],
      "scan_status": "Complete"
    },
    {
      "domain": "n26.com",
      "facts": {
        "Company": "N26",
        "Domain": "n26.com",
        "Industry": "Financial Services",
        "Founded year": 2013,
        "Founders": "Unknown",
        "Employee size band": "1,001-5,000 employees",
        "Employees on LinkedIn": 2195,
        "HQ city": "Berlin",
        "HQ country": "Germany",
        "Office countries (reported)": "Germany; Spain; Austria",
        "Company profile source": "https://www.linkedin.com/company/n26",
        "Company match": "Matched by provider",
        "Company data checked (UTC)": "2026-10-25T16:47:20Z",
        "Website scan": "Complete",
        "Website checked (UTC)": "2026-10-25T16:47:18.798Z",
        "Scan notes": "Unknown",
        "Headquarters": "Berlin, Germany"
      },
      "technologies": [
        {
          "name": "Google Analytics",
          "categories": [
            "Analytics"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "scriptSrc"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "Statsig",
          "categories": [
            "Analytics",
            "Feature management"
          ],
          "confidence": 100,
          "location": "website",
          "version": "3.33.5",
          "detected_by": [
            "js:__STATSIG__",
            "js:__STATSIG__.SDK_VERSION"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "Amazon CloudFront",
          "categories": [
            "CDN"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "headers:via",
            "headers:x-amz-cf-id"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "Contentful",
          "categories": [
            "CMS"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "html",
            "scripts"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "Usercentrics",
          "categories": [
            "Cookie compliance"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "scriptSrc"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "Snowplow Analytics",
          "categories": [
            "IaaS",
            "Analytics"
          ],
          "confidence": 50,
          "location": "website",
          "version": null,
          "detected_by": [
            "cookies:sp"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "React",
          "categories": [
            "JavaScript frameworks"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [],
          "implied_by": [
            "React Router"
          ],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "React Router",
          "categories": [
            "JavaScript frameworks"
          ],
          "confidence": 100,
          "location": "website",
          "version": "7.18.4",
          "detected_by": [
            "js:__reactRouterVersion"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "Stimulus",
          "categories": [
            "JavaScript frameworks"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "html"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "core-js",
          "categories": [
            "JavaScript libraries"
          ],
          "confidence": 100,
          "location": "website",
          "version": "3.49.0",
          "detected_by": [
            "js:__core-js_shared__",
            "js:__core-js_shared__.versions.0.version"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "Floating UI",
          "categories": [
            "JavaScript libraries"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "scriptSrc"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "Open Graph",
          "categories": [
            "Miscellaneous"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "dom:meta[property*='og:']"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "Priority Hints",
          "categories": [
            "Performance"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "dom:iframe[fetchpriority], img[fetchpriority], script[fetchpr..."
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "Envoy",
          "categories": [
            "Reverse proxies"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "headers:server",
            "headers:x-envoy-upstream-service-time"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "HSTS",
          "categories": [
            "Security"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "headers:strict-transport-security"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "Google Tag Manager",
          "categories": [
            "Tag managers"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "js:google_tag_data",
            "js:google_tag_manager",
            "scriptSrc"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "Docker",
          "categories": [
            "Containers"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "OneTrust",
          "categories": [
            "Cookie compliance"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "Salesforce",
          "categories": [
            "CRM"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "Atlassian Cloud",
          "categories": [
            "Development"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "Amazon SES",
          "categories": [
            "Email"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "Sendgrid",
          "categories": [
            "Email"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "Amazon Route 53",
          "categories": [
            "Hosting"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:NS",
            "dns:SOA"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "DocuSign",
          "categories": [
            "Miscellaneous"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "Figma",
          "categories": [
            "Miscellaneous"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "Amazon Web Services",
          "categories": [
            "PaaS"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:NS"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "Stripe",
          "categories": [
            "Payment processors"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "Apple iCloud Mail",
          "categories": [
            "Webmail"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        },
        {
          "name": "Google Workspace",
          "categories": [
            "Webmail",
            "Email"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:MX"
          ],
          "implied_by": [],
          "url": "https://n26.com/en-eu",
          "checked_at": "2026-10-25T16:47:18.798Z"
        }
      ],
      "scan_status": "Complete"
    },
    {
      "domain": "personio.com",
      "facts": {
        "Company": "Personio",
        "Domain": "personio.com",
        "Industry": "Software Development",
        "Founded year": 2015,
        "Founders": "Unknown",
        "Employee size band": "1,001-5,000 employees",
        "Employees on LinkedIn": 2120,
        "HQ city": "Munich",
        "HQ country": "Germany",
        "Office countries (reported)": "Germany; Spain; United Kingdom; Ireland; Netherlands; United States",
        "Company profile source": "https://www.linkedin.com/company/personio",
        "Company match": "Matched by provider",
        "Company data checked (UTC)": "2026-10-25T16:47:20Z",
        "Website scan": "Unknown",
        "Website checked (UTC)": "2026-10-25T16:47:20.609Z",
        "Scan notes": "the site refused the request (HTTP 429, often bot protection)",
        "Headquarters": "Munich, Germany"
      },
      "technologies": [],
      "scan_status": "Unknown"
    }
  ]
};
