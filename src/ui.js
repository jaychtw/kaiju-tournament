const paths = {
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
 claw:'<path d="M6 18 3 21m7-4 8-8 3-7-7 3-8 8m1-6 5-5-1 7m4 8 7-1-5 5M4 14l6 6"/>',
 shield:'<path d="M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6l-9-4Z"/><path d="m8 12 3 3 5-6"/>',
 sound:'<path d="m3 9 5 0 5-5v16l-5-5H3V9Z"/><path d="M17 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/>',
 mute:'<path d="m3 9 5 0 5-5v16l-5-5H3V9Z"/><path d="m17 9 6 6m0-6-6 6"/>',
 arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
 help:'<circle cx="12" cy="12" r="10"/><path d="M9 8a3 3 0 0 1 6 1c0 2-3 2-3 5m0 3v1"/>',
 bolt:'<path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z"/>',
 trophy:'<path d="M7 3h10v7c0 7-10 7-10 0V3Zm0 2H3v3c0 4 4 4 4 4m10-7h4v3c0 4-4 4-4 4m-5 3v6m-5 0h10"/>',
};
export const svg = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.sun}</svg>`;
export const $ = id => document.getElementById(id);
export const escapeHTML = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
