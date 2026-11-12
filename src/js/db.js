const dbp=new Promise((res,rej)=>{const r=indexedDB.open('ycs',2);r.onupgradeneeded=()=>{const d=r.result;for(const s of ['p','m'])if(!d.objectStoreNames.contains(s))d.createObjectStore(s,{keyPath:'id'})};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
const tx=async(s,m,f)=>{const d=await dbp;return new Promise((res,rej)=>{const t=d.transaction(s,m),r=f(t.objectStore(s));t.oncomplete=()=>res(r.result);t.onerror=()=>rej(t.error)})};
export const dbAll=()=>tx('p','readonly',s=>s.getAll());
export const dbPut=o=>tx('p','readwrite',s=>s.put(o));
export const dbDel=k=>tx('p','readwrite',s=>s.delete(k));
export const mAll=()=>tx('m','readonly',s=>s.getAll());
export const mPut=o=>tx('m','readwrite',s=>s.put(o));
export const mDel=k=>tx('m','readwrite',s=>s.delete(k));
