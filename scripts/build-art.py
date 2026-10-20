"""Reproducible runtime exports. Raw generated art is kept in assets/source.

Component extraction removes transparent padding and detached accent droplets.
It does not redraw, interpolate, or rig anatomy. Four fixed pose states per view.
"""
from pathlib import Path
import json, hashlib
from PIL import Image
import numpy as np
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT/'public/art'
TRIAL = ROOT/'experiments/animation-trial'
OUT.mkdir(parents=True, exist_ok=True)
manifest = {'version': 1, 'arena': 'art/arena.webp', 'grounds': 'art/grounds.webp', 'characters': {}}
provenance = {'processing': 'Four connected bodies at alpha>=128; retain alpha fringe in 3px dilation; alpha<4 removed; crop padding; one constant resize per view; WebP quality87. No anatomical redraw.', 'sources': {}}
def digest(path): return hashlib.sha256(path.read_bytes()).hexdigest()
def export(image, filename, pivot, scale=1):
    if scale != 1:
        image = image.resize((round(image.width*scale),round(image.height*scale)),Image.Resampling.LANCZOS)
        pivot = [round(v*scale) for v in pivot]
    target = OUT/filename
    image.save(target,quality=87,method=5)
    return {'file': f'art/{filename}', 'size': list(image.size), 'pivot': pivot, 'bytes': target.stat().st_size, 'sha256': digest(target)}

# Reuse approved trial drawings and their manually registered support-foot pivots.
trial = json.loads((TRIAL/'assets.json').read_text())
for key,frame in trial['frames'].items():
    actor = frame['actor']; view = 'rear' if actor=='komodor' else 'front'
    manifest['characters'].setdefault(actor,{}) .setdefault(view,{})[key] = export(Image.open(TRIAL/frame['file']),f'{key}.webp',frame['pivot'])

for source in sorted((ROOT/'assets/source').glob('*-*.png')):
    actor,view = source.stem.rsplit('-',1)
    if view not in ['front','rear']: continue
    image = Image.open(source).convert('RGBA'); raw = np.asarray(image.getchannel('A'))
    labels,count = ndimage.label(raw >= 128); areas = np.bincount(labels.ravel())
    bodies=[]
    for label,slices in enumerate(ndimage.find_objects(labels),1):
        if areas[label]>5000:
            ys,xs=slices; bodies.append({'label':label,'box':[xs.start,ys.start,xs.stop,ys.stop]})
    if len(bodies)!=4: raise ValueError(f'{source.name}: expected four bodies, got {len(bodies)}')
    bodies.sort(key=lambda b:(b['box'][1]+b['box'][3])/2)
    bodies=sorted(bodies[:2],key=lambda b:b['box'][0])+sorted(bodies[2:],key=lambda b:b['box'][0])
    idle=bodies[0]['box']; scale=min(500/(idle[3]-idle[1]),690/(idle[2]-idle[0]),1.15)
    records=[]; output={}
    for state,body in zip(['idle','guard','attack','hit'],bodies):
        x0,y0,x1,y1=body['box']; trim=(max(0,x0-5),max(0,y0-5),min(image.width,x1+5),min(image.height,y1+5))
        mask=ndimage.binary_dilation(labels==body['label'],iterations=3)
        alpha=np.where(mask,raw,0).astype('uint8');alpha[alpha<4]=0
        copy=image.copy();copy.putalpha(Image.fromarray(alpha));copy=copy.crop(trim)
        # Register the right support area; per-pose numbers are recorded below.
        low_y=np.nonzero((labels==body['label']) & (np.indices(raw.shape)[0]>y1-25))[1]
        pivot=[round(float(np.quantile(low_y,.7)))-trim[0],y1-trim[1]-5]
        output[state]=export(copy,f'{actor}-{view}-{state}.webp',pivot,scale)
        records.append({'state':state,'trim':list(trim),'pivot_before_resize':pivot,'touches_source_edge':min(x0,y0,image.width-x1,image.height-y1)==0})
    manifest['characters'].setdefault(actor,{})[view]=output
    provenance['sources'][str(source.relative_to(ROOT))]={'sha256':digest(source),'size':list(image.size),'constant_scale':scale,'registration':records}

for name,path in [('arena',TRIAL/'assets/arena.png'),('grounds',ROOT/'assets/source/grounds.png')]:
    if path.exists():
        target=OUT/f'{name}.webp';Image.open(path).convert('RGB').save(target,quality=87,method=5)
        provenance['sources'][str(path.relative_to(ROOT))]={'sha256':digest(path)}
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
(ROOT/'assets/export-map.json').write_text(json.dumps(provenance,indent=2)+'\n')
print(json.dumps({'views':{actor:list(views) for actor,views in manifest['characters'].items()},'bytes':sum(p.stat().st_size for p in OUT.iterdir() if p.is_file())},indent=2))
