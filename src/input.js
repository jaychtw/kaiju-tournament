export function createInput(onKey) {
  const held = new Set();
  const down = event => {
    if (event.ctrlKey || event.altKey || event.metaKey || (event.target instanceof Element && event.target.matches('input,textarea,select'))) return;
    const fresh = !event.repeat && !held.has(event.code);
    // The consumer decides whether the key belongs to gameplay or native UI.
    if (onKey(event, fresh)) { event.preventDefault(); held.add(event.code); }
  };
  const up = event => held.delete(event.code), clear = () => held.clear();
  window.addEventListener('keydown',down); window.addEventListener('keyup',up); window.addEventListener('blur',clear);
  document.addEventListener('visibilitychange',clear);
  return { held, clear, destroy() { window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',clear);document.removeEventListener('visibilitychange',clear); } };
}
