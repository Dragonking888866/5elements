'use strict';
// V10 balance layer. Change values here, then run build.cjs; old species and item IDs stay stable.
const RULES10={
 luck:{amplitude:.35,k:1000,perHeroCap:500000,totalCap:2500000},
 inventory:{capacity:999,pageSize:18,logLimit:100,pendingImportLimit:50000,goldCap:1e9,reserveCap:1e12,autoSell:true,protectSockets:true},
 pet:{cap:1000,maxLevel:150,maxQuality:6,base:[.90,.78,.65,.50,.35,.20],capByQuality:[.99,.96,.89,.78,.62,.45],relation:{same:1,sheng:1.08,ke:.72},pityStep:.008,pityCap:.048,costBase:160,costQuality:190,costLevel:5,costGrowth:1.5,potentialCaps:{hp:2000,atk:300,int:300,armor:100,all:40,speed:100,crit:.12},legendWard:.06,mythicHaste:.05,supremeLeech:.025},
 gem:{maxLevel:11,stackCap:9999,bagStacks:512,base:[0,0,1,.95,.88,.76,.60,.45,.32,.22,.14,.08],caps:[0,0,1,.99,.97,.93,.85,.75,.65,.50,.40,.28],mixedPenalty:.65,tripleMultiplier:1.18,relation:{same:1,sheng:1.04,ke:.72},pityStep:.004,pityCap:.024,costSame:40,costMixed:55,energyGold:240,gapCost:.40,flatGrowth:2,percentGrowth:1.15,rateCap:.55,critCap:.24,leechCap:.15,levelCoefficient:.5,equipmentLevelCap:500,altarFactor:.65,offhandFactor:.5},
 progression:{maxCount:5,baseCap:150,capGain:20,freePoints:12,luckReward:3,talentReward:4,costGold:20000,costGoldStep:15000,costIron:80,costIronStep:40,maxCostGold:5e8,maxCostIron:5e7,extraSocketPerStage:1,skillGrowth:.04,elementSynergyCap:.12,elementPerMatch:.02,unlockedDamage:.02},
 combat:{attackRateCap:3,critCap:.7,leechCap:.22,minInterval:.18,wardCap:.18,barrierMax:.45,petLevelGrowth:.18},
 awakening:[
  {name:'初醒 · 护心震',desc:'震击近敌，并为自己生成生命20%的护盾。',radius:350,mult:5,mp:60,cd:32,shield:.20},
  {name:'追猎 · 疾风链',desc:'灵链打击最近三敌，6秒内攻速提高15%。',radius:570,mult:6,mp:70,cd:34,haste:.15,duration:6},
  {name:'元素 · 镇灵阵',desc:'五行阵冻结普通敌人1.8秒，对首领短暂束缚。',radius:440,mult:7,mp:80,cd:38,root:1.8,bossRoot:.3},
  {name:'同生 · 灵契潮',desc:'恢复小队25%生命、增加护盾，并缩短灵宠技能冷却3秒。',radius:470,mult:6,mp:90,cd:42,heal:.25,shield:.15,petCd:3},
  {name:'归一 · 星陨天劫',desc:'三次星陨打击，按已觉醒五行联动，金色灵环绕身。',radius:570,mult:5,mp:110,cd:50,pulses:3,pulseGap:.65}
 ],
 recipes:[
  {id:'flame-metal',name:'焰锋双曜',types:[0,6],minLevel:2,result:18,probabilityScale:.95,gold:180,stage:0,desc:'火与金凝成锋芒：攻击与暴击。'},
  {id:'forest-tide',name:'森海回响',types:[2,7],minLevel:2,result:19,probabilityScale:.95,gold:180,stage:0,desc:'木与水滋养灵脉：生命、法力与治疗。'},
  {id:'mountain-frost',name:'镇岳玄晶',types:[5,15],minLevel:3,result:20,probabilityScale:.92,gold:260,stage:0,desc:'土水共鸣，凝成护甲与生命。'},
  {id:'five-star',name:'五曜初星',types:[18,19,20],minLevel:6,result:21,probability:.18,gold:18000,stage:1,desc:'三枚复合灵晶唤醒五行：需任一角色完成一阶进阶。'},
  {id:'primordial',name:'太初觉醒',types:[21,12,17],minLevel:10,maxLevel:10,result:22,probability:.08,gold:180000,stage:3,desc:'五曜、紫薇与麒麟汇聚：需任一角色完成三阶进阶。'}
 ]
};
// Percentage modifiers grow separately from flat attack/HP values and stay capped.
RULES10.gem.percentBases={4:{gemLeech:.012},8:{rate:.026},9:{crit:.015},16:{rate:.0255},18:{crit:.012},21:{rate:.02},22:{crit:.018}};
GEMS.push(
 {name:'焰锋双曜',color:'#ffc078',element:3,elements10:[3,0],category10:'复合',unit:6},
 {name:'森海灵珀',color:'#75e6ce',element:1,elements10:[1,2],category10:'复合',unit:10},
 {name:'镇岳玄晶',color:'#99c4e8',element:4,elements10:[4,2],category10:'复合',unit:20},
 {name:'五曜初星',color:'#d8b6ff',element:0,elements10:[0,1,2,3,4],category10:'觉醒',unit:8},
 {name:'太初觉醒石',color:'#ffe6a2',element:4,elements10:[0,1,2,3,4],category10:'传说',unit:12}
);
GEM_CAP=RULES10.gem.maxLevel;
gemValid=gem=>!!gem&&Number.isInteger(gem.type)&&gem.type>=0&&gem.type<GEMS.length&&Number.isInteger(gem.level)&&gem.level>=1&&gem.level<=RULES10.gem.maxLevel;
gemPower=gem=>gemValid(gem)?Math.round(GEMS[gem.type].unit*RULES10.gem.flatGrowth**(gem.level-1)*10)/10:0;
gemQuality8=level=>[0,0,1,1,2,3,4,4,5,5,6,6][level]??0;
gemName=gem=>gemValid(gem)?GEMS[gem.type].name+' · '+gem.level+'级'+(gem.level>=10?gem.level===11?'【太初】':'【天极】':''):'未知宝石';
function gemElements10(gem){return GEMS[gem.type]?.elements10||[GEMS[gem.type]?.element]}
function petElement10(p){return WX.valid(p?.element10)?p.element10:WX.petElement(p?.type)}
