import fs from 'node:fs/promises';
import path from 'node:path';
import { Workbook, SpreadsheetFile } from '@oai/artifact-tool';

const [input, output, mode] = process.argv.slice(2);
const data = JSON.parse(await fs.readFile(input, 'utf8'));
const wb = Workbook.create();
const ws = wb.worksheets.add('Companies');
ws.showGridLines = false;
ws.tabColor = '#183B49';
function col(n) { let s = ''; for (n++; n; n = Math.floor((n-1)/26)) s = String.fromCharCode(65+(n-1)%26)+s; return s; }
function safe(v) {
  if (typeof v !== 'string') return v;
  v = v.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '');
  if (/^[=+\-@\t\r]/.test(v)) v = "'"+v;
  return v.length > 16000 ? v.slice(0,15900)+' [See full source JSON columns]' : v;
}
const rows = data.rows.map(row => row.map((v,i) => {
  if (data.headers[i].includes('checked (UTC)') && typeof v === 'string' && /^\d{4}-\d\d-\d\dT/.test(v)) return new Date(v);
  return safe(v);
}));
const lastCol = col(data.headers.length-1), lastRow = 7+rows.length;
ws.getRange('A2').values = [['Website technology intelligence']];
ws.getRange('A2').format.font = {name:'Arial',size:14,bold:true,color:'#183B49'};
ws.getRange('A3').values = [['Detected = matching signal; Not detected = absent from this scan; Unknown = incomplete or weak evidence.']];
ws.getRange('A4').values = [['DNS records are signals, not proof of active use. Employee counts reflect LinkedIn profiles; offices may be incomplete.']];
ws.getRange('A5').values = [[`Evidence scope: ${data.scope} · Minimum confidence: ${data.confidence} · Collected: ${data.created_at}`]];
ws.getRange('A3:L5').format = {font:{name:'Arial',size:10,color:'#566B78'},rowHeight:22,wrapText:false};
ws.getRange(`A7:${lastCol}${lastRow}`).values = [data.headers, ...rows];
ws.getRange(`A7:${lastCol}${lastRow}`).format = {font:{name:'Arial',size:10,color:'#203846'},verticalAlignment:'center',wrapText:true};
if(rows.length) {
  const table = ws.tables.add(`A7:${lastCol}${lastRow}`, true, 'CompanyIntelligence');
  table.showFilterButton = true;
  ws.getRange(`A8:${lastCol}${lastRow}`).format.rowHeight = 42;
}
ws.getRange(`A7:${lastCol}7`).format = {fill:'#183B49',font:{name:'Arial',size:10,bold:true,color:'#FFFFFF'},horizontalAlignment:'center',verticalAlignment:'center',wrapText:true,rowHeight:62};
for(let i=0;i<data.headers.length;i++) {
  const h=data.headers[i];
  ws.getRangeByIndexes(0,i,lastRow,1).format.columnWidth = h.startsWith('Full ') || h==='Description' ? 45 : (i<data.metadata_count ? 26 : 22);
  if(rows.length && h.includes('checked (UTC)')) ws.getRange(`${col(i)}8:${col(i)}${lastRow}`).setNumberFormat('dd mmm yyyy hh:mm');
  if(rows.length && ['Founded year','Employees on LinkedIn','Employee range minimum','Employee range maximum'].includes(h)) ws.getRange(`${col(i)}8:${col(i)}${lastRow}`).setNumberFormat(h==='Founded year'?'0':'#,##0');
  if(rows.length && h==='Total funding (USD)') ws.getRange(`${col(i)}8:${col(i)}${lastRow}`).setNumberFormat('$#,##0');
}
if(rows.length && data.state_count) {
  const grid=ws.getRange(`${col(data.metadata_count)}8:${col(data.metadata_count+data.state_count-1)}${lastRow}`);
  grid.dataValidation={rule:{type:'list',values:['Detected','Not detected','Unknown']}};
  grid.format.horizontalAlignment='center';
  grid.conditionalFormats.add('containsText',{text:'Detected',format:{fill:'#E2F1EA',font:{color:'#18533D'}}});
  grid.conditionalFormats.add('containsText',{text:'Unknown',format:{fill:'#FFF1D6',font:{color:'#77551D'}}});
}
ws.freezePanes.freezeRows(7);
ws.freezePanes.freezeColumns(2);
wb.recalculate();
await fs.mkdir(path.dirname(output),{recursive:true});
const check=await wb.inspect({kind:'table',range:`Companies!A7:H${Math.min(lastRow,12)}`,include:'values,formulas',tableMaxRows:6,tableMaxCols:8,maxChars:2500});
await fs.writeFile(output+'.inspect.ndjson',check.ndjson);
if(mode==='preview') {
  for(const [name,range] of [['companies',`A2:H${Math.min(lastRow,12)}`],['tools',`${col(data.metadata_count)}7:${col(Math.min(data.metadata_count+7,data.headers.length-1))}${Math.min(lastRow,12)}`]]) {
    const blob=await wb.render({sheetName:'Companies',range,scale:1.5,format:'png'});
    await fs.writeFile(path.join(path.dirname(output),name+'-preview.png'),new Uint8Array(await blob.arrayBuffer()));
  }
}
await (await SpreadsheetFile.exportXlsx(wb)).save(output);
console.log(JSON.stringify({rows:rows.length,columns:data.headers.length,output}));
