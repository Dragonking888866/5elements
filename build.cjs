const fs=require('node:fs'),path=require('node:path');
const web=__dirname;
const out=process.env.WUXING_BUILD_OUT?path.resolve(process.env.WUXING_BUILD_OUT):web;
const sandbox=process.env.WUXING_BUILD_SANDBOX!=='0';
const codes=process.env.WUXING_BUILD_CODES!=='0';
const modules=["game", "upgrade", "expedition", "conquest", "sanctuary", "wuxing-v7", "forge-v7", "bestiary-v7", "boot-v7", "menagerie-v8", "frontier-v8", "effects-v8", "ascension-v9", "atelier-v9", "journey-ui-v9", "balance-v10", "state-v10", "growth-v10", "fusion-v10", "inventory-v10", "panels-v10", "atelier-v10", "boot-v10", "scenes-v11", "motion-v11", "market-v11", "render-v11", "companions-v11", "performance-v11", "scene-v12", "combat-v12", "market-v12", "boot-v11", "mobile-v13", "renewal-v14", "pet-effects-v15", "release-v15", "balance-v17", "inventory-v17", "furnaces-v17", "divine-v17", "atelier-v17", "visual-ui-v17", "rules-v18", "rescue-v18", "combat-v18", "trade-v18", "interface-v18", "progression-v19", "overview-v19", "support-v19", "gem-market-v19", "windows-v19", "boot-v19", "fusion-core-v20", "fusion-fx-v20", "fusion-ui-v20", "gems-core-v21", "gems-combat-v21", "gems-fx-v21", "gems-ui-v21", "recovery-v22", "growth-ui-v22", "boss-v22", "support-v22"];
const initializer='v3Ready=true;resizeWorld();intro();requestAnimationFrame(frame);';
const parts=modules.map(n=>fs.readFileSync(path.join(web,n+'.js'),'utf8').replace(/\r\n/g,'\n'));
if(parts.join('\n').split(initializer).length!==2)throw Error('Expected one initializer');
const shared=parts.map(s=>s.replace(initializer,'')).join('\n');
fs.mkdirSync(out,{recursive:true});
const extension=(codes?fs.readFileSync(path.join(web,'single-player-v16.js'),'utf8'):'')+'\n'+fs.readFileSync(path.join(web,'economy-v17.js'),'utf8');
fs.writeFileSync(path.join(out,'runtime.js'),shared.replace('__SANDBOX_AVAILABLE15__',String(sandbox))+'\n'+extension+'\n'+fs.readFileSync(path.join(web,'session-v23.js'),'utf8')+'\n'+initializer+'\n');
if(sandbox){
 let core=shared.replace('__SANDBOX_AVAILABLE15__','false').replace("if(location.protocol==='https:'&&'serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});",'// No service worker in the opaque sandbox.').replace('navigator.locks?.request','false');
 core=core.replace(/SAVE_KEY='[^']+'/,"SAVE_KEY='wuxing-lab-frame-v15'");
 const lab=fs.readFileSync(path.join(web,'developer-sandbox15.js'),'utf8');
 fs.writeFileSync(path.join(out,'runtime-sandbox.js'),core+'\n'+lab+'\n'+fs.readFileSync(path.join(web,'session-v23.js'),'utf8')+'\nv3Ready=true;resizeWorld();initSandbox15();requestAnimationFrame(frame);\n');
 const frame=fs.readFileSync(path.join(web,'index.html'),'utf8').replace('</head>','<script src="sandbox-shim15.js?v=23.0.0"></script></head>').replace('runtime.js?v=23.0.0','runtime-sandbox.js?v=23.0.0');
 fs.writeFileSync(path.join(out,'sandbox-frame.html'),frame);
 fs.copyFileSync(path.join(web,'sandbox-shell15.html'),path.join(out,'sandbox.html'));
}else{
 const disabled='<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>体验沙盒已关闭</title><p>此发布版本已禁用体验沙盒。</p><a href="./">返回正式远征</a></html>';
 fs.writeFileSync(path.join(out,'sandbox.html'),disabled);fs.writeFileSync(path.join(out,'sandbox-frame.html'),disabled);fs.writeFileSync(path.join(out,'runtime-sandbox.js'),'"use strict"; // Developer sandbox disabled at build time.\n');
}
console.log('Built V23 runtime; isolated sandbox '+(sandbox?'enabled':'disabled')+'.');

