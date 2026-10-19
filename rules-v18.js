'use strict';
// V18 permanent character investments are separate from equipment and temporary buffs.
const CLASSES18=[
 {name:'金 · 天罡剑宗',role:'爆发 / 暴击 / 穿透',recommend:[2,1,7],nodes:['剑心','破甲剑气','凌空追斩','锋芒专精','星陨万刃','万剑归宗'],desc:['每阶暴击+2%、暴伤+8%','Q伤害+12%','E伤害+12%，突进短暂无敌','每阶穿透+4%','觉醒剑阵追加剑气','R伤害+15%']},
 {name:'木 · 万木灵医',role:'治疗 / 汲取 / 续航',recommend:[5,3,2],nodes:['长生根','缚灵藤','回春雨','生息专精','森罗庇护','生命领域'],desc:['每阶生命恢复+0.15%/秒','Q伤害+12%，藤缚延长','E治疗+12%，恢复附近队友','每阶汲取+1.5%、治疗+4%','觉醒持续治疗领域','R治疗+15%，领域延长']},
 {name:'水 · 寒渊御灵',role:'冰封 / 减速 / 法力',recommend:[3,6,1],nodes:['静水心','霜华冰棱','潮汐回响','凝霜专精','玄冰天幕','冰封千里'],desc:['每阶回蓝+0.2%/秒','Q伤害+12%，寒霜减速','E护盾+12%，恢复法力','每阶控制时间+8%、冷却-1%','觉醒冰封敌群，首领控制衰减','R伤害+15%，群体冻结']},
 {name:'火 · 焚天术士',role:'群伤 / 燃烧 / 爆发',recommend:[1,7,2],nodes:['炽魂','炎爆术','焰潮','燎原专精','朱雀天火','焚天烈焰'],desc:['每阶法术伤害+3%','Q伤害+12%，火焰爆炸','E伤害+12%，持续燃烧','每阶范围+4%、燃烧+10%','觉醒生成持续火域','R伤害+15%，烈焰更广']},
 {name:'土 · 玄甲守卫',role:'坦克 / 护盾 / 嘲讽',recommend:[8,1,1],nodes:['磐石躯','裂地震','玄岩壁','壁垒专精','山岳之誓','大地守护'],desc:['每阶护甲+5%、生命+2%','Q伤害+12%，震击敌群','E护盾+12%，嘲讽敌军','每阶护盾+8%、减伤+1%','觉醒守护附近队友','R护盾+15%，团队守护']}
];
const AFFIXES18={cdr:['流转','技能冷却缩减'],ultimate:['星轨','终极冷却缩减'],skill:['天怒','技能伤害'],leech:['饮血','生命汲取'],mana:['灵泉','每秒回蓝'],critical:['断空','暴击伤害'],element:['五曜','本系伤害'],resist:['御灵','本系抗性'],shield:['壁垒','护盾强度'],aura:['盟誓','附近友军攻击光环'],range:['无疆','技能范围'],pet:['御兽','灵宠伤害']};
const AFFIX_POOL18=[['skill','ultimate','critical','element','leech'],['resist','shield','aura','leech'],['cdr','ultimate','mana','skill'],['resist','mana','range','cdr'],['shield','aura','resist','cdr'],['range','cdr','pet','mana']];
const AFFIX_CAP18={cdr:.4,ultimate:.4,skill:.8,leech:.1,mana:.012,critical:.8,element:.5,resist:.3,shield:.8,aura:.08,range:.35,pet:.5};
const TALENT_GATES18=[0,0,0,1,2,0],TALENT_LEVELS18=[1,1,3,1,1,3];
function talentBudget18(h){return Math.min(100,3+Math.floor((h.lv-1)/5)+heroCount10(h)*10+Math.floor((h.attackBank10||0)/10))}
function talentRanks18(i){return S.heroes[i].tree18||[0,0,0,0,0,0]}
function migrate18(data){const v=migrate17(data);v.systems18=1;for(const h of v.heroes)h.tree18??=[0,0,0,0,0,0];v.recruits18??=[];v.rescues18??={};v.quests18??={claims:[],repeatBase:0,repeats:0};v.progress18??={petFusions:0,gemFusions:0,elites:0,bosses:0};v.potions18??={};return v}
const freshBefore18=fresh;fresh=function(...args){return migrate18(freshBefore18(...args))};
const validateBefore18=validateSave;validateSave=function(v){if(!validateBefore18(v))return false;if(v.systems18===undefined)return true;if(v.systems18!==1)return false;for(const h of v.heroes)if(!Array.isArray(h.tree18)||h.tree18.length!==6||h.tree18.some(n=>!int10(n,0,5))||h.tree18.reduce((a,b)=>a+b,0)>talentBudget18(h))return false;
 if(!Array.isArray(v.recruits18)||v.recruits18.length>12||new Set(v.recruits18.map(r=>r.id)).size!==v.recruits18.length||v.recruits18.filter(r=>r.deployed).length>2||v.recruits18.some(r=>!RECRUITS18.some(d=>d.id===r.id)||!int10(r.lv,1,300)||!int10(r.xp,0,1e12)||typeof r.deployed!=='boolean'))return false;
 if(!v.rescues18||typeof v.rescues18!=='object'||Array.isArray(v.rescues18)||Object.entries(v.rescues18).some(([k,n])=>!['rift'].includes(k)||n!==true))return false;
 if(!v.quests18||!Array.isArray(v.quests18.claims)||v.quests18.claims.length>40||new Set(v.quests18.claims).size!==v.quests18.claims.length||v.quests18.claims.some(k=>!QUESTS18.some(q=>q.id===k))||!int10(v.quests18.repeats,0,100)||!int10(v.quests18.repeatBase,0,1e12))return false;
 if(!v.progress18||['petFusions','gemFusions','elites','bosses'].some(k=>!int10(v.progress18[k],0,1e9)))return false;
 if(!v.potions18||Array.isArray(v.potions18)||Object.entries(v.potions18).some(([k,n])=>!POTIONS18.some(p=>p.id===k)||!int10(n,0,9999)))return false;
 return [...v.bag,...(v.pendingGear10||[]),...v.heroes.flatMap(h=>h.gear.filter(Boolean))].every(it=>(it.set18===undefined||int10(it.set18,0,4))&&(it.affixes18===undefined||Array.isArray(it.affixes18)&&it.affixes18.length<=3&&new Set(it.affixes18.map(a=>a.key)).size===it.affixes18.length&&it.affixes18.every(a=>a.key in AFFIXES18&&finite10(a.value,0,AFFIX_CAP18[a.key]))));};
