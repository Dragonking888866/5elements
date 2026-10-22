'use strict';
// Append-only world ID. Resource enemies deliberately do not use the endless-wave loot pipeline.
const FARM_MAP14=11;
const FARM_SITES14=[
 {name:'金砂旧矿',x:1130,y:720,color:'#e3c473',gold:42,iron:1,gem:false},
 {name:'灵铁采场',x:2200,y:1480,color:'#9dc2bc',gold:30,iron:3,gem:false},
 {name:'碎晶花园',x:3500,y:2240,color:'#a9a0ed',gold:32,iron:1,gem:true}
];
MAPS.push({name:'青禾资源谷',color:'#344538',accent:'#d7c58d',level:1,desc:'金砂、灵铁与一级宝石。固定低强度，20秒刷新，不随击杀变强。'});
const unlockedBefore14=mapUnlocked;
mapUnlocked=function(id){return id===FARM_MAP14?!!S:unlockedBefore14(id)};
const obstaclesBefore14=mapObstacles;
mapObstacles=function(id=currentMap()){return id===FARM_MAP14?[]:obstaclesBefore14(id)};
const portalsBefore14=mapPortals;
mapPortals=function(){if(currentMap()===FARM_MAP14)return[{x:500,y:650,to:0}];const ps=portalsBefore14();return currentMap()===0?[...ps,{x:995,y:1030,to:FARM_MAP14}]:ps};

function syncStory14(v){
 let changed=false,prefix=0;
 while(prefix<5&&v.bosses[prefix])prefix++;
 const chapter=Math.min(4,prefix);
 if(v.chapter!==chapter){v.chapter=chapter;changed=true}
 const expected=Math.min(5,1+prefix);
 let missing=expected-v.heroes.filter(h=>h.unlocked).length;
 const level=Math.max(1,Math.round(v.heroes.filter(h=>h.unlocked).reduce((n,h)=>n+h.lv,0)/Math.max(1,v.heroes.filter(h=>h.unlocked).length)));
 for(let i=0;i<5&&missing>0;i++){if(v.heroes[i].unlocked)continue;v.heroes[i]=createHero23(i,true,v,'story-repair');missing--;changed=true}
 if(v.won!==(prefix===5)){v.won=prefix===5;changed=true}
 return changed;
}
const beginBefore14=begin;
begin=function(data){const next=clone10(data),repaired=syncStory14(next);const result=beginBefore14(next);if(repaired){logMessage('已按守护者通关记录修复章节与伙伴，原装备、灵宠、宝石和金币保留。');saveGame(false)}return result};
const rewardBefore14=bossReward;
bossReward=function(z){const result=rewardBefore14(z);syncStory14(S);refreshBars();return result};

