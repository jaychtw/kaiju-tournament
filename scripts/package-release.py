"""Package the already-built static game, excluding all source/research assets."""
from pathlib import Path
import json,hashlib,zipfile
R=Path(__file__).resolve().parents[1];D=R/'dist';O=R/'release';O.mkdir(exist_ok=True)
version=json.loads((R/'package.json').read_text())['version'];name=f'world-kaiju-tournament-v{version}.zip'
assert (D/'index.html').exists() and (D/'art/manifest.json').exists()
files=sorted(p for p in D.rglob('*') if p.is_file())
manifest={'version':version,'files':[{'file':str(p.relative_to(D)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in files]}
(O/'build-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
start='''WORLD KAIJU TOURNAMENT — v1.0 release candidate

This folder contains the built browser game. No npm/build step is required.
Serve this folder over HTTP. Do not double-click index.html (file://).

If Python is installed, open a terminal in this folder and run:
  python -m http.server 8080
Then visit http://localhost:8080 in your browser.
Any ordinary static HTTP/HTTPS server also works.

選擇怪獸，用 WASD／方向鍵或觸控移動，靠近對手發起挑戰。
攻擊 A／防守 D，接著在三秒內反覆按空白鍵或連點大按鈕。
防守存活後，下回合必須使用蓄力攻擊。完成五場即可查看排名。

Choose a kaiju, explore, challenge five rivals, and see your placement.
Move: WASD/arrows, tap the plaza, or hold direction buttons.
Battle: A Attack / D Defend, then mash Space or the big touch button for 3s.
Defend and survive to charge your mandatory next Attack x1.5.
EN / 繁中 switches language. Finished matches save in this browser.

Source, known limitations and hosting instructions:
https://github.com/jaychtw/kaiju-tournament
'''
with zipfile.ZipFile(O/name,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for filename,data in [(f'world-kaiju-tournament/{p.relative_to(D)}',p.read_bytes()) for p in files]+[('world-kaiju-tournament/START-HERE.txt',start.encode())]:
        info=zipfile.ZipInfo(filename,(2026,10,20,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o644<<16;z.writestr(info,data)
with zipfile.ZipFile(O/name) as z:
    assert z.testzip() is None
    for entry in manifest['files']:
        assert hashlib.sha256(z.read('world-kaiju-tournament/'+entry['file'])).hexdigest()==entry['sha256']
(O/'SHA256SUMS').write_text(hashlib.sha256((O/name).read_bytes()).hexdigest()+f'  {name}\n')
print(json.dumps({'archive':name,'bytes':(O/name).stat().st_size,'runtime_files':len(files),'crc_and_all_file_hashes':'verified'}))
