import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const sphere = new T.SphereGeometry(1, 20, 12);
const lowSphere = new T.SphereGeometry(1, 12, 8);
const v = (x, y, z) => new T.Vector3(x, y, z);
export const material = (color, extra = {}) => new T.MeshStandardMaterial({ color, roughness: .78, ...extra });
export function mesh(parent, geo, mat, pos = [0, 0, 0], scale = [1, 1, 1]) {
  const m = new T.Mesh(geo, mat); m.position.set(...pos); m.scale.set(...scale);
  m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
}
function oval(parent, mat, pos, scale, rotation = [0, 0, 0], low = false) {
  const m = mesh(parent, low ? lowSphere : sphere, mat, pos, scale); m.rotation.set(...rotation); return m;
}
function group(parent, pos) { const g = new T.Group(); g.position.set(...pos); parent.add(g); return g; }

// A tapered, curved blade volume. Shared by dorsal plates, fur locks and claws;
// every piece has a rounded root, a directed silhouette and a pointed tip.
function blade(parent, mat, pos, scale, rot = [0, 0, 0], bend = .3) {
  const points = [[0, 0], [.65, .08], [1, .25], [.9, .5], [.55, .8], [0, 1]];
  const geo = new T.LatheGeometry(points.map(([r, y]) => new T.Vector2(r, y)), 8);
  const a = geo.attributes.position;
  for (let i = 0; i < a.count; i++) { const y = a.getY(i); a.setZ(i, a.getZ(i) + bend * y * y); }
  geo.computeVertexNormals(); const m = mesh(parent, geo, mat, pos, scale); m.rotation.set(...rot); return m;
}
function sculpt(parent, mat, profile, pos = [0, 0, 0], scale = [1, 1, 1]) {
  const points = new T.SplineCurve(profile.map(p => new T.Vector2(...p))).getPoints(32);
  return mesh(parent, new T.LatheGeometry(points, 32), mat, pos, scale);
}
function tube(parent, mat, pts, radii, segments = 40) {
  const curve = new T.CatmullRomCurve3(pts.map(p => v(...p)));
  const geo = new T.TubeGeometry(curve, segments, 1, 12, false);
  const a = geo.attributes.position;
  for (let j = 0; j <= segments; j++) {
    const t = j / segments; const center = curve.getPointAt(t);
    const r = radii(t);
    for (let k = 0; k <= 12; k++) {
      const i = j * 13 + k;
      const q = v(a.getX(i), a.getY(i), a.getZ(i)).sub(center).multiplyScalar(r).add(center);
      a.setXYZ(i, q.x, q.y, q.z);
    }
  }
  geo.computeVertexNormals(); return mesh(parent, geo, mat);
}

// Merge only static meshes sharing a parent and material. Joint groups and eye
// controls remain separate, reducing draw calls without losing articulation.
export function batchStatic(root) {
  for (const child of [...root.children]) if (child.isGroup) batchStatic(child);
  const batches = new Map();
  for (const child of root.children) if (child.isMesh && !child.userData.dynamic) {
    const key = `${child.material.uuid}/${child.castShadow}/${child.receiveShadow}`;
    if (!batches.has(key)) batches.set(key, []);
    batches.get(key).push(child);
  }
  for (const items of batches.values()) {
    if (items.length < 2) continue;
    const nonIndexed = items.some(m => !m.geometry.index);
    const geometries = items.map(m => {
      m.updateMatrix(); let g = m.geometry.clone().applyMatrix4(m.matrix);
      if (nonIndexed && g.index) { const flat = g.toNonIndexed(); g.dispose(); g = flat; }
      if (!g.attributes.uv) g.setAttribute('uv', new T.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
      return g;
    });
    const geo = mergeGeometries(geometries, false);
    if (geo) { const m = new T.Mesh(geo, items[0].material); m.castShadow = items[0].castShadow; m.receiveShadow = items[0].receiveShadow; root.add(m); for (const old of items) root.remove(old); }
    for (const g of geometries) g.dispose();
  }
}

function skinTexture(reptile, color = false) {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
  const c = canvas.getContext('2d'); c.fillStyle = color ? '#bcc7ba' : '#929292'; c.fillRect(0, 0, 256, 256);
  let seed = 501; const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  if (reptile) {
    for (let y = -1; y < 17; y++) for (let x = -1; x < 17; x++) {
      const cx = x * 16 + y % 2 * 8, cy = y * 16;
      const shade = 180 + rand() * 65;
      c.fillStyle = color ? `rgb(${shade - 12},${shade},${shade - 7})` : `rgb(${shade},${shade},${shade})`;
      c.beginPath(); c.ellipse(cx, cy, 7, 9, 0, 0, Math.PI * 2); c.fill();
      c.strokeStyle = color ? '#9eaf9f' : '#777'; c.lineWidth = color ? .6 : 1.2; c.stroke();
      if (color) { c.fillStyle = '#ffffff26'; c.beginPath(); c.ellipse(cx - 1, cy - 2, 4, 5, -.2, Math.PI, Math.PI * 2); c.fill(); }
    }
  } else {
    for (let i = 0; i < 3300; i++) { const x = rand() * 256, y = rand() * 256; c.strokeStyle = rand() > .4 ? (color ? '#e9e8e0' : '#bbbbbb') : (color ? '#b1b8ba' : '#777777'); c.lineWidth = .7; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x - 1, y + 4, x + 2, y + 9); c.stroke(); }
  }
  const tex = new T.CanvasTexture(canvas); tex.wrapS = tex.wrapT = T.RepeatWrapping; tex.repeat.set(reptile ? 2 : 3, reptile ? 1.5 : 2); if (color) tex.colorSpace = T.SRGBColorSpace; return tex;
}

