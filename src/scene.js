import * as T from 'three';
import { createKaiju, poseKaiju, material, mesh } from './models.js';
import { createArena } from './arena.js';

const ease = t => { t = T.MathUtils.clamp(t, 0, 1); return t * t * (3 - 2 * t); };
const pulse = (t, start, peak, end) => t < peak ? ease((t - start) / (peak - start)) : 1 - ease((t - peak) / (end - peak));
const V = (x, y, z) => new T.Vector3(x, y, z);

export function createBattleScene(canvas, hooks) {
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', alpha: false });
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.13;
  renderer.shadowMap.enabled = !matchMedia('(max-width: 650px)').matches; renderer.shadowMap.type = T.PCFShadowMap;
  const scene = new T.Scene(); scene.background = new T.Color('#afd7d2'); scene.fog = new T.Fog('#c8dcd1', 35, 110);
  const camera = new T.PerspectiveCamera(39, 1, .1, 180);
  const hemi = new T.HemisphereLight('#dbf5ef', '#bda580', 1.7); scene.add(hemi);
  const sun = new T.DirectionalLight('#fff0d2', 3.3); sun.position.set(-9, 18, 9);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left = -14; sun.shadow.camera.right = 14; sun.shadow.camera.top = 14; sun.shadow.camera.bottom = -14;
  sun.shadow.camera.near = 1; sun.shadow.camera.far = 60; sun.shadow.normalBias = .025; sun.shadow.bias = -.0002; sun.shadow.radius = 3; scene.add(sun);
  const rim = new T.DirectionalLight('#c6ebee', 2.1); rim.position.set(4, 8, -10); scene.add(rim);
  const arena = createArena(scene);
  const player = createKaiju('komodor'), enemy = createKaiju('grumbongo'); scene.add(player, enemy);
  const homes = [V(-2.5, 0, 3.45), V(2.25, 0, -3.05)];
  player.rotation.y = Math.atan2(homes[1].x - homes[0].x, homes[1].z - homes[0].z);
  enemy.rotation.y = player.rotation.y + Math.PI;
  player.position.copy(homes[0]); enemy.position.copy(homes[1]);
  const direction = homes[1].clone().sub(homes[0]).normalize();
  // A soft baked-looking contact patch supplements the dynamic directional shadow.
  const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = shadowCanvas.height = 128;
  const sc = shadowCanvas.getContext('2d'), grad = sc.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(34,42,36,.32)'); grad.addColorStop(.45, 'rgba(34,42,36,.19)'); grad.addColorStop(1, 'rgba(34,42,36,0)'); sc.fillStyle = grad; sc.fillRect(0, 0, 128, 128);
  const shadowMat = new T.MeshBasicMaterial({ map: new T.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false });
  const patches = [player, enemy].map(() => { const p = mesh(scene, new T.PlaneGeometry(4.8, 3.8), shadowMat); p.rotation.x = -Math.PI / 2; p.castShadow = p.receiveShadow = false; return p; });
  const shield = new T.Group(); scene.add(shield);
  const shieldMat = new T.MeshBasicMaterial({ color: '#b7ffe5', transparent: true, opacity: .2, side: T.DoubleSide, depthWrite: false });
  const dome = mesh(shield, new T.SphereGeometry(2, 32, 20, 0, Math.PI), shieldMat, [0, 2.4, 0], [1, 1.1, .8]); dome.castShadow = false;
  const shieldEdgeMat = new T.MeshBasicMaterial({ color: '#c9ffe5', transparent: true, opacity: .85, depthWrite: false });
  const edge = mesh(shield, new T.TorusGeometry(1.95, .035, 6, 64), shieldEdgeMat, [0, 2.4, .08]); edge.castShadow = false;
  const emblem = mesh(shield, new T.TorusGeometry(.48, .025, 5, 6), shieldEdgeMat, [0, 2.4, 1.7]); emblem.castShadow = false;
  shield.rotation.y = player.rotation.y;
  const aura = new T.Group(); scene.add(aura);
  const auraM = new T.MeshBasicMaterial({ color: '#ffd77b', transparent: true, opacity: .7, depthWrite: false });
  const auras = [];
  for (let i = 0; i < 3; i++) { const m = mesh(aura, new T.TorusGeometry(1.3, .022, 4, 64, 5), auraM, [0, .15 + i * 1.2, 0]); m.rotation.x = Math.PI / 2; m.castShadow = false; auras.push(m); }
  const burst = new T.Group(); scene.add(burst);
  const burstM = new T.MeshBasicMaterial({ color: '#fff6d4', transparent: true, depthWrite: false, side: T.DoubleSide });
  const shock = mesh(burst, new T.RingGeometry(.88, 1.04, 64), burstM); shock.rotation.x = -Math.PI / 2; shock.castShadow = false;
  const flash = mesh(burst, new T.SphereGeometry(1, 12, 8), burstM); flash.castShadow = false;
  const swipeM = new T.MeshBasicMaterial({ color: '#fff0c2', transparent: true, opacity: .8, side: T.DoubleSide, depthWrite: false });
  const swipe = mesh(scene, new T.TorusGeometry(1.9, .1, 6, 40, 2.4), swipeM); swipe.castShadow = false;
  // Fixed-size particle pool, no mesh allocation during play.
  const pool = []; const particleM = new T.MeshBasicMaterial({ vertexColors: false, color: '#f8d888' });
  const particleGeo = new T.IcosahedronGeometry(1, 0);
  const particles = new T.InstancedMesh(particleGeo, particleM, 100); particles.instanceMatrix.setUsage(T.DynamicDrawUsage); particles.frustumCulled = false; scene.add(particles);
  const dummy = new T.Object3D();
  for (let i = 0; i < 100; i++) { pool.push({ velocity: V(0, 0, 0), position: V(0, 0, 0), life: 0, size: 0 }); dummy.scale.setScalar(0); dummy.updateMatrix(); particles.setMatrixAt(i, dummy.matrix); }
  function emit(point, charged, guarded) {
    const count = charged ? 85 : 44;
    for (let i = 0; i < count; i++) {
      const p = pool[i]; const a = Math.random() * Math.PI * 2, speed = 2 + Math.random() * (charged ? 8 : 5);
      p.position.copy(point); p.velocity.set(Math.cos(a) * speed, 2 + Math.random() * 6, Math.sin(a) * speed); p.life = .5 + Math.random() * .65; p.size = .045 + Math.random() * .12;
      particles.setColorAt(i, new T.Color(guarded ? (i % 2 ? '#8ce7c7' : '#f5ffeb') : (i % 3 ? '#ffc46e' : '#fffbed')));
    }
    if (particles.instanceColor) particles.instanceColor.needsUpdate = true;
  }
  let sequence = null, preparation = null, tapEnergy = 0, impactAt = -10, impactPoint = V(0, 2, 0), time = 0, last = performance.now(), charge = false, outcome = null, koStart = 0;
  let quality = matchMedia('(max-width: 650px)').matches ? 'low' : 'high'; let frames = 0, sampleStart = performance.now(), fps = 60;
  const clockStats = { fps: 60, drawCalls: 0, triangles: 0, pixelRatio: 1, quality };
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const ratio = Math.min(devicePixelRatio || 1, quality === 'high' ? 1.7 : 1.15);
    renderer.setPixelRatio(ratio); renderer.setSize(w, h, false); camera.aspect = w / Math.max(1, h); camera.updateProjectionMatrix();
    clockStats.pixelRatio = ratio; clockStats.quality = quality;
  }
  const observer = new ResizeObserver(resize); observer.observe(canvas);
  document.addEventListener('visibilitychange', () => { last = performance.now(); });
  function animate(now) {
    requestAnimationFrame(animate);
    const elapsed = (now - last) / 1000, dt = Math.min(elapsed, .05); last = now;
    if (document.hidden) return;
    time += elapsed;
    let pa = 0, ea = 0, guard = 0, ph = 0, eh = 0, lunge = 0, elunge = 0, focus = 0;
    tapEnergy = Math.max(0, tapEnergy - dt * 3);
    if (preparation) { guard = preparation === 'defend' ? .45 + tapEnergy * .12 : 0; pa = preparation === 'attack' ? .13 + tapEnergy * .08 : 0; }
    player.position.copy(homes[0]); enemy.position.copy(homes[1]);
    if (sequence) {
      const s = time - sequence.start;
      focus = pulse(s, 0, .75, 2.3);
      const strike = pulse(s, .22, .98, 1.6);
      pa = sequence.result.action === 'attack' ? strike : 0;
      ea = strike; guard = sequence.result.action === 'defend' ? pulse(s, 0, .6, 1.95) : 0;
      lunge = sequence.result.action === 'attack' ? pulse(s, .25, 1.05, 2.05) * 2.25 : -.16 * guard;
      elunge = pulse(s, .3, 1.05, 2.05) * (sequence.result.action === 'defend' ? 4.2 : 2.25);
      ph = pulse(s, 1.03, 1.17, 1.8) * (sequence.result.action === 'defend' ? .3 : 1);
      eh = sequence.result.action === 'attack' ? pulse(s, 1.03, 1.17, 1.8) : 0;
      player.position.addScaledVector(direction, lunge); enemy.position.addScaledVector(direction, -elunge);
      if (s >= 1.04 && !sequence.impacted) {
        sequence.impacted = true; impactAt = time;
        impactPoint.copy(sequence.result.action === 'defend' ? player.position : player.position.clone().lerp(enemy.position, .5)); impactPoint.y = 2.6;
        emit(impactPoint, sequence.result.chargedAttack, sequence.result.action === 'defend');
        hooks.onImpact?.(sequence.result);
      }
      if (s >= 2.35) {
        const result = sequence.result; sequence = null; charge = result.state.charged; outcome = result.state.outcome;
        if (outcome) koStart = time;
        hooks.onComplete?.(result);
      }
    }
    const ko = outcome ? ease((time - koStart) / .95) : 0;
    poseKaiju(player, time, { attack: pa, guard, hit: ph, ko: outcome === 'defeat' || outcome === 'draw' ? ko : 0, charged: charge, victory: outcome === 'victory' });
    poseKaiju(enemy, time + .7, { attack: ea, hit: eh, ko: outcome === 'victory' || outcome === 'draw' ? ko : 0, victory: outcome === 'defeat' });
    for (let i = 0; i < 2; i++) { patches[i].position.copy(i ? enemy.position : player.position); patches[i].position.y = .055; }
    shield.visible = guard > .02; shield.position.copy(player.position); shieldMat.opacity = guard * .16 + ph * .2;
    shield.scale.setScalar(1 + Math.sin(time * 20) * .007 + ph * .07);
    aura.visible = charge || sequence?.result.chargedAttack || (preparation === 'attack' && tapEnergy > .1); aura.position.copy(player.position);
    for (let i = 0; i < 3; i++) { auras[i].rotation.z = time * (i % 2 ? 1.5 : -1.5) + i; auras[i].scale.setScalar(1 + Math.sin(time * 3 + i) * .08); }
    const age = time - impactAt;
    burst.visible = age >= 0 && age < .6;
    burst.position.copy(impactPoint); shock.position.y = -impactPoint.y + .1; shock.scale.setScalar(1 + age * 12); flash.scale.setScalar(Math.max(0, 1 - age * 5) * (sequence?.result.chargedAttack ? 1.3 : .8)); burstM.opacity = Math.max(0, 1 - age * 2);
    swipe.visible = pa > .35; swipe.position.copy(player.position).addScaledVector(direction, 1.7); swipe.position.y = 3;
    swipe.rotation.set(.6, player.rotation.y, time * 6); swipeM.opacity = pa * .75;
    for (let i = 0; i < pool.length; i++) {
      const p = pool[i]; p.life -= elapsed;
      if (p.life > 0) { p.velocity.y -= dt * 12; p.position.addScaledVector(p.velocity, dt); dummy.position.copy(p.position); dummy.rotation.set(time * 3 + i, time * 2, i); dummy.scale.setScalar(p.size * Math.min(1, p.life * 4)); }
      else dummy.scale.setScalar(0);
      dummy.updateMatrix(); particles.setMatrixAt(i, dummy.matrix);
    }
    particles.instanceMatrix.needsUpdate = true;
    for (let i = 0; i < arena.flags.length; i++) arena.flags[i].rotation.z = Math.sin(time * 2.5 + i) * .06;
    for (let i = 0; i < arena.clouds.length; i++) arena.clouds[i].position.x += dt * .12;
    const aspect = camera.aspect;
    // Portrait framing widens the lens rather than cutting either contender out.
    const portrait = aspect < 1;
    camera.fov = portrait ? 45 : 38;
    const base = portrait ? V(.7, 7.4, 19.5) : V(.8, 5.7, 14.8);
    const cinematic = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1;
    base.multiplyScalar(1 - focus * .07 * cinematic);
    const shake = age >= 0 && age < .3 ? Math.exp(-age * 14) * (sequence?.result.chargedAttack ? .19 : .1) * cinematic : 0;
    base.x += Math.sin(time * 100) * shake; base.y += Math.cos(time * 110) * shake;
    camera.position.copy(base); camera.lookAt(0, portrait ? 2.1 : 2.3, -.1); camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    frames++; if (now - sampleStart >= 1000) { fps = frames * 1000 / (now - sampleStart); frames = 0; sampleStart = now; clockStats.fps = Math.round(fps); }
    clockStats.drawCalls = renderer.info.render.calls; clockStats.triangles = renderer.info.render.triangles;
    hooks.onFrame?.(now);
  }
  resize(); requestAnimationFrame(animate);
  return {
    prepare(action) { preparation = action; },
    press() { tapEnergy = 1; },
    startRound(result) { preparation = null; sequence = { result, start: time, impacted: false }; },
    reset() { sequence = null; preparation = null; charge = false; outcome = null; impactAt = -10; for (const p of pool) p.life = 0; },
    setQuality(value) { quality = value; renderer.shadowMap.enabled = value === 'high'; resize(); },
    getStats() { return { ...clockStats }; },
    // Screen positions support damage feedback without hard-coded view coordinates.
    project(which) { const q = (which === 'player' ? player : enemy).position.clone(); q.y = 3.8; q.project(camera); return { x: (q.x + 1) * .5, y: (1 - q.y) * .5 }; },
  };
}
