/* A small asset/timeline reviewer. No game engine or gameplay state. */
(() => {
  'use strict';
  const assets = window.TRIAL_ASSETS;
  const timeline = window.TRIAL_TIMELINE;
  const $ = id => document.getElementById(id);
  const canvas = $('study'), ctx = canvas.getContext('2d');
  const images = new Map();
  let time = 0, playing = false, last = 0, ready = false;
  function sample(cues, at) { let result = cues[0]; for (const candidate of cues) { if (candidate.t > at) break; result = candidate; } return result; }
  function ellipse(context, x, y, rx, ry, fill) { context.beginPath(); context.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); context.fillStyle = fill; context.fill(); }
  function draw() {
    if (!ready) return;
    const bg = $('background').value;
    if (bg === 'arena') ctx.drawImage(images.get(timeline.arena), 0, 0, ...timeline.size);
    else { ctx.fillStyle = bg === 'light' ? '#f5f0df' : '#17212b'; ctx.fillRect(0, 0, ...timeline.size); }
    const active = {};
    for (const [name, actor] of Object.entries(timeline.actors)) {
      const cue = sample(actor.cues, time); active[name] = cue;
      ctx.save(); ctx.filter = 'blur(9px)';
      const offset = actor.shadow_offset || [0, 0];
      ellipse(ctx, cue.root[0] + offset[0], cue.root[1] + offset[1], ...actor.shadow, 'rgba(40,44,49,.216)'); ctx.restore();
    }
    if ($('effects').checked && time > 3.4 && time < 5) {
      const [x, y] = active.komodor.root; ctx.strokeStyle = 'rgba(255,191,73,.59)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, y, 90, 22, 0, 0, Math.PI * 2); ctx.stroke();
    }
    for (const name of timeline.draw_order) {
      const actor = timeline.actors[name], cue = active[name], frame = assets.frames[cue.frame];
      const x = Math.round(cue.root[0] - frame.pivot[0] * actor.scale), y = Math.round(cue.root[1] - frame.pivot[1] * actor.scale);
      ctx.drawImage(images.get(frame.file), x, y, Math.round(frame.size[0] * actor.scale), Math.round(frame.size[1] * actor.scale));
    }
    if ($('effects').checked && time >= 5.1 && time < 5.25) {
      const [x, y] = timeline.contacts.counter; ctx.strokeStyle = '#fff0bc'; ctx.lineWidth = 3;
      for (const angle of [-.6, .05, .7]) { ctx.beginPath(); ctx.moveTo(x + Math.cos(angle) * 20, y + Math.sin(angle) * 20); ctx.lineTo(x + Math.cos(angle) * 60, y + Math.sin(angle) * 60); ctx.stroke(); }
    }
    if ($('guides').checked) for (const [name, cue] of Object.entries(active)) {
      const [x, y] = cue.root; ctx.strokeStyle = name === 'komodor' ? '#8cffe0' : '#ffd68e'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 50, y); ctx.lineTo(x + 50, y); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.stroke(); ctx.font = '16px monospace'; ctx.fillStyle = ctx.strokeStyle; ctx.fillText(cue.frame, x + 10, y + 25);
    }
    ctx.fillStyle = 'rgba(18,41,43,.82)'; ctx.fillRect(12, 12, 376, 31); ctx.fillStyle = '#fff3d1'; ctx.font = '16px sans-serif';
    ctx.fillText(`${time.toFixed(1)}s  |  ${sample(timeline.phases, time).label}`, 23, 34);
    $('time').value = `${time.toFixed(2)} / ${timeline.duration.toFixed(2)} s`;
    $('scrub').value = time;
    $('current-pose').textContent = `${active.komodor.frame} · ${active.grumbongo.frame}`;
  }
  function setTime(at) { time = Math.min(timeline.duration - 1 / timeline.fps, Math.max(0, at)); draw(); }
  function playPause() { playing = !playing; $('play').textContent = playing ? 'Pause' : 'Play'; last = performance.now(); }
  function tick(now) {
    if (playing && ready && !document.hidden) { time = (time + (now - last) / 1000 * Number($('speed').value)) % timeline.duration; draw(); }
    last = now; requestAnimationFrame(tick);
  }
  $('play').addEventListener('click', playPause);
  document.addEventListener('visibilitychange', () => { last = performance.now(); });
  $('reset').addEventListener('click', () => setTime(0));
  $('step').addEventListener('click', () => { playing = false; $('play').textContent = 'Play'; setTime(time + 1 / timeline.fps); });
  $('scrub').addEventListener('input', event => { playing = false; $('play').textContent = 'Play'; setTime(Number(event.target.value)); });
  for (const id of ['effects', 'guides', 'background']) $(id).addEventListener('change', draw);
  for (const phase of timeline.phases) { const option = new Option(`${phase.t.toFixed(2)}s · ${phase.label}`, phase.t); $('phase').add(option); }
  $('phase').addEventListener('change', () => { playing = false; $('play').textContent = 'Play'; setTime(Number($('phase').value)); });
  for (const [id, frame] of Object.entries(assets.frames)) $('frame-select').add(new Option(`${id} · ${frame.pose}`, id));
  function inspect() {
    const id = $('frame-select').value, frame = assets.frames[id]; $('frame-preview').src = frame.file; $('frame-download').href = frame.file;
    $('frame-info').textContent = `${frame.size.join(' × ')} RGBA · ${(frame.bytes / 1024).toFixed(0)} KiB PNG · ${(frame.decoded_rgba_bytes / 1048576).toFixed(2)} MiB decoded. Source: ${frame.source}, drawing ${frame.source_pose_index + 1}.`;
  }
  $('frame-select').addEventListener('change', inspect); inspect();
  const urls = [...new Set([timeline.arena, ...Object.values(assets.frames).map(frame => frame.file)])];
  Promise.all(urls.map(url => new Promise((resolve, reject) => {
    const image = new Image(); image.onload = () => { images.set(url, image); resolve(); }; image.onerror = () => reject(new Error(`Missing source asset: ${url}`)); image.src = url;
  }))).then(() => {
    ready = true; $('loading').textContent = `${assets.summary.frame_count} reusable pose drawings loaded. Effects are off.`;
    for (const id of ['play', 'reset', 'step', 'scrub']) $(id).disabled = false; draw(); requestAnimationFrame(tick);
  }).catch(error => { $('loading').textContent = error.message; console.error(error); });
  // Read-only selection + deterministic seek for QA, not a gameplay shortcut.
  window.trialSeek = at => { playing = false; $('play').textContent = 'Play'; setTime(at); };
  window.trialDiagnostics = () => ({ ready, time, playing, effects: $('effects').checked,
    frames: Object.fromEntries(Object.entries(timeline.actors).map(([name, actor]) => [name, sample(actor.cues, time).frame])),
    poseCount: assets.summary.frame_count });
})();
