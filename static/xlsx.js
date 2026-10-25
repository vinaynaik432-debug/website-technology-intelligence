/* Minimal dependency-free OOXML writer for the public demo. Values are literal strings/numbers, never formulas. */
(function(root){
 const encode=s=>new TextEncoder().encode(s);
 const cellText=v=>{let s=String(v??'').replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\uFFFE\uFFFF]/g,'');if(s.length>16000)s=s.slice(0,15900).replace(/[\uD800-\uDBFF]$/,'')+' [See full source JSON columns]';return s;};
 const xml=s=>cellText(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
 const col=n=>{let s='';for(n++;n;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s;};
 function crc32(bytes){let crc=0xffffffff;for(const b of bytes){crc^=b;for(let j=0;j<8;j++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return (crc^0xffffffff)>>>0;}
 function zip(files){
  const chunks=[],central=[];let offset=0;
  for(const [name,content] of Object.entries(files)){
   const n=encode(name),b=encode(content),crc=crc32(b),head=new Uint8Array(30+n.length),h=new DataView(head.buffer);
   h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x800,true);h.setUint16(12,33,true);h.setUint32(14,crc,true);h.setUint32(18,b.length,true);h.setUint32(22,b.length,true);h.setUint16(26,n.length,true);head.set(n,30);chunks.push(head,b);
   const c=new Uint8Array(46+n.length),v=new DataView(c.buffer);v.setUint32(0,0x02014b50,true);v.setUint16(4,20,true);v.setUint16(6,20,true);v.setUint16(8,0x800,true);v.setUint16(14,33,true);v.setUint32(16,crc,true);v.setUint32(20,b.length,true);v.setUint32(24,b.length,true);v.setUint16(28,n.length,true);v.setUint32(42,offset,true);c.set(n,46);central.push(c);offset+=head.length+b.length;
  }
  const size=central.reduce((a,c)=>a+c.length,0),end=new Uint8Array(22),v=new DataView(end.buffer);v.setUint32(0,0x06054b50,true);v.setUint16(8,central.length,true);v.setUint16(10,central.length,true);v.setUint32(12,size,true);v.setUint32(16,offset,true);chunks.push(...central,end);
  const out=new Uint8Array(offset+size+22);let pos=0;for(const c of chunks){out.set(c,pos);pos+=c.length;}return out;
 }
 function workbook(table){
  const rows=[[table.mode==='synthetic'?'SYNTHETIC DEMO — fictional companies and observations':table.mode==='public-snapshot'?'SAVED TEST RUN — public company signals; private run identifiers omitted':'YOUR APIFY RESEARCH — public signals, not confirmed active use'],['Detected means a public signal, not confirmed active use.'],[`Scope: ${table.scope}; minimum match score: ${table.confidence}; ${table.created_at}`],[],table.headers,...table.rows];
  const last=col(table.headers.length-1),range=`A5:${last}${rows.length}`;
  const rowxml=rows.map((r,i)=>`<row r="${i+1}">${r.map((value,j)=>{const ref=col(j)+(i+1),s=i===4?' s="1"':'';return typeof value==='number'&&Number.isFinite(value)?`<c r="${ref}"${s}><v>${value}</v></c>`:`<c r="${ref}" t="inlineStr"${s}><is><t xml:space="preserve">${xml(value)}</t></is></c>`;}).join('')}</row>`).join('');
  const ns='http://schemas.openxmlformats.org/spreadsheetml/2006/main';
  return zip({
   '[Content_Types].xml':`<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,
   '_rels/.rels':'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
   'xl/workbook.xml':`<workbook xmlns="${ns}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Companies" sheetId="1" r:id="rId1"/></sheets></workbook>`,
   'xl/_rels/workbook.xml.rels':'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>',
   'xl/styles.xml':`<styleSheet xmlns="${ns}"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF183B49"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`,
   'xl/worksheets/sheet1.xml':`<worksheet xmlns="${ns}"><dimension ref="A1:${last}${rows.length}"/><sheetViews><sheetView workbookViewId="0"><pane xSplit="2" ySplit="5" topLeftCell="C6" activePane="bottomRight" state="frozen"/></sheetView></sheetViews><cols><col min="1" max="${table.headers.length}" width="25" customWidth="1"/></cols><sheetData>${rowxml}</sheetData><autoFilter ref="${range}"/></worksheet>`
  });
 }
 root.DemoWorkbook=workbook;if(typeof module!=='undefined')module.exports=workbook;
})(typeof window==='undefined'?globalThis:window);
