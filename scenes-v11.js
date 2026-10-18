'use strict';
// World coordinates and footprints are shared by rendering, click tests and navigation.
const SCENES11={
 safe:{x:65,y:125,w:1035,h:995},
 districts:[
  {name:'青禾百工营',x:530,y:585,r:560,color:'#a58f60',level:'安全区'},
  {name:'流萤溪林',x:1530,y:690,r:550,color:'#75b88a',level:'Lv.1–4'},
  {name:'赤脊石岭',x:2700,y:1730,r:680,color:'#c0a174',level:'Lv.5–9'},
  {name:'失落星庭',x:3860,y:2580,r:650,color:'#aaa0cf',level:'Lv.10–15'}
 ],
 roads:[[[410,450],[900,520],[1450,650],[2050,1080],[2660,1650],[3370,2060],[3900,2600]],[[440,470],[440,800],[790,920],[1180,1180],[1770,1800],[2660,1650]]],
 props:[
  {cell:7,x:305,y:275,w:175,h:175,block:{x:253,y:231,w:100,h:40}},
  {cell:0,x:475,y:298,w:210,h:205,block:{x:420,y:250,w:110,h:44}},
  {cell:6,x:440,y:615,w:215,h:185,block:{x:400,y:568,w:80,h:42}},
  {cell:2,x:205,y:700,w:190,h:176,block:{x:165,y:654,w:80,h:38}},
  {cell:1,x:480,y:740,w:215,h:200,block:{x:430,y:693,w:100,h:39}},
  {cell:3,x:770,y:790,w:210,h:190,block:{x:725,y:743,w:90,h:39}},
  {cell:7,x:720,y:990,w:210,h:205,block:{x:673,y:943,w:94,h:39}},
  {cell:4,x:1980,y:1000,w:270,h:260},
  {cell:4,x:2790,y:1790,w:250,h:245},
  {cell:4,x:3850,y:2480,w:320,h:315}
 ],
 npcs:[
  {id:'elder',name:'灵脉长老',x:310,y:330,cell:0,kind:'story',mark:'!',color:'#d9d5ab'},
  {id:'merchant',name:'百宝商人',x:455,y:365,cell:1,kind:'shop',mark:'商',color:'#dfbc80'},
  {id:'keeper',name:'灵兽师 · 阿苓',x:365,y:650,cell:5,kind:'pets',mark:'契',color:'#8cd5ac'},
  {id:'gems',name:'凝光宝石工匠',x:205,y:760,cell:3,kind:'gems',mark:'晶',color:'#8bdbec'},
  {id:'smith',name:'铁匠 · 赤锤',x:475,y:800,cell:2,kind:'smith',mark:'铸',color:'#edac76'},
  {id:'synthesis',name:'两仪炼星师',x:770,y:850,cell:4,kind:'synthesis',mark:'炼',color:'#c6a5ef'},
  {id:'mentor',name:'五行转职导师',x:720,y:1045,cell:6,kind:'advance',mark:'阶',color:'#e5d08b'},
  {id:'trainer',name:'巡林教官 · 红绫',x:1040,y:900,cell:7,kind:'quest',mark:'!',color:'#e7b79d'}
 ],
 spawns:[
  [1230,565,1,0],[1390,680,2,0],[1540,500,2,0],[1620,820,3,0],[1790,650,4,0],[1850,995,4,0],
  [2300,1420,5,0],[2490,1630,6,0],[2780,1490,7,0],[2920,1820,8,0],[2610,1970,8,0],
  [3350,2250,10,0],[3590,2460,11,0],[4060,2680,13,0],[4200,2390,14,0],
  [1970,1200,7,1],[3100,2020,11,1],[3950,2810,15,1]
 ],
 chests:[
  {id:'camp-supply',map:0,x:1080,y:580,quality:0,gold:35},
  {id:'creek-root',map:0,x:1510,y:980,quality:0,gold:55},
  {id:'firefly-cache',map:0,x:1930,y:510,quality:1,gold:85,hidden:true},
  {id:'ridge-cache',map:0,x:2680,y:1780,quality:2,gold:120},
  {id:'ruins-vault',map:0,x:3830,y:2670,quality:3,gold:220},
  ...Array.from({length:10},(_,i)=>({id:'realm-cache-'+(i+1),map:i+1,x:i%2?2410:1190,y:i%2?1720:1260,quality:i>5?3:1,gold:70+i*25}))
 ],
 quality:{high:{particles:180,ambient:22,shadows:true,lights:8,fps:60},medium:{particles:90,ambient:10,shadows:true,lights:4,fps:60},low:{particles:36,ambient:3,shadows:false,lights:1,fps:30}}
};
let pendingNpc11=null,impactQueue11=[],particles11=[],particlePool11=[],visualClock11=0,lastRender11=0,perfSamples11=[],fpsWindow11={at:0,frames:0,fps:0,ms:0},lastFrame11=0;
const assets11={};
for(const [key,src]of Object.entries({props:'assets/camp-props-v11.png',npcs:'assets/camp-npcs-v11.png',items:'assets/items-v11.png'})){const image=new Image();image.src=src;assets11[key]=image}
function settings11(){return SCENES11.quality[S?.fxQuality]||SCENES11.quality.medium}
function safePoint11(p){const r=SCENES11.safe;return currentMap()===0&&p.x>=r.x&&p.y>=r.y&&p.x<=r.x+r.w&&p.y<=r.y+r.h}
function seen11(p,pad=220){return p.x>cam.x-pad&&p.x<cam.x+VW+pad&&p.y>cam.y-pad&&p.y<cam.y+VH+pad}
function migrateVisual11(data){const v=clone10(data);v.visual11??=1;v.treasure11??=[];v.campKills11??={};v.exploreQuest11??={accepted:false,claimed:false,kills:0,chests:0};if(!['low','medium','high'].includes(v.fxQuality))v.fxQuality='medium';for(const h of v.heroes)h.petVisual11??='ride';return v}
const validatorBefore11=validateSave;validateSave=function(v){if(!validatorBefore11(v))return false;if(v.visual11===undefined)return true;return v.visual11===1&&v.heroes.every(h=>['ride','follow'].includes(h.petVisual11))&&Array.isArray(v.treasure11)&&new Set(v.treasure11).size===v.treasure11.length&&v.treasure11.every(id=>SCENES11.chests.some(c=>c.id===id))&&v.campKills11&&typeof v.campKills11==='object'&&!Array.isArray(v.campKills11)&&Object.entries(v.campKills11).every(([id,n])=>/^camp11-\d+$/.test(id)&&int10(n,0,100000))&&v.exploreQuest11&&['accepted','claimed'].every(k=>typeof v.exploreQuest11[k]==='boolean')&&['kills','chests'].every(k=>int10(v.exploreQuest11[k],0,100000))&&['low','medium','high'].includes(v.fxQuality)};
const obstaclesBefore11=mapObstacles;mapObstacles=function(id=currentMap()){const result=obstaclesBefore11(id);return id===0?[...result,...SCENES11.props.filter(p=>p.block).map(p=>({...p.block,kind:'building'})),{x:1510,y:1105,w:110,h:110,kind:'pond'},{x:1695,y:1105,w:115,h:110,kind:'pond'}]:result};
atCamp=function(){return !!S&&(currentMap()===0?safePoint11(active()):dist(active(),CAMP)<275)};
function campEnemy11(n){const [x,y,level,rank]=SCENES11.spawns[n],id='camp11-'+n,waves=S.campKills11[id]||0,e=makeEnemy(0,false,x,y,id);Object.assign(e,{id,map:0,camp11:n,level:level+Math.min(100,waves*2),v7Species:rank?17:n%3,element:rank?4:n%5,speciesName:rank?['苔甲震岳兽','赤脊石魁','星庭守望者'][Math.floor(n/16)]:['流萤木魈','溪谷风狼','苔背蜥兽'][n%3],elite:!!rank,rank8:rank,v8Managed:true,boss:false,flight:false,movement:'run',r:rank?38:22,miniCd8:5,respawn:1e9,repeat:false,attack:1.4});e.max=e.hp=Math.round((rank?480+level*45:38+level*18)*(1+Math.min(15,waves*.12)));e.atk=(rank?14+level:3+level*1.5)*(1+Math.min(10,waves*.06));const due=S.respawns8?.[enemyKey8(e)];if(due>S.played){e.dead=true;e.deathT=0;e.due8=due}return e}
const worldBefore11=makeWorld;makeWorld=function(){worldBefore11();for(let n=0;n<SCENES11.spawns.length;n++)enemies.push(campEnemy11(n))};
const tickBefore11=tickRespawns8;tickRespawns8=function(){const all=enemies;enemies=all.filter(e=>e.camp11===undefined);try{tickBefore11()}finally{enemies=all}for(let n=0;n<SCENES11.spawns.length;n++){const e=all.find(e=>e.camp11===n);if(e?.dead&&e.due8<=S.played&&!actors.some(a=>owned(a.i)&&a.hp>0&&currentMap()===0&&dist(a,e.home)<220)){Object.assign(e,campEnemy11(n),{dead:false,due8:undefined});delete S.respawns8[enemyKey8(e)]}}};
const killBefore11=kill;kill=function(e,source){if(e.camp11===undefined)return killBefore11(e,source);if(e.dead)return false;const mainKills=S.kills.slice();let result;try{result=killBefore11(e,source)}finally{S.kills=mainKills}if(e.dead){S.campKills11[e.id]=Math.min(100000,(S.campKills11[e.id]||0)+1);S.exploreQuest11.kills=Math.min(100000,S.exploreQuest11.kills+1);burst11(e.x,e.y-30,e.element,e.rank8?28:12,'hit');saveGame(false)}return result};
const actorDamageBefore11=actorDamage;actorDamage=function(a,amount,from){if(from?.camp11!==undefined&&safePoint11(a))return;const hp=a.hp;actorDamageBefore11(a,amount,from);if(a.hp<hp){burst11(a.x,a.y-45,from?.element??a.i,8,'hit');if(a.hp<=0)a.deathVisual11=.8}};
function walkEnemy11(e,target,dt,speed){let point=target;const dx=target.x-e.x,dy=target.y-e.y,d=Math.hypot(dx,dy);if(d<2)return;const direct={x:e.x+dx/d*speed*dt,y:e.y+dy/d*speed*dt},blocked=!walkable(direct.x,direct.y,e.r*.55);if(blocked||e.navPath11?.length){if(!e.navPath11?.length||time>(e.navNext11||0)){e.navPath11=findPath(e,target);e.navNext11=time+.8}if(e.navPath11?.length){if(dist(e,e.navPath11[0])<13)e.navPath11.shift();point=e.navPath11[0]||target}}const length=dist(e,point);if(length<1)return;const nx=e.x+(point.x-e.x)/length*speed*dt,ny=e.y+(point.y-e.y)/length*speed*dt;if(walkable(nx,ny,e.r*.55)&&!safePoint11({x:nx,y:ny})){e.dx=nx-e.x;e.dy=ny-e.y;e.x=nx;e.y=ny;e.gait=(e.gait||0)+speed*dt/15}}

