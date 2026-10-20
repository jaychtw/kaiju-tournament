"""Validate provenance, timings, export correspondence, and asset integrity.

These checks do not judge anatomical consistency or artistic acceptance.
"""
from pathlib import Path
import hashlib
import json
import subprocess
import sys
import numpy as np
from PIL import Image
from render import Compositor, sample

ROOT = Path(__file__).resolve().parents[1]
BENCHMARK_SHA256 = '0fc014a9fa7ec3f606c6ff9068bb6393ff728dba6d89a40c492405f0836a0934'


def main():
    results = {}
    for path in [ROOT / 'assets/benchmark.png', ROOT.parents[1] / 'docs/visual-direction/03-graphic-animation.png']:
        assert hashlib.sha256(path.read_bytes()).hexdigest() == BENCHMARK_SHA256, f'Benchmark changed: {path}'
    results['benchmark_unchanged'] = True
    compositor = Compositor(); assets = compositor.assets; timeline = compositor.timeline
    assert timeline['duration'] == 10
    assert timeline['fps'] == 30
    used = set()
    for actor, definition in timeline['actors'].items():
        cues = definition['cues']
        assert cues[0]['t'] == 0
        assert all(a['t'] < b['t'] for a, b in zip(cues, cues[1:])), actor
        assert all(0 <= cue['t'] < timeline['duration'] for cue in cues)
        assert all(assets['frames'][cue['frame']]['actor'] == actor for cue in cues)
        used.update(cue['frame'] for cue in cues)
    assert used == set(assets['frames']), 'Every exported drawing must be exercised in the study'
    hashes = set()
    for name, frame in assets['frames'].items():
        path = ROOT / frame['file']; digest = hashlib.sha256(path.read_bytes()).hexdigest()
        assert digest == frame['sha256'], name
        hashes.add(digest)
        with Image.open(path) as image:
            assert image.mode == 'RGBA' and list(image.size) == frame['size'], name
            assert image.getchannel('A').getextrema()[0] == 0, name
    assert len(hashes) == len(assets['frames']), 'Unexpected duplicated drawings'
    for relative, info in assets['sources'].items():
        assert hashlib.sha256((ROOT / relative).read_bytes()).hexdigest() == info['sha256']
    results['source_and_frame_hashes'] = 'pass'
    results['unique_reused_drawings'] = len(used)
    snapshots = [0, 80, 146, 155, 173, 290]
    for index in snapshots:
        t = index / timeline['fps']
        assert compositor.frame(t).tobytes() == compositor.frame(t).tobytes(), f'Non-deterministic render at {t}'
    results['deterministic_composition'] = True
    videos = []
    for name in ['motion-study.mp4', 'motion-study-effects.mp4']:
        path = ROOT / 'output' / name
        info = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v:0',
            '-show_entries', 'stream=codec_name,width,height,nb_read_frames,r_frame_rate,pix_fmt',
            '-show_entries', 'format=duration,size', '-of', 'json', str(path)]))
        stream = info['streams'][0]
        assert stream['codec_name'] == 'h264' and stream['pix_fmt'] == 'yuv420p'
        assert [stream['width'], stream['height']] == timeline['size']
        assert int(stream['nb_read_frames']) == 300
        assert abs(float(info['format']['duration']) - 10) < .04
        videos.append({'file': name, **info})
    results['videos'] = videos
    # The delivered video must contain the actual source/timeline compositor,
    # within ordinary H.264/YUV loss, rather than an independently generated clip.
    comparisons = []
    for index in [0, 155, 290]:
        raw = subprocess.check_output(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', str(ROOT / 'output/motion-study.mp4'),
            '-vf', f'select=eq(n\\,{index})', '-fps_mode', 'vfr', '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'])
        expected = np.asarray(compositor.frame(index / 30), dtype=np.int16)
        actual = np.frombuffer(raw, dtype=np.uint8).reshape(expected.shape).astype(np.int16)
        mae = float(np.abs(expected - actual).mean())
        assert mae < 5, f'Video/source mismatch at frame {index}: RGB mean absolute error {mae}'
        comparisons.append({'frame': index, 'rgb_mean_absolute_error': round(mae, 4)})
    results['video_matches_reusable_sources'] = comparisons
    results['artistic_acceptance'] = 'not determined by these checks; see report and inspect playback'
    output = ROOT / 'output/validation.json'
    output.write_text(json.dumps(results, indent=2) + '\n')
    print(json.dumps(results, indent=2))


if __name__ == '__main__':
    main()
