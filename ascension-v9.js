'use strict';
// V9 progression: append-only map IDs and per-spawn records survive map changes and rebirth.
const EXPEDITIONS9=[
 {name:'归墟浮陆',color:'#203f49',accent:'#82ddd7',level:110,desc:'五行归位后的第一段征程：穿过悬空断桥，夺回归墟印记。',boss:'断界 · 归墟龙王',point:[3870,2460],element:2,species:15},
 {name:'九幽炼狱',color:'#472b31',accent:'#f49c6c',level:130,desc:'踏过熔河与黑曜城门，躲避焚魂裁决，寻找第二枚封印。',boss:'焚魂 · 九幽魔尊',point:[3900,730],element:3,species:16},
 {name:'太初神庭',color:'#303149',accent:'#d4b7f5',level:150,desc:'星光祭坛与古神回廊；终极首领会释放足以断命的裁决。',boss:'太初 · 五劫神皇',point:[3900,1730],element:0,species:19},
 {name:'时隙秘境',color:'#1b283b',accent:'#98c9ff',level:165,desc:'三枚归墟印记共同指向的秘境，逆命之兽沉睡于此。',boss:'无名 · 逆命星君',point:[3910,2500],element:4,species:19}
];
MAPS.push(...EXPEDITIONS9.map(m=>({...m})));
const SIGILS9=[{map:7,x:2250,y:690,name:'潮汐印记'},{map:8,x:2250,y:2280,name:'烬火印记'},{map:9,x:2840,y:2580,name:'太初印记'}];
function allHeroes9(){return !!S&&S.heroes.every(h=>h.unlocked)}
function encounterRecord9(e){return S.encounters9?.[enemyKey8(e)]||{kills:0,level:0}}
function sealedBoss9(e){return (e.rank8||0)===2&&encounterRecord9(e).kills>=3}
function journeyCleared9(map){return !!S?.journey9?.includes(map)}
const unlockedBeforeJourney9=mapUnlocked;mapUnlocked=function(id){if(!Number.isInteger(id)||id<0||id>=MAPS.length)return false;if(id<7)return unlockedBeforeJourney9(id);if(!allHeroes9())return false;if(id===7)return true;if(id===8)return journeyCleared9(7);if(id===9)return journeyCleared9(8);return journeyCleared9(9)&&(S.sigils9?.length||0)===3};
const obstaclesBeforeJourney9=mapObstacles;mapObstacles=function(id=currentMap()){
 if(id<7)return obstaclesBeforeJourney9(id);
 if(id===7)return [{x:1500,y:150,w:180,h:800,kind:'river'},{x:1500,y:1450,w:180,h:1600,kind:'river'},{x:2700,y:1100,w:120,h:1200,kind:'wall'}];
 if(id===8)return [{x:100,y:1450,w:1300,h:170,kind:'river'},{x:1800,y:1450,w:2850,h:170,kind:'river'},{x:2600,y:200,w:110,h:800,kind:'wall'},{x:2600,y:1800,w:110,h:1200,kind:'wall'}];
 return [{x:1500,y:200,w:110,h:1100,kind:'wall'},{x:1500,y:1700,w:110,h:1300,kind:'wall'},{x:2300,y:1100,w:1300,h:110,kind:'wall'},{x:2300,y:2200,w:1300,h:110,kind:'wall'}];
};
const portalsBeforeJourney9=mapPortals;mapPortals=function(){const id=currentMap();if(!id)return [...portalsBeforeJourney9(),{x:1120,y:710,to:7}];if(id<7)return portalsBeforeJourney9();const p=[{x:500,y:650,to:0}];if(id<9&&mapUnlocked(id+1))p.push({x:4260,y:2810,to:id+1});if(id===9&&mapUnlocked(10))p.push({x:3290,y:2640,to:10});return p};
function applyWave9(e){if(e.noRewards)return e;const record=encounterRecord9(e),oldLevel=e.level||1;e.wave9=record.kills||0;e.baseMax9=e.max;e.baseAtk9=e.atk;
 if(record.level>oldLevel){const ratio=(1+record.level*.085)/(1+oldLevel*.085);e.max=Math.round(e.max*Math.pow(ratio,1.5));e.atk*=ratio;e.level=record.level}
 const wave=e.wave9,growth=1+wave*.22+wave*wave*.008;e.max=Math.round(e.max*growth);e.hp=e.max;e.atk*=1+wave*.14+wave*wave*.003;e.waveApplied9=true;
 if(sealedBoss9(e)){e.dead=true;e.deathT=0;e.sealed9=true;delete e.due8;delete S.respawns8[enemyKey8(e)]}return e;
}
function makeExpEnemy9(map,index,boss=false){const spec=EXPEDITIONS9[map-7],z=spec.element,rank=boss?(map>=9?3:2):index%14===10?1:0,loc=boss?spec.point:index<12?[820+index%4*160,820+Math.floor(index/4)*190]:[2030+index%5*380,850+Math.floor((index-12)/5)*240];
 let x=loc[0],y=loc[1];for(let n=0;n<30&&mapObstacles(map).some(o=>x+30>o.x&&x-30<o.x+o.w&&y+30>o.y&&y-30<o.y+o.h);n++)y=y+100<WH-100?y+100:300;
 const e=makeEnemy(z,boss,x,y,boss?'journeyboss':'journey'+index);e.id='journey'+map+'-'+(boss?'boss':index);e.map=map;e.rift=true;e.exp9=true;e.level=spec.level;
 e.max=Math.round((boss?25000:rank?1000:750)*Math.pow(1+e.level*.08,1.45)*(1+(map-7)*.25));e.atk=(boss?110:27)*(1+e.level*.12)*(1+(map-7)*.18);
 if(boss){e.v7Species=spec.species;e.speciesName=spec.boss;e.element=spec.element;e.hidden9=map===10;e.flight=map>=9}
 setupEncounter8(e,rank);return applyWave9(e);
}
const worldBeforeJourney9=makeWorld;makeWorld=function(){worldBeforeJourney9();for(const e of enemies)applyWave9(e);for(let map=7;map<MAPS.length;map++){for(let j=0;j<(map===10?24:40);j++)enemies.push(makeExpEnemy9(map,j));enemies.push(makeExpEnemy9(map,99,true))}
 for(const e of enemies){if(e.noRewards||e.sealed9)continue;const due=S.respawns8[enemyKey8(e)];if(due!==undefined&&due>S.played){e.dead=true;e.deathT=0;e.due8=due}}
};
function rebuildEncounter9(old){if(old.exp9)return makeExpEnemy9(old.map,old.boss?99:Number(old.id.split('-').pop()),old.boss);
 const local=String(old.id).split('-').pop(),e=makeEnemy(old.z,old.boss,old.home.x,old.home.y,local);e.id=old.id;e.map=old.map;e.rift=old.rift;e.repeat=old.boss&&!old.rift&&!!S.bosses[old.z];
 if(old.rift){e.level=Math.max(100,Math.max(...S.heroes.map(h=>h.lv))+5);e.max=Math.round((e.boss?18000:700)*Math.pow(1+e.level*.08,1.45));e.atk=(e.boss?85:18)*(1+e.level*.12);if(e.boss){e.v7Species=19;e.speciesName='星渊 · 无相渊魔';e.element=1;e.flight=true;e.movement='glide'}}
 setupEncounter8(e,old.rank8||0);return applyWave9(e);
}
tickRespawns8=function(){if(!S)return;for(const e of enemies){if(!e.dead||e.noRewards||e.sealed9||e.due8===undefined||S.played<e.due8)continue;if(sealedBoss9(e)){e.sealed9=true;delete e.due8;delete S.respawns8[enemyKey8(e)];continue}
 if(e.map===currentMap()&&actors.some(a=>owned(a.i)&&a.hp>0&&dist(a,e.home)<240))continue;const replacement=rebuildEncounter9(e),key=enemyKey8(e);for(const field of Object.keys(e))delete e[field];Object.assign(e,replacement);delete S.respawns8[key];if(e.map===currentMap()&&e.rank8)logMessage(e.speciesName+' · 第'+(e.wave9+1)+'轮降临，能力增强。')}
};
const killBeforeJourney9=kill;kill=function(e,source){if(!S||!e||e.dead)return false;const result=killBeforeJourney9(e,source);if(!e.dead||e.noRewards)return result;const key=enemyKey8(e),record=encounterRecord9(e);S.encounters9[key]={kills:record.kills+1,level:Math.max(record.level||0,e.level||1)+(e.rank8===2?0:2)};
 if(e.exp9){awardXp((e.boss?2200:e.rank8===1?350:85)*(1+(e.wave9||0)*.15));S.gold=Math.min(1e9,Math.floor(S.gold+(e.boss?1600:40)*(1+(e.wave9||0)*.18)));if(e.boss&&!S.journey9.includes(e.map)){S.journey9.push(e.map);logMessage('征程推进：'+MAPS[e.map].name+'已破关。'+(e.map<9?'新的界门已开启。':'寻找三枚印记的秘密。'))}if(e.hidden9){S.secretBossWins9=(S.secretBossWins9||0)+1;claimSecretRewards9()}}
 if(sealedBoss9(e)){e.sealed9=true;delete e.due8;delete S.respawns8[key];logMessage(e.speciesName+'已被击败三次，永久封印，不再刷新。')}else if(e.rank8>=2)logMessage(e.rank8===2?'大首领封印进度 '+S.encounters9[key].kills+'/3。':'终极首领将再次归来，下一轮更强。');saveGame(false);return result;
};
// New realms use the same five-element combat, without the old chapter shield gate.
const updateEnemiesBeforeJourney9=updateEnemies;updateEnemies=function(dt){if(currentMap()<7)return updateEnemiesBeforeJourney9(dt);const chapter=S.chapter,kills=S.kills.slice();S.chapter=4;for(let z=0;z<5;z++)S.kills[z]=Math.max(S.kills[z],ZONES[z].need);try{updateEnemiesBeforeJourney9(dt)}finally{S.chapter=chapter;S.kills=kills}};
const addsBeforeJourney9=summonAdds;summonAdds=function(e){if(!e.exp9)return addsBeforeJourney9(e);for(let j=0;j<2;j++){const add=makeExpEnemy9(e.map,j+21);add.x=e.x+(j?100:-100);add.y=e.y+100;add.home={x:add.x,y:add.y};add.id=e.id+'-add'+e.pattern+j;add.max=add.hp=Math.round(add.max*.45);add.atk*=.65;add.noRewards=true;add.aggro=8;enemies.push(add)}logMessage('古神裂隙召来了两名护卫。')};
const tellBeforeJudgement9=createBossTell;createBossTell=function(e,target){if(!e.exp9||!e.boss)return tellBeforeJudgement9(e,target);e.pattern++;const kind=['circle','cone','ring'][(e.pattern-1)%3],seconds=e.hidden9?2.3:e.phase===3?2.5:2.9,w={kind,x:kind==='circle'?target.x:e.x,y:kind==='circle'?target.y:e.y,r:kind==='circle'?150:kind==='cone'?650:430,inner:kind==='ring'?125:0,angle:Math.atan2(target.y-e.y,target.x-e.x),t:seconds,max:seconds,extras:[],lethal9:true,name9:kind==='circle'?'断命陨星':kind==='cone'?'裁决裂光':'归零劫环'};e.wind=w;e.animT=seconds;logMessage('致命预警 · '+w.name9+'！'+(kind==='circle'?'离开红圈。':kind==='cone'?'绕至首领侧后方。':'进入内圈或离开外圈。')+' 护甲与护盾无法抵挡，可闪避。');tone(120,.24,'triangle')};
function fatalHit9(a,e){if(!a||a.hp<=0)return false;if(a.inv>0||a.dodge>0){float(a.x,a.y-90,'闪过断命','#a7f0e1');return false}a.shield=0;baseActorDamage(a,(a.hp+2)*(1+.055*stats(a.i).armor));a.hitT=.25;a.anim='dead';a.animT=.4;return true}
const resolveBeforeJudgement9=resolveBossTell;resolveBossTell=function(e){const w=e.wind;if(!w?.lethal9)return resolveBeforeJudgement9(e);for(const a of actors)if(owned(a.i)&&a.hp>0&&groundHit(w,a))fatalHit9(a,e);novaFx.push({x:w.x,y:w.y,r:w.r,t:1.7,max:1.7,element:e.element,kind:'ultimate'});e.wind=null;e.cast=e.phase===3?4.5:6;screenShake=9;tone(65,.28,'sawtooth')};
const tellDrawBeforeJudgement9=drawTell;drawTell=function(shape,progress,color){tellDrawBeforeJudgement9(shape,progress,shape.lethal9?'#ff6389':color);if(shape.lethal9){label('☠ '+shape.name9+' · '+Math.max(.1,shape.t).toFixed(1)+'秒',shape.x,shape.y-shape.r-24,'#ffd4db',15);if(shape.kind==='ring')label('内圈安全',shape.x,shape.y,'#a8ead0',12)}};
function secretGuardian9(map){return enemies.find(e=>e.map===map&&e.exp9&&e.rank8===1)}
function takeSigil9(map){const sigil=SIGILS9.find(s=>s.map===map);if(!allHeroes9()||!mapUnlocked(map)||!sigil||currentMap()!==map||dist(sigil,active())>110||S.sigils9.includes(map))return false;const guard=secretGuardian9(map);if(guard&&!encounterRecord9(guard).kills){logMessage('印记仍被守卫束缚：击败本地图第一位小首领。');return false}S.sigils9.push(map);logMessage('获得'+sigil.name+' · '+S.sigils9.length+'/3。');if(S.sigils9.length===3){logMessage('三印共鸣：太初神庭南侧出现了隐秘界门。');claimSecretRewards9()}saveGame(false);refreshBars();return true}
const interactBeforeSigils9=interact;interact=function(){if(!S||menu)return;const sigil=SIGILS9.find(s=>s.map===currentMap()&&dist(s,active())<110);if(sigil){takeSigil9(sigil.map);return}return interactBeforeSigils9()};
