'use strict';
// V7: two-stone elemental forging. Existing gem IDs remain stable for old saves.
GEM_CAP=10;
Object.assign(GEMS[0],{element:3});Object.assign(GEMS[1],{element:2});Object.assign(GEMS[2],{element:1});Object.assign(GEMS[3],{element:4});
GEMS.push(
 {name:'鸡血石',color:'#ed6267',element:3,stat:'攻击 / 生命 / 汲取',unit:5},
 {name:'田黄石',color:'#e1b257',element:4,stat:'生命 / 护甲',unit:1},
 {name:'蓝金石',color:'#91bdde',element:0,stat:'攻击 / 护甲',unit:5},
 {name:'月光石',color:'#b4d9ef',element:2,stat:'智力 / 法力 / 法术',unit:4},
 {name:'贪狼',color:'#8fd490',element:1,stat:'攻击 / 敏捷 / 攻速',unit:3},
 {name:'破军',color:'#f1d28c',element:0,stat:'攻击 / 暴击',unit:6},
 {name:'七杀',color:'#e698b7',element:3,stat:'攻击 / 法术',unit:6},
 {name:'天罡',color:'#d4b87f',element:4,stat:'生命 / 护甲',unit:42},
 {name:'紫薇',color:'#c4a8ed',element:2,stat:'智力 / 幸运',unit:2},
 {name:'青龙印',color:'#78deb9',element:1,stat:'攻击 / 生命',unit:4},
 {name:'朱雀羽',color:'#ffb679',element:3,stat:'法术 / 智力',unit:6},
 {name:'玄武玉',color:'#91c8d5',element:2,stat:'生命 / 护甲',unit:40},
 {name:'白虎牙',color:'#ece3bb',element:0,stat:'攻击 / 攻速',unit:5},
 {name:'麒麟珀',color:'#e1c87b',element:4,stat:'幸运 / 护甲',unit:2}
);
gemValid=gem=>!!gem&&Number.isInteger(gem.type)&&gem.type>=0&&gem.type<GEMS.length&&Number.isInteger(gem.level)&&gem.level>=1&&gem.level<=10;
gemPower=gem=>gemValid(gem)?Math.round(GEMS[gem.type].unit*2**(gem.level-1)*10)/10:0;
gemName=gem=>gemValid(gem)?GEMS[gem.type].name+' · '+gem.level+'级'+(gem.level===10?'【天极】':''):'未知宝石';
const GEM_BEASTS7=['白虎','青龙','玄武','朱雀','麒麟'];
const GEM_TIERS7=['凡晶','蕴灵','凝华','通玄','地煞','天罡','圣耀','太初','帝辉','天极'];
let forgeTab7='socket',gemSummons7=[];