const beginBefore18=begin;begin=function(data){const r=beginBefore18(migrate18(data));recruitActors18=[];effectZones18=[];syncRescue18(false);reconcileCooldowns18();saveGame(false);return r};
function learnTalent18(i,node,request){return commit17('talent18',request,()=>{if(!int10(i,0,4)||!owned(i)||!int10(node,0,5))return false;const h=S.heroes[i],r=h.tree18;if(h.lv<TALENT_LEVELS18[node]&&!h.skillsKept10||heroCount10(h)<TALENT_GATES18[node]||r[node]>=5||node>=3&&node<=4&&r[node]>=heroCount10(h)||r.reduce((a,b)=>a+b,0)>=talentBudget18(h))return false;r[node]++;return true})}
function attributePlan18(i,alloc){if(!int10(i,0,4)||!owned(i)||!Array.isArray(alloc)||alloc.length!==3||alloc.some(n=>!int10(n,0,1e7))||alloc.reduce((a,b)=>a+b,0)>S.heroes[i].points)return null;const h=S.heroes[i],before=stats(i),old=h.bonus;try{h.bonus=old.map((n,k)=>n+alloc[k]);return {before,after:stats(i),remaining:h.points-alloc.reduce((a,b)=>a+b,0)}}finally{h.bonus=old;invalidateLuck10()}}
function applyAttributes18(i,alloc,request){return commit17('attributes18',request,()=>{if(!attributePlan18(i,alloc))return false;const h=S.heroes[i];h.bonus=h.bonus.map((n,k)=>n+alloc[k]);h.points-=alloc.reduce((a,b)=>a+b,0);return true})}
function resetAttributes18(i,request){return commit17('reset-attributes18',request,()=>{if(!int10(i,0,4)||!owned(i)||!atCamp()||!pay17({gold:50}))return false;const h=S.heroes[i];h.points+=h.bonus.reduce((a,b)=>a+b,0);h.bonus=[0,0,0];return true})}
function recommend18(i,count=S.heroes[i].points){const w=CLASSES18[i].recommend,alloc=w.map(n=>Math.floor(count*n/10));alloc[w.indexOf(Math.max(...w))]+=count-alloc.reduce((a,b)=>a+b,0);return alloc}
function rollAffixes18(it){if(it.affixes18!==undefined)return it;const q=quality8(it);it.affixes18=[];if(q<2||q===2&&it.id%4!==0)return it;const pool=AFFIX_POOL18[it.slot],n=q>=5?3:q>=4?2:1;for(let j=0;j<n;j++){const key=pool[(it.id+j)%pool.length];it.affixes18.push({key,value:Math.min(AFFIX_CAP18[key],(key==='mana'?.0008:key==='aura'?.008:.025)*(q-1))})}if(q>=3)it.set18=WX.itemElement(it);return it}
const receiveBefore18=receiveEquipment10;receiveEquipment10=function(it){rollAffixes18(it);return receiveBefore18(it)};
const protectBefore18=protectedEquipment10;protectedEquipment10=function(it,automatic=true){return quality8(it)===6||it.sockets?.some(g=>g?.type===23)||protectBefore18(it,automatic)};
function awakenEquipment18(id,request){return commit17('awaken-relic18',request,()=>{const it=allEquipment10().find(i=>i.id===id);if(!it||quality8(it)<2||it.affixes18!==undefined||it.locked10||it.quest10||!atCamp()||!pay17({gold:2000,iron:10}))return false;rollAffixes18(it);return true})}
function affixText18(it){return (it.affixes18||[]).map(a=>AFFIXES18[a.key][1]+' +'+(a.value*100).toFixed(1)+'%').join(' · ')+(it.set18!==undefined?' · '+['天罡','长生','玄潮','焚天','镇岳'][it.set18]+'套装':'')}
const descBefore18=itemDescription;itemDescription=it=>descBefore18(it)+(affixText18(it)?' · '+affixText18(it):'');

