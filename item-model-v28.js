'use strict';

// Read models resolve the canonical inventory on every inspection. UI prototypes
// are immutable catalog/result snapshots, never a second ownership ledger.
const ITEM_PREVIEWS28=new Map();
const STAT_FIELDS28=[['atk','攻击'],['spell','法术'],['armor','防御'],['hp','生命'],['mp','法力'],['str','力量'],['int','智力'],['agi','敏捷'],['luck','幸运'],['speed','移动速度'],['attackRate','攻速倍率'],['interval','攻击间隔'],['cdr18','技能冷却缩减'],['ultimateTotal21','终极总冷却缩减'],['gemLeech','生命汲取'],['regen10','每秒生命恢复'],['manaRegen18','每秒法力恢复'],['crit','暴击率'],['critDamage18','暴击伤害'],['skillDamage18','技能伤害'],['ultimateDamage18','终极技能伤害'],['elementDamage18','五行伤害'],['elementResist18','五行抗性'],['shieldPower18','护盾强度'],['ward10','额外减伤'],['control18','控制强化'],['aura18','友军攻击光环']];
const PERCENT_FIELDS28=new Set(['cdr18','ultimateTotal21','gemLeech','regen10','manaRegen18','crit','skillDamage18','ultimateDamage18','elementDamage18','elementResist18','shieldPower18','ward10','control18','aura18']);
const number28=n=>Number(n||0).toLocaleString('zh-CN',{maximumFractionDigits:2});
const percent28=n=>number28(n*100)+'%';
const formatStat28=(k,n)=>PERCENT_FIELDS28.has(k)?percent28(n):number28(n)+(k==='interval'?'秒':'');
function prototypeRef28(kind,data){const value=JSON.stringify(data),key='preview:'+kind+':'+value;if(!ITEM_PREVIEWS28.has(key)){ITEM_PREVIEWS28.set(key,{kind,item:clone10(data),preview:true});if(ITEM_PREVIEWS28.size>700)ITEM_PREVIEWS28.delete(ITEM_PREVIEWS28.keys().next().value)}return key}
function itemRef28(kind,item,preview=false){
 if(!item)return '';
 if(!preview&&S){
  if(kind==='equipment'&&equipmentLocation26(item.id))return 'equipment:'+item.id;
  if(kind==='pet'&&S.pets.some(p=>p.id===item.id))return 'pet:'+item.id;
  if(kind==='gem'){if(item.asset26&&locateGem26(item.asset26))return 'gem:'+item.asset26;const row=gemBag().find(g=>gemKey17(g)===gemKey17(item));if(row)return 'gem:'+gemId26(row.ranges26[0]);}
 }
 return prototypeRef28(kind,item);
}
function resolveItem28(ref){
 if(typeof ref!=='string'||!S)return null;
 if(ref.startsWith('preview:'))return ITEM_PREVIEWS28.get(ref)||null;
 const cut=ref.indexOf(':'),kind=ref.slice(0,cut),id=ref.slice(cut+1);
 if(kind==='equipment'){const p=equipmentLocation26(+id);return p?{kind,...p}:null}
 if(kind==='pet'){const item=S.pets.find(p=>p.id===+id);return item?{kind,item,hero:S.heroes.findIndex(h=>h.pet===item.id)}:null}
 if(kind==='gem'){const p=locateGem26(id);return p?{kind,item:p.gem,asset:p,hero:p.hero??-1}:null}
 if(kind==='support'){const definition=RECRUITS18.find(d=>d.id===id),item=S.recruits18.find(p=>p.id===id);return definition?{kind,item:item||{id,lv:1,deployed:false},definition,preview:!item}:null}
 return null;
}
function withGear28(hero,slot,item,fn){const h=S.heroes[hero],previous=h.gear[slot],cache=statWindow11;statWindow11=null;try{h.gear[slot]=item;return fn()}finally{h.gear[slot]=previous;statWindow11=cache}}
function actualStats28(hero){const cache=statWindow11;statWindow11=null;try{return {...stats(hero)}}finally{statWindow11=cache}}
function equipReason28(id,hero=S.active,expectedSlot){
 if(!S||!int10(hero,0,4)||!owned(hero))return '请选择已解救的合法英雄。';
 const all=allEquipment10().filter(it=>it.id===id);if(all.length!==1)return all.length?'装备身份重复，已阻止操作，请保留存档。':'装备已不在本征程。';
 const item=all[0],p=equipmentLocation26(id);
 if(p.hero>=0)return p.hero===hero?'该装备已由当前英雄穿戴。':'该装备正由'+HEROES[p.hero].name+'穿戴，请先卸下。';
 if(!S.bag.includes(item))return '装备仍在待领取区，请先领取。';
 if(!int10(item.slot,0,5)||expectedSlot!==undefined&&item.slot!==expectedSlot)return '装备类型与当前槽位不符。';
 if(S.heroes[hero].lv<(item.requiredLevel10||1))return '需要英雄达到 Lv.'+(item.requiredLevel10||1)+'。';
 // Current gear has no class/element hard gate: its element affects resonance.
 // Explicit restrictions, when present in an imported/authored item, are enforced.
 if(item.allowedHeroes28!==undefined&&(!Array.isArray(item.allowedHeroes28)||!item.allowedHeroes28.includes(hero)))return '此装备不适用于当前英雄职业。';
 if(item.requiredElement28!==undefined&&(!(S.heroes[hero].elements10||[hero]).includes(item.requiredElement28)))return '尚未掌握装备要求的'+(WX.names[item.requiredElement28]||'未知')+'行。';
 if(item.boundHero28!==undefined&&item.boundHero28!==hero)return '装备已绑定其他英雄。';
 if(item.ownerWorld28!==undefined&&item.ownerWorld28!==S.worldId10)return '装备不属于当前征程。';
 return '';
}
function equipmentComparison28(hero,slot,id=null){
 if(!S||!int10(hero,0,4)||!owned(hero)||!int10(slot,0,5))return null;
 const next=id===null?null:S.bag.find(it=>it.id===id);if(id!==null&&(!next||next.slot!==slot))return null;
 const before=actualStats28(hero),beforeSets=setCounts18(hero),old=S.heroes[hero].gear[slot],beforeTeam=S.heroes.map((h,i)=>h.unlocked?actualStats28(i):null);
 return withGear28(hero,slot,next,()=>({hero,slot,current:old,next,before,after:actualStats28(hero),beforeSets,afterSets:setCounts18(hero),team:beforeTeam.flatMap((st,i)=>st&&i!==hero?[{hero:i,before:st,after:actualStats28(i)}]:[])}));
}
function statChanges28(a,b){return STAT_FIELDS28.map(([key,label])=>({key,label,before:a[key]||0,after:b[key]||0,delta:(b[key]||0)-(a[key]||0)}))}
function equipmentBaseRows28(it){const p=it.power,rows=[],add=(label,value,percent=false)=>{if(value)rows.push({label,value:percent?percent28(value):number28(value)})};
 if(it.slot===0){add('基础攻击',p);add('基础攻速增量',p*.0008,true)}if(it.slot===1){add('基础防御',p*.35);add('基础生命',p*6)}if(it.slot===2)add('基础法术',p);if(it.slot===3){add('基础生命',p*4);add('基础法力',p*2)}if(it.slot===4)add('基础防御',p*.5);if(it.slot===5){add('基础移动速度',Math.min(40,p*.8));add('敏捷',Math.floor(p/6));add('基础攻速增量',p*.0005,true)}
 (it.enchant17||[]).forEach((n,el)=>{if(!n)return;if(el===0)add('金锋附魔 · 攻击',n*15);if(el===1){add('木生附魔 · 生命',n*180);add('木生附魔 · 每秒恢复',n*.0005,true)}if(el===2){add('水镜附魔 · 法力',n*60);add('水镜附魔 · 防御',n*2)}if(el===3){add('火曜附魔 · 法术',n*18);add('火曜附魔 · 暴击',n*.003,true)}if(el===4){add('土御附魔 · 生命',n*120);add('土御附魔 · 减伤',n*.002,true)}});
 for(const a of it.affixes18||[])if(AFFIXES18[a.key])add(AFFIXES18[a.key][1],a.value,true);
 return rows;
}
function setInfo28(it,hero){if(it.set18===undefined)return [];const d=SETS27[it.set18],count=setCounts18(hero>=0?hero:S.active)[it.set18],thresholds=it.set18===0?[3,6]:[2,4,6],bonus=d.bonus||['暴击+6%，穿透+10%','终极额外冷却-8%，本系伤害+8%'];return [{title:d.name+'套装 · '+count+'/6 已穿戴'+(hero>=0?' · '+HEROES[hero].name:' · 当前主将，未计入本件'),rows:thresholds.map((n,i)=>({label:n+'件'+(count>=n?' · 已激活':' · 未激活'),value:bonus[i]}))}]}
function petActiveInfo28(p){const kind=petKind11(PETS[p.type]),scale=kind==='pulse'?.7:kind==='breath'?.85:1.1,radius=kind==='pulse'?135:kind==='breath'?105:0;return {kind,name:{breath:'五行喷息',pulse:'灵息波动',dive:'俯冲扑击',pounce:'迅猛扑击'}[kind],effect:(radius?'命中目标及其周围'+radius+'范围敌人':'命中单个目标')+'；基础命中威力＝（主人攻击×0.75＋灵宠等级×5＋融合星数×35）×'+scale+'，再按五行、灵宠增伤及敌方防御结算。'}}
function itemInfo28(ref){const p=resolveItem28(ref);if(!p)return null;const it=p.item,sections=[],notes=[],q=p.kind==='gem'?gemQuality17(it):p.kind==='support'?0:quality8(it);let title,subtitle,image,element;
 if(p.kind==='equipment'){
  title=itemName(it);element=WX.itemElement(it);subtitle=SLOT_NAMES[it.slot]+' · '+QUALITIES8[q][0]+' · '+WX.names[element]+'行';image={kind:'equipment',item:it};
  sections.push({title:'装备属性',rows:equipmentBaseRows28(it)},{title:'需求与归属',rows:[{label:'穿戴等级',value:'Lv.'+(it.requiredLevel10||1)},{label:'综合等级 / 战力',value:equipmentLevel10(it)+' / '+equipmentScore10(it)},{label:'位置',value:p.preview?'配方 / 商品 / 结果预览':p.hero>=0?HEROES[p.hero].name+' · '+SLOT_NAMES[it.slot]:p.place},{label:'状态',value:[it.locked10?'已锁定':'',it.favorite10?'已收藏':'',it.bound10?'已绑定':''].filter(Boolean).join(' / ')||'普通持有'}]});
  if(it.allowedHeroes28)notes.push('限定英雄：'+it.allowedHeroes28.map(i=>HEROES[i]?.name||'?').join('、'));if(it.requiredElement28!==undefined)notes.push('需要掌握'+WX.names[it.requiredElement28]+'行');
  sections.push({title:'宝石镶嵌 '+(it.sockets||[]).filter(Boolean).length+'/2',rows:[0,1].map(n=>({label:'第'+(n+1)+'孔',value:it.sockets?.[n]?gemName(it.sockets[n])+' · '+gemEffect(it.sockets[n]):'空槽'}))},...setInfo28(it,p.hero??-1));
  notes.push('五行影响共鸣与相克；无额外标注时不限制职业。武器宝石100%，其余装备50%；特殊属性受角色总上限约束。');
 }else if(p.kind==='gem'){
  title=GEMS[it.type].name;element=GEMS[it.type].element;subtitle=gemQualityName21(it)+' · '+(it.type===23?'五行合一':WX.names[element]+'行');image={kind:'gem',item:it};
  sections.push({title:'单颗本体属性',rows:gemEffectRows21(it).map(r=>({label:r.label,value:'+'+r.text}))});
  const a=p.asset,found=a?gemAssets26().find(x=>x.id===a.id):null,where=a?.state==='SOCKETED'?(a.hero>=0?HEROES[a.hero].name:a.place)+' / '+(a.item.slot===6?'觉醒灵台':itemName(a.item))+' / 第'+(a.hole+1)+'孔':a?'宝石库 · '+(a.range[3]?'已锁定':a.range[4]?'已收藏':'可用'):'配方 / 商品 / 结果预览';
  sections.push({title:'状态与用途',rows:[{label:'当前状态',value:where},{label:'本组数量',value:found?String(found.count):'预览'},{label:'同种总拥有',value:String(gemAssets26().filter(x=>gemKey17(x.gem)===gemKey17(it)).reduce((n,x)=>n+x.count,0))},{label:'适用部位',value:'武器、护甲、首饰、头盔、防具、靴子；转职后开放灵台'},{label:'熔炼规则',value:it.type===23?'不能作为普通熔炼材料':a?.state==='SOCKETED'?'已镶嵌，不能重复使用':'普通三石需同种同品质；复合配方以熔炉实际预览为准'}]});
  if(it.type===23)notes.push('五行神石：全属性、吸血与五行光环按原规则去重；由当前装备神石且存活的英雄主持，宝石目标品质≥传说、灵宠投入品质≥传说时享70%融合成功率保底（取较高成功率，并非额外+70%）；不适用于装备淬炼。');
  else if(q===6)notes.push('共鸣光环：300范围友军本系伤害+3%，同类不叠加；镶在武器可按Y召唤元素神兽。');
  notes.push('显示本体值；实际穿戴按武器100% / 非武器50% / 灵台65%计算，属性总上限仍生效。');
 }else if(p.kind==='pet'){
  const d=PETS[it.type],b=it.resultPower28||petPower10(it),hero=p.hero??-1;title=d.name;element=petElement10(it);subtitle=QUALITIES8[q][0]+' · Lv.'+it.lv+' · '+WX.names[element]+'行 · '+(d.flight?'空中':'陆地');image={kind:'pet',item:it};
  sections.push({title:'骑乘 / 随行加成',rows:[['hp','生命'],['atk','攻击'],['armor','防御'],['speed','移动速度'],['all','全三属性'],['int','额外智力'],['crit','暴击率']].filter(([k])=>b[k]).map(([k,label])=>({label,value:k==='crit'?percent28(b[k]):number28(b[k])})).concat({label:'战斗力',value:number28(it.resultScore28??petScore10(it))})});
  const passive={护主:'额外减伤 '+percent28(RULES10.pet.legendWard),疾风:'攻击速度 +'+percent28(RULES10.pet.mythicHaste),灵汲:'生命汲取 +'+percent28(RULES10.pet.supremeLeech)},activeSkill=petActiveInfo28(it);
  sections.push({title:'技能与使用状态',rows:[{label:'主动技能',value:activeSkill.name},{label:'技能效果',value:activeSkill.effect},{label:'基础冷却',value:'手动8秒 / 自动11秒；脱离战斗时嘶吼不结算伤害'},{label:'被动能力',value:petSkills10(it).map(s=>s+(passive[s]?'：'+passive[s]:'')).join('；')||'尚未觉醒品质被动'},{label:'类型',value:'可骑乘 / 可随行的战斗灵宠'},{label:'归属',value:hero>=0?HEROES[hero].name+' · '+(S.heroes[hero].petVisual11==='follow'?'随行中':'骑乘中'):p.preview?'种族 / 商品 / 结果预览':'灵宠库待命'},{label:'融合条件',value:q===6?'最高品质，普通融合无法继续升品':'两个不同个体、相同品质，一级可融；副宠及费用会消耗，失败保留主宠'}]});
  notes.push('以上为真实培养数据产生的加成，非独立召唤物的当前生命值。'+((d.story||d.desc)?'来历 / 来源：'+(d.story||d.desc):''));
 }else if(p.kind==='support'){
  const d=p.definition,st=recruitStats18(it);title=SUPPORT_BEASTS22[d.id].title;element=d.element;subtitle='战斗支援灵兽 · Lv.'+it.lv+' · '+WX.names[element]+'行';image={kind:'support',id:d.id};
  sections.push({title:'当前支援能力',rows:[{label:'生命',value:number28(st.hp)},{label:'攻击',value:number28(st.atk)},{label:'法术',value:number28(st.spell)},{label:'技能',value:d.skill||d.desc||d.role||'按支援单位自身技能AI施放'},{label:'状态',value:p.preview?'尚未招募':it.deployed?'已出战':'待命'},{label:'骑乘',value:'不可骑乘，不占英雄与装备槽位'}]});notes.push('支援攻击与法术按当前主将能力计算并受上限约束，不是正式英雄或骑乘个体。');
 }
 return {kind:p.kind,title,subtitle,quality:q,color:QUALITIES8[q][1],element,image,sections,notes,preview:!!p.preview};
}