function forgeInventory7(changes){
 const bag=gemBag().map(g=>({...g}));
 for(const c of changes){let gem=bag.find(g=>g.type===c.type&&g.level===c.level);if(!gem){gem={type:c.type,level:c.level,count:0};bag.push(gem)}gem.count+=c.count;if(gem.count<0||gem.count>9999)return null}
 const result=bag.filter(g=>g.count>0);return result.length<=200?result:null;
}
giveGem=function(type,level=1,count=1){if(!gemValid({type,level})||!Number.isInteger(count)||count<1||count>9999)return false;const next=forgeInventory7([{type,level,count}]);if(!next)return false;S.gems=next;return true};
function forgeLuck7(i=S.active){return Math.min(80,Math.max(0,Number(stats(i).luck)||0))}
function gemFusionPool7(typeA,typeB){
 if(typeA===typeB)return [typeA];
 const a=GEMS[typeA].element,b=GEMS[typeB].element;
 if(a===b)return GEMS.map((gem,i)=>gem.element===a?i:-1).filter(i=>i>=0);
 // An elemental pairing can yield any rare stone belonging to either parent.
 // Original IDs also remain possible: low-grade gems always have a use.
 return GEMS.map((gem,i)=>gem.element===a||gem.element===b?i:-1).filter(i=>i>=0);
}
function gemSynthesisPreview(typeA,level,typeB,i=S.active){
 if(!gemValid({type:typeA,level})||!gemValid({type:typeB,level})||level>=10)return {valid:false,reason:'请选择两枚同级的1至9级宝石。'};
 const relation=WX.relation(GEMS[typeA].element,GEMS[typeB].element),luck=forgeLuck7(i),cost=(typeA===typeB?40:55)*level*level;
 const phaseBonus=typeof WX.phase==='function'&&[GEMS[typeA].element,GEMS[typeB].element].includes(WX.phase().element)?.015:0;
 const success=Math.min(.99,Math.max(.12,phaseBonus+({same:.94,sheng:.98,ke:.58}[relation]??.94)-.035*(level-1)+luck*.0015));
 const result={valid:true,typeA,typeB,level:level+1,inputLevel:level,relation,luck,cost,success,phaseBonus,pool:gemFusionPool7(typeA,typeB)};
 if(gemCount(typeA,level)<(typeA===typeB?2:1)||gemCount(typeB,level)<1){result.valid=false;result.reason='材料不足：需要两枚同级宝石。'}
 else if(S.gold<cost){result.valid=false;result.reason='金币不足。'}
 else if(!result.pool.every(type=>forgeInventory7([{type:typeA,level,count:-1},{type:typeB,level,count:-1},{type,level:level+1,count:1}]))){result.valid=false;result.reason='可能产物堆叠已满，请先腾出宝石包裹。'}
 return result;
}
function combineGemPair(typeA,level,typeB,rng7=Math.random){
 const preview=gemSynthesisPreview(typeA,level,typeB);if(!preview.valid||typeof rng7!=='function')return false;
 const roll=Number(rng7());if(!Number.isFinite(roll)||roll<0||roll>=1)return false;
 const success=roll<preview.success;let gem=null,changes=[{type:typeB,level,count:-1}];
 if(success){const choice=Number(rng7());if(!Number.isFinite(choice)||choice<0||choice>=1)return false;gem={type:preview.pool[Math.floor(choice*preview.pool.length)],level:level+1};changes.push({type:typeA,level,count:-1},{...gem,count:1})}
 const next=forgeInventory7(changes);if(!next)return false;
 S.gems=next;S.gold-=preview.cost;saveGame(false);refreshBars();
 logMessage(success?'熔炼成功：'+gemName(gem)+'！':'熔炼未成：材料一保留，材料二与'+preview.cost+'金币已消耗。');
 return {success,gem,preview};
}
combineGem=function(type,level){return combineGemPair(type,level,type)};
function gemShopPrice7(type,level){return (60+(type%4)*15)*(level===2?3.2:1)}
buyGem=function(type,level=1){if(!gemValid({type,level})||![1,2].includes(level)||!atCamp())return false;const cost=Math.ceil(gemShopPrice7(type,level));if(S.gold<cost||!giveGem(type,level))return false;S.gold-=cost;saveGame(false);refreshBars();return true};
socketGem=function(hero,type,level,slot){
 if(!Number.isInteger(hero)||hero<0||hero>4||!owned(hero)||![0,1].includes(slot)||!gemValid({type,level}))return false;
 const weapon=S.heroes[hero].gear[0];if(!weapon||gemCount(type,level)<1)return false;const old=weapon.sockets?.[slot];
 const changes=[{type,level,count:-1}];if(old)changes.push({...old,count:1});const next=forgeInventory7(changes);if(!next)return false;
 weapon.sockets??=[null,null];weapon.sockets[slot]={type,level};S.gems=next;actors[hero].hp=Math.min(actors[hero].hp,stats(hero).hp);actors[hero].mp=Math.min(actors[hero].mp,stats(hero).mp);saveGame(false);refreshBars();return true;
};
unsocketGem=function(hero,slot){if(!Number.isInteger(hero)||hero<0||hero>4||![0,1].includes(slot)||!owned(hero))return false;const weapon=S.heroes[hero].gear[0],gem=weapon?.sockets?.[slot];if(!gem||!giveGem(gem.type,gem.level))return false;weapon.sockets[slot]=null;actors[hero].hp=Math.min(actors[hero].hp,stats(hero).hp);actors[hero].mp=Math.min(actors[hero].mp,stats(hero).mp);saveGame(false);refreshBars();return true};

