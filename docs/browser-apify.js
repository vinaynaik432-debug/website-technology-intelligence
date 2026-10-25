/* Visitor-owned research. No storage, analytics, embedded keys or application backend. */
(function(root){
 'use strict';
 const BASE='https://api.apify.com/v2',UNKNOWN='Unknown';
 const ACTORS=[{kind:'technology',id:'postatelier~website-tech-stack',build:'0.1.9'},{kind:'firmographics',id:'deepmine~company-data-enrichment',build:'0.4.15'}];
 const terminal=new Set(['SUCCEEDED','FAILED','TIMED-OUT','ABORTED']);
 function domain(value){
  const raw=String(value||'').trim();if(!raw||/\s/.test(raw))throw new Error('Enter a website domain, not a company name.');
  let url;try{url=new URL(raw.includes('://')?raw:'https://'+raw);}catch{throw new Error('Invalid company domain.');}
  let host=url.hostname.toLowerCase().replace(/\.$/,'').replace(/^www\./,'');
  if(!['https:','http:'].includes(url.protocol)||url.username||url.password||url.port||!host.includes('.')||host.length>253||/^\d+(\.\d+){3}$/.test(host)||host.includes(':')||/\.(local|localhost|internal|test|invalid)$/.test(host)||!host.split('.').every(x=>/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(x)))throw new Error('Use ordinary public company domains, without passwords or custom ports.');
  return host;
 }
 function maybeDomain(v){try{return domain(v);}catch{return null;}}
 function parseDomains(text){
  text=String(text).replace(/^\uFEFF/,'').trim();if(!text)throw new Error('Enter at least one company domain.');
  const first=text.split(/\r?\n/)[0],delimiter=first.includes('\t')?'\t':first.includes(';')?';':',';
  const rows=[];let row=[],cell='',quoted=false;
  for(let i=0;i<text.length;i++){const ch=text[i];if(ch==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(ch===delimiter&&!quoted){row.push(cell);cell='';}else if((ch==='\n'||ch==='\r')&&!quoted){if(ch==='\r'&&text[i+1]==='\n')i++;row.push(cell);rows.push(row);row=[];cell='';}else cell+=ch;}
  if(quoted)throw new Error('The CSV has an unfinished quoted field.');row.push(cell);rows.push(row);
  const index=rows[0].findIndex(x=>['domain','website','url','company domain'].includes(x.trim().toLowerCase()));
  const values=index>=0?rows.slice(1).map(r=>r[index]||''):rows.flat();
  const names=[...new Set(values.filter(v=>v.trim()).map(domain))];
  if(!names.length)throw new Error('No company domains found.');if(names.length>5)throw new Error('Browser testing supports up to 5 domains per run. Use the local app for larger lists.');return names;
 }
 const asText=v=>v==null||v===''||(typeof v==='object'&&!Object.keys(v).length)?UNKNOWN:typeof v==='object'?JSON.stringify(v):v;
 const joined=v=>[...new Set(v.filter(x=>x!=null&&x!=='').map(String))].join('; ')||UNKNOWN;
 function normalize(domains,technology,firmographics,runs={},createdAt=new Date().toISOString()){
  const detections=technology.flatMap(r=>Array.isArray(r.technologies)?r.technologies.map(t=>({...r,...t,technologies:undefined})):r.technology?[r]:[]);
  const companies=domains.map(d=>{
   const scans=technology.filter(r=>maybeDomain(r.url||r.domain)===d);
   let candidates=firmographics.filter(r=>maybeDomain(r.input)===d);if(!candidates.length)candidates=firmographics.filter(r=>maybeDomain(r.website)===d);
   const firm=candidates.length===1?candidates[0]:{},seen=new Set();
   const technologies=detections.filter(t=>maybeDomain(t.url||t.domain)===d).flatMap(t=>{
    const identity=JSON.stringify([t.technology||t.name,t.foundIn,t.detectedBy]);if(seen.has(identity))return [];seen.add(identity);
    const cats=Array.isArray(t.categories)?t.categories.map(c=>typeof c==='object'?(c.name||'Uncategorized'):String(c)):[];
    return [{name:String(t.technology||t.name),categories:cats.length?cats:['Uncategorized'],confidence:t.confidence??null,location:t.foundIn||'unknown',version:t.version??null,detected_by:t.detectedBy||[],evidence:t.evidence??null,provider:'Apify technology Actor',implied_by:t.impliedBy||[],url:t.finalUrl||t.url,checked_at:t.checkedAt||createdAt}];
   });
   const complete=scans.length&&scans.every(r=>['ok','no_technologies_detected'].includes(r.status))&&runs.technology?.status==='SUCCEEDED';
   const status=complete?'Complete':technologies.length?'Partial':'Unknown',notes=scans.filter(r=>r.error).map(r=>String(r.error));
   if(!scans.length)notes.push('No technology result returned; not evidence of an empty stack.');if(!Object.keys(firm).length)notes.push('No unique company profile returned.');
   const linked=maybeDomain(firm.website);let match=Object.keys(firm).length?'Matched by provider':UNKNOWN;
   if(linked&&linked!==d){match='Review website difference';notes.push('Company profile links to '+linked+'; review brand/group scope.');}
   const offices=Array.isArray(firm.offices)?firm.offices:[];
   const facts={Company:firm.name||d,Domain:d,Industry:asText(firm.industry),'Company type':asText(firm.companyType),'Founded year':asText(firm.foundedYear),Founders:asText(firm.founders),'Employee size band':asText(firm.companySize),'Employees on LinkedIn':asText(firm.employeeCount),'Employee range minimum':asText(firm.employeeCountMin),'Employee range maximum':asText(firm.employeeCountMax),Headquarters:asText(firm.headquarters),'HQ city':asText(firm.headquartersCity),'HQ region':asText(firm.headquartersRegion),'HQ country':asText(firm.headquartersCountryName||firm.headquartersCountry),'HQ street':asText(firm.headquartersStreet),'HQ postal code':asText(firm.headquartersPostalCode),'Office countries (reported)':joined(offices.map(o=>o.countryName||o.country)),'Office cities (reported)':joined(offices.map(o=>o.city)),'Office addresses (reported)':joined(firm.locations||[]),Description:asText(firm.description),Specialties:joined(firm.specialties||[]),'Total funding (USD)':asText(firm.totalFundingUsd),'Last funding round':asText(firm.lastFundingRound),'Last funding date':asText(firm.lastFundingDate),'Company website from profile':asText(firm.website),'Company profile source':asText(firm.linkedinUrl),'Funding source':asText(firm.fundingSource),'Company match':match,'Company data checked (UTC)':firm.scrapedAt||UNKNOWN,'Website scan':status,'Website checked (UTC)':scans.find(r=>r.checkedAt)?.checkedAt||createdAt,'Scan notes':joined(notes)};
   return {domain:d,facts,technologies,raw_company:candidates,raw_technology:scans,scan_status:status};
  });
  return {id:'browser-live',mode:'live',created_at:createdAt,manifest:{domains,created_at:createdAt,mode:'live',runs},companies};
 }
 async function collect({token,domains,allowance=.5,renderJs=true,onProgress=()=>{},onRuns=()=>{},fetchImpl=root.fetch.bind(root),sleep=ms=>new Promise(r=>setTimeout(r,ms))}){
  if(!token||!String(token).trim())throw new Error('Enter your Apify API token.');token=String(token).trim();
  domains=parseDomains(domains.join('\n'));allowance=Number(allowance);
  if(!Number.isFinite(allowance)||allowance<.1||allowance>5)throw new Error('Choose a total maximum charge between $0.10 and $5.');
  const cap=Math.floor(allowance/2*1e6)/1e6,runs={},createdAt=new Date().toISOString();
  const safeId=x=>{if(!/^[A-Za-z0-9_-]{1,80}$/.test(String(x)))throw new Error('Apify returned an invalid resource identifier.');return x;};
  async function request(path,{method='GET',body}={}){
   if(!/^\/(actors|actor-runs|datasets)\//.test(path)||path.includes('..'))throw new Error('Invalid API request.');
   const tries=method==='GET'?3:1;
   for(let attempt=0;attempt<tries;attempt++){
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),30000);let response;
    try{response=await fetchImpl(BASE+path,{method,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json',Accept:'application/json'},body:body===undefined?undefined:JSON.stringify(body),credentials:'omit',cache:'no-store',redirect:'error',referrerPolicy:'no-referrer',signal:controller.signal});}
    catch{throw new Error(method==='POST'?'The start/stop request could not be confirmed. It was not retried. Check your Apify runs before starting again.':'Could not reach Apify. Check your connection and any runs already started.');}
    finally{clearTimeout(timer);}
    if(!response.ok){
     if(method==='GET'&&[429,500,502,503,504].includes(response.status)&&attempt<tries-1){const retry=response.headers?.get('Retry-After');let delay=retry?(/^\d+$/.test(retry)?Number(retry)*1000:Date.parse(retry)-Date.now()):1000*2**attempt;if(!Number.isFinite(delay))delay=1000*2**attempt;if(delay>60000)throw new Error('Apify requested a longer pause. Check the run links and wait before another request.');await sleep(Math.max(delay,0));continue;}
     if([401,403].includes(response.status))throw new Error('Apify rejected access. Check your token, its permissions and access to both Actors.');
     if(response.status===402)throw new Error('Your Apify account needs available credits to run this research.');
     throw new Error(`Apify returned HTTP ${response.status}. Check your account and any runs already started.`);
    }
    try{return await response.json();}catch{throw new Error('Apify returned an unreadable response. Check your runs before retrying.');}
   }
  }
  try{
   onProgress('Checking Actor pricing and account access…');
   for(const actor of ACTORS){const meta=(await request('/actors/'+actor.id)).data;const prices=(meta?.pricingInfos||[]).filter(p=>(p.startedAt||'')<=createdAt).sort((a,b)=>(a.startedAt||'').localeCompare(b.startedAt||''));const price=prices.at(-1);if(price?.pricingModel!=='PAY_PER_EVENT'||(price.minimalMaxTotalChargeUsd||0)>cap)throw new Error('Actor pricing is unavailable, changed, or exceeds this cap. No runs were started.');}
   const inputs={technology:{urls:domains.map(d=>'https://'+d),renderJs,checkDns:true,outputFormat:'technologies',categories:[],minConfidence:0,monitorChanges:false,maxConcurrency:1,timeoutSecs:60},firmographics:{companies:domains,includeFunding:true,includeContacts:false,includeRecentJobs:false,maxPostsPerCompany:0,maxCompanies:domains.length}};
   for(const actor of ACTORS){onProgress('Starting '+actor.kind+' research…');const q=new URLSearchParams({build:actor.build,timeout:'300',memory:'1024',maxTotalChargeUsd:String(cap),restartOnError:'false'});const run=(await request('/actors/'+actor.id+'/runs?'+q,{method:'POST',body:inputs[actor.kind]})).data;
    if(!run?.id)throw new Error('A run start was not confirmed. Check your Apify account before another attempt.');
    safeId(run.id);runs[actor.kind]={id:run.id,actor:actor.id,build:actor.build,status:run.status,defaultDatasetId:run.defaultDatasetId,cap_usd:cap,url:'https://console.apify.com/actors/runs/'+run.id};onRuns({...runs});
    const accepted=run.options?.maxTotalChargeUsd;
    if(typeof accepted!=='number'||!Number.isFinite(accepted)||accepted>cap+1e-8){try{await request('/actor-runs/'+run.id+'/abort',{method:'POST'});}catch{}throw new Error('Apify did not acknowledge the cap. A stop was requested; check the run in your account.');}
   }
   for(let attempt=0;Object.values(runs).some(r=>!terminal.has(r.status));attempt++){
    if(attempt>=120)throw new Error('Monitoring timed out. Your run links are below; check Apify before scanning again.');
    for(const [kind,run] of Object.entries(runs)){if(terminal.has(run.status))continue;const result=(await request('/actor-runs/'+safeId(run.id))).data;if(!result?.status)throw new Error('Run status unavailable. Check your Apify account.');Object.assign(run,{status:result.status,defaultDatasetId:result.defaultDatasetId});onProgress(kind+': '+run.status.toLowerCase().replaceAll('-',' '));onRuns({...runs});}
    if(Object.values(runs).some(r=>!terminal.has(r.status)))await sleep(3000);
   }
   const data={technology:[],firmographics:[]};
   for(const [kind,run] of Object.entries(runs)){if(!run.defaultDatasetId)continue;for(let offset=0;offset<20000;offset+=1000){const rows=await request('/datasets/'+safeId(run.defaultDatasetId)+'/items?format=json&clean=false&offset='+offset+'&limit=1000');if(!Array.isArray(rows))throw new Error('Unexpected dataset response. Open the run link to inspect the results.');data[kind].push(...rows);if(rows.length<1000)break;if(offset===19000)throw new Error('Dataset too large for this browser demo. Download it from your Apify run.');}}
   const report=normalize(domains,data.technology,data.firmographics,runs,createdAt);onProgress('Research ready. Export your results before closing or refreshing this page.');return report;
  }finally{token='';}
 }
 const client={domain,parseDomains,normalize,collect,ACTORS};root.ApifyBrowser=client;if(typeof module!=='undefined')module.exports=client;
})(typeof window==='undefined'?globalThis:window);
