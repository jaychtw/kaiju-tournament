import test from 'node:test';
import assert from 'node:assert/strict';
import { fighters, initialBattle, resolveRound } from '../src/combat.js';

test('GDD stats and a fresh independent match', () => {
  assert.deepEqual(fighters.komodor, { hp: 200, atk: 150, def: 100 });
  assert.deepEqual(fighters.grumbongo, { hp: 185, atk: 175, def: 90 });
  const a = initialBattle(); a.playerHP = 1; assert.equal(initialBattle().playerHP, 200);
});
test('basic attack applies both damages from one immutable snapshot', () => {
  const s = initialBattle(); const result = resolveRound(s, 'attack', 0);
  assert.equal(result.dealt, 60); assert.equal(result.received, 75);
  assert.deepEqual(result.state, { ...initialBattle(), playerHP: 125, enemyHP: 125, round: 2 });
  assert.deepEqual(s, initialBattle());
});
test('every valid press boosts the relevant attribute by exactly one percent', () => {
  const r = resolveRound(initialBattle(), 'attack', 30);
  assert.equal(r.multiplier, 1.3); assert.equal(r.dealt, 105); assert.equal(r.received, 75);
  const d = resolveRound(initialBattle(), 'defend', 30);
  assert.equal(d.dealt, 0); assert.equal(d.received, 45); assert.equal(d.state.charged, true);
});
test('Guard & Counter locks defense then consumes a non-stacking charge', () => {
  const d = resolveRound(initialBattle(), 'defend', 20);
  assert.throws(() => resolveRound(d.state, 'defend', 30), /requires Attack/);
  const c = resolveRound(d.state, 'attack', 20);
  assert.equal(c.dealt, 180); assert.equal(c.received, 75); assert.equal(c.chargedAttack, true);
  assert.equal(c.state.charged, false); assert.equal(c.state.outcome, null);
  assert.doesNotThrow(() => resolveRound(c.state, 'defend', 0));
});
test('a lethal hit does not cancel the enemy attack', () => {
  const result = resolveRound({ ...initialBattle(), enemyHP: 1 }, 'attack', 0);
  assert.equal(result.state.outcome, 'victory'); assert.equal(result.state.playerHP, 125);
});
test('a lethal incoming attack does not cancel the player attack; double KO is a draw', () => {
  const r = resolveRound({ ...initialBattle(), playerHP: 75, enemyHP: 60 }, 'attack', 0);
  assert.equal(r.state.outcome, 'draw'); assert.equal(r.state.playerHP, 0); assert.equal(r.state.enemyHP, 0);
});
test('no counter is granted when knocked out while defending', () => {
  const d = resolveRound({ ...initialBattle(), playerHP: 75 }, 'defend', 0);
  assert.equal(d.state.outcome, 'defeat'); assert.equal(d.state.charged, false); assert.equal(d.state.enemyHP, 185);
});
test('defense can negate all incoming damage; HP never heals or goes negative', () => {
  const d = resolveRound(initialBattle(), 'defend', 100);
  assert.equal(d.received, 0); assert.equal(d.state.playerHP, 200);
  const a = resolveRound(initialBattle(), 'attack', 1000);
  assert.equal(a.state.enemyHP, 0);
});
test('final damage rounds half up, deterministically, and preserves integer HP', () => {
  assert.equal(resolveRound(initialBattle(), 'attack', 1).dealt, 62);
  assert.equal(resolveRound(initialBattle(), 'attack', 13).dealt, 80);
  assert.equal(resolveRound(initialBattle(), 'attack', 59).dealt, 149);
  assert.equal(resolveRound({ ...initialBattle(), charged: true }, 'attack', 118).dealt, 401);
  assert.equal(resolveRound({ ...initialBattle(), charged: true }, 'attack', 1).dealt, 137);
  for (let n = 0; n <= 120; n++) for (const action of ['attack', 'defend']) {
    const r = resolveRound(initialBattle(), action, n);
    assert.ok(Number.isInteger(r.state.playerHP) && Number.isInteger(r.state.enemyHP));
    assert.deepEqual(r, resolveRound(initialBattle(), action, n));
    assert.equal(r.dealt, action === 'attack' ? Math.round((150 * (100 + n) - 9000) / 100) : 0);
  }
});
test('invalid actions, presses and actions after the result are rejected', () => {
  for (const n of [-1, NaN, Infinity, 1.5]) assert.throws(() => resolveRound(initialBattle(), 'attack', n));
  assert.throws(() => resolveRound(initialBattle(), 'dodge', 1));
  assert.throws(() => resolveRound({ ...initialBattle(), outcome: 'draw' }, 'attack', 0));
});
