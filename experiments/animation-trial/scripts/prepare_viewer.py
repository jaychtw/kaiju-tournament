"""Create file://-compatible playback data and the lightweight review ZIP."""
from pathlib import Path
import json
import zipfile

ROOT = Path(__file__).resolve().parents[1]


def main():
    assets = json.loads((ROOT / 'assets.json').read_text())
    timeline = json.loads((ROOT / 'timeline.json').read_text())
    (ROOT / 'data.js').write_text('// Generated from assets.json and timeline.json; no fetch/server required.\n'
        + 'window.TRIAL_ASSETS = ' + json.dumps(assets, ensure_ascii=False) + ';\n'
        + 'window.TRIAL_TIMELINE = ' + json.dumps(timeline, ensure_ascii=False) + ';\n')
    paths = ['index.html', 'viewer.css', 'viewer.js', 'data.js', 'assets.json', 'timeline.json', 'source-map.json',
             'assets/arena.png', 'assets/benchmark.png', 'output/motion-study.mp4', 'output/motion-study-effects.mp4', 'output/frame-0.00.png']
    paths += [frame['file'] for frame in assets['frames'].values()]
    target = ROOT / 'output/animation-review.zip'
    with zipfile.ZipFile(target, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
        for relative in paths:
            data = (ROOT / relative).read_bytes()
            if relative == 'index.html':
                data = data.replace(b'../../docs/animation-trial/REPORT.md', b'https://github.com/jaychtw/kaiju-tournament/blob/main/docs/animation-trial/REPORT.md')
            info = zipfile.ZipInfo(relative, date_time=(2026, 10, 20, 0, 0, 0))
            info.external_attr = 0o100644 << 16; info.compress_type = zipfile.ZIP_DEFLATED
            archive.writestr(info, data)
        info = zipfile.ZipInfo('START-HERE.txt', date_time=(2026, 10, 20, 0, 0, 0))
        archive.writestr(info, 'Extract the entire ZIP. The video in output/motion-study.mp4 can be opened directly in a standard browser or video player; no development tools are needed.\n'
            'The optional asset viewer is index.html; it uses plain scripts and local PNGs, without fetch/modules/CDNs. Try opening it in an ordinary browser.\n'
            'This cloud managed browser blocks file:// pages, so direct local-file viewer launch is unverified. HTTP viewer playback was verified. If your browser blocks local pages, use the MP4 instead.\n'
            'The main MP4 is in output/motion-study.mp4. It is silent and 10 seconds long.\n'
            'This pack contains reusable alpha drawings and their actual timeline, not only a video.\n'
            'Raw generated sheets and reproducible export scripts are in the GitHub repository under experiments/animation-trial/.\n'
            'Artistic assessment: https://github.com/jaychtw/kaiju-tournament/blob/main/docs/animation-trial/REPORT.md\n'
            'This is an animation feasibility experiment, not approved production artwork or a playable game.\n')
    print(json.dumps({'review_zip': str(target.relative_to(ROOT)), 'bytes': target.stat().st_size, 'runtime_frames': len(assets['frames'])}))


if __name__ == '__main__':
    main()
