'use strict';

// Inventory stacks and equipment sockets remain the only ownership records.
// A range assigns a stable ID to every unit without expanding 9,999-unit stacks.
// [batch UUID, first ordinal, last ordinal, locked, favorite]
function gemId26(r,n=r[1]){return r[0]+'@'+n}
function gemRangeCount26(r){return r[2]-r[1]+1}
function newGemRange26(count,locked=false,favorite=false){const batch=crypto.randomUUID?crypto.randomUUID():'g'+Array.from(crypto.getRandomValues(new Uint32Array(4)),n=>n.toString(16).padStart(8,'0')).join('');return [batch,0,count-1,!!locked,!!favorite]}
function gemProto26(g){const out={...g};for(const k of ['count','ranges26','asset26','move26'])delete out[k];return out}
function refreshGemFlags26(g){g.count=g.ranges26.reduce((n,r)=>n+gemRangeCount26(r),0);g.locked10=g.ranges26.every(r=>r[3]);g.favorite10=g.ranges26.every(r=>r[4]);return g}
function storedSlots26(v=S){return [...(v.bag||[]).map(item=>({item,hero:-1,place:'装备库'})),...(v.pendingGear10||[]).map(item=>({item,hero:-1,place:'待领取'})),...v.heroes.flatMap((h,hero)=>h.gear.filter(Boolean).map(item=>({item,hero,place:HEROES[hero].name}))),...v.heroes.map((h,hero)=>({item:{id:'altar-'+hero,slot:6,sockets:h.altar10||[]},hero,place:HEROES[hero].name}))].flatMap(p=>(p.item.sockets||[]).map((gem,hole)=>gem?{...p,gem,hole}:null).filter(Boolean))}
function migrateAssets26(v){
 if(v.assetsSchema26===1)return v;
 v.gems??=[{...nativeGem21(0,0),count:1},{...nativeGem21(3,0),count:1}];
 for(const g of v.gems||[]){g.ranges26=[newGemRange26(g.count,g.locked10,g.favorite10)];delete g.asset26;}
 for(const {gem} of storedSlots26(v)){gem.asset26=gemId26(newGemRange26(1));delete gem.ranges26;delete gem.count;}
 v.assetsSchema26=1;return v;
}
const migrateBeforeAssets26=migrate23;migrate23=function(...args){return migrateAssets26(migrateBeforeAssets26(...args))};
function assetIssues26(v){
 if(!v||typeof v!=='object')return ['资产主体不存在'];
 if(v.assetsSchema26===undefined)return [];
 if(v.assetsSchema26!==1)return ['资产版本不正确'];if(!Array.isArray(v.gems)||!Array.isArray(v.bag)||!Array.isArray(v.pendingGear10)||!Array.isArray(v.heroes)||v.heroes.some(h=>!h||!Array.isArray(h.gear)||!Array.isArray(h.altar10)))return ['资产列表结构无效'];
 const spans=new Map(),issues=[];
 const add=(r,where)=>{if(!Array.isArray(r)||r.length!==5||typeof r[0]!=='string'||!/^[\w-]{8,80}$/.test(r[0])||!int10(r[1],0,1e9)||!int10(r[2],r[1],1e9)||typeof r[3]!=='boolean'||typeof r[4]!=='boolean'){issues.push(where+' 身份区间无效');return}const list=spans.get(r[0])||[];list.push([r[1],r[2],where]);spans.set(r[0],list)};
 for(const g of v.gems||[]){if(!g||!Array.isArray(g.ranges26)||!g.ranges26.length||g.ranges26.length>20000||g.asset26!==undefined){issues.push('可用宝石身份缺失');continue}for(const r of g.ranges26)add(r,'库存 '+gemKey17(g));if(g.ranges26.every(r=>Array.isArray(r)&&r.length===5)&&g.ranges26.reduce((n,r)=>n+gemRangeCount26(r),0)!==g.count)issues.push('库存数量与身份数量不一致');}
 for(const p of storedSlots26(v)){const m=String(p.gem.asset26||'').match(/^([\w-]{8,80})@(\d{1,10})$/);if(!m||p.gem.ranges26!==undefined||p.gem.count!==undefined){issues.push('槽位身份缺失 '+p.item.id+':'+p.hole);continue}add([m[1],+m[2],+m[2],!!p.gem.locked10,!!p.gem.favorite10],'装备 '+p.item.id+' 第'+(p.hole+1)+'孔');}
 for(const list of spans.values()){list.sort((a,b)=>a[0]-b[0]);for(let i=1;i<list.length;i++)if(list[i][0]<=list[i-1][1])issues.push('宝石身份重复：'+list[i-1][2]+' / '+list[i][2]);}
 return issues;
}
const validateBeforeAssets26=validateSave;validateSave=function(v){return validateBeforeAssets26(v)&&assetIssues26(v).length===0};
const validationBeforeAssets26=validationPath22;validationPath22=function(v){const issues=assetIssues26(v);return issues.length?'宝石资产关联：'+issues.slice(0,2).join('；'):validationBeforeAssets26(v)};

