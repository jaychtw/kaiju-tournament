import * as T from 'three';
import { material, mesh, batchStatic } from './models.js';

const TAU = Math.PI * 2;
function labelTexture(text, bg, fg, width = 1024, height = 256) {
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
  const c = canvas.getContext('2d'); c.fillStyle = bg; c.fillRect(0, 0, width, height);
  c.strokeStyle = fg; c.lineWidth = 7; c.strokeRect(16, 16, width - 32, height - 32);
  c.fillStyle = fg; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `900 ${height * .39}px sans-serif`; c.fillText(text, width / 2, height / 2 + 4);
  const tex = new T.CanvasTexture(canvas); tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = 4; return tex;
}
function box(g, mat, pos, size, rot = 0) { const m = mesh(g, new T.BoxGeometry(...size), mat, pos); m.rotation.y = rot; return m; }
function cylinder(g, mat, pos, rt, rb, h, n = 64) { return mesh(g, new T.CylinderGeometry(rt, rb, h, n), mat, pos); }
function ribbon(g, mat, radius, width, y, start = 0, end = TAU) {
  const m = mesh(g, new T.RingGeometry(radius, radius + width, 128, 1, start, end - start), mat, [0, y, 0]); m.rotation.x = -Math.PI / 2; m.castShadow = false; return m;
}
export function createArena(scene) {
  const root = new T.Group(); scene.add(root);
  const sand = material('#e1cda6'); const stone = material('#eedfba'); const white = material('#fff0d0');
  const teal = material('#287e7c'); const tealDark = material('#204a50'); const coral = material('#ca654b');
  const gold = material('#d8ad5b', { metalness: .18 }); const navy = material('#374c60');
  const darkStone = material('#70878b'); const leaves = material('#568a76');
  cylinder(root, sand, [0, -.72, 0], 65, 65, .6);
  cylinder(root, tealDark, [0, -.43, 0], 11.2, 11.6, .55);
  cylinder(root, gold, [0, -.17, 0], 10.95, 11.2, .12);
  cylinder(root, stone, [0, -.05, 0], 10.9, 10.9, .15);
  ribbon(root, teal, 9.8, .35, .034);
  ribbon(root, gold, 9.63, .055, .036);
  ribbon(root, gold, 10.33, .055, .036);
  // Radial cut stones and finer concentric seams make the floor read at grazing angles.
  const seam = material('#bfae8e');
  for (const r of [3.1, 6.2, 8.1]) ribbon(root, seam, r, .025, .027);
  for (let i = 0; i < 32; i++) {
    const a = i * TAU / 32;
    box(root, seam, [Math.sin(a) * 7.15, .022, Math.cos(a) * 7.15], [.022, .012, 7.3], a);
    if (i % 2 === 0) {
      const x = Math.sin(a) * 10.02, z = Math.cos(a) * 10.02;
      box(root, white, [x, .04, z], [.06, .015, .22], a);
    }
  }
  // Original sunburst insignia, painted into the center of the ring.
  const paint = material('#cb8961'); ribbon(root, paint, 1.18, .13, .04); ribbon(root, paint, .45, .12, .04);
  for (let i = 0; i < 12; i++) {
    const a = i * TAU / 12;
    const m = mesh(root, new T.CircleGeometry(.16, 3), paint, [Math.sin(a) * 1.67, .041, Math.cos(a) * 1.67]);
    m.rotation.set(-Math.PI / 2, 0, -a); m.castShadow = false;
  }
  // Far stadium banks: tiered architecture and a real instanced crowd.
  for (let tier = 0; tier < 4; tier++) {
    const r = 16.1 + tier * 1.65;
    const m = mesh(root, new T.CylinderGeometry(r + 1.3, r + 1.6, .82, 96, 1, true), tier % 2 ? tealDark : darkStone, [0, .4 + tier * 1.02, 0]);
    m.receiveShadow = true;
    ribbon(root, tier % 2 ? sand : stone, r, 1.3, .83 + tier * 1.02);
  }
  const crowdGeo = new T.SphereGeometry(1, 6, 4);
  const crowdM = material('#ffffff'); const crowd = new T.InstancedMesh(crowdGeo, crowdM, 800);
  const heads = new T.InstancedMesh(crowdGeo, material('#d5cbb1'), 800);
  const dummy = new T.Object3D(); const colors = ['#e0b973', '#e49376', '#75b6a3', '#d4d2b7', '#8094b2', '#bc8d96'];
  let seed = 4821; const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < 800; i++) {
    const tier = i % 4, a = Math.PI * (.48 + random() * 1.2); const r = 16.4 + tier * 1.65 + random() * .75;
    dummy.position.set(Math.sin(a) * r, 1.15 + tier * 1.02 + random() * .22, Math.cos(a) * r);
    dummy.scale.set(.18 + random() * .06, .25 + random() * .1, .16); dummy.updateMatrix(); crowd.setMatrixAt(i, dummy.matrix);
    crowd.setColorAt(i, new T.Color(colors[Math.floor(random() * colors.length)]));
    dummy.position.y += .34; dummy.scale.set(.13, .15, .13); dummy.updateMatrix(); heads.setMatrixAt(i, dummy.matrix);
  }
  crowd.castShadow = false; heads.castShadow = false; root.add(crowd, heads);
  // Arena perimeter, inset sponsor panels and ornamental posts.
  for (let i = 0; i < 28; i++) {
    const a = TAU * i / 28; const x = Math.sin(a) * 13.5, z = Math.cos(a) * 13.5;
    if (z > 7) continue;
    box(root, tealDark, [x, .53, z], [2.8, 1.1, .35], a);
    box(root, gold, [x, 1.12, z], [2.9, .12, .5], a);
    if (i % 3 === 0) {
      const mat = new T.MeshStandardMaterial({ map: labelTexture(i % 2 ? 'SUNSTONE' : 'KAIJU CLUB', i % 2 ? '#d57655' : '#2d6f6c', '#fae9bd'), roughness: .8 });
      const panel = mesh(root, new T.PlaneGeometry(2.4, .7), mat, [x - Math.sin(a) * .2, .56, z - Math.cos(a) * .2]); panel.rotation.y = a + Math.PI;
    }
  }
  // Sun gate behind Grumbongo, built from traditional curved roof volumes.
  const gate = new T.Group(); gate.position.set(0, 0, -21); root.add(gate);
  for (const s of [-1, 1]) {
    cylinder(gate, coral, [s * 3.9, 3.3, 0], .32, .45, 6.6, 12);
    cylinder(gate, gold, [s * 3.9, .45, 0], .65, .72, .9, 8);
    cylinder(gate, gold, [s * 3.9, 5.4, 0], .4, .4, .22, 12);
    box(gate, tealDark, [s * 4.7, 2.6, -.2], [1, 4.2, 1.4]);
  }
  box(gate, coral, [0, 5.4, 0], [10, .4, .5]);
  box(gate, gold, [0, 6.05, 0], [10.6, .22, 1.5]);
  function roof(y, w, d) {
    const shape = new T.Shape();
    shape.moveTo(-w / 2, 0); shape.quadraticCurveTo(-w / 2 + 1, -.45, -w / 3, .1);
    shape.lineTo(-.5, 1.05); shape.quadraticCurveTo(0, 1.25, .5, 1.05);
    shape.lineTo(w / 3, .1); shape.quadraticCurveTo(w / 2 - 1, -.45, w / 2, 0);
    shape.lineTo(w / 3, -.28); shape.lineTo(-w / 3, -.28); shape.closePath();
    const geo = new T.ExtrudeGeometry(shape, { depth: d, bevelEnabled: true, bevelThickness: .06, bevelSize: .06, bevelSegments: 1, steps: 1 });
    mesh(gate, geo, teal, [0, y, -d / 2]);
    box(gate, gold, [0, y + 1.1, 0], [1, .14, d + .1]);
  }
  roof(6.5, 12, 4.2); roof(8.05, 7.4, 3.1);
  box(gate, coral, [0, 7.25, 0], [4.5, 1.1, 2.1]);
  const gateSign = mesh(gate, new T.PlaneGeometry(3.7, 1.2), new T.MeshStandardMaterial({ map: labelTexture('SUNSTONE', '#214b4b', '#f8dfa0'), roughness: .8 }), [0, 5.25, .33]);
  gateSign.castShadow = false;
  const sun = mesh(gate, new T.TorusGeometry(1.4, .09, 8, 48), gold, [0, 10.1, 0]);
  for (let i = 0; i < 12; i++) {
    const a = TAU * i / 12; const m = box(gate, gold, [Math.sin(a) * 1.8, 10.1 + Math.cos(a) * 1.8, 0], [.09, .4, .08]); m.rotation.z = -a;
  }
  // Repeated canopies and poles give the stadium a festival silhouette.
  const flags = [];
  for (let i = 0; i < 12; i++) {
    const a = Math.PI * (.53 + i / 11 * 1.12); const r = 24.5;
    const x = Math.sin(a) * r, z = Math.cos(a) * r;
    cylinder(root, gold, [x, 4.8, z], .07, .09, 9.6, 8);
    const flag = new T.Group(); flag.position.set(x, 9.3, z); root.add(flag);
    const f = mesh(flag, new T.PlaneGeometry(1.4, 2.3, 6, 8), i % 2 ? coral : teal, [.7, -1.15, 0]); f.material.side = T.DoubleSide;
    flag.rotation.y = .5 + a; flags.push(flag);
    const badge = mesh(flag, new T.TorusGeometry(.28, .055, 6, 24), gold, [.7, -1, .03]); badge.castShadow = false;
    if (i % 3 === 0) {
      const tent = mesh(root, new T.ConeGeometry(3.2, 1.5, 4), i % 2 ? coral : teal, [x, 6, z]); tent.rotation.y = Math.PI / 4;
      for (const s of [-1, 1]) cylinder(root, white, [x + s * 1.6, 3.4, z], .1, .1, 4, 8);
    }
  }
  // Festoon strings drape across the upper background.
  for (const side of [-1, 1]) {
    const pts = [];
    for (let j = 0; j <= 24; j++) pts.push(new T.Vector3(side * (2 + j * 1.2), 13 - Math.sin(j / 24 * Math.PI) * 3, -22 + j * .3));
    mesh(root, new T.TubeGeometry(new T.CatmullRomCurve3(pts), 32, .035, 5, false), gold);
    for (let j = 1; j < 24; j++) {
      const p = pts[j]; const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute([-.35, 0, 0, .35, 0, 0, 0, -.8, 0], 3)); geo.computeVertexNormals();
      const m = mesh(root, geo, j % 3 ? coral : teal, p.toArray()); m.material.side = T.DoubleSide;
    }
  }
  // Distant tropical landscape, kept desaturated to frame the warm foreground.
  for (let i = 0; i < 18; i++) {
    const a = TAU * i / 18; const r = 58 + random() * 18;
    const mountain = mesh(root, new T.ConeGeometry(8 + random() * 8, 14 + random() * 18, 6), material(i % 2 ? '#8bb4a5' : '#9ebfb0'), [Math.sin(a) * r, 5, Math.cos(a) * r]); mountain.rotation.y = random() * 5;
  }
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) {
    const palm = new T.Group(); palm.position.set(s * (23 + i * 4), 0, -11 - i * 5); root.add(palm);
    const trunk = mesh(palm, new T.CylinderGeometry(.22, .42, 10 + i, 8), material('#9b8c69'), [0, 5 + i / 2, 0]); trunk.rotation.z = s * -.12;
    for (let j = 0; j < 8; j++) {
      const frond = mesh(palm, new T.SphereGeometry(1, 10, 6), leaves, [Math.sin(j * TAU / 8) * 1.8 + s, 10 + i, Math.cos(j * TAU / 8) * 1.8], [.55, .18, 3.1]); frond.rotation.set(.3, j * TAU / 8, .15);
    }
  }
  // Softly sculpted cloud banks.
  const clouds = [];
  for (let i = 0; i < 9; i++) {
    const g = new T.Group(); g.position.set(-65 + i * 16, 18 + random() * 9, -55 - random() * 15); root.add(g);
    for (let j = 0; j < 5; j++) mesh(g, new T.SphereGeometry(1, 12, 8), material('#fff2d7'), [(j - 2) * 2.4, random() * 1.2, random()], [3.7, 1.2 + random() * 1.2, 2.3]);
    clouds.push(g);
  }
  batchStatic(root);
  // Spend the dynamic shadow budget on the two contenders. Environment details
  // retain directional shading and the arena receives the fighters' shadows.
  root.traverse(o => { if (o.isMesh) o.castShadow = false; });
  return { flags, clouds };
}
