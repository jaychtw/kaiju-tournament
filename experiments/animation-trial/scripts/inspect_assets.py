"""Inspect generated alpha assets without changing their pixels.

Usage: python scripts/inspect_assets.py assets/source/*.png
This is asset QA, not an assertion that the character drawing is correct.
"""
from pathlib import Path
import hashlib
import json
import sys
from PIL import Image


def inspect(path):
    path = Path(path)
    with Image.open(path) as image:
        image.load()
        alpha = image.getchannel('A') if image.mode == 'RGBA' else None
        hist = alpha.histogram() if alpha else None
        pixels = image.width * image.height
        return {
            'file': str(path), 'size': list(image.size), 'mode': image.mode,
            'bytes': path.stat().st_size,
            'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
            'decoded_rgba_bytes': pixels * 4,
            'has_alpha': alpha is not None,
            'transparent_pixels': hist[0] if hist else 0,
            'soft_alpha_pixels': sum(hist[1:255]) if hist else 0,
            'alpha_bbox': list(alpha.getbbox()) if alpha and alpha.getbbox() else None,
            'edge_alpha_max': max(
                image.getchannel('A').crop(box).getextrema()[1]
                for box in [(0, 0, image.width, 1), (0, image.height - 1, image.width, image.height),
                            (0, 0, 1, image.height), (image.width - 1, 0, image.width, image.height)]
            ) if alpha else None,
        }


if __name__ == '__main__':
    print(json.dumps([inspect(p) for p in sys.argv[1:]], indent=2))
