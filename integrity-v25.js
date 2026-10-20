'use strict';
// The base validator and diagnostics use one definition of the save contract.
// Invalid unknown fields are rejected; only proven overflow bugs are repairable.
const RESOURCE_LIMITS25=Object.freeze({gold:1e9,reserve:1e12,potions:100000,xp:1e8});
function baseIssues25(v){
 const out=[],bad=(path,value,expected)=>{if(out.length<20)out.push({path,value,expected})},num=(n,a,b)=>typeof n==='number'&&Number.isFinite(n)&&n>=a&&n<=b;
 if(!v||typeof v!=='object'){bad('存档',v,'完整对象');return out}
 if(![1,2].includes(v.version))bad('version',v.version,'1或2');
 if(typeof v.name!=='string'||v.name.length>24)bad('name',v.name,'不超过24字');
 if(!Number.isInteger(v.active)||!num(v.active,0,4))bad('active',v.active,'0至4的整数');
 for(const [key,min,max]of [['gold',0,1e9],['potions',0,1e5],['chapter',0,4],['nextItem',1,1e9],['totalKills',0,1e8],['death',0,1e7],['played',0,1e10]])if(!num(v[key],min,max)||key==='chapter'&&!Number.isInteger(v[key]))bad(key,v[key],min+'至'+max);
 for(const key of ['heroes','bosses','kills'])if(!Array.isArray(v[key])||v[key].length!==5)bad(key,v[key]?.length,'长度为5');
 if(!Array.isArray(v.chests)||v.chests.some(n=>!Number.isInteger(n)||!num(n,0,4)))bad('chests',v.chests,'0至4的宝箱编号');
 if(v.bosses?.some?.(b=>typeof b!=='boolean'))bad('bosses',v.bosses,'布尔列表');
 if(v.kills?.some?.(n=>!num(n,0,1e8)))bad('kills',v.kills,'每项0至100000000');
 const checkItem=(it,path,nullable=false)=>{if(nullable&&it===null)return;if(!it||typeof it!=='object'){bad(path,it,'装备对象');return}for(const [key,min,max]of [['id',1,1e9],['slot',0,v.version===1?2:5],['tier',0,3],['power',1,10000]])if(!num(it[key],min,max)||key!=='power'&&!Number.isInteger(it[key]))bad(path+'.'+key,it[key],min+'至'+max)};
 if(!Array.isArray(v.pets)||v.pets.length>1000)bad('pets',v.pets?.length,'最多1000只');
 else{const ids=new Set();v.pets.forEach((p,i)=>{const path='pets['+i+']';if(!p){bad(path,p,'灵宠对象');return}for(const [key,min,max]of [['type',0,PETS.length-1],['lv',1,150],['xp',0,1e8]])if(!num(p[key],min,max)||key!=='xp'&&!Number.isInteger(p[key]))bad(path+'.'+key,p[key],min+'至'+max);if(!Number.isInteger(p.id)||ids.has(p.id))bad(path+'.id',p.id,'不重复的整数');ids.add(p.id)})}
 if(Array.isArray(v.heroes)){const assigned=new Set();v.heroes.forEach((h,i)=>{const path='heroes['+i+']';if(!h){bad(path,h,'角色对象');return}if(typeof h.unlocked!=='boolean')bad(path+'.unlocked',h.unlocked,'布尔值');for(const[key,min,max]of [['lv',1,250],['xp',0,1e8],['points',0,1e8]])if(!num(h[key],min,max)||key==='lv'&&!Number.isInteger(h[key]))bad(path+'.'+key,h[key],min+'至'+max);if(!Array.isArray(h.bonus)||h.bonus.length!==3||h.bonus.some(n=>!Number.isInteger(n)||!num(n,0,1e6)))bad(path+'.bonus',h.bonus,'3个0至1000000的整数');if(!Array.isArray(h.gear)||h.gear.length!==(v.version===1?3:6))bad(path+'.gear',h.gear?.length,'正确数量的装备槽');else h.gear.forEach((it,k)=>{checkItem(it,path+'.gear['+k+']',true);if(it&&it.slot!==k)bad(path+'.gear['+k+'].slot',it.slot,'与槽位'+k+'一致')});if(h.pet!==null){if(!v.pets?.some?.(p=>p?.id===h.pet)||assigned.has(h.pet))bad(path+'.pet',h.pet,'存在且未重复分配的灵宠');assigned.add(h.pet)}});if(!v.heroes[v.active]?.unlocked)bad('active',v.active,'已解封的英雄')}
 if(!Array.isArray(v.bag)||v.bag.length>999)bad('bag',v.bag?.length,'最多999件装备');else v.bag.forEach((it,i)=>checkItem(it,'bag['+i+']'));
 if(!v.position||!num(v.position.x,0,WW)||!num(v.position.y,0,WH))bad('position',JSON.stringify(v.position),'世界范围内的坐标');
 if(Array.isArray(v.bosses)&&v.bosses.slice(0,v.chapter).some(b=>b!==true))bad('chapter',v.chapter,'前置守护者已完成');
 if(typeof v.won!=='boolean'||v.won&&v.bosses?.some?.(b=>b!==true))bad('won',v.won,'与五位守护者战绩一致');
 return out;
}
function grantGold25(amount){
 if(!S||!finite10(amount,0,1e15))return false;amount=Math.floor(amount);const cash=Math.min(amount,Math.max(0,RESOURCE_LIMITS25.gold-S.gold));S.gold+=cash;
 S.goldReserve10=Math.min(RESOURCE_LIMITS25.reserve,(S.goldReserve10||0)+amount-cash);return true;
}
function grantPotions25(amount){
 if(!S||!int10(amount,0,1e9))return false;const kept=Math.min(amount,Math.max(0,RESOURCE_LIMITS25.potions-S.potions)),excess=amount-kept;S.potions+=kept;
 if(excess){grantGold25(excess*5);logMessage('恢复药剂已满：溢出 '+excess+' 瓶折为 '+excess*5+' 金币（钱包满时进入金币储备）。')}return true;
}
function grantKillMaterials25(e){if(!e?.dead||e.noRewards||e.materialDropped17)return;e.materialDropped17=true;const rank=e.rank8??e.rank??(e.boss?2:0);if(e.boss||rank>=2){S.materials17.embers=Math.min(1e8,S.materials17.embers+3);if(currentMap()>=6)S.materials17.cores=Math.min(1e8,S.materials17.cores+1)}else if(rank>=1||Math.random()<.05)S.materials17.embers=Math.min(1e8,S.materials17.embers+1)}
function repairOverflows25(v){
 const changes=[];if(!v||typeof v!=='object')return changes;
 const fix=(o,key,cap,path)=>{if(typeof o?.[key]==='number'&&Number.isFinite(o[key])&&o[key]>cap){changes.push({path,from:o[key],to:cap});o[key]=cap}};
 const oldPotions=v.potions,oldGold=v.gold;fix(v,'potions',1e5,'potions');fix(v,'gold',1e9,'gold');
 const compensation=(Number.isFinite(oldPotions)&&oldPotions>1e5?(oldPotions-1e5)*5:0)+(Number.isFinite(oldGold)&&oldGold>1e9?oldGold-1e9:0);
 if(compensation&&finite10(v.goldReserve10,0,1e12))v.goldReserve10=Math.min(1e12,v.goldReserve10+compensation);
 fix(v,'goldReserve10',1e12,'goldReserve10');
 // Experience must not grow without bound once a hero or pet has reached its cap.
 for(const [i,h]of (Array.isArray(v.heroes)?v.heroes:[]).entries())if(h?.lv===150+20*(h.rebirthCount10||0))fix(h,'xp',Math.min(1e8,needXp(h.lv)-1),'heroes['+i+'].xp');
 for(const [i,p]of (Array.isArray(v.pets)?v.pets:[]).entries())if(p?.lv===150)fix(p,'xp',petNeed(150)-1,'pets['+i+'].xp');
 return changes;
}
function backupRepair25(key,before){const raw=JSON.stringify(before),backup=key+':before-integrity25';localStorage.setItem(backup,raw);if(localStorage.getItem(backup)!==raw)throw Error('修复前备份回读失败')}
function prepareImport25(original){const copy=clone10(original),changes=repairOverflows25(copy),candidate=migrate23(copy);if(!validateSave(candidate))throw Error('存档校验失败：'+validationPath22(candidate));if(changes.length)backupRepair25('wuxing-import25',original);return candidate}
function ensureIntegrity25(kind){
 if(!S)return true;const candidate=clone10(S),changes=repairOverflows25(candidate);if(!changes.length)return true;
 if(!validateSave(candidate))return true; // Never conceal an unrelated invalid field.
 try{backupRepair25(SAVE_KEY,S);repairOverflows25(S);diagnostics22.unshift({at:Date.now(),code:'repaired25',kind,revision:S.revision10,detail:changes.map(c=>c.path+':'+c.from+'→'+c.to).join('；')});diagnostics22.length=Math.min(40,diagnostics22.length);logMessage('已修复历史资源越界并保留修复前副本；溢出药剂已折为金币储备。');return true}catch(e){return error22(storageCode22(e),kind,'修复前备份无法保存：'+e.message)}
}
const atomicBefore25=atomicOperation22;atomicOperation22=function(kind,...args){if(S&&owns24()&&!paused24){if(!ensureIntegrity25(kind))return false;if(!validateSave(S)){error22('validation',kind,validationPath22(S));logMessage(operationMessage22());return false}}return atomicBefore25(kind,...args)};
const persistBefore25=persistSave22;persistSave22=function(...args){if(S&&owns24()&&!ensureIntegrity25('save25'))return false;return persistBefore25(...args)};
const migrateBefore25=migrate23;migrate23=function(data,...args){const copy=clone10(data);repairOverflows25(copy);return migrateBefore25(copy,...args)};
const readBefore25=readSave;readSave=function(){
 const keys=[SAVE_KEY,...Array.from({length:9},(_,n)=>'wuxing-chronicles-v'+(24-n))];
 for(const suffix of ['',':backup22'])for(const key of [...new Set(keys)])try{const raw=localStorage.getItem(key+suffix);if(!raw)continue;const original=JSON.parse(raw),candidate=clone10(original),changes=repairOverflows25(candidate);if(!changes.length){if(validateSave(candidate)){loadedSaves23.add(candidate);return candidate}continue}const fixed=migrate23(candidate);if(!validateSave(fixed))continue;backupRepair25(key,original);loadedSaves23.add(fixed);return fixed}catch{}
 return readBefore25();
};

// Reentrant menu/code helpers may request a save while their transaction is still
// mutating. Only the outer transaction's final validated commit may write.
const saveBefore25=saveGame;saveGame=function(...args){if(busy10&&!transactionWriting25)return true;return saveBefore25(...args)};
