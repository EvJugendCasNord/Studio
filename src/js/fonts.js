import {$} from './util.js';
import {FONTS} from './data.js';
const loaded=new Map();
export function loadFont(name){if(loaded.has(name))return loaded.get(name);
 const f=FONTS.find(x=>x.name===name),l=document.createElement('link');l.rel='stylesheet';
 l.href='https://fonts.googleapis.com/css2?family='+name.replace(/ /g,'+')+(f&&f.single?'':':wght@400;700')+'&display=swap';document.head.append(l);
 const p=new Promise(res=>{const d=()=>Promise.all([document.fonts.load(`400 20px "${name}"`),document.fonts.load(`700 20px "${name}"`)]).then(res,res);l.onload=d;l.onerror=res;setTimeout(res,6000)});
 loaded.set(name,p);return p}
const favs=new Set(JSON.parse(localStorage.getItem('ycs.favs')||'[]'));
let onPick=()=>{},io,render=()=>{};
export function openFonts(cb){onPick=cb;$('#fontPanel').classList.remove('hide');render()}
export function initFonts(){
 $('#fc').innerHTML='<option value="">Alle Kategorien ('+FONTS.length+')</option>'+[...new Set(FONTS.map(f=>f.cat))].map(c=>`<option>${c}</option>`).join('');
 io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const n=e.target.dataset.n;io.unobserve(e.target);loadFont(n).then(()=>e.target.querySelector('.s').style.fontFamily=`"${n}"`)}}),{root:$('#fl')});
 let fo=false;
 render=()=>{const q=$('#fs1').value.toLowerCase(),c=$('#fc').value,w=$('#fw1').value,t=$('#fp').value||'Aa';
  $('#fl').innerHTML='';FONTS.filter(f=>(!q||f.name.toLowerCase().includes(q))&&(!c||f.cat===c)&&(!fo||favs.has(f.name))).forEach(f=>{
   const r=document.createElement('div');r.className='fr';r.dataset.n=f.name;
   r.innerHTML=`<button class="fav ${favs.has(f.name)?'on':''}">★</button><small>${f.name}<br>${f.cat}${f.single?' · nur Normal':''}</small><span class="s" style="font-weight:${f.single?400:w}"></span>`;
   r.querySelector('.s').textContent=t;$('#fl').append(r);io.observe(r)})};
 ['fs1','fc','fp','fw1'].forEach(i=>$('#'+i).oninput=render);$('#ff').onclick=()=>{fo=!fo;$('#ff').classList.toggle('p',fo);render()};
 $('#fx').onclick=()=>$('#fontPanel').classList.add('hide');
 $('#fl').onclick=e=>{const r=e.target.closest('.fr');if(!r)return;const n=r.dataset.n;
  if(e.target.classList.contains('fav')){favs.has(n)?favs.delete(n):favs.add(n);localStorage.setItem('ycs.favs',JSON.stringify([...favs]));render();return}
  const f=FONTS.find(x=>x.name===n);$('#fontPanel').classList.add('hide');onPick(n,f.single?'400':$('#fw1').value)};
}