const commitBefore18=commit17;commit17=function(...args){const before=actors.map(a=>({hp:a.hp,mp:a.mp,shield:a.shield,shieldTime:a.shieldTime,buff18:a.buff18?{...a.buff18}:undefined}));const r=commitBefore18(...args);if(!r)for(let i=0;i<actors.length;i++)Object.assign(actors[i],before[i]);return r};

HEROES.forEach((d,i)=>{d.q=CLASSES18[i].nodes[1];d.e=CLASSES18[i].nodes[2];d.r=CLASSES18[i].nodes[5];d.skills=[CLASSES18[i].desc[1],CLASSES18[i].desc[2],CLASSES18[i].desc[5]]});

const advanceBefore18=advanceHero10;advanceHero10=function(i=S.active,...args){const r=advanceBefore18(i,...args);if(r){delete actors[i].buff18;actors[i].shield=0;actors[i].shieldTime=0;effectZones18=effectZones18.filter(z=>z.i!==i);refreshBars()}return r};rebirthHero9=advanceHero10;

const itemNameBefore18=itemName;itemName=function(it){return (['天怒','星轨'].includes(it.relicName18)?it.relicName18+' · ':'')+itemNameBefore18(it)};

const SKILL_DETAILS18=[
 ['近身范围斩击：攻击×2.1+法术；Q天赋每阶伤害+12%。','向目标突进，短暂无敌：攻击×2.5+法术；E天赋每阶伤害+12%。','周围剑阵：攻击×5+法术×3；R天赋每阶伤害+15%。'],
 ['藤矢伤害并缠绕目标；Q天赋每阶伤害+12%并延长藤缚。','治疗附近存活队友；E天赋每阶治疗+12%。','即时群体治疗并留下持续生命领域；R天赋强化治疗和持续时间。'],
 ['范围冰棱伤害并减速；Q天赋每阶伤害+12%。','附近队友获得护盾并恢复8%法力；E天赋每阶护盾+12%。','大范围冰封与减速，首领冻结衰减；R天赋每阶伤害+15%。'],
 ['爆炸群伤并留下火域；Q天赋每阶伤害+12%。','近身焰潮与持续火域；E天赋每阶伤害+12%。','大范围焚天烈焰与持续灼烧；R天赋每阶伤害+15%。'],
 ['裂地震击并短暂控制敌人；Q天赋每阶伤害+12%。','强化自身护盾并嘲讽附近敌人；E天赋每阶护盾+12%。','群体护盾、范围震击与持续庇护；R天赋强化护盾和伤害。']
];HEROES.forEach((d,i)=>d.skills=SKILL_DETAILS18[i]);
