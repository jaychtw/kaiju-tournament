"""Crop generated pose sheets into inspectable alpha sprites.

No optical flow, painting, pose interpolation, rotation, or anatomical deformation
is performed here. Raw generated sources are preserved. Per-frame support-foot
pivots are explicitly recorded in source-map.json, not inferred from a changing
silhouette bounding box.
"""
from pathlib import Path
import hashlib
import json
import time
from PIL import Image
import numpy as np
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]


def main():
    started = time.perf_counter()
    spec = json.loads((ROOT / 'source-map.json').read_text())
    destination = ROOT / 'assets/frames'
    destination.mkdir(parents=True, exist_ok=True)
    result = {'version': 1, 'frames': {}, 'sources': {}}
    for source in spec['sheets']:
        path = ROOT / source['file']
        with Image.open(path) as original:
            if original.mode != 'RGBA':
                raise ValueError(f'{path.name}: expected real RGBA, got {original.mode}')
            sheet = original.copy()
        # Prompted quadrants were not reliable: toes/tails crossed boundaries.
        # Detect the four separate foreground bodies instead of cutting them.
        raw_alpha = np.asarray(sheet.getchannel('A'))
        labels, _ = ndimage.label(raw_alpha >= 128)
        areas = np.bincount(labels.ravel())
        objects = ndimage.find_objects(labels)
        bodies = []
        for label, slices in enumerate(objects, 1):
            if areas[label] > 2000:
                ys, xs = slices
                bodies.append({'label': label, 'box': [xs.start, ys.start, xs.stop, ys.stop],
                               'center': [(xs.start + xs.stop) / 2, (ys.start + ys.stop) / 2]})
        if len(bodies) != len(source['frames']):
            raise ValueError(f'{path.name}: expected {len(source["frames"])} separate bodies, got {len(bodies)}; inspect source')
        bodies.sort(key=lambda body: body['center'][1])
        bodies = sorted(bodies[:2], key=lambda body: body['center'][0]) + sorted(bodies[2:], key=lambda body: body['center'][0])
        result['sources'][source['file']] = {
            'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
            'size': list(sheet.size), 'bytes': path.stat().st_size,
            'detected_bodies': bodies,
        }
        for index, definition in enumerate(source['frames']):
            body = bodies[index]
            cell = sheet.copy()
            # Preserve the actual body and antialiasing. Remove other bodies
            # that might fall inside this body's rectangular bounding box.
            other = (labels > 0) & (labels != body['label'])
            blocked = ndimage.binary_dilation(other, iterations=3)
            mask = raw_alpha.copy()
            mask[blocked] = 0
            alpha = Image.fromarray(mask)
            # The generator's matte peaks at 254, and can leave 1–3 alpha dust.
            # A recorded, limited alpha-only normalization; RGB art is untouched.
            cleaned = alpha.point(lambda a: 0 if a < 4 else min(255, round(a * 255 / 254)))
            cell.putalpha(cleaned)
            x0, y0, x1, y1 = body['box']
            if min(x0, y0, sheet.width - x1, sheet.height - y1) == 0:
                raise ValueError(f"{definition['id']}: body touches source-image edge; inspect clipping")
            # Trimming removes transparent padding only; motion is not normalized
            # to a silhouette height, which would erase intentional crouches.
            trim = (x0 - 6, y0 - 6, x1 + 6, y1 + 6)
            frame = cell.crop(trim)
            filename = f"{definition['id']}.png"
            output = destination / filename
            frame.save(output, optimize=True)
            result['frames'][definition['id']] = {
                'file': f'assets/frames/{filename}', 'size': list(frame.size),
                'pivot': [definition['pivot'][0] - trim[0], definition['pivot'][1] - trim[1]],
                'source_pivot': definition['pivot'], 'source_pose_index': index,
                'trim': list(trim), 'source': source['file'],
                'pose': definition['pose'], 'actor': source['actor'],
                'bytes': output.stat().st_size,
                'decoded_rgba_bytes': frame.width * frame.height * 4,
                'sha256': hashlib.sha256(output.read_bytes()).hexdigest(),
            }
    result['summary'] = {
        'frame_count': len(result['frames']),
        'png_bytes': sum(f['bytes'] for f in result['frames'].values()),
        'decoded_rgba_bytes': sum(f['decoded_rgba_bytes'] for f in result['frames'].values()),
        'alpha_processing': 'connected bodies at alpha≥128; neighboring body masks removed; alpha<4→0; remaining alpha×255/254; no RGB edits',
    }
    (ROOT / 'assets.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({**result['summary'], 'build_seconds': round(time.perf_counter() - started, 3)}, indent=2))


if __name__ == '__main__':
    main()
