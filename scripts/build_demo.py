"""Build GitHub Pages from fictional fixtures and the reviewed public snapshot."""
import json
import shutil
import sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from intelligence.model import normalize

def build():
    report=normalize(ROOT/'examples/demo')
    if report['mode']!='synthetic' or any(not c['domain'].endswith('.example.com') for c in report['companies']):
        raise ValueError('Pages accepts only the fictional example.com fixture. Never publish local research.')
    dest=ROOT/'docs';dest.mkdir(exist_ok=True)
    for name in ['app.js','style.css','engine.js','xlsx.js','browser-apify.js']:
        shutil.copyfile(ROOT/'static'/name,dest/name)
    html=(ROOT/'static/index.html').read_text().replace('data-mode="local"','data-mode="demo"')
    html=html.replace('<div id="live-controls">','<div id="live-controls" hidden>')
    html=html.replace('<section id="experience-choice" class="experience-choice" hidden','<section id="experience-choice" class="experience-choice"')
    html=html.replace('<div id="demo-controls" hidden>','<div id="demo-controls">')
    html=html.replace('<span class="local-badge" id="mode-badge"><span></span> Runs on your computer</span>','<span class="local-badge" id="mode-badge">Explore sample or use your own token</span>')
    html=html.replace('<script src="./app.js" defer></script>','<script src="./demo-data.js" defer></script><script src="./test-data.js" defer></script><script src="./browser-apify.js" defer></script><script src="./app.js" defer></script>')
    html=html.replace('<meta name="description"', '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\'; style-src \'self\'; connect-src https://api.apify.com; img-src \'self\' data:; object-src \'none\'; base-uri \'none\'; form-action \'none\'"><meta name="description"')
    (dest/'index.html').write_text(html)
    (dest/'demo-data.js').write_text('/* Fictional portfolio demonstration; not company research. */\nwindow.DEMO_REPORT = '+json.dumps(report,ensure_ascii=False,indent=2).replace('<','\\u003c')+';\n')
    sample=json.loads((ROOT/'examples/public-test/report.json').read_text())
    if sample.get('mode')!='public-snapshot' or any('raw_company' in c or 'raw_technology' in c for c in sample['companies']) or 'manifest' in sample:
        raise ValueError('Use the reviewed, sanitized public snapshot only.')
    (dest/'test-data.js').write_text('/* Reviewed public snapshot; private run IDs and raw records omitted. */\nwindow.TEST_REPORT = '+json.dumps(sample,ensure_ascii=False,indent=2).replace('<','\\u003c')+';\n')
    (dest/'.nojekyll').write_text('')
    print(f'Built public site: {len(report["companies"])} fictional companies and {len(sample["companies"])} sanitized test-run companies.')

if __name__=='__main__':build()