function gemBonuses7(gem){
 const v=gemPower(gem),l=gem.level;
 switch(gem.type){
 case 0:return {atk:v};case 1:return {int:v,mp:v*5,spell:v*2};case 2:return {hp:v,armor:Math.round(v/65)};case 3:return {luck:v};
 case 4:return {atk:v,hp:v*5,gemLeech:Math.min(.15,.012*l)};
 case 5:return {hp:v*38,armor:v*.12};case 6:return {atk:v,armor:v*.03};
 case 7:return {int:v,mp:v*5,spell:v*2.4};
 case 8:return {atk:v*.6,agi:v*.5,rate:Math.min(.4,l*.022+Math.sqrt(v)*.003)};
 case 9:return {atk:v,crit:Math.min(.24,l*.015+v*.00001)};
 case 10:return {atk:v*.6,spell:v*1.5};case 11:return {hp:v,armor:v/1000};
 case 12:return {int:v*1.5,luck:Math.min(60,Math.sqrt(v)*1.7)};
 case 13:return {atk:v,hp:v*4};case 14:return {spell:v*2,int:v*.7};
 case 15:return {hp:v,armor:v/1600};case 16:return {atk:v,rate:Math.min(.55,l*.025+v*.0001)};
 case 17:return {luck:Math.min(65,Math.sqrt(v)*2.2),armor:v*.07};default:return {};
 }
}
const statsBeforeForge7=stats;stats=function(i){
 const st=statsBeforeForge7(i);st.attackRate=st.attackRate||1;st.gemAttackRate=0;st.gemLeech=0;
 for(const gem of S.heroes[i].gear[0]?.sockets||[]){if(!gemValid(gem))continue;const b=gemBonuses7(gem);if(gem.type>=4)for(const [key,value]of Object.entries(b)){if(key==='rate')st.gemAttackRate+=value;else st[key]=(st[key]||0)+value}}
 st.attackRate=Math.min(2.2,st.attackRate+st.gemAttackRate);st.luck=Math.min(80,st.luck||0);st.crit=Math.min(.7,st.crit);st.gemLeech=Math.min(.22,st.gemLeech);st.atk=Math.round(st.atk);st.hp=Math.round(st.hp);st.mp=Math.round(st.mp);st.armor=Math.round(st.armor*10)/10;return st;
};
gemEffect=function(gem){if(!gemValid(gem))return '';const names={atk:'攻击',int:'智力',agi:'敏捷',hp:'生命',mp:'法力',spell:'法术',armor:'护甲',luck:'幸运',rate:'攻速',crit:'暴击',gemLeech:'汲取'},pct=['rate','crit','gemLeech'];return Object.entries(gemBonuses7(gem)).map(([key,value])=>names[key]+' +'+(pct.includes(key)?Math.round(value*1000)/10+'%':Math.round(value*10)/10)).join(' · ')+(gem.level===10?' · 召唤'+GEM_BEASTS7[GEMS[gem.type].element]+' Y':'')};
gemArt=function(gem,cls=''){const d=GEMS[gem.type];return `<span class="gem-icon gem-v7 ${gem.level>=7?'gem-exalted':''} ${gem.level>=9?'gem-imperial':''} ${cls}" style="--gem:${d.color};--level:${gem.level}" aria-label="${gemName(gem)}"><i></i><b>${gem.level}</b><em>${WX.names[d.element]}</em></span>`};

function awardGemDrop(e){if(!S||!e?.dead||e.noRewards||e.gemDropped)return false;e.gemDropped=true;const chance=e.boss?1:e.elite?.42:.2;if(Math.random()>=chance)return false;const element=Number.isInteger(e.element)?e.element:Math.floor(Math.random()*5),pool=GEMS.map((gem,i)=>gem.element===element?i:-1).filter(i=>i>=0);const type=Math.random()<.72?pool[Math.floor(Math.random()*pool.length)]:Math.floor(Math.random()*GEMS.length),level=e.boss||e.elite&&Math.random()<.08?2:1;if(!giveGem(type,level))return false;logMessage('拾得 '+gemName({type,level})+'（'+WX.names[GEMS[type].element]+'），已收入宝石包裹。');saveGame(false);return true}
const damageBeforeForge7=enemyDamage;enemyDamage=function(e,amount,source,element,...rest){
 const alive=!e.dead,hp=e.hp,result=damageBeforeForge7(e,amount,source,element,...rest);
 if(alive&&e.hp<hp&&Number.isInteger(source)&&source>=0&&source<5&&owned(source)){const a=actors[source],st=stats(source);if(a.hp>0&&st.gemLeech>0)a.hp=Math.min(st.hp,a.hp+Math.max(0,hp-Math.max(0,e.hp))*st.gemLeech)}
 if(alive&&e.dead)awardGemDrop(e);return result;
};

