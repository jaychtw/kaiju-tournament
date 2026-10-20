# v1.0 balance decision

One numerical change: Hippocalypse ATK **85 → 110**. HP 240 and DEF 125 stay unchanged. All other GDD values and damage/Guard & Counter rules stay unchanged. Its original total 450 is no longer a constraint: the new total is 475, and Attack remains the roster's lowest.

At 85, every unboosted ordinary attack deals zero damage against the other five fighters. As an opponent, Hippocalypse also deals zero damage against every player. These matches terminate with charged attacks, so this is a progression/readability problem rather than an unavoidable infinite loop. At 110, ordinary attacks deal 10–20 damage; opponents receive 10–20 from Hippocalypse. It still feels like a slow fortress.

Run `node scripts/simulate-balance.mjs` to reproduce [all 120 samples](balance.json). Each sample uses a fixed number of discrete presses per round, an opponent that always attacks, and exhaustive legal action search up to 32 rounds. Legacy arithmetic is cross-checked against the production resolver for the new stats. Search does not assume a knockout cancels a simultaneous attack.

| Presses per 3s | Original winnable matchups | Revised winnable | Revised shortest winning battle |
|---|---:|---:|---|
| 0 | 12/30 | 15/30 | 2–8 rounds (mean 4.60) |
| 10 | 19/30 | 22/30 | 2–6 rounds (mean 3.68) |
| 20 | 27/30 | 28/30 | 2–5 rounds (mean 2.96) |
| 30 | 29/30 | 30/30 | 2–4 rounds (mean 2.70) |

Hippocalypse can now beat every rival at 10 presses/round, including Condorion, which was still unwinnable at 30 with ATK 85. A round takes 3s input + 2.2s spectacle: at 30 presses, shortest winning matches take roughly 10–21s plus choosing time. These are deterministic predictions, not child playtest timings.

Defend is meaningful: at 30 presses, attack-only wins 27/30; counter-only wins 29/30; choosing between them wins 30/30. The combat is intentionally asymmetric: the player has mashing/defense/charging, while the opponent only attacks. This is not a symmetric first-player simulation. No turn-order advantage is introduced; both damage values use the same snapshot.

Remaining difficulty: Komodor vs Grumbongo and Sssir Pent vs Condorion require more than 20 presses/round to win with these policies. At 10 presses only 22/30 are winnable. Zero input is not guaranteed to win, and a draw counts as a loss. Do not market the roster as competitively balanced or these rates as verified comfortable for children. Losses never block tournament completion. No new accessibility mechanic or additional stat change is introduced without playtesting evidence.
