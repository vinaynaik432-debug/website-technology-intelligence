/* Shared browser engine. No network access, credentials, or storage. */
(function(root){
  const labels={Yes:'Detected',No:'Not detected',Unknown:'Unknown'};
  function state(company,{name=null,category=null,scope='all',confidence=50}={}) {
    const matches=company.technologies.filter(t=>(name===null||t.name===name)&&(category===null||t.categories.includes(category))&&(scope==='all'||t.location===scope));
    if(matches.some(t=>typeof t.confidence==='number'&&t.confidence>=confidence))return 'Yes';
    if(matches.length||company.scan_status!=='Complete')return 'Unknown';
    return 'No';
  }
  function catalog(report){const map=new Map();for(const c of report.companies)for(const t of c.technologies){if(!map.has(t.name))map.set(t.name,new Set());t.categories.forEach(x=>map.get(t.name).add(x));}return [...map].map(([name,cats])=>({name,categories:[...cats].sort()})).sort((a,b)=>a.name.toLowerCase().localeCompare(b.name.toLowerCase()));}
  function select(report,f={}) {
    const tools=f.tools||[],categories=f.categories||[],states=f.states||['Yes'];
    return report.companies.filter(c=>{
      if(f.query&&!(c.facts.Company+' '+c.domain).toLowerCase().includes(f.query.toLowerCase()))return false;
      if(f.country&&c.facts['HQ country']!==f.country)return false;
      if(f.industry&&c.facts.Industry!==f.industry)return false;
      for(const [key,compare] of [['min_employees',(a,b)=>a>=b],['max_employees',(a,b)=>a<=b]])if(f[key]!==''&&f[key]!=null){const size=c.facts['Employees on LinkedIn'];if(typeof size!=='number'||!compare(size,Number(f[key])))return false;}
      const matches=tools.map(name=>states.includes(state(c,{...f,name})));
      if(matches.length&&!(f.tool_match==='any'?matches.some(Boolean):matches.every(Boolean)))return false;
      return categories.every(category=>states.includes(state(c,{...f,category})));
    });
  }
  function table(report,companies,f={},raw=false) {
    const tools=catalog(report),cats=[...new Set(tools.flatMap(t=>t.categories))].sort();
    const facts=Object.keys(report.companies[0]?.facts||{});
    const headers=[...facts,'Evidence scope','Minimum detection confidence','Technology run source','Firmographics run source',...cats.map(x=>'Category | '+x),...tools.map(t=>'Tool | '+t.categories.join(', ')+' | '+t.name)];
    const rows=companies.map(c=>[...facts.map(k=>c.facts[k]),f.scope||'all',f.confidence??50,report.mode==='synthetic'?'Synthetic demonstration':report.manifest?.runs?.technology?.url||'Saved test snapshot (private run IDs omitted)',report.mode==='synthetic'?'Synthetic demonstration':report.manifest?.runs?.firmographics?.url||'Saved test snapshot (private run IDs omitted)',...cats.map(category=>labels[state(c,{...f,category})]),...tools.map(t=>labels[state(c,{...f,name:t.name})])]);
    if(raw&&report.mode==='live'){for(const [label,key] of [['Full company source JSON','raw_company'],['Full technology source JSON','raw_technology']]){const values=companies.map(c=>JSON.stringify(c[key]||[])),count=Math.max(1,...values.map(v=>Math.ceil(v.length/12000)));for(let chunk=0;chunk<count;chunk++){headers.push(label+' '+(chunk+1));rows.forEach((r,i)=>r.push(values[i].slice(chunk*12000,(chunk+1)*12000)));}}}
    return {headers,rows,metadata_count:facts.length+4,state_count:tools.length+cats.length,scope:f.scope||'all',confidence:f.confidence??50,created_at:report.created_at,mode:report.mode};
  }
  function brief(company,f={}) {
    const names=f.tools||[],matched=[],unknown=[],missing=[];
    for(const name of names){const s=state(company,{...f,name});(s==='Yes'?matched:s==='Unknown'?unknown:missing).push(name);}
    const dns=company.technologies.filter(t=>matched.includes(t.name)&&t.location==='dns'&&(f.scope||'all')!=='website').map(t=>t.name);
    let assessment=names.length?`${matched.length} of ${names.length} selected tool signals detected.`:'Choose target tools to build a specific research rationale.';
    if(unknown.length)assessment+=` Needs verification: ${unknown.join(', ')}.`;
    if(missing.length)assessment+=` Not detected in this scan: ${missing.join(', ')}.`;
    const next=dns.length?`Verify current use and the responsible team for ${[...new Set(dns)].join(', ')}; DNS verification can remain after a service is discontinued.`:company.scan_status!=='Complete'?'Resolve the incomplete scan or use another sourced record before claiming tool adoption.':'Verify the relevant team, current workflow and business need before outreach.';
    return {assessment,next,angle:matched.length>1?`Research whether an integration or handoff between ${matched.join(' and ')} is relevant. This is a hypothesis to validate, not a detected pain point.`:matched.length?`Research a use case connected to ${matched[0]}; do not assume dissatisfaction with the current tool.`:'No tool-based outreach angle is supported by the current selection.'};
  }
  const engine={state,catalog,select,table,brief,labels};root.ResearchEngine=engine;if(typeof module!=='undefined')module.exports=engine;
})(typeof window==='undefined'?globalThis:window);
