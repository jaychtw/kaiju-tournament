import './style.css';
import { initialBattle, resolveRound, MASH_MS } from './combat.js';
import { messages } from './i18n.js';
import { createBattleScene } from './illustrated-scene.js';
import { BattleAudio } from './audio.js';

const icons = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  claw: '<path d="M6 18 3 21m7-4 8-8 3-7-7 3-8 8m1-6 5-5-1 7m4 8 7-1-5 5M4 14l6 6"/>',
  shield: '<path d="M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6l-9-4Z"/><path d="m8 12 3 3 5-6"/>',
  sound: '<path d="m3 9 5 0 5-5v16l-5-5H3V9Z"/><path d="M17 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/>',
  mute: '<path d="m3 9 5 0 5-5v16l-5-5H3V9Z"/><path d="m17 9 6 6m0-6-6 6"/>',
  replay: '<path d="M3 10a9 9 0 1 1 2 8M3 3v7h7"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9 8a3 3 0 0 1 6 1c0 2-3 2-3 5m0 3v1"/>',
  bolt: '<path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z"/>',
};
const svg = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
let language = 'en', muted = false;
try { language = localStorage.getItem('wkt-language') === 'zh-TW' ? 'zh-TW' : 'en'; muted = localStorage.getItem('wkt-muted') === 'true'; } catch { /* Private browsing can deny storage. */ }
const t = key => messages[language][key] ?? key;
const app = document.querySelector('#app');
app.innerHTML = `
  <header class="topbar">
    <a class="brand" href="./" aria-label="World Kaiju Tournament">${svg('sun')}<span><strong data-i="title"></strong><small data-i="subtitle"></small></span></a>
    <div class="edition"><span class="status-dot"></span><span data-i="poc"></span></div>
    <nav class="tools" aria-label="Settings">
      <div class="language"><button id="en" lang="en">EN</button><span>/</span><button id="zh" lang="zh-Hant">繁中</button></div>
      <button id="quality" class="quality-button"></button>
      <button id="sound" class="icon-button"></button>
      <button id="help" class="icon-button">${svg('help')}</button>
    </nav>
  </header>
  <main>
    <section class="stage" aria-label="3D battle arena">
      <canvas id="battle" aria-label="Komodor facing Grumbongo in Sunstone Arena"></canvas>
      <div class="vignette"></div>
      <div class="scoreboard">
        <div class="fighter-card player-card">
          <div class="fighter-line"><span class="role" data-i="player"></span><span class="clan" data-i="scales"></span></div>
          <div class="name-line"><h1 data-i="komodor"></h1><span class="hp-number"><b id="player-hp">200</b><span> / 200</span></span></div>
          <div class="hp-track" role="progressbar" aria-label="Komodor HP" aria-valuemin="0" aria-valuemax="200" aria-valuenow="200" id="player-bar"><div class="hp-trail"></div><div class="hp-fill"></div></div>
          <div class="card-under"><span class="stat">ATK 150 <i>·</i> DEF 100</span><span class="charge-label" id="charge-label">${svg('bolt')}<span data-i="counterReady"></span></span></div>
        </div>
        <div class="round-counter"><span data-i="round"></span><b id="round-number">01</b><i></i></div>
        <div class="fighter-card enemy-card">
          <div class="fighter-line"><span class="role" data-i="rival"></span><span class="clan" data-i="bananas"></span></div>
          <div class="name-line"><h1 data-i="grumbongo"></h1><span class="hp-number"><b id="enemy-hp">185</b><span> / 185</span></span></div>
          <div class="hp-track" role="progressbar" aria-label="Grumbongo HP" aria-valuemin="0" aria-valuemax="185" aria-valuenow="185" id="enemy-bar"><div class="hp-trail"></div><div class="hp-fill"></div></div>
          <div class="card-under"><span class="stat">ATK 175 <i>·</i> DEF 90</span><span class="enemy-tell">${svg('claw')}<span data-i="attack"></span></span></div>
        </div>
      </div>
      <div class="arena-caption"><span class="caption-rule"></span><div><strong data-i="arena"></strong><small data-i="location"></small></div></div>
      <button id="restart" class="restart-button">${svg('replay')}<span data-i="replay"></span></button>
      <div id="damage-layer" aria-hidden="true"></div>
      <div id="impact-flash"></div>
      <div id="result" class="result" hidden><span class="eyebrow" id="result-kind"></span><h2 id="result-title"></h2><p id="result-sub"></p><button id="rematch"><span data-i="rematch"></span>${svg('arrow')}</button></div>
      <div id="fallback" class="fallback" hidden><h2 data-i="unavailable"></h2><p data-i="webglHelp"></p></div>
      <div id="loading" class="loading"><span class="loader"></span><strong>WORLD KAIJU</strong></div>
    </section>
    <section class="combat-deck" aria-label="Battle controls">
      <div class="round-message"><span class="eyebrow"><span class="tiny-sun">✦</span> <span id="phase-label" data-i="study"></span></span><h2 id="message"></h2><p id="message-sub"></p></div>
      <div class="actions" id="actions">
        <button class="action attack" id="attack">${svg('claw')}<span class="action-copy"><strong id="attack-label"></strong><small id="attack-sub"></small></span><kbd>A</kbd></button>
        <button class="action defend" id="defend">${svg('shield')}<span class="action-copy"><strong data-i="defend"></strong><small id="defend-sub" data-i="defendSub"></small></span><kbd>D</kbd></button>
      </div>
      <div class="mash-panel" id="mash-panel" hidden>
        <div class="mash-readout"><div class="timer-line"><b id="seconds">3.0</b><span>s</span><strong id="multiplier">×1.00</strong></div><div class="mash-track"><div id="mash-progress"></div></div><small><b id="press-count">0</b> <span data-i="presses"></span> <span class="mash-help" data-i="mashHelp"></span></small></div>
        <button id="tap" class="tap">${svg('bolt')}<strong data-i="mash"></strong><span data-i="spaceKey"></span></button>
      </div>
    </section>
  </main>
  <footer><span data-i="footer"></span><div class="key-hints"><span data-i="keys"></span><span data-i="keys2"></span><span data-i="space"></span></div><button id="rules-link" data-i="rules"></button></footer>
  <div id="announcer" class="sr-only" role="status" aria-live="polite"></div>
  <dialog id="rules-dialog" aria-labelledby="help-title"><button id="close-x" class="close-x" aria-label="Close">×</button><span class="eyebrow" data-i="study"></span><h2 id="help-title" data-i="helpTitle"></h2><ol><li data-i="help1"></li><li data-i="help2"></li><li data-i="help3"></li></ol><p class="formula" data-i="help4"></p><button id="close-help" class="primary" data-i="close"></button></dialog>
`;
const $ = id => document.getElementById(id);
const audio = new BattleAudio(); audio.mute(muted);
let state = initialBattle(), phase = 'ready', action = null, presses = 0, deadline = 0, hiddenAt = 0, view;
let quality = matchMedia('(max-width: 650px)').matches ? 'low' : 'high';
const heldKeys = new Set();
const resultNames = { en: { victory: 'VICTORY', defeat: 'DEFEAT', draw: 'DOUBLE K.O.' }, 'zh-TW': { victory: '勝利', defeat: '落敗', draw: '雙重擊倒' } };
function announce(text) { $('announcer').textContent = text; }
function updateHP() {
  for (const [id, hp, max] of [['player', state.playerHP, 200], ['enemy', state.enemyHP, 185]]) {
    $(`${id}-hp`).textContent = hp;
    $(`${id}-bar`).setAttribute('aria-valuenow', hp);
    $(`${id}-bar`).querySelector('.hp-fill').style.width = `${hp / max * 100}%`;
    $(`${id}-bar`).querySelector('.hp-trail').style.width = `${hp / max * 100}%`;
    $(`${id}-bar`).classList.toggle('low-hp', hp / max < .3);
  }
}
function translate() {
  document.documentElement.lang = language === 'en' ? 'en' : 'zh-Hant';
  for (const el of document.querySelectorAll('[data-i]')) el.textContent = t(el.dataset.i);
  $('en').setAttribute('aria-pressed', language === 'en'); $('zh').setAttribute('aria-pressed', language === 'zh-TW');
  $('sound').innerHTML = svg(muted ? 'mute' : 'sound'); $('sound').setAttribute('aria-label', t(muted ? 'soundOff' : 'soundOn')); $('sound').title = t(muted ? 'soundOff' : 'soundOn'); $('sound').setAttribute('aria-pressed', !muted);
  $('help').setAttribute('aria-label', t('rules')); $('quality').textContent = `${t('quality')} · ${t(quality)}`;
  $('quality').setAttribute('aria-label', `${t('quality')}: ${t(quality)}`);
  $('close-x').setAttribute('aria-label', t('close'));
  $('battle').setAttribute('aria-label', `${t('komodor')} × ${t('grumbongo')} · ${t('arena')}`);
  document.querySelector('.tools').setAttribute('aria-label', t('settings'));
  document.querySelector('.combat-deck').setAttribute('aria-label', t('battleControls'));
  document.querySelector('.stage').setAttribute('aria-label', t('arena'));
  $('player-bar').setAttribute('aria-label', `${t('komodor')} HP`);
  $('enemy-bar').setAttribute('aria-label', `${t('grumbongo')} HP`);
  updateUI();
}
function updateUI() {
  $('round-number').textContent = String(state.round).padStart(2, '0');
  $('charge-label').classList.toggle('visible', state.charged);
  $('attack').classList.toggle('charged', state.charged);
  $('attack-label').textContent = t(state.charged ? 'chargedAttack' : 'attack');
  $('attack-sub').textContent = state.charged ? '×1.5' : t('attackSub');
  $('defend-sub').textContent = t(state.charged ? 'locked' : 'defendSub');
  $('attack').disabled = phase !== 'ready'; $('defend').disabled = phase !== 'ready' || state.charged;
  $('help').disabled = $('rules-link').disabled = phase === 'mash' || phase === 'resolving';
  $('restart').disabled = phase === 'resolving';
  $('actions').hidden = phase === 'mash'; $('mash-panel').hidden = phase !== 'mash';
  let title, sub;
  if (phase === 'ready') { title = t(state.charged ? 'charged' : 'ready'); sub = t(state.charged ? 'chargedSub' : 'readySub'); }
  else if (phase === 'mash') { title = t(action === 'attack' ? 'mashAttack' : 'mashDefend'); sub = t('mashHelp'); }
  else if (phase === 'resolving') { title = t('resolving'); sub = t('resolvingSub'); }
  else { title = t(state.outcome); sub = t(`${state.outcome}Sub`); }
  $('message').textContent = title; $('message-sub').textContent = sub;
  $('phase-label').textContent = phase === 'mash' ? t(action === 'attack' ? 'power' : 'guard') : t('study');
  $('result').hidden = phase !== 'over';
  if (phase === 'over') {
    $('result-kind').textContent = resultNames[language][state.outcome]; $('result-title').textContent = t(state.outcome); $('result-sub').textContent = t(`${state.outcome}Sub`);
    $('result').dataset.outcome = state.outcome;
  }
}
function choose(next) {
  if (!view || phase !== 'ready' || (state.charged && next === 'defend') || $('rules-dialog').open) return;
  audio.unlock(); audio.choose(next === 'defend');
  action = next; presses = 0; deadline = performance.now() + MASH_MS; phase = 'mash';
  view.prepare(next);
  $('press-count').textContent = '0'; $('multiplier').textContent = '×1.00'; $('seconds').textContent = '3.0'; $('mash-progress').style.width = '100%';
  updateUI(); $('tap').focus({ preventScroll: true }); announce(t(next === 'attack' ? 'mashAttack' : 'mashDefend'));
}
function tap() {
  if (phase !== 'mash' || performance.now() >= deadline || document.hidden) return;
  presses++; $('press-count').textContent = presses; $('multiplier').textContent = `×${(1 + presses * .01).toFixed(2)}`;
  view.press();
  $('tap').classList.remove('popped'); void $('tap').offsetWidth; $('tap').classList.add('popped');
  audio.tap(presses);
}
function finishMash() {
  if (phase !== 'mash') return;
  phase = 'resolving'; const result = resolveRound(state, action, presses); updateUI(); view.startRound(result);
}
function floatDamage(who, amount, guarded) {
  const p = view.project(who), el = document.createElement('div'); el.className = `damage ${guarded ? 'guard-damage' : ''}`;
  el.style.left = `${p.x * 100}%`; el.style.top = `${Math.max(.23, p.y) * 100}%`;
  el.innerHTML = `<strong>${amount === 0 ? '0' : `−${amount}`}</strong><span>${t(guarded ? 'blocked' : 'hit')}</span>`; $('damage-layer').append(el); setTimeout(() => el.remove(), 1500);
}
function reset() {
  if (phase === 'resolving') return;
  view?.reset(); state = initialBattle(); phase = 'ready'; heldKeys.clear(); $('damage-layer').replaceChildren(); updateHP(); updateUI(); announce(t('ready'));
}
try {
  view = await createBattleScene($('battle'), {
    onFrame(now) {
      if (phase === 'mash' && !document.hidden) {
        const left = Math.max(0, deadline - now); $('seconds').textContent = (left / 1000).toFixed(1); $('mash-progress').style.width = `${left / MASH_MS * 100}%`;
        if (left === 0) finishMash();
      }
    },
    onImpact(result) {
      // The scene can sequence poses, but HP values are committed together here.
      const currentRound = state.round; state = { ...result.state, round: currentRound }; updateHP();
      floatDamage('player', result.received, result.action === 'defend'); if (result.action === 'attack') floatDamage('enemy', result.dealt, false);
      audio.impact(result.action === 'defend', result.chargedAttack);
      $('impact-flash').classList.remove('flash'); void $('impact-flash').offsetWidth; $('impact-flash').classList.add('flash');
      announce(`${t('komodor')} ${state.playerHP} HP. ${t('grumbongo')} ${state.enemyHP} HP.`);
    },
    onComplete(result) {
      state = { ...result.state, round: result.state.outcome ? result.state.round - 1 : result.state.round };
      phase = state.outcome ? 'over' : 'ready'; updateUI();
      if (state.outcome) { audio.finish(state.outcome); announce(`${resultNames[language][state.outcome]}. ${t(`${state.outcome}Sub`)}`); }
      else announce(t(state.charged ? 'chargedSub' : 'ready'));
    },
  });
  // Read-only diagnostics for measurement and automated review; no gameplay cheats.
  window.wktDiagnostics = () => ({ phase, state: { ...state }, presses, rendering: view.getStats() });
} catch (error) {
  console.error(error); $('fallback').hidden = false; $('actions').inert = true;
}
$('loading').hidden = true;
$('attack').addEventListener('click', () => choose('attack')); $('defend').addEventListener('click', () => choose('defend'));
$('tap').addEventListener('pointerdown', e => { if (e.isPrimary && e.button === 0) { e.preventDefault(); tap(); } });
$('tap').addEventListener('click', e => { if (e.detail === 0 && !heldKeys.has('Space')) tap(); });
window.addEventListener('keydown', e => {
  if (e.ctrlKey || e.altKey || e.metaKey || $('rules-dialog').open) return;
  if (!['Space', 'KeyA', 'KeyD'].includes(e.code)) return;
  if (e.code === 'Space' && phase !== 'mash') return;
  e.preventDefault(); if (e.repeat || heldKeys.has(e.code)) return; heldKeys.add(e.code);
  if (e.code === 'Space') tap(); else choose(e.code === 'KeyA' ? 'attack' : 'defend');
});
window.addEventListener('keyup', e => heldKeys.delete(e.code)); window.addEventListener('blur', () => heldKeys.clear());
document.addEventListener('visibilitychange', () => {
  heldKeys.clear(); if (document.hidden) { hiddenAt = performance.now(); audio.context?.suspend(); }
  else { if (phase === 'mash' && hiddenAt) deadline += performance.now() - hiddenAt; hiddenAt = 0; if (audio.context) audio.unlock(); }
});
for (const [id, lang] of [['en', 'en'], ['zh', 'zh-TW']]) $(id).addEventListener('click', () => { language = lang; try { localStorage.setItem('wkt-language', lang); } catch {} translate(); });
$('sound').addEventListener('click', () => { muted = !muted; audio.mute(muted); audio.unlock(); try { localStorage.setItem('wkt-muted', String(muted)); } catch {} translate(); });
$('quality').addEventListener('click', () => { quality = quality === 'high' ? 'low' : 'high'; view?.setQuality(quality); translate(); });
for (const id of ['help', 'rules-link']) $(id).addEventListener('click', () => $('rules-dialog').showModal());
for (const id of ['close-help', 'close-x']) $(id).addEventListener('click', () => $('rules-dialog').close());
$('rules-dialog').addEventListener('click', e => { if (e.target === $('rules-dialog')) { const r = $('rules-dialog').getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) $('rules-dialog').close(); } });
$('restart').addEventListener('click', reset); $('rematch').addEventListener('click', reset);
translate(); updateHP();
