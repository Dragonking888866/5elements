'use strict';
// Loaded only inside an opaque sandboxed iframe. No same-origin permission is granted.
(()=>{const values=new Map(),storage={getItem:k=>values.get(String(k))??null,setItem:(k,v)=>values.set(String(k),String(v)),removeItem:k=>values.delete(String(k)),clear:()=>values.clear(),key:i=>[...values.keys()][i]??null,get length(){return values.size}};
 Object.defineProperty(window,'localStorage',{value:storage,configurable:false});
 try{Object.defineProperty(navigator,'locks',{value:undefined})}catch{}
})();
