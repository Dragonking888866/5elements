'use strict';
function atmosphere39(c,f,W,H,t,b){
 const p=PALETTES39[f.spec39.family],r=W*.5;
 c.save();c.translate(0,-H*.29);c.scale(1,H/W);
 const grad=c.createRadialGradient(0,0,r*.12,0,0,r);
 grad.addColorStop(0,p[0]+'12');grad.addColorStop(.42,p[1]+'36');grad.addColorStop(.76,p[2]+'39');grad.addColorStop(1,p[1]+'00');
 c.fillStyle=grad;c.beginPath();for(let j=0;j<=40;j++){const a=j/40*Math.PI*2,rr=r*(.96+.025*Math.sin(a*5+t)+.015*Math.sin(a*11-t*2));j?c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):c.moveTo(Math.cos(a)*rr,Math.sin(a)*rr)}c.closePath();c.fill();c.restore();
 // Sparse drifting texture is subordinate to the skill's unique silhouette.
 if(b.detail>0)for(let j=0;j<4;j++)alpha39(c,.06,()=>{const a=j*2.399+t*.2;ellipse39(c,Math.cos(a)*W*.27,-H*.28+Math.sin(a)*H*.2,W*.2,H*.09,p[2],a*.1)});
}
function rune39(c,x,y,size,t,color,count=9){
 c.save();c.translate(x,y);c.scale(1,.5);c.rotate(t*.13);
 for(let j=0;j<count;j++){const a=j/count*Math.PI*2,r=size;
  c.save();c.translate(Math.cos(a)*r,Math.sin(a)*r);c.rotate(a+Math.PI/2);
  path39(c,[[-7,-10],[7,-10],[0,-3],[-5,3],[6,8],[0,13]],color,1.4);c.restore();
 }
 c.restore();
}
function crack39(c,x,y,L,angle,pal,seed,progress=1,width=4){
 c.save();c.translate(x,y);c.rotate(angle);const pts=[];
 for(let j=0;j<=9;j++){const u=j/9;if(u>progress)break;pts.push([L*u,Math.sin(j*3.12+seed)*L*.045])}
 if(pts.length>1){path39(c,pts,pal[0],width+4);path39(c,pts,pal[2]+'aa',width*.4);
 for(let j=2;j<pts.length-1;j+=2){const a=pts[j];path39(c,[a,[a[0]+L*.07,a[1]+Math.sin(j+seed)*L*.12]],pal[1]+'aa',1.2)}}
 c.restore();
}
function sword39(c,x,y,h,a,pal,alpha=1){
 alpha39(c,alpha,()=>{c.save();c.translate(x,y);c.rotate(a);const w=h*.08,grad=c.createLinearGradient(-w,0,w,0);
 grad.addColorStop(0,pal[1]);grad.addColorStop(.45,pal[3]);grad.addColorStop(.55,pal[2]);grad.addColorStop(1,pal[0]);
 path39(c,[[0,-h],[-w,-h*.28],[-w*.7,0],[w*.7,0],[w,-h*.28]],grad,1,true);
 path39(c,[[-w*2,1],[0,7],[w*2,1]],pal[2],3);path39(c,[[0,5],[0,21]],pal[0],5);path39(c,[[0,-h*.9],[0,-h*.15]],pal[3]+'aa',1);c.restore()});
}
function rock39(c,x,y,w,h,pal,alpha=1){alpha39(c,alpha,()=>{
 const grad=c.createLinearGradient(x-w,y-h,x+w,y);grad.addColorStop(0,pal[2]);grad.addColorStop(.35,pal[1]);grad.addColorStop(1,pal[0]);
 path39(c,[[x-w,y],[x-w*.6,y-h*.7],[x-w*.1,y-h],[x+w*.45,y-h*.79],[x+w,y-h*.2],[x+w*.5,y+3]],grad,1,true);
 path39(c,[[x-w*.1,y-h],[x+w*.45,y-h*.79],[x+w*.3,y-h*.25],[x-w*.3,y-h*.35]],pal[2]+'77',1,true);
 crack39(c,x-w*.2,y-h*.35,w*.9,.25,pal,2,1,1);
})}
function tree39(c,W,H,t,grow,pal,detail){
 c.save();c.translate(0,-H*.04);const height=H*.78*grow;
 // A branching trunk is a structured silhouette, not a recoloured wind funnel.
 for(let side=-1;side<=1;side+=2){c.strokeStyle=pal[0];c.lineWidth=W*.045;c.beginPath();c.moveTo(side*W*.06,0);c.bezierCurveTo(side*W*.14,-height*.28,-side*W*.08,-height*.6,side*W*.08,-height);c.stroke();
 c.strokeStyle=pal[1];c.lineWidth=W*.021;c.stroke();
 for(let j=0;j<5+detail;j++){const u=.2+j/(6+detail)*.7,bx=side*W*(.12+.25*u),by=-height*(.35+u*.55);c.lineWidth=7*(1-u)+2;c.beginPath();c.moveTo(side*W*.04,-height*u*.95);c.bezierCurveTo(side*W*.14,-height*u,bx,by+height*.1,bx,by);c.stroke();
 for(let k=0;k<3;k++){const x=bx+Math.sin(j*3+k)*W*.045,y=by+Math.cos(k+j)*H*.025;ellipse39(c,x,y,W*(.035+.01*k),H*.025,pal[k%2+1]+'b0',side*.4+Math.sin(t+j)*.08)}}
 }
 c.restore();for(let j=0;j<7;j++)crack39(c,0,0,W*.36,j*.9,pal,j,grow,2);
}
function clawScene39(c,f,W,H,t,grow,b){
 const pal=PALETTES39.metal;
 if(f.spec39.unique)ghost39(c,103,-W*.15,-H*.18,H*.78,t,.28,2);
 if(f.spec39.unique)atlas39(c,'claw',atlasFrame39(f),0,-H*.22,W*.97,H*.92,.78);
 for(let j=0;j<3;j++){
  const y=-H*.42+j*H*.17,advance=clamp((grow-j*.1)/.7,0,1),L=W*.96*advance;
  c.save();c.translate(-W*.47,y);c.rotate(-.22);const grad=c.createLinearGradient(0,-20,0,26);
  grad.addColorStop(0,pal[2]+'00');grad.addColorStop(.42,pal[2]+'ee');grad.addColorStop(.53,pal[3]);grad.addColorStop(.68,pal[1]+'cc');grad.addColorStop(1,pal[0]+'00');
  c.beginPath();c.moveTo(0,0);c.bezierCurveTo(L*.28,-H*.04,L*.7,-H*.1,L,-H*.035);c.bezierCurveTo(L*.72,H*.02,L*.25,H*.025,0,0);c.fillStyle=grad;c.fill();
  crack39(c,L*.12,2,L*.83,-.02,pal,j,1,2);c.restore();
 }
 for(let j=0;j<4+b.detail;j++)sword39(c,Math.sin(j*2.4)*W*.42,-H*.12+Math.cos(j*2.4)*H*.22,H*.18,j*.5+t*.15,pal,.72);
}
function bellScene39(c,f,W,H,t,grow,b){
 const p=PALETTES39.metal,y=-H*.65;
 const painted=atlas39(c,'bell',atlasFrame39(f),0,-H*.25,W*.76,H*.93,.86);
 if(!painted)alpha39(c,.58,()=>{const grad=c.createLinearGradient(-W*.12,0,W*.13,0);grad.addColorStop(0,p[0]);grad.addColorStop(.4,p[2]);grad.addColorStop(.55,p[1]);grad.addColorStop(.8,p[3]);grad.addColorStop(1,p[0]);
 path39(c,[[-W*.09,y],[-W*.12,y+H*.25],[-W*.2,y+H*.37],[W*.2,y+H*.37],[W*.12,y+H*.25],[W*.09,y]],grad,1,true);
 for(let j=0;j<5;j++)ring39(c,0,y+H*(.05+j*.06),W*(.09+j*.018),H*.025,p[0]+'bb',2);
 rune39(c,0,y+H*.2,W*.1,t,p[3],7);
 });
 for(let j=0;j<4;j++){const u=(t*.38+j/4)%1;ring39(c,0,-H*.07,W*.48*u,H*.4*u,p[2]+Math.floor((1-u)*180).toString(16).padStart(2,'0'),3+u*9)}
 for(let j=0;j<5+b.detail;j++){const u=(t*.65+j*.173)%1,x=Math.sin(j*2.399)*W*.38,y2=-H*.65+u*H*.65;sword39(c,x,y2,H*.25,Math.PI,p,.9);path39(c,[[x,y2-H*.15],[x,y2-H*.34]],p[2]+'55',3)}
}
function foxScene39(c,f,W,H,t,grow,b){
 const p=PALETTES39.wood;ghost39(c,106,0,-H*.12,H*.82,t,.32,3);
 for(let j=0;j<9;j++){const a=j*Math.PI*2/9+t*.13,x=Math.cos(a)*W*.39,y=-H*.19+Math.sin(a)*H*.32;
  ghost39(c,106,x,y,H*.2,t+j,.35,1);
  c.beginPath();c.moveTo(0,0);c.bezierCurveTo(x*.15,-H*.35,x*.8,y-H*.2,x,y);c.strokeStyle=p[j%2+1]+'aa';c.lineWidth=2;c.stroke();
  c.save();c.translate(0,-H*.15);c.rotate(a);path39(c,[[0,0],[-W*.04,-H*.26],[0,-H*.44],[W*.04,-H*.26]],p[1]+'20',1,true);c.restore();
 }
 rune39(c,0,0,W*.42,t,p[2]+'bb',18);
}
function iceScene39(c,f,W,H,t,grow,b){
 const frame=atlasFrame39(f),p=PALETTES39.ice;
 atlas39(c,'ice',frame,0,-H*.2,W,H*.94,.9);
 if(f.spec39.unique)ghost39(c,107,0,-H*.15,H*.58,t,.20,3);
 for(let j=0;j<6+b.detail*2;j++)crack39(c,0,0,W*.44,j*2.399,p,j,grow,1.5);
 for(let j=0;j<b.motes;j++){const a=j*2.399,u=(t*.24+j/b.motes)%1,x=Math.cos(a)*W*.43*u,y=-H*.22+Math.sin(a)*H*.35*u;
  ring39(c,x,y,2+u*3,2+u*3,p[3]+'bb',1,0,Math.PI*2);
 }
 if(!imageReady39(mythImage35(FX_ATLASES39.ice)))for(let j=0;j<6;j++)rock39(c,Math.cos(j)*W*.35,Math.sin(j)*H*.2,W*.05,H*.32*grow,p);
}
function oceanScene39(c,f,W,H,t,grow,b){
 const age=Math.max(0,f.age15-f.windup15),p=PALETTES39.water,frame=atlasFrame39(f),sweep=clamp(age/1.5,0,1);
 atlas39(c,'water',frame,(sweep-.5)*W*.18,-H*.28,W*.97,H*.85,.9);
 if(f.q15>=4){atlas39(c,'water',(frame+4)%12,-W*.14,-H*.48,W*.72,H*.52,.24);atlas39(c,'wind',4+Math.floor(t*9)%8,-W*.33,-H*.22,W*.25,H*.78,.65);atlas39(c,'wind',6+Math.floor(t*9)%6,W*.34,-H*.28,W*.26,H*.84,.55)}
 if(f.spec39.unique)ghost39(c,108,0,-H*.44,H*.55,t,.22,3);
 for(let j=0;j<b.motes;j++){const u=(t*.6+j/b.motes)%1,x=(u-.5)*W*.9,y=-H*.04+Math.sin(j*2.4)*H*.22;path39(c,[[x-16,y-18],[x,y],[x+8,y-5]],p[3]+'aa',1.2)}
}
function fireScene39(c,f,W,H,t,grow,b){
 const p=PALETTES39.fire,frame=atlasFrame39(f),phoenix=f.spec39.scene==='phoenix';
 if(phoenix)ghost39(c,109,0,-H*.25,H*.9,t,.38,3);
 else if(f.spec39.unique)ghost39(c,110,-W*.16,-H*.18,H*.65,t,.17,3);
 for(let j=0;j<(phoenix?9:f.q15<2?1:f.q15<4?3:6)+b.detail;j++){
  const a=j*2.399,x=Math.cos(a)*W*.38,y=-H*.05+Math.sin(a)*H*.28;
  const fall=(t*.7+j*.173)%1;
  if(phoenix){path39(c,[[x+35,y-H*.55+fall*H*.55],[x,y-H*.37+fall*H*.55]],p[2]+'bb',3);c.save();c.translate(x,y-H*.4+fall*H*.55);c.rotate(.6);path39(c,[[0,-20],[-5,0],[0,13],[5,0]],p[3]+'dd',1,true);c.restore()}
  atlas39(c,'fire',4+(frame+j)%8,x,y-H*.06,W*.23,H*.29,.65,-Math.PI/2+.15*Math.sin(j));
  if(f.q15>=3)crack39(c,x,y,W*.17,j,p,j,grow,2);
 }
 if(phoenix&&f.q15>=5)atlas39(c,'fire',frame,0,-H*.2,W*.73,H*.5,.38,0);
}
function mountainScene39(c,f,W,H,t,grow,b){
 const p=PALETTES39.earth;
 const painted=atlas39(c,'earth',atlasFrame39(f),0,-H*.22,W*.97,H*.95,.85);
 // Three distinct layered mountain faces and falling masses give this its vertical silhouette.
 if(!painted)for(const [x,h,w]of [[-W*.25,H*.49,W*.2],[0,H*.78,W*.27],[W*.29,H*.55,W*.19]])rock39(c,x,-H*.05,w,h*grow,p,.38);
 if(f.spec39.unique)ghost39(c,111,0,-H*.12,H*.55,t,.22,3);
 for(let j=0;j<6+b.detail;j++){
  const a=j*2.399,x=Math.cos(a)*W*.39,y=Math.sin(a)*H*.23,u=(t*.53+j*.2)%1;
  ellipse39(c,x,y,W*.045,H*.018,p[0]+'66');rock39(c,x,y-H*.6*(1-u),W*.04,H*.14,p,.9);
  crack39(c,0,0,W*.43,a,p,j,grow,3);
 }
 rune39(c,0,0,W*.42,t,p[2]+'aa',12);
}
function prisonScene39(c,f,W,H,t,grow,b){
 const p=PALETTES39.earth,close=.9-clamp((f.age15-f.windup15-f.travel15)/1.7,0,1)*.2;
 for(let j=0;j<8;j++){const a=j*Math.PI/4,x=Math.cos(a)*W*.44*close,y=-H*.03+Math.sin(a)*H*.28*close;
  rock39(c,x,y,W*.064,H*(.34+j%2*.13)*grow,p,.85);
  const x2=Math.cos(a+Math.PI/4)*W*.44*close,y2=-H*.03+Math.sin(a+Math.PI/4)*H*.28*close;
  path39(c,[[x,y-H*.18],[x2,y2-H*.18]],p[2]+'aa',2);crack39(c,x,y,W*.25,a+Math.PI,p,j,grow,2);
 }
 rune39(c,0,-H*.08,W*.24,-t*1.5,p[3]+'cc',12);rune39(c,0,0,W*.43,t,p[2]+'99',16);
 if(f.spec39.unique)ghost39(c,112,0,-H*.17,H*.61,t,.26,3);
}
function chaosScene39(c,f,W,H,t,grow,b){
 const stage=presentationPhase39(f),after=f.age15-f.windup15-f.travel15,p=PALETTES39.chaos;
 // This is a single cosmic wound composition, not a collage of other pet fields.
 alpha39(c,.14,()=>ellipse39(c,0,-H*.3,W*.48,H*.46,'#070a22'));
 ghost39(c,113,-W*.17,-H*.12,H*.82,t,.35,3);
 const painted=atlas39(c,'chaos',atlasFrame39(f),0,-H*.25,W*.92,H*.98,.9);
 for(let j=0;j<5;j++){
  const col=WX.colors[j],a=j*Math.PI*2/5+t*(after<.6?-1.2:.36),rx=W*(.42-Math.min(.7,Math.max(0,after))*.16),ry=H*.25;
  const x=Math.cos(a)*rx,y=-H*.25+Math.sin(a)*ry;
  c.beginPath();c.moveTo(x,y);c.bezierCurveTo(-x*.7,y-H*.2,x*.3,-H*.6,0,-H*.2);c.strokeStyle=col+'bb';c.lineWidth=4+j%2;c.stroke();
  c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x*.8,-H*.5,-x*.3,H*.05,0,-H*.2);c.strokeStyle=col+'33';c.lineWidth=14;c.stroke();
  rune39(c,x,y,W*.055,t,col+'cc',5);
 }
 const opening=Math.sin(clamp(after/.8,0,1)*Math.PI*.5),rx=W*.105*opening,ry=H*.36;
 if(!painted)alpha39(c,.78,()=>{c.beginPath();c.moveTo(0,-H*.65);c.bezierCurveTo(rx,-H*.42,rx,-H*.13,0,H*.04);c.bezierCurveTo(-rx,-H*.13,-rx,-H*.42,0,-H*.65);c.fillStyle='#080c22';c.fill();c.strokeStyle=p[2]+'ee';c.lineWidth=2.5;c.stroke()});
 for(let j=0;j<7+b.detail*2;j++){const a=j*2.399,x=Math.cos(a)*W*.4,y=-H*.24+Math.sin(a)*H*.35;crack39(c,0,-H*.24,Math.hypot(x,y+H*.24),Math.atan2(y+H*.24,x),p,j,grow,1.5)}
 rune39(c,0,0,W*.44,t*.5,p[2]+'bb',20);
}
function paintField39(c,f,bounds,b){
 const {W,H}=bounds,age=f.age15,t=age*(motionPrefs34.reduced?.4:1),hit=f.windup15+f.travel15,after=age-hit;
 if(f.spec39.hidden&&age<f.windup15){const u=clamp(age/f.windup15,0,1);alpha39(c,b.alpha*u*.55,()=>{ghost39(c,113,0,-H*.12,H*.71,t,.3,3);atlas39(c,'chaos',Math.floor(u*3),0,-H*.2,W*.72,H*.77,.55);for(let j=0;j<5;j++){const a=j*Math.PI*2/5+t,r=W*.28*(1-u*.7);path39(c,[[Math.cos(a)*r,-H*.16+Math.sin(a)*r*.55],[Math.cos(a)*r*.5,-H*.16+Math.sin(a)*r*.3]],WX.colors[j]+'aa',3)}});return}
 const fade=after<0?clamp((age-f.windup15)/f.travel15,0,1):clamp((f.max-age)/Math.max(.1,f.profile15.tail),0,1);
 if(fade<=0)return;
 const grow=after<0?.35+.65*clamp((age-f.windup15)/f.travel15,0,1):clamp(.7+after*2,0,1);
 c.save();c.globalAlpha=b.alpha*fade;
 atmosphere39(c,f,W,H,t,b);
 switch(f.spec39.scene){
 case'claw':case'blades':clawScene39(c,f,W,H,t,grow,b);break;
 case'bell':bellScene39(c,f,W,H,t,grow,b);break;
 case'tree':case'grove':if(!atlas39(c,'tree',atlasFrame39(f),0,-H*.22,W*.89,H*.98,.82))tree39(c,W,H,t,grow,PALETTES39.wood,b.detail);if(f.spec39.unique)ghost39(c,105,-W*.2,-H*.2,H*.61,t,.25,3);break;
 case'fox':foxScene39(c,f,W,H,t,grow,b);break;
 case'glacier':iceScene39(c,f,W,H,t,grow,b);break;
 case'ocean':oceanScene39(c,f,W,H,t,grow,b);break;
 case'phoenix':case'inferno':fireScene39(c,f,W,H,t,grow,b);break;
 case'mountains':case'shards':mountainScene39(c,f,W,H,t,grow,b);break;
 case'prison':prisonScene39(c,f,W,H,t,grow,b);break;
 case'chaos':chaosScene39(c,f,W,H,t,grow,b);break;
 default:atlas39(c,'wind',atlasFrame39(f),0,-H*.3,W*.72,H,.85);
 }
 c.restore();
}

