const $=id=>document.getElementById(id),E=ResearchEngine,DEMO=document.body.dataset.mode==='demo';
let csrf='',current=null,currentId='',refreshing=0,selectedTools=[],scanning=false;
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
function toast(message){$('toast').textContent=message;$('toast').hidden=false;setTimeout(()=>$('toast').hidden=true,6500);}
async function api(path,data){const r=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json','X-Session-Token':csrf},body:JSON.stringify(data)});if(!r.ok){let e=await r.json();throw new Error(e.error||'Request failed');}return r;}
function filters(){return {query:$('query').value,country:$('country').value,industry:$('industry').value,tools:[...selectedTools],tool_match:$('tool-match').value,categories:$('category').value?[$('category').value]:[],states:[$('state').value],scope:$('scope').value,confidence:Number($('confidence').value),min_employees:$('min-employees').value,max_employees:$('max-employees').value};}
function validRange(){const f=filters();if(f.min_employees!==''&&f.max_employees!==''&&Number(f.min_employees)>Number(f.max_employees))throw new Error('Minimum employees cannot exceed maximum employees.');}
function options(node,values,first){const prior=node.value;node.replaceChildren();const o=el('option',first);o.value='';node.append(o);for(const value of [...new Set(values)].sort()){const n=el('option',value);n.value=value;node.append(n);}if(values.includes(prior))node.value=prior;}
async function bootstrap(selectId){
 if(DEMO){$('live-controls').hidden=true;$('demo-controls').hidden=false;$('mode-badge').textContent='Public demo · fictional data';$('runs').replaceChildren(new Option('Fictional EU company sample','demo'));currentId='demo';await loadView(true);return;}
 const data=await(await fetch('/api/bootstrap')).json();csrf=data.csrf;
 const picker=$('runs');picker.replaceChildren();for(const r of data.runs){const o=el('option',r.id==='demo'?'Explore fictional sample data':`${r.domains.length} companies · ${new Date(r.created_at).toLocaleString([],{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}${r.status==='Partial'?' · partial':''}`);o.value=r.id;picker.append(o);}
 const remaining=Math.max(0,data.budget.limit_usd-data.budget.reserved_usd);$('budget').textContent=`$${remaining.toFixed(2)} test allowance available`;$('budget-detail').textContent=`$${data.budget.reserved_usd.toFixed(2)} reserved of the $${data.budget.limit_usd} project limit. Reserved caps remain counted after each test.`;
 if(data.has_token)$('api-token').placeholder='Using APIFY_TOKEN from this computer';
 picker.value=data.runs.some(r=>r.id===selectId)?selectId:data.runs[0].id;currentId=picker.value;await loadView(true);
}
async function loadView(reset=false){
 const version=++refreshing;try{
  validRange();let data;
  if(DEMO){const report=window.DEMO_REPORT,chosen=E.select(report,filters());data={report,catalog:E.catalog(report),selected_domains:chosen.map(c=>c.domain),table:E.table(report,chosen,filters())};}
  else data=await(await api('/api/view',{id:currentId,filters:filters()})).json();
  if(version!==refreshing)return;current=data;
  if(reset){options($('category'),data.catalog.flatMap(t=>t.categories),'Any category');options($('country'),data.report.companies.map(c=>c.facts['HQ country']),'All countries');options($('industry'),data.report.companies.map(c=>c.facts.Industry),'All industries');}
  options($('tool'),data.catalog.map(t=>t.name).filter(n=>!selectedTools.includes(n)),'Choose another tool…');render();
 }catch(e){toast(e.message);}
}
function chips(){const list=$('selected-tools');list.replaceChildren();for(const name of selectedTools){const button=el('button',name+' ×','tool-chip');button.setAttribute('aria-label','Remove '+name);button.onclick=()=>{selectedTools=selectedTools.filter(t=>t!==name);loadView();};list.append(button);}if(!selectedTools.length)list.append(el('span','No tool restriction. Add one or more technologies.','hint'));const word=$('tool-match').value==='all'?' AND ':' OR ';$('filter-explanation').textContent=selectedTools.length?`${$('state').selectedOptions[0].textContent}: ${selectedTools.join(word)}. Country, industry and size filters must also match.`:'Technology filters use public signals, not verified subscriptions.';}
function render(){
 if(!current)return;chips();const {report,table,catalog,selected_domains}=current;
 $('company-count').textContent=report.companies.length;$('tool-count').textContent=catalog.length;$('category-count').textContent=new Set(catalog.flatMap(t=>t.categories)).size;
 const incomplete=report.companies.filter(c=>c.scan_status!=='Complete');$('review-count').textContent=incomplete.length;
 $('result-count').textContent=`${selected_domains.length} of ${report.companies.length} companies match`;
 $('saved-date').textContent=report.mode==='synthetic'?'Fictional examples. No company claims or credits used.':`Collected ${new Date(report.created_at).toLocaleString()}. Saved results do not trigger another scan.`;
 $('retry').disabled=scanning||report.mode==='synthetic'||!incomplete.length;
 const messages=[];if(report.mode==='synthetic')messages.push('DEMO DATA: all companies and tool observations shown here are fictional.');
 if(incomplete.length)messages.push(`${incomplete.length} incomplete website scan${incomplete.length===1?'':'s'}. Missing signals stay Unknown.`);
 if($('scope').value!=='website')messages.push('DNS signals show a vendor connection; they do not prove current use.');
 $('notice').textContent=messages.join(' ');$('notice').hidden=!messages.length;
 const basics=new Set(['Company','Domain','Industry','HQ country','Founded year','Employee size band','Website scan']),wantedCategory=$('category').value;
 const indexes=table.headers.map((h,i)=>i).filter(i=>{const h=table.headers[i];if(i<table.metadata_count)return $('all-fields').checked||basics.has(h);if(h.startsWith('Category | '))return $('all-fields').checked&&(!wantedCategory||h==='Category | '+wantedCategory);const name=h.split(' | ').at(-1);if(selectedTools.length)return selectedTools.includes(name);if(wantedCategory)return catalog.find(t=>t.name===name)?.categories.includes(wantedCategory);return true;});
 const head=$('company-table').querySelector('thead'),body=$('company-table').querySelector('tbody');head.replaceChildren();body.replaceChildren();const tr=el('tr');for(const i of indexes){const th=el('th',table.headers[i].replace(/^Tool \| /,''));th.scope='col';tr.append(th);}head.append(tr);
 for(const row of table.rows){const r=el('tr'),domain=row[table.headers.indexOf('Domain')];for(const i of indexes){const value=row[i],td=el('td');td.title=String(value??'');if(i===0){const button=el('button',value);button.onclick=()=>detail(domain);td.append(button);}else if(['Detected','Not detected','Unknown'].includes(value))td.append(el('span',value,'pill '+({'Detected':'yes','Not detected':'no','Unknown':'unknown'}[value])));else td.textContent=String(value??'');r.append(td);}body.append(r);}
 $('empty').hidden=!!table.rows.length;$('company-table').hidden=!table.rows.length;$('excel').disabled=!table.rows.length;
}
function safeLink(href,label){try{const u=new URL(href);if(!['https:','http:'].includes(u.protocol))return el('span',label+' (not supplied)');const a=el('a',label,'source-link');a.href=u.href;a.target='_blank';a.rel='noopener noreferrer';return a;}catch{return el('span',label+' (not supplied)');}}
function detail(domain){
 const c=current.report.companies.find(c=>c.domain===domain);if(!c)return;$('detail-title').textContent=c.facts.Company;$('detail-domain').textContent=c.domain;const body=$('detail-body');body.replaceChildren();
 const b=E.brief(c,filters()),brief=el('section',undefined,'brief');brief.append(el('p','SHORTLIST RATIONALE · EXPLICIT RULES','eyebrow'),el('strong',b.assessment),el('p',b.angle),el('p','Next step: '+b.next));body.append(brief);
 const facts=el('div',undefined,'fact-grid');for(const key of ['Industry','Founded year','Founders','Employee size band','Employees on LinkedIn','Headquarters','Office countries (reported)','Company match','Website scan']){const block=el('div',undefined,'fact');block.append(el('span',key),el('strong',c.facts[key]));facts.append(block);}body.append(facts);
 if(c.facts['Founders']==='Unknown')body.append(el('p','Founder coverage: this provider does not supply founder names. A separate verified source is needed.','detail-note'));
 if(c.facts['Scan notes']!=='Unknown')body.append(el('p',c.facts['Scan notes'],'detail-note'));
 if(c.scan_status!=='Complete')body.append(el('p','Recovery: wait before retrying. The local app can retry incomplete websites using www and collect independent DNS signals. A successful DNS lookup does not fix the website scan.','detail-note'));
 if(current.report.mode!=='synthetic'){const source=el('p');source.append(safeLink(c.facts['Company profile source'],'Company profile source'));body.append(source);}
 body.append(el('h3',`${c.technologies.length} technology observations`));const list=el('div',undefined,'evidence-list');
 for(const t of c.technologies){const card=el('article',undefined,'evidence-card');card.append(el('h3',t.name+(t.version?' · '+t.version:'')));const type=t.location==='dns'?'DNS signal':t.location==='website'?'Website observation':'Source not specified';card.append(el('p',`${t.categories.join(' / ')} · ${type} · Match score ${t.confidence??'unknown'}/100`));const method=Array.isArray(t.detected_by)?t.detected_by.join(', '):String(t.detected_by);card.append(el('p',`Method: ${method||'Not supplied'}. Checked: ${t.checked_at}`));card.append(el('p',t.evidence?`Evidence: ${typeof t.evidence==='string'?t.evidence:JSON.stringify(t.evidence)}`:'Original matching snippet not supplied by the provider. This record cannot independently verify the match.'));
 if(t.implied_by?.length)card.append(el('p','Inferred from: '+t.implied_by.join(', ')));if(t.location==='dns')card.append(el('p','A domain record can remain after an account is closed; this does not establish current product use.'));
 if(current.report.mode!=='synthetic')card.append(safeLink(t.url,'Scanned page'));list.append(card);}
 if(!c.technologies.length)list.append(el('p','No usable technology observations were returned. This does not establish an empty technology stack.'));body.append(list);$('detail').showModal();
}
function saveBlob(blob,name){const url=URL.createObjectURL(blob),link=el('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);}
async function download(format){const button=format==='xlsx'?$('excel'):$('json'),old=button.textContent;button.disabled=true;button.textContent='Preparing…';try{validRange();let blob;if(DEMO){const chosen=E.select(current.report,filters());blob=format==='xlsx'?new Blob([DemoWorkbook(E.table(current.report,chosen,filters()))],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}):new Blob([JSON.stringify({...current.report,companies:chosen,applied_filters:filters()},null,2)],{type:'application/json'});}else blob=await(await api('/api/export',{id:currentId,filters:filters(),format})).blob();saveBlob(blob,`${DEMO?'sample-':''}company-intelligence.${format==='xlsx'?'xlsx':'json'}`);toast('Downloaded the filtered company data.');}catch(e){toast(e.message);}finally{button.textContent=old;button.disabled=false;}}
async function scan(retry=false){if(DEMO)return;scanning=true;$('scan').disabled=true;$('retry').disabled=true;try{const {id}=await(await api('/api/scan',{domains:$('domains').value,retry_id:retry?currentId:null,token:$('api-token').value,allowance:Number($('allowance').value),render_js:$('render-js').checked})).json();$('api-token').value='';while(true){const job=await(await fetch('/api/job?id='+encodeURIComponent(id))).json();$('scan-message').textContent=job.message;if(job.status!=='running'){if(job.status==='error')toast(job.message);await bootstrap(id);break;}await new Promise(resolve=>setTimeout(resolve,1500));}}catch(e){$('scan-message').textContent=e.message;toast(e.message);}finally{scanning=false;$('scan').disabled=false;render();}}
$('scan').onclick=()=>scan();$('retry').onclick=()=>scan(true);
$('upload').onchange=async e=>{const file=e.target.files[0];if(!file)return;if(file.size>150000){toast('Use a CSV or TXT file smaller than 150 KB.');return;}$('domains').value=await file.text();$('upload-label').textContent=file.name;};
$('tool').onchange=()=>{const value=$('tool').value;if(value&&!selectedTools.includes(value))selectedTools.push(value);$('tool').value='';loadView();};
$('preset').onclick=()=>{resetFields();selectedTools=['HubSpot','Figma'];loadView();};
$('runs').onchange=()=>{currentId=$('runs').value;resetFields();loadView(true);};let debounce;
for(const id of ['query','country','industry','scope','tool-match','category','state','confidence','min-employees','max-employees'])$(id).addEventListener(id==='query'||id.includes('employees')?'input':'change',()=>{clearTimeout(debounce);debounce=setTimeout(()=>loadView(),150);});
$('all-fields').onchange=render;
function resetFields(){selectedTools=[];for(const id of ['query','country','industry','tool','category','min-employees','max-employees'])$(id).value='';$('scope').value='all';$('state').value='Yes';$('confidence').value='50';$('tool-match').value='all';$('all-fields').checked=false;}
$('clear').onclick=()=>{resetFields();loadView();};$('excel').onclick=()=>download('xlsx');$('json').onclick=()=>download('json');$('close-detail').onclick=()=>$('detail').close();
bootstrap().catch(e=>toast(e.message));
