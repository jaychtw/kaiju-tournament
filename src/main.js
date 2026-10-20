import './style.css';
import { initialBattle, resolveRound, MASH_MS, fighters } from './combat.js';
import { roster, ids, identity } from './roster.js';
import { newTournament, challenge, recordMatch, remaining, standings, serialize, restore } from './tournament.js';
import { messages } from './i18n.js';
import { getArt } from './assets.js';
import { createBattleScene } from './illustrated-scene.js';
import { createGrounds } from './grounds.js';
import { createInput } from './input.js';
import { BattleAudio } from './audio.js';
import { $, svg, escapeHTML as esc } from './ui.js';

const storage = { get(key) { try{return localStorage.getItem(key);}catch{return null;} }, set(key,value) {try{localStorage.setItem(key,value);}catch{}},remove(key){try{localStorage.removeItem(key);}catch{}} };
let language=storage.get('wkt-language')==='zh-TW'?'zh-TW':'en',muted=storage.get('wkt-muted')==='true';
const t=(key,params={})=>Object.entries(params).reduce((copy,[name,value])=>copy.replaceAll(`{${name}}`,String(value)),messages[language][key]??key);
const name=id=>identity(id,language)[0],clan=id=>identity(id,language)[1];
const audio=new BattleAudio();audio.mute(muted);
let art, screen='loading', selected='komodor', tournament=restore(storage.get('wkt-tournament')), grounds, view, position, battle;
let phase='loading', action=null, presses=0, deadline=0, hiddenAt=0, lastRound=null, challengeId=null, battleToken=0;
const base=import.meta.env.BASE_URL;
const input=createInput((event,fresh)=>{
  if($('rules-dialog').open || $('challenge-dialog').open)return false;
  if(screen==='grounds' && ['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowLeft','ArrowDown','ArrowRight'].includes(event.code))return true;
  if(screen==='battle' && ['KeyA','KeyD','Space'].includes(event.code)) {
    if(event.code==='Space' && phase!=='mash')return false;
    if(fresh){if(event.code==='Space')tap();else choose(event.code==='KeyA'?'attack':'defend');}return true;
  }
  return false;
});
$('app').innerHTML=`
<header class="topbar"><div class="brand">${svg('sun')}<span><strong data-i="title"></strong><small data-i="subtitle"></small></span></div><span class="edition" data-i="edition"></span><nav class="tools"><div class="language"><button id="en" lang="en">EN</button><span>/</span><button id="zh" lang="zh-Hant">繁中</button></div><button id="sound" class="icon-button"></button><button id="help" class="icon-button">${svg('help')}</button></nav></header>
<main id="content" tabindex="-1"></main>
<footer><span data-i="footer"></span><button id="rules-link" data-i="rules"></button></footer>
<div id="announcer" class="sr-only" role="status" aria-live="polite"></div>
<dialog id="rules-dialog" aria-labelledby="help-title"><span class="eyebrow" data-i="firstSteps"></span><h2 id="help-title" data-i="helpTitle"></h2><ol><li data-i="help1"></li><li data-i="help2"></li><li data-i="help3"></li></ol><p class="formula" data-i="help4"></p><p data-i="helpTip"></p><button id="close-help" class="primary" data-i="close"></button></dialog>
<dialog id="challenge-dialog" aria-labelledby="challenge-title"><span class="eyebrow" data-i="match"></span><h2 id="challenge-title"></h2><p data-i="challengeSub"></p><div class="dialog-actions"><button id="accept-challenge" class="primary" data-i="yes"></button><button id="decline-challenge" class="secondary" data-i="no"></button></div></dialog>`;
function announce(message){$('announcer').textContent=message;}
function staticText(root=document){for(const el of root.querySelectorAll('[data-i]'))el.textContent=t(el.dataset.i);}
function portrait(id,view='front'){const frames=art.characters[id][view];return frames.idle||frames[id==='komodor'?'k_idle_0':'g_attack_0']||Object.values(frames)[0];}
function title(eyebrow,heading,sub){return `<div class="page-heading"><span class="eyebrow">${esc(eyebrow)}</span><h1>${esc(heading)}</h1>${sub?`<p>${esc(sub)}</p>`:''}</div>`;}
function clean(){grounds?.destroy();grounds=null;view?.destroy();view=null;input.clear();battleToken++;$('challenge-dialog').close();challengeId=null;}
function focusContent(){requestAnimationFrame(()=>$('content').focus({preventScroll:true}));window.scrollTo({top:0,behavior:'instant'});}
function save(){storage.set('wkt-tournament',serialize(tournament));}
function translate(){
  document.documentElement.lang=language==='en'?'en':'zh-Hant';document.title=`${t('title')} ${t('subtitle')}`;staticText();
  $('en').setAttribute('aria-pressed',String(language==='en'));$('zh').setAttribute('aria-pressed',String(language==='zh-TW'));
  $('sound').innerHTML=svg(muted?'mute':'sound');$('sound').setAttribute('aria-label',t(muted?'soundOff':'soundOn'));$('sound').setAttribute('aria-pressed',String(!muted));
  $('help').setAttribute('aria-label',t('rules'));document.querySelector('.tools').setAttribute('aria-label',t('settings'));
  if(screen==='selection')renderSelection(false);
  else if(screen==='grounds'){renderGroundsText();grounds?.translate();}
  else if(screen==='battle'){renderBattleText();updateBattleUI();}
  else if(screen==='results')renderResults(false);
  if(challengeId)$('challenge-title').textContent=t('challengeTitle',{name:name(challengeId)});
}
function stats(id){const f=fighters[id];return `<dl class="stats">${[['hp',f.hp],['atk',f.atk],['def',f.def]].map(([key,value])=>`<div><dt>${t(key)}</dt><dd>${value}</dd></div>`).join('')}</dl>`;}
function renderSelection(focus=true){
  screen='selection';phase='selection';
  $('content').innerHTML=`<section class="selection-screen">${title(t('select'),t('chooseTitle'),t('chooseSub'))}<div class="selection-guide"><span>${svg('claw')}<b>01</b> ${t('select')}</span><span>${svg('sun')}<b>02</b> ${t('grounds')}</span><span>${svg('trophy')}<b>03</b> ${t('finalResults')}</span></div>
  <div class="roster-grid">${ids.map(id=>`<button class="character-card ${selected===id?'selected':''}" id="select-${id}" data-select="${id}" aria-pressed="${selected===id}" style="--character-color:${roster[id].color}"><div class="card-art"><span class="card-number">${String(ids.indexOf(id)+1).padStart(2,'0')}</span><img src="${base}${portrait(id).file}" alt=""/><span class="selected-badge">✓ ${t('selected')}</span></div><div class="card-copy"><small class="clan">${esc(clan(id))}</small><h2>${esc(name(id))}</h2><span class="archetype">${identity(id,language)[3]}</span>${stats(id)}<p>${esc(identity(id,language)[2])}</p></div></button>`).join('')}</div>
  <div class="selection-bottom"><div><strong id="chosen-name">${esc(name(selected))}</strong><p data-i="selectionHint"></p></div><div class="selection-buttons">${tournament?`<button id="resume" class="secondary">${t('resume')}</button>`:''}<button id="begin" class="primary">${t('begin')} ${svg('arrow')}</button></div></div></section>`;
  staticText($('content'));
  for(const button of document.querySelectorAll('[data-select]'))button.addEventListener('click',()=>{selected=button.dataset.select;for(const card of document.querySelectorAll('[data-select]')){card.classList.toggle('selected',card.dataset.select===selected);card.setAttribute('aria-pressed',String(card.dataset.select===selected));}$('chosen-name').textContent=name(selected);audio.unlock();audio.choose(false);});
  $('begin').addEventListener('click',()=>{clean();tournament=newTournament(selected);position=null;save();audio.unlock();renderGrounds();});
  $('resume')?.addEventListener('click',()=>{clean();selected=tournament.player;standings(tournament).complete?renderResults():renderGrounds();});
  if(focus)focusContent();
}
function recordHTML(){return tournament.history.length?`<ol class="match-history">${tournament.history.map((m,i)=>`<li><span class="history-index">${i+1}</span><strong>${esc(name(m.opponent))}</strong><span class="outcome ${m.outcome}">${t(`result${m.outcome[0].toUpperCase()+m.outcome.slice(1)}`)}</span></li>`).join('')}</ol>`:`<p class="empty-history">${t('noHistory')}</p>`;}
function standingsHTML(){const s=standings(tournament);return `<div class="standings-strip">${[['wins',s.wins],['losses',s.losses],['remaining',s.remaining]].map(([key,value])=>`<span><b>${value}</b> ${t(key)}</span>`).join('')}</div>`;}
function renderGroundsText(){
  $('grounds-heading').innerHTML=title(clan(tournament.player),t('groundsTitle'),t('groundsHelp'));
  $('standings').innerHTML=standingsHTML();$('history-panel').innerHTML=`<h2>${t('history')}</h2>${recordHTML()}<small>${t('saved')}</small>`;
}
function renderGrounds(){
  clean();screen='grounds';phase='grounds';battle=null;lastRound=null;
  $('content').innerHTML=`<section class="grounds-screen"><div id="grounds-heading"></div><div id="standings"></div><div class="grounds-layout"><div id="grounds-root"></div><aside id="history-panel"></aside></div></section>`;
  renderGroundsText();
  grounds=createGrounds($('grounds-root'),{tournament,art,input,getLanguage:()=>language,t,onChallenge:openChallenge,isPaused:()=>$('challenge-dialog').open||$('rules-dialog').open,position});
  focusContent();announce(t('groundsHelp'));
}
function openChallenge(id){if(screen!=='grounds'||challengeId||!remaining(tournament).includes(id))return;input.clear();challengeId=id;$('challenge-title').textContent=t('challengeTitle',{name:name(id)});staticText($('challenge-dialog'));$('challenge-dialog').showModal();}
function decline(){challengeId=null;$('challenge-dialog').close();$('grounds-world')?.focus({preventScroll:true});}
$('decline-challenge').addEventListener('click',decline);
$('challenge-dialog').addEventListener('cancel',()=>{challengeId=null;});
$('accept-challenge').addEventListener('click',()=>{if(!challengeId)return;const enemy=challengeId;position=grounds.getPosition();tournament=challenge(tournament,enemy);clean();audio.unlock();startBattle(enemy);});
function fighterCard(id,side){return `<div class="fighter-card ${side}-card"><div class="fighter-line"><span class="role">${t(side==='player'?'player':'rival')}</span><span class="clan">${esc(clan(id))}</span></div><div class="name-line"><h2>${esc(name(id))}</h2><span class="hp-number"><b id="${side}-hp"></b><span> / ${fighters[id].hp}</span></span></div><div class="hp-track" id="${side}-bar" role="progressbar" aria-label="${esc(name(id))} ${t('hp')}" aria-valuemin="0" aria-valuemax="${fighters[id].hp}"><div class="hp-fill"></div></div><div class="card-under"><span>${t('atk')} ${fighters[id].atk} · ${t('def')} ${fighters[id].def}</span>${side==='player'?`<span class="charge-label" id="charge-label">${svg('bolt')} ${t('counterReady')}</span>`:`<span>${t('attacks')}</span>`}</div></div>`;}
function renderBattleText(){
  if(!battle)return;
  $('scoreboard').innerHTML=`${fighterCard(battle.playerId,'player')}<div class="round-counter"><small>${t('round')}</small><b id="round-number"></b></div>${fighterCard(battle.enemyId,'enemy')}`;
  $('battle-caption').textContent=`${t('arena')} · ${t('match')} ${tournament.history.length+(tournament.active?1:0)} / 5`;
  $('battle').setAttribute('aria-label',`${name(battle.playerId)} × ${name(battle.enemyId)} · ${t('arena')}`);
  document.querySelector('.combat-deck').setAttribute('aria-label',t('battleControls'));staticText($('content'));updateHP();
}
async function startBattle(enemy){
  screen='battle';phase='loading';battle=initialBattle(tournament.player,enemy);lastRound=null;presses=0;const token=++battleToken;
  $('content').innerHTML=`<section class="battle-screen"><div class="battle-caption" id="battle-caption"></div><div class="scoreboard" id="scoreboard"></div><div class="battle-stage"><canvas id="battle"></canvas><div id="damage-layer" aria-hidden="true"></div><div id="result" class="result" hidden><span class="eyebrow" id="result-kind"></span><h2 id="result-title"></h2><p id="result-sub"></p><button id="continue" class="primary"></button></div><div id="loading" class="loading"><span class="loader"></span><strong data-i="loading"></strong></div><div id="load-error" class="loading" hidden><p data-i="loadError"></p><button id="retry" class="primary" data-i="retry"></button></div></div>
  <section class="combat-deck"><div class="round-message"><span class="eyebrow" id="phase-label"></span><h2 id="message"></h2><p id="message-sub"></p><small id="last-round" role="status"></small></div><div class="actions" id="actions"><button class="action attack" id="attack">${svg('claw')}<span><strong id="attack-label"></strong><small id="attack-sub"></small></span><kbd>A</kbd></button><button class="action defend" id="defend">${svg('shield')}<span><strong data-i="defend"></strong><small id="defend-sub"></small></span><kbd>D</kbd></button></div><div class="mash-panel" id="mash-panel" hidden><div class="mash-readout"><div class="timer-line"><b id="seconds">3.0</b><span>s</span><strong id="multiplier">×1.00</strong></div><div class="mash-track"><div id="mash-progress"></div></div><small><b id="press-count">0</b> <span data-i="presses"></span></small></div><button id="tap" class="tap">${svg('bolt')}<strong data-i="mash"></strong><span data-i="spaceKey"></span></button></div></section></section>`;
  renderBattleText();updateBattleUI();focusContent();
  $('attack').addEventListener('click',()=>choose('attack'));$('defend').addEventListener('click',()=>choose('defend'));
  $('tap').addEventListener('pointerdown',event=>{if(event.isPrimary&&event.button===0){event.preventDefault();tap();}});
  $('tap').addEventListener('click',event=>{if(event.detail===0&&!input.held.has('Space'))tap();});
  $('continue').addEventListener('click',()=>{if(phase!=='over')return;standings(tournament).complete?showResults():renderGrounds();});
  $('retry').addEventListener('click',()=>{view?.destroy();startBattle(enemy);});
  try {
    const scene=await createBattleScene($('battle'),{
      onFrame(now){if(phase==='mash'&&!document.hidden){const left=Math.max(0,deadline-now);$('seconds').textContent=(left/1000).toFixed(1);$('mash-progress').style.width=`${left/MASH_MS*100}%`;if(left===0)finishMash();}},
      onImpact(result){battle={...result.state,round:battle.round};updateHP();floatDamage('player',result.received,result.action==='defend');if(result.action==='attack')floatDamage('enemy',result.dealt,false);audio.impact(result.action==='defend',result.chargedAttack);announce(`${name(battle.playerId)} ${battle.playerHP}. ${name(battle.enemyId)} ${battle.enemyHP}.`);},
      onComplete(result){battle=result.state;lastRound=result;phase=battle.outcome?'over':'ready';if(battle.outcome){tournament=recordMatch(tournament,battle);save();audio.finish(battle.outcome);}updateBattleUI();announce(t(battle.outcome?`${battle.outcome}Sub`:battle.charged?'chargedSub':'ready'));},
    },battle.playerId,battle.enemyId);
    if(token!==battleToken){scene.destroy();return;}view=scene;phase='ready';$('loading').hidden=true;updateBattleUI();
  } catch(error){if(token!==battleToken)return;console.error(error);$('loading').hidden=true;$('load-error').hidden=false;}
}
function choose(next){
  if(screen!=='battle'||!view||phase!=='ready'||(battle.charged&&next==='defend')||$('rules-dialog').open)return;
  audio.unlock();audio.choose(next==='defend');action=next;presses=0;deadline=performance.now()+MASH_MS;phase='mash';view.prepare(next,battle.charged);
  $('press-count').textContent='0';$('multiplier').textContent='×1.00';$('seconds').textContent='3.0';$('mash-progress').style.width='100%';updateBattleUI();$('tap').focus({preventScroll:true});announce(t(next==='attack'?'mashAttack':'mashDefend'));
}
function tap(){
  if(phase!=='mash'||performance.now()>=deadline||document.hidden)return;presses++;$('press-count').textContent=presses;$('multiplier').textContent=`×${(1+presses*.01).toFixed(2)}`;view.press();audio.tap(presses);
  $('tap').classList.remove('popped');void $('tap').offsetWidth;$('tap').classList.add('popped');
}
function finishMash(){if(phase!=='mash')return;phase='resolving';const result=resolveRound(battle,action,presses);updateBattleUI();view.startRound(result);}
function updateHP(){if(screen!=='battle'||!battle)return;for(const [side,id,hp]of [['player',battle.playerId,battle.playerHP],['enemy',battle.enemyId,battle.enemyHP]]){const max=fighters[id].hp;$(`${side}-hp`).textContent=hp;$(`${side}-bar`).setAttribute('aria-valuenow',hp);$(`${side}-bar`).querySelector('.hp-fill').style.width=`${hp/max*100}%`;$(`${side}-bar`).classList.toggle('low-hp',hp/max<.3);}}
function updateBattleUI(){
  if(screen!=='battle'||!battle)return;
  $('round-number').textContent=String(battle.outcome?battle.round-1:battle.round).padStart(2,'0');$('charge-label').classList.toggle('visible',battle.charged);$('attack').classList.toggle('charged',battle.charged);
  $('attack-label').textContent=t(battle.charged?'chargedAttack':'attack');$('attack-sub').textContent=battle.charged?'×1.5':t('attackSub');$('defend-sub').textContent=t(battle.charged?'locked':'defendSub');
  $('attack').disabled=phase!=='ready';$('defend').disabled=phase!=='ready'||battle.charged;
  $('help').disabled=$('rules-link').disabled=phase==='mash'||phase==='resolving';
  $('actions').hidden=phase==='mash';$('mash-panel').hidden=phase!=='mash';
  const titleKey=phase==='ready'?(battle.charged?'charged':'ready'):phase==='mash'?(action==='attack'?'mashAttack':'mashDefend'):phase==='over'?battle.outcome:phase==='loading'?'loading':'resolving';
  const subKey=phase==='ready'?(battle.charged?'chargedSub':'readySub'):phase==='mash'?'mashHelp':phase==='over'?`${battle.outcome}Sub`:phase==='loading'?'loading':'resolvingSub';
  $('message').textContent=t(titleKey);$('message-sub').textContent=t(subKey);$('phase-label').textContent=phase==='mash'?t(action==='attack'?'power':'guard'):t('arena');
  $('last-round').textContent=lastRound?t('roundSummary',lastRound):'';
  $('result').hidden=phase!=='over';
  if(phase==='over'){$('result-kind').textContent=t(`result${battle.outcome[0].toUpperCase()+battle.outcome.slice(1)}`);$('result-title').textContent=t(battle.outcome);$('result-sub').textContent=t(`${battle.outcome}Sub`);$('result').dataset.outcome=battle.outcome;$('continue').textContent=t(standings(tournament).complete?'finalResults':'backGrounds');}
}
function floatDamage(who,amount,guarded){const p=view.project(who),el=document.createElement('div');el.className=`damage ${guarded?'guard-damage':''}`;el.style.left=`${p.x*100}%`;el.style.top=`${p.y*100}%`;el.innerHTML=`<strong>${amount===0?'0':`−${amount}`}</strong><span>${t(guarded?'blocked':'hit')}</span>`;$('damage-layer').append(el);setTimeout(()=>el.remove(),1500);}
function showResults(){clean();renderResults();}
function renderResults(focus=true){
  screen='results';phase='results';const s=standings(tournament);const standing=t(s.place===1?'champion':`place${s.place}`);
  $('content').innerHTML=`<section class="results-screen"><div class="results-art"><span class="sun-disc"></span><img src="${base}${portrait(tournament.player).file}" alt="${esc(name(tournament.player))}"/></div><div class="results-copy"><span class="eyebrow">${t('complete')}</span><div class="trophy">${svg('trophy')}</div><h1 id="placement">${standing}</h1><h2>${esc(name(tournament.player))}</h2><p>${t('resultsSub')}</p>${standingsHTML()}<div class="results-history"><h3>${t('history')}</h3>${recordHTML()}</div><button id="new-tournament" class="primary">${t('newTournament')} ${svg('arrow')}</button></div></section>`;
  $('new-tournament').addEventListener('click',()=>{clean();tournament=null;battle=null;position=null;storage.remove('wkt-tournament');$('help').disabled=$('rules-link').disabled=false;renderSelection();});
  if(focus)focusContent();announce(`${name(tournament.player)} · ${standing}`);
}
for(const [id,lang]of [['en','en'],['zh','zh-TW']])$(id).addEventListener('click',()=>{language=lang;storage.set('wkt-language',lang);translate();});
$('sound').addEventListener('click',()=>{muted=!muted;audio.mute(muted);audio.unlock();storage.set('wkt-muted',String(muted));translate();});
for(const id of ['help','rules-link'])$(id).addEventListener('click',()=>{input.clear();$('rules-dialog').showModal();});
$('close-help').addEventListener('click',()=>$('rules-dialog').close());
document.addEventListener('visibilitychange',()=>{input.clear();if(document.hidden){hiddenAt=performance.now();audio.context?.suspend();}else{if(phase==='mash'&&hiddenAt)deadline+=performance.now()-hiddenAt;hiddenAt=0;if(audio.context)audio.unlock();}});
window.wktDiagnostics=()=>({screen,phase,selected,presses,state:battle?{...battle}:null,tournament:tournament?JSON.parse(JSON.stringify(tournament)):null,position:grounds?.getPosition()||null,rendering:view?.getStats()||null});
async function boot(){
  $('content').innerHTML=`<div class="boot-message"><span class="loader"></span><p data-i="loading"></p></div>`;translate();
  try{art=await getArt();renderSelection();}catch{screen='error';$('content').innerHTML=`<div class="boot-message"><p>${t('loadError')}</p><button id="boot-retry" class="primary">${t('retry')}</button></div>`;$('boot-retry').addEventListener('click',boot);}
}
boot();
