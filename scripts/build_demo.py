"""Build GitHub Pages exclusively from intentionally fictional fixtures and public assets."""
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
    for name in ['app.js','style.css','engine.js','xlsx.js']:
        shutil.copyfile(ROOT/'static'/name,dest/name)
    html=(ROOT/'static/index.html').read_text().replace('data-mode="local"','data-mode="demo"')
    # Public HTML contains no token input or live-research controls, even before JavaScript loads.
    start=html.index('<div id="live-controls">')
    end=html.index('<div id="demo-controls"',start)
    html=html[:start]+html[end:]
    # Shared JS uses inert, hidden placeholders; no credential field is included in the public page.
    placeholders='<div hidden id="live-controls"><button id="scan"></button><button id="retry"></button><input id="upload" type="file"><span id="scan-message"></span></div>'
    html=html.replace('</aside>',placeholders+'</aside>')
    html=html.replace('<div id="demo-controls" hidden>','<div id="demo-controls">')
    html=html.replace('<span class="local-badge" id="mode-badge"><span></span> Runs on your computer</span>','<span class="local-badge" id="mode-badge">Public demo · fictional data</span>')
    html=html.replace('<script src="./app.js" defer></script>','<script src="./demo-data.js" defer></script><script src="./app.js" defer></script>')
    html=html.replace('<meta name="description"', '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\'; style-src \'self\'; connect-src \'none\'; img-src \'self\' data:; object-src \'none\'; base-uri \'none\'; form-action \'none\'"><meta name="description"')
    (dest/'index.html').write_text(html)
    (dest/'demo-data.js').write_text('/* Fictional portfolio demonstration; not company research. */\nwindow.DEMO_REPORT = '+json.dumps(report,ensure_ascii=False,indent=2).replace('<','\\u003c')+';\n')
    (dest/'.nojekyll').write_text('')
    print(f'Built public demo: {len(report["companies"])} fictional companies, no live datasets.')

if __name__=='__main__':build()
