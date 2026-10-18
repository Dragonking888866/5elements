'use strict';
// Original bestiary: painted atlas cells, articulated air/ground motion, and depth cues.
// Species ids 0..18 are preserved so existing pet contracts remain valid.
const V7_BEASTS=[
 {name:'赤羽毕方',element:3,flight:true,move:'wing',biome:'lava',ability:'breath',rarity:2,saddle:[-4,-65],story:'只在赤焰中落脚的独足灵鸟，开口便是一线流火。'},
 {name:'通明泽兽',element:0,flight:false,move:'trot',biome:'forest',ability:'pulse',rarity:2,saddle:[-12,-69],story:'通晓山川灵语的白角兽，最喜欢替旅人辨认宝物。'},
 {name:'青丘九尾',element:1,flight:false,move:'prowl',biome:'forest',ability:'pulse',rarity:2,saddle:[-13,-56],story:'九条尾巴各藏着一个鬼点子，幻术比爪子更危险。'},
 {name:'沧海龙马',element:2,flight:false,move:'gallop',biome:'frost',ability:'pulse',rarity:2,saddle:[-10,-72],story:'踏浪而来的鳞甲龙马，四蹄所过皆有水纹。'},
 {name:'雷泽夔牛',element:0,flight:false,move:'hop',biome:'stone',ability:'pulse',rarity:2,saddle:[-9,-71],story:'独足震地如鼓，吼声可惊散山谷中的雷云。'},
 {name:'逐日天马',element:0,flight:true,move:'wing',biome:'astral',ability:'pounce',rarity:2,saddle:[-13,-65],story:'越过云海的双翼骏马，落地之前总要先绕营地一圈。'},
 {name:'太阴玉兔',element:2,flight:false,move:'hop',biome:'frost',ability:'pulse',rarity:1,saddle:[-8,-52],story:'捣药的小灵兔抱着月光入梦，蹦跃时会洒下星屑。'},
 {name:'幽水旋龟',element:2,flight:false,move:'crawl',biome:'frost',ability:'pulse',rarity:2,saddle:[-9,-53],story:'龟背有流动的水纹，长尾像一条警觉的小蛇。'},
 {name:'鎏金翼狮',element:0,flight:true,move:'wing',biome:'stone',ability:'pounce',rarity:2,saddle:[-10,-66],story:'西境遗迹的守门者，以金翼遮风，以利爪护主。'},
 {name:'烬鳞古龙',element:3,flight:true,move:'wing',biome:'lava',ability:'breath',rarity:3,saddle:[-8,-65],story:'沉睡于火山的古老龙裔，醒来时先打一声喷嚏。'},
 {name:'虹翎羽蛇',element:1,flight:true,move:'glide',biome:'forest',ability:'breath',rarity:2,saddle:[-3,-60],story:'羽翼与鳞片同生的异兽，能在风中游出彩虹。'},
 {name:'霜啸灵狼',element:2,flight:false,move:'prowl',biome:'frost',ability:'breath',rarity:1,saddle:[-13,-62],story:'雪原中的守望者，寒息与低伏的扑击一样迅疾。'},
 {name:'搬山山魈',element:4,flight:false,move:'stomp',biome:'stone',ability:'pounce',rarity:2,saddle:[-9,-76],story:'生着石甲的山中巨猿，捡到石头总想先举起来。'},
 {name:'幻梦蝶',element:1,flight:true,move:'wing',biome:'forest',ability:'pulse',rarity:2,saddle:[-2,-56],story:'蝶翼的斑纹像一场没做完的梦，振翅能扰乱妖气。'},
 {name:'紫霄麒麟',element:4,flight:false,move:'gallop',biome:'astral',ability:'pulse',rarity:3,saddle:[-10,-72],story:'额角映出紫霄星图，蹄下地脉随着心跳共鸣。'},
 {name:'玄角驳兽',element:0,flight:false,move:'gallop',biome:'void',ability:'pounce',rarity:2,saddle:[-10,-68],story:'白身黑尾的独角猛兽，外表温顺，冲锋时气势惊人。'},
 {name:'琥珀灵鼋',element:4,flight:false,move:'crawl',biome:'stone',ability:'pulse',rarity:1,saddle:[-8,-50],story:'壳中封着远古树脂，阳光一照便显出金色纹路。'},
 {name:'双首狱龙',element:3,flight:true,move:'wing',biome:'void',ability:'breath',rarity:3,saddle:[-6,-67],story:'两个脑袋经常拌嘴，喷息时却意外地合拍。'},
 {name:'九曜金凰',element:3,flight:true,move:'wing',biome:'astral',ability:'breath',rarity:3,saddle:[-2,-67],story:'金羽拖着九道光焰，飞过之处像落下一场流星雨。'},
 {name:'巡天星鲸',element:2,flight:true,move:'swim',biome:'astral',ability:'pulse',rarity:3,saddle:[-12,-54],story:'在云层中缓缓游弋的星海巨鲸，把夜空当作海洋。'}
];
const V7_PET_START=19;
// Pivot positions measured against the final 5 x 4 painted atlas (world units).
// Seated hero sprites place their hips roughly 33 px above their drawing origin.
const V7_SADDLE_PIVOTS=[[-4,-65],[-9,-69],[18,-54],[-4,-62],[-8,-88],[6,-59],[0,-54],[4,-68],[4,-56],[1,-59],[-8,-58],[-8,-71],[-7,-82],[24,-54],[-6,-67],[-12,-77],[-10,-86],[1,-66],[10,-60],[-10,-80]];
V7_BEASTS.forEach((p,i)=>{p.saddle=V7_SADDLE_PIVOTS[i]});
const V7_ELEMENT_COLORS=['#efd08a','#8cdda4','#8fd8fa','#ffa276','#d9bd82'];
const V7_ELEMENT_NAMES=['金','木','水','火','土'];
const legacyPetElements=[4,0,2,1,3,2,4,0,1,1,0,3,3,4,2,2,0,1,3];
for(let type=0;type<PETS.length;type++){
 const p=PETS[type];p.element=legacyPetElements[type]??type%5;
 p.flight=[3,4,7,11,12,14,15,17,18].includes(type);
 p.move=p.flight?([3,14,17].includes(type)?'glide':'wing'):type===2?'crawl':'trot';
 p.biome=['forest','stone','frost','forest','lava'][p.element];
 p.ability=[3,4,11,12,15,18].includes(type)?'breath':[8,9,10,14,17].includes(type)?'pulse':'pounce';
}
V7_BEASTS.forEach((p,cell)=>{
 const rarity=p.rarity,hp=30+rarity*45+(p.element===4?55:0),atk=5+rarity*4+(p.element===0?4:0),int=2+rarity*4+(p.element===1||p.element===2?5:0),armor=1+rarity*2+(p.element===4?3:0);
 PETS.push({...p,atlasCell:cell,icon:p.flight?'✧':'♞',color:V7_ELEMENT_COLORS[p.element],hp,atk,int,armor,speed:p.flight?39+rarity*2:p.move==='crawl'?16:28+rarity*3,desc:p.story,bonus:`${V7_ELEMENT_NAMES[p.element]}行 · ${p.flight?'空中灵兽':'陆地灵兽'} · 生命 +${hp} · 攻击 +${atk} · 智力 +${int}`});
});
const V7_MONSTERS=[
 {name:'枯脉树妖',element:1,flight:false,move:'stomp',biome:'forest',kind:'spirit'},
 {name:'锈刃骸卫',element:0,flight:false,move:'trot',biome:'void',kind:'undead'},
 {name:'熔心火魈',element:3,flight:false,move:'hop',biome:'lava',kind:'demon'},
 {name:'寒潭水虺',element:2,flight:false,move:'slither',biome:'frost',kind:'serpent'},
 {name:'裂岩石傀',element:4,flight:false,move:'stomp',biome:'stone',kind:'construct'},
 {name:'夺宝邪修',element:0,flight:false,move:'trot',biome:'forest',kind:'cultivator'},
 {name:'霜灯怨灵',element:2,flight:true,move:'glide',biome:'frost',kind:'undead'},
 {name:'赤砂毒蝎',element:4,flight:false,move:'crawl',biome:'lava',kind:'insect'},
 {name:'断翼石像鬼',element:0,flight:true,move:'wing',biome:'stone',kind:'construct'},
 {name:'蚀心妖僧',element:1,flight:false,move:'trot',biome:'void',kind:'cultivator'},
 {name:'九首渊蛇',element:2,flight:false,move:'slither',biome:'void',kind:'serpent'},
 {name:'铁角食人魔',element:4,flight:false,move:'stomp',biome:'stone',kind:'ogre'},
 {name:'焚翼魔裔',element:3,flight:true,move:'wing',biome:'lava',kind:'demon'},
 {name:'幽烬骨龙',element:0,flight:true,move:'wing',biome:'void',kind:'undead'},
 {name:'翡翠镰螳',element:1,flight:false,move:'crawl',biome:'forest',kind:'insect'},
 {name:'负碑龙龟',element:2,flight:false,move:'stomp',biome:'forest',kind:'boss'},
 {name:'焚山火麟',element:3,flight:false,move:'gallop',biome:'lava',kind:'boss'},
 {name:'雷翎苍鹏',element:0,flight:true,move:'wing',biome:'frost',kind:'boss'},
 {name:'太古岳神',element:4,flight:false,move:'stomp',biome:'stone',kind:'boss'},
 {name:'无相渊魔',element:1,flight:true,move:'glide',biome:'void',kind:'boss'}
];
const V7_MONSTER_POOLS=[[0,5,9,14,3,1],[2,7,12,4,11,5],[3,6,10,1,8,14],[4,8,11,5,7,0],[1,9,10,12,13,6]];
const beastAtlasV7=new Image(),monsterAtlasV7=new Image();
beastAtlasV7.src='assets/beasts-v7.png';monsterAtlasV7.src='assets/monsters-v7.png';
document.documentElement.style.setProperty('--beast-atlas-v7','url("assets/beasts-v7.png")');
document.documentElement.style.setProperty('--monster-atlas-v7','url("assets/monsters-v7.png")');
function v7PetInfo(type){return PETS[type]||PETS[0]}
function v7SpeciesHash(id){let h=0;for(const c of String(id))h=(Math.imul(h,31)+c.charCodeAt(0))>>>0;return h}
function v7MonsterInfo(e){return V7_MONSTERS[e.v7Species]||V7_MONSTERS[e.boss?15+e.z:V7_MONSTER_POOLS[e.z||0][0]]}
function v7AssignMonster(e,id=e.id){const n=e.boss?15+e.z:V7_MONSTER_POOLS[e.z][v7SpeciesHash(id)%V7_MONSTER_POOLS[e.z].length],p=V7_MONSTERS[n];Object.assign(e,{v7Species:n,speciesName:p.name,element:p.element,flight:p.flight,movement:p.move,biome:p.biome});return e}
const makeEnemyBeforeBestiaryV7=makeEnemy;
makeEnemy=function(z,boss,x,y,id){return v7AssignMonster(makeEnemyBeforeBestiaryV7(z,boss,x,y,id),id)};
const worldBeforeBestiaryV7=makeWorld;
makeWorld=function(){worldBeforeBestiaryV7();for(const e of enemies){v7AssignMonster(e);if(e.rift&&e.boss){e.v7Species=19;e.speciesName='星渊 · 无相渊魔';e.element=V7_MONSTERS[19].element;e.flight=true;e.movement='glide';e.biome='void'}}};
const petCardBeforeBestiaryV7=petCardStyle;
petCardStyle=function(type){const cell=PETS[type]?.atlasCell;if(cell===undefined)return petCardBeforeBestiaryV7(type);return `background-image:var(--beast-atlas-v7);background-size:500% 400%;background-position:${cell%5*25}% ${Math.floor(cell/5)*100/3}%`};
function v7CellRect(image,cell,columns=5,rows=4){const sw=image.naturalWidth/columns,sh=image.naturalHeight/rows;return{x:cell%columns*sw,y:Math.floor(cell/columns)*sh,sw,sh}}
// This function crops sprite layers at draw time. No generated source art is modified.
function v7SpritePiece(image,rect,part,x,y,w,h){const [u,v,uw,vh]=part;g.drawImage(image,rect.x+rect.sw*u,rect.y+rect.sh*v,rect.sw*uw,rect.sh*vh,x,y,w,h)}
function v7WingLayer(image,rect,w,h,phase){
 const flap=Math.sin(phase);
 // The atlases face right: the visible wing occupies the upper-left. The head
 // remains in the body layer, rather than being accidentally included in a wing crop.
 g.save();g.translate(-w*.05,-h*.58);g.rotate(-.04-flap*.11);g.scale(1,.82+flap*.22);
 v7SpritePiece(image,rect,[.0,.03,.60,.60],-w*.45,-h*.39,w*.60,h*.60);g.restore();
}
function v7DrawCreature(image,cell,height,pose,foreground=false,columns=5,rows=4){
 const rect=v7CellRect(image,cell,columns,rows),w=height*rect.sw/rect.sh,h=height,flight=pose.flight,phase=pose.phase||0;
 if(foreground){g.save();g.beginPath();g.rect(w*.17,-h,w*.34,h);g.clip();v7SpritePiece(image,rect,[0,0,1,1],-w/2,-h,w,h);g.restore();return}
 if(flight&&pose.move==='wing')v7WingLayer(image,rect,w,h,phase*1.45);
 // Body bends around its saddle; leg strips plant on alternating beats.
 const split=flight?.86:.75;
 g.save();g.rotate(pose.pitch||0);
 if(flight&&pose.move==='wing'){
  g.beginPath();for(const [j,point]of [[.40,.22],[.70,.07],[1,.03],[1,1],[0,1],[0,.69],[.35,.60]].entries()){const x=(point[0]-.5)*w,y=(point[1]-1)*h;if(j===0)g.moveTo(x,y);else g.lineTo(x,y)}g.closePath();g.clip();
 }
 v7SpritePiece(image,rect,[0,0,1,split],-w/2,-h,w,h*split);g.restore();
 const legs=pose.move==='hop'?2:4;
 for(let j=0;j<legs;j++){const stride=phase+(j%2?Math.PI:0)+(j<2?.4:0),step=pose.moving?Math.sin(stride):0,lift=pose.moving?Math.max(0,Math.cos(stride))*4:0;g.save();g.translate((j+.5)*w/legs-w/2,-h*(1-split));g.rotate(pose.moving?step*.07:0);v7SpritePiece(image,rect,[j/legs,split,1/legs,1-split],-w/legs/2+step*3,-lift,w/legs,h*(1-split));g.restore()}
 if(flight&&['glide','swim'].includes(pose.move)){const tail=Math.sin(phase*.7)*.08;g.save();g.translate(-w*.26,-h*.42);g.rotate(tail);v7SpritePiece(image,rect,[0,.35,.31,.4],-w*.24,-h*.23,w*.31,h*.4);g.restore()}
}
function v7MountState(type,a){const p=v7PetInfo(type),clock=typeof renderClock==='number'?renderClock:time,moving=(a.motion||0)>.5,phase=(a.gait||0)+clock*(p.flight?3.8:.35),anim=a.petAnim||0,pulse=anim>0?Math.sin(clamp(1-anim/1.25,0,1)*Math.PI):0;
 const elevation=p.flight?21+Math.sin(clock*2.4+a.i)*4:0,hop=p.move==='hop'&&moving?-Math.abs(Math.sin(phase))*8:0;
 return{phase,moving,flight:p.flight,move:p.move,elevation,bob:(p.flight?Math.sin(phase*.5)*2:moving?-Math.abs(Math.sin(phase))*3:Math.sin(clock*1.8)*.8)-elevation+hop-(a.petMode==='roar'?pulse*7:0),pitch:(moving?Math.sin(phase*2)*.025:0)+(a.petMode==='pounce'?pulse*.06:a.petMode==='roar'?-pulse*.06:0),saddleX:p.saddle?.[0]??-8,saddleY:p.saddle?.[1]??-60,lunge:a.petMode==='pounce'?pulse*19:0,pulse};
}
const mountBeforeBestiaryV7=drawMount;
drawMount=function(type,a,foreground=false){const pet=v7PetInfo(type),p=v7MountState(type,a),isNew=pet.atlasCell!==undefined;
 if(!foreground&&pet.flight){g.save();g.globalAlpha=.32;ellipse(0,6,51-p.elevation*.28,12,'#000b17');g.globalAlpha=.35;line(-20,3,20,3,pet.color,1);g.restore()}
 if(!isNew&&!pet.flight)return mountBeforeBestiaryV7(type,a,foreground);
 const mapped=pet.art??type,legacyArt=petArtType(mapped),image=isNew?beastAtlasV7:mapped>=12?fusionAtlas:petAtlas,columns=isNew?5:mapped>=12?3:4,rows=isNew?4:mapped>=12?1:3,cell=isNew?pet.atlasCell:mapped>=12?mapped-12:legacyArt;
 if(!isNew){p.saddleX=SADDLES[legacyArt][0];p.saddleY=SADDLES[legacyArt][1]}
 if(!image.complete||!image.naturalWidth){g.save();g.translate(0,-p.elevation);const fallback=isNew?(pet.element===2?2:pet.element===3?4:0):type,out=mountBeforeBestiaryV7(fallback,a,foreground);g.restore();out.bob-=p.elevation;return out}
 g.save();g.translate(p.lunge,p.bob);g.rotate(p.pitch);const h=isNew?(pet.move==='swim'?120:pet.flight?135:126):118;
 v7DrawCreature(image,cell,h,{...p,pitch:0},foreground,columns,rows);
 if(!foreground){
  g.strokeStyle='#927451';g.lineWidth=3;g.beginPath();g.ellipse(p.saddleX,p.saddleY+4,15,5,0,0,7);g.stroke();
  if(p.pulse>.04){g.save();g.globalCompositeOperation='lighter';g.globalAlpha=p.pulse*.75;const mouthX=43,mouthY=-h*.59;
   if(a.petMode==='roar'){for(let n=0;n<3;n++){g.strokeStyle=pet.color;g.lineWidth=2;g.beginPath();g.arc(mouthX,mouthY,14+n*11+p.pulse*12,-.85,.85);g.stroke()}}
   else if(a.petMode==='breath'){for(let n=0;n<10;n++){const q=(time*1.8+n/10)%1;ellipse(mouthX+q*75,mouthY+Math.sin(q*6+n)*q*14,5+q*7,3+q*5,n%3?pet.color:'#fff1bb')}}
   else if(a.petMode==='pounce'){for(let n=0;n<3;n++)line(35+n*9,-30,55+n*9+p.pulse*12,-58,pet.color,2)}else circle(43,-65,18+p.pulse*20,pet.color,2);g.restore()}
  if(pet.rarity>=3){g.save();g.globalAlpha=.55;g.globalCompositeOperation='lighter';for(let j=0;j<6;j++){const q=time*2+j;ellipse(Math.cos(q)*47,-40+Math.sin(q)*18,1.5,3,pet.color)}g.restore()}
 }
 g.restore();const sx=p.saddleX,sy=p.saddleY;p.saddleX=sx*Math.cos(p.pitch)-sy*Math.sin(p.pitch)+p.lunge;p.saddleY=sy*Math.cos(p.pitch)+sx*Math.sin(p.pitch);return p;
};
// Keep the player's existing skill and gem effects, while this pet-specific skill selection
// gives new species their correct breath / claw / spirit attacks.
const petAbilityBeforeBestiaryV7=petAbility;
petAbility=function(i=S?.active,manual=true){const pet=S&&petOf(i),pd=pet&&v7PetInfo(pet.type);if(!pd||pet.type<V7_PET_START)return petAbilityBeforeBestiaryV7(i,manual);
 if(!S||menu||!owned(i))return false;const a=actors[i];if(a.hp<=0||a.petCd>0)return false;
 const target=nearestEnemy(a,manual?470:330);if(!target){if(manual){a.petMode='roar';a.petAnim=1.25;a.petCd=2;petFx.push({kind:'roar',x:a.x,y:a.y-65-(pd.flight?22:0),color:pd.color,t:1.1,max:1.1})}return false}
 const kind=pd.ability,power=stats(i).atk*.75+pet.lv*5+(pet.fusion?.stars||0)*35;a.petCd=manual?8:11;a.petMode=kind;a.petAnim=1.25;a.face=target.x>=a.x?1:-1;
 petFx.push({kind,x:a.x+a.face*47,y:a.y-70-(pd.flight?22:0),tx:target.x,ty:target.y-35,color:pd.color,t:1.8,max:1.8,seed:pet.id});
 const radius=kind==='breath'?105:kind==='pulse'?135:0,targets=enemies.filter(e=>e.map===currentMap()&&!e.dead&&(e===target||dist(e,target)<radius));for(const e of targets)enemyDamage(e,power*(kind==='pulse'?.7:kind==='breath'?.85:1.1),i,pd.element);tone(kind==='breath'?95:220,.15,'triangle');return true;
};
$('#petAction').onclick=()=>{petAbility();refreshBars()};
const enemyDrawBeforeBestiaryV7=drawEnemy;
drawEnemy=function(e){if(!S||e.map!==currentMap()||e.dead&&e.deathT<=0)return;if(!monsterAtlasV7.complete||!monsterAtlasV7.naturalWidth){enemyDrawBeforeBestiaryV7(e);return}
 const spec=v7MonsterInfo(e),height=e.boss?220:e.elite?112:91,phase=(e.gait||0)+renderClock*(spec.flight?3.3:.8),moving=Math.hypot(e.dx||0,e.dy||0)>.2,strike=e.strike?Math.sin(clamp(1-e.strike.t/(e.boss?.5:.34),0,1)*Math.PI):0,hover=spec.flight?17+Math.sin(renderClock*2.2+e.x)*5:0;
 g.save();g.translate(e.x,e.y);ellipse(0,7,e.boss?70:spec.flight?25:27,e.boss?23:9,'#03101899');if(e.dead){g.globalAlpha=clamp(e.deathT/.65,0,1);g.rotate((1-e.deathT/.65)*.85)}
 const col=V7_ELEMENT_COLORS[e.element];g.save();g.translate((e.hitT>0?Math.sin(e.hitT*100)*4:0)+(e.x<active().x?1:-1)*strike*(e.boss?15:10),-hover+(moving?Math.sin(phase)*2:Math.sin(phase)*.8));g.scale(e.x<active().x?1:-1,1);
 if(e.wind){g.globalAlpha=.6;circle(0,-height*.42,e.boss?85:35,col+'77',2);g.globalAlpha=1}
 v7DrawCreature(monsterAtlasV7,e.v7Species??(e.boss?15+e.z:0),height,{phase,moving,flight:spec.flight,move:spec.move,pitch:-strike*.06});
 if(e.strike){g.globalAlpha=strike*.7;g.strokeStyle=col;g.lineWidth=e.boss?4:2;g.beginPath();g.arc(30,-height*.4,height*.35,-1.5,1.2);g.stroke();g.globalAlpha=1}g.restore();
 if(!e.dead){const y=-height-hover-15;label((e.elite&&!e.boss?'精英 · ':'')+(e.speciesName||spec.name)+' Lv.'+e.level,0,y,e.boss?'#f7d7a1':'#d7d7c4',e.boss?14:10);label(V7_ELEMENT_NAMES[e.element]+'行'+(spec.flight?' · 飞行':''),0,y-16,col,e.boss?11:9);rr(-30,y+7,60,4,2,'#102828');rr(-30,y+7,60*clamp(e.hp/e.max,0,1),4,2,'#e79578');
 if(e.boss&&!e.rift&&S.kills[e.z]<ZONES[e.z].need){circle(0,-height*.45,100,'#a5d8e366',2);label('灵脉屏障',0,y-33,'#b4d7d5',10)}if(e.shield>0)circle(0,-height*.45,e.boss?100:44,'#badcffaa',2);if(e.guardT>0)label('招架',0,y-32,'#edd4a3',11);
 if(e.root>0){for(let j=0;j<3;j++)line(-24+j*23,4,-16+j*18,-24,'#90bc88',3)}if(e.slow>0)ellipse(0,5,e.r+10,(e.r+10)*.4,'#93d6ff44');if(e.burn>0)for(let j=0;j<5;j++)ellipse(Math.sin(time*5+j)*22,-18-j*10,3,8,'#ffae6488')}
 g.restore();
};
const mapDrawBeforeBestiaryV7=drawMap;
drawMap=function(){mapDrawBeforeBestiaryV7();if(!S)return;const id=currentMap();
 // Raised ruin plinths, contact shadows and vertically lit prisms provide 2.5D relief.
 if(id)for(let j=0;j<9;j++){const x=950+(j*473+id*97)%3500,y=550+(j*317+id*151)%2300;if(x<cam.x-120||x>cam.x+VW+120||y<cam.y-80||y>cam.y+VH+120||!walkable(x,y,60))continue;const h=28+j%3*17,c=MAPS[id].accent;ellipse(x+11,y+9,36,12,'#07121d77');poly([[x-19,y],[x+18,y-7],[x+18,y-h-7],[x-19,y-h]],id===2?'#57312a':'#38474c');poly([[x+18,y-7],[x+32,y-17],[x+32,y-h-17],[x+18,y-h-7]],'#182a32');poly([[x-19,y-h],[x+18,y-h-7],[x+32,y-h-17],[x-4,y-h-11]],c+'77');line(x-17,y-h+1,x+17,y-h-6,c+'88',1)}
};
const drawBeforeBestiaryV7=draw;
draw=function(){drawBeforeBestiaryV7();if(!S)return;g.save();const fog=g.createLinearGradient(0,0,0,VH);fog.addColorStop(0,'#0a182a24');fog.addColorStop(.30,'#00000000');fog.addColorStop(.8,'#00000000');fog.addColorStop(1,'#040b181c');g.fillStyle=fog;g.fillRect(0,0,VW,VH);g.restore()};