function dorsal(parent, mat, pos, size, rotation = [0, 0, 0]) {
  const shape = new T.Shape(); shape.moveTo(-.42, 0); shape.quadraticCurveTo(-.47, .5, -.08, .93); shape.lineTo(.13, 1.3); shape.quadraticCurveTo(.28, .52, .55, .22); shape.lineTo(.35, -.04); shape.closePath();
  const g = new T.ExtrudeGeometry(shape, { depth: .16, bevelEnabled: true, bevelSize: .065, bevelThickness: .06, bevelSegments: 2, steps: 1, curveSegments: 6 });
  const m = mesh(parent, g, mat, pos, [size, size, size]); m.rotation.set(...rotation); return m;
}

export function createKaiju(kind) {
  const reptile = kind === 'komodor';
  const root = new T.Group();
  const body = group(root, [0, 1.85, 0]);
  const head = group(body, [0, reptile ? 2.05 : 1.85, .1]);
  const jaw = group(head, [0, -.1, .48]);
  const bump = skinTexture(reptile), map = skinTexture(reptile, true);
  const skin = material(reptile ? '#368a76' : '#3d475e', { map, bumpMap: bump, bumpScale: reptile ? .13 : .065 });
  const light = material(reptile ? '#58aa87' : '#bcc8d0', { map, bumpMap: bump, bumpScale: reptile ? .075 : .07 });
  const dark = material(reptile ? '#15574d' : '#222c3c');
  const belly = material(reptile ? '#e4bd73' : '#716c77');
  const accent = material(reptile ? '#ed824e' : '#d8ddd6');
  const ivory = material('#fff0c9');
  const black = material('#18292b', { roughness: .35 });
  const eyeMat = material('#ffc65b', { roughness: .3, emissive: '#b55b19', emissiveIntensity: .15 });
  const mouthMat = material('#462c3b');
  const arms = [], elbows = [], legs = [], eyes = [], brows = [];

  if (reptile) {
    sculpt(body, skin, [[0, -.8], [.48, -.72], [.86, -.2], [1.06, .55], [1.1, 1.2], [.84, 1.65], [.52, 1.85], [0, 1.95]], [0, 0, 0], [1, 1, .72]);
    // Interlocking ventral scutes continue from the abdomen to the throat.
    for (let i = 0; i < 8; i++) oval(body, belly, [0, -.28 + i * .245, .61 + Math.sin(i / 7 * Math.PI) * .12], [.65 - i * .026, .155, .16]);
    for (const s of [-1, 1]) {
      oval(body, light, [s * .72, 1.15, .22], [.44, .55, .5], [0, 0, s * -.3]);
      for (let i = 0; i < 6; i++) blade(body, i % 2 ? light : skin, [s * (.65 + .13 * (i % 2)), .25 + i * .24, -.49], [.19, .3, .11], [-1.4, 0, -s * .4]);
    }
    const tail = group(body, [0, -.6, -.2]);
    tube(tail, skin, [[0, 0, 0], [0, -.35, -.9], [.35, -.65, -2], [1.2, -.72, -2.9], [1.9, -.6, -3.2]], t => .65 * (1 - t) ** .8 + .015);
    for (let i = 0; i < 7; i++) dorsal(tail, accent, [.1 + i * .17, -.03 - i * .075, -.65 - i * .33], .35 - i * .035, [0, Math.PI / 2, -.25]);
    root.userData.tail = tail;
    for (let i = 0; i < 7; i++) dorsal(body, accent, [0, -.15 + i * .32, -.72 + i * .025], .53 + .13 * Math.sin(i / 6 * Math.PI), [-1.12, Math.PI / 2, 0]);
    for (const s of [-1, 1]) for (let row = 0; row < 6; row++) for (let i = 0; i < 3; i++) {
      oval(body, row % 2 ? light : skin, [s * (.18 + i * .22), .05 + row * .26, -.71 - .05 * Math.sin(row)], [.15, .19, .055], [.15, s * -.25, s * -.1], true);
    }
    oval(body, skin, [0, 1.77, .12], [.59, .7, .5]);
    oval(head, skin, [0, .2, .06], [.66, .64, .59]);
    oval(head, skin, [0, -.02, .57], [.67, .33, .77]);
    oval(jaw, belly, [0, -.16, .08], [.59, .19, .66]);
    oval(head, mouthMat, [0, -.18, .7], [.5, .14, .48]);
    oval(head, light, [0, .09, .88], [.55, .23, .42]);
    for (const s of [-1, 1]) {
      oval(head, dark, [s * .32, .19, 1.115], [.09, .054, .035], [.15, 0, s * -.2]);
      oval(head, ivory, [s * .45, -.18, .98], [.055, .12, .045], [0, 0, s * .16]);
      for (let i = 0; i < 3; i++) blade(head, ivory, [s * (.22 + i * .1), -.13, 1.13 - i * .1], [.025, .11, .03], [Math.PI, 0, 0]);
      blade(head, accent, [s * .46, .66, -.19], [.19, .58, .17], [-.4, 0, s * -.25]);
      blade(head, light, [s * .54, -.08, .05], [.2, .43, .12], [0, 0, -s * 1.05]);
      for (let i = 0; i < 3; i++) dorsal(head, light, [s * .5, .05 + i * .16, -.25], .18, [0, s * .5, -s * .9]);
      const eye = group(head, [s * .51, .36, .48]); eyes.push(eye);
      oval(eye, ivory, [0, 0, 0], [.22, .19, .15]);
      oval(eye, eyeMat, [s * .025, -.01, .127], [.12, .14, .04]);
      oval(eye, black, [s * .022, -.01, .16], [.025, .108, .025]);
      oval(eye, ivory, [s * .005 - .025, .05, .18], [.027, .035, .015]);
      const brow = group(head, [s * .49, .51, .48]); brows.push(brow);
      oval(brow, dark, [0, 0, 0], [.28, .09, .2], [0, 0, s * -.2]);
      for (let i = 0; i < 4; i++) oval(head, light, [s * (.52 - i * .04), .05 + i * .14, .35], [.1, .07, .08], [0, 0, .2], true);
    }
  } else {
    sculpt(body, skin, [[0, -.9], [.58, -.75], [.9, -.3], [1.12, .5], [1.55, 1.2], [1.52, 1.62], [.95, 1.9], [0, 2.02]], [0, 0, -.1], [1, 1, .68]);
    oval(body, belly, [0, .5, .55], [.84, 1.05, .24]);
    for (const s of [-1, 1]) {
      oval(body, dark, [s * .55, 1.22, .59], [.67, .57, .3], [0, 0, s * -.25]);
      // A sculpted silver shoulder mantle, with overlapping directional fur locks.
      oval(body, light, [s * .96, 1.39, -.12], [.88, .72, .65], [0, 0, s * -.23]);
      for (let row = 0; row < 4; row++) for (let i = 0; i < 7; i++) {
        const a = (i / 6) * Math.PI * 1.4 - .7;
        blade(body, (i + row) % 3 ? light : accent, [s * (.95 + Math.sin(a) * .57), 1.75 - row * .2, -.04 + Math.cos(a) * .69], [.14, .5 + row * .03, .10], [.35, 0, -s * (1.75 + row * .13) + .1 * Math.sin(i)], .6);
      }
    }
    oval(head, skin, [0, .18, -.03], [.71, .77, .59]);
    oval(head, dark, [0, .01, .48], [.63, .55, .22]);
    oval(jaw, belly, [0, -.12, .13], [.55, .32, .3]);
    oval(head, mouthMat, [0, -.2, .67], [.44, .18, .25]);
    oval(jaw, dark, [0, -.16, .39], [.37, .058, .04]);
    for (const s of [-1, 1]) oval(head, ivory, [s * .3, -.12, .84], [.06, .115, .065]);
    oval(head, skin, [0, .01, .83], [.36, .2, .24]);
    for (const s of [-1, 1]) {
      oval(head, black, [s * .14, .04, 1.035], [.07, .048, .025]);
      oval(head, skin, [s * .72, .22, .02], [.2, .25, .13]);
      oval(head, belly, [s * .74, .22, .12], [.11, .16, .04]);
      const eye = group(head, [s * .3, .3, .6]); eyes.push(eye);
      oval(eye, ivory, [0, 0, 0], [.18, .145, .1]);
      oval(eye, eyeMat, [-s * .025, -.005, .09], [.09, .105, .035]);
      oval(eye, black, [-s * .025, -.005, .118], [.055, .078, .018]);
      oval(eye, ivory, [-s * .025 - .02, .035, .138], [.025, .03, .01]);
      const brow = group(head, [s * .29, .44, .64]); brows.push(brow);
      oval(brow, skin, [0, 0, 0], [.3, .105, .16], [0, 0, s * .24]);
      for (let i = 0; i < 5; i++) blade(head, light, [s * (.57 + .015 * i), .44 - i * .13, .28], [.13, .4, .1], [.2, 0, -s * 1.9], .5);
    }
    for (let i = 0; i < 5; i++) blade(head, i % 2 ? skin : light, [(i - 2) * .14, .71, -.07], [.13, .38 - Math.abs(i - 2) * .04, .12], [-.2, 0, (i - 2) * -.12]);
    // Sunstone champion's rope and banana-shaped talisman: a small identity cue.
    const cord = tube(body, dark, [[-.65, 1.8, .35], [-.45, 1.15, .85], [0, .85, .87], [.45, 1.15, .85], [.65, 1.8, .35]], () => .045, 24);
    cord.castShadow = false;
    tube(body, material('#ebbb52', { metalness: .2 }), [[-.12, .92, .94], [0, .68, 1.03], [.22, .69, 1.03], [.3, .86, .99]], () => .085, 12);
  }

  for (const s of [-1, 1]) {
    const arm = group(body, [s * (reptile ? 1 : 1.43), reptile ? 1.32 : 1.22, 0]); arms.push(arm);
    oval(arm, skin, [s * .12, -.38, 0], [reptile ? .4 : .56, .65, .43], [0, 0, s * .16]);
    const elbow = group(arm, [s * .2, -.86, .08]); elbows.push(elbow);
    oval(elbow, skin, [0, -.4, .11], [reptile ? .38 : .57, .65, reptile ? .4 : .53]);
    const hand = group(elbow, [0, -.82, .18]);
    oval(hand, reptile ? light : dark, [0, 0, .06], [reptile ? .38 : .59, .37, .42]);
    for (let j = 0; j < 4; j++) {
      const x = (j - 1.5) * (reptile ? .17 : .23);
      oval(hand, skin, [x, -.19, .22], [reptile ? .115 : .16, .22, .22]);
      if (reptile) blade(hand, ivory, [x, -.31, .32], [.07, .24, .065], [2.1, 0, 0], .4);
      else oval(hand, belly, [x, -.04, .4], [.1, .1, .07]);
    }
    oval(hand, skin, [-s * (reptile ? .32 : .5), .03, .22], [.15, .26, .18], [0, 0, s * .5]);
    if (reptile) for (let j = 0; j < 5; j++) blade(elbow, j % 2 ? light : dark, [s * .28, -.05 - j * .13, -.06], [.13, .22, .1], [0, 0, -s * 1.3]);
    else for (let j = 0; j < 10; j++) blade(elbow, j % 3 ? skin : light, [s * (.25 + .13 * Math.sin(j)), .08 - j * .08, -.27 + (j % 3) * .22], [.15, .5, .13], [.1, 0, s * 2.9]);

    const leg = group(root, [s * (reptile ? .66 : .67), 1.55, .04]); legs.push(leg);
    oval(leg, skin, [s * .04, -.27, 0], [reptile ? .53 : .5, .74, .56], [.12, 0, -s * .12]);
    oval(leg, reptile ? light : dark, [s * .1, -.85, .2], [.38, .49, .4], [-.1, 0, 0]);
    oval(leg, skin, [s * .13, -1.28, .4], [.46, .28, .69]);
    for (let j = 0; j < 3; j++) {
      oval(leg, skin, [s * .13 + (j - 1) * .26, -1.31, .85], [.17, .19, .3]);
      if (reptile) blade(leg, ivory, [s * .13 + (j - 1) * .26, -1.27, 1.02], [.1, .34, .085], [1.62, 0, 0]);
    }
  }
  batchStatic(root);
  root.userData.rig = { body, head, jaw, arms, elbows, legs, eyes, brows, kind, baseBodyY: 1.85 };
  return root;
}

