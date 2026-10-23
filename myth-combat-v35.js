'use strict';
const mythBurns35=[];
function mythTargets35(a,r){return enemies.filter(e=>legalEnemy31(e)&&dist(a,e)<=r)}
function mythAllies35(a,r=380){return actors.filter(b=>owned(b.i)&&b.hp>0&&b.map19===a.map19&&dist(a,b)<=r)}
function interruptMyth35(e){if(!e.wind)return false;e.wind=null;e.cast=Math.max(8,e.cast||0);e.openUntil22=time+3;return true}
const petAbilityBefore35=petAbility;
petAbility=function(i=S?.active,manual=true){const a=actors?.[i],pet=S&&petOf(i),d=ultimatePet35(pet?.type);if(!d)return petAbilityBefore35(i,manual);if(!a||a.hp<=0||menu||a.petCd>0)return false;const target=nearestEnemy(a,420);if(!target||!canEngage(a,target,manual))return false;if(manual)issueAttackOrder(i);a.petCd=manual?14:18;const origin=petOrigin11(a);if(origin===a)a.face=target.x>=a.x?1:-1;else origin.face=target.x>=origin.x?1:-1;a.petMode='roar';a.petAnim=.95;a.mythCast35={t:.95,max:.95,row:3};const st=stats(i),power=(st.atk+st.spell*.45)*2+pet.lv*10,allies=mythAllies35(a),near=mythTargets35(target,190),index=d.type-103,hit=(e,n=1)=>enemyDamage(e,power*n,i,d.element);
 if(index===0){for(const e of mythTargets35(a,220)){e.armorBreak35=time+5;hit(e,1.3)}}
 if(index===1){for(const e of mythTargets35(a,290)){interruptMyth35(e);hit(e,.8)}}
 if(index===2){for(const b of allies)heal(b,stats(b.i).hp*.18+power*.3);hit(target,.7)}
 if(index===3){for(const e of near){e.root=Math.max(e.root||0,e.boss?.6:2);hit(e,.9)}}
 if(index===4){for(const b of allies)shield(b,stats(b.i).hp*.23,7);hit(target,.65)}
 if(index===5){for(const e of near){e.slow=Math.max(e.slow||0,3);const dx=target.x-e.x,dy=target.y-e.y,len=Math.max(1,Math.hypot(dx,dy)),step=Math.min(55,len);if(!e.boss&&walkable(e.x+dx/len*step,e.y+dy/len*step)){e.x+=dx/len*step;e.y+=dy/len*step}hit(e,.9)}}
 if(index===6){hit(target,.8);mythBurns35.push({map:currentMap(),world:S.worldId10,x:target.x,y:target.y,r:175,t:4,tick:0,power:power*.3,i})}
 if(index===7){hit(target,2.1);for(const b of allies){b.hasteTime10=Math.max(b.hasteTime10||0,5);b.haste10=Math.max(b.haste10||0,.16)}}
 if(index===8){for(const e of mythTargets35(a,230))hit(e,1.15);for(const b of allies)shield(b,stats(b.i).hp*.12,5)}
 if(index===9){interruptMyth35(target);hit(target,2.2);a.inv=Math.max(a.inv||0,.5)}
 battleFx.push({type:'element',x:target.x,y:target.y,r:180,element:d.element,slot:2,t:.8,max:.8,color:WX.colors[d.element]});burst11(target.x,target.y-35,d.element,14,'myth');logMessage(d.name+' · '+d.active);return true};
const damageBeforeMyth35=enemyDamage;enemyDamage=function(e,amount,...args){return damageBeforeMyth35(e,amount*(e?.armorBreak35>time?1.18:1),...args)};
const tellBeforeMyth35=createBossTell;
createBossTell=function(e,target){if(!isFinalBoss27(e)||!e.boss22||time<(e.judgementReady35??e.boss22.openedAt+16))return tellBeforeMyth35(e,target);e.judgementReady35=time+34;const seconds=4.2;e.wind={boss22:true,judgement35:true,kind:'circle',x:target.x,y:target.y,r:205,angle:0,t:seconds,max:seconds,extras:[],heavy14:true,ultimate14:true,name14:'五行寂灭·天罚'};e.strike=null;e.animT=seconds;logMessage('五行寂灭·天罚：4.2秒后落下，离开红区、举盾防御或以灵兽震吼打断！')};
const resolveBeforeMyth35=resolveBossTell;
resolveBossTell=function(e){const w=e.wind;if(!w?.judgement35)return resolveBeforeMyth35(e);for(const a of actors)if(owned(a.i)&&a.hp>0&&a.map19===e.map&&groundHit(w,a)){e.skillHit14=true;e.ultimateHit14=true;e.judgementHit35=true;try{actorDamage(a,e.atk*12,e)}finally{delete e.skillHit14;delete e.ultimateHit14;delete e.judgementHit35}}battleFx.push({type:'element',x:w.x,y:w.y,r:w.r,element:e.element,slot:2,t:1,max:1,color:'#fff0b7'});e.wind=null;e.cast=8;e.openUntil22=time+5;requestBossImpulse34(e)};
const updateBeforeMythCombat35=update;update=function(dt){updateBeforeMythCombat35(dt);if(!S||menu)return;for(const a of actors)if(a.mythCast35){a.mythCast35.t-=dt;if(a.mythCast35.t<=0)a.mythCast35=null}for(let n=mythBurns35.length-1;n>=0;n--){const b=mythBurns35[n];b.t-=dt;b.tick-=dt;if(b.world!==S.worldId10||b.map!==currentMap()||b.t<=0){mythBurns35.splice(n,1);continue}if(b.tick<=0){b.tick+=1;for(const e of mythTargets35(b,b.r))enemyDamage(e,b.power,b.i,3);burst11(b.x,b.y,3,7,'embers')}}};
