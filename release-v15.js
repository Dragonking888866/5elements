'use strict';
const SANDBOX_AVAILABLE15=__SANDBOX_AVAILABLE15__;
function sandboxData15(v){if(!v||typeof v!=='object')return false;const arr=x=>Array.isArray(x)?x:[],heroes=arr(v.heroes),items=[...arr(v.pets),...arr(v.gems),...arr(v.bag),...arr(v.pendingGear10),...heroes,...heroes.flatMap(h=>arr(h?.gear)),...heroes.flatMap(h=>arr(h?.altar10))];return v.sandbox15!==undefined||v.labState15!==undefined||items.some(x=>x?.test15===true||arr(x?.sockets).some(g=>g?.test15===true))}
const validateBeforeSeal15=validateSave;
validateSave=function(v){return !sandboxData15(v)&&validateBeforeSeal15(v)};
const menuBeforeRelease15=realmMenuPanel;
realmMenuPanel=function(){menuBeforeRelease15();if(SANDBOX_AVAILABLE15)$('#dialog').insertAdjacentHTML('beforeend','<div class="sandbox-entry15"><a href="sandbox.html?v=38.0.0" target="_blank" rel="noopener">开发者体验沙盒 ↗</a><small>独立测试存档 · 无限资源与高级灵宠 · 不改变正式远征</small></div>')};
const introBeforeRelease15=intro;
intro=function(){introBeforeRelease15();const h=$('#dialog').querySelector('h2');if(h)h.textContent='五行战记 · 动作重铸 V32';const f=$('#dialog').querySelector('.intro-feature8');if(f)f.textContent='五行专精 · 星盟救援 · 秘器套装 · 批量交易';if(SANDBOX_AVAILABLE15)$('#dialog').insertAdjacentHTML('beforeend','<div class="sandbox-entry15"><a href="sandbox.html?v=38.0.0" target="_blank" rel="noopener">高级灵宠与无限资源体验 ↗</a><small>测试进度与正式远征隔离</small></div>')};
$('#realmMenu').onclick=realmMenuPanel;$('#menuBtn').onclick=realmMenuPanel;