// All five chapters remain visible, including locked chapters. Selecting a tab never teleports.
let worldTab14='main',selectedChapter14=0;
const sideJourney14=journeyPanel;
function chapterHelp14(z){if(S.bosses[z])return'守护者已击败，可返回探索。';if(mapUnlocked(z+1))return'清理妖兽 '+Math.min(S.kills[z],ZONES[z].need)+' / '+ZONES[z].need+'，再挑战'+ZONES[z].boss+'。';return'先击败第'+z+'章守护者「'+ZONES[z-1].boss+'」。'}
function nextCompanion14(){const i=S.heroes.findIndex(h=>!h.unlocked);return i>=0?HEROES[i].name+' · '+HEROES[i].element+'行':'五行战士已齐聚'}
worldPanel=function(tab='main',chapter=null){
 if(!S)return;panelContext7=null;worldTab14=['main','farm','beyond'].includes(tab)?tab:'main';
 if(chapter!==null)selectedChapter14=clamp(chapter,0,4);else if(worldTab14==='main')selectedChapter14=currentMap()>=1&&currentMap()<=5?currentMap()-1:Math.min(4,S.chapter);
 let content='';
 if(worldTab14==='main'){
  const z=selectedChapter14,m=MAPS[z+1];
  content='<p class="story-summary14">守护者 '+S.bosses.filter(Boolean).length+'/5 · 队伍 '+S.heroes.filter(h=>h.unlocked).length+'/5 · 待解救：'+nextCompanion14()+'</p><nav class="chapter-tabs14" aria-label="五章主线">'+ZONES.map((n,i)=>`<button data-chapter14="${i}" aria-pressed="${i===z}"><b>${['一','二','三','四','五'][i]}</b><small>${S.bosses[i]?'已通关':mapUnlocked(i+1)?'可进入':'待开启'}</small></button>`).join('')+'</nav>'+
   `<article class="chapter-card14" style="--map:${m.accent}"><small>第${z+1}章 · ${S.bosses[z]?'已通关':mapUnlocked(z+1)?'已开放':'尚未开放'}</small><h3>${m.name}</h3><p>${ZONES[z].story}</p><p class="chapter-goal14">${chapterHelp14(z)}</p><div class="actions"><button data-map9="${z+1}" ${mapUnlocked(z+1)?'':'disabled'}>进入第${z+1}章</button><button id="chapterTrack14" ${currentMap()===z+1?'':'disabled'}>追踪守护者</button><button id="chapterSide14" ${currentMap()===S.chapter+1&&!S.won?'':'disabled'}>当前场景支线</button></div></article><p class="story-foot14">第三章救出下一位伙伴，第四章后可集齐五行。五位战士全部解封后开启界外征程。章节按钮只切换查看，点击「进入」才传送。</p>`;
 }else if(worldTab14==='farm'){
  content='<p class="story-summary14">所有角色1级可进 · 普通25秒 · 精英65秒 · 守卫180秒 · 不累计变强</p><div class="farm-sites14">'+FARM_SITES14.map((s,i)=>`<article style="--map:${s.color}"><h3>${s.name}</h3><p>每只 ${s.gold}金币 / ${s.iron}灵铁${s.gem?' / 1级基础宝石':''}</p><button data-farm14="${i}">${currentMap()===FARM_MAP14?'追踪矿区':'进入资源谷'}</button></article>`).join('')+'</div><p>击败资源妖兽才能领取掉落，没有挂机结算。刷新计时按游玩时间，站在出生点120范围内会延后刷新；不会刷新首领，不掉高级宝石。</p><p>灵铁用于冶金和转职，一级宝石可镶嵌或合成。回营仍需1张回城卷轴；入口可打开商会补给。</p>';
 }else{
  content='<p class="story-summary14">'+(allHeroes9()?'五行齐聚，新的征程已经开启。':'需解救全部五行战士；请先完成主线章节。')+'</p><div class="realm-list14">'+[6,7,8,9,...(mapUnlocked(10)?[10]:[])].map(i=>`<article><div><h3>${MAPS[i].name}</h3><small>建议 Lv.${MAPS[i].level} · ${mapUnlocked(i)?'已开放':i===6?'任一角色30级或主线完成':'五行齐聚并通关前一界'}</small></div><button data-map9="${i}" ${mapUnlocked(i)?'':'disabled'}>前往</button></article>`).join('')+'</div><button id="beyondClues14">征程与隐藏线索</button>';
 }
 showDialog(panelHead('灵脉旅图')+'<nav class="world-tabs14"><button data-world14="main" aria-pressed="'+(worldTab14==='main')+'">主线 · 五章</button><button data-world14="farm" aria-pressed="'+(worldTab14==='farm')+'">金币与材料</button><button data-world14="beyond" aria-pressed="'+(worldTab14==='beyond')+'">界外征程</button></nav>'+content+'<div class="actions"><button data-map9="0">回青禾营地 · 卷轴 '+(S.scrolls||0)+'</button></div>');
 $('#dialog').querySelectorAll('[data-world14]').forEach(b=>b.onclick=()=>worldPanel(b.dataset.world14));
 $('#dialog').querySelectorAll('[data-chapter14]').forEach(b=>b.onclick=()=>worldPanel('main',+b.dataset.chapter14));
 $('#dialog').querySelectorAll('[data-map9]').forEach(b=>b.onclick=()=>{if(enterMap(+b.dataset.map9))closeDialog()});
 $('#dialog').querySelectorAll('[data-farm14]').forEach(b=>b.onclick=()=>{const i=+b.dataset.farm14;if(currentMap()!==FARM_MAP14&&!enterMap(FARM_MAP14))return;closeDialog();commandUnits('move',{x:FARM_SITES14[i].x-150,y:FARM_SITES14[i].y-90});logMessage('前往'+FARM_SITES14[i].name+'；点击进攻开始采猎。')});
 if($('#chapterTrack14'))$('#chapterTrack14').onclick=()=>{const p=ZONES[selectedChapter14];closeDialog();commandUnits('move',{x:p.x-160,y:p.y-80});logMessage('已追踪'+p.boss+'，沿道路前进，先清理妖兽解除屏障。')};
 if($('#chapterSide14'))$('#chapterSide14').onclick=sideJourney14;
 if($('#beyondClues14'))$('#beyondClues14').onclick=journeyPanel9;
};
journeyPanel=function(){worldPanel('main')};

