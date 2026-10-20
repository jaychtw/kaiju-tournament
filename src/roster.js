// Original identities and provisional GDD stats, with one documented balance fix.
export const roster = Object.freeze({
  komodor: { color: '#287c75', hp: 200, atk: 150, def: 100,
    en: ['Komodor', 'The Sunbathing Scales', 'Fierce in a fight. Fiercely committed to a sunbath afterward.', 'Balanced'],
    'zh-TW': ['科摩多', '日光浴鱗族', '戰鬥時全力以赴，戰鬥後全力曬太陽。', '均衡型'] },
  grumbongo: { color: '#676275', hp: 185, atk: 175, def: 90,
    en: ['Grumbongo', 'The Banana Republic', 'Calm, collected… until somebody touches his bananas.', 'Heavy hitter'],
    'zh-TW': ['古隆邦戈', '香蕉共和國', '一向沉著冷靜，直到有人碰他的香蕉。', '重擊型'] },
  kraken: { color: '#7b559f', hp: 195, atk: 155, def: 100,
    en: ['Kraken', 'The Ink Corporation', 'Plenty of arms. Very little patience.', 'Versatile'],
    'zh-TW': ['克拉肯', '墨水股份有限公司', '手很多，耐心卻很少。', '全能型'] },
  hippocalypse: { color: '#aa6879', hp: 240, atk: 110, def: 125,
    en: ['Hippocalypse', 'The Heavyweight Grazers', 'Looks slow. Moves slowly. Completely unbothered.', 'Fortress'],
    'zh-TW': ['河馬末日', '重量級草食族', '看起來很慢，動作也很慢，本人完全不在意。', '堡壘型'] },
  condorion: { color: '#bd7639', hp: 165, atk: 190, def: 95,
    en: ['Condorion', 'The Frequent Flyers', 'Master of the skies. Still complains about legroom.', 'Sky striker'],
    'zh-TW': ['康多里昂', '飛行常客聯盟', '翱翔天際的大師，依然嫌座位伸不開腿。', '強攻型'] },
  sssirPent: { color: '#46845a', hp: 210, atk: 140, def: 100,
    en: ['Sssir Pent', 'The Cold-Blooded Aristocrats', 'Impeccable manners. A crushing handshake.', 'Constrictor'],
    'zh-TW': ['嘶爵士', '冷血貴族', '禮數周到，擁抱的力道更周到。', '纏繞型'] },
});
for (const fighter of Object.values(roster)) Object.freeze(fighter);
export const ids = Object.freeze(Object.keys(roster));
export const fighters = Object.freeze(Object.fromEntries(ids.map(id => [id, Object.freeze({ hp: roster[id].hp, atk: roster[id].atk, def: roster[id].def })])));
export const identity = (id, language) => roster[id][language];