function updateCamp11(dt){for(const e of enemies){if(e.camp11===undefined||e.map!==currentMap())continue;e.hitT=Math.max(0,e.hitT-dt);if(e.dead){e.deathT=Math.max(0,(e.deathT||0)-dt);continue}e.attack-=dt;e.root=Math.max(0,e.root-dt);e.slow=Math.max(0,e.slow-dt);e.aggro=Math.max(0,e.aggro-dt);if(e.burn>0){e.burn-=dt;e.burnTick-=dt;if(e.burnTick<=0){e.burnTick=1;enemyDamage(e,e.burnPower,3,3);if(e.dead)continue}}const candidates=actors.filter(a=>owned(a.i)&&a.hp>0&&!safePoint11(a));const a=candidates.sort((a,b)=>dist(a,e)-dist(b,e))[0],distance=a?dist(a,e):1e6;if(!a||distance>(e.aggro>0?430:240)||dist(e,e.home)>550){e.strike=null;e.miniTell8=null;walkEnemy11(e,e.home,dt,95);e.hp=Math.min(e.max,e.hp+dt*e.max*.025);continue}e.aggro=4;if(e.strike){e.strike.t-=dt;if(e.strike.t<=0){if(dist(e,a)<e.r+78)actorDamage(a,e.atk,e);e.strike=null}continue}if(distance<e.r+55&&e.attack<=0&&e.root<=0){e.strike={target:a.i,t:.42};e.attack=1.65;e.animT=.6}else if(distance>e.r+42&&e.root<=0)walkEnemy11(e,a,dt,(e.rank8?85:100)*(e.slow>0?.55:1));}}
const enemiesBefore11=updateEnemies;updateEnemies=function(dt){const all=enemies;enemies=all.filter(e=>e.camp11===undefined);try{enemiesBefore11(dt)}finally{enemies=all}if(currentMap()===0)updateCamp11(dt)};
function openTreasure11(id,request){const chest=SCENES11.chests.find(c=>c.id===id);if(!S||!chest||chest.map!==currentMap()||S.treasure11.includes(id)||dist(active(),chest)>125||active().hp<=0)return false;return transaction10('treasure11',request,()=>{if(S.treasure11.includes(id))return false;if(!creditGold10(chest.gold)||!giveGem((chest.quality*3)%18,Math.min(5,1+chest.quality)))return false;S.treasure11.push(id);if(chest.quality>=1)addItem(Math.min(4,chest.quality),chest.quality>1);else S.potions=Math.min(1e5,S.potions+1);S.exploreQuest11.chests=Math.min(100000,S.exploreQuest11.chests+1);audit10('treasure11','开启'+(chest.hidden?'隐秘':'探险')+'宝箱：'+chest.gold+'金币与宝石');logMessage('宝箱已开启：金币 +'+chest.gold+'，获得宝石'+(chest.quality?'与装备':'和药剂')+'。');burst11(chest.x,chest.y-35,0,30,'treasure');tone(760,.22,'triangle');return true})}
function questClaim11(request){if(!S)return false;return transaction10('explore-quest11',request,()=>{const q=S.exploreQuest11;if(!q.accepted||q.claimed||q.kills<4||q.chests<1||S.pets.length>=1000)return false;if(!creditGold10(180)||!giveGem(0,2))return false;if(!addPet(5,true,1))return false;q.claimed=true;audit10('explore-quest11','巡林委托完成：180金、二级鸡血石与精品战狼。');return true})}
const beginBefore11=begin;begin=function(data){pendingNpc11=null;impactQueue11=[];particles11=[];perfSamples11=[];const v=migrateVisual11(data);beginBefore11(v);if(currentMap()===0&&!walkable(active().x,active().y,22)){active().x=360;active().y=440}for(const a of actors){a.pose11='idle';a.deathVisual11=0;a.visualFace11=a.face||1}logMessage('青禾新程：点击人物与店铺互动，向东探索流萤溪林。')};
const enterBefore11=enterMap;enterMap=function(...args){const result=enterBefore11(...args);if(result){pendingNpc11=null;impactQueue11=[];particles11=[]}return result};