function makeFarmEnemy14(n){
 const site=Math.floor(n/8),j=n%8,s=FARM_SITES14[site],x=s.x+(j%4-1.5)*115,y=s.y+(Math.floor(j/4)-.5)*180;
 const e=makeEnemy(0,false,x,y,'supply'+n);
 Object.assign(e,{id:'supply14-'+n,map:FARM_MAP14,farm14:n,site14:site,level:3+site*2,hp:115+site*55,max:115+site*55,atk:5+site*2,boss:false,elite:false,rank8:0,r:22,v8Managed:false,v7Species:[3,9,12][site],speciesName:['窃金砂鼠','铁背小妖','碎晶灵'][site],element:[4,0,2][site],respawn:1e9,attack:1.8});
 const due=S.respawns8[enemyKey8(e)];if(due>S.played){e.dead=true;e.deathT=0;e.due8=due}return e;
}
const makeWorldBefore14=makeWorld;
makeWorld=function(){makeWorldBefore14();for(let n=0;n<55;n++)enemies.push(makeFarmEnemy14(n))};
const killBefore14=kill;
kill=function(e,source){
 if(e?.farm30)return killValley30(e,source);if(e?.farm14===undefined)return killBefore14(e,source);if(e.dead||e.map!==currentMap())return false;
 const s=FARM_SITES14[e.site14];e.dead=true;e.hp=0;e.deathT=.65;e.wind=null;e.strike=null;e.due8=S.played+20;e.respawn=1e9;S.respawns8[enemyKey8(e)]=e.due8;
 creditGold10(s.gold);S.ingots=Math.min(1e8,(S.ingots||0)+s.iron);S.totalKills=Math.min(1e8,S.totalKills+1);awardXp(12);
 if(s.gem&&!giveGem(e.farm14%18,1))creditGold10(10);
 loot.push({x:e.x,y:e.y,t:2,color:s.color});burst11(e.x,e.y-30,e.element,12,'hit');float(e.x,e.y-75,'+'+s.gold+'金 / '+s.iron+'灵铁',s.color);
 logMessage(s.name+'：金币 +'+s.gold+'，灵铁 +'+s.iron+(s.gem?'，一级基础宝石 +1':'')+'。');saveGame(false);refreshBars();return true;
};
const tickBefore14=tickRespawns8;
tickRespawns8=function(){const all=enemies;enemies=all.filter(e=>e.farm14===undefined);try{tickBefore14()}finally{enemies=all}for(const e of all){if(e.farm14===undefined||!e.dead||e.due8>S.played)continue;if(currentMap()===FARM_MAP14&&actors.some(a=>owned(a.i)&&a.hp>0&&dist(a,e.home)<120))continue;Object.assign(e,makeFarmEnemy14(e.farm14),{dead:false,due8:undefined});delete S.respawns8[enemyKey8(e)]}};
const loadDecorBefore14=loadMapDecor;
loadMapDecor=function(){loadDecorBefore14();if(currentMap()===FARM_MAP14){const keep=decor.filter(d=>d.x>420&&FARM_SITES14.every(s=>dist(s,d)>330)&&!(d.x<1200&&d.y<1150));decor.splice(0,decor.length,...keep)}};
const drawMapBefore14=drawMap;
const terrainBefore14=paintTerrain;
paintTerrain=function(){if(currentMap()!==FARM_MAP14)return terrainBefore14();if(!terrainAtlas.complete||!terrainAtlas.naturalWidth)return;const key='resource-grass14';if(!terrainPatterns.has(key)){const tile=document.createElement('canvas');tile.width=tile.height=256;const ctx=tile.getContext('2d');ctx.drawImage(terrainAtlas,0,0,terrainAtlas.naturalWidth/3,terrainAtlas.naturalHeight/2,0,0,256,256);terrainPatterns.set(key,g.createPattern(tile,'repeat'))}g.save();g.globalAlpha=.32;g.fillStyle=terrainPatterns.get(key);g.fillRect(cam.x,cam.y,VW,VH);g.restore()};
drawMap=function(){
 if(currentMap()!==FARM_MAP14)return drawMapBefore14();g.fillStyle='#334738';g.fillRect(cam.x,cam.y,VW,VH);paintTerrain();
 road11([[360,440],[1130,720],[2200,1480],[3500,2240]]);
 for(const [i,s]of FARM_SITES14.entries()){
  if(!seen11(s,550))continue;const grad=g.createRadialGradient(s.x,s.y,30,s.x,s.y,450);grad.addColorStop(0,s.color+'30');grad.addColorStop(1,s.color+'00');ellipse(s.x,s.y,440,300,grad);
  for(let j=0;j<9;j++){const x=s.x-260+j%3*240,y=s.y-260+Math.floor(j/3)*235;if(i===2){poly([[x-16,y],[x-22,y-32],[x,y-70],[x+22,y-32],[x+16,y]],['#89c9de','#b5a4ec','#b3ddc0'][j%3]);glow11(x,y-25,50,s.color,.14)}else{rock(x,y,1.2+j%3*.2,i?'#738b8e':'#8a8063');for(let k=0;k<4;k++)line(x-12+k*7,y-24,x-7+k*6,y-30,i?'#aad2d1':'#e8c575',3)}}
  label(s.name,s.x,s.y-335,s.color,22);label('普通25秒 · 精英65秒 · 守卫180秒',s.x,s.y-310,'#c7d4bf',12);
 }
 drawCamp();for(const p of mapPortals()){floorRing11(p.x,p.y,42,'#e4d399');label('回营 · 消耗卷轴',p.x,p.y-95,'#eee0b9',13)}
};
const miniBefore14=drawMini;
drawMini=function(){miniBefore14();if(currentMap()!==FARM_MAP14)return;for(const s of FARM_SITES14){mg.fillStyle=s.color;mg.fillRect(s.x/WW*190-3,s.y/WH*120-3,6,6)}};

