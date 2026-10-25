/* Fictional portfolio demonstration; not company research. */
window.DEMO_REPORT = {
  "id": "demo",
  "mode": "synthetic",
  "created_at": "2026-10-25T12:00:00Z",
  "manifest": {
    "id": "demo",
    "created_at": "2026-10-25T12:00:00Z",
    "mode": "synthetic",
    "domains": [
      "acme.example.com",
      "north.example.com",
      "vista.example.com",
      "rivet.example.com",
      "harbour.example.com",
      "meadow.example.com",
      "orbit.example.com",
      "cobalt.example.com"
    ],
    "status": "Partial",
    "runs": {
      "technology": {
        "status": "SUCCEEDED"
      },
      "firmographics": {
        "status": "SUCCEEDED"
      }
    }
  },
  "companies": [
    {
      "domain": "acme.example.com",
      "facts": {
        "Company": "Acme Studio (sample)",
        "Domain": "acme.example.com",
        "Industry": "Software",
        "Company type": "Unknown",
        "Founded year": 2018,
        "Founders": "Unknown",
        "Employee size band": "51–200 employees",
        "Employees on LinkedIn": 86,
        "Employee range minimum": "Unknown",
        "Employee range maximum": "Unknown",
        "Headquarters": "Berlin, Germany",
        "HQ city": "Berlin",
        "HQ region": "Unknown",
        "HQ country": "Germany",
        "HQ street": "Unknown",
        "HQ postal code": "Unknown",
        "Office countries (reported)": "Germany",
        "Office cities (reported)": "Berlin",
        "Office addresses (reported)": "Unknown",
        "Description": "Fictional company for demonstrating the research workflow. All attributes are synthetic.",
        "Specialties": "Unknown",
        "Total funding (USD)": "Unknown",
        "Last funding round": "Unknown",
        "Last funding date": "Unknown",
        "Company website from profile": "https://acme.example.com",
        "Company profile source": "Unknown",
        "Funding source": "Unknown",
        "Company match": "Matched by provider",
        "Company data checked (UTC)": "2026-10-25T12:00:00Z",
        "Website scan": "Complete",
        "Website checked (UTC)": "2026-10-25T12:00:00Z",
        "Scan notes": "Unknown"
      },
      "technologies": [
        {
          "name": "HubSpot",
          "categories": [
            "CRM"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "scriptSrc"
          ],
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred.",
          "provider": "Fictional demonstration fixture",
          "implied_by": [],
          "url": "https://acme.example.com",
          "checked_at": "2026-10-25T12:00:00Z"
        },
        {
          "name": "Figma",
          "categories": [
            "Design"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred.",
          "provider": "Fictional demonstration fixture",
          "implied_by": [],
          "url": "https://acme.example.com",
          "checked_at": "2026-10-25T12:00:00Z"
        },
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
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred.",
          "provider": "Fictional demonstration fixture",
          "implied_by": [],
          "url": "https://acme.example.com",
          "checked_at": "2026-10-25T12:00:00Z"
        },
        {
          "name": "Slack",
          "categories": [
            "Collaboration"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred.",
          "provider": "Fictional demonstration fixture",
          "implied_by": [],
          "url": "https://acme.example.com",
          "checked_at": "2026-10-25T12:00:00Z"
        }
      ],
      "raw_company": [
        {
          "input": "acme.example.com",
          "name": "Acme Studio (sample)",
          "website": "https://acme.example.com",
          "industry": "Software",
          "foundedYear": 2018,
          "companySize": "51–200 employees",
          "employeeCount": 86,
          "headquarters": "Berlin, Germany",
          "headquartersCity": "Berlin",
          "headquartersCountryName": "Germany",
          "offices": [
            {
              "city": "Berlin",
              "countryName": "Germany"
            }
          ],
          "scrapedAt": "2026-10-25T12:00:00Z",
          "description": "Fictional company for demonstrating the research workflow. All attributes are synthetic."
        }
      ],
      "raw_technology": [
        {
          "url": "https://acme.example.com",
          "domain": "acme.example.com",
          "status": "ok",
          "technology": "HubSpot",
          "categories": [
            "CRM"
          ],
          "confidence": 100,
          "foundIn": "website",
          "detectedBy": [
            "scriptSrc"
          ],
          "checkedAt": "2026-10-25T12:00:00Z",
          "provider": "Fictional demonstration fixture",
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred."
        },
        {
          "url": "https://acme.example.com",
          "domain": "acme.example.com",
          "status": "ok",
          "technology": "Figma",
          "categories": [
            "Design"
          ],
          "confidence": 100,
          "foundIn": "dns",
          "detectedBy": [
            "dns:TXT"
          ],
          "checkedAt": "2026-10-25T12:00:00Z",
          "provider": "Fictional demonstration fixture",
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred."
        },
        {
          "url": "https://acme.example.com",
          "domain": "acme.example.com",
          "status": "ok",
          "technology": "Google Analytics",
          "categories": [
            "Analytics"
          ],
          "confidence": 100,
          "foundIn": "website",
          "detectedBy": [
            "scriptSrc"
          ],
          "checkedAt": "2026-10-25T12:00:00Z",
          "provider": "Fictional demonstration fixture",
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred."
        },
        {
          "url": "https://acme.example.com",
          "domain": "acme.example.com",
          "status": "ok",
          "technology": "Slack",
          "categories": [
            "Collaboration"
          ],
          "confidence": 100,
          "foundIn": "dns",
          "detectedBy": [
            "dns:TXT"
          ],
          "checkedAt": "2026-10-25T12:00:00Z",
          "provider": "Fictional demonstration fixture",
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred."
        }
      ],
      "scan_status": "Complete"
    },
    {
      "domain": "north.example.com",
      "facts": {
        "Company": "North Goods (sample)",
        "Domain": "north.example.com",
        "Industry": "Retail",
        "Company type": "Unknown",
        "Founded year": 2020,
        "Founders": "Unknown",
        "Employee size band": "11–50 employees",
        "Employees on LinkedIn": 32,
        "Employee range minimum": "Unknown",
        "Employee range maximum": "Unknown",
        "Headquarters": "Amsterdam, Netherlands",
        "HQ city": "Amsterdam",
        "HQ region": "Unknown",
        "HQ country": "Netherlands",
        "HQ street": "Unknown",
        "HQ postal code": "Unknown",
        "Office countries (reported)": "Netherlands",
        "Office cities (reported)": "Amsterdam",
        "Office addresses (reported)": "Unknown",
        "Description": "Fictional company for demonstrating the research workflow. All attributes are synthetic.",
        "Specialties": "Unknown",
        "Total funding (USD)": "Unknown",
        "Last funding round": "Unknown",
        "Last funding date": "Unknown",
        "Company website from profile": "https://north.example.com",
        "Company profile source": "Unknown",
        "Funding source": "Unknown",
        "Company match": "Matched by provider",
        "Company data checked (UTC)": "2026-10-25T12:00:00Z",
        "Website scan": "Complete",
        "Website checked (UTC)": "2026-10-25T12:00:00Z",
        "Scan notes": "Unknown"
      },
      "technologies": [
        {
          "name": "HubSpot",
          "categories": [
            "CRM"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "scriptSrc"
          ],
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred.",
          "provider": "Fictional demonstration fixture",
          "implied_by": [],
          "url": "https://north.example.com",
          "checked_at": "2026-10-25T12:00:00Z"
        },
        {
          "name": "Shopify",
          "categories": [
            "Ecommerce"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "scriptSrc"
          ],
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred.",
          "provider": "Fictional demonstration fixture",
          "implied_by": [],
          "url": "https://north.example.com",
          "checked_at": "2026-10-25T12:00:00Z"
        }
      ],
      "raw_company": [
        {
          "input": "north.example.com",
          "name": "North Goods (sample)",
          "website": "https://north.example.com",
          "industry": "Retail",
          "foundedYear": 2020,
          "companySize": "11–50 employees",
          "employeeCount": 32,
          "headquarters": "Amsterdam, Netherlands",
          "headquartersCity": "Amsterdam",
          "headquartersCountryName": "Netherlands",
          "offices": [
            {
              "city": "Amsterdam",
              "countryName": "Netherlands"
            }
          ],
          "scrapedAt": "2026-10-25T12:00:00Z",
          "description": "Fictional company for demonstrating the research workflow. All attributes are synthetic."
        }
      ],
      "raw_technology": [
        {
          "url": "https://north.example.com",
          "domain": "north.example.com",
          "status": "ok",
          "technology": "HubSpot",
          "categories": [
            "CRM"
          ],
          "confidence": 100,
          "foundIn": "website",
          "detectedBy": [
            "scriptSrc"
          ],
          "checkedAt": "2026-10-25T12:00:00Z",
          "provider": "Fictional demonstration fixture",
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred."
        },
        {
          "url": "https://north.example.com",
          "domain": "north.example.com",
          "status": "ok",
          "technology": "Shopify",
          "categories": [
            "Ecommerce"
          ],
          "confidence": 100,
          "foundIn": "website",
          "detectedBy": [
            "scriptSrc"
          ],
          "checkedAt": "2026-10-25T12:00:00Z",
          "provider": "Fictional demonstration fixture",
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred."
        }
      ],
      "scan_status": "Complete"
    },
    {
      "domain": "vista.example.com",
      "facts": {
        "Company": "Vista Works (sample)",
        "Domain": "vista.example.com",
        "Industry": "Professional services",
        "Company type": "Unknown",
        "Founded year": 2016,
        "Founders": "Unknown",
        "Employee size band": "51–200 employees",
        "Employees on LinkedIn": 140,
        "Employee range minimum": "Unknown",
        "Employee range maximum": "Unknown",
        "Headquarters": "Paris, France",
        "HQ city": "Paris",
        "HQ region": "Unknown",
        "HQ country": "France",
        "HQ street": "Unknown",
        "HQ postal code": "Unknown",
        "Office countries (reported)": "France",
        "Office cities (reported)": "Paris",
        "Office addresses (reported)": "Unknown",
        "Description": "Fictional company for demonstrating the research workflow. All attributes are synthetic.",
        "Specialties": "Unknown",
        "Total funding (USD)": "Unknown",
        "Last funding round": "Unknown",
        "Last funding date": "Unknown",
        "Company website from profile": "https://vista.example.com",
        "Company profile source": "Unknown",
        "Funding source": "Unknown",
        "Company match": "Matched by provider",
        "Company data checked (UTC)": "2026-10-25T12:00:00Z",
        "Website scan": "Complete",
        "Website checked (UTC)": "2026-10-25T12:00:00Z",
        "Scan notes": "Unknown"
      },
      "technologies": [
        {
          "name": "Figma",
          "categories": [
            "Design"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred.",
          "provider": "Fictional demonstration fixture",
          "implied_by": [],
          "url": "https://vista.example.com",
          "checked_at": "2026-10-25T12:00:00Z"
        },
        {
          "name": "WordPress",
          "categories": [
            "CMS"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "scriptSrc"
          ],
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred.",
          "provider": "Fictional demonstration fixture",
          "implied_by": [],
          "url": "https://vista.example.com",
          "checked_at": "2026-10-25T12:00:00Z"
        }
      ],
      "raw_company": [
        {
          "input": "vista.example.com",
          "name": "Vista Works (sample)",
          "website": "https://vista.example.com",
          "industry": "Professional services",
          "foundedYear": 2016,
          "companySize": "51–200 employees",
          "employeeCount": 140,
          "headquarters": "Paris, France",
          "headquartersCity": "Paris",
          "headquartersCountryName": "France",
          "offices": [
            {
              "city": "Paris",
              "countryName": "France"
            }
          ],
          "scrapedAt": "2026-10-25T12:00:00Z",
          "description": "Fictional company for demonstrating the research workflow. All attributes are synthetic."
        }
      ],
      "raw_technology": [
        {
          "url": "https://vista.example.com",
          "domain": "vista.example.com",
          "status": "ok",
          "technology": "Figma",
          "categories": [
            "Design"
          ],
          "confidence": 100,
          "foundIn": "dns",
          "detectedBy": [
            "dns:TXT"
          ],
          "checkedAt": "2026-10-25T12:00:00Z",
          "provider": "Fictional demonstration fixture",
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred."
        },
        {
          "url": "https://vista.example.com",
          "domain": "vista.example.com",
          "status": "ok",
          "technology": "WordPress",
          "categories": [
            "CMS"
          ],
          "confidence": 100,
          "foundIn": "website",
          "detectedBy": [
            "scriptSrc"
          ],
          "checkedAt": "2026-10-25T12:00:00Z",
          "provider": "Fictional demonstration fixture",
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred."
        }
      ],
      "scan_status": "Complete"
    },
    {
      "domain": "rivet.example.com",
      "facts": {
        "Company": "Rivet Cloud (sample)",
        "Domain": "rivet.example.com",
        "Industry": "Software",
        "Company type": "Unknown",
        "Founded year": 2019,
        "Founders": "Unknown",
        "Employee size band": "201–500 employees",
        "Employees on LinkedIn": 260,
        "Employee range minimum": "Unknown",
        "Employee range maximum": "Unknown",
        "Headquarters": "Hamburg, Germany",
        "HQ city": "Hamburg",
        "HQ region": "Unknown",
        "HQ country": "Germany",
        "HQ street": "Unknown",
        "HQ postal code": "Unknown",
        "Office countries (reported)": "Germany",
        "Office cities (reported)": "Hamburg",
        "Office addresses (reported)": "Unknown",
        "Description": "Fictional company for demonstrating the research workflow. All attributes are synthetic.",
        "Specialties": "Unknown",
        "Total funding (USD)": "Unknown",
        "Last funding round": "Unknown",
        "Last funding date": "Unknown",
        "Company website from profile": "https://rivet.example.com",
        "Company profile source": "Unknown",
        "Funding source": "Unknown",
        "Company match": "Matched by provider",
        "Company data checked (UTC)": "2026-10-25T12:00:00Z",
        "Website scan": "Complete",
        "Website checked (UTC)": "2026-10-25T12:00:00Z",
        "Scan notes": "Unknown"
      },
      "technologies": [
        {
          "name": "HubSpot",
          "categories": [
            "CRM"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred.",
          "provider": "Fictional demonstration fixture",
          "implied_by": [],
          "url": "https://rivet.example.com",
          "checked_at": "2026-10-25T12:00:00Z"
        },
        {
          "name": "Figma",
          "categories": [
            "Design"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred.",
          "provider": "Fictional demonstration fixture",
          "implied_by": [],
          "url": "https://rivet.example.com",
          "checked_at": "2026-10-25T12:00:00Z"
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
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred.",
          "provider": "Fictional demonstration fixture",
          "implied_by": [],
          "url": "https://rivet.example.com",
          "checked_at": "2026-10-25T12:00:00Z"
        }
      ],
      "raw_company": [
        {
          "input": "rivet.example.com",
          "name": "Rivet Cloud (sample)",
          "website": "https://rivet.example.com",
          "industry": "Software",
          "foundedYear": 2019,
          "companySize": "201–500 employees",
          "employeeCount": 260,
          "headquarters": "Hamburg, Germany",
          "headquartersCity": "Hamburg",
          "headquartersCountryName": "Germany",
          "offices": [
            {
              "city": "Hamburg",
              "countryName": "Germany"
            }
          ],
          "scrapedAt": "2026-10-25T12:00:00Z",
          "description": "Fictional company for demonstrating the research workflow. All attributes are synthetic."
        }
      ],
      "raw_technology": [
        {
          "url": "https://rivet.example.com",
          "domain": "rivet.example.com",
          "status": "ok",
          "technology": "HubSpot",
          "categories": [
            "CRM"
          ],
          "confidence": 100,
          "foundIn": "dns",
          "detectedBy": [
            "dns:TXT"
          ],
          "checkedAt": "2026-10-25T12:00:00Z",
          "provider": "Fictional demonstration fixture",
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred."
        },
        {
          "url": "https://rivet.example.com",
          "domain": "rivet.example.com",
          "status": "ok",
          "technology": "Figma",
          "categories": [
            "Design"
          ],
          "confidence": 100,
          "foundIn": "dns",
          "detectedBy": [
            "dns:TXT"
          ],
          "checkedAt": "2026-10-25T12:00:00Z",
          "provider": "Fictional demonstration fixture",
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred."
        },
        {
          "url": "https://rivet.example.com",
          "domain": "rivet.example.com",
          "status": "ok",
          "technology": "Anthropic",
          "categories": [
            "Artificial Intelligence"
          ],
          "confidence": 100,
          "foundIn": "dns",
          "detectedBy": [
            "dns:TXT"
          ],
          "checkedAt": "2026-10-25T12:00:00Z",
          "provider": "Fictional demonstration fixture",
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred."
        }
      ],
      "scan_status": "Complete"
    },
    {
      "domain": "harbour.example.com",
      "facts": {
        "Company": "Harbour Labs (sample)",
        "Domain": "harbour.example.com",
        "Industry": "Software",
        "Company type": "Unknown",
        "Founded year": "Unknown",
        "Founders": "Unknown",
        "Employee size band": "Unknown",
        "Employees on LinkedIn": "Unknown",
        "Employee range minimum": "Unknown",
        "Employee range maximum": "Unknown",
        "Headquarters": "Munich, Germany",
        "HQ city": "Munich",
        "HQ region": "Unknown",
        "HQ country": "Germany",
        "HQ street": "Unknown",
        "HQ postal code": "Unknown",
        "Office countries (reported)": "Germany",
        "Office cities (reported)": "Munich",
        "Office addresses (reported)": "Unknown",
        "Description": "Fictional company for demonstrating the research workflow. All attributes are synthetic.",
        "Specialties": "Unknown",
        "Total funding (USD)": "Unknown",
        "Last funding round": "Unknown",
        "Last funding date": "Unknown",
        "Company website from profile": "https://harbour.example.com",
        "Company profile source": "Unknown",
        "Funding source": "Unknown",
        "Company match": "Matched by provider",
        "Company data checked (UTC)": "2026-10-25T12:00:00Z",
        "Website scan": "Unknown",
        "Website checked (UTC)": "2026-10-25T12:00:00Z",
        "Scan notes": "Fictional HTTP 429 example. A rate-limited website scan remains Unknown."
      },
      "technologies": [],
      "raw_company": [
        {
          "input": "harbour.example.com",
          "name": "Harbour Labs (sample)",
          "website": "https://harbour.example.com",
          "industry": "Software",
          "foundedYear": null,
          "companySize": "Unknown",
          "employeeCount": null,
          "headquarters": "Munich, Germany",
          "headquartersCity": "Munich",
          "headquartersCountryName": "Germany",
          "offices": [
            {
              "city": "Munich",
              "countryName": "Germany"
            }
          ],
          "scrapedAt": "2026-10-25T12:00:00Z",
          "description": "Fictional company for demonstrating the research workflow. All attributes are synthetic."
        }
      ],
      "raw_technology": [
        {
          "url": "https://harbour.example.com",
          "domain": "harbour.example.com",
          "status": "error",
          "httpStatus": 429,
          "error": "Fictional HTTP 429 example. A rate-limited website scan remains Unknown.",
          "checkedAt": "2026-10-25T12:00:00Z"
        }
      ],
      "scan_status": "Unknown"
    },
    {
      "domain": "meadow.example.com",
      "facts": {
        "Company": "Meadow Health (sample)",
        "Domain": "meadow.example.com",
        "Industry": "Healthcare",
        "Company type": "Unknown",
        "Founded year": 2017,
        "Founders": "Unknown",
        "Employee size band": "51–200 employees",
        "Employees on LinkedIn": 75,
        "Employee range minimum": "Unknown",
        "Employee range maximum": "Unknown",
        "Headquarters": "Copenhagen, Denmark",
        "HQ city": "Copenhagen",
        "HQ region": "Unknown",
        "HQ country": "Denmark",
        "HQ street": "Unknown",
        "HQ postal code": "Unknown",
        "Office countries (reported)": "Denmark",
        "Office cities (reported)": "Copenhagen",
        "Office addresses (reported)": "Unknown",
        "Description": "Fictional company for demonstrating the research workflow. All attributes are synthetic.",
        "Specialties": "Unknown",
        "Total funding (USD)": "Unknown",
        "Last funding round": "Unknown",
        "Last funding date": "Unknown",
        "Company website from profile": "https://meadow.example.com",
        "Company profile source": "Unknown",
        "Funding source": "Unknown",
        "Company match": "Matched by provider",
        "Company data checked (UTC)": "2026-10-25T12:00:00Z",
        "Website scan": "Complete",
        "Website checked (UTC)": "2026-10-25T12:00:00Z",
        "Scan notes": "Unknown"
      },
      "technologies": [
        {
          "name": "HubSpot",
          "categories": [
            "CRM"
          ],
          "confidence": 100,
          "location": "website",
          "version": null,
          "detected_by": [
            "scriptSrc"
          ],
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred.",
          "provider": "Fictional demonstration fixture",
          "implied_by": [],
          "url": "https://meadow.example.com",
          "checked_at": "2026-10-25T12:00:00Z"
        },
        {
          "name": "Figma",
          "categories": [
            "Design"
          ],
          "confidence": 25,
          "location": "website",
          "version": null,
          "detected_by": [
            "scriptSrc"
          ],
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred.",
          "provider": "Fictional demonstration fixture",
          "implied_by": [],
          "url": "https://meadow.example.com",
          "checked_at": "2026-10-25T12:00:00Z"
        }
      ],
      "raw_company": [
        {
          "input": "meadow.example.com",
          "name": "Meadow Health (sample)",
          "website": "https://meadow.example.com",
          "industry": "Healthcare",
          "foundedYear": 2017,
          "companySize": "51–200 employees",
          "employeeCount": 75,
          "headquarters": "Copenhagen, Denmark",
          "headquartersCity": "Copenhagen",
          "headquartersCountryName": "Denmark",
          "offices": [
            {
              "city": "Copenhagen",
              "countryName": "Denmark"
            }
          ],
          "scrapedAt": "2026-10-25T12:00:00Z",
          "description": "Fictional company for demonstrating the research workflow. All attributes are synthetic."
        }
      ],
      "raw_technology": [
        {
          "url": "https://meadow.example.com",
          "domain": "meadow.example.com",
          "status": "ok",
          "technology": "HubSpot",
          "categories": [
            "CRM"
          ],
          "confidence": 100,
          "foundIn": "website",
          "detectedBy": [
            "scriptSrc"
          ],
          "checkedAt": "2026-10-25T12:00:00Z",
          "provider": "Fictional demonstration fixture",
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred."
        },
        {
          "url": "https://meadow.example.com",
          "domain": "meadow.example.com",
          "status": "ok",
          "technology": "Figma",
          "categories": [
            "Design"
          ],
          "confidence": 25,
          "foundIn": "website",
          "detectedBy": [
            "scriptSrc"
          ],
          "checkedAt": "2026-10-25T12:00:00Z",
          "provider": "Fictional demonstration fixture",
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred."
        }
      ],
      "scan_status": "Complete"
    },
    {
      "domain": "orbit.example.com",
      "facts": {
        "Company": "Orbit Metrics (sample)",
        "Domain": "orbit.example.com",
        "Industry": "Software",
        "Company type": "Unknown",
        "Founded year": 2021,
        "Founders": "Unknown",
        "Employee size band": "11–50 employees",
        "Employees on LinkedIn": 21,
        "Employee range minimum": "Unknown",
        "Employee range maximum": "Unknown",
        "Headquarters": "Stockholm, Sweden",
        "HQ city": "Stockholm",
        "HQ region": "Unknown",
        "HQ country": "Sweden",
        "HQ street": "Unknown",
        "HQ postal code": "Unknown",
        "Office countries (reported)": "Sweden",
        "Office cities (reported)": "Stockholm",
        "Office addresses (reported)": "Unknown",
        "Description": "Fictional company for demonstrating the research workflow. All attributes are synthetic.",
        "Specialties": "Unknown",
        "Total funding (USD)": "Unknown",
        "Last funding round": "Unknown",
        "Last funding date": "Unknown",
        "Company website from profile": "https://orbit.example.com",
        "Company profile source": "Unknown",
        "Funding source": "Unknown",
        "Company match": "Matched by provider",
        "Company data checked (UTC)": "2026-10-25T12:00:00Z",
        "Website scan": "Complete",
        "Website checked (UTC)": "2026-10-25T12:00:00Z",
        "Scan notes": "Unknown"
      },
      "technologies": [
        {
          "name": "Notion",
          "categories": [
            "Productivity"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred.",
          "provider": "Fictional demonstration fixture",
          "implied_by": [],
          "url": "https://orbit.example.com",
          "checked_at": "2026-10-25T12:00:00Z"
        },
        {
          "name": "Slack",
          "categories": [
            "Collaboration"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred.",
          "provider": "Fictional demonstration fixture",
          "implied_by": [],
          "url": "https://orbit.example.com",
          "checked_at": "2026-10-25T12:00:00Z"
        }
      ],
      "raw_company": [
        {
          "input": "orbit.example.com",
          "name": "Orbit Metrics (sample)",
          "website": "https://orbit.example.com",
          "industry": "Software",
          "foundedYear": 2021,
          "companySize": "11–50 employees",
          "employeeCount": 21,
          "headquarters": "Stockholm, Sweden",
          "headquartersCity": "Stockholm",
          "headquartersCountryName": "Sweden",
          "offices": [
            {
              "city": "Stockholm",
              "countryName": "Sweden"
            }
          ],
          "scrapedAt": "2026-10-25T12:00:00Z",
          "description": "Fictional company for demonstrating the research workflow. All attributes are synthetic."
        }
      ],
      "raw_technology": [
        {
          "url": "https://orbit.example.com",
          "domain": "orbit.example.com",
          "status": "ok",
          "technology": "Notion",
          "categories": [
            "Productivity"
          ],
          "confidence": 100,
          "foundIn": "dns",
          "detectedBy": [
            "dns:TXT"
          ],
          "checkedAt": "2026-10-25T12:00:00Z",
          "provider": "Fictional demonstration fixture",
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred."
        },
        {
          "url": "https://orbit.example.com",
          "domain": "orbit.example.com",
          "status": "ok",
          "technology": "Slack",
          "categories": [
            "Collaboration"
          ],
          "confidence": 100,
          "foundIn": "dns",
          "detectedBy": [
            "dns:TXT"
          ],
          "checkedAt": "2026-10-25T12:00:00Z",
          "provider": "Fictional demonstration fixture",
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred."
        }
      ],
      "scan_status": "Complete"
    },
    {
      "domain": "cobalt.example.com",
      "facts": {
        "Company": "Cobalt Logistics (sample)",
        "Domain": "cobalt.example.com",
        "Industry": "Logistics",
        "Company type": "Unknown",
        "Founded year": 2013,
        "Founders": "Unknown",
        "Employee size band": "201–500 employees",
        "Employees on LinkedIn": 480,
        "Employee range minimum": "Unknown",
        "Employee range maximum": "Unknown",
        "Headquarters": "Barcelona, Spain",
        "HQ city": "Barcelona",
        "HQ region": "Unknown",
        "HQ country": "Spain",
        "HQ street": "Unknown",
        "HQ postal code": "Unknown",
        "Office countries (reported)": "Spain",
        "Office cities (reported)": "Barcelona",
        "Office addresses (reported)": "Unknown",
        "Description": "Fictional company for demonstrating the research workflow. All attributes are synthetic.",
        "Specialties": "Unknown",
        "Total funding (USD)": "Unknown",
        "Last funding round": "Unknown",
        "Last funding date": "Unknown",
        "Company website from profile": "https://cobalt.example.com",
        "Company profile source": "Unknown",
        "Funding source": "Unknown",
        "Company match": "Matched by provider",
        "Company data checked (UTC)": "2026-10-25T12:00:00Z",
        "Website scan": "Complete",
        "Website checked (UTC)": "2026-10-25T12:00:00Z",
        "Scan notes": "Unknown"
      },
      "technologies": [
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
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred.",
          "provider": "Fictional demonstration fixture",
          "implied_by": [],
          "url": "https://cobalt.example.com",
          "checked_at": "2026-10-25T12:00:00Z"
        },
        {
          "name": "Microsoft 365",
          "categories": [
            "Email"
          ],
          "confidence": 100,
          "location": "dns",
          "version": null,
          "detected_by": [
            "dns:TXT"
          ],
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred.",
          "provider": "Fictional demonstration fixture",
          "implied_by": [],
          "url": "https://cobalt.example.com",
          "checked_at": "2026-10-25T12:00:00Z"
        }
      ],
      "raw_company": [
        {
          "input": "cobalt.example.com",
          "name": "Cobalt Logistics (sample)",
          "website": "https://cobalt.example.com",
          "industry": "Logistics",
          "foundedYear": 2013,
          "companySize": "201–500 employees",
          "employeeCount": 480,
          "headquarters": "Barcelona, Spain",
          "headquartersCity": "Barcelona",
          "headquartersCountryName": "Spain",
          "offices": [
            {
              "city": "Barcelona",
              "countryName": "Spain"
            }
          ],
          "scrapedAt": "2026-10-25T12:00:00Z",
          "description": "Fictional company for demonstrating the research workflow. All attributes are synthetic."
        }
      ],
      "raw_technology": [
        {
          "url": "https://cobalt.example.com",
          "domain": "cobalt.example.com",
          "status": "ok",
          "technology": "Salesforce",
          "categories": [
            "CRM"
          ],
          "confidence": 100,
          "foundIn": "dns",
          "detectedBy": [
            "dns:TXT"
          ],
          "checkedAt": "2026-10-25T12:00:00Z",
          "provider": "Fictional demonstration fixture",
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred."
        },
        {
          "url": "https://cobalt.example.com",
          "domain": "cobalt.example.com",
          "status": "ok",
          "technology": "Microsoft 365",
          "categories": [
            "Email"
          ],
          "confidence": 100,
          "foundIn": "dns",
          "detectedBy": [
            "dns:TXT"
          ],
          "checkedAt": "2026-10-25T12:00:00Z",
          "provider": "Fictional demonstration fixture",
          "evidence": "Synthetic observation for interface demonstration; no real scan occurred."
        }
      ],
      "scan_status": "Complete"
    }
  ]
};
