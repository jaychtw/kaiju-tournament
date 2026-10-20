"""Recreate visual QA and an animated preview from the actual export pipeline."""
from pathlib import Path
import subprocess
from PIL import Image, ImageDraw, ImageFont
from render import Compositor

ROOT = Path(__file__).resolve().parents[1]


def main():
    c = Compositor(); output = ROOT / 'output'; output.mkdir(exist_ok=True)
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 22)
    except OSError:
        font = ImageFont.load_default()
    times = [0, 2.65, 3.8, 5.05, 5.3, 7.3]
    sheet = Image.new('RGB', (1800, 800), '#173438')
    for i, t in enumerate(times):
        image = c.frame(t); image.thumbnail((600, 400), Image.Resampling.LANCZOS)
        sheet.paste(image, ((i % 3) * 600, (i // 3) * 400))
    sheet.save(output / 'phase-contact-sheet.jpg', quality=94)
    c.frame(0).save(output / 'frame-0.00.png')
    c.frame(5.05).save(output / 'contact-frame.png')
    board = Image.new('RGB', (2400, 840), '#173438')
    with Image.open(ROOT / 'assets/benchmark.png') as target:
        board.paste(target.convert('RGB').resize((1200, 800), Image.Resampling.LANCZOS), (0, 40))
    board.paste(c.frame(0), (1200, 40))
    d = ImageDraw.Draw(board)
    d.text((20, 8), 'APPROVED SAMPLE 03 — unchanged benchmark', font=font, fill='#fff0c9')
    d.text((1220, 8), 'ACTUAL REUSABLE FRAME OUTPUT — effects off', font=font, fill='#fff0c9')
    board.save(output / 'target-vs-result.jpg', quality=95)
    qa = Image.new('RGB', (1800, 800), '#f4efdf')
    for row, color in enumerate(['#f4efdf', '#152b35']):
        for col, key in enumerate(['k_guard_2', 'k_strike_1', 'g_reaction_1']):
            tile = Image.new('RGBA', (600, 400), color)
            with Image.open(ROOT / c.assets['frames'][key]['file']) as source:
                image = source.convert('RGBA'); image.thumbnail((560, 360), Image.Resampling.LANCZOS)
            tile.alpha_composite(image, ((600 - image.width) // 2, (400 - image.height) // 2))
            ImageDraw.Draw(tile).text((10, 8), key, font=font, fill='#244c47' if row == 0 else '#f4efdf')
            qa.paste(tile.convert('RGB'), (col * 600, row * 400))
    qa.save(output / 'alpha-matte-check.jpg', quality=95)
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(output / 'motion-study.mp4'),
        '-vf', 'fps=12,scale=720:480:flags=lanczos', '-an', '-c:v', 'libwebp_anim', '-quality', '80',
        '-compression_level', '5', '-loop', '0', str(output / 'motion-study.webp')], check=True)
    print('Recreated comparisons and 720×480 animated preview from the actual source/export pipeline.')


if __name__ == '__main__':
    main()
