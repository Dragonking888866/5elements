const {run,test}=require('./v10-harness.cjs');
require('./fixtures-v10.cjs');
test('新游戏可立即保存读取，装备元数据和五阶字段完整',()=>run(`
 begin(fresh('新远征',0));assert(validateSave(S));assert(readSave());assert.equal(SAVE_KEY,'wuxing-chronicles-v13');assert.equal(S.heroes[0].gear[0].baseLevel10,5);assert.equal(heroCount10(S.heroes[0]),0);assert.equal(levelCap10(0),150);
`));
test('全体幸运包含未出战和未招募的有效角色，并即时影响两个融合系统',()=>run(`
 reset10();const a=addPet(0,false,3),b=addPet(1,false,3);giveGem(0,8,2);const p0=petFusionPreview10(a,b).success,g0=gemFusionPreview10([{type:0,level:8},{type:0,level:8}]).success;S.heroes[4].unlocked=false;S.heroes[4].innateLuck10=100;invalidateLuck10();const luck=sharedLuck10();assert.equal(luck.count,5);assert.equal(luck.total,100);assert.equal(sharedLuck10(),luck);assert(petFusionPreview10(a,b).success>p0);assert(gemFusionPreview10([{type:0,level:8},{type:0,level:8}]).success>g0);S.heroes[4].test10=true;invalidateLuck10();assert.equal(sharedLuck10().total,0);delete S.heroes[4].test10;S.heroes[4].deleted10=true;invalidateLuck10();assert.equal(sharedLuck10().total,0);
`));
test('幸运算法有边际递减，异常幸运不参与，高阶概率永远低于100%',()=>run(`
 reset10();let previous=0;for(const value of [0,10,100,1000,10000]){S.heroes[0].innateLuck10=value;invalidateLuck10();const f=sharedLuck10().factor;assert(f>=previous&&f>=1&&f<1.35);previous=f}S.heroes[0].innateLuck10=NaN;invalidateLuck10();assert.equal(sharedLuck10().count,4);S.heroes[0].innateLuck10=100000;invalidateLuck10();const a=addPet(0,false,5),b=addPet(1,false,5);giveGem(0,10,2);assert(petFusionPreview10(a,b).success<=.45);assert(gemFusionPreview10([{type:0,level:10},{type:0,level:10}]).success<=.28);
`));
test('灵宠品质逐阶成功率递减，异品质和最高品质不消耗物资',()=>run(`
 reset10();const a=addPet(0,false,0),b=addPet(0,false,0);let previous=1.01;for(let q=0;q<6;q++){a.quality=b.quality=q;const p=petFusionPreview10(a,b);assert(p.success<previous);previous=p.success;assert(p.valid)}a.quality=6;b.quality=6;const snap=stateItems10();assert(!fusePets(a.id,b.id,()=>0));assert.equal(stateItems10(),snap);a.quality=1;b.quality=2;assert(!fusePets(a.id,b.id,()=>0));
`));
test('成功升品保留主宠身份元素与等级，属性继承取最大值不会反复相加',()=>run(`
 reset10();const a=addPet(0,false,2),b=addPet(1,false,2);a.lv=30;b.lv=42;a.xp=123;a.potential10={atk:20,hp:60};b.potential10={atk:40,hp:90};assignPet(a.id,0);const before=petPower10(a),out=fusePets(a.id,b.id,()=>0,'upgrade');assert(out.success);const p=out.pet;assert.equal(p.type,0);assert.equal(p.element10,petElement10(a));assert.equal(p.lv,42);assert.equal(p.xp,123);assert.equal(p.potential10.atk,40);assert.equal(p.potential10.hp,90);assert(petPower10(p).atk>=before.atk);assert.equal(S.heroes[0].pet,p.id);assert(!S.pets.some(x=>x.id===a.id||x.id===b.id));const c=addPet(0,false,3);c.lv=42;c.potential10={atk:40,hp:90};const next=fusePets(p.id,c.id,()=>0,'upgrade');assert(next.success);assert.equal(next.pet.potential10.atk,40);assert(validateSave(S));
`));
test('失败保护保留主宠全部培养与骑乘，副宠费用消耗且有上限',()=>run(`
 reset10();const a=addPet(0,false,4),main=clone10(a);assignPet(a.id,0);for(let n=0;n<12;n++){const b=addPet(1,false,4),price=petFusionPreview10(S.pets.find(p=>p.id===a.id),b).cost,gold=S.gold;const out=fusePets(a.id,b.id,()=>.999);assert(out&&!out.success);assert.equal(S.gold,gold-price);assert.deepEqual(S.pets.find(p=>p.id===a.id),main);assert.equal(S.heroes[0].pet,a.id)}const b=addPet(1,false,4),p=petFusionPreview10(S.pets.find(p=>p.id===a.id),b);assert(p.pity<=RULES10.pet.pityCap);assert(fusePets(a.id,b.id,()=>0).success);assert.equal(S.petPity10[4],0);
`));
test('传说及以上灵宠被动实际提供护主减伤、疾风攻速和灵汲',()=>run(`
 reset10();const p=addPet(0,false,4);assignPet(p.id,0);assert(stats(0).ward10>=RULES10.pet.legendWard);const old=stats(0).attackRate;p.quality=5;assert(stats(0).attackRate>old);p.quality=6;assert(stats(0).gemLeech>0);assert(petSkills10(p).length===3);
`));
test('11级宝石真实成长与存档往返，12级拒绝',()=>run(`
 reset10();giveGem(0,11);assert(gemBonuses7({type:0,level:11}).atk>gemBonuses7({type:0,level:10}).atk);assert(socketGem(0,0,11,0));assert(validateSave(S));saveGame(false);begin(readSave());assert.equal(S.heroes[0].gear[0].sockets[0].level,11);assert(!gemValid({type:0,level:12}));assert(!gemValid({type:23,level:1}));
`));
test('同级两石升一级，低级明确保证，高级基础概率逐级下降',()=>run(`
 reset10();giveGem(0,1,2);const p=gemFusionPreview10([{type:0,level:1},{type:0,level:1}]);assert.equal(p.success,1);assert(p.guaranteed);assert(fuseGems10(p.materials,()=>.999).success);assert.equal(gemCount(0,2),1);let prev=1.01;for(let target=2;target<=11;target++){assert(RULES10.gem.base[target]<prev);prev=RULES10.gem.base[target]}giveGem(0,11,2);assert(!fuseGems10([{type:0,level:11},{type:0,level:11}],()=>0));
`));
test('异级融合允许且按等级差降概率，补能成本防止廉价冲级',()=>run(`
 reset10();giveGem(0,1,2);giveGem(0,8,2);giveGem(0,9,2);const same=gemFusionPreview10([{type:0,level:9},{type:0,level:9}]),near=gemFusionPreview10([{type:0,level:8},{type:0,level:9}]),far=gemFusionPreview10([{type:0,level:1},{type:0,level:9}]);assert(same.valid&&near.valid&&far.valid);assert.equal(far.level,10);assert(same.success>near.success&&near.success>far.success);assert(far.cost>near.cost&&near.cost>same.cost);assert(far.deficit>near.deficit);assert(fuseGems10(far.materials,()=>0).success);assert.equal(gemCount(0,10),1);
`));
test('三枚同种同级强化提高概率但不超过阶段上限，数量不足不能利用同堆叠',()=>run(`
 reset10();giveGem(0,8,3);const two=gemFusionPreview10([{type:0,level:8},{type:0,level:8}]),three=gemFusionPreview10([{type:0,level:8},{type:0,level:8},{type:0,level:8}]);assert(three.success>two.success);assert(three.success<=three.cap);assert(fuseGems10(three.materials,()=>0).success);assert.equal(gemCount(0,8),0);assert.equal(gemCount(0,9),1);const snap=stateItems10();assert(!fuseGems10(three.materials,()=>0));assert.equal(stateItems10(),snap);
`));
test('双石与三石配方无序匹配，条件不足不能退化为普通融合',()=>run(`
 reset10();giveGem(0,2);giveGem(6,2);const a=gemFusionPreview10([{type:0,level:2},{type:6,level:2}]),b=gemFusionPreview10([{type:6,level:2},{type:0,level:2}]);assert(a.recipe&&b.recipe&&a.recipe.id===b.recipe.id);const out=fuseGems10(b.materials,()=>0);assert(out.success&&out.gem.type===18&&out.gem.level===3);assert(S.discoveredRecipes10.includes('flame-metal'));for(const type of [18,19,20])giveGem(type,6);const mats=[{type:20,level:6},{type:18,level:6},{type:19,level:6}],p=gemFusionPreview10(mats);assert(p.recipe&&p.recipe.id==='five-star');assert(!p.valid);const snap=stateItems10();assert(!fuseGems10(mats,()=>0));assert.equal(stateItems10(),snap);stageHero10(0,1);assert(fuseGems10(mats,()=>0).gem.type===21);assert(validateSave(S));
`));
test('太初配方需要三阶，成功后获得11级专属宝石并登记图鉴',()=>run(`
 reset10();stageHero10(0,3);for(const type of [21,12,17])giveGem(type,10);const mats=[{type:17,level:10},{type:21,level:10},{type:12,level:10}],out=fuseGems10(mats,()=>0);assert(out.success);assert.equal(out.gem.type,22);assert.equal(out.gem.level,11);assert(S.discoveredRecipes10.includes('primordial'));assert(validateSave(S));
`));
test('三石融合失败只保留主石，不影响装备和其他材料',()=>run(`
 reset10();giveGem(0,8,3);giveGem(3,5,4);const gear=JSON.stringify(S.heroes.map(h=>h.gear)),gold=S.gold,p=gemFusionPreview10([{type:0,level:8},{type:0,level:8},{type:0,level:8}]);const out=fuseGems10(p.materials,()=>.999);assert(out&&!out.success);assert.equal(gemCount(0,8),1);assert.equal(gemCount(3,5),4);assert.equal(JSON.stringify(S.heroes.map(h=>h.gear)),gear);assert.equal(S.gold,gold-p.cost);assert.equal(S.gemPity10[9],1);
`));
test('宝石输出满额、非法随机数和缺钱均不丢主石、金币或其他道具',()=>run(`
 reset10();giveGem(0,2,2);giveGem(0,3,9999);let snap=stateItems10();assert(!fuseGems10([{type:0,level:2},{type:0,level:2}],()=>0));assert.equal(stateItems10(),snap);S.gems=S.gems.filter(g=>g.level!==3);snap=stateItems10();assert(!fuseGems10([{type:0,level:2},{type:0,level:2}],()=>NaN));assert.equal(stateItems10(),snap);S.gold=0;assert(!fuseGems10([{type:0,level:2},{type:0,level:2}],()=>0));assert.equal(gemCount(0,2),2);
`));
test('复合宝石只经配方获得，五行词条和百分比属性有上限',()=>run(`
 reset10();for(let type=0;type<GEMS.length;type++){const a=gemBonuses7({type,level:10}),b=gemBonuses7({type,level:11});assert(Object.keys(b).length);assert(!b.rate||b.rate<=RULES10.gem.rateCap);assert(!b.crit||b.crit<=RULES10.gem.critCap);assert(!b.gemLeech||b.gemLeech<=RULES10.gem.leechCap)}assert(!buyGem(18));assert.equal(gemElements10({type:21,level:8}).length,5);giveGem(0,4);giveGem(1,3);const p=gemFusionPreview10([{type:0,level:4},{type:1,level:3}]);assert(p.pool.every(type=>type<18));
`));
test('镶嵌即时提高装备等级评分属性，拆卸恢复且不改变穿戴需求',()=>run(`
 reset10();const item=S.heroes[0].gear[0],lv=equipmentLevel10(item),score=equipmentScore10(item),atk=stats(0).atk,required=item.requiredLevel10;giveGem(0,9);assert(socketGem(0,0,9,0));assert(equipmentLevel10(item)>lv);assert(equipmentScore10(item)>score);assert(stats(0).atk>atk);assert.equal(item.requiredLevel10,required);assert(unsocketGem(0,0));assert.equal(equipmentLevel10(item),lv);assert.equal(equipmentScore10(item),score);assert.equal(stats(0).atk,atk);assert.equal(gemCount(0,9),1);
`));
test('镶嵌预览纯计算不消费或永久叠加，重复确认只结算一次',()=>run(`
 reset10();giveGem(0,5,3);const item=S.heroes[0].gear[0],snap=stateItems10(),request=quote10();for(let n=0;n<10;n++){const p=socketPreview10(0,0,1,{type:0,level:5});assert(p.after.atk>p.before.atk)}assert.equal(stateItems10(),snap);assert(socketEquipment9(0,0,0,5,1,request));assert(!socketEquipment9(0,0,0,5,1,request));assert.equal(gemCount(0,5),2);const level=equipmentLevel10(item);assert(socketEquipment9(0,0,0,5,1));assert.equal(gemCount(0,5),2);assert.equal(equipmentLevel10(item),level);
`));
test('装备库真实999容量，满库保留更优装备并精确出售最低价值装备',()=>run(`
 reset10();S.bag=[];for(let n=0;n<999;n++)S.bag.push(makeItem10(0,0,10+n,1));const weak=S.bag[0],better=makeItem10(4,0,300,100),gold=S.gold;const result=receiveEquipment10(better);assert.equal(S.bag.length,999);assert(S.bag.some(it=>it.id===better.id));assert(!S.bag.some(it=>it.id===weak.id));assert.equal(S.gold,gold+equipmentValue10(weak));assert(result.kept);assert(S.audit10.some(x=>x.kind==='auto-sell'));assert(validateSave(S));
`));
test('满库低价值新增装备直接售出，保护中的库存与角色装备不会误售',()=>run(`
 reset10();S.bag=[];for(let n=0;n<999;n++)S.bag.push(makeItem10(4,n%6,100+n,40));const protectedIds=S.heroes[0].gear.filter(Boolean).map(it=>it.id),weak=makeItem10(0,0,3,1),gold=S.gold;const result=receiveEquipment10(weak);assert(result.sold===weak.id);assert.equal(S.gold,gold+9);assert.equal(S.bag.length,999);assert.deepEqual(S.heroes[0].gear.filter(Boolean).map(it=>it.id),protectedIds);assert(validateSave(S));
`));
test('锁定收藏绑定任务禁止出售及镶嵌保护覆盖自动回收，全保护时安全暂存',()=>run(`
 reset10();S.bag=[];for(let n=0;n<999;n++)S.bag.push(makeItem10(0,n%6,10,1,{locked10:true}));const item=makeItem10(6,0,900,200),gold=S.gold,result=receiveEquipment10(item);assert(result.pending);assert.equal(S.gold,gold);assert.equal(S.bag.length,999);assert.equal(S.pendingGear10[0].id,item.id);for(const flag of ['favorite10','bound10','quest10','noSell10']){const x=makeItem10(0,0,1,1,{[flag]:true});assert(protectedEquipment10(x))}assert(protectedEquipment10(makeItem10(0,0,1,1,{sockets:[{type:0,level:1},null]})));assert(!sellEquipment10(S.bag[0].id));assert(!recycleEquipment10(S.bag[0].id));assert(validateSave(S));
`));
test('关闭自动出售后满库装备暂存，领取和出售重复请求不复制金币物品',()=>run(`
 reset10();S.bag=[];for(let n=0;n<999;n++)S.bag.push(makeItem10());S.autoSell10=false;const pending=makeItem10(3),out=receiveEquipment10(pending);assert(out.pending);assert(!claimEquipment10(pending.id));const sold=S.bag[0],request=quote10(),gold=S.gold;assert(sellEquipment10(sold.id,request));assert(!sellEquipment10(sold.id,request));assert.equal(S.gold,gold+equipmentValue10(sold));const request2=quote10();assert(claimEquipment10(pending.id,request2));assert(!claimEquipment10(pending.id,request2));assert.equal(S.bag.length,999);assert.equal(S.pendingGear10.length,0);
`));
test('金币现金满额时自动出售收入转入储备，不静默丢失且可用于融合',()=>run(`
 reset10();S.gold=1e9;S.goldReserve10=0;assert(creditGold10(300));assert.equal(S.gold,1e9);assert.equal(S.goldReserve10,300);S.gold=0;assert(spendGold10(200));assert.equal(S.goldReserve10,100);saveGame(false);assert.equal(S.gold,100);assert.equal(S.goldReserve10,0);assert(validateSave(S));
`));
test('手动出售镶嵌装备返还宝石，锁定装备无法通过旧API分解',()=>run(`
 reset10();const item=makeItem10(3,0,200,60,{sockets:[{type:0,level:8},null]});S.bag.push(item);const gold=S.gold;assert(sellEquipment10(item.id));assert.equal(gemCount(0,8),1);assert.equal(S.gold,gold+600);const locked=makeItem10(2,0,30,10,{locked10:true});S.bag.push(locked);assert(!recycleItem8(locked.id));assert(S.bag.some(it=>it.id===locked.id));
`));
test('满库换装采用交换不会溢出，卸下已装备物品不会偷偷出售',()=>run(`
 reset10();S.bag=[];for(let n=0;n<999;n++)S.bag.push(makeItem10(1,n%6,30,10));const selected=S.bag[0],old=S.heroes[0].gear[selected.slot];assert(equipItem(selected.id,0));assert.equal(S.bag.length,999);assert(S.bag.some(it=>it.id===old.id));assert(!unequipItem10(0,selected.slot));assert.equal(S.heroes[0].gear[selected.slot].id,selected.id);assert(validateSave(S));
`));
test('转职保留纯基础成长与加点职业技能，装备临时效果不计入永久账本',()=>run(`
 reset10();const h=S.heroes[0];h.bonus=[13,17,19];h.points=33;giveGem(0,10);socketGem(0,0,10,0);const base=heroCore10(0),count=heroCount10(h),gear=JSON.stringify(h.gear),bonus=JSON.stringify(h.bonus),job=h.job,cost=advanceCost10(0);actors[0].haste10=.5;actors[0].hasteTime10=5;const result=advanceHero10(0);assert(result.success);assert.equal(h.lv,1);assert.equal(levelCap10(0),170);assert.equal(h.job,job);assert.equal(JSON.stringify(h.gear),gear);assert.equal(JSON.stringify(h.bonus),bonus);assert.equal(h.points,45);assert(h.skillsKept10);const after=heroCore10(0);assert.equal(after.str,base.str+4);assert.equal(after.int,base.int+4);assert.equal(after.agi,base.agi+4);assert(after.atk>=base.atk);assert.equal(h.growthBank10[0],Math.floor(HEROES[0].growth[0]*149));assert(validateSave(S));
`));
test('五次转职各增加20级一个真实灵台槽并解锁觉醒，第六次拒绝',()=>run(`
 reset10();const h=S.heroes[0];for(let n=1;n<=5;n++){h.lv=levelCap10(0);actors[0].hp=stats(0).hp;const oldCore=heroCore10(0),previous=levelCap10(0);assert(advanceHero10(0).success);assert.equal(h.lv,1);assert.equal(heroCount10(h),n);assert.equal(levelCap10(0),previous+20);assert.equal(h.altar10.length,n);assert.equal(h.awakening10,n);assert.equal(h.elements10.length,Math.min(5,n+1));assert.equal(new Set(h.elements10).size,h.elements10.length);assert(heroCore10(0).str>=oldCore.str);assert(validateSave(S))}h.lv=250;const snap=stateItems10(),gold=S.gold;assert(!advanceHero10(0));assert.equal(stateItems10(),snap);assert.equal(S.gold,gold);assert.equal(levelCap10(0),250);
`));
test('新增等级真正可达，角色转职后已解锁R技能在1级仍可释放',()=>run(`
 reset10();advanceHero10(0);assert.equal(S.heroes[0].lv,1);assert(enterMap(1));const e=enemies.find(e=>e.map===1&&!e.boss);active().x=e.x-50;active().y=e.y;active().mp=100000;assert(skill(0,2,true));S.heroes[0].xp=0;for(let n=0;n<12;n++)awardXp(1e8);assert.equal(S.heroes[0].lv,170);assert.equal(S.heroes[1].lv,150);assert(validateSave(S));
`));
test('灵台每阶只多一个槽，六件装备仍各双孔，镶嵌拆卸影响真实属性',()=>run(`
 reset10();advanceHero10(0);assert.equal(S.heroes[0].altar10.length,1);for(let slot=0;slot<6;slot++)assert.equal(socketCapacity10(0,slot),2);giveGem(0,7,2);const atk=stats(0).atk;assert(socketEquipment9(0,6,0,7,0));assert(stats(0).atk>atk);assert(!socketEquipment9(0,6,0,7,1));assert(unsocketGem(0,0,6));assert.equal(stats(0).atk,atk);assert.equal(gemCount(0,7),2);saveGame(false);begin(readSave());assert.equal(S.heroes[0].altar10.length,1);
`));
test('五阶觉醒有不同实际效果，技能共用冷却并保留旧职业分支',()=>run(`
 reset10();stageHero10(0,5);enterMap(1);const e=enemies.find(e=>e.map===1&&!e.boss);e.hp=e.max=1e9;active().x=e.x-70;active().y=e.y;for(let stage=1;stage<=5;stage++){const h=S.heroes[0],a=active();h.awakening10=stage;h.ascensionCd=0;a.mp=10000;const hp=e.hp;assert(ascensionSkill());assert(e.hp<hp);assert(!ascensionSkill());if(stage===1)assert(a.shield>0);if(stage===2)assert(a.hasteTime10>0);if(stage===3)assert(e.root>0);if(stage===5)assert(a.starPulses10===2)}const job=S.heroes[0].job;assert.equal(job,0);assert(validateSave(S));
`));
test('V9历史轮回超过五次仍保留全部幸运天赋，不允许继续转职',()=>run(`
 begin(fresh('迁移',0));const old=clone10(S);delete old.systems10;old.heroes[0].rebirths9=9;for(const key of ['rebirthCount10','growthBank10','attackBank10','talents10','innateLuck10','skillsKept10','elements10','altar10','awakening10'])delete old.heroes[0][key];begin(old);assert.equal(heroCount10(S.heroes[0]),5);assert.equal(S.heroes[0].rebirths9,9);assert.equal(stats(0).innateLuck9,27);assert.equal(S.heroes[0].altar10.length,5);const snapshot=JSON.stringify(S.heroes[0]);for(let n=0;n<3;n++){saveGame(false);begin(readSave())}assert.equal(JSON.stringify(S.heroes[0]),snapshot);assert(!advanceHero10(0));assert(validateSave(S));
`));
test('存档拒绝重复装备、非法槽位、负数金币、超过五阶和伪造玩家ID',()=>run(`
 reset10();const item=makeItem10();S.bag.push(item);assert(validateSave(S));let bad=clone10(S);bad.pendingGear10.push(clone10(item));assert(!validateSave(bad));bad=clone10(S);bad.heroes[0].rebirthCount10=6;assert(!validateSave(bad));bad=clone10(S);bad.heroes[0].uid10='other';assert(!validateSave(bad));bad=clone10(S);bad.heroes[0].altar10=[{type:0,level:11}];assert(!validateSave(bad));bad=clone10(S);bad.goldReserve10=-1;assert(!validateSave(bad));bad=clone10(S);bad.heroes[0].growthBank10=[Infinity,0,0];assert(!validateSave(bad));
`));
test('融合和转职重复请求在保存恢复后仍不会重复扣费发奖，旧预览过期安全拒绝',()=>run(`
 reset10();giveGem(0,2,4);const mats=[{type:0,level:2},{type:0,level:2}],request=quote10();assert(fuseGems10(mats,()=>0,request).success);const snap=stateItems10();assert(!fuseGems10(mats,()=>0,request));assert.equal(stateItems10(),snap);saveGame(false);begin(readSave());assert(!fuseGems10(mats,()=>0,request));const stale=quote10();lockEquipment10(S.heroes[0].gear[0].id);assert(!fuseGems10(mats,()=>0,stale));const advanceQuote=quote10();const result=advanceHero10(0,advanceQuote);assert(result.success);const gold=S.gold;assert(!advanceHero10(0,advanceQuote));assert.equal(S.gold,gold);
`));
test('所有新核心界面可操作、切换角色，暂停不会推进怪物计时',()=>run(`
 reset10();addPet(0,false,2);addPet(1,false,2);giveGem(0,3,3);for(const fn of [petFusionPanel10,gemForgePanel10,inventoryPanel10,socketStudio9,advancePanel10,branchPanel10,smithPanel10]){fn();assert(switchPanelHero(1));assert.equal(S.active,1);const t=S.played;update(.3);assert.equal(S.played,t);switchPanelHero(0)}gemForgePanel10('recipes');assert($('#forgeBody10').innerHTML.includes('五曜初星'));gemForgePanel10('buy');assert($('#forgeBody10').innerHTML.includes('基础宝石'));inventoryPanel10();assert($('#dialog').innerHTML.includes('/999'));closeDialog();
`));
test('镶嵌界面能预览确认并产生成功动画，具体孔位与等级对比正确',()=>run(`
 reset10();giveGem(0,4,2);socketState9={gear:0,hole:1,gem:'0:4'};socketStudio9();$('#socketPreview10').click();assert($('#dialog').innerHTML.includes('镶嵌后'));assert.equal(gemCount(0,4),2);$('#socketDo10').click();assert.equal(gemCount(0,4),1);assert.equal(S.heroes[0].gear[0].sockets[1].level,4);assert($('#dialog').innerHTML.includes('socket-burst9'));assert(validateSave(S));closeDialog();
`));
test('安全随机源提供范围正确的随机数，事务异常回滚不遗留资源变动',()=>run(`
 reset10();for(let n=0;n<100;n++){const x=cryptoRoll10();assert(x>=0&&x<1)}const before=stateItems10();assert(!transaction10('throw-test',quote10(),()=>{S.gold-=100;S.bag.push(makeItem10());throw Error('模拟失败')}));assert.equal(stateItems10(),before);assert(!busy10);
`));
test('过期标签页不能提交物资操作或覆盖磁盘上的最新存档',()=>run(`
 reset10();giveGem(0,2,4);saveGame(false);const oldTab=clone10(S),mats=[{type:0,level:2},{type:0,level:2}];assert(fuseGems10(mats,()=>0).success);const latest=localStorage.getItem(SAVE_KEY);S=oldTab;const before=stateItems10();assert(!fuseGems10(mats,()=>0));assert(staleSave10);assert.equal(stateItems10(),before);saveGame(false);assert.equal(localStorage.getItem(SAVE_KEY),latest);begin(readSave());assert(!staleSave10);assert.equal(gemCount(0,3),1);assert(validateSave(S));
`));
test('固定种子实际融合模拟：灵宠10000次与宝石10000次符合预览概率',()=>run(`
 reset10();const refreshKeep10=refreshBars,saveKeep10=saveGame,logKeep10=logMessage,guardKeep10=diskMatches10;diskMatches10=()=>true;refreshBars=()=>{};saveGame=()=>invalidateLuck10();logMessage=()=>{};const random=seeded10(38291);let petWins=0,gemWins=0,petExpected=0,gemExpected=0;for(let n=0;n<10000;n++){S.gold=50000000;S.pets=[];S.petPity10={};const a=addPet(0,false,4),b=addPet(1,false,4);const p=petFusionPreview10(a,b);petExpected=p.success;const out=fusePets(a.id,b.id,random);assert(out);if(out.success)petWins++}for(let n=0;n<10000;n++){S.gold=50000000;S.gems=[];S.gemPity10={};giveGem(0,8,2);const mats=[{type:0,level:8},{type:0,level:8}],p=gemFusionPreview10(mats);gemExpected=p.success;const out=fuseGems10(mats,random);assert(out);if(out.success)gemWins++}assert(Math.abs(petWins/10000-petExpected)<.02);assert(Math.abs(gemWins/10000-gemExpected)<.02);console.log('SIMULATION',JSON.stringify({petTrials:10000,petExpected,petObserved:petWins/10000,gemTrials:10000,gemExpected,gemObserved:gemWins/10000}));refreshBars=refreshKeep10;saveGame=saveKeep10;logMessage=logKeep10;diskMatches10=guardKeep10;
`,180000));
