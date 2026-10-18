'use strict';
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
// V8: species IDs are append-only; quality belongs to the individual contract.
const QUALITIES8=[
 ['普通','#b8c4c7',1],['精品','#81d2a4',1.18],['史诗','#79baff',1.48],
 ['稀有','#c39af5',1.9],['传说','#f5ce77',2.55],['神话','#ff9c69',3.5],['极其稀有','#f5c5ff',5]
];
const V8_SPECIES=[
 ['神龙',1,1,'glide',5,'云海深处的灵脉守望者，逆鳞中藏着金色的潮汐。'],
 ['麒麟',3,0,'gallop',4,'踏过余烬，鬃毛燃起一簇簇温暖而危险的火。'],
 ['苍龙',2,1,'glide',4,'冰蓝龙鳞映出雷雨，吐息可以冻住云层。'],
 ['青牛',1,0,'trot',1,'爱嚼灵草的老实伙伴，冲锋时却能撞开石门。'],
 ['四不像',4,0,'gallop',3,'角、蹄与鳞甲各有来历，脾气像营地里的老朋友。'],
 ['避水金睛兽',2,0,'gallop',3,'踏浪不湿鞍，金色瞳孔看得见水底宝物。'],
 ['板角青牛',0,0,'stomp',2,'板状巨角可以犁开山岩，最讨厌有人摸它的铃铛。'],
 ['五色神牛',4,0,'stomp',4,'五色鬃毛随灵时变换，走过的地面留下五色光纹。'],
 ['九灵元圣',0,0,'prowl',5,'九缕灵鬃如九道兽影，低吼便能震散阴雾。'],
 ['墨麒麟',2,0,'gallop',4,'墨色鳞甲中流转寒光，夜里只看得见两只亮眼。'],
 ['玉麒麟',4,0,'gallop',4,'玉甲温润如月，奔跑时会发出清脆的玉鸣。'],
 ['火眼金睛兽',3,0,'prowl',3,'火眼能看穿幻影，一次喷嚏便能点着营火。'],
 ['金毛犼',0,0,'prowl',4,'金鬃如剑，咆哮时声浪层层推开。'],
 ['六牙白象',4,0,'stomp',3,'六支长牙刻着古老灵纹，脚步稳得像一座移动山岳。'],
 ['梅花鹿',1,0,'gallop',0,'灵草的香味会让它绕路，夜里鹿角开出小花。'],
 ['五彩神鹿',1,0,'gallop',3,'五彩尾光在林间流动，能引迷路旅人找到水源。'],
 ['青鸾',2,1,'wing',3,'青色长羽铺开如水，振翅带来清凉的霜风。'],
 ['金翅大鹏',0,1,'wing',5,'金翅遮日，俯冲时的气浪像一柄从天而降的长刀。'],
 ['五色孔雀',1,1,'wing',4,'羽屏藏着五色灵光，最喜欢在胜利后开屏。'],
 ['玄鸟',2,1,'wing',3,'玄羽掠过云影，长鸣中藏着远古的回声。'],
 ['白鹤',0,1,'wing',1,'细腿看似纤弱，展开双翼却能载人越过群山。'],
 ['赤睛狻猊',3,0,'prowl',3,'喜欢坐在热石上打盹，醒来时会喷出金红火星。'],
 ['狴犴',0,0,'prowl',3,'身披铁纹，能用咆哮震住逃窜的妖兽。'],
 ['貔貅',4,0,'prowl',4,'嗅到金币便竖起耳朵，战利品袋总被它看得很紧。'],
 ['饕餮',4,0,'stomp',5,'胃口像无底洞，却从不吞掉主人的宝石。'],
 ['睚眦',3,0,'prowl',4,'赤鬃似燃烧的刀刃，冲进战阵便不肯轻易后退。'],
 ['螭吻',2,0,'crawl',3,'蓝鳞吐出水雾，把营地的屋檐当成自己的王座。'],
 ['赑屃',4,0,'crawl',3,'背上长着小山般的石甲，载得动最沉的行囊。'],
 ['狰',0,0,'prowl',3,'红眼白鬃的山中猎手，尾尖敲地时像石子相击。'],
 ['狞',2,0,'prowl',2,'冰蓝鬃毛像结霜的草，伏低身子便融进雪原。'],
 ['乘黄',4,0,'gallop',3,'独角泛着暖金色，奔跑像一道贴地的夕阳。'],
 ['当康',1,0,'stomp',1,'爱拱土也爱寻宝，哼哼声中常伴着意外收获。'],
 ['飞廉',0,1,'wing',3,'羽鬃与长角一起迎风，掠过时留下弯弯的气流。'],
 ['应龙',2,1,'glide',5,'应天而行的古龙，鳞片上凝着苍白的雷霜。'],
 ['烛龙',3,1,'glide',5,'眼如暗日，开口时火舌像长夜中的第一道曙光。'],
 ['蛟龙',2,1,'glide',3,'在深潭修行的龙裔，把每次战斗当作跃龙门的练习。'],
 ['腾蛇',4,1,'glide',3,'蛇身乘雾，盘旋时金纹逐一亮起。'],
 ['鲲鹏',2,1,'swim',5,'以云海为水面，巨翼舒展时连风都变慢了。'],
 ['精卫',3,1,'wing',2,'小小的赤羽伙伴，坚持把最难的战斗一点点啄穿。'],
 ['重明鸟',0,1,'wing',3,'双瞳映出妖气，黑暗里也能找到最危险的目标。'],
 ['三足金乌',3,1,'wing',5,'三足托起日轮，羽翼边缘有流动的金色火焰。'],
 ['雪域冰凰',2,1,'wing',4,'尾羽由冰晶织成，飞过后空中留下细小雪花。'],
 ['幽冥骨马',2,0,'gallop',2,'蹄下幽蓝灵焰不灼人，踏过时传来空灵的马嘶。'],
 ['翡翠巨蜥',1,0,'crawl',1,'鳞片像湿润的翡翠，尾巴会在出击前慢慢摆动。'],
 ['熔岩蝾螈',3,0,'crawl',2,'皮肤下流淌着熔浆，吐息时先有一声低沉的闷响。'],
 ['雷角战犀',0,0,'stomp',2,'角上聚着蓝白电弧，冲锋像一辆失控的战车。'],
 ['碧海巨蟹',2,0,'crawl',1,'巨钳有厚厚的珊瑚甲，战后总要仔细擦亮。'],
 ['月影豹',2,0,'prowl',2,'银色斑纹随月光明灭，扑击只留下一道浅蓝残影。'],
 ['晶甲穿山兽',4,0,'crawl',2,'层层晶甲会在受击时鸣响，蜷身便成一颗发光的岩球。'],
 ['沙海巨蝎',4,0,'crawl',2,'尾针像烧亮的琥珀，六足在沙地留下整齐的脚印。'],
 ['银鬃狮鹫',0,1,'wing',2,'银羽与狮爪共同作战，喜欢在高处巡视营地。'],
 ['深渊梦魇',3,0,'gallop',3,'暗紫鬃焰无声摇曳，长嘶会让胆小的妖兽退开。'],
 ['翠羽角鹰',1,1,'wing',2,'翡翠羽翼上有金色细纹，喜欢贴着树梢滑翔。'],
 ['冰晶翼龙',2,1,'wing',3,'透明翼膜折射霜光，俯冲吐出旋转的冰晶。'],
 ['玄甲龙龟',2,0,'crawl',3,'小小楼阁般的背甲承载着水脉，行动沉稳有力。'],
 ['星穹独角兽',0,0,'gallop',4,'独角像一束凝住的星光，银鬃中偶尔掉出星屑。'],
 ['赤焰九尾',3,0,'prowl',3,'九条火尾各有脾气，喷息时却会一起扬起。'],
 ['金纹剑齿虎',0,0,'prowl',2,'剑齿闪着冷光，脚掌落地几乎没有声音。'],
 ['琉璃水母',2,1,'swim',3,'轻盈地浮在空中，触须像一串会发光的风铃。'],
 ['太古猛犸',4,0,'stomp',3,'巨牙结着冰霜，长鼻卷起碎石也卷走主人的点心。'],
 ['混沌祖兽',4,0,'stomp',6,'灵契深处的不可思议之兽，身上的星纹尚未有人认全。']
];
V8_SPECIES.forEach(([name,element,flight,move,minQuality,story],n)=>{
 const m=1+Math.min(4,minQuality)*.22,hp=Math.round((element===4?125:75)*m),atk=Math.round((element===0?17:12)*m),int=Math.round((element===1||element===2?15:8)*m);
 PETS.push({name,element,flight:!!flight,move,minQuality,rarity:minQuality>=4?3:minQuality>=2?2:1,story,desc:story,color:WX.colors[element],ability:flight||[2,3].includes(element)?'breath':'pounce',hp,atk,int,armor:Math.round(3*m),speed:move==='crawl'?21:flight?43:34,atlas8:n===0?3:Math.floor((n-1)/20),cell8:n===0?0:(n-1)%20,saddle:[-3,move==='crawl'?-55:flight?-65:-64],bonus:`生命 +${hp} · 攻击 +${atk} · 智力 +${int}`});
});
for(let n=0;n<39;n++)PETS[n].minQuality=n>=15&&n<19?3:PETS[n].rarity>=3?3:PETS[n].rarity>=2?2:0;
function quality8(v){return Number.isInteger(v?.quality)?clamp(v.quality,0,6):Number.isInteger(v?.tier)?v.tier:0}
function qualityBadge8(q){return `<span class="quality8 q8-${q}" style="--quality:${QUALITIES8[q][1]}">${QUALITIES8[q][0]}</span>`}
function gemQuality8(level){return [0,0,1,1,2,3,4,4,5,5,6][level]??0}
function weighted8(weights,roll=Math.random()){let sum=weights.reduce((s,w)=>s+w,0),n=roll*sum;for(let i=0;i<weights.length;i++){n-=weights[i];if(n<0)return i}return weights.length-1}
function rollQuality8(rank=0){return weighted8([[72,23,4.5,.5,0,0,0],[0,0,72,24,3.8,.2,0],[0,0,0,73,24.8,2.1,.1],[0,0,0,0,85,14.8,.2]][clamp(rank,0,3)])}
let lootContext8=null;
addPet=function(type,announce=true,quality){if(!S||!Number.isInteger(type)||!PETS[type]||S.pets.length>=1000)return null;
 if(quality!==undefined&&(!Number.isInteger(quality)||quality<0||quality>6))return null;
 if(lootContext8&&quality===undefined)quality=Math.max(PETS[type].minQuality||0,Math.min(3,lootContext8.rank));
 const p={id:Math.max(100,...S.pets.map(p=>p.id))+1,type,lv:1,xp:0,quality:quality??PETS[type].minQuality??0};S.pets.push(p);if(announce)logMessage('获得 '+QUALITIES8[p.quality][0]+' · '+PETS[type].name+'，已放入灵宠包裹。');return p;
};
const statsBeforeQuality8=stats;stats=function(i){const st=statsBeforeQuality8(i),p=petOf(i);if(!p)return st;const d=PETS[p.type],m=(QUALITIES8[quality8(p)][2]-1)*(1+(p.lv-1)*.18),res=(st.resonance||1)*(1+(st.phaseBonus||0));st.hp+=Math.round(d.hp*m*res);st.atk+=Math.round(d.atk*m*res);st.int+=Math.round(d.int*m);st.mp+=Math.round(d.int*m*5);st.armor=Math.round((st.armor+d.armor*m)*10)/10;return st};
const itemNameBeforeQuality8=itemName;itemName=function(it){return QUALITIES8[quality8(it)][0]+' · '+itemNameBeforeQuality8(it)};
const descriptionBeforeQuality8=itemDescription;itemDescription=function(it){return descriptionBeforeQuality8(it)+' · '+QUALITIES8[quality8(it)][0]};
const gemArtBeforeQuality8=gemArt;gemArt=function(gem,cls=''){return gemArtBeforeQuality8(gem,cls)+qualityBadge8(gemQuality8(gem.level))};
const validateBeforeQuality8=validateSave;validateSave=function(v){if(!validateBeforeQuality8(v))return false;const all=[...v.pets,...v.bag,...v.heroes.flatMap(h=>h.gear.filter(Boolean))];if(all.some(p=>p.quality!==undefined&&(!Number.isInteger(p.quality)||p.quality<0||p.quality>6)))return false;
 if(v.ingots!==undefined&&(!Number.isInteger(v.ingots)||v.ingots<0||v.ingots>1e8))return false;
 if(v.discoveredPets!==undefined&&(!Array.isArray(v.discoveredPets)||v.discoveredPets.length>PETS.length||new Set(v.discoveredPets).size!==v.discoveredPets.length||v.discoveredPets.some(t=>!Number.isInteger(t)||!PETS[t])))return false;
 if(v.respawns8!==undefined&&(!v.respawns8||Array.isArray(v.respawns8)||typeof v.respawns8!=='object'||Object.keys(v.respawns8).length>1200||Object.entries(v.respawns8).some(([k,n])=>!/^(?:[0-9]|10):[\w-]{1,60}$/.test(k)||typeof n!=='number'||!Number.isFinite(n)||n<0||n>1e10)))return false;return true};
