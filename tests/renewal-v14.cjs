const {run,test}=require('./v10-harness.cjs');
test('第三章闪避不再被第四章的同坐标封印区域误打断',()=>run(`const v=fresh('跨图闪避',0);v.bosses=[true,true,false,false,false];v.chapter=2;v.heroes[1].unlocked=v.heroes[2].unlocked=true;begin(v);enterMap(3);enemies=[];const a=active();a.x=3500;a.y=2530;a.face=1;a.order={kind:'hold'};const x=a.x;assert(dodge());update(.05);assert(a.dodge>0);assert(a.x>x+20);assert.equal(currentMap(),3);assert.equal(S.chapter,2);`));
test('五种初始英雄均可逐章救齐五人，火土与界外征程不会卡住',()=>run(`
 for(let starter=0;starter<5;starter++){
  begin(fresh('五章验收',starter));closeAllWindows19();
  for(let z=0;z<5;z++){
   assert(mapUnlocked(z+1));assert(enterMap(z+1,true));
   const mobs=enemies.filter(e=>e.map===z+1&&!e.boss&&!e.elite).slice(0,ZONES[z].need);
   for(const e of mobs)enemyDamage(e,1e14,starter,starter);
   assert(S.kills[z]>=ZONES[z].need);const b=enemies.find(e=>e.map===z+1&&e.boss);enemyDamage(b,1e14,starter,starter);closeAllWindows19();
   assert(S.bosses[z]);assert.equal(S.heroes.filter(h=>h.unlocked).length,Math.min(5,z+2));assert(mapUnlocked(z+2));
  }
  assert(S.heroes[3].unlocked&&S.heroes[4].unlocked);assert(!mapUnlocked(7));assert(enterMap(6,true));const rift=enemies.find(e=>e.map===6&&e.boss);enemyDamage(rift,1e14,starter,starter);closeAllWindows19();assert(mapUnlocked(7));assert(enterMap(7,true));assert(validateSave(S));
 }
`,30000));
test('已通关但漏招募的旧存档只修复伙伴章节，不重复金币装备宠物奖励',()=>run(`
 begin(fresh('旧存档',0));const old=clone10(S);old.bosses=[true,true,true,false,false];old.chapter=1;old.heroes[1].unlocked=old.heroes[2].unlocked=true;old.heroes[0].lv=30;old.heroes[1].lv=30;old.heroes[2].lv=30;
 const resources=JSON.stringify({gold:old.gold,bag:old.bag,pets:old.pets,gems:old.gems});assert(validateSave(old));begin(old);assert.equal(S.chapter,3);assert(S.heroes[3].unlocked);assert(!S.heroes[4].unlocked);assert(mapUnlocked(4));assert(!mapUnlocked(5));assert.equal(JSON.stringify({gold:S.gold,bag:S.bag,pets:S.pets,gems:S.gems}),resources);saveGame(false);begin(readSave());assert.equal(S.heroes.filter(h=>h.unlocked).length,4);assert(validateSave(S));
`));
test('没有守护者记录时不会凭等级或新地图ID免费招募英雄',()=>run(`begin(fresh('未通关',0));S.heroes[0].lv=150;const v=clone10(S);assert(!syncStory14(v));assert.equal(v.heroes.filter(h=>h.unlocked).length,1);assert.equal(v.chapter,0);assert(!mapUnlocked(4));`));
test('五章导航始终显示五个入口，第四第五章锁定原因可见且可切换查看',()=>run(`
 begin(fresh('导航',0));window.innerWidth=844;window.innerHeight=390;worldPanel();assert.equal($('#dialog').querySelectorAll('[data-stage19]').length,9);assert($('#dialog').innerHTML.includes('沉岳古城'));assert($('#dialog').innerHTML.includes('先通关第1关'));const b=$('#dialog').querySelectorAll('[data-stage19]').find(b=>b.dataset.stage19==='4');assert(b.disabled);assert.equal(currentMap(),0);closeAllWindows19();window.innerWidth=1280;window.innerHeight=720;
`));
test('资源谷从1级开放且不解锁终局，24只固定普通怪没有首领',()=>run(`begin(fresh('资源入口',0));assert(mapUnlocked(FARM_MAP14));assert(!mapUnlocked(7));assert(enterMap(FARM_MAP14));const list=enemies.filter(e=>e.map===FARM_MAP14);assert.equal(list.length,24);assert(list.every(e=>!e.boss&&!e.elite&&e.level<=7&&walkable(e.home.x,e.home.y)));assert(validateSave(S));`));
test('三类采猎实际增加金币灵铁与基础宝石，不改主线击杀章节与首领记录',()=>run(`
 begin(fresh('采猎奖励',0));enterMap(FARM_MAP14);const state=JSON.stringify({kills:S.kills,bosses:S.bosses,chapter:S.chapter,encounters:S.encounters9});
 for(const n of [0,8,16]){const e=enemies.find(e=>e.farm14===n),site=FARM_SITES14[e.site14],gold=S.gold,iron=S.ingots,gem=gemCount(n%18,1);enemyDamage(e,1e14,0,0);assert(e.dead);assert.equal(S.gold-gold,site.gold);assert.equal(S.ingots-iron,site.iron);if(site.gem)assert.equal(gemCount(n%18,1),gem+1);const after=S.gold;assert(!kill(e,0));assert.equal(S.gold,after)}
 assert.equal(JSON.stringify({kills:S.kills,bosses:S.bosses,chapter:S.chapter,encounters:S.encounters9}),state);assert(validateSave(S));
`));
test('资源怪20秒刷新，多轮不变强，读档和切图不提前刷新',()=>run(`
 begin(fresh('采猎刷新',0));enterMap(FARM_MAP14);let e=enemies.find(e=>e.farm14===0),hp=e.max,atk=e.atk;
 for(let n=0;n<5;n++){enemyDamage(e,1e14,0,0);const due=e.due8;S.played=due-1;tickRespawns8();assert(e.dead);S.played=due;active().x=e.home.x;active().y=e.home.y;tickRespawns8();assert(e.dead);active().x=360;active().y=440;tickRespawns8();assert(!e.dead);assert.equal(e.max,hp);assert.equal(e.atk,atk)}
 enemyDamage(e,1e14,0,0);saveGame(false);const due=e.due8;begin(readSave());e=enemies.find(e=>e.farm14===0);assert(e.dead);assert.equal(e.due8,due);S.played=due;tickRespawns8();assert(!e.dead);assert(validateSave(S));
`));
test('资源谷回营仍需卷轴，缺卷轴可在入口购买，传送菜单没有免费绕过',()=>run(`
 begin(fresh('资源回城',0));enterMap(FARM_MAP14);S.scrolls=0;assert(!enterMap(0));S.gold=100;assert(buyReturnScroll());assert.equal(S.scrolls,1);assert(enterMap(0));assert.equal(S.scrolls,0);assert.equal(S.gold,20);
`));
test('后期重击满血不秒杀，护盾格挡有效，残血仍可能倒下',()=>run(`
 reset10(120);enterMap(7);const b=enemies.find(e=>e.map===7&&e.boss),a=active();b.atk=1e8;const receive=(guard,shield,hp)=>{a.hp=hp??stats(a.i).hp;a.inv=0;a.dodge=0;a.guard=guard;a.shield=shield;const before=a.hp;heavyHit14(a,b,false);return before-a.hp};
 const max=stats(0).hp,normal=receive(0,0);assert(normal>0&&normal<=max*.42001);assert(a.hp>0);const block=receive(.8,0);assert(block<normal*.2);assert.equal(receive(0,1e9),0);a.hp=5;a.inv=0;a.guard=0;a.shield=0;heavyHit14(a,b,false);assert.equal(a.hp,0);
`));
test('终极技能只在最终阶段低频出现，45秒限制与4.4秒预警生效',()=>run(`
 reset10(150);S.journey9=[7,8];enterMap(9,true);const b=enemies.find(e=>e.map===9&&e.boss),a=active();b.phase=1;for(let n=0;n<8;n++){createBossTell(b,a);assert(!b.wind.ultimate14)}b.phase=3;b.pattern=3;time=100;createBossTell(b,a);assert(b.wind.ultimate14);assert.equal(b.wind.max,4.4);assert.equal(b.ultimateNext14,145);b.pattern=7;time=110;createBossTell(b,a);assert(!b.wind.ultimate14);b.pattern=11;time=146;createBossTell(b,a);assert(b.wind.ultimate14);a.x=b.wind.x+b.wind.r+100;resolveBossTell(b);assert.equal(b.cast,14);
`));
test('闪避可完全躲过重击，命中后的保护时间阻止追加伤害',()=>run(`reset10(100);enterMap(7);const b=enemies.find(e=>e.map===7&&e.boss),a=active(),hp=a.hp;a.inv=.5;assert(!heavyHit14(a,b));assert.equal(a.hp,hp);a.inv=0;a.dodge=.2;assert(!heavyHit14(a,b));a.dodge=0;assert(heavyHit14(a,b));assert(a.inv>=.9);const after=a.hp;actorDamage(a,1e9,b);assert.equal(a.hp,after);`));
test('普通首领攻击同样有伤害上限，阶段切换不连续压缩重击冷却',()=>run(`reset10(100);enterMap(7);const b=enemies.find(e=>e.map===7&&e.boss),a=active(),hp=a.hp;a.inv=0;a.guard=0;a.shield=0;actorDamage(a,1e12,b);assert(hp-a.hp<=stats(0).hp*.24001);a.x=2200;a.y=900;b.engaged=true;b.hp=b.max*.2;b.phase=1;b.cast=0;b.x=a.x+180;b.y=a.y;enemies=[b];updateEnemies(.05);assert.equal(b.phase,3);assert(b.cast>=6);`));
test('横屏扩大世界视野并提高画布采样，桌面不更改旧分辨率公式',()=>run(`
 const rect=canvas.getBoundingClientRect;canvas.getBoundingClientRect=()=>({width:844,height:390,left:0,top:0});window.innerWidth=844;window.innerHeight=390;resizeWorld();assert(VW>=1360&&VH>=630);assert.equal(canvas.width,1266);assert.equal(canvas.height,585);assert.equal(g.imageSmoothingQuality,'high');canvas.getBoundingClientRect=()=>({width:1280,height:720,left:0,top:0});window.innerWidth=1280;window.innerHeight=720;resizeWorld();assert.equal(VW,1280);assert.equal(VH,720);canvas.getBoundingClientRect=rect;
`));
test('资源地图绘制菜单与刷怪记录能保存，不读取不存在的界外地图配置',()=>run(`begin(fresh('资源渲染',0));enterMap(FARM_MAP14);drawMap();drawMini();baseDraw();worldPanel('farm');assert($('#dialog').innerHTML.includes('金砂旧矿'));assert.equal($('#dialog').querySelectorAll('[data-farm19]').length,3);closeAllWindows19();saveGame(false);assert(validateSave(readSave()));`));
