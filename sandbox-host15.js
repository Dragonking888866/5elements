'use strict';
// This bridge has exactly one save key and never reads a production save.
(()=>{const KEY='wuxing-isolated-lab-v15',frame=document.getElementById('labFrame15'),status=document.getElementById('labStatus15'),notice=document.getElementById('notice15'),nonce=crypto.randomUUID(),MAX=2000000;
 const send=(type,payload={})=>frame.contentWindow.postMessage({type,nonce,...payload},'*');
 function saved(){try{const raw=localStorage.getItem(KEY);if(!raw||raw.length>MAX)return null;const v=JSON.parse(raw);return v?.sandbox15===true?v:null}catch{return null}}
 frame.addEventListener('load',()=>send('lab-init15',{save:saved()}));
 window.addEventListener('message',event=>{if(event.source!==frame.contentWindow||event.origin!=='null'||event.data?.nonce!==nonce)return;const m=event.data;
  if(m.type==='lab-ready15')send('lab-init15',{save:saved()});
  if(m.type==='lab-save15'&&m.save?.sandbox15===true){try{const raw=JSON.stringify(m.save);if(raw.length>MAX)throw Error('体验存档超过大小限制');localStorage.setItem(KEY,raw);status.textContent='体验存档已保存 · 正式进度隔离'}catch(e){status.textContent='自动保存未完成，请导出体验档备份'}}
  if(m.type==='lab-status15'){status.textContent=String(m.text).slice(0,100);notice.hidden=true;document.documentElement.dataset.isolated15=m.isolated?'true':'false'}
 });
 document.getElementById('tools15').onclick=()=>send('lab-control15',{action:'panel'});
 document.getElementById('reset15').onclick=()=>send('lab-control15',{action:'reset-panel'});
 frame.src='sandbox-frame.html?v=21.0.0#'+encodeURIComponent(nonce);
})();