function rangeForId26(g,id){return g?.ranges26?.find(r=>id.startsWith(r[0]+'@')&&int10(+id.split('@')[1],r[1],r[2]))}
function availableCount26(g,forSocket=false){if(!g||g.locked10||g.favorite10)return 0;if(!forSocket&&g.bound10||!forSocket&&g.type===23)return 0;return (g.ranges26||[]).reduce((n,r)=>n+(!r[3]&&!r[4]?gemRangeCount26(r):0),0)}
function firstAvailableId26(g,forSocket=false){if(!availableCount26(g,forSocket))return null;return gemId26(g.ranges26.find(r=>!r[3]&&!r[4]))}
function removeRangeUnit26(row,id){const r=rangeForId26(row,id);if(!r)return false;const n=+id.split('@')[1],i=row.ranges26.indexOf(r),parts=[];if(n>r[1])parts.push([r[0],r[1],n-1,r[3],r[4]]);if(n<r[2])parts.push([r[0],n+1,r[2],r[3],r[4]]);row.ranges26.splice(i,1,...parts);return true}
function mergeRanges26(row){row.ranges26.sort((a,b)=>a[0].localeCompare(b[0])||a[1]-b[1]);const out=[];for(const r of row.ranges26){const prev=out[out.length-1];if(prev&&prev[0]===r[0]&&prev[2]+1===r[1]&&prev[3]===r[3]&&prev[4]===r[4])prev[2]=r[2];else out.push(r.slice())}row.ranges26=out;return refreshGemFlags26(row)}
forgeInventory7=function(changes){
 if(!Array.isArray(changes)||!S)return null;
 const bag=gemBag().map(g=>({...g,ranges26:(g.ranges26||[]).map(r=>r.slice())}));
 for(const change of changes){
  if(!gemValid(change)||!int10(Math.abs(change.count),0,9999))return null;
  const candidates=bag.filter(g=>g.type===change.type&&g.level===change.level&&(change.quality===undefined||g.quality===change.quality)&&((change.heritage21||0)===(g.heritage21||0))).sort(compareGems9);
  let row=change.quality===undefined?candidates.find(g=>availableCount26(g)>=-change.count):bag.find(g=>gemKey17(g)===gemKey17(change));
  if(!change.count)continue;
  if(change.count<0){
   if(!row)return null;
   if(change.move26){if(change.count!==-1)return null;const range=rangeForId26(row,change.move26);if(!range||range[3]||range[4])return null;if(!removeRangeUnit26(row,change.move26))return null;}
   else{if(availableCount26(row)<-change.count)return null;let left=-change.count;for(const r of row.ranges26){if(r[3]||r[4])continue;const n=Math.min(left,gemRangeCount26(r));r[1]+=n;left-=n;if(!left)break;}row.ranges26=row.ranges26.filter(r=>r[1]<=r[2]);}
  }else{
   if(!row){row={...gemProto26(change),quality:change.quality??0,count:0,ranges26:[]};bag.push(row)}
   if(change.asset26){const m=String(change.asset26).match(/^([\w-]{8,80})@(\d{1,10})$/);if(change.count!==1||!m)return null;row.ranges26.push([m[1],+m[2],+m[2],!!change.locked10,!!change.favorite10]);}
   else row.ranges26.push(newGemRange26(change.count,change.locked10,change.favorite10));
  }
  mergeRanges26(row);if(!int10(row.count,0,9999))return null;
 }
 const next=bag.filter(g=>g.count>0);return next.length<=RULES10.gem.bagStacks?next:null;
};
usableGem17=function(g){const row=gemBag().find(x=>gemKey17(x)===gemKey17(g));return row?availableCount26(row):resourceFree17()&&g.type!==23&&!gemProtected17(g)?9999:0};
batchCandidate17=function(c){return gemBag().filter(g=>g.type!==23&&availableCount26(g)>=3+c.reserve&&g.quality+1<c.target&&g.quality+1>=c.min&&g.quality+1<=c.max&&(c.type<0||g.type===c.type)&&(c.element<0||gemElements10(g).includes(c.element))&&(c.quality<0||g.quality===c.quality)).sort((a,b)=>a.quality-b.quality||a.type-b.type)[0]};
function gemAssets26(v=S){
 const owner=v.worldId10,rows=(v.gems||[]).flatMap(g=>(g.ranges26||[]).map(r=>({id:gemId26(r),gem:g,count:gemRangeCount26(r),state:'AVAILABLE',owner,hero:-1,item:null,hole:null,available:!r[3]&&!r[4]?gemRangeCount26(r):0,locked:r[3]?gemRangeCount26(r):0,favorite:r[4]?gemRangeCount26(r):0})));
 return rows.concat(storedSlots26(v).map(p=>({id:p.gem.asset26,gem:p.gem,count:1,state:'SOCKETED',owner,hero:p.hero,item:p.item,hole:p.hole,place:p.place,available:0,locked:p.gem.locked10?1:0,favorite:p.gem.favorite10?1:0})));
}
function gemTotals26(v=S){return gemAssets26(v).reduce((n,a)=>{n.total+=a.count;if(a.state==='SOCKETED')n.socketed++;else{n.inventory+=a.count;n.available+=a.available;n.reserved+=a.count-a.available;}n.locked+=a.locked;return n},{total:0,inventory:0,available:0,socketed:0,reserved:0,locked:0,stacks:(v.gems||[]).length})}
function locateGem26(id){for(const g of gemBag()){const r=rangeForId26(g,id);if(r)return {id,gem:g,range:r,state:'AVAILABLE'}}const p=storedSlots26().find(p=>p.gem.asset26===id);return p?{...p,id,state:'SOCKETED'}:null}
function lockGemAsset26(id,request,field='locked10'){if(!['locked10','favorite10'].includes(field))return false;return commit17('gem-lock26',request,()=>{const p=locateGem26(id);if(!p)return false;if(p.state==='SOCKETED')p.gem[field]=!p.gem[field];else{const r=p.range,n=+id.split('@')[1],locked=field==='locked10'?!r[3]:r[3],favorite=field==='favorite10'?!r[4]:r[4],batch=r[0];removeRangeUnit26(p.gem,id);p.gem.ranges26.push([batch,n,n,locked,favorite]);mergeRanges26(p.gem);}audit10('gem-lock26','宝石 '+id+' 的保护标记已更新');return true})}
lockGem17=function(key,field='locked10'){if(!['locked10','favorite10'].includes(field))return false;return commit17('gem-protect17',null,()=>{const g=gemBag().find(g=>gemKey17(g)===key);if(!g)return false;const n=field==='locked10'?3:4,value=!g.ranges26.every(r=>r[n]);for(const r of g.ranges26)r[n]=value;mergeRanges26(g);return true})};
function socketAsset26(hero,gear,hole,id,request,itemId){return commit17('socket',request,()=>{
 if(!int10(hero,0,4)||!owned(hero)||!int10(gear,0,6)||!int10(hole,0,socketCapacity10(hero,gear)-1))return false;
 const p=locateGem26(id),item=socketItem10(hero,gear);if(p?.state!=='AVAILABLE'||p.range[3]||p.range[4]||!item||itemId!==undefined&&item.id!==itemId)return false;
 const previous=item.sockets?.[hole];if(previous?.locked10||previous?.favorite10)return error22('condition','socket','原槽宝石已锁定，请先解锁再替换。');
 const gem={...gemProto26(p.gem),locked10:p.range[3],favorite10:p.range[4],asset26:id},next=forgeInventory7([{...p.gem,count:-1,move26:id},...(previous?[{...previous,count:1}]:[])]);if(!next)return false;
 if(gear===6)S.heroes[hero].altar10[hole]=gem;else{item.sockets??=[null,null];item.sockets[hole]=gem}S.gems=next;audit10('socket',HEROES[hero].name+' · '+(gear===6?'觉醒灵台':itemName(item))+' 第'+(hole+1)+'孔：'+gemName(gem)+' #'+id+(previous?'；旧石原身份返还':''));return {success:true,gem:clone10(gem),item:item.id,hole,hero};
})}
socketEquipment9=function(hero,gear,type,level,hole,request,quality,heritage21){const row=gemBag().filter(g=>g.type===type&&g.level===level&&(quality===undefined||g.quality===quality)&&(heritage21===undefined||(g.heritage21||0)===heritage21)&&availableCount26(g,true)>0).sort(compareGems9)[0];if(!row)return false;const r=socketAsset26(hero,gear,hole,firstAvailableId26(row,true),request);if(r)reconcileGemVitals21(hero);return r};
socketGem=(hero,type,level,hole,gear=0,request,quality)=>socketEquipment9(hero,gear,type,level,hole,request,quality);
unsocketGem=function(hero,hole,gear=0,request,expectedId){const r=commit17('unsocket',request,()=>{if(!int10(hero,0,4)||!owned(hero)||!int10(gear,0,6)||!int10(hole,0,socketCapacity10(hero,gear)-1))return false;const item=socketItem10(hero,gear),gem=item?.sockets?.[hole];if(!gem||expectedId!==undefined&&gem.asset26!==expectedId)return false;const next=forgeInventory7([{...gem,count:1}]);if(!next)return error22('condition','unsocket','可用库存已满，请先整理；槽位宝石完整保留。');if(gear===6)S.heroes[hero].altar10[hole]=null;else item.sockets[hole]=null;S.gems=next;audit10('unsocket','拆卸费用0：'+gemName(gem)+' #'+gem.asset26+' 已完整返回库存，锁定标记保留。');return true});if(r)reconcileGemVitals21(hero);return r};
function detachGemAsset26(id,request){const p=locateGem26(id);if(p?.state!=='SOCKETED')return false;if(p.hero>=0)return unsocketGem(p.hero,p.hole,p.item.slot,request,id);return commit17('unsocket-storage26',request,()=>{const current=locateGem26(id);if(current?.state!=='SOCKETED'||current.hero>=0)return false;const next=forgeInventory7([{...current.gem,count:1}]);if(!next)return error22('condition','unsocket-storage26','可用库存已满，原装备槽位完整保留。');current.item.sockets[current.hole]=null;S.gems=next;audit10('unsocket-storage26','从'+current.place+'装备 #'+current.item.id+'免费拆下 '+gemName(current.gem)+' #'+id+'，原身份和保护状态保留。');return true})}

// Existing equipment sell/recycle code returns socket objects through forgeInventory7;
// identity is preserved there, and the final global validator rejects duplicates.
const protectedEquipmentBefore26=protectedEquipment10;protectedEquipment10=function(it,automatic=true){return protectedEquipmentBefore26(it,automatic)||(it.sockets||[]).some(g=>g&&(g.locked10||g.favorite10))};
assignPet=function(id,hero,request){const operation=()=>{const pet=S.pets.find(p=>p.id===id);if(!pet||!int10(hero,-1,4)||hero>=0&&!owned(hero))return false;for(const h of S.heroes)if(h.pet===id)h.pet=null;if(hero>=0)S.heroes[hero].pet=id;for(const a of actors)reconcileGemVitals21(a.i);audit10('mount26',PETS[pet.type].name+(hero<0?'返回灵宠包裹':'由'+HEROES[hero].name+'骑乘'));return true};return busy10?operation():commit17('mount26',request,operation)};
