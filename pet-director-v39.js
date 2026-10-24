'use strict';
// Presentation is independent of combat geometry. Stable type/instance IDs and V38 damage stay intact.
const ULTIMATES39=[
 {type:103,name:'鸿蒙裂天斩',scene:'claw',family:'metal',action:'claw',motifs:['神虎投影','巨爪裂隙','金刃冲击']},
 {type:104,name:'万罡镇世吼',scene:'bell',family:'metal',action:'roar',motifs:['古钟罡印','音压波壁','神兵坠落']},
 {type:105,name:'太易万木龙息',scene:'tree',family:'wood',action:'breath',motifs:['青玉龙息','神木生长','古藤根系']},
 {type:106,name:'九曜青冥幻界',scene:'fox',family:'wood',action:'fan',motifs:['九狐幻影','九瓣青冥印','灵藤结界']},
 {type:107,name:'玄冥万载冰封',scene:'glacier',family:'ice',action:'shell',motifs:['霜地凝结','冰壁连升','玄甲投影']},
 {type:108,name:'北冥吞天潮',scene:'ocean',family:'water',action:'wings',motifs:['推进海墙','双水龙卷','溟鹏天影']},
 {type:109,name:'朱凰焚天劫',scene:'phoenix',family:'fire',action:'wings',motifs:['朱凰天影','赤金火羽','落焰火场']},
 {type:110,name:'烛幽灭世龙炎',scene:'inferno',family:'fire',action:'breath',motifs:['连续洪荒龙炎','熔岩裂纹','终点爆燃']},
 {type:111,name:'玄黄万岳镇',scene:'mountains',family:'earth',action:'stomp',motifs:['万岳投影','坠岩冲击','地脉涌升']},
 {type:112,name:'太荒神狱',scene:'prison',family:'earth',action:'horn',motifs:['四方岩壁','裁决封印','合拢镇压']},
 {type:113,name:'鸿蒙归墟',scene:'chaos',family:'chaos',action:'source',motifs:['太古祖影','五行逆转','鸿蒙裂界','归墟余波']}
];
const VISUAL_TIERS39=[
 {w:300,h:175,coverage:[.02,.05],layers:2}, {w:520,h:320,coverage:[.05,.08],layers:3},
 {w:640,h:400,coverage:[.08,.12],layers:4}, {w:790,h:490,coverage:[.12,.18],layers:5},
 {w:930,h:590,coverage:[.18,.25],layers:6}, {w:1130,h:670,coverage:[.25,.35],layers:7},
 {w:1240,h:740,coverage:[.30,.45],layers:8}
];
for(const [i,d]of ULTIMATES39.entries()){
 const data=ultimatePet35(d.type);data.active=d.name;
 PETS[d.type].desc=d.name+'；'+data.passive;PET_SIGNATURES38[i]=d.name;
}
function petVisualSpec39(p){
 const q=quality8(p),unique=ULTIMATES39.find(d=>d.type===p.type);
 const family=unique?.family||(petElement10(p)===1?'wood':petFamily38(p));
 const scene=unique?.scene||({fire:'inferno',water:'ocean',ice:'glacier',wind:'storm',wood:'grove',metal:'blades',earth:'shards'}[family]||'blades');
 return {...VISUAL_TIERS39[q],q,type:p.type,scene,family,unique:!!unique,name:unique?.name||petSkillProfile38(p).name,
  action:unique?.action||'breath',motifs:unique?.motifs||[scene],hidden:p.type===113,
  ...(p.type===113?{w:1420,h:880,coverage:[.40,.55],layers:10}:{})};
}
function presentationPhase39(f){
 const impact=f.windup15+f.travel15,t=f.age15;
 if(t<f.windup15)return'charge';if(t<impact)return'release';
 if(t<impact+.32)return'impact';if(t<impact+f.profile15.sustain)return'spread';return'fade';
}
const setupBefore39=setupCast38;
setupCast38=function(p,pet,f){
 setupBefore39(p,pet,f);f.cast39=true;f.spec39=petVisualSpec39(pet);
 const q=f.spec39.q,sustain=[.32,.43,.58,.8,1.15,1.6,2.15][q],tail=[.3,.4,.5,.65,.85,1.1,1.85][q];
 f.profile15={...f.profile15,sustain,tail};
 f.max=f.t=p.windup+p.travel+sustain+tail+(pet.type===113?.5:0);
 if(actors[p.i].petAct11){actors[p.i].petAct11.duration=p.windup+p.travel+(f.spec39.action==='breath'?sustain:.48);actors[p.i].petAnim=actors[p.i].petAct11.duration}
 f.render39=null;return f;
};
function castForActor39(a){return petFx.find(f=>f.cast39&&f.t>0&&f.i15===a.i&&f.pet15===petOf(a.i)?.id&&castValid38(f.token15))}
// Visual-only joint motion; world positions, facing, riding cutouts and camera are never changed here.
const mountPoseBefore39=mountRigPose32;
mountRigPose32=function(type,a){const pet=petOf(a.i);if(pet?.type===type)warmPetImages39(pet);const p=mountPoseBefore39(type,a),f=castForActor39(a);if(!f||!f.spec39.unique)return p;
 const age=f.age15,w=f.windup15,hit=w+f.travel15,charge=clamp(age/w,0,1),strike=clamp((age-w)/(f.travel15+.3),0,1);
 if(age>hit+.4||motionPrefs34.reduced)return p;
 if(f.spec39.action==='claw')p.bob-=Math.sin(strike*Math.PI)*12;
 else if(f.spec39.action==='wings')p.bob-=Math.sin(charge*Math.PI)*4;
 else if(f.spec39.action==='stomp')p.bob+=Math.sin(strike*Math.PI)*3;
 p.pitch+=(f.spec39.action==='breath'?-.035:-.015)*Math.sin(charge*Math.PI);
 return p;
};
