import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from urllib.error import URLError

from intelligence.apify import Apify, budget_status, reserve, update_cost
from intelligence.export import safe_cell
from intelligence.model import domain_name, parse_domains, normalize, catalog, detection_state, select_companies, matrix

ROOT = Path(__file__).resolve().parents[1]


class Domains(unittest.TestCase):
    def test_normalizes_without_collapsing_co_uk(self):
        self.assertEqual(domain_name('https://www.Example.co.uk/about?q=1'), 'example.co.uk')
        self.assertEqual(domain_name('shop.example.co.uk'), 'shop.example.co.uk')
        self.assertTrue(domain_name('bücher.de').startswith('xn--'))

    def test_csv_headers_and_duplicates(self):
        self.assertEqual(parse_domains('company,domain\nN26,n26.com\nN26,https://www.n26.com/en\nHelloFresh,hellofresh.com'), ['n26.com','hellofresh.com'])
        self.assertEqual(parse_domains('n26.com\nhellofresh.com'), ['n26.com','hellofresh.com'])

    def test_private_inputs_and_credentials_rejected(self):
        for value in ['localhost','127.0.0.1','http://169.254.169.254','https://user:pass@example.com','file:///etc/passwd','company name','example.local','http://example.com:8000']:
            with self.subTest(value=value), self.assertRaises(ValueError):
                domain_name(value)


class Evidence(unittest.TestCase):
    def setUp(self):
        self.report = normalize(ROOT / 'tests/fixtures/basic')
        self.a, self.n, self.u = self.report['companies']

    def test_tri_state_and_scope(self):
        self.assertEqual(detection_state(self.a,name='Example Analytics'), 'Yes')
        self.assertEqual(detection_state(self.n,name='Example Analytics'), 'Unknown')
        self.assertEqual(detection_state(self.u,name='Example Analytics'), 'Unknown')
        self.assertEqual(detection_state(self.a,name='Example Store'), 'No')
        self.assertEqual(detection_state(self.a,name='Example CRM',scope='website'), 'No')
        self.assertEqual(detection_state(self.a,name='Example CRM',scope='dns'), 'Yes')

    def test_confidence_changes_result(self):
        self.assertEqual(detection_state(self.n,name='Example Analytics',confidence=0), 'Yes')

    def test_filters_change_shortlist(self):
        self.assertEqual([c['domain'] for c in select_companies(self.report,tools=['Example Analytics'])],['acme.example.com'])
        self.assertEqual(len(select_companies(self.report,tools=['Example Analytics'],states=['Unknown'])),2)
        self.assertEqual(len(select_companies(self.report,categories=['CRM'],scope='website')),0)
        self.assertEqual(len(select_companies(self.report,country='Germany',min_employees=50)),1)
        self.assertEqual(len(select_companies(self.report,min_employees=0)),2)

    def test_one_row_per_company_and_dynamic_headers(self):
        table=matrix(self.report,raw=True)
        self.assertEqual(len(table['rows']),3)
        self.assertEqual(len(table['headers']),len(set(table['headers'])))
        self.assertTrue(all(len(r)==len(table['headers']) for r in table['rows']))
        self.assertTrue(any(h=='Tool | Analytics | Example Analytics' for h in table['headers']))
        self.assertEqual(self.a['facts']['Founders'],'Unknown')

    def test_raw_json_chunks_preserve_everything(self):
        self.a['raw_company']=[{'long_field':'x'*70000,'nested':{'zero':0,'false':False}}]
        table=matrix(self.report,raw=True)
        positions=[i for i,h in enumerate(table['headers']) if h.startswith('Full company source JSON')]
        restored=json.loads(''.join(table['rows'][0][i] for i in positions))
        self.assertEqual(restored,self.a['raw_company'])
        self.assertTrue(all(len(table['rows'][0][i])<=12000 for i in positions))

    def test_missing_and_ambiguous_company_data(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)
            for name in ['manifest.json','technology.json','firmographics.json']:
                (p/name).write_text((ROOT/'tests/fixtures/basic'/name).read_text())
            rows=json.loads((p/'firmographics.json').read_text())
            rows.append(dict(rows[0],name='Different candidate'))
            (p/'firmographics.json').write_text(json.dumps(rows))
            r=normalize(p)
            self.assertEqual(r['companies'][0]['facts']['Company match'],'Unknown')
            self.assertEqual(r['companies'][0]['facts']['Employees on LinkedIn'],'Unknown')


class Reliability(unittest.TestCase):
    def test_budget_survives_restart_and_retains_reservations(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'budget.json'
            reserve(p,'one',3)
            update_cost(p,'one',.02)
            self.assertEqual(budget_status(p)['reserved_usd'],3)
            with self.assertRaises(ValueError): reserve(p,'two',3)
            reserve(p,'three',2)
            self.assertEqual(budget_status(p)['reserved_usd'],5)
            for cap in [0,-1,float('nan'),float('inf')]:
                with self.assertRaises(ValueError): reserve(p,'bad',cap)

    def test_post_never_retried_after_unknown_outcome(self):
        api=Apify('test-token')
        with patch.object(api.opener,'open',side_effect=URLError('network down')) as op:
            with self.assertRaises(RuntimeError): api.request('/acts/test~actor/runs',method='POST',body={})
            self.assertEqual(op.call_count,1)

    def test_spreadsheet_formula_injection_blocked(self):
        for value in ['=HYPERLINK("bad")','+1+1','@SUM(A1)','-cmd']:
            self.assertTrue(safe_cell(value).startswith("'"))
        self.assertEqual(safe_cell(0),0)
        self.assertEqual(safe_cell(False),False)


if __name__=='__main__':unittest.main()
