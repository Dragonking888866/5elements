'use strict';
// Surface-only resource mapping. Never modify instance IDs, poses, saddle anchors,
// fusion pools, skills, actor transforms or save data here. All consumers resolve
// ultimatePet35().art, including map mounts, companions, codex and V39 projections.
const DIVINE_MATERIALS40=Object.freeze([
  {
    "type": 103,
    "name": "鸿蒙刃寅",
    "art": "assets/divine-pet-0-v40.png",
    "previousArt": "assets/ascended-pet-0-v36.png",
    "colors": [
      "#eee8d5",
      "#cbbf9b",
      "#443e31",
      "#fff3d2"
    ],
    "finish": "圣金白 · 玄金甲 · 淡金刀纹",
    "emissive": "warm white-gold eyes, pale gold claw tips, restrained gold forehead seal and a faint tail-tip trace"
  },
  {
    "type": 104,
    "name": "太初罡猊",
    "art": "assets/divine-pet-1-v40.png",
    "previousArt": "assets/ascended-pet-1-v36.png",
    "colors": [
      "#c2a164",
      "#806039",
      "#302c26",
      "#f0d7a0"
    ],
    "finish": "深圣金 · 古铜金 · 白金银边",
    "emissive": "restrained golden mane edges, warm white-gold forehead seal and chest carving, pale platinum fangs"
  },
  {
    "type": 105,
    "name": "太易苍虬",
    "art": "assets/divine-pet-2-v40.png",
    "previousArt": "assets/ascended-pet-2-v36.png",
    "colors": [
      "#3c9880",
      "#246558",
      "#13392f",
      "#cce8d4"
    ],
    "finish": "苍青玉鳞 · 灵木角 · 青白龙须",
    "emissive": "delicate jade-cyan horn light, scale rim light and flowing wood-spirit veins, pale green breath charge"
  },
  {
    "type": 106,
    "name": "青冥九尾",
    "art": "assets/divine-pet-3-v40.png",
    "previousArt": "assets/ascended-pet-3-v36.png",
    "colors": [
      "#e3eee1",
      "#63a58d",
      "#365b59",
      "#cbf5df"
    ],
    "finish": "青玉白绒 · 灵翠尾焰 · 月白眼光",
    "emissive": "cyan-white small tail-tip spirit flames, cold jade eyes and soft ear rims; subtle, no broad aura"
  },
  {
    "type": 107,
    "name": "混沌玄鼋",
    "art": "assets/divine-pet-4-v40.png",
    "previousArt": "assets/ascended-pet-4-v36.png",
    "colors": [
      "#18394e",
      "#27597a",
      "#101e32",
      "#c2e8ed"
    ],
    "finish": "玄黑海蓝 · 玄冰甲纹 · 银蓝寒辉",
    "emissive": "cold ice-white blue eyes, fine glacial blue fissures along shell rims and glyphs, restrained frost at joints and mouth"
  },
  {
    "type": 108,
    "name": "归墟溟鹏",
    "art": "assets/divine-pet-5-v40.png",
    "previousArt": "assets/ascended-pet-5-v36.png",
    "colors": [
      "#214c69",
      "#718e9e",
      "#172a42",
      "#c7e2ed"
    ],
    "finish": "溟渊靛蓝 · 银蓝羽片 · 幽海星纹",
    "emissive": "subtle glacial blue wing edges and tidal feather veins, mysterious deep blue eyes and a trace of dark violet in tail"
  },
  {
    "type": 109,
    "name": "劫烬朱凰",
    "art": "assets/divine-pet-6-v40.png",
    "previousArt": "assets/ascended-pet-6-v36.png",
    "colors": [
      "#b83f27",
      "#d78c37",
      "#491f25",
      "#ffdb99"
    ],
    "finish": "朱红赤金 · 深赤羽影 · 暖白焰心",
    "emissive": "small warm-white flame core at breast mark, gold feather-tip highlights, red-gold crown and flowing wing/tail rims"
  },
  {
    "type": 110,
    "name": "烛幽赤螭",
    "art": "assets/divine-pet-7-v40.png",
    "previousArt": "assets/ascended-pet-7-v36.png",
    "colors": [
      "#a73f29",
      "#712d27",
      "#281d24",
      "#ffd0a0"
    ],
    "finish": "熔火赤鳞 · 赤铜甲壳 · 白焰裂隙",
    "emissive": "white-hot small mouth core, narrow magma fissures between scales, dark gold-red horn highlights and pulsing back ridges"
  },
  {
    "type": 111,
    "name": "玄黄岳麟",
    "art": "assets/divine-pet-8-v40.png",
    "previousArt": "assets/ascended-pet-8-v36.png",
    "colors": [
      "#b59a64",
      "#d0b981",
      "#4e4436",
      "#e8dcc0"
    ],
    "finish": "玄黄玉金 · 古岳鳞甲 · 青玉圣纹",
    "emissive": "gentle ivory-jade horn highlights, warm earth-gold guardian chest seal, restrained scale etchings and subtle hoof glow"
  },
  {
    "type": 112,
    "name": "太荒镇獬",
    "art": "assets/divine-pet-9-v40.png",
    "previousArt": "assets/ascended-pet-9-v36.png",
    "colors": [
      "#3e3e37",
      "#827456",
      "#20272b",
      "#c8ad72"
    ],
    "finish": "岩黑金甲 · 灰金棱面 · 赤铜法纹",
    "emissive": "one restrained gold-lit judgment horn, warm amber forehead seal and thin law glyphs along shoulder/back armour"
  },
  {
    "type": 113,
    "name": "混沌祖兽",
    "art": "assets/divine-pet-10-v40.png",
    "previousArt": "assets/ultimate-pet-10-v36.png",
    "colors": [
      "#736b5b",
      "#32343b",
      "#202d30",
      "#e3d9bf"
    ],
    "finish": "混沌灰金 · 深渊青黑 · 稀疏五行祖纹",
    "emissive": "small chaos-white eyes and chest core, tiny gold/celadon/blue/vermilion/ochre hairline veins, extremely restrained ancestral energy"
  }
].map(d=>Object.freeze({...d,colors:Object.freeze(d.colors)})));
for(const material of DIVINE_MATERIALS40){
 const definition=ultimatePet35(material.type);
 if(!definition||definition.name!==material.name)throw Error('V40 material identity mismatch: '+material.type);
 definition.art=material.art;
 definition.material40=material;
}
