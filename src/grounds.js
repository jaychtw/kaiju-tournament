import { ids, identity } from './roster.js';
import { remaining } from './tournament.js';
import { svg } from './ui.js';

const slots = [[245,390],[925,390],[415,560],[990,655],[210,680]];
const clamp = (v,min,max) => Math.max(min,Math.min(max,v));
export function createGrounds(root, { tournament, art, input, getLanguage, t, onChallenge, isPaused, position }) {
  const rivals = ids.filter(id=>id!==tournament.player).map((id,index)=>({id,x:slots[index][0],y:slots[index][1]}));
  const available = new Set(remaining(tournament));
  const base = import.meta.env.BASE_URL;
  const idle = (id,view) => {const frames=art.characters[id][view];return frames.idle || frames[id==='komodor'?'k_idle_0':'g_attack_0'] || Object.values(frames)[0];};
  let x=position?.x ?? 600, y=position?.y ?? 735, destination=null, walkTarget=null, blocked=null, alive=true, last=performance.now();
  const touch = new Set();
  root.innerHTML = `<div class="grounds-world" id="grounds-world" role="group" tabindex="0">
    <img class="grounds-background" src="${base}${art.grounds}" alt="" draggable="false"/>
    <div class="walk-marker" hidden></div>
    ${rivals.map(r=>`<button class="world-kaiju ${available.has(r.id)?'':'fought'}" id="npc-${r.id}" data-rival="${r.id}" style="left:${r.x/12}%;top:${r.y/8}%;--depth:${.76+r.y/1800};z-index:${r.y}"><img src="${base}${idle(r.id,'front').file}" alt="" draggable="false"/><span class="npc-name"></span><small class="npc-status"></small></button>`).join('')}
    <div class="world-player" id="world-player"><img src="${base}${idle(tournament.player,'rear').file}" alt="" draggable="false"/><span></span></div>
    <span class="venue-label">${svg('sun')}<span data-i="arena"></span></span>
  </div>
  <div class="grounds-controls"><div class="movement"><button data-direction="up">↑</button><button data-direction="left">←</button><button data-direction="down">↓</button><button data-direction="right">→</button></div><p data-i="groundsTouch"></p></div>
  <div class="rival-list">${rivals.map(r=>`<button id="walk-${r.id}" data-walk="${r.id}" ${available.has(r.id)?'':'disabled'}><span></span><b>${available.has(r.id)?'→':'✓'}</b></button>`).join('')}</div>`;
  const world=root.querySelector('.grounds-world'), player=root.querySelector('.world-player'), marker=root.querySelector('.walk-marker');
  const locate = e => { const rect=world.getBoundingClientRect(); return { x:clamp((e.clientX-rect.left)/rect.width*1200,90,1110), y:clamp((e.clientY-rect.top)/rect.height*800,320,755) }; };
  function walkTo(nx,ny,target=null) { destination={x:nx,y:ny}; walkTarget=target; marker.hidden=false; marker.style.left=`${nx/12}%`;marker.style.top=`${ny/8}%`;world.focus({preventScroll:true}); }
  world.addEventListener('pointerdown',event=>{ if(event.target.closest('button') || event.button!==0 || !event.isPrimary) return;event.preventDefault();const p=locate(event);walkTo(p.x,p.y); });
  for(const r of rivals) {
    const go=()=>{if(!available.has(r.id))return; blocked=null;walkTo(r.x,r.y+35,r.id);};
    root.querySelector(`#npc-${r.id}`).addEventListener('click',go);
    root.querySelector(`#walk-${r.id}`).addEventListener('click',go);
  }
  for(const button of root.querySelectorAll('[data-direction]')) {
    button.addEventListener('pointerdown',event=>{if(!event.isPrimary || event.button!==0)return;event.preventDefault();button.setPointerCapture(event.pointerId);touch.add(button.dataset.direction);destination=null;});
    for(const type of ['pointerup','pointercancel','lostpointercapture']) button.addEventListener(type,()=>touch.delete(button.dataset.direction));
    button.addEventListener('click',event=>{if(event.detail===0){const dx={left:-140,right:140}[button.dataset.direction]||0,dy={up:-110,down:110}[button.dataset.direction]||0;walkTo(clamp(x+dx,90,1110),clamp(y+dy,320,755));}});
  }
  function positionPlayer(moving) {
    player.style.left=`${x/12}%`;player.style.top=`${y/8}%`;player.style.zIndex=Math.round(y);
    player.style.setProperty('--depth',.76+y/1800);
    player.classList.toggle('walking',moving);
  }
  function tick(now) {
    if(!alive)return;
    const dt=Math.min((now-last)/1000,.05);last=now;
    if(!document.hidden && !isPaused()) {
      const h=input.held;
      let dx=Number(h.has('ArrowRight')||h.has('KeyD')||touch.has('right'))-Number(h.has('ArrowLeft')||h.has('KeyA')||touch.has('left'));
      let dy=Number(h.has('ArrowDown')||h.has('KeyS')||touch.has('down'))-Number(h.has('ArrowUp')||h.has('KeyW')||touch.has('up'));
      if(dx||dy) {destination=null;walkTarget=null;marker.hidden=true;}
      else if(destination) {dx=destination.x-x;dy=destination.y-y;if(Math.hypot(dx,dy)<5){destination=null;dx=dy=0;marker.hidden=true;}}
      const length=Math.hypot(dx,dy); if(length) { const step=Math.min(270*dt,destination?length:Infinity);x=clamp(x+dx/length*step,90,1110);y=clamp(y+dy/length*step,320,755); }
      positionPlayer(length>0);
      if(blocked) {const r=rivals.find(r=>r.id===blocked);if(Math.hypot(x-r.x,y-r.y)>135)blocked=null;}
      for(const r of rivals) if(available.has(r.id) && (!walkTarget || walkTarget===r.id) && blocked!==r.id && Math.hypot(x-r.x,y-r.y)<82) {
        destination=null;walkTarget=null;marker.hidden=true;touch.clear();blocked=r.id;onChallenge(r.id);break;
      }
    } else {touch.clear();player.classList.remove('walking');}
    requestAnimationFrame(tick);
  }
  function translate() {
    for(const el of root.querySelectorAll('[data-i]'))el.textContent=t(el.dataset.i);
    world.setAttribute('aria-label',t('groundsHelp'));
    player.querySelector('span').textContent=t('you');
    for(const r of rivals){const name=identity(r.id,getLanguage())[0],ready=available.has(r.id);
      const button=root.querySelector(`#npc-${r.id}`);button.querySelector('.npc-name').textContent=name;button.querySelector('.npc-status').textContent=ready?'':`✓ ${t('fought')}`;
      button.setAttribute('aria-label',`${ready?t('walkTo'):t('fought')} ${name}`);
      root.querySelector(`#walk-${r.id} span`).textContent=`${ready?t('walkTo'):t('fought')} · ${name}`;
    }
    for(const button of root.querySelectorAll('[data-direction]'))button.setAttribute('aria-label',t(`move${button.dataset.direction[0].toUpperCase()+button.dataset.direction.slice(1)}`));
  }
  translate();positionPlayer(false);requestAnimationFrame(tick);
  return { translate, getPosition:()=>({x,y}), destroy(){alive=false;touch.clear();} };
}
