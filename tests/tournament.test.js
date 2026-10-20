import test from 'node:test';
import assert from 'node:assert/strict';
import { newTournament, challenge, recordMatch, remaining, standings, restore, serialize } from '../src/tournament.js';
import { fighters, initialBattle, resolveRound } from '../src/combat.js';

test('all five opponents can be faced once in any order, loss/draw continue and HP resets', () => {
  for (const player of Object.keys(fighters)) {
    let t = newTournament(player);
    const order = remaining(t).reverse();
    order.forEach((enemy,i)=>{
      t = challenge(t,enemy);
      assert.throws(()=>challenge(t,enemy));
      const battle = initialBattle(player,enemy);
      assert.equal(battle.playerHP,fighters[player].hp);assert.equal(battle.enemyHP,fighters[enemy].hp);assert.equal(battle.charged,false);
      const outcome = ['victory','defeat','draw'][i%3];
      t = recordMatch(t,{...battle,outcome,playerHP:outcome==='victory'?1:0,enemyHP:outcome==='defeat'?1:0,round:3});
      assert.equal(t.history.length,i+1);assert.throws(()=>challenge(t,enemy));
    });
    assert.deepEqual(standings(t),{wins:2,losses:3,remaining:0,place:4,complete:true});
    assert.deepEqual(remaining(t),[]);
    assert.deepEqual(restore(serialize(t)),t);
  }
});
test('six placements follow wins, draws count as losses, restart has no match history',()=>{
  for(let wins=0;wins<=5;wins++) {
    let t=newTournament('komodor');
    remaining(t).forEach((enemy,i)=>{t=recordMatch(challenge(t,enemy),{...initialBattle('komodor',enemy),outcome:i<wins?'victory':'draw',playerHP:i<wins?1:0,enemyHP:0,round:2});});
    assert.equal(standings(t).place,6-wins);assert.equal(standings(t).losses,5-wins);
  }
  assert.equal(newTournament('kraken').history.length,0);
});
test('invalid results/storage cannot consume opponents or invent a ranking',()=>{
  const t=challenge(newTournament('komodor'),'grumbongo');
  assert.throws(()=>recordMatch(t,{...initialBattle(),enemyId:'kraken',outcome:'victory'}));
  for(const text of ['bad','{}','null',JSON.stringify({version:1,tournament:{player:'nope',history:[]}}),JSON.stringify({version:1,tournament:{player:'komodor',history:[{opponent:'grumbongo',outcome:'victory',rounds:2,playerHP:200,enemyHP:185}]}})]) assert.equal(restore(text),null);
  assert.equal(restore(serialize(t)).active,null);
});
test('all thirty ordered matchups preserve arithmetic and simultaneous outcomes',()=>{
  for(const player of Object.keys(fighters)) for(const enemy of Object.keys(fighters).filter(id=>id!==player)) {
    for(const presses of [0,1,13,20,30,59,118]) {
      const s=initialBattle(player,enemy),p=fighters[player],e=fighters[enemy];
      const a=resolveRound(s,'attack',presses);
      assert.equal(a.dealt,Math.round(Math.max(0,(p.atk*(100+presses)-e.def*100)/100)));
      assert.equal(a.received,Math.max(0,e.atk-p.def));
      const d=resolveRound(s,'defend',presses);assert.equal(d.dealt,0);
      if(d.state.charged){assert.throws(()=>resolveRound(d.state,'defend',presses));assert.equal(resolveRound(d.state,'attack',presses).chargedAttack,true);}
    }
  }
  assert.throws(()=>initialBattle('kraken','kraken'));
});
