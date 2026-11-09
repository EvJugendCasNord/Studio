const dbp=new Promise((res,rej)=>{const r=indexedDB.open('ycs',1);r.onupgradeneeded=()=>r.result.createObjectStore('p',{keyPath:'id'});r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
const tx=async(m,f)=>{const d=await dbp;return new Promise((res,rej)=>{const t=d.transaction('p',m),r=f(t.objectStore('p'));t.oncomplete=()=>res(r.result);t.onerror=()=>rej(t.error)})};
export const dbAll=()=>tx('readonly',s=>s.getAll());
export const dbPut=o=>tx('readwrite',s=>s.put(o));
export const dbDel=k=>tx('readwrite',s=>s.delete(k));