const ease = t => t * t * (3 - 2 * t);
const lerp = T.MathUtils.lerp;
export function poseKaiju(root, time, { attack = 0, guard = 0, hit = 0, ko = 0, charged = false, victory = false } = {}) {
  const { body, head, jaw, arms, elbows, legs, eyes, brows, kind } = root.userData.rig;
  const reptile = kind === 'komodor';
  const breath = Math.sin(time * (reptile ? 2 : 1.6));
  body.position.y = 1.85 + breath * .055;
  body.rotation.set(-attack * .36 + guard * .18 + hit * .35, Math.sin(time * .9) * .035 - attack * .34, hit * -.12 + Math.sin(time * .8) * .018);
  body.scale.set(1 + breath * .012, 1 - breath * .009, 1 + breath * .018);
  head.rotation.set(.04 + breath * .035 - attack * .12 + hit * -.26, Math.sin(time * .65) * .07, Math.sin(time * .7) * .035);
  jaw.rotation.x = .02 + attack * .36 + hit * .42 + Math.max(0, Math.sin(time * .75) - .8) * .15;
  for (let i = 0; i < 2; i++) {
    const s = i === 0 ? -1 : 1;
    arms[i].rotation.set(-.12 + Math.sin(time * 1.6 + i) * .045 - guard * 1.15 - attack * (i === 1 ? 1.85 : .6), s * (-.06 - guard * .45), s * (.13 + guard * -.25 + attack * .26));
    elbows[i].rotation.x = -.18 - guard * .8 - attack * (i === 1 ? -.2 : .8);
    legs[i].rotation.x = .04 * Math.sin(time * 1.6 + i) + attack * (i ? -.25 : .18);
    brows[i].rotation.z = s * (hit * -.35 + guard * .2 + (charged ? .16 : 0));
    const blink = Math.sin(time * 1.13 + (reptile ? 0 : 2)) > .998 ? .15 : 1;
    eyes[i].scale.y = lerp(blink, .4, hit);
  }
  if (root.userData.tail) root.userData.tail.rotation.y = Math.sin(time * 1.4) * .16 + attack * .4;
  if (victory) { body.position.y += Math.abs(Math.sin(time * 3)) * .1; head.rotation.x = -.15; arms[1].rotation.x = -2.4 + Math.sin(time * 3) * .15; }
  if (ko > 0) {
    const k = ease(Math.min(1, ko));
    body.rotation.x += k * -.5; head.rotation.x += k * .45;
    root.rotation.z = k * (reptile ? -.95 : .95);
    root.position.y = -k * .25;
    for (let i = 0; i < 2; i++) { arms[i].rotation.x += k * .4; legs[i].rotation.x += k * -.7; }
  } else { root.rotation.z = 0; root.position.y = 0; }
}
