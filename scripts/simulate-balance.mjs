import { mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { fighters, initialBattle, resolveRound } from '../src/combat.js';
import { ids } from '../src/roster.js';

// Legacy comparison uses the same arithmetic with the original Hip ATK 85.
// Cross-check the independent arithmetic against actual rules for every search step.
function step(s, action, presses, stats) {
  const p = stats[s.playerId], e = stats[s.enemyId], percent = 100 + presses;
  const dealt = action === 'attack' ? Math.round(Math.max(0, (p.atk * (s.charged ? 1.5 : 1) * percent - e.def * 100) / 100)) : 0;
  const received = Math.round(Math.max(0, (e.atk * 100 - p.def * (action === 'defend' ? percent : 100)) / 100));
  const playerHP = Math.max(0,s.playerHP-received), enemyHP = Math.max(0,s.enemyHP-dealt);
  const outcome = !playerHP && !enemyHP ? 'draw' : !playerHP ? 'defeat' : !enemyHP ? 'victory' : null;
  const state = { ...s, playerHP, enemyHP, charged: action === 'defend' && !outcome, round: s.round + 1, outcome };
  if (stats === fighters) assert.deepEqual(state, resolveRound(s,action,presses).state);
  return state;
}
function search(player, enemy, presses, stats, strategy) {
  let queue = [{ state: initialBattle(player,enemy), path: [] }], seen = new Set(), longest = 0, terminal = new Set();
  for (let rounds = 0; rounds < 32 && queue.length; rounds++) {
    const next = [];
    for (const {state,path} of queue) {
      const actions = state.charged ? ['attack'] : strategy === 'attack' ? ['attack'] : strategy === 'counter' ? ['defend'] : ['attack','defend'];
      for (const action of actions) {
        const s = step(state,action,presses,stats), sequence = [...path,action]; longest = Math.max(longest,sequence.length);
        if (s.outcome === 'victory') return { outcome:'victory', rounds:sequence.length, sequence };
        if (s.outcome) { terminal.add(s.outcome); continue; }
        const key=[s.playerHP,s.enemyHP,s.charged].join(':');
        if (!seen.has(key)) { seen.add(key); next.push({state:s,path:sequence}); }
      }
    }
    queue = next;
  }
  return { outcome:terminal.size ? [...terminal].join('/') : 'loop', rounds:longest, exhausted:queue.length===0 };
}
export function run() {
  const legacy = {...fighters,hippocalypse:{...fighters.hippocalypse,atk:85}};
  const rows = [];
  for (const player of ids) for (const enemy of ids.filter(id=>id!==player)) for (const presses of [0,10,20,30]) {
    rows.push({player,enemy,presses,legacy:search(player,enemy,presses,legacy,'optimal'), optimal:search(player,enemy,presses,fighters,'optimal'), attack:search(player,enemy,presses,fighters,'attack'),counter:search(player,enemy,presses,fighters,'counter')});
  }
  const summaries=[0,10,20,30].map(presses=>{
    const sample=rows.filter(r=>r.presses===presses), wins=sample.filter(r=>r.optimal.outcome==='victory');
    return { presses,legacyWinnable:sample.filter(r=>r.legacy.outcome==='victory').length,winnable:wins.length,total:30,minRounds:Math.min(...wins.map(r=>r.optimal.rounds)),maxRounds:Math.max(...wins.map(r=>r.optimal.rounds)),meanRounds:wins.reduce((sum,r)=>sum+r.optimal.rounds,0)/wins.length,attackWins:sample.filter(r=>r.attack.outcome==='victory').length,counterWins:sample.filter(r=>r.counter.outcome==='victory').length };
  });
  const report={ change:{character:'hippocalypse',attribute:'ATK',before:85,after:110},assumptions:'Fixed discrete presses each round; opponent always basic attacks; optimal exhaustive search up to 32 rounds; no human/device-rate measurement.',summaries,rows };
  mkdirSync('docs/release',{recursive:true});writeFileSync('docs/release/balance.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(summaries,null,2));
  assert.equal(rows.filter(r=>r.presses===30 && r.optimal.outcome==='victory').length,30,'Every ordered matchup must be winnable at 30 presses');
  assert.ok(rows.every(r=>r.attack.outcome!=='loop' && r.counter.outcome!=='loop'),'Fixed legal policies must terminate');
  return report;
}
if (process.argv[1]?.endsWith('simulate-balance.mjs')) run();
