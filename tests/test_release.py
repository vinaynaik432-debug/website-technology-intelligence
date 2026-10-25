import copy
import json
import shutil
import subprocess
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import patch
from intelligence.model import normalize, select_companies, detection_state
from intelligence.recovery import dns_fallback, retry_plan
from intelligence.apify import collect, budget_status
from app import validated_filters
ROOT=Path(__file__).resolve().parents[1]

class MultiTool(unittest.TestCase):
 def setUp(self):self.report=normalize(ROOT/'examples/demo')
 def test_hubspot_and_figma(self):
  chosen=select_companies(self.report,tools=['HubSpot','Figma'])
  self.assertEqual([c['domain'] for c in chosen],['acme.example.com','rivet.example.com'])
 def test_hubspot_or_figma(self):
  self.assertEqual(len(select_companies(self.report,tools=['HubSpot','Figma'],tool_match='any')),5)
 def test_scope_and_low_confidence_do_not_imply_absence(self):
  self.assertEqual(len(select_companies(self.report,tools=['HubSpot','Figma'],scope='website')),0)
  self.assertEqual(len(select_companies(self.report,tools=['HubSpot','Figma'],confidence=0)),3)
  self.assertEqual(detection_state(self.report['companies'][4],name='HubSpot'),'Unknown')
 def test_invalid_filter_controls(self):
  for f in [{'tool_match':'xor'},{'min_employees':100,'max_employees':10}]:
   with self.assertRaises(ValueError):validated_filters({'filters':f})
 @unittest.skipUnless(shutil.which('node'),'Node is optional; needed only for browser parity verification')
 def test_browser_matches_python(self):
  filters=[{}, {'tools':['HubSpot','Figma']},{'tools':['HubSpot','Figma'],'tool_match':'any'},{'tools':['HubSpot','Figma'],'confidence':0},{'tools':['Figma'],'scope':'website'},{'tools':['Figma'],'states':['Unknown']},{'country':'Germany','min_employees':50},{'categories':['CRM']},{'query':'north'}]
  js="const e=require('./static/engine.js');let x='';process.stdin.on('data',d=>x+=d);process.stdin.on('end',()=>{const {report,filters}=JSON.parse(x);console.log(JSON.stringify(filters.map(f=>e.select(report,f).map(c=>c.domain))));});"
  actual=json.loads(subprocess.check_output(['node','-e',js],cwd=ROOT,input=json.dumps({'report':self.report,'filters':filters}).encode()))
  expected=[[c['domain'] for c in select_companies(self.report,**f)] for f in filters]
  self.assertEqual(actual,expected)

class Recovery(unittest.TestCase):
 def test_dns_positive_match_redacts_verification_payload(self):
  answer={'Status':0,'Answer':[{'type':16,'data':'"anthropic-domain-verification-abc=PRIVATE_VERIFICATION_VALUE"'}]}
  result=dns_fallback('example.com',lookup=lambda kind:answer)
  self.assertEqual([r['technology'] for r in result['observations']],['Anthropic'])
  self.assertNotIn('PRIVATE_VERIFICATION_VALUE',json.dumps(result))
 def test_dns_errors_and_unrecognized_markers_remain_empty(self):
  for result in [{'Status':2},{'Status':0,'Answer':[{'type':16,'data':'"unrelated=anything"'}]}]:
   self.assertEqual(dns_fallback('example.com',lookup=lambda kind:result)['observations'],[])
 def test_retry_cooldown_and_synthetic_guard(self):
  with self.assertRaises(ValueError):retry_plan(ROOT/'examples/demo')
  with tempfile.TemporaryDirectory() as d:
   target=Path(d);shutil.copytree(ROOT/'examples/demo',target,dirs_exist_ok=True)
   m=json.loads((target/'manifest.json').read_text());m['mode']='live';(target/'manifest.json').write_text(json.dumps(m))
   with self.assertRaises(ValueError):retry_plan(target,datetime.fromisoformat(m['created_at']))
   self.assertEqual(retry_plan(target,datetime(2026,10,26,tzinfo=timezone.utc)),['harbour.example.com'])
 def test_retry_reuses_profiles_and_preserves_prior_success(self):
  with tempfile.TemporaryDirectory() as d:
   root=Path(d);old=root/'old';shutil.copytree(ROOT/'examples/demo',old)
   m=json.loads((old/'manifest.json').read_text());m['mode']='live';(old/'manifest.json').write_text(json.dumps(m))
   def request(self,path,method='GET',body=None,query=None):
    if path.startswith('/acts/') and method=='GET':return {'data':{'pricingInfos':[{'pricingModel':'PAY_PER_EVENT','startedAt':'2020'}]}}
    if method=='POST':
     self.test_payload=body
     return {'data':{'id':'run','status':'FAILED','defaultDatasetId':'dataset','options':{'maxTotalChargeUsd':.5}}}
    raise AssertionError(path)
   rows=[{'url':'https://www.harbour.example.com','status':'error','httpStatus':429,'error':'Blocked'}]
   with patch('intelligence.apify.Apify.request',request),patch('intelligence.apify.Apify.dataset',return_value=rows),patch('intelligence.recovery.dns_fallback',return_value={'observations':[],'notes':[]}):
    result=collect('test-token',['harbour.example.com'],root/'new',root/'budget.json',.5,retry_source=old)
   report=normalize(root/'new')
   self.assertEqual(len(report['companies']),8)
   self.assertEqual(report['companies'][0]['scan_status'],'Complete')
   self.assertEqual(report['companies'][4]['scan_status'],'Unknown')
   self.assertTrue(result['runs']['firmographics']['reused'])
   self.assertEqual(result['runs']['technology']['input']['urls'],['https://www.harbour.example.com'])
   self.assertEqual(json.loads((old/'firmographics.json').read_text()),json.loads((root/'new/firmographics.json').read_text()))
   self.assertEqual(budget_status(root/'budget.json')['reserved_usd'],.5)

class PublicDemo(unittest.TestCase):
 def test_public_build_uses_only_synthetic_fixture(self):
  from scripts.build_demo import build
  build()
  page=(ROOT/'docs/index.html').read_text()
  data=(ROOT/'docs/demo-data.js').read_text()
  self.assertNotIn('id="api-token"',page)
  self.assertIn('connect-src \'none\'',page)
  self.assertIn('"mode": "synthetic"',data)
  for value in ['hellofresh.com','personio.com','console.apify.com/actors/runs/','/Users/']:
   self.assertNotIn(value,data)
 @unittest.skipUnless(shutil.which('node'),'Node needed for browser Excel test')
 def test_browser_workbook_is_valid_zip_and_contains_literal_cells(self):
  import io,zipfile,xml.etree.ElementTree as ET
  js="const write=require('./static/xlsx.js');process.stdout.write(Buffer.from(write({headers:['Company','HubSpot'],rows:[['=CMD()', 'Detected']],scope:'all',confidence:50,created_at:'2026-10-25'})));"
  blob=subprocess.check_output(['node','-e',js],cwd=ROOT)
  with zipfile.ZipFile(io.BytesIO(blob)) as z:
   for name in z.namelist():ET.fromstring(z.read(name))
   sheet=z.read('xl/worksheets/sheet1.xml').decode()
   self.assertNotIn('<f>',sheet);self.assertIn('=CMD()',sheet);self.assertIn('autoFilter',sheet)

if __name__=='__main__':unittest.main()
