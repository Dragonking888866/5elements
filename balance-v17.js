'use strict';
// V17: quality and level are independent. Original species/item IDs remain stable.
const RULES17={version:1,gemQualityPower:[1,1.08,1.18,1.3,1.45,1.65,1.9],quality:[['普通','#b4b9c4',1],['精品','#62d699',1.18],['稀有','#579fff',1.9],['史诗','#bd83ff',2.3],['传说','#ffad4c',2.55],['神话','#ff626e',3.5],['极其稀有','#ffe27b',5]],
 furnace:{maxLevel:11,base:[0,0,1,.95,.88,.76,.60,.45,.32,.22,.14,.08],gapPenalty:.65,energyGold:180,energyIron:.015,maxBatch:10000,chunk:5},
 divine:{type:23,level:11,quality:6,base:.05,cap:.15,floor:.70,gemThreshold:8,petThreshold:4,gold:2000000,iron:500,embers:20,cores:2,cooldown:15000,radius:360,atk:50000,hp:350000,mp:50000,spell:60000,armor:2500,luck:1000,leech:.10},
 temper:{rates:[.95,.85,.70,.50,.30,.15],gold:[300,1500,6500,30000,150000,900000],iron:[3,12,40,120,400,1500]},enchant:{cap:10,gold:400,growth:1.75,iron:3},
 recipes:[{id:'flame-metal',name:'焰锋双曜',types:[0,3,6],result:18,minLevel:2,stage:0,gold:500},{id:'forest-tide',name:'森海回响',types:[1,2,3],result:19,minLevel:2,stage:0,gold:500},{id:'mountain-frost',name:'镇岳玄晶',types:[3,1,6],result:20,minLevel:3,stage:0,gold:800},{id:'five-star',name:'五曜初星',types:[18,19,20],result:21,minLevel:6,stage:1,gold:18000,probability:.18},{id:'primordial',name:'太初觉醒',types:[21,12,17],result:22,minLevel:10,stage:3,gold:180000,probability:.08}]
};
const oldGemQuality17=gemQuality8;
QUALITIES8.splice(0,7,...RULES17.quality.map(q=>q.slice()));
GEMS.push({name:'五行神石',color:'#ffe891',element:0,elements10:[0,1,2,3,4],category10:'神石',unit:100});
function gemQuality17(g){return int10(g?.quality,0,6)?g.quality:0}
function gemKey17(g){return g.type+':'+g.level+':'+gemQuality17(g)}
gemKey10=gemKey17;
function parseGem17(key){const [type,level,quality]=String(key).split(':').map(Number);return {type,level,quality:quality??0}}
parseGem10=parseGem17;
function gemProtected17(g){return !!(g?.locked10||g?.favorite10||g?.bound10||g?.type===23)}
const oldGemValid17=gemValid;
gemValid=g=>oldGemValid17(g)&&(g.quality===undefined||int10(g.quality,0,6))&&(g.type!==23||g.level===11&&g.quality===6&&g.divine17===true);
gemName=g=>gemValid(g)?GEMS[g.type].name+' · Lv.'+g.level+' · '+QUALITIES8[gemQuality17(g)][0]:'未知宝石';
gemQuality8=()=>0; // Never infer new quality from a level.
function migrate17(data){const v=clone10(data);if(v.systems17!==1){const remap=q=>q===2?3:q===3?2:q,gem=g=>{if(g){g.quality=remap(g.quality??oldGemQuality17(g.level));g.locked10??=false;g.favorite10??=false}return g};
 for(const it of [...(v.bag||[]),...(v.pendingGear10||[]),...v.heroes.flatMap(h=>h.gear.filter(Boolean))]){it.quality=remap(quality8(it));(it.sockets||[]).forEach(gem)}
 for(const p of v.pets||[])p.quality=remap(quality8(p));(v.gems||[]).forEach(gem);v.heroes.forEach(h=>(h.altar10||[]).forEach(gem));v.systems17=1;}
 v.materials17??={embers:0,cores:0};v.divineForge17??={attempts:0,readyAt:0};v.stock17??={day:0,bought:{}};v.batch17??=null;if(v.batch17?.status==='running'){v.batch17.status='paused';v.batch17.reason='重新载入后已暂停，已结算结果保留'}return v;
}
const validateBefore17=validateSave;
validateSave=function(v){if(!validateBefore17(v))return false;if(v.systems17===undefined)return true;if(v.branchStorage17!==undefined&&(typeof v.branchStorage17!=='string'||!/^wuxing-codes-v(?:1[789]|2[0123456789]|30):/.test(v.branchStorage17)||v.branchStorage17.length>250))return false;if(v.systems17!==1||!v.materials17||!int10(v.materials17.embers,0,1e8)||!int10(v.materials17.cores,0,1e8)||!v.divineForge17||!int10(v.divineForge17.attempts,0,1e6)||!finite10(v.divineForge17.readyAt,0,1e14))return false;
 const gems=[...(v.gems||[]),...v.heroes.flatMap(h=>[...(h.altar10||[]),...h.gear.filter(Boolean).flatMap(it=>it.sockets||[])]).filter(Boolean)];if(gems.some(g=>!int10(g.quality,0,6)||['locked10','favorite10','bound10'].some(k=>g[k]!==undefined&&typeof g[k]!=='boolean')))return false;
 if([...v.bag,...(v.pendingGear10||[]),...v.heroes.flatMap(h=>h.gear.filter(Boolean))].some(it=>it.enchant17!==undefined&&(!Array.isArray(it.enchant17)||it.enchant17.length!==5||it.enchant17.some(n=>!int10(n,0,RULES17.enchant.cap))||it.enchant17.reduce((a,b)=>a+b,0)>20)))return false;
 if(v.batch17!==null&&v.batch17!==undefined){const b=v.batch17;if(!['running','paused'].includes(b.status)||!batchConfigValid17(b.config)||!int10(b.attempts,0,b.config.count)||!int10(b.successes,0,b.attempts)||!int10(b.failures,0,b.attempts)||b.successes+b.failures!==b.attempts||!int10(b.gold,0,1e12)||!int10(b.iron,0,1e12)||b.world!==v.worldId10||!int10(b.hero,0,4)||!b.results||typeof b.results!=='object'||Array.isArray(b.results)||Object.entries(b.results).some(([k,n])=>k.length>180||!int10(n,1,10000)))return false;}
 return !!v.stock17&&int10(v.stock17.day,0,1e8)&&v.stock17.bought&&typeof v.stock17.bought==='object'&&!Array.isArray(v.stock17.bought)&&Object.values(v.stock17.bought).every(n=>int10(n,0,10000));
};
const beginBefore17=begin;begin=function(data){return beginBefore17(migrate17(data))};
const freshBefore17=fresh;fresh=function(...args){return migrate17(freshBefore17(...args))};
function advancedMarket17(){return !!S&&S.chapter>=4&&S.heroes.every(h=>h.unlocked)&&S.bosses.slice(0,4).every(Boolean)}
function resourceFree17(){return typeof freeCodes16==='function'&&freeCodes16()||typeof freeLab15==='function'&&freeLab15()}
function canPay17(c){return resourceFree17()||S.gold+(S.goldReserve10||0)>=c.gold&&(S.ingots||0)>=(c.iron||0)&&S.materials17.embers>=(c.embers||0)&&S.materials17.cores>=(c.cores||0)}
function pay17(c){if(!canPay17(c))return false;if(resourceFree17())return true;if(!spendGold10(c.gold))return false;S.ingots-=c.iron||0;S.materials17.embers-=c.embers||0;S.materials17.cores-=c.cores||0;return true}
function priceText17(c){return `${c.gold.toLocaleString()} 金币 / ${c.iron||0} 灵铁 / ${c.embers||0} 灵焰 / ${c.cores||0} 星核`}
// V17 operations additionally verify persistence; failed writes roll back the whole receipt.
function commit17(kind,request,operation){return transaction10(kind,request,operation)}

for(const p of PETS)if(p.minQuality===2)p.minQuality=3;else if(p.minQuality===3)p.minQuality=2;

