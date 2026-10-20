"""Deterministic frame composition from alpha drawings + timeline.json.

The browser reviewer uses the same cue sampling, frame IDs, pivots and positions.
There is no generative video step. Exports contain the actual reusable assets.
"""
from pathlib import Path
import argparse
import json
import math
import subprocess
import time
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]


def sample(cues, t):
    cue = cues[0]
    for candidate in cues:
        if candidate['t'] > t:
            break
        cue = candidate
    return cue


def phase_at(timeline, t):
    return sample(timeline['phases'], t)['label']


class Compositor:
    def __init__(self):
        self.assets = json.loads((ROOT / 'assets.json').read_text())
        self.timeline = json.loads((ROOT / 'timeline.json').read_text())
        self.size = tuple(self.timeline['size'])
        self.arena = Image.open(ROOT / self.timeline['arena']).convert('RGBA').resize(self.size, Image.Resampling.LANCZOS)
        self.frames = {}
        for name, info in self.assets['frames'].items():
            image = Image.open(ROOT / info['file']).convert('RGBA')
            scale = self.timeline['actors'][info['actor']]['scale']
            self.frames[name] = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
        try:
            self.font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 16)
        except OSError:
            self.font = ImageFont.load_default()

    def frame(self, t, effects=False, guides=False):
        canvas = self.arena.copy()
        shadow = Image.new('RGBA', self.size)
        draw = ImageDraw.Draw(shadow)
        active = {}
        for name, actor in self.timeline['actors'].items():
            cue = sample(actor['cues'], t)
            active[name] = cue
            x, y = cue['root']
            offset = actor.get('shadow_offset', [0, 0])
            x += offset[0]; y += offset[1]
            radius = actor['shadow']
            draw.ellipse((x - radius[0], y - radius[1], x + radius[0], y + radius[1]), fill=(40, 44, 49, 55))
        shadow = shadow.filter(ImageFilter.GaussianBlur(9))
        canvas.alpha_composite(shadow)
        if effects and 3.4 < t < 5.0:
            layer = Image.new('RGBA', self.size)
            d = ImageDraw.Draw(layer)
            x, y = active['komodor']['root']
            d.ellipse((x - 90, y - 22, x + 90, y + 22), outline=(255, 191, 73, 150), width=3)
            canvas.alpha_composite(layer)
        # Explicit back-to-front ordering. No per-character animated scale,
        # rotation, shear, crossfade, whole-image wobble, or optical-flow frames.
        for name in self.timeline['draw_order']:
            actor = self.timeline['actors'][name]
            cue = active[name]
            info = self.assets['frames'][cue['frame']]
            x = round(cue['root'][0] - info['pivot'][0] * actor['scale'])
            y = round(cue['root'][1] - info['pivot'][1] * actor['scale'])
            canvas.alpha_composite(self.frames[cue['frame']], (x, y))
        if effects and 5.1 <= t < 5.25:
            d = ImageDraw.Draw(canvas)
            x, y = self.timeline['contacts']['counter']
            for angle in [-.6, .05, .7]:
                d.line((x + math.cos(angle) * 20, y + math.sin(angle) * 20,
                        x + math.cos(angle) * 60, y + math.sin(angle) * 60), fill='#fff0bc', width=3)
        d = ImageDraw.Draw(canvas)
        if guides:
            for name, cue in active.items():
                x, y = cue['root']; color = '#8cffe0' if name == 'komodor' else '#ffd68e'
                d.line((x - 50, y, x + 50, y), fill=color, width=2)
                d.ellipse((x - 5, y - 5, x + 5, y + 5), outline=color, width=2)
                d.text((x + 10, y + 10), cue['frame'], font=self.font, fill=color, stroke_width=1, stroke_fill='#183433')
        d.rectangle((12, 12, 388, 43), fill=(18, 41, 43, 210))
        d.text((23, 19), f'{t:04.1f}s  |  {phase_at(self.timeline, t)}', font=self.font, fill='#fff3d1')
        return canvas.convert('RGB')


def export_video(compositor, output, effects=False):
    width, height = compositor.size
    fps = compositor.timeline['fps']
    count = round(compositor.timeline['duration'] * fps)
    command = ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo',
               '-pix_fmt', 'rgb24', '-s', f'{width}x{height}', '-r', str(fps), '-i', '-',
               '-an', '-vf', 'scale=out_color_matrix=bt709', '-c:v', 'libx264', '-threads', '4',
               '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
               '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
               '-movflags', '+faststart', str(output)]
    process = subprocess.Popen(command, stdin=subprocess.PIPE)
    try:
        for index in range(count):
            process.stdin.write(compositor.frame(index / fps, effects=effects).tobytes())
        process.stdin.close()
        if process.wait() != 0:
            raise RuntimeError('FFmpeg video export failed')
    except BaseException:
        process.kill(); process.wait(); raise


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--effects', action='store_true')
    parser.add_argument('--still', type=float)
    parser.add_argument('--guides', action='store_true')
    args = parser.parse_args()
    started = time.perf_counter(); compositor = Compositor()
    output = ROOT / 'output'; output.mkdir(exist_ok=True)
    if args.still is not None:
        target = output / f"frame-{args.still:.2f}{'-guides' if args.guides else ''}.png"
        compositor.frame(args.still, effects=args.effects, guides=args.guides).save(target)
    else:
        target = output / ('motion-study-effects.mp4' if args.effects else 'motion-study.mp4')
        export_video(compositor, target, args.effects)
    print(json.dumps({'output': str(target.relative_to(ROOT)), 'bytes': target.stat().st_size,
                      'export_seconds': round(time.perf_counter() - started, 3)}))


if __name__ == '__main__':
    main()
