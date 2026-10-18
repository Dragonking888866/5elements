const fs=require('node:fs'),path=require('node:path');
const web=__dirname;
const modules=['game','upgrade','expedition','conquest','sanctuary','wuxing-v7','forge-v7','bestiary-v7','boot-v7','menagerie-v8','frontier-v8','effects-v8','ascension-v9','atelier-v9','journey-ui-v9'];
const runtime=modules.map(n=>fs.readFileSync(path.join(web,n+'.js'),'utf8').replace(/\r\n/g,'\n')).join('\n');
if(runtime.split('v3Ready=true;resizeWorld();intro();requestAnimationFrame(frame);').length!==2)throw new Error('Expected one initialization entry');
fs.writeFileSync(path.join(web,'runtime.js'),runtime);console.log('Built V9 runtime from '+modules.length+' modules.');
