import { loadBattleArt, releaseImages } from './assets.js';

// Pose selection belongs to presentation; HP and outcomes belong to combat.js.
export async function createBattleScene(canvas, hooks, player = 'komodor', enemy = 'grumbongo') {
  const { art, images, sources } = await loadBattleArt(player, enemy);
  const ctx = canvas.getContext('2d', { alpha: false });
  canvas.width = 1200; canvas.height = 800;
  let alive = true, action = null, result = null, start = 0, impacted = false, ended = false;
  let last = performance.now(), elapsed = 0, hiddenAt = 0, frames = 0, intervals = [], drawTimes = [], quality = 'high';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mapping = (id, side, pose, at) => {
    if (id === 'komodor' && side === 0) {
      const groups = { idle: ['k_idle_0', 'k_idle_1', 'k_idle_2', 'k_idle_3'], guard: ['k_guard_2', 'k_guard_3'], prep: ['k_counter_1', 'k_counter_2'], attack: ['k_strike_1', 'k_strike_2'], hit: ['k_recovery_0'], recover: ['k_recovery_2', 'k_recovery_3'] };
      const group = groups[pose] || groups.idle; return group[Math.floor(at * (pose === 'idle' ? 1.4 : 3)) % group.length];
    }
    if (id === 'grumbongo' && side === 1) return ({ idle: 'g_attack_0', prep: 'g_attack_1', attack: 'g_attack_2', guard: 'g_attack_1', hit: at > .35 ? 'g_reaction_1' : 'g_reaction_0', recover: 'g_reaction_3' })[pose] || 'g_attack_0';
    return pose === 'prep' || pose === 'recover' ? 'idle' : pose;
  };
  function actor(id, side, pose, at, lunge = 0, ko = false) {
    const key = mapping(id, side, pose, at);
    const frame = sources[side][key] || sources[side].idle || Object.values(sources[side])[0];
    const scale = side === 0 ? 1.05 : .92;
    const root = side === 0 ? [620 + lunge, 705 - lunge * .18] : [1100 - lunge, 525 + lunge * .12];
    if (ko) root[1] += Math.min(1, at / .55) * 65;
    ctx.save();
    ctx.globalAlpha = ko ? .88 : 1;
    ctx.fillStyle = '#26384635'; ctx.beginPath();
    ctx.ellipse(root[0] - (side === 0 ? 110 : 190), side === 0 ? 700 : 520, side === 0 ? 155 : 205, 20, 0, 0, Math.PI * 2); ctx.fill();
    ctx.drawImage(images.get(frame.file), Math.round(root[0] - frame.pivot[0] * scale), Math.round(root[1] - frame.pivot[1] * scale), Math.round(frame.size[0] * scale), Math.round(frame.size[1] * scale));
    ctx.restore();
  }
  function draw(now) {
    const t = result ? (now - start) / 1000 : 0;
    const attack = result?.action === 'attack', guard = result?.action === 'defend';
    let pp = action === 'defend' ? 'guard' : action ? 'prep' : 'idle', ep = 'idle', lunge = 0, recoil = 0;
    if (result) {
      if (t < .58) { pp = guard ? 'guard' : 'prep'; ep = 'prep'; }
      else if (t < .94) { pp = guard ? 'guard' : 'attack'; ep = 'attack'; lunge = attack ? 110 : 0; recoil = 115; }
      else if (t < 1.65) { pp = guard ? 'guard' : 'hit'; ep = attack ? 'hit' : 'recover'; }
      else { pp = 'recover'; ep = 'recover'; }
    }
    const ko = ended && result?.state.outcome;
    const shock = result && t > .85 && t < 1.12 && !reduced ? (1 - (t - .85) / .27) * (result.chargedAttack ? 9 : 4) : 0;
    ctx.save();
    if (shock) ctx.translate(Math.sin(t * 123) * shock, Math.cos(t * 97) * shock * .5);
    ctx.drawImage(images.get(art.arena), 0, 0, 1200, 800);
    actor(enemy, 1, ko && result.state.enemyHP === 0 ? 'hit' : ep, result ? Math.max(0, t - .94) : elapsed, recoil, ko && result.state.enemyHP === 0);
    actor(player, 0, ko && result.state.playerHP === 0 ? 'hit' : pp, result ? Math.max(0, t - .94) : elapsed, lunge, ko && result.state.playerHP === 0);
    if (action === 'defend' || (guard && t < 1.3)) {
      ctx.strokeStyle = '#b0ffedb0'; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(485, 430, 145, 190, -.28, -.9, 2.1); ctx.stroke();
    }
    if ((action === 'attack' || attack) && (result?.chargedAttack || action)) {
      ctx.strokeStyle = '#ffe1989c'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(485, 700, 150 + Math.sin(elapsed * 5) * 5, 22, 0, 0, Math.PI * 2); ctx.stroke();
    }
    if (result && t > .85 && t < 1.17) {
      const progress = (t - .85) / .32;
      for (const [x,y,color] of [[460,430,guard ? '#c1fff0' : '#fff2bf'], ...(attack ? [[855,350,'#fff2bf']] : [])]) {
        ctx.save(); ctx.globalAlpha = 1 - progress; ctx.strokeStyle = color; ctx.lineWidth = 7 * (1 - progress);
        ctx.beginPath(); ctx.arc(x,y,35 + progress * 110,0,Math.PI*2); ctx.stroke();
        for (let i=0;i<8;i++) { const a=i*Math.PI/4; ctx.beginPath(); ctx.moveTo(x+Math.cos(a)*40,y+Math.sin(a)*40);ctx.lineTo(x+Math.cos(a)*(75+progress*80),y+Math.sin(a)*(75+progress*80));ctx.stroke(); }
        ctx.restore();
      }
    }
    ctx.restore();
  }
  function tick(now) {
    if (!alive) return;
    const dt = now - last; last = now;
    if (!document.hidden) {
      elapsed += Math.min(dt, 50) / 1000;
      if (dt < 200) { intervals.push(dt); if (intervals.length > 600) intervals.shift(); }
      const began = performance.now();
      hooks.onFrame?.(now);
      if (result && !ended) {
        if (!impacted && now - start >= 850) { impacted = true; hooks.onImpact?.(result); }
        if (now - start >= 2200) { ended = true; action = null; hooks.onComplete?.(result); if (!result.state.outcome) result = null; }
      }
      draw(now); frames++; drawTimes.push(performance.now() - began); if (drawTimes.length > 600) drawTimes.shift();
    }
    requestAnimationFrame(tick);
  }
  function visibility() {
    if (document.hidden) hiddenAt = performance.now();
    else { const now = performance.now(); if (hiddenAt && result && !ended) start += now - hiddenAt; hiddenAt = 0; last = now; }
  }
  document.addEventListener('visibilitychange', visibility);
  requestAnimationFrame(tick);
  return {
    prepare(next) { action = next; result = null; ended = false; }, press() {},
    startRound(next) { result = next; start = performance.now(); impacted = false; ended = false; action = null; },
    reset() { result = null; action = null; ended = false; },
    setQuality(next) { quality = next; },
    project(who) { return who === 'player' ? { x: .34, y: .48 } : { x: .75, y: .3 }; },
    getStats() { const sorted = [...intervals].sort((a,b)=>a-b); return { renderer: 'Canvas 2D · illustrated poses', frames, quality, medianFrameMs: sorted[Math.floor(sorted.length / 2)] || 0, p95FrameMs: sorted[Math.floor(sorted.length * .95)] || 0, meanDrawMs: drawTimes.reduce((a,b)=>a+b,0) / (drawTimes.length || 1), loadedImages: images.size }; },
    destroy() { alive = false; document.removeEventListener('visibilitychange', visibility); releaseImages(images.keys()); images.clear(); },
  };
}
