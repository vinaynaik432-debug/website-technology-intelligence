const assert=require('node:assert/strict');
const fs=require('node:fs');
const client=require('../static/browser-apify.js');
const engine=require('../static/engine.js');
let passed=0;
async function test(name,fn){await fn();passed++;console.log('PASS '+name);}
const response=(value,status=200)=>({ok:status>=200&&status<300,status,headers:{get:()=>null},json:async()=>value});
const price={data:{pricingInfos:[{startedAt:'2020-01-01',pricingModel:'PAY_PER_EVENT'}]}};
function transport(options={}){
 const calls=[],updates=[];
 async function fetchImpl(url,request){
  calls.push({url,...request});const u=new URL(url);
  if(request.method==='GET'&&/\/actors\//.test(u.pathname))return response(options.badPricing?{data:{pricingInfos:[]}}:price);
  if(request.method==='POST'&&u.pathname.endsWith('/abort'))return response({data:{status:'ABORTED'}});
  if(request.method==='POST'){
   if(options.networkFailure)throw new Error('A private response that must not be shown');
   const kind=u.pathname.includes('postatelier')?'technology':'firmographics';
   return response({data:{id:'run-'+kind,status:'SUCCEEDED',defaultDatasetId:'dataset-'+kind,options:options.noCap?{}:{maxTotalChargeUsd:Number(u.searchParams.get('maxTotalChargeUsd'))}}});
  }
  if(u.pathname.includes('dataset-technology'))return response([{url:'https://example.com',technology:'HubSpot',status:'ok',categories:['CRM'],confidence:100,foundIn:'website',detectedBy:['scriptSrc']}]);
  if(u.pathname.includes('dataset-firmographics'))return response([{input:'example.com',name:'Example',website:'https://example.com',employeeCount:0}]);
  throw new Error('Unexpected endpoint '+u.pathname);
 }
 return {calls,updates,fetchImpl,onRuns:r=>updates.push(r)};
}
(async()=>{
 await test('normalizes CSV, quoted values, duplicate URLs and IDN',()=>{
  assert.deepEqual(client.parseDomains('name,domain\n"Example, Inc",https://www.example.com/path\nExample,example.com'),['example.com']);
  assert.equal(client.domain('bücher.de'),'xn--bcher-kva.de');
 });
 await test('rejects credentials, IPs, private hosts and oversized batches',()=>{
  for(const x of ['http://user:password@example.com','http://127.0.0.1','http://127.1','http://0177.0.0.1','http://0x7f000001','file:///etc/passwd','a.local','example.com:9000','a'.repeat(64)+'.com'])assert.throws(()=>client.domain(x));
  assert.throws(()=>client.parseDomains('a.com\nb.com\nc.com\nd.com\ne.com\nf.com'));
 });
 await test('two capped starts, header-only token and valid normalized results',async()=>{
  const t=transport(),report=await client.collect({token:'unit-test-token',domains:['example.com'],allowance:.5,...t});
  const starts=t.calls.filter(c=>c.method==='POST');assert.equal(starts.length,2);
  for(const r of t.calls){assert.equal(new URL(r.url).origin,'https://api.apify.com');assert.ok(!r.url.includes('unit-test-token'));assert.equal(r.headers.Authorization,'Bearer unit-test-token');assert.equal(r.credentials,'omit');assert.equal(r.cache,'no-store');assert.equal(r.redirect,'error');assert.ok(!(r.body||'').includes('unit-test-token'));}
  for(const r of starts)assert.equal(new URL(r.url).searchParams.get('maxTotalChargeUsd'),'.25'.replace(/^\./,'0.'));
  assert.equal(report.mode,'live');assert.equal(report.companies[0].scan_status,'Complete');assert.equal(report.companies[0].facts['Employees on LinkedIn'],0);
  assert.ok(!JSON.stringify(report).includes('unit-test-token'));
  const table=engine.table(report,report.companies,{},true);assert.ok(table.headers.some(x=>x.startsWith('Full company source JSON')));assert.ok(table.rows[0].some(x=>String(x).includes('run-technology')));
 });
 await test('unrecognized pricing starts no paid runs',async()=>{
  const t=transport({badPricing:true});await assert.rejects(client.collect({token:'unit-test-token',domains:['example.com'],...t}),/pricing/);assert.equal(t.calls.filter(c=>c.method==='POST').length,0);
 });
 await test('slow response bodies time out before any paid run starts',async()=>{
  const setTimer=global.setTimeout;global.setTimeout=(fn,ms,...args)=>setTimer(fn,Math.min(ms,10),...args);
  let posts=0;
  try{await assert.rejects(client.collect({token:'unit-test-token',domains:['example.com'],fetchImpl:async(url,request)=>{if(request.method==='POST')posts++;return {ok:true,json:()=>new Promise((resolve,reject)=>request.signal.addEventListener('abort',()=>reject(new Error('aborted')),{once:true}))};}}),/Could not reach Apify/);assert.equal(posts,0);}finally{global.setTimeout=setTimer;}
 });
 await test('larger batches get enough runtime and monitoring continues beyond six minutes',async()=>{
  const t=transport();let polls=0;
  const fetchImpl=async(url,request)=>{
   if(request.method==='GET'&&url.includes('/actor-runs/')){polls++;return response({data:{status:polls>=125?'SUCCEEDED':'RUNNING',defaultDatasetId:'dataset-technology'}});}
   const result=await t.fetchImpl(url,request);
   if(request.method==='POST'&&url.includes('postatelier')){const data=await result.json();data.data.status='RUNNING';return response(data);}
   return result;
  };
  await client.collect({token:'unit-test-token',domains:['example.com','b.com','c.com','d.com','e.com'],...t,fetchImpl,sleep:async()=>{}});
  const starts=t.calls.filter(c=>c.method==='POST');assert.equal(new URL(starts[0].url).searchParams.get('timeout'),'435');assert.equal(new URL(starts[1].url).searchParams.get('timeout'),'300');assert.equal(polls,125);
 });
 await test('ambiguous POST outcome is never retried or echoed',async()=>{
  const t=transport({networkFailure:true});await assert.rejects(client.collect({token:'unit-test-token',domains:['example.com'],...t}),/not retried/);assert.equal(t.calls.filter(c=>c.method==='POST').length,1);
 });
 await test('missing cost-cap acknowledgment requests an abort and prevents second run',async()=>{
  const t=transport({noCap:true});await assert.rejects(client.collect({token:'unit-test-token',domains:['example.com'],...t}),/acknowledge the cap/);assert.equal(t.calls.filter(c=>c.method==='POST'&&c.url.includes('/actors/')).length,1);assert.equal(t.calls.filter(c=>c.url.endsWith('/abort')).length,1);
 });
 await test('blocked or incomplete data remains Unknown, ambiguous profiles are withheld',()=>{
  const tech=[{url:'https://example.com',status:'error',httpStatus:429,error:'Blocked'}];const firms=[{input:'example.com',name:'A'},{input:'example.com',name:'B'}];
  const report=client.normalize(['example.com'],tech,firms,{technology:{status:'SUCCEEDED'}});assert.equal(report.companies[0].scan_status,'Unknown');assert.equal(report.companies[0].facts['Company match'],'Unknown');assert.equal(engine.state(report.companies[0],{name:'HubSpot'}),'Unknown');
 });
 await test('original source rows survive browser export chunking',()=>{
  const report=client.normalize(['example.com'],[],[{input:'example.com',long:'x'.repeat(70000)}]);const table=engine.table(report,report.companies,{},true),ids=table.headers.flatMap((x,i)=>x.startsWith('Full company source JSON')?[i]:[]);assert.equal(JSON.parse(ids.map(i=>table.rows[0][i]).join(''))[0].long.length,70000);
 });
 await test('Unicode survives UTF-8 encoding at source-cell boundaries',()=>{
  const report=client.normalize(['example.com'],[],[]),original=[{long:'x'.repeat(11989)+'😀'.repeat(20000)}];report.companies[0].raw_company=original;
  const table=engine.table(report,report.companies,{},true),ids=table.headers.flatMap((x,i)=>x.startsWith('Full company source JSON')?[i]:[]);
  const restored=ids.map(i=>Buffer.from(table.rows[0][i],'utf8').toString('utf8')).join('');assert.deepEqual(JSON.parse(restored),original);
 });
 await test('no credential or result persistence APIs in the published client',()=>{
  const source=fs.readFileSync('static/browser-apify.js','utf8')+fs.readFileSync('static/app.js','utf8');for(const name of ['localStorage','sessionStorage','indexedDB','document.cookie'])assert.ok(!source.includes(name));
 });
 console.log(`${passed} browser-client checks passed.`);
})().catch(e=>{console.error(e);process.exitCode=1;});
