const base = import.meta.env.BASE_URL;
const cache = new Map();
let manifest;
export async function getArt() {
  if (!manifest) manifest = fetch(`${base}art/manifest.json`).then(r => {
    if (!r.ok) throw new Error('Asset manifest unavailable');
    return r.json();
  }).catch(error => { manifest = null; throw error; });
  return manifest;
}
export function loadImage(file) {
  if (!cache.has(file)) cache.set(file, new Promise((resolve, reject) => {
    const image = new Image(); image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => { cache.delete(file); reject(new Error(`Missing artwork: ${file}`)); };
    image.src = `${base}${file}`;
  }));
  return cache.get(file);
}
export function releaseImages(files) { for (const file of files) cache.delete(file); }
export async function loadBattleArt(player = 'komodor', enemy = 'grumbongo') {
  const art = await getArt();
  const sources = [art.characters[player].rear, art.characters[enemy].front];
  const images = new Map();
  await Promise.all([art.arena, ...sources.flatMap(frames => Object.values(frames).map(f => f.file))].map(async file => images.set(file, await loadImage(file))));
  return { art, images, sources };
}