function equippedSupremeGem7(i){return (S?.heroes[i]?.gear[0]?.sockets||[]).find(gem=>gemValid(gem)&&gem.level===10)||null}
function summonGemBeast(i=S.active,manual=true){
 if(!S||menu||!Number.isInteger(i)||i<0||i>4||!owned(i))return false;const a=actors[i],gem=equippedSupremeGem7(i);
 if(!gem){if(manual)logMessage('武器镶嵌10级天极宝石后可召唤神兽。');return false}
 if(a.hp<=0||(a.gemSummonCd||0)>0||a.mp<60)return false;const targets=enemies.filter(e=>!e.dead&&e.map===currentMap()&&dist(e,a)<650);
 if(!targets.length){if(manual)logMessage('神兽召唤需要650范围内有敌人。');return false}
 const element=GEMS[gem.type].element,st=stats(i),power=st.atk*4+st.int*7+800;a.mp-=60;a.gemSummonCd=90;a.anim='cast';a.animT=1.3;
 for(const e of targets)enemyDamage(e,power,i,element);
 gemSummons7.push({i,element,map:currentMap(),x:a.x,y:a.y,t:12,max:12,pulse:3,power:power*.3});gemSummons7=gemSummons7.slice(-5);
 novaFx.push({x:a.x,y:a.y,t:2,max:2,element,r:440,kind:'ultimate'});screenShake=Math.max(screenShake,7);tone(70,.45,'sawtooth');logMessage('天极神契：'+GEM_BEASTS7[element]+'降临，12秒内继续震击敌人！');refreshBars();return true;
}
const updateBeforeForge7=update;update=function(dt){
 updateBeforeForge7(dt);if(!S||menu)return;
 for(const a of actors)a.gemSummonCd=Math.max(0,(a.gemSummonCd||0)-dt);
 for(const spirit of gemSummons7){spirit.t-=dt;spirit.pulse-=dt;if(spirit.pulse<=0&&spirit.t>0&&spirit.map===currentMap()&&equippedSupremeGem7(spirit.i)&&actors[spirit.i].hp>0){spirit.pulse+=3;const a=actors[spirit.i];spirit.x=a.x;spirit.y=a.y;for(const e of enemies)if(!e.dead&&e.map===spirit.map&&dist(e,spirit)<520)enemyDamage(e,spirit.power,spirit.i,spirit.element);novaFx.push({x:spirit.x,y:spirit.y,t:1,max:1,element:spirit.element,r:300,kind:'spell'})}}
 gemSummons7=gemSummons7.filter(s=>s.t>0&&s.map===currentMap()&&equippedSupremeGem7(s.i)&&actors[s.i].hp>0);
 const button=$('#gemBeast7');if(button){const a=active(),gem=equippedSupremeGem7(S.active);button.disabled=!gem||a.hp<=0||a.mp<60||(a.gemSummonCd||0)>0;button.textContent=gem?'神兽 Y '+((a.gemSummonCd||0)>0?Math.ceil(a.gemSummonCd)+'s':GEM_BEASTS7[GEMS[gem.type].element]):'神兽 Y · 天极宝石'}
};
window.addEventListener('keydown',e=>{if(e.code==='KeyY'&&!e.repeat&&!(e.target instanceof HTMLInputElement)&&!(e.target instanceof HTMLSelectElement)){e.preventDefault();summonGemBeast()}});
const refreshBeforeForge7=refreshBars;refreshBars=function(){refreshBeforeForge7();if(!S)return;const holder=$('#realmSkills');if(holder&&!$('#gemBeast7')){holder.insertAdjacentHTML('beforeend','<button id="gemBeast7" class="gem-summon-button" aria-label="Y 召唤天极神兽">神兽 Y</button>');$('#gemBeast7').onclick=()=>summonGemBeast()}const b=$('#gemBeast7'),gem=equippedSupremeGem7(S.active);if(b){b.hidden=!gem;b.disabled=!gem||(active().gemSummonCd||0)>0;b.textContent='神兽 Y '+((active().gemSummonCd||0)>0?Math.ceil(active().gemSummonCd)+'s':gem?GEM_BEASTS7[GEMS[gem.type].element]:'')}};

