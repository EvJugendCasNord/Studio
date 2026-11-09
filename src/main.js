import './css/style.css';
import {$} from './js/util.js';
import {FORMATS} from './js/data.js';
import {dbAll,dbPut,dbDel} from './js/db.js';
import {initFonts} from './js/fonts.js';
import {openEditor} from './editor/editor.js';
initFonts();
$('#fmts').innerHTML=FORMATS.map((f,i)=>`<div class="card" data-i="${i}"><b>${f.n}</b><small>${f.w} × ${f.h} px${f.pages?' · '+f.pages+' Seiten':''}</small></div>`).join('');
$('#fmts').onclick=e=>{const c=e.target.closest('.card');if(!c)return;const f=FORMATS[c.dataset.i];openEditor({id:'p'+Date.now(),name:f.n,w:f.w,h:f.h,pages:Array(f.pages||1).fill(null),fav:false},loadProjs)};
async function loadProjs(){let a=[];try{a=await dbAll()}catch(e){console.error(e)}
 const q=$('#q').value.toLowerCase();a=a.filter(p=>p.name.toLowerCase().includes(q)).sort((x,y)=>(y.fav|0)-(x.fav|0)||y.upd-x.upd);
 $('#projs').innerHTML=a.length?a.map(p=>`<div class="card" data-id="${p.id}"><img src="${p.thumb}" alt=""><b>${p.fav?'★ ':''}${p.name.replace(/</g,'&lt;')}</b><small>${p.w}×${p.h} · ${(p.pages||[1]).length} S. · ${new Date(p.upd).toLocaleDateString('de-DE')}</small><div class="row"><button data-a="fav">★</button><button data-a="ren">Name</button><button data-a="dup">Kopie</button><button data-a="del">✕</button></div></div>`).join(''):'<small class="mut">Noch keine Projekte. Wähle oben ein Format.</small>'}
$('#q').oninput=loadProjs;
$('#projs').onclick=async e=>{const c=e.target.closest('.card');if(!c)return;const p=(await dbAll()).find(x=>x.id===c.dataset.id);if(!p)return;const a=e.target.dataset.a;
 if(!a)return openEditor({...p,pages:p.pages||[p.json]},loadProjs);
 if(a==='fav')await dbPut({...p,fav:!p.fav});
 if(a==='ren'){const n=prompt('Neuer Name',p.name);if(n)await dbPut({...p,name:n})}
 if(a==='dup')await dbPut({...p,id:'p'+Date.now(),name:p.name+' (Kopie)',upd:Date.now()});
 if(a==='del'&&confirm('Projekt wirklich löschen?'))await dbDel(p.id);
 loadProjs()};
loadProjs();
