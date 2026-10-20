import { fighters } from './roster.js';
export { fighters } from './roster.js';

export const MASH_MS = 3000;
export function initialBattle(playerId = 'komodor', enemyId = 'grumbongo') {
  if (!fighters[playerId] || !fighters[enemyId] || playerId === enemyId) throw new Error('Invalid matchup');
  return { playerId, enemyId, playerHP: fighters[playerId].hp, enemyHP: fighters[enemyId].hp, charged: false, round: 1, outcome: null };
}

// Round final damage to nearest integer, half upward. Both attacks use the
// same snapshot, including attacks from a fighter knocked out this round.
export function resolveRound(state, action, presses) {
  if (state.outcome) throw new Error('Battle has ended');
  if (!['attack', 'defend'].includes(action)) throw new Error('Unknown action');
  if (state.charged && action === 'defend') throw new Error('Charged round requires Attack');
  if (!Number.isSafeInteger(presses) || presses < 0) throw new Error('Invalid press count');
  const multiplier = 1 + 0.01 * presses;
  const chargedAttack = action === 'attack' && state.charged;
  // Keep the press percentage as an integer until the last division. Multiplying
  // by a binary float such as 1.13 can turn 79.5 into 79.49999999999997.
  const percent = 100 + presses;
  const player = fighters[state.playerId], enemy = fighters[state.enemyId];
  if (!player || !enemy) throw new Error('Invalid matchup');
  const dealt = action === 'attack'
    ? Math.round(Math.max(0, (player.atk * (chargedAttack ? 1.5 : 1) * percent - enemy.def * 100) / 100)) : 0;
  const received = Math.round(Math.max(0, (enemy.atk * 100 - player.def * (action === 'defend' ? percent : 100)) / 100));
  const playerHP = Math.max(0, state.playerHP - received);
  const enemyHP = Math.max(0, state.enemyHP - dealt);
  const outcome = playerHP === 0 && enemyHP === 0 ? 'draw' : playerHP === 0 ? 'defeat' : enemyHP === 0 ? 'victory' : null;
  return { state: { playerId: state.playerId, enemyId: state.enemyId, playerHP, enemyHP, charged: action === 'defend' && !outcome, round: state.round + 1, outcome },
    dealt, received, multiplier, chargedAttack, action, presses };
}