const warriorBeforeForge7=drawWarrior;drawWarrior=function(a,mounted=false){
 const pose=warriorBeforeForge7(a,mounted),gems=(S?.heroes[a.i].gear[0]?.sockets||[]).filter(gemValid),level=Math.max(0,...gems.map(gem=>gem.level));if(level<7||a.hp<=0)return pose;
 const gem=gems.find(gem=>gem.level===level),color=level>=9?'#ffe68d':GEMS[gem.type].color,high=S.fxQuality!=='low',cy=mounted?-52:-62;
 g.save();g.globalCompositeOperation='lighter';g.globalAlpha=.45+.12*Math.sin(time*4);g.shadowColor=color;g.shadowBlur=high?24:8;
 if(level>=9){const glow=g.createRadialGradient(0,cy,5,0,cy,80);glow.addColorStop(0,'#fff4b52c');glow.addColorStop(.65,'#ffd85d17');glow.addColorStop(1,'#ffc95c00');ellipse(0,cy,68,96,glow);for(let j=0;j<(high?12:6);j++){const p=(time*.65+j/12)%1,x=Math.sin(j*4.1+time)*26;line(x,cy+55-p*105,x+Math.sin(time*6+j)*5,cy+36-p*105,color,1.2+p*1.5)}g.strokeStyle=color;g.lineWidth=2;g.beginPath();g.ellipse(0,cy+24,48,14,0,time*2,time*2+5);g.stroke()}
 const n=high?level+1:5;for(let j=0;j<n;j++){const p=time*(level>=9?2:1.4)+j*Math.PI*2/n,x=Math.cos(p)*(level>=9?38:24),y=cy+Math.sin(p)*50;ellipse(x,y,level===10?3:2,level===10?7:4,color)}
 if(level===10){g.strokeStyle='#fff7d2';g.lineWidth=1.2;g.beginPath();for(let j=0;j<9;j++){const p=time*.4+j*Math.PI*2/8,x=Math.cos(p)*40,y=cy+Math.sin(p)*62;if(!j)g.moveTo(x,y);else g.lineTo(x,y)}g.stroke()}g.restore();return pose;
};
function drawGemSpirit7(s){
 const c=WX.colors[s.element],a=actors[s.i],phase=time*2,high=S.fxQuality!=='low';g.save();g.translate(a.x,a.y-110);g.globalAlpha=Math.min(.6,s.t*.3);g.globalCompositeOperation='lighter';g.shadowColor=c;g.shadowBlur=high?20:0;
 // A luminous creature silhouette is deliberately separate from the ridden pet.
 const y=-56+Math.sin(phase)*8;ellipse(0,y+34,100,27,c+'22');
 if(s.element===1){for(let j=0;j<12;j++){const u=j/11,x=-105+u*210,yy=y+Math.sin(u*6.5+phase)*26;ellipse(x,yy,17-u*5,12,c+'aa')}poly([[100,y],[120,y-22],[132,y-10],[143,y-17],[130,y+6],[111,y+15]],c);line(115,y-15,112,y-38,'#f1f7dc',2);line(125,y-13,132,y-33,'#f1f7dc',2)}
 else if(s.element===3){for(const side of [-1,1])for(let j=0;j<7;j++){const x=side*(20+j*12),yy=y-20-j*3+Math.sin(phase+j*.3)*16;poly([[side*5,y+10],[x,yy-20],[x+side*13,yy+7]],j%2?c+'aa':'#ffe4a9aa')}ellipse(0,y,15,30,c);poly([[-10,y-17],[0,y-42],[12,y-15]],'#ffe5aa');for(let j=0;j<5;j++)line(0,y+20,Math.sin(phase+j)*25,y+75+j*5,c,3)}
 else if(s.element===2){ellipse(0,y,62,37,c+'99');for(let j=0;j<7;j++){const ang=j*Math.PI/3;line(0,y,Math.cos(ang)*50,y+Math.sin(ang)*26,'#e9f6efaa',2)}ellipse(65,y+5,21,13,c);for(const side of [-1,1])for(let j=0;j<2;j++)ellipse(side*43,y+side*15+j*8,17,10,c)}
 else{ellipse(-5,y,62,24,c+'aa');ellipse(62,y-13,25,24,c);for(let j=0;j<4;j++){const xx=-48+j*27;line(xx,y+13,xx+Math.sin(phase+j)*10,y+49,c,7)}poly([[44,y-28],[46,y-49],[62,y-33],[80,y-41],[79,y-15]],c);if(s.element===4){line(62,y-29,75,y-62,'#fff1b7',3);line(69,y-47,88,y-48,'#fff1b7',2)}else for(let j=0;j<5;j++)line(-40+j*17,y-19,-35+j*17,y+8,'#fff9d866',3);g.strokeStyle=c;g.lineWidth=5;g.beginPath();g.moveTo(-58,y);g.quadraticCurveTo(-102,y-40,-92,y-60+Math.sin(phase)*10);g.stroke()}
 label(GEM_BEASTS7[s.element]+' · 天极神契',0,y-70,'#fff0bd',13);g.restore();
}
const drawBeforeForge7=draw;draw=function(){drawBeforeForge7();if(!S)return;g.save();g.translate(-cam.x,-cam.y);for(const spirit of gemSummons7)if(spirit.map===currentMap())drawGemSpirit7(spirit);g.restore()};

