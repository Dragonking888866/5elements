const {run}=require('./v10-harness.cjs');
run(`
var reset10=function(level=150){begin(fresh('V10验收',0));S.chapter=4;S.bosses=[true,true,true,true,false];for(let i=0;i<5;i++){const h=S.heroes[i];h.unlocked=true;h.lv=level;h.job=level>=100?0:-1;h.skillsKept10=level>=3;actors[i].hp=stats(i).hp;actors[i].mp=stats(i).mp;actors[i].x=360+i*35;actors[i].y=440}S.gold=50000000;S.ingots=1000000;S.gems=[];closeDialog();invalidateLuck10();assert(validateSave(S));};
var prepareTeam9=reset10;
var makeItem10=function(q=0,slot=0,power=10,level=1,flags={}){return {id:S.nextItem++,slot,tier:Math.min(3,q),quality:q,element:0,power,baseLevel10:level,requiredLevel10:1,...flags}};
var stageHero10=function(i,count){const h=S.heroes[i];h.rebirthCount10=count;h.elements10=Array.from({length:Math.min(5,count+1)},(_,n)=>(i+n)%5);h.altar10=Array(count).fill(null);h.awakening10=count;h.skillsKept10=true;return h;};
var stateItems10=function(){return JSON.stringify({pets:S.pets,gems:S.gems,gold:S.gold,reserve:S.goldReserve10,bag:S.bag,gear:S.heroes.map(h=>h.gear),pending:S.pendingGear10})};
var seeded10=function(seed=2317){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}};
`);
