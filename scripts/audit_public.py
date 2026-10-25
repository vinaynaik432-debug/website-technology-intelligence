"""Review an explicit public inventory; never include arbitrary workspace files."""
import hashlib
import json
import re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
FILES=['.gitignore','README.md','LICENSE','SECURITY.md','requirements.txt','Start Dashboard.command','app.py']
TREES=['intelligence','static','examples','tests','docs']
SCRIPTS=['scripts/build_demo.py','scripts/audit_public.py','scripts/build-workbook.mjs']
# Construct sensitive patterns from fragments so this scanner does not flag itself.
PATTERNS={
 'GitHub credential':re.compile(r'(?:gh[pousr]_' + r'[A-Za-z0-9]{20,}|github_' + r'pat_[A-Za-z0-9_]{20,})'),
 'Apify credential':re.compile(r'apify_' + r'api_[A-Za-z0-9_-]{12,}'),
 'Private key':re.compile('-----BEGIN '+r'(?:RSA |EC |OPENSSH )?PRIVATE KEY-----'),
 'Local personal path':re.compile('/'+'Users/'+r'[^/\s]+/|/'+'home/'+r'[^/\s]+/'),
 'Personal email':re.compile(r'[A-Za-z0-9._%+-]+@'+r'(?:gmail|outlook|hotmail|yahoo)\.com'),
 'Live Apify run':re.compile('console.apify.com/actors/' + r'runs/[A-Za-z0-9]{10,}'),
}
def inventory():
 paths=[ROOT/p for p in FILES+SCRIPTS]
 for tree in TREES:
  paths.extend(p for p in (ROOT/tree).rglob('*') if p.is_file() and '__pycache__' not in p.parts and p.suffix not in {'.pyc','.log'} and p.name!='.DS_Store')
 return sorted(set(paths))
def audit():
 manifest=[];failures=[]
 for p in inventory():
  rel=p.relative_to(ROOT).as_posix()
  if not p.is_file() or p.is_symlink():failures.append(rel+': missing file or symlink');continue
  b=p.read_bytes()
  if len(b)>2_000_000:failures.append(rel+': unexpectedly large')
  if p.suffix!='.png':
   text=b.decode('utf-8')
   for label,pattern in PATTERNS.items():
    if pattern.search(text):failures.append(rel+': '+label)
  manifest.append({'path':rel,'sha256':hashlib.sha256(b).hexdigest(),'bytes':len(b)})
 if failures:raise SystemExit('\n'.join(failures))
 (ROOT/'.tools').mkdir(exist_ok=True)
 (ROOT/'.tools/public-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
 print(json.dumps({'files':len(manifest),'bytes':sum(x['bytes'] for x in manifest),'paths':[x['path'] for x in manifest]},indent=2))
if __name__=='__main__':audit()
