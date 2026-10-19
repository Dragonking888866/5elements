const {run,test,finish}=require('./v10-harness.cjs');
require('./fixtures-v10.cjs');
test('五行相生相克覆盖全部25对，合成关系双向一致',()=>run(`
 assert.deepEqual(Array.from(WX.names),['金','木','水','火','土']);
 const sheng=[2,3,1,4,0],ke=[1,4,3,0,2];
 for(let a=0;a<5;a++)for(let b=0;b<5;b++){
  const expected=a===b?'same':sheng[a]===b||sheng[b]===a?'sheng':'ke';
  assert.equal(WX.relation(a,b),expected);assert.equal(WX.relation(a,b),WX.relation(b,a));
  assert(Number.isFinite(WX.damageMultiplier(a,b)));
 }
 for(let a=0;a<5;a++){assert.equal(WX.damageMultiplier(a,a),1);assert.equal(WX.damageMultiplier(a,ke[a]),1.3);assert.equal(WX.damageMultiplier(ke[a],a),.65)}
`));
test('英雄、怪物、灵兽、装备和宝石全部具有合法五行归属',()=>run(`
 begin(fresh('五行底层',0));assert.equal(SAVE_KEY,'wuxing-chronicles-v15');
 for(let i=0;i<5;i++)assert.equal(S.heroes[i].element,i);
 for(const e of enemies)assert(Number.isInteger(e.element)&&e.element>=0&&e.element<5);
 for(const p of PETS)assert(Number.isInteger(p.element)&&p.element>=0&&p.element<5);
 for(const gem of GEMS)assert(Number.isInteger(gem.element)&&gem.element>=0&&gem.element<5);
 for(const h of S.heroes)for(const it of h.gear.filter(Boolean))assert(Number.isInteger(WX.itemElement(it))&&WX.itemElement(it)>=0&&WX.itemElement(it)<5);
 assert(validateSave(S));
`));
test('克制伤害仅计算一次，反向受克降低伤害且异图完全隔离',()=>run(`
 begin(fresh('相克伤害',0));enterMap(1);const e=enemies.find(e=>e.map===1&&!e.boss);
 Object.assign(e,{boss:false,elite:false,shield:0,guardT:0,hp:1e7,max:1e7,element:0});
 let before=e.hp;enemyDamage(e,1000,0,0);assert.equal(before-e.hp,960);
 e.element=1;before=e.hp;enemyDamage(e,1000,0,0);assert.equal(before-e.hp,1248);
 e.element=3;before=e.hp;enemyDamage(e,1000,0,0);assert.equal(before-e.hp,624);
 e.map=2;before=e.hp;enemyDamage(e,1000,0,0);assert.equal(e.hp,before);
`));
test('怪物进攻也受到五行相克影响，防御护甲依然生效',()=>run(`
 begin(fresh('承伤',0));enterMap(1);const a=active(),e=enemies.find(e=>e.map===1&&!e.boss),n=20;
 const receive=el=>{a.hp=stats(0).hp;a.inv=0;a.guard=0;a.shield=0;e.element=el;const before=a.hp;actorDamage(a,n,e);return before-a.hp};
 const same=receive(0),strong=receive(3),weak=receive(1);
 assert(strong>same&&same>weak);assert(Math.abs(strong/same-1.3)<.01);assert(Math.abs(weak/same-.65)<.01);
 a.hp=stats(0).hp;a.inv=0;a.guard=.8;const before=a.hp;actorDamage(a,n,e);assert(before-a.hp<same);
`));
test('没有回城卷轴时，按钮、地图菜单和实地传送门不能免费回城',()=>run(`
 begin(fresh('回程',0));enterMap(1);S.scrolls=0;assert(!returnCamp());assert.equal(currentMap(),1);
 assert(!enterMap(0));assert.equal(currentMap(),1);
 worldPanel();const b=$('#dialog').querySelectorAll('[data-map]').find(b=>b.dataset.map==='0');if(b&&!b.disabled)b.click();assert.equal(currentMap(),1);closeDialog();
 active().x=500;active().y=650;interact();assert.equal(currentMap(),1);assert.equal(S.scrolls,0);
`));
test('回城正常消耗一张，战斗中或已在城内不会误扣',()=>run(`
 begin(fresh('卷轴消耗',0));enterMap(1);S.scrolls=2;const e=enemies.find(e=>e.map===1&&!e.boss);e.x=active().x+100;e.y=active().y;e.aggro=6;
 assert(!returnCamp());assert.equal(S.scrolls,2);e.aggro=0;e.x=1000;e.y=1000;
 assert(returnCamp());assert.equal(currentMap(),0);assert.equal(S.scrolls,1);returnCamp();assert.equal(S.scrolls,1);
`));
test('卷轴必须花金币购买，仅营地交易；救援保留独立免费通道',()=>run(`
 begin(fresh('卷轴商店',0));S.scrolls=0;S.gold=0;assert(!buyReturnScroll());assert.equal(S.scrolls,0);
 S.gold=1000;assert(buyReturnScroll());assert.equal(S.scrolls,1);assert(S.gold<1000&&S.gold>=0);
 enterMap(1);active().x=1100;active().y=1000;const gold=S.gold;assert(!buyReturnScroll());assert.equal(S.gold,gold);
 S.scrolls=0;assert(!returnCamp(true));assert.equal(currentMap(),1);for(const a of actors)if(owned(a.i))a.hp=0;returnCamp(true);assert.equal(currentMap(),0);assert.equal(S.scrolls,0);assert(active().hp>0);
`));
test('首领奖励界面的回城按钮同样消耗卷轴',()=>run(`
 begin(fresh('奖励回程',0));enterMap(1);S.scrolls=0;bossReward(0);$('#rewardCamp').click();assert.equal(currentMap(),1);assert.equal(S.scrolls,0);
 closeDialog();S.scrolls=1;returnCamp();assert.equal(currentMap(),0);assert.equal(S.scrolls,0);
`));
test('站立、跟随与普通移动不会主动普攻或释放灵兽攻击',()=>run(`
 begin(fresh('被动战斗',0));enterMap(1);const a=active(),e=enemies.find(e=>e.map===1&&!e.boss);
 enemies=[e];a.x=1000;a.y=1000;a.order={kind:'hold'};e.x=1060;e.y=1000;e.root=10;e.hp=e.max=100000;e.atk=0;
 const p=addPet(3);assignPet(p.id,0);a.petCd=0;const hp=e.hp;for(let i=0;i<5;i++)update(.05);assert.equal(e.hp,hp);assert.equal(a.attack,0);
 S.heroes[1].unlocked=true;actors[1].hp=stats(1).hp;actors[1].x=1000;actors[1].y=1040;actors[1].order={kind:'follow'};for(let i=0;i<5;i++)update(.05);assert.equal(e.hp,hp);
`));
test('点击进攻立即响应，攻击间隔防止连续点击加速',()=>run(`
 begin(fresh('普攻速率',0));enterMap(1);const a=active(),e=enemies.find(e=>e.map===1&&!e.boss);enemies=[e];a.x=1000;a.y=1000;e.x=1060;e.y=1000;e.hp=e.max=100000;e.root=5;
 attack(a,true);assert(e.hp<100000);const hp=e.hp;assert(a.attack>0);for(let n=0;n<10;n++)attack(a,true);assert.equal(e.hp,hp);
 a.attack=0;attack(a,true);assert(e.hp<hp);
`));
test('受到敌人攻击后可以被动反击',()=>run(`
 begin(fresh('反击',0));enterMap(1);const a=active(),e=enemies.find(e=>e.map===1&&!e.boss);enemies=[e];a.x=1000;a.y=1000;e.x=1060;e.y=1000;e.hp=e.max=100000;e.root=5;a.inv=0;a.attack=0;
 actorDamage(a,1,e);const hp=e.hp;for(let n=0;n<5;n++)update(.05);assert(e.hp<hp);
`));
test('异种宝石相生合成优于相克，幸运提高概率',()=>run(`
 begin(fresh('合成五行',0));S.gems=[];S.gold=100000;const a=0,el=GEMS[a].element,b=GEMS.findIndex((g,i)=>i!==a&&WX.relation(el,g.element)==='sheng'),c=GEMS.findIndex((g,i)=>i!==a&&WX.relation(el,g.element)==='ke');
 assert(b>=0&&c>=0);giveGem(a,4,2);giveGem(b,4);giveGem(c,4);const sheng=gemSynthesisPreview(a,4,b),ke=gemSynthesisPreview(a,4,c);assert(sheng.valid&&ke.valid);assert(sheng.success>ke.success);assert.equal(sheng.relation,'sheng');assert.equal(ke.relation,'ke');
 const luckType=3;giveGem(luckType,6,2);socketGem(0,luckType,6,0);socketGem(0,luckType,6,1);assert(gemSynthesisPreview(a,4,c).success>ke.success);
`));
test('宝石合成失败仅失材料二，非法或满输出不扣任何材料',()=>run(`
 begin(fresh('合成原子性',0));S.gems=[];S.gold=100000;giveGem(0,2);giveGem(1,2);const before=S.gold,out=combineGemPair(0,2,1,()=>.9999);assert(out&&!out.success);assert.equal(gemCount(0,2),1);assert.equal(gemCount(1,2),0);assert(S.gold<before);
 S.gems=[];giveGem(0,2,2);giveGem(0,3,9999);const snap=JSON.stringify(S.gems),gold=S.gold;assert(!combineGemPair(0,2,0,()=>0));assert.equal(JSON.stringify(S.gems),snap);assert.equal(S.gold,gold);
 assert(!combineGemPair(-1,2,0,()=>0));assert(!combineGemPair(0,2,999,()=>0));assert.equal(JSON.stringify(S.gems),snap);
`));
test('神兽召唤要求十阶已镶嵌宝石，施放消耗与冷却限制有效',()=>run(`
 begin(fresh('宝石神兽',0));enterMap(1);const a=active(),e=enemies.find(e=>e.map===1&&!e.boss),other=enemies.find(e=>e.map===2&&!e.boss);enemies=[e,other];a.x=e.x-100;a.y=e.y;e.hp=e.max=1e7;other.x=e.x;other.y=e.y;other.hp=other.max=1e7;a.mp=1000;
 S.gems=[];giveGem(0,10);assert(!summonGemBeast());assert(socketGem(0,0,10,0));const mp=a.mp,hp=e.hp,ohp=other.hp;assert(summonGemBeast());assert.equal(a.mp,mp-60);assert(e.hp<hp);assert.equal(other.hp,ohp);assert(!summonGemBeast());
`));
test('攻速宝石实际缩短普攻间隔且卸下后恢复',()=>run(`
 begin(fresh('攻速装备',0));S.gems=[];const before=stats(0).interval;giveGem(16,6);assert(socketGem(0,16,6,0));const after=stats(0).interval;assert(after<before);assert(after>0);assert(stats(0).attackRate>1);assert(unsocketGem(0,0));assert(Math.abs(stats(0).interval-before)<1e-9);
`));
test('属性装备灵兽和宝石面板内点击头像可直接切换角色',()=>run(`
 begin(fresh('面板切换',0));for(let i=0;i<5;i++){S.heroes[i].unlocked=true;actors[i].hp=stats(i).hp}
 for(const f of [talentPanel,bagPanel,petsPanel,forgePanel,careerPanel]){
  closeDialog();S.active=0;f();assert(menu);const buttons=$('#dialog').querySelectorAll('[data-panel-hero]'),button=buttons.find(b=>b.dataset.panelHero==='1');assert(button,'面板缺少直接切换头像');button.click();assert.equal(S.active,1);assert(menu,'切换角色不得退出面板');assert($('#dialog').innerHTML.includes(HEROES[1].name));
 }
 closeDialog();
`));
test('空地灵兽全种类动作和新怪物绘制均无非法画布坐标',()=>run(`
 begin(fresh('精灵绘制',0));const images=[heroFrames,petAtlas,characterAtlas,fusionAtlas,beastAtlasV7,monsterAtlasV7,...petAtlases8];for(const image of images){image.complete=true;image.naturalWidth=1200;image.naturalHeight=1000}
 for(let t=0;t<PETS.length;t++){const p=addPet(t,false);assignPet(p.id,0);for(const mode of ['idle','roar','pounce','breath','pulse']){active().motion=50;active().gait=1;active().petMode=mode;active().petAnim=.6;const pose=drawMount(t,active());assert(Number.isFinite(pose.saddleX)&&Number.isFinite(pose.saddleY)&&Number.isFinite(pose.bob));drawHero(active());drawMount(t,active(),true)}}
 enterMap(1);for(const e of enemies.filter(e=>e.map===1))drawEnemy(e);draw();assert(validateSave(S));
`));
test('旧地图权限、桥梁寻路和驻守命令保留',()=>run(`
 begin(fresh('远征回归',0));assert.equal(MAPS.length,12);assert(enterMap(1));assert(!mapUnlocked(2));assert(!walkable(1660,600));assert(walkable(1660,1370));const path=findPath({x:1100,y:800},{x:2200,y:800});assert(path.length>5);assert(path.every(p=>walkable(p.x,p.y)));assert(path.some(p=>p.y>=1180&&p.y<=1560));
 S.heroes[1].unlocked=true;actors[1].hp=stats(1).hp;actors[1].x=700;actors[1].y=600;selectUnits([1]);commandUnits('hold');const x=actors[1].x,y=actors[1].y;S.active=0;active().x=2200;active().y=1200;for(let n=0;n<60;n++)update(1/60);assert.equal(actors[1].x,x);assert.equal(actors[1].y,y);saveGame(false);begin(readSave());assert.equal(actors[1].x,x);assert.equal(actors[1].order.kind,'hold');
`));
test('五英雄十五种手动技能仍有消耗与冷却',()=>run(`
 for(let i=0;i<5;i++){begin(fresh('手动技能',i));enterMap(1);const a=active(),e=enemies.find(e=>e.map===1&&!e.boss);a.x=e.x-45;a.y=e.y;e.hp=e.max=1e7;S.heroes[i].lv=3;
  for(let slot=0;slot<3;slot++){a.cd=[0,0,0];a.mp=1000;assert(skill(i,slot,true));assert(a.mp<1000);assert(a.cd[slot]>0);assert(!skill(i,slot,true))}
 }
`));
test('首领屏障与三阶段、召唤护卫仍生效且归属当前地图',()=>run(`
 begin(fresh('首领回归',3));enterMap(1);const b=enemies.find(e=>e.map===1&&e.boss);enemyDamage(b,1e9,3,3);assert.equal(b.hp,b.max);S.kills[0]=ZONES[0].need;active().x=b.x+160;active().y=b.y;const all=enemies;enemies=all.filter(e=>e.map===1);updateEnemies(.01);b.hp=b.max*.55;updateEnemies(.01);assert.equal(b.phase,2);assert(b.shield>0);assert(enemies.slice(-2).every(e=>e.map===1));b.hp=b.max*.2;updateEnemies(.01);assert.equal(b.phase,3);enemies=all;
`));
test('干支卦象灵时实际提供小幅角色增益，改变时序不改动装备',()=>run(`
 begin(fresh('干支共鸣',0));const gear=JSON.stringify(S.heroes[0].gear),samples=[];
 for(let day=0;day<80;day++){S.played=day*180;const p=WX.phase(),st=stats(0);assert(WX.valid(p.element)&&WX.valid(p.guaElement));assert(Number.isFinite(st.phaseBonus)&&st.phaseBonus>=0&&st.phaseBonus<.1);samples.push({bonus:st.phaseBonus,atk:st.atk,hp:st.hp})}
 const low=samples.reduce((a,b)=>a.bonus<b.bonus?a:b),high=samples.reduce((a,b)=>a.bonus>b.bonus?a:b);assert(high.bonus>low.bonus);assert(high.atk>low.atk);assert(high.hp>low.hp);assert.equal(JSON.stringify(S.heroes[0].gear),gear);
`));
test('干支灵时匹配材料时提高宝石与灵兽合成实际成功率',()=>run(`
 begin(fresh('时令熔炼',0));S.gold=100000;S.gems=[];giveGem(0,4);giveGem(1,4);const a=addPet(0),b=addPet(1);a.lv=b.lv=15;
 const atPhase=(elements,matching)=>{for(let day=0;day<60;day++){S.played=day*180;if(elements.includes(WX.phase().element)===matching)return}throw Error('没有找到测试时序')};
 atPhase([GEMS[0].element,GEMS[1].element],false);const forgeLow=gemSynthesisPreview(0,4,1);atPhase([GEMS[0].element,GEMS[1].element],true);const forgeHigh=gemSynthesisPreview(0,4,1);assert(forgeLow.valid&&forgeHigh.valid);assert(forgeHigh.phaseBonus>forgeLow.phaseBonus);assert(forgeHigh.success>forgeLow.success);assert(forgeHigh.phaseBonus<.1);
 atPhase([PETS[a.type].element,PETS[b.type].element],false);const petLow=fusionOdds(a,b);atPhase([PETS[a.type].element,PETS[b.type].element],true);const petHigh=fusionOdds(a,b);assert(petHigh.phaseBonus>petLow.phaseBonus);assert(petHigh.success>petLow.success);assert(petHigh.phaseBonus<.1);
`));
test('100种不重名灵宠及全部图集元数据、指定神话灵宠齐全',()=>run(`
 assert.equal(PETS.filter(p=>!p.hidden9).length,100);assert.equal(new Set(PETS.map(p=>p.name)).size,PETS.length);
 for(const name of ['麒麟','神龙','苍龙','青牛','四不像','避水金睛兽','板角青牛','九灵元圣','金毛犼','混沌祖兽'])assert(PETS.some(p=>p.name===name));
 for(let n=39;n<100;n++){const p=PETS[n];assert(WX.valid(p.element));assert(p.atlas8>=0&&p.atlas8<=3);assert(p.cell8>=0&&p.cell8<20);assert(p.minQuality>=0&&p.minQuality<=6);assert(p.saddle.every(Number.isFinite))}
`));
test('七档品质按指定次序并实际增强灵宠战力、独立保存',()=>run(`
 begin(fresh('品质',0));assert.deepEqual(Array.from(QUALITIES8,q=>q[0]),['普通','精品','史诗','稀有','传说','神话','极其稀有']);const p=addPet(42,false,0);assignPet(p.id,0);let before=stats(0);
 for(let q=1;q<7;q++){p.quality=q;const now=stats(0);assert(now.atk>before.atk);assert(now.hp>before.hp);assert(now.int>before.int);before=now}
 saveGame(false);begin(readSave());assert.equal(petOf(0).quality,6);assert(validateSave(S));
`));
test('灵宠包裹可保存1000独立个体且图鉴不因消耗材料而遗忘',()=>run(`
 begin(fresh('收藏',0));for(let type=0;type<100;type++)addPet(type,false);assert.equal(S.discoveredPets.length,100);for(let n=100;n<1000;n++)assert(addPet(n%100,false));assert(!addPet(0));assert.equal(S.pets.length,1000);assert(validateSave(S));S.gold=1000000;fusePets(S.pets[0].id,S.pets[1].id,()=>0);assert.equal(S.discoveredPets.length,100);assert(validateSave(S));saveGame(false);begin(readSave());assert.equal(S.discoveredPets.length,100);
`));
test('一级合体成功使用两只不同个体并按真实成本扣款',()=>run(`
 begin(fresh('一级合体',0));S.gold=1000;const a=addPet(0),b=addPet(1),cost=fusionCost8(a,b);assert.equal(a.lv,1);assignPet(a.id,0);const out=fusePets(a.id,b.id,()=>0,'mutation');assert(out.success);assert.equal(S.gold,1000-cost);assert.equal(S.pets.length,1);assert.equal(out.pet.lv,1);assert(![a.type,b.type].includes(out.pet.type));assert.equal(petOf(0).id,out.pet.id);assert(validateSave(S));
`));
test('合体缺钱、异品质、重复个体、非法随机值不会扣费或消耗材料',()=>run(`
 begin(fresh('合体事务',0));const a=addPet(0),b=addPet(1),c=addPet(0);c.quality=1;S.gold=0;const before=JSON.stringify(S.pets);assert.equal(fusePets(a.id,b.id,()=>0),null);S.gold=1000;assert.equal(fusePets(a.id,a.id,()=>0),null);assert.equal(fusePets(a.id,c.id,()=>0),null);assert.equal(fusePets(a.id,b.id,()=>NaN),null);assert.equal(S.gold,1000);assert.equal(JSON.stringify(S.pets),before);
`));
test('四级怪物存在且每个地图都含小首领，强度与冷却分档',()=>run(`
 begin(fresh('分级',0));for(let map=1;map<=6;map++){assert(enemies.some(e=>e.map===map&&e.rank8===0));assert(enemies.some(e=>e.map===map&&e.rank8===1));assert(enemies.some(e=>e.map===map&&e.rank8>=2))}assert(enemies.some(e=>e.rank8===3));
 for(let n=1;n<4;n++)assert(ENCOUNTERS8[n].seconds>ENCOUNTERS8[n-1].seconds);const normal=enemies.find(e=>e.map===1&&e.rank8===0),mini=enemies.find(e=>e.map===1&&e.rank8===1);assert(mini.hp>normal.hp*3);assert(mini.atk>normal.atk);
`));
test('所有档位怪物掉落合法战利品且首领保证高阶宝石及装备',()=>run(`
 for(let rank=0;rank<4;rank++){begin(fresh('掉落',0));S.gold=1000;S.ingots=0;enterMap(1);const e=enemies.find(e=>e.map===1&&(rank>=2?e.boss:!e.boss));e.rank8=rank;e.v8Managed=true;S.kills[0]=ZONES[0].need;const rnd=Math.random;try{Math.random=()=>.1;enemyDamage(e,1e10,0,0)}finally{Math.random=rnd}assert(e.dead);if(rank){assert(S.gems.some(g=>g.level>=ENCOUNTERS8[rank].levels[0]));assert(S.bag.some(it=>it.quality>=[0,2,3,4][rank]));assert(S.ingots>0)}assert(S.gold>1000);assert(validateSave(S));closeDialog()}
`));
test('品质掉落权重递减且极其稀有只能从大首领或终极首领低概率出现',()=>run(`
 for(const rank of [0,1])for(let n=0;n<1000;n++){const rnd=Math.random;try{Math.random=()=>n/1000;assert(rollQuality8(rank)<6)}finally{Math.random=rnd}}
 for(let rank=2;rank<4;rank++){let count=0;const rnd=Math.random;try{for(let n=0;n<10000;n++){Math.random=()=>(n+.5)/10000;if(rollQuality8(rank)===6)count++}}finally{Math.random=rnd}assert(count>=9&&count<=21)}
`));
test('怪物重复击杀不会重复掉落或重复计时',()=>run(`
 begin(fresh('击杀事务',0));enterMap(1);const e=enemies.find(e=>e.map===1&&e.rank8===1);enemyDamage(e,1e10,0,0);const snap=JSON.stringify(S);kill(e,0);awardGemDrop(e);assert.equal(JSON.stringify(S),snap);assert.equal(e.due8,S.played+120);
`));
test('普通怪和首领按冷却刷新，近距离延期，重新载入保留冷却',()=>run(`
 begin(fresh('刷新',0));enterMap(1);const e=enemies.find(e=>e.map===1&&e.rank8===1),key=enemyKey8(e),id=e.id;enemyDamage(e,1e10,0,0);const due=e.due8;assert(S.respawns8[key]===due);S.played=due-1;tickRespawns8();assert(e.dead);saveGame(false);begin(readSave());let loaded=enemies.find(e=>e.id===id&&e.map===1);assert(loaded.dead);assert.equal(loaded.due8,due);S.played=due;active().x=loaded.home.x;active().y=loaded.home.y;tickRespawns8();assert(loaded.dead);active().x=360;active().y=400;tickRespawns8();assert(!loaded.dead);assert.equal(loaded.rank8,1);assert(loaded.hp===loaded.max);assert(!Object.hasOwn(S.respawns8,key));assert(validateSave(S));
`));
test('大首领复活保留任务奖励去重并能再次正常掉落',()=>run(`
 begin(fresh('首领复战',0));enterMap(1);S.kills[0]=ZONES[0].need;const b=enemies.find(e=>e.map===1&&e.boss);enemyDamage(b,1e10,0,0);closeDialog();const recruited=S.heroes.filter(h=>h.unlocked).length;assert(S.bosses[0]);S.played=b.due8;active().x=360;active().y=400;tickRespawns8();assert(!b.dead&&b.repeat);enemyDamage(b,1e10,0,0);assert(b.dead);assert.equal(S.heroes.filter(h=>h.unlocked).length,recruited);assert.equal(S.chapter,1);assert(validateSave(S));
`));
test('分解装备返还镶嵌宝石并只允许分解行囊物品',()=>run(`
 begin(fresh('分解',0));S.bag=[];const it=addItem(0);it.quality=3;it.sockets=it.slot===0?[{type:0,level:4},null]:undefined;const old=S.ingots,had=gemCount(0,4);assert.equal(recycleItem8(it.id),8);assert.equal(S.ingots,old+8);assert(!S.bag.includes(it));if(it.slot===0)assert.equal(gemCount(0,4),had+1);assert(!recycleItem8(S.heroes[0].gear[0].id));assert(validateSave(S));
`));
test('指定五行装备打造、品质淬炼保留宝石与属性且扣费原子',()=>run(`
 begin(fresh('冶金',0));S.gold=1000000;S.ingots=10000;const it=craftEquipment8(0,2);assert(it);assert.equal(it.element,2);assert.equal(it.quality,1);it.sockets=[{type:3,level:6},null];const power=it.power,cost=temperCost8(it),gold=S.gold,ingots=S.ingots;assert(temperItem8(it.id));assert.equal(it.quality,2);assert(it.power>power);assert.equal(it.element,2);assert.equal(it.sockets[0].level,6);assert.equal(S.gold,gold-cost.gold);assert.equal(S.ingots,ingots-cost.ingots);S.gold=0;const state=JSON.stringify(it),n=S.ingots;assert(!temperItem8(it.id));assert.equal(JSON.stringify(it),state);assert.equal(S.ingots,n);assert(validateSave(S));
`));
test('高阶淬炼成本指数递增且极其稀有封顶',()=>run(`
 begin(fresh('淬炼上限',0));const it=addItem(0);S.gold=10000000;S.ingots=100000;let cost=0;for(let q=0;q<6;q++){it.quality=q;const next=temperCost8(it);assert(next.gold>cost);cost=next.gold;assert(temperItem8(it.id));assert.equal(it.quality,q+1)}assert(!temperItem8(it.id));assert(it.power<=10000);assert(validateSave(S));
`));
test('营地全部店铺可实际交互，离开安全区不可购买打造',()=>run(`
 begin(fresh('商铺',0));S.gold=10000;S.ingots=100;for(const shop of CAMP_SHOPS8){closeDialog();active().x=shop.x;active().y=shop.y;assert(atCamp());interact();assert(menu);assert($('#dialog').innerHTML.includes(shop.service==='smith'?'冶金':shop.service==='gems'?'宝石商店':'熔炼'))}closeDialog();enterMap(1);active().x=2200;active().y=1800;const gold=S.gold,iron=S.ingots;assert(!craftEquipment8(0,0));assert(!petPurchase(42));assert(!buyGem(0));assert.equal(S.gold,gold);assert.equal(S.ingots,iron);
`));
test('火冰五行喷息、咆哮扑击及全部营地建筑可绘制，无非法坐标',()=>run(`
 begin(fresh('效果',0));for(const i of [...petAtlases8,environmentAtlas]){i.complete=true;i.naturalWidth=1402;i.naturalHeight=1122}for(let element=0;element<5;element++)for(const kind of ['breath','roar','pounce','pulse'])for(const t of [.01,.3,.8,1.4,1.79])drawPetEffect({element,kind,x:200,y:300,tx:500,ty:400,t,max:1.8,seed:1});drawCamp();draw();
`));
test('切图清理灵宠特效，失败传送不会清空，图鉴地址保持有效HTML',()=>run(`
 begin(fresh('特效隔离',0));petFx.push({kind:'breath',x:1,y:2,t:1,max:1});assert(enterMap(1));assert.equal(petFx.length,0);petFx.push({kind:'breath',x:1,y:2,t:1,max:1});S.scrolls=0;assert(!enterMap(0));assert.equal(petFx.length,1);S.scrolls=1;assert(enterMap(0));assert.equal(petFx.length,0);assert(!petCardStyle(40).includes('"'));assert(petPortrait8(40).includes('mounts-a-v8.png'));
`));
test('五人全部解封才开放新征程，后续地图按真实破关解锁',()=>run(`
 begin(fresh('解锁',0));assert(!mapUnlocked(7));for(let i=0;i<4;i++)S.heroes[i].unlocked=true;assert(!enterMap(7,true));S.heroes[4].unlocked=true;assert(mapUnlocked(7));assert(enterMap(7));assert(!mapUnlocked(8));const b=enemies.find(e=>e.map===7&&e.boss);enemyDamage(b,1e14,0,0);closeDialog();assert(S.journey9.includes(7));assert(mapUnlocked(8));assert(!mapUnlocked(9));assert(!mapUnlocked(10));assert(validateSave(S));
`));
test('新地图怪物比旧区强且所有出生点避开河流城墙',()=>run(`
 prepareTeam9(110);for(let map=7;map<=10;map++){if(map>7)S.journey9=Array.from({length:map-7},(_,i)=>7+i);if(map===10)S.sigils9=[7,8,9];assert(enterMap(map,true));const list=enemies.filter(e=>e.map===map);assert(list.length>=25);for(const e of list){assert(walkable(e.home.x,e.home.y,20),'不可通行出生点 '+e.id);assert(e.level>=110);assert(e.max>5000)}const path=findPath({x:360,y:440},{x:MAPS[map].point[0]-180,y:MAPS[map].point[1]});assert(path.length>5,'界主不可达 '+map)}assert(validateSave(S));
`));
test('新地图首领直接可战，不受旧章节屏障影响且不重复主线奖励',()=>run(`
 prepareTeam9(120);S.kills=[0,0,0,0,0];enterMap(7);const b=enemies.find(e=>e.map===7&&e.boss),chapter=S.chapter,recruited=S.heroes.filter(h=>h.unlocked).length;enemyDamage(b,1000,0,0);assert(b.hp<b.max);enemyDamage(b,1e14,0,0);assert(b.dead);assert.equal(S.chapter,chapter);assert.equal(S.heroes.filter(h=>h.unlocked).length,recruited);assert(S.journey9.includes(7));assert(validateSave(S));
`));
test('新版重击预警位置固定，离开区域可以完全躲过',()=>run(`
 prepareTeam9();enterMap(7);const b=enemies.find(e=>e.map===7&&e.boss),a=active();a.x=b.x-200;a.y=b.y;createBossTell(b,a);const w=b.wind;assert(w.heavy14&&!w.lethal9);assert(w.t>=3.2);assert.equal(w.kind,'circle');const origin=w.x;a.x=w.x+w.r+100;const hp=a.hp;assert.equal(w.x,origin);resolveBossTell(b);assert.equal(a.hp,hp);assert(!b.wind);
`));
test('重击不再绕过护盾和防御清空生命',()=>run(`
 prepareTeam9();enterMap(7);const b=enemies.find(e=>e.map===7&&e.boss),a=actors[0];a.x=b.x-200;a.y=b.y;a.inv=0;a.dodge=0;a.guard=1;a.shield=1e8;for(const v of actors.slice(1)){v.x=360;v.y=440}createBossTell(b,a);resolveBossTell(b);assert(a.hp>0);assert(a.shield>0&&a.shield<1e8);assert(actors[1].hp>0);assert(currentMap()===7);
`));
test('闪避无敌可以抵挡致命命中，三种技能形状都可解析',()=>run(`
 prepareTeam9();enterMap(9,true);assert.equal(currentMap(),0);S.journey9=[7,8];enterMap(9);const b=enemies.find(e=>e.map===9&&e.boss),a=active();a.x=b.x-200;a.y=b.y;const kinds=new Set();for(let n=0;n<3;n++){a.hp=stats(a.i).hp;a.dodge=.5;a.inv=.3;createBossTell(b,a);kinds.add(b.wind.kind);const hp=a.hp;resolveBossTell(b);assert.equal(a.hp,hp)}assert.equal(kinds.size,3);
`));
test('新首领召唤的护卫只属于当前地图且不产生奖励和刷新记录',()=>run(`
 prepareTeam9();enterMap(7);const b=enemies.find(e=>e.map===7&&e.boss),n=enemies.length;summonAdds(b);const adds=enemies.slice(n);assert.equal(adds.length,2);assert(adds.every(e=>e.map===7&&e.noRewards&&e.rift));const gold=S.gold,records=Object.keys(S.encounters9).length;for(const e of adds)enemyDamage(e,1e14,0,0);assert.equal(S.gold,gold);assert.equal(Object.keys(S.encounters9).length,records);
`));
test('每个大首领最多三次击杀，封印跨冷却、切图、读档保留',()=>run(`
 prepareTeam9();enterMap(1);S.kills[0]=ZONES[0].need;const b=enemies.find(e=>e.map===1&&e.boss),key=enemyKey8(b),id=b.id;for(let n=1;n<=3;n++){enemyDamage(b,1e14,0,0);closeDialog();assert.equal(S.encounters9[key].kills,n);if(n<3){S.played=b.due8;for(const a of actors){a.x=360;a.y=440}tickRespawns8();assert(!b.dead)}}assert(b.dead&&b.sealed9);assert.equal(b.due8,undefined);S.played+=100000;tickRespawns8();assert(b.dead);saveGame(false);begin(readSave());const loaded=enemies.find(e=>e.id===id&&e.map===1);assert(loaded.dead&&loaded.sealed9);assert.equal(S.encounters9[key].kills,3);assert(validateSave(S));
`));
test('普通、小首领和终极首领可超过三轮刷新且逐轮增强',()=>run(`
 for(const rank of [0,1,3]){prepareTeam9();const map=rank===3?6:1;enterMap(map);const e=enemies.find(e=>e.map===map&&e.rank8===rank);let max=e.max,atk=e.atk,level=e.level;for(let n=0;n<4;n++){enemyDamage(e,1e14,0,0);closeDialog();assert(e.dead&&!e.sealed9);S.played=e.due8;for(const a of actors){a.x=360;a.y=440}tickRespawns8();assert(!e.dead);assert(e.max>max&&e.atk>atk&&e.level>level);max=e.max;atk=e.atk;level=e.level}assert(validateSave(S))}
`));
test('六个装备部位都能双孔镶嵌，非武器宝石实际增强能力并可读档',()=>run(`
 prepareTeam9();S.gems=[];for(let gear=0;gear<6;gear++){if(!S.heroes[0].gear[gear])S.heroes[0].gear[gear]={id:S.nextItem++,slot:gear,tier:0,quality:0,power:5};giveGem(0,4,2);const before=stats(0).atk;assert(socketEquipment9(0,gear,0,4,0));assert(stats(0).atk>before);assert(socketEquipment9(0,gear,0,4,1));assert(validateSave(S))}saveGame(false);begin(readSave());for(const it of S.heroes[0].gear)assert(it.sockets.every(g=>g.level===4));assert(validateSave(S));
`));
test('镶嵌替换返还旧宝石；容量不足与非法孔位不丢材料',()=>run(`
 prepareTeam9();S.gems=[];const it=S.heroes[0].gear[1]||{id:S.nextItem++,slot:1,tier:0,power:5};S.heroes[0].gear[1]=it;it.sockets=[{type:0,level:4},null];giveGem(0,4,9999);giveGem(1,3);const snap=JSON.stringify(S.gems),socket=JSON.stringify(it.sockets);assert(!socketEquipment9(0,1,1,3,0));assert.equal(JSON.stringify(S.gems),snap);assert.equal(JSON.stringify(it.sockets),socket);assert(!socketEquipment9(0,1,1,3,4));assert(!socketEquipment9(0,-1,1,3,0));S.gems=S.gems.filter(g=>g.type!==0);assert(socketEquipment9(0,1,1,3,0));assert.equal(gemCount(0,4),1);assert.equal(gemCount(1,3),0);assert(unsocketGem(0,0,1));assert.equal(gemCount(1,3),1);assert(validateSave(S));
`));
test('镶嵌音效在打开音效后产生四段音符，关闭时不播放',()=>run(`
 var notes9=0;audio=null;window.AudioContext=class{constructor(){this.currentTime=0;this.destination={}}resume(){}createOscillator(){notes9++;return{type:'',frequency:{value:0},connect(){},start(){},stop(){}}}createGain(){return{gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}}}};sound=false;socketChime9();assert.equal(notes9,0);sound=true;socketChime9();assert.equal(notes9,4);sound=false;audio=null;
`));
test('新整备面板都可直接切换角色，未解锁角色不能越权',()=>run(`
 prepareTeam9();for(const f of [socketStudio9,rebirthPanel9,()=>fusionPanel(),()=>petsPanel(),bagPanel,talentPanel]){closeDialog();S.active=0;f();assert(menu);const b=$('#dialog').querySelectorAll('[data-panel-hero]').find(b=>b.dataset.panelHero==='1');assert(b);b.click();assert.equal(S.active,1);assert(menu)}closeDialog();begin(fresh('锁定',0));socketStudio9();assert(!switchPanelHero(1));closeDialog();
`));
test('隐藏灵宠默认不泄露到图鉴、商店或普通掉落池',()=>run(`
 prepareTeam9();petsPanel('codex');assert(!$('#dialog').innerHTML.includes('谛听'));assert(!petShopOffer8(100).allowed);assert(!petPurchase(101));closeDialog();const e=enemies.find(e=>e.rank8===3),rnd=Math.random;try{Math.random=()=>.999999;for(let n=0;n<30;n++){const p=encounterPet8(e);if(p)assert(!PETS[p.type].hidden9)}}finally{Math.random=rnd}const a=addPet(0,false,6),b=addPet(1,false,6);assert(fusionPool(a,b).every(t=>!PETS[t].hidden9));
`));
test('三印需击败守卫并亲自触碰，破关后开启隐藏地图和奖励',()=>run(`
 prepareTeam9();assert(!takeSigil9(7));for(let map=7;map<=9;map++){assert(enterMap(map,true));const sigil=SIGILS9.find(s=>s.map===map);active().x=sigil.x;active().y=sigil.y;assert(!takeSigil9(map));const guard=secretGuardian9(map);enemyDamage(guard,1e14,0,0);assert(takeSigil9(map));assert(!takeSigil9(map));const b=enemies.find(e=>e.map===map&&e.boss);enemyDamage(b,1e14,0,0);closeDialog()}assert(mapUnlocked(10));assert(mapPortals().some(p=>p.to===10));assert.equal(S.pets.filter(p=>p.type===100).length,1);claimSecretRewards9();assert.equal(S.pets.filter(p=>p.type===100).length,1);saveGame(false);begin(readSave());assert(mapUnlocked(10));assert(validateSave(S));
`));
test('隐藏首领奖励只发一次，特殊同品质灵契可发现第三只隐藏宠',()=>run(`
 prepareTeam9();S.journey9=[7,8,9];S.sigils9=[7,8,9];enterMap(10);const b=enemies.find(e=>e.map===10&&e.boss);enemyDamage(b,1e14,0,0);assert(S.secretBossWins9===1);assert(S.pets.some(p=>p.type===101));const n=S.pets.filter(p=>p.type===101).length;kill(b,0);claimSecretRewards9();assert.equal(S.pets.filter(p=>p.type===101).length,n);const a=addPet(100,false,5),c=addPet(PETS.findIndex(p=>p.name==='深渊梦魇'),false,5);const out=fusePets(a.id,c.id,()=>0,'mutation');assert(out.success);assert.equal(out.pet.type,102);assert.equal(out.pet.quality,6);assert(validateSave(S));
`));
test('满1000只时隐藏奖励暂存，腾出空间后可领取',()=>run(`
 prepareTeam9();for(let n=0;n<1000;n++)addPet(0,false);S.sigils9=[7,8,9];S.journey9=[7,8,9];assert(!claimSecretRewards9());assert(!S.secretClaims9.includes('sigils'));S.pets.pop();assert(claimSecretRewards9());assert(S.secretClaims9.includes('sigils'));assert.equal(S.pets.length,1000);assert(validateSave(S));
`));
test('新地图、隐藏宠与致命预警绘制没有非有限画布坐标',()=>run(`
 prepareTeam9();for(const img of [terrainAtlas,monsterAtlasV7,environmentAtlas,heroFrames,...petAtlases8]){img.complete=true;img.naturalWidth=1402;img.naturalHeight=1122}S.journey9=[7,8,9];S.sigils9=[7,8,9];for(let map=7;map<=10;map++){enterMap(map,true);drawMap();const boss=enemies.find(e=>e.map===map&&e.boss);createBossTell(boss,active());drawTell(boss.wind,.5);drawEnemy(boss);draw()}for(let type=100;type<103;type++){const p=addPet(type);assignPet(p.id,0);drawHero(active())}assert(validateSave(S));
`));
test('连续战斗帧仍显示新界主真实名称等级，离开后隐藏首领栏',()=>run(`
 prepareTeam9();S.journey9=[7,8,9];enterMap(9,true);const b=enemies.find(e=>e.map===9&&e.boss);active().x=b.x-280;active().y=b.y;for(let n=0;n<12;n++)update(.02);assert($('#bossHud').innerHTML.includes('五劫神皇'));assert($('#bossHud').innerHTML.includes('Lv.150'));active().x=360;active().y=440;update(.02);assert($('#bossHud').classList.contains('hidden'));
`));
