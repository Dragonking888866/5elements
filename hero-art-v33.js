'use strict';
// Coherent, fully authored pose sprites. These replace the V29–32 cut-up mannequins.
// All renderer state is ephemeral; canonical heroes, equipment, damage and saves are read-only.
const outfits33=new Map(),skins33=new Map();
const legacyHero32For33=drawHero,legacyRider32For33=rider32;
const OUTFIT_KEYS33=['q0','q1','q2','q3','q4','q5','q6','set1','set2','set3','set4'];
function outfitKey33(part){return part?.set?'set'+part.set:'q'+(part?.quality??0)}
function outfitImage33(key){if(!outfits33.has(key)){const im=new Image();im.src='assets/heroes-'+key+'-v33.png';outfits33.set(key,im)}return outfits33.get(key)}
outfitImage33('q0');
function outfitReady33(key){const im=outfitImage33(key);return !!(im.complete&&im.naturalWidth&&HERO_ATLAS33[key])}
const POSE_HEIGHT33={idle:142,contactA:122,passingA:134,contactB:122,passingB:134,windup:145,strike:128,ride:119};
// Normalised coordinates are per-pose, not screen coordinates. Weapon and skin share their transform.
const POSE_ANCHORS33={
 idle:{grip:[.94,.52],off:[.42,.48],head:[.73,.13],seat:[.60,.61],angle:.22},
 contactA:{grip:[.92,.34],off:[.39,.50],head:[.68,.14],seat:[.57,.56],angle:.42},
 passingA:{grip:[.93,.37],off:[.42,.53],head:[.69,.15],seat:[.57,.57],angle:.33},
 contactB:{grip:[.94,.39],off:[.43,.54],head:[.70,.15],seat:[.58,.56],angle:.28},
 passingB:{grip:[.93,.36],off:[.42,.52],head:[.70,.15],seat:[.57,.56],angle:.35},
 windup:{grip:[.49,.035],off:[.93,.48],head:[.68,.22],seat:[.57,.64],angle:-1.0},
 strike:{grip:[.965,.21],off:[.65,.45],head:[.68,.17],seat:[.56,.58],angle:1.72},
 ride:{grip:[.82,.36],off:[.56,.37],head:[.61,.12],seat:[.48,.54],angle:.12}
};
function heroPose33(a,mounted=false,clock=0){
 const state=heroPose11(a),moving=(a.motion||0)>.5,phase=Number.isFinite(a.gait)?a.gait:0;
 let name='idle',progress=state==='attack'?clamp((.44-(a.animT||0))/Math.min(.44,Math.max(.10,stats(a.i).interval*.85)),0,1):state==='cast'||state==='rebirth'?clamp(1-(a.animT||0)/.55,0,1):0;
 if(mounted)name='ride';
 else if(state==='attack'){name=progress<.28?'windup':progress<.82?'strike':'idle'}
 else if(state==='cast'||state==='rebirth'){name=progress<.42?'windup':progress<.88?'strike':'idle'}
 else if(state==='run'){const part=((phase/(Math.PI*2))%1+1)%1;name=['contactA','passingA','contactB','passingB'][Math.floor(part*4)]}
 else if(state==='hit')name='windup';
 return {state,moving,phase,mounted,name,progress,clock,anchors:POSE_ANCHORS33[name],height:POSE_HEIGHT33[name],attack:state==='attack',cast:state==='cast'||state==='rebirth'};
}
function poseCell33(key,hero,pose){const meta=HERO_ATLAS33[key];if(!meta)return null;const rows=meta.rows,runRows=rows-4,ids={idle:0,contactA:1,passingA:2,contactB:runRows>=3?3:1,passingB:runRows>=4?4:2,windup:rows-3,strike:rows-2,ride:rows-1};return meta.cells[ids[pose.name]*5+hero]}
function skin33(key,hero,pose){
 const im=outfitImage33(key),cell=poseCell33(key,hero,pose);if(!cell||!im.complete||!im.naturalWidth)return null;
 const id=key+':'+hero+':'+cell.cell[1];if(skins33.has(id))return skins33.get(id);
 const b=cell.box,cv=document.createElement('canvas');cv.width=b[2]+6;cv.height=b[3]+6;const c=cv.getContext('2d');
 c.save();c.beginPath();const cx=b[0]+b[2]/2,cy=b[1]+b[3]/2;
 cell.poly.forEach(([x,y],i)=>{const dx=x-cx,dy=y-cy,l=Math.hypot(dx,dy)||1,px=x-b[0]+3+dx/l*2,py=y-b[1]+3+dy/l*2;i?c.lineTo(px,py):c.moveTo(px,py)});c.closePath();c.clip();c.drawImage(im,b[0]-3,b[1]-3,cv.width,cv.height,0,0,cv.width,cv.height);c.restore();
 const result={image:cv,cell,key,width:cv.width,height:cv.height};if(skins33.size>=100)skins33.delete(skins33.keys().next().value);skins33.set(id,result);return result;
}
// A continuous mesh moves fabric and breathing without detaching anatomy or stretching body pieces.
function rawDeformHero33(u,v,pose){
 let x=u,y=v;const breath=Math.sin(pose.clock*2.1)*.003,cloth=Math.max(0,(.47-u)/.47)*(1-Math.max(0,(v-.82)/.18));
 x-=cloth*Math.sin(pose.clock*3+v*4)*(pose.moving?.010:.004);y-=Math.sin(v*Math.PI)*breath;
 if(pose.mounted){const top=clamp((.57-v)/.45,0,1),sway=pose.moving?Math.sin(pose.phase*2)*.012:Math.sin(pose.clock*2)*.003;x-=top*sway;
  if(pose.attack||pose.cast){const t=pose.progress,dx=u-pose.anchors.grip[0],dy=v-pose.anchors.grip[1],weight=Math.exp(-(dx*dx+dy*dy)/.018),pull=Math.sin(t*Math.PI);x+=pull*.07*weight;y-=pull*.14*weight}
 }
 return {x,y};
}
function deformHero33(u,v,pose){const p=rawDeformHero33(u,v,pose);if(pose.mounted){const s=pose.anchors.seat,d=rawDeformHero33(s[0],s[1],pose);p.x-=d.x-s[0];p.y-=d.y-s[1]}return p}
function spriteGeometry33(skin,pose){const scale=pose.height/skin.height,W=skin.width*scale,H=pose.height,origin=pose.mounted?pose.anchors.seat:[.60,1];return {W,H,ox:origin[0]*W,oy:origin[1]*H}}
function spritePoint33(skin,pose,point){const d=deformHero33(point[0],point[1],pose),r=spriteGeometry33(skin,pose);return{x:d.x*r.W-r.ox,y:d.y*r.H-r.oy}}
function drawSkin33(skin,pose){
 const r=spriteGeometry33(skin,pose),n=S.fxQuality==='low'?3:pose.mounted?5:3;
 const dest=(u,v)=>{const p=deformHero33(u,v,pose);return{x:p.x*r.W-r.ox,y:p.y*r.H-r.oy}},src=(u,v)=>({x:u*skin.width,y:v*skin.height});
 for(let j=0;j<n;j++)for(let i=0;i<n;i++){const u=i/n,v=j/n,U=(i+1)/n,V=(j+1)/n;textureTriangle32(skin.image,[src(u,v),src(U,v),src(U,V)],[dest(u,v),dest(U,v),dest(U,V)]);textureTriangle32(skin.image,[src(u,v),src(U,V),src(u,V)],[dest(u,v),dest(U,V),dest(u,V)])}
}
function weapon33(part,pose){
 if(!part||!weaponAtlas31.complete||!weaponAtlas31.naturalWidth)return;
 if(part.kind==='bow')return drawWeapon29(part,pose.clock,pose.state);
 const col={blade:0,staff:1,glaive:2,saber:3,hammer:4,bow:1}[part.kind]??family30(part),im=weaponAtlas31,sw=im.naturalWidth/5,sh=im.naturalHeight/7,q=part.quality,H=(col===1||col===2?91:76)+q*1.6,W=H*sw/sh;
 const b=WEAPON_ATLAS33.cells[q*5+col].box,scale=H/sh,gx=col*sw+sw*.5,gy=q*sh+sh*.83;
 g.drawImage(im,...b,(b[0]-gx)*scale,(b[1]-gy)*scale,b[2]*scale,b[3]*scale);
 if(S.gearGlow!==false){for(let j=0;j<part.gems.length;j++)jewel29(0,-15-j*6,part.gems[j].color,1.6+part.gems[j].quality*.18);if(q>=4){g.save();g.globalCompositeOperation='lighter';g.globalAlpha=.22;g.shadowColor=part.palette.energy;g.shadowBlur=3;line(0,-25,0,-H*.72,part.palette.energy,1);g.restore()}}
}
// Restore the original painted equipment illustrations, with anatomical-sized socket transforms.
function gearPiece33(part,column,x,y,H,angle=0){if(!part||!gearAtlas.complete||!gearAtlas.naturalWidth)return;const q=part.quality,row=part.set===1?1:part.set===2?2:part.set===3?3:part.set===4?0:q>=5?3:q>=3?2:q>=1?1:0,sw=gearAtlas.naturalWidth/6,sh=gearAtlas.naturalHeight/4,W=H*sw/sh;g.save();g.translate(x,y);g.rotate(angle);g.drawImage(gearAtlas,column*sw,row*sh,sw,sh,-W/2,-H/2,W,H);g.restore()}
function drawWarrior33(a,mounted=false,layer='all'){
 if(!S?.heroes?.[a.i])return poseFor(a,mounted);if(mounted&&typeof drawMountedWarrior34==='function')return drawMountedWarrior34(a,layer);
 const clock=Number.isFinite(visualClock11)?visualClock11:time,pose=heroPose33(a,mounted,clock),spec=appearanceSpec29(a.i),requested=outfitKey33(spec.parts[1]);outfitImage33(requested);
 const key=outfitReady33(requested)?requested:outfitReady33('q0')?'q0':null,skin=key&&skin33(key,a.i,pose);
 if(!skin){if(layer!=='far')drawHeroCell(a.i,mounted?5:pose.state==='run'?1+Math.floor(pose.phase*1.5)%2:pose.attack?3:pose.cast?4:0,0,mounted?54:0,mounted?119:142);return poseFor(a,mounted)}
 pose.anchors={...pose.anchors,grip:skin.cell.grip||pose.anchors.grip};
 const geometry=spriteGeometry33(skin,pose),grip=spritePoint33(skin,pose,pose.anchors.grip),head=spritePoint33(skin,pose,pose.anchors.head),off=spritePoint33(skin,pose,pose.anchors.off);
 g.save();if(a.hp<=0){g.globalAlpha*=.55;g.translate(10,7);g.rotate(1.25)}if(a.guard>0)g.rotate(-.035);if(a.dodge>0)g.rotate(-.15);
 if(!mounted)g.translate(0,pose.moving?0:Math.sin(clock*2.1+a.i)*.55);
 if(mounted&&layer!=='all'){const r=geometry,x=(u)=>u*r.W-r.ox,y=(v)=>v*r.H-r.oy;g.beginPath();if(layer==='near')g.rect(-300,-300,600,600);const poly=[[.46,.62],[.64,.61],[.79,.99],[.57,1.02]];poly.forEach(([u,v],i)=>i?g.lineTo(x(u),y(v)):g.moveTo(x(u),y(v)));g.closePath();g.clip(layer==='near'?'evenodd':'nonzero')}
 if(layer!=='far'){
  g.save();g.translate(grip.x,grip.y);let angle=pose.anchors.angle;if(mounted&&(pose.attack||pose.cast))angle+=Math.sin(pose.progress*Math.PI)*1.3;g.rotate(angle);weapon33(spec.parts[0],pose);g.restore();
 }
 drawSkin33(skin,pose);
 if(layer!=='far'){
  // A matching outfit already includes its designed headwear. Only a mixed helmet replaces it.
  if(spec.parts[3]&&(spec.parts[3].quality!==(spec.parts[1]?.quality??0)||spec.parts[3].set!==(spec.parts[1]?.set??0)))gearPiece33(spec.parts[3],3,head.x-1,head.y+1,23,pose.name==='strike'?.09:pose.name.startsWith('contact')?.06:0);
  gearPiece33(spec.parts[4],4,off.x-4,off.y+10,43,a.guard>0?-.2:.08);
  const chest=spritePoint33(skin,pose,[pose.anchors.seat[0]+.025,pose.anchors.seat[1]-.25]);gearPiece33(spec.parts[2],2,chest.x,chest.y,13);
 }
 // Restore only the tiny original fist over the weapon handle: same image/UV/mesh as the body.
 if(layer!=='far'&&spec.parts[0]){const rad=5,sc=pose.height/skin.height;g.save();g.beginPath();g.ellipse(grip.x,grip.y,3.5,3.5,0,0,Math.PI*2);g.clip();g.drawImage(skin.image,pose.anchors.grip[0]*skin.width-rad,pose.anchors.grip[1]*skin.height-rad,rad*2,rad*2,grip.x-rad*sc,grip.y-rad*sc,rad*2*sc,rad*2*sc);g.restore()}
 g.restore();return poseFor(a,mounted);
}
drawWarrior=drawWarrior33;
// Existing callers (hero centre, comparisons, companion portraits) inherit the same seat binding.
rider32=function(a,p,layer){g.save();g.translate(p.saddleX,p.saddleY+p.bob);g.rotate(p.pitch*.75);drawWarrior33(a,true,layer);g.restore()};
function drawMounted33(a,pet){const p=mountRigPose32(pet.type,a);rider32(a,p,'far');drawMount(pet.type,a,false);rider32(a,p,'near');drawMount(pet.type,a,true);return p}
drawHero=function(a){
 if(!S||!owned(a.i)||a.map19!==undefined&&a.map19!==currentMap())return;const pet=a.hp>0&&!companion11(a)?petOf(a.i):null;
 g.save();g.translate(a.x,a.y);ellipse(0,7,pet?48:25,pet?15:9,'#04141399');if(selection.includes(a.i))floorRing11(0,8,pet?48:28,a.i===S.active?'#e7d598':'#92dfad');
 // A direction switch mirrors the full hierarchy together; never squash the body while turning.
 g.scale((a.face??1)<0?-1:1,1);if(pet)drawMounted33(a,pet);else drawWarrior33(a,false);g.restore();
 const h=S.heroes[a.i],y=a.y-(pet?171:158);label(HEROES[a.i].name+' Lv.'+h.lv+(h.job>=0?' · '+CAREERS[a.i][h.job]:''),a.x,y,HEROES[a.i].color,11);rr(a.x-25,y+6,50,4,2,'#092522');rr(a.x-25,y+6,50*clamp(a.hp/stats(a.i).hp,0,1),4,2,'#9dd6ad');
 if(a.shield>0)circle(a.x,a.y-50,58,'#9edfe766',2);
};
paintAppearance29=function(cv,hero,clock,mode,override){const ctx=cv?.getContext?.('2d');if(!ctx)return;const old={g,time,visualClock11,renderClock};cv.width=440;cv.height=340;try{g=ctx;time=visualClock11=renderClock=clock;const bg=g.createRadialGradient(220,210,5,220,210,260);bg.addColorStop(0,'#243e42');bg.addColorStop(1,'#09111c');g.fillStyle=bg;g.fillRect(0,0,440,340);g.save();g.translate(205,306);g.scale(1.7*appearanceFace29,1.7);const a=previewActor29(hero,clock,mode),pet=mode==='ride'?petOf(hero):null,draw=()=>pet?drawMounted33(a,pet):drawWarrior33(a,mode==='ride');if(override)withGear28(hero,override.slot,override.item,draw);else draw();g.restore()}finally{g=old.g;time=old.time;visualClock11=old.visualClock11;renderClock=old.renderClock}};
// Restore the seven genuinely different weapon constructions removed by V32's shared premium blade.
const styleBefore33=gearStyle;gearStyle=function(it){if(it?.slot===0)return gearStyleBefore32(it);return styleBefore33(it)};