// Replace unconditional executions with mitigated damage. Boss burst has an upper bound before shielding.
const damageBefore14=actorDamage;
actorDamage=function(a,amount,from){
 const boss=from?.boss||from?.rank8>=1,hazard=from?.hazard;
 if(boss||hazard){const st=stats(a.i),cap=from?.ultimateHit14?.65:from?.skillHit14?.42:hazard?.16:.24;
  amount=Math.min(amount,st.hp*cap*(1+.055*st.armor)/1.3);
 }
 const hp=a.hp,shield=a.shield;const result=damageBefore14(a,amount,from);
 if(from?.skillHit14&&a.hp>0&&(a.hp<hp||a.shield<shield))a.inv=Math.max(a.inv,.9);
 return result;
};
function heavyHit14(a,e,ultimate=false){
 if(!a||a.hp<=0||a.dodge>0||a.inv>0)return false;
 const hp=a.hp,shield=a.shield;e.skillHit14=true;e.ultimateHit14=ultimate;
 try{actorDamage(a,e.atk*(ultimate?4:2.4)+stats(a.i).hp*(ultimate?1.8:.9),e)}finally{delete e.skillHit14;delete e.ultimateHit14}
 return a.hp<hp||a.shield<shield;
}
fatalHit9=function(a,e){return heavyHit14(a,e,true)};
const tellBefore14=createBossTell;
createBossTell=function(e,target){
 if(!e.exp9||!e.boss){tellBefore14(e,target);if(e.wind){e.wind.t=e.wind.max=Math.max(2.4,e.wind.max);e.animT=e.wind.max}return}
 e.pattern++;const kind=['circle','cone','ring'][(e.pattern-1)%3],ultimate=e.phase===3&&(e.rank8===3||e.hidden9)&&e.pattern%4===0&&time>=(e.ultimateNext14||0),seconds=ultimate?4.4:3.2;
 if(ultimate)e.ultimateNext14=time+45;
 e.wind={kind,x:kind==='circle'?target.x:e.x,y:kind==='circle'?target.y:e.y,r:kind==='circle'?145:kind==='cone'?540:350,inner:kind==='ring'?145:0,angle:Math.atan2(target.y-e.y,target.x-e.x),t:seconds,max:seconds,extras:[],heavy14:true,ultimate14:ultimate,name14:ultimate?'五劫重陨':kind==='circle'?'陨星重击':kind==='cone'?'裂光吐息':'震界环击'};
 e.animT=seconds;logMessage((ultimate?'终极重击':'首领预警')+' · '+e.wind.name14+'：'+(kind==='circle'?'离开红圈':kind==='cone'?'绕到侧后':'进入内圈或退出外圈')+'，可用防御或闪避。');tone(150,.2,'triangle');
};
const resolveBefore14=resolveBossTell;
resolveBossTell=function(e){
 const w=e.wind;if(!w)return;
 if(!w.heavy14){e.skillHit14=true;try{resolveBefore14(e)}finally{delete e.skillHit14}e.cast=Math.max(e.cast,e.phase===3?9:11);return}
 for(const a of actors)if(owned(a.i)&&a.hp>0&&groundHit(w,a))heavyHit14(a,e,w.ultimate14);
 novaFx.push({x:w.x,y:w.y,r:w.r,t:1.4,max:1.4,element:e.element,kind:'ultimate'});e.wind=null;e.cast=w.ultimate14?14:e.phase===3?10:12;screenShake=4;tone(80,.22,'sawtooth');
};
const enemiesBefore14=updateEnemies;
updateEnemies=function(dt){const states=new Map(enemies.filter(e=>e.boss&&!e.dead).map(e=>[e,{phase:e.phase,strike:e.strike}]));enemiesBefore14(dt);for(const[e,old]of states){if(e.dead)continue;if(e.phase>old.phase)e.cast=Math.max(e.cast,6);if(!old.strike&&e.strike)e.attack=Math.max(e.attack,1.8)}};