const beginBeforeQuality8=begin;begin=function(data){const next=JSON.parse(JSON.stringify(data));next.ingots??=0;next.respawns8??={};next.discoveredPets=[...new Set([...(next.discoveredPets||[]),...next.pets.map(p=>p.type)])];for(const p of next.pets)p.quality??=PETS[p.type].minQuality||0;for(const it of [...next.bag,...next.heroes.flatMap(h=>h.gear.filter(Boolean))])it.quality??=it.tier;beginBeforeQuality8(next);for(const h of S.heroes)for(const it of h.gear)if(it)it.quality??=it.tier;saveGame(false)};
function rememberPets8(){if(S)S.discoveredPets=[...new Set([...(S.discoveredPets||[]),...S.pets.map(p=>p.type)])]}
const addPetBeforeDiscovery8=addPet;addPet=function(...args){const p=addPetBeforeDiscovery8(...args);if(p)rememberPets8();return p};
function fusionCost8(a,b){return Math.round((160+(quality8(a)+quality8(b))*95+(a.lv+b.lv)*5)*Math.pow(1.5,Math.max(quality8(a),quality8(b))))}
fusionOdds=function(a,b,i=S.active){const luck=Math.min(80,stats(i).luck),relation=WX.relation(WX.petElement(a.type),WX.petElement(b.type)),q=Math.max(quality8(a),quality8(b)),phaseBonus=[WX.petElement(a.type),WX.petElement(b.type)].includes(WX.phase().element)?.015:0;return {luck,relation,phaseBonus,cost:fusionCost8(a,b),success:clamp(.68+phaseBonus+({same:.06,sheng:.18,ke:-.25}[relation])-q*.045+luck*.0025,.12,.96),rare:clamp(.08+luck*.002+(relation==='sheng'?.06:0),.08,.3)}};
function fusionSpecies8(a,b,q){const elements=[WX.petElement(a.type),WX.petElement(b.type)],all=PETS.map((p,type)=>({p,type})).filter(v=>v.type!==a.type&&v.type!==b.type&&(v.p.minQuality||0)<=q),linked=all.filter(v=>elements.includes(v.p.element)||elements.some(e=>WX.SHENG[e]===v.p.element));return (linked.length?linked:all).map(v=>v.type)}
fusionPool=function(a,b){return fusionSpecies8(a,b,Math.min(6,Math.max(quality8(a),quality8(b))+1))};
fusePets=function(idA,idB,rng8=Math.random){if(!S||typeof rng8!=='function')return null;const a=S.pets.find(p=>p.id===idA),b=S.pets.find(p=>p.id===idB);if(!a||!b||a===b||quality8(a)!==quality8(b))return null;const o=fusionOdds(a,b);if(S.gold<o.cost)return null;const rolls=[rng8(),rng8(),rng8()];if(rolls.some(n=>!Number.isFinite(n)||n<0||n>=1))return null;const success=rolls[0]<o.success;let pet=null;
 if(success){const q=Math.min(6,quality8(a)+1),pool=fusionSpecies8(a,b,q);if(!pool.length)return null;pet={id:Math.max(100,...S.pets.map(p=>p.id))+1,type:pool[Math.floor(rolls[2]*pool.length)],quality:q,lv:quality8(a)===6?Math.min(150,Math.max(a.lv,b.lv)+1):Math.max(1,Math.floor((a.lv+b.lv)/2)),xp:0,fusion:{parents:[a.type,b.type],stars:Math.min(3,Math.max(a.fusion?.stars||0,b.fusion?.stars||0)+1)}}}
 S.gold-=o.cost;const consumed=success?[idA,idB]:[idB],riders=S.heroes.map(h=>h.pet);S.pets=S.pets.filter(p=>!consumed.includes(p.id));for(const h of S.heroes)if(consumed.includes(h.pet))h.pet=null;if(pet){S.pets.push(pet);const owner=riders.indexOf(idA)>=0?riders.indexOf(idA):riders.indexOf(idB);if(owner>=0)S.heroes[owner].pet=pet.id;rememberPets8()}
 for(const a of actors){a.hp=Math.min(a.hp,stats(a.i).hp);a.mp=Math.min(a.mp,stats(a.i).mp)}saveGame(false);refreshBars();logMessage(success?'灵契新生：'+QUALITIES8[pet.quality][0]+' · '+PETS[pet.type].name:'合体未成：材料一完整保留，材料二与费用已消耗。');return {success,pet,odds:o};
};
function petShopOffer8(type){const p=PETS[type],q=p.minQuality||0;return {allowed:(type<12||type>=19)&&q<=2,chapter:q,cost:Math.round((150+type*9)*QUALITIES8[q][2]*1.5),quality:q}}
petPurchase=function(type){if(!Number.isInteger(type)||!PETS[type]||!atCamp()||S.pets.length>=1000)return false;const o=petShopOffer8(type);if(!o.allowed||S.chapter<o.chapter||S.gold<o.cost)return false;const p=addPet(type,true,o.quality);if(!p)return false;S.gold-=o.cost;saveGame(false);refreshBars();return p};
let petFilter8={element:-1,quality:-1,text:'',page:0};
function petSources8(q){return q<=1?'营地契约 / 妖兽掉落 / 合体':q===2?'小首领 / 营地高阶契约 / 合体':q<=4?'大首领 / 五行合体':'终极首领 / 高品质灵契合体'}
function qualityLegend8(){return '<div class="quality-legend8">'+QUALITIES8.map((q,i)=>qualityBadge8(i)).join('<span>›</span>')+'</div>'}
function petPortrait8(type,cls=''){return `<div class="pet-portrait pet-idle ${PETS[type].flight?'air8':'ground8'} ${cls}" style="${petCardStyle(type)}"></div>`}
function renderPets8(tab='bag',reset=false){if(!S)return;if(reset)petFilter8.page=0;panelContext7={key:'pets8',args:[tab]};rememberPets8();const shop=tab==='shop',codex=tab==='codex';let rows=shop||codex?PETS.map((p,type)=>({p,type})):S.pets.map(pet=>({p:PETS[pet.type],type:pet.type,pet}));if(shop)rows=rows.filter(v=>petShopOffer8(v.type).allowed);if(codex)rows=rows.filter(v=>!v.p.hidden9||S.discoveredPets.includes(v.type));
 rows.sort((a,b)=>a.pet&&b.pet?comparePets9(a.pet,b.pet):(b.p.minQuality||0)-(a.p.minQuality||0)||a.type-b.type);rows=rows.filter(v=>(petFilter8.element<0||v.p.element===petFilter8.element)&&(petFilter8.quality<0||(v.pet?quality8(v.pet):v.p.minQuality||0)===petFilter8.quality)&&v.p.name.includes(petFilter8.text));const pages=Math.max(1,Math.ceil(rows.length/12));petFilter8.page=clamp(petFilter8.page,0,pages-1);const pageRows=rows.slice(petFilter8.page*12,petFilter8.page*12+12);
 showDialog(panelHead(codex?'百灵图鉴 · 100常规种与隐世灵契':shop?'灵契商店':'灵宠包裹')+`<div class="realm-tabs">${[['bag','包裹 '+S.pets.length+'/1000'],['shop','契约商店'],['codex','图鉴 '+S.discoveredPets.filter(t=>!PETS[t].hidden9).length+'/100'],['fusion','一级合体']].map(([k,n])=>`<button data-pet8tab="${k}" class="${k===tab?'selected':''}">${n}</button>`).join('')}</div><p class="muted">金币 ${S.gold} · 七档品质增强灵宠战力，等级1即可合体。高级灵契来自首领与合体；同种可以收藏多只。</p>${qualityLegend8()}<div class="pet-filters8"><label>五行<select id="petElement8"><option value="-1">全部五行</option>${WX.names.map((n,i)=>`<option value="${i}">${n}</option>`).join('')}</select></label><label>${codex||shop?'起始品质':'个体品质'}<select id="petQuality8"><option value="-1">全部品质</option>${QUALITIES8.map((q,i)=>`<option value="${i}">${q[0]}</option>`).join('')}</select></label><label>名称<input id="petSearch8" placeholder="麒麟、青牛…" maxlength="20" value="${escapeHTML(petFilter8.text)}"></label><button id="petSearchGo8">查找</button></div><div class="pet-grid pets8">`+pageRows.map(({p,type,pet})=>{const q=pet?quality8(pet):p.minQuality||0,owner=pet?S.heroes.findIndex(h=>h.pet===pet.id):-1,o=petShopOffer8(type);return `<article style="--quality:${QUALITIES8[q][1]}" class="pet-card8 q8-${q}">${qualityBadge8(q)}${petPortrait8(type)}<h3>${WX.badge(p.element)} ${p.name}</h3><small>${p.flight?'空中 · 飞行':'陆地 · '+({crawl:'爬行',stomp:'踏地',prowl:'扑猎',gallop:'奔腾'}[p.move]||'行走')}${pet?' · Lv.'+pet.lv:''}</small><p>${p.story||p.desc}</p>${pet?`<p>个体加成 ×${QUALITIES8[q][2]} · ${owner<0?'包裹待命':HEROES[owner].name+'骑乘'}</p><label>分配骑乘<select data-pet8assign="${pet.id}"><option value="-1">放入包裹</option>${HEROES.map((h,i)=>owned(i)?`<option value="${i}" ${owner===i?'selected':''}>${h.name}</option>`:'').join('')}</select></label>`:shop?`<button data-pet8buy="${type}" ${!atCamp()||S.chapter<o.chapter||S.gold<o.cost||S.pets.length>=1000?'disabled':''}>${S.chapter<o.chapter?'第'+(o.chapter+1)+'章解锁':o.cost+'金币 · 契约'}</button>`:`<small>${S.discoveredPets.includes(type)?'✦ 已发现':'◇ 尚未发现'} · ${petSources8(q)}</small>`}</article>`}).join('')+`</div>${rows.length?'':'<p class="empty-state">没有符合条件的灵宠，试试切换五行或品质。</p>'}<div class="pager8"><button id="petPrev8" ${petFilter8.page===0?'disabled':''}>上一页</button><span>第 ${petFilter8.page+1} / ${pages} 页 · ${rows.length}项</span><button id="petNext8" ${petFilter8.page>=pages-1?'disabled':''}>下一页</button></div>`);
 $('#petElement8').value=String(petFilter8.element);$('#petQuality8').value=String(petFilter8.quality);$('#petElement8').onchange=()=>{petFilter8.element=+$('#petElement8').value;renderPets8(tab,true)};$('#petQuality8').onchange=()=>{petFilter8.quality=+$('#petQuality8').value;renderPets8(tab,true)};$('#petSearchGo8').onclick=()=>{petFilter8.text=$('#petSearch8').value.trim().slice(0,20);renderPets8(tab,true)};$('#petSearch8').onkeydown=e=>{if(e.key==='Enter')$('#petSearchGo8').click()};$('#petPrev8').onclick=()=>{petFilter8.page--;renderPets8(tab)};$('#petNext8').onclick=()=>{petFilter8.page++;renderPets8(tab)};
 $('#dialog').querySelectorAll('[data-pet8tab]').forEach(b=>b.onclick=()=>{petFilter8={element:-1,quality:-1,text:'',page:0};if(b.dataset.pet8tab==='fusion')fusionPanel();else renderPets8(b.dataset.pet8tab)});$('#dialog').querySelectorAll('[data-pet8assign]').forEach(b=>b.onchange=()=>{assignPet(+b.dataset.pet8assign,+b.value);renderPets8(tab)});$('#dialog').querySelectorAll('[data-pet8buy]').forEach(b=>b.onclick=()=>{if(petPurchase(+b.dataset.pet8buy))renderPets8(tab)});
}
petsPanel=renderPets8;panelTargets7.pets8=renderPets8;
function fusionPanel8(){if(!S)return;panelContext7={key:'fusion8',args:[]};const pets=S.pets;showDialog(panelHead('万灵合契 · 一级开放')+`<p>两只不同种类，等级1即可尝试。相生易合、相克难合，当前英雄幸运提高成功率。费用随材料品质和等级提升。</p><p><b>成功：</b>消耗双方，等级取平均，新品质通常介于双亲之间，有概率提升一档。<b>失败：</b>材料一完整保留，消耗材料二及费用。高品质培育需要多代积累。</p><div class="fusion-select"><label>材料一<select id="fusionA8">${pets.map(p=>`<option value="${p.id}">${PETS[p.type].name} · ${QUALITIES8[quality8(p)][0]} · Lv.${p.lv} #${p.id}</option>`).join('')}</select></label><span>☯</span><label>材料二<select id="fusionB8">${pets.map(p=>`<option value="${p.id}">${PETS[p.type].name} · ${QUALITIES8[quality8(p)][0]} · Lv.${p.lv} #${p.id}</option>`).join('')}</select></label></div><div id="fusionInfo8"></div><div class="actions"><button id="fusionConfirm8" class="primary">查看合体预览</button><button id="fusionBack8">返回灵宠</button></div>`);if(pets.length>1)$('#fusionB8').value=String(pets.find(p=>p.type!==pets[0].type)?.id||pets[1].id);
 const chosen=()=>[S.pets.find(p=>p.id===+$('#fusionA8').value),S.pets.find(p=>p.id===+$('#fusionB8').value)];const preview=()=>{const[a,b]=chosen(),ok=a&&b&&a!==b&&a.type!==b.type;$('#fusionConfirm8').disabled=!ok;if(!ok){$('#fusionInfo8').textContent='请选择两只不同种类的灵宠。';return}const o=fusionOdds(a,b);$('#fusionInfo8').innerHTML=`<div class="fusion-odds"><div><small>${forgeRelationName7(o.relation)}</small><b>${Math.round(o.success*1000)/10}%</b></div><div><small>幸运</small><b>${o.luck}</b></div><div><small>费用 / 持有金币</small><b>${o.cost} / ${S.gold}</b></div></div><p>成功后品质跃升概率 ${Math.round(o.rare*1000)/10}% · 可能诞生：${fusionPool(a,b).slice(-10).map(t=>PETS[t].name).join('、')}等。</p>`};$('#fusionA8').onchange=$('#fusionB8').onchange=preview;preview();$('#fusionBack8').onclick=()=>petsPanel();$('#fusionConfirm8').onclick=()=>{const[a,b]=chosen();if(!a||!b||a.type===b.type)return;const o=fusionOdds(a,b);showDialog(panelHead('确认合契')+`<div class="fusion-portraits8">${petPortrait8(a.type)}<span>☯</span>${petPortrait8(b.type)}</div><p>${PETS[a.type].name} + ${PETS[b.type].name} · 成功率 ${Math.round(o.success*1000)/10}%<br>花费 <b>${o.cost}金币</b>。成功消耗两只；失败消耗材料二，材料一完整保留。骑乘中的材料也会被消耗并解除骑乘。</p><button id="doFusion8" class="primary" ${S.gold<o.cost?'disabled':''}>确认支付并合体</button><button id="cancelFusion8">返回</button>`);$('#cancelFusion8').onclick=fusionPanel8;$('#doFusion8').onclick=()=>{const result=fusePets(a.id,b.id);if(!result)return;const p=result.pet;showDialog(panelHead(result.success?'灵契新生':'合契未成')+(p?qualityBadge8(p.quality)+petPortrait8(p.type,'fusion-result')+`<h3>${PETS[p.type].name} · Lv.${p.lv}</h3><p>${PETS[p.type].story||PETS[p.type].desc}</p>`:`<p>${PETS[a.type].name} 完整保留，${PETS[b.type].name}与${o.cost}金币已消耗。</p>`)+`<button id="fusionAgain8">继续合体</button><button id="fusionBag8">查看包裹</button>`);$('#fusionAgain8').onclick=fusionPanel8;$('#fusionBag8').onclick=()=>petsPanel()}};
}
fusionPanel=fusionPanel8;panelTargets7.fusion8=fusionPanel8;
