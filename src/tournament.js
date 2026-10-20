import { ids, fighters } from './roster.js';

export function newTournament(player) {
  if (!ids.includes(player)) throw new Error('Unknown player');
  return { player, history: [], active: null };
}
export const opponents = tournament => ids.filter(id => id !== tournament.player);
export const remaining = tournament => opponents(tournament).filter(id => !tournament.history.some(match => match.opponent === id));
export function standings(tournament) {
  const wins = tournament.history.filter(match => match.outcome === 'victory').length;
  return { wins, losses: tournament.history.length - wins, remaining: 5 - tournament.history.length, place: 6 - wins, complete: tournament.history.length === 5 };
}
export function challenge(tournament, enemy) {
  if (tournament.active || !remaining(tournament).includes(enemy)) throw new Error('Opponent unavailable');
  return { ...tournament, active: enemy };
}
export function recordMatch(tournament, state) {
  if (!tournament.active || state.playerId !== tournament.player || state.enemyId !== tournament.active || !['victory','defeat','draw'].includes(state.outcome)) throw new Error('Invalid match result');
  return { ...tournament, active: null, history: [...tournament.history, { opponent: state.enemyId, outcome: state.outcome, rounds: state.round - 1, playerHP: state.playerHP, enemyHP: state.enemyHP }] };
}
// Only finished matches are saved. Reloading an interrupted battle returns to
// the grounds; it neither awards a result nor consumes the opponent.
export function serialize(tournament) { return JSON.stringify({ version: 1, tournament: { ...tournament, active: null } }); }
export function restore(text) {
  try {
    const saved = JSON.parse(text);
    if (saved.version !== 1) return null;
    let t = newTournament(saved.tournament.player);
    for (const match of saved.tournament.history) {
      if (!Number.isInteger(match.rounds) || match.rounds < 1 || match.rounds > 10000) return null;
      if (![match.playerHP,match.enemyHP].every(Number.isInteger) || match.playerHP < 0 || match.playerHP > fighters[t.player].hp || match.enemyHP < 0 || match.enemyHP > (fighters[match.opponent]?.hp ?? -1)) return null;
      if ((match.outcome === 'victory' && !(match.playerHP > 0 && match.enemyHP === 0)) || (match.outcome === 'defeat' && !(match.playerHP === 0 && match.enemyHP > 0)) || (match.outcome === 'draw' && !(match.playerHP === 0 && match.enemyHP === 0))) return null;
      t = recordMatch(challenge(t,match.opponent),{ playerId:t.player,enemyId:match.opponent,outcome:match.outcome,round:match.rounds+1,playerHP:match.playerHP,enemyHP:match.enemyHP });
    }
    return t;
  } catch { return null; }
}