// Landscape gets a wider, sharper world view rather than oversized sprites on a narrow field.
const resizeBefore14=resizeWorld;
resizeWorld=function(){resizeBefore14();if(!mobileViewport13())return;const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;if(r.width>r.height){VW=Math.round(clamp(r.width*1.62,1000,1800));VH=Math.round(VW*r.height/r.width)}const dpi=S?.fxQuality==='low'?1:S?.fxQuality==='high'?2:1.5;renderScale11=Math.min(dpi,Math.sqrt(2200000/(r.width*r.height)))*r.width/VW;canvas.width=Math.round(VW*renderScale11);canvas.height=Math.round(VH*renderScale11);g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high'};
function refreshRealm14(){
 if(!S)return;const e=enemies.find(e=>e.map===currentMap()&&e.boss&&!e.dead&&e.wind&&dist(e,active())<850);
 if(e?.wind){const w=e.wind;let el=$('#bossWarning14');if(!el){$('.world-wrap').insertAdjacentHTML('beforeend','<div id="bossWarning14" role="status"></div>');el=$('#bossWarning14')}el.textContent=(w.name14||TELL_NAMES[e.z])+' '+Math.max(0,w.t).toFixed(1)+'s · '+(w.kind==='ring'?'内圈安全':w.kind==='cone'?'绕到侧后':'离开红圈');el.hidden=false}
 else if($('#bossWarning14'))$('#bossWarning14').hidden=true;
 if(currentMap()===FARM_MAP14){$('#zoneName').textContent='青禾资源谷 · 金砂 / 灵铁 / 碎晶';$('#objective').textContent='固定低强度采猎区；击败妖兽获得金币、灵铁和基础宝石。';$('#bossHud').classList.add('hidden');if($('#mobileContext13'))$('#mobileContext13').textContent='资源谷 · 金币 '+S.gold+' · 灵铁 '+(S.ingots||0)}
}
const refreshBefore14=refreshBars;refreshBars=function(){refreshBefore14();refreshRealm14()};
const updateBefore14=update;update=function(dt){updateBefore14(dt);refreshRealm14()};
const helpBefore14=v6Help;v6Help=function(){helpBefore14();$('#dialog').insertAdjacentHTML('afterbegin','<section class="chapter-card14"><h3>V14 主线与补给</h3><p>菜单「任务」或「传送」打开五章主线，五个章节按钮始终可见。金币与材料页进入青禾资源谷；金砂鼠掉金币，铁背妖掉灵铁，碎晶灵掉一级宝石，20秒刷新且不会变强。回营仍需卷轴。</p><p>后期首领改为3.2秒固定位置预警；重击间隔至少10秒。终极重击只在最终阶段每四轮出现一次，至少间隔45秒，预警4.4秒。所有首领技能受护甲、五行、防御与护盾影响，满血不会被单次技能直接清空，残血仍需躲避。</p></section>')};help=v5Help=v6Help;
const introBefore14=intro;intro=function(){introBefore14();const h=$('#dialog').querySelector('h2');if(h)h.textContent='五行战记 · 灵脉复苏 V14';const f=$('#dialog').querySelector('.intro-feature8');if(f)f.textContent='五章主线直达 · 资源谷采猎 · 首领公平预警 · 横屏广角高清'};
for(const id of ['worldBtn','mobileWorld','journeyBtn','mobileJourney'])$('#'+id).onclick=()=>worldPanel('main');
$('#helpBtn').onclick=v6Help;
