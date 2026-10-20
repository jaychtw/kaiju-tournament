"""Verify runtime files, identities/views, source hashes and download/memory budget."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,hashlib
R=Path(__file__).resolve().parents[1];P=R/'public';a=json.loads((P/'art/manifest.json').read_text());sources=json.loads((R/'assets/export-map.json').read_text())
ids=['komodor','grumbongo','kraken','hippocalypse','condorion','sssirPent']
views={};total=0;gallery=Image.new('RGB',(1800,1200),'#f2eddf');draw=ImageDraw.Draw(gallery)
for index,id in enumerate(ids):
    assert set(a['characters'][id])=={'front','rear'}
    for vi,view in enumerate(['front','rear']):
        frames=a['characters'][id][view];decoded=0
        for key,f in frames.items():
            p=P/f['file'];im=Image.open(p);assert list(im.size)==f['size'];assert im.mode=='RGBA';assert im.getchannel('A').getextrema()[0]==0
            assert hashlib.sha256(p.read_bytes()).hexdigest()==f['sha256'];decoded+=im.width*im.height*4;total+=p.stat().st_size
        views[f'{id}/{view}']={'frames':len(frames),'decoded_rgba_bytes':decoded}
        key='idle' if 'idle' in frames else 'k_idle_0' if id=='komodor' else 'g_attack_0';im=Image.open(P/frames[key]['file']);im.thumbnail((280,480),Image.Resampling.LANCZOS)
        x=index*300+10;y=vi*600+80;gallery.paste(im,(x+(280-im.width)//2,y+470-im.height),im)
        draw.text((x+10,vi*600+30),f'{id} / {view}',fill='#24473a')
for name in ['arena','grounds']:
    im=Image.open(P/a[name]);assert im.width>=1200;assert im.height>=800;total+=(P/a[name]).stat().st_size
for path,source in sources['sources'].items(): assert hashlib.sha256((R/path).read_bytes()).hexdigest()==source['sha256']
all_decoded=sum(v['decoded_rgba_bytes'] for v in views.values())+2*1536*1024*4
worst=max(views[f'{p}/rear']['decoded_rgba_bytes']+views[f'{e}/front']['decoded_rgba_bytes']+1536*1024*4+1200*800*4 for p in ids for e in ids if p!=e)
report={'views':views,'runtime_art_bytes':total,'all_art_decoded_rgba_bytes':all_decoded,'largest_match_images_plus_canvas_bytes':worst,'physical_mobile_verified':False,'note':'RGBA arithmetic only; excludes browser/GPU/process overhead and thumbnail copies. Application drops battle image references on leaving a match; browser cache/GC are implementation-dependent.'}
assert total<12*1024*1024;assert all_decoded<128*1024*1024
(R/'docs/release/art-validation.json').write_text(json.dumps(report,indent=2)+'\n');gallery.save(R/'docs/release/roster-views.jpg',quality=88)
print(json.dumps(report,indent=2))