function forgeRelationName7(relation){return ({same:'同气相融',sheng:'五行相生',ke:'五行相克'})[relation]||'同气相融'}
function forgeStoneLabel7(gem){return `${GEMS[gem.type].name} · ${WX.names[GEMS[gem.type].element]} · ${gem.level}级 ×${gem.count}`}
function forgePreviewMarkup7(p){if(!p.pool)return `<p>${p.reason}</p>`;return `<div class="forge7-odds relation-${p.relation}"><div><small>${forgeRelationName7(p.relation)}</small><strong>${Math.round(p.success*1000)/10}%</strong><span>成功率</span></div><div><small>当前幸运</small><b>${p.luck}</b><span>+${Math.round(p.luck*.15*10)/10}%成功率</span></div><div><small>熔炼费用</small><b>${p.cost}</b><span>金币</span></div></div><p><b>成功：</b>消耗两枚材料，随机获得一枚${p.level}级宝石。<b>失败：</b>材料一保留，失去材料二和全部费用。</p><p>可能诞生：${p.pool.map(type=>GEMS[type].name).join('、')}。</p>${p.valid?'':`<p class="forge7-warning">${p.reason}</p>`}`}
forgePanel=function(tab=forgeTab7){
 if(!S)return;forgeTab7=['socket','synthesis','buy','codex'].includes(tab)?tab:'socket';tab=forgeTab7;
 const weapon=S.heroes[S.active].gear[0],luck=forgeLuck7(),gems=gemBag().slice().sort((a,b)=>b.level-a.level||a.type-b.type);
 showDialog(panelHead('五行铸星坊')+`<div class="realm-tabs forge7-tabs">${[['socket','武器镶嵌'],['synthesis','两仪熔炼'],['buy','宝石商店'],['codex','宝石图鉴']].map(([key,label])=>`<button data-forgetab7="${key}" class="${tab===key?'selected':''}">${label}</button>`).join('')}</div><div class="forge-intro"><span>金币 <b>${S.gold}</b></span><span>${HEROES[S.active].name} · ${WX.names[WX.heroElement(S.active)]}</span><span>幸运 <b>${luck}</b></span><span>包裹 <b>${gems.length}/200</b></span></div><div id="forgeContent7"></div>`);
 $('#dialog').querySelectorAll('[data-forgetab7]').forEach(b=>b.onclick=()=>forgePanel(b.dataset.forgetab7));const content=$('#forgeContent7');
 if(tab==='socket'){
  const best=weapon?.sockets?.filter(Boolean).sort((a,b)=>b.level-a.level)[0],level=best?.level||1;
  content.innerHTML=`<div class="weapon-stage forge7-weapon ${level>=9?'imperial-weapon':''}" style="--gem:${best?GEMS[best.type].color:'#a8bac0'};--level:${level}"><div class="weapon-art item-art" style="${weapon?gearStyle(weapon):''}"></div><div><small>武器 · 双孔铭刻</small><h3>${weapon?itemName(weapon):'请先装备武器'}</h3><p>替换与取下免费，旧宝石返回包裹。7级起环绕流光，9级帝辉金焰，10级可按Y召唤神兽；取下后加成与神契消失。</p><div class="socket-row">${[0,1].map(slot=>{const gem=weapon?.sockets?.[slot];return `<div class="socket ${gem?'filled':''}">${gem?gemArt(gem):'<span>◇</span>'}<b>${gem?gemName(gem):'空镶孔 '+(slot+1)}</b>${gem?`<small>${gemEffect(gem)}</small><button data-unsocket7="${slot}">取下宝石</button>`:''}</div>`}).join('')}</div></div></div>${equippedSupremeGem7(S.active)?'<button id="forgeSummon7">召唤天极神兽 Y · 60法力 / 90秒冷却</button>':''}<h3>我的宝石</h3><div class="gem-grid forge7-grid">${gems.map(gem=>`<article>${gemArt(gem)}<h3>${gemName(gem)}</h3><small>${WX.names[GEMS[gem.type].element]} · ${GEM_TIERS7[gem.level-1]} · 持有${gem.count}</small><p>${gemEffect(gem)}</p><div class="actions">${[0,1].map(slot=>`<button data-socket7="${gem.type}:${gem.level}:${slot}" ${!weapon?'disabled':''}>镶孔${slot+1}</button>`).join('')}</div></article>`).join('')||'<p class="empty-state">尚无宝石。可在营地购买，或从妖兽身上收集。</p>'}</div>`;
  $('#dialog').querySelectorAll('[data-socket7]').forEach(b=>b.onclick=()=>{const[t,l,slot]=b.dataset.socket7.split(':').map(Number);if(socketGem(S.active,t,l,slot))forgePanel('socket');else logMessage('镶嵌失败：请检查武器、材料和包裹空间。')});$('#dialog').querySelectorAll('[data-unsocket7]').forEach(b=>b.onclick=()=>{if(unsocketGem(S.active,+b.dataset.unsocket7))forgePanel('socket');else logMessage('宝石堆叠已满，无法取下。')});if($('#forgeSummon7'))$('#forgeSummon7').onclick=()=>{closeDialog();summonGemBeast()};
 }else if(tab==='synthesis'){
  const available=gems.filter(gem=>gem.level<10);content.innerHTML=`<p>两枚同级宝石 → 一枚高一级宝石，最高10级。同种保留名称，混合种类会随机蜕变。相生更易、相克更难，幸运提升成功率。10级理论最少需要512枚1级宝石，失败会提高实际消耗。</p>${available.length?`<div class="forge7-materials"><label>材料一<select id="forgeA7">${available.map(gem=>`<option value="${gem.type}:${gem.level}">${forgeStoneLabel7(gem)}</option>`).join('')}</select></label><span>☯</span><label>材料二 · 必须同级<select id="forgeB7"></select></label></div><div id="forgeOdds7"></div><button id="forgePreview7" class="primary">预览并确认熔炼</button>`:'<p class="empty-state">没有可合成的宝石，前往商店或挑战妖兽收集材料。</p>'}`;
  if(!available.length)return;
  const selectA=()=>$('#forgeA7').value.split(':').map(Number);const updateOdds=()=>{const[t,l]=selectA(),tb=+$('#forgeB7').value,p=gemSynthesisPreview(t,l,tb);$('#forgeOdds7').innerHTML=forgePreviewMarkup7(p);$('#forgePreview7').disabled=!p.valid};
  const updateOptions=()=>{const[t,l]=selectA(),old=+$('#forgeB7').value;$('#forgeB7').innerHTML=gems.filter(gem=>gem.level===l&&(gem.type!==t||gem.count>=2)).map(gem=>`<option value="${gem.type}">${forgeStoneLabel7(gem)}</option>`).join('');if([...$('#forgeB7').options].some(o=>+o.value===old))$('#forgeB7').value=old;updateOdds()};
  $('#forgeA7').onchange=updateOptions;$('#forgeB7').onchange=updateOdds;updateOptions();$('#forgePreview7').onclick=()=>{const[t,l]=selectA(),tb=+$('#forgeB7').value,p=gemSynthesisPreview(t,l,tb);if(!p.valid)return;showDialog(panelHead('两仪熔炼 · 消耗确认')+`<div class="forge7-pair">${gemArt({type:t,level:l})}<span>☯</span>${gemArt({type:tb,level:l})}</div><p>${gemName({type:t,level:l})} + ${gemName({type:tb,level:l})}</p>${forgePreviewMarkup7(p)}<button id="forgeConfirm7" class="primary">支付${p.cost}金币并熔炼</button><button id="forgeCancel7">返回选择</button>`);$('#forgeCancel7').onclick=()=>forgePanel('synthesis');$('#forgeConfirm7').onclick=()=>{const button=$('#forgeConfirm7');button.disabled=true;const result=combineGemPair(t,l,tb);if(!result){forgePanel('synthesis');return}showDialog(panelHead(result.success?'星辉凝成':'熔炼未成')+(result.success?`<div class="forge7-result">${gemArt(result.gem)}</div><h3>${gemName(result.gem)}</h3><p>${gemEffect(result.gem)}</p><p>新宝石已收入包裹。${result.gem.level===10?'天极神契已觉醒：镶嵌后可按Y召唤'+GEM_BEASTS7[GEMS[result.gem.type].element]+'！':''}</p>`:`<div class="forge7-result failed">◇</div><p>材料一 ${gemName({type:t,level:l})} 已保留。材料二和${p.cost}金币已消耗，实际成功率${Math.round(p.success*1000)/10}%。</p>`)+`<button id="forgeDone7">返回两仪熔炼</button>`);$('#forgeDone7').onclick=()=>forgePanel('synthesis')}};
 }else if(tab==='buy'){
  content.innerHTML=`<p>商店出售1–2级宝石。普通怪掉落1–2级，小首领3–4级，大首领5–6级，终极首领7–8级；9–10级需要合成，不会直接掉落天极宝石。</p>${!atCamp()?'<p class="forge7-warning">请抵达营地或地图入口驿站后交易；回城需要卷轴。</p>':''}<div class="gem-grid forge7-grid">${GEMS.map((gem,type)=>`<article>${gemArt({type,level:1})}<h3>${gem.name}</h3><small>${WX.names[gem.element]}属性</small><p>${gemEffect({type,level:1})}</p><div class="actions">${[1,2].map(level=>{const price=Math.ceil(gemShopPrice7(type,level));return `<button data-gembuy7="${type}:${level}" ${!atCamp()||S.gold<price?'disabled':''}>${level}级 · ${price}金</button>`}).join('')}</div></article>`).join('')}</div>`;
  $('#dialog').querySelectorAll('[data-gembuy7]').forEach(b=>b.onclick=()=>{const[t,l]=b.dataset.gembuy7.split(':').map(Number);if(buyGem(t,l))forgePanel('buy')});
 }else{
  content.innerHTML='<p>五行相生：木→火→土→金→水→木；相克：木→土→水→火→金→木。熔炼以材料双方关系计算，战斗遵循进攻方向。当前为游戏平衡规则。</p><div class="forge7-tierline">'+GEM_TIERS7.map((name,i)=>`<span class="${i>=8?'exalted':''}"><b>${i+1}</b>${name}</span>`).join('')+'</div><div class="gem-grid forge7-grid">'+GEMS.map((gem,type)=>`<article>${gemArt({type,level:10})}<h3>${gem.name}</h3><small>${WX.names[gem.element]} · 天极神兽 ${GEM_BEASTS7[gem.element]}</small><p>1级：${gemEffect({type,level:1})}</p><p>10级：${gemEffect({type,level:10})}</p></article>`).join('')+'</div>';
 }
};
// Rebind the persistent HUD control, whose V6 closure is otherwise already correct.
if($('#realmForge'))$('#realmForge').onclick=()=>S&&forgePanel();
