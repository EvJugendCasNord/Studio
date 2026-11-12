import {$} from '../js/util.js';
import {api} from './editor.js';
import {openFonts,loadFont} from '../js/fonts.js';
import {mAll,mPut,mDel} from '../js/db.js';
const fabric=window.fabric,$$=s=>[...document.querySelectorAll(s)];
const logoUrl=new URL('../assets/logo.png',import.meta.url).href;
const isTxt=o=>o&&(o.type==='textbox'||o.type==='i-text'),HEX=/^#[0-9a-f]{6}$/i;
const toURL=b=>new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result);f.readAsDataURL(b)});
const loadImg=s=>new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=s});
async function fit(file,max=2400){const u=await toURL(file),i=await loadImg(u),s=Math.min(1,max/Math.max(i.width,i.height));if(s===1)return u;
 const c=document.createElement('canvas');c.width=i.width*s;c.height=i.height*s;c.getContext('2d').drawImage(i,0,0,c.width,c.height);return c.toDataURL(file.type==='image/png'?'image/png':'image/jpeg',.92)}
async function tint(src,hex){const i=await loadImg(src),c=document.createElement('canvas');c.width=i.width;c.height=i.height;const x=c.getContext('2d');x.drawImage(i,0,0);x.globalCompositeOperation='source-in';x.fillStyle=hex;x.fillRect(0,0,c.width,c.height);return c.toDataURL('image/png')}
// Tabs
$('#tabs').onclick=e=>{const t=e.target.dataset.t;if(!t)return;$$('#tabs button').forEach(b=>b.classList.toggle('on',b===e.target));$$('.pn').forEach(p=>p.classList.toggle('hide',p.id!=='pn-'+t))};
// Elemente
const ngon=(n,R,star)=>{const p=[];for(let i=0;i<(star?n*2:n);i++){const a=(star?Math.PI*i/n:2*Math.PI*i/n)-Math.PI/2,d=star&&i%2?R/2.5:R;p.push({x:Math.cos(a)*d,y:Math.sin(a)*d})}return p};
const SH=[['▭','Rechteck',w=>new fabric.Rect({width:w/3,height:w/3,fill:'#EC4899',rx:24,ry:24})],['●','Kreis',w=>new fabric.Circle({radius:w/6,fill:'#A78BFA'})],['▲','Dreieck',w=>new fabric.Triangle({width:w/3,height:w/3,fill:'#F9A8D4'})],['★','Stern',w=>new fabric.Polygon(ngon(5,w/6,1),{fill:'#FDE68A'})],['⬢','Sechseck',w=>new fabric.Polygon(ngon(6,w/6),{fill:'#EC4899'})],['◆','Raute',w=>new fabric.Polygon(ngon(4,w/6),{fill:'#A78BFA'})],['—','Linie',w=>new fabric.Rect({width:w/2,height:8,fill:'#ffffff'})],['⬭','Pille',w=>new fabric.Rect({width:w/2,height:w/8,rx:200,ry:200,fill:'#EC4899'})]];
const HEART='M50 90C10 60 0 35 15 15C30 0 45 10 50 25C55 10 70 0 85 15C100 35 90 60 50 90z';
const GR=[{n:'Kreuz',d:'M40 0h20v40h40v20H60v40H40V60H0V40h40z'},{n:'Kreuz klassisch',d:'M42 0H58V30H88V46H58V100H42V46H12V30H42z'},{n:'Fisch',d:'M0 25L28 50L0 75zM22 50Q60 0 100 50Q60 100 22 50z'},{n:'Herz',d:HEART},{n:'Stern',d:'M50 0L62 35L100 38L70 60L80 100L50 78L20 100L30 60L0 38L38 35z'},{n:'Funkeln',d:'M50 0Q55 45 100 50Q55 55 50 100Q45 55 0 50Q45 45 50 0z'},{n:'Pfeil',d:'M0 35h60V15l40 35-40 35V65H0z'},{n:'Blitz',d:'M60 0L10 55H45L35 100L90 40H55z'},{n:'Wolke',d:'M25 70C5 70 0 45 20 40C20 20 45 15 55 30C70 15 95 30 90 50C105 55 100 70 85 70z'},{n:'Mond',d:'M60 5A45 45 0 1 0 95 70A35 35 0 1 1 60 5z'},{n:'Flamme',d:'M50 0C70 30 90 45 85 70C80 95 55 100 50 100C20 100 10 75 20 50C25 65 35 65 38 55C40 35 35 20 50 0z'},{n:'Krone',d:'M0 80L10 20L35 50L50 10L65 50L90 20L100 80z'},{n:'Sprechblase',d:'M10 0H90Q100 0 100 10V60Q100 70 90 70H40L20 95V70H10Q0 70 0 60V10Q0 0 10 0z'},{n:'Welle',d:'M0 30Q12 0 25 30T50 30T75 30T100 30',st:1,vb:'0 0 100 60'}];
const FR=[{n:'Kreis',d:'M50 0A50 50 0 1 1 50 100A50 50 0 1 1 50 0z'},{n:'Abgerundet',d:'M20 0H80Q100 0 100 20V80Q100 100 80 100H20Q0 100 0 80V20Q0 0 20 0z'},{n:'Hochformat',d:'M10 0H90Q100 0 100 10V150Q100 160 90 160H10Q0 160 0 150V10Q0 0 10 0z',vb:'0 0 100 160'},{n:'Bogen',d:'M0 100V50A50 50 0 0 1 100 50V100z'},{n:'Herz',d:HEART},{n:'Sechseck',d:'M25 0H75L100 50L75 100H25L0 50z'},{n:'Stern',d:'M50 0L62 35L100 38L70 60L80 100L50 78L20 100L30 60L0 38L38 35z'}];
let sub='sh';
const hints={sh:'',gr:'Klicken zum Einfügen, Farbe rechts änderbar.',fr:'Rahmen einfügen, dann ein Bild aus „Uploads“ hineinziehen oder bei markiertem Rahmen anklicken.'};
function renderEl(){$('#elHint').textContent=hints[sub];$('#elgrid').innerHTML=sub==='sh'?SH.map((s,i)=>`<div class="gi" data-i="${i}"><span style="font-size:1.8rem">${s[0]}</span><small>${s[1]}</small></div>`).join(''):(sub==='gr'?GR:FR).map((g,i)=>`<div class="gi" data-i="${i}" title="${g.n}"><svg viewBox="${g.vb||'0 0 100 100'}" width="70%" height="70%"><path d="${g.d}" fill="${g.st?'none':sub==='fr'?'#ffffff22':'#EC4899'}" stroke="${g.st||sub==='fr'?'#EC4899':'none'}" stroke-width="${g.st?6:3}"/></svg></div>`).join('')}
$('.seg').onclick=e=>{if(!e.target.dataset.s)return;sub=e.target.dataset.s;$$('.seg button').forEach(b=>b.classList.toggle('on',b===e.target));renderEl()};
$('#elgrid').onclick=e=>{const c=e.target.closest('.gi');if(!c||!api.cv)return;const i=+c.dataset.i;let o;
 if(sub==='sh')o=SH[i][2](api.W);
 else{const g=(sub==='gr'?GR:FR)[i],fr=sub==='fr';o=new fabric.Path(g.d,g.st?{fill:null,stroke:'#EC4899',strokeWidth:6,strokeLineCap:'round'}:fr?{fill:'#ffffff22',stroke:'#EC4899',strokeWidth:4,strokeUniform:true,strokeDashArray:[14,10]}:{fill:'#EC4899'});o.scaleToWidth(api.W*(fr?.45:.22));if(fr)o.frame=true}
 o.set(api.mid());api.add(o)};
renderEl();
// Text
let curFont='Inter';const sty=()=>['#tH','#tS','#tB'].forEach(i=>$(i).style.fontFamily=`"${curFont}"`);
$('#tH').onclick=()=>api.addText(curFont,'700',api.W/10,'Überschrift');$('#tS').onclick=()=>api.addText(curFont,'700',api.W/18,'Unterüberschrift');
$('#tB').onclick=()=>api.addText(curFont,'400',api.W/30,'Hier steht dein Fließtext. Doppelklick zum Bearbeiten.');
$('#fontPick').onclick=()=>openFonts((n,w)=>{curFont=n;$('#fontPick').textContent='Schriftart: '+n;loadFont(n).then(sty);if(isTxt(api.A()))api.pick(n,w)});loadFont(curFont).then(sty);
// Medien (Uploads + Logos)
let ups=[],lgs=[];const all=()=>[...ups,...lgs];
async function loadM(){const a=await mAll();ups=a.filter(x=>x.kind==='up').sort((x,y)=>y.t-x.t);lgs=a.filter(x=>x.kind==='logo').sort((x,y)=>y.t-x.t);renderM()}
function renderM(){$('#upGrid').innerHTML=ups.map(u=>`<div class="gi" data-id="${u.id}" draggable="true" title="${u.name}"><img src="${u.data}" draggable="false"><i class="x" data-x>✕</i><i class="x r" data-r title="Hintergrund entfernen (KI)">✂</i></div>`).join('')||'<small class="mut">Noch keine Bilder.</small>';
 $('#lgGrid').innerHTML=lgs.map(u=>`<div class="gi" data-id="${u.id}" draggable="true" title="${u.name}"><img src="${u.data}" draggable="false"><small>${u.hex||'–'}</small><i class="x" data-x>✕</i></div>`).join('')||'<small class="mut">Noch keine eigenen Logos.</small>'}
function addImg(src,pt){fabric.Image.fromURL(src,im=>{im.scaleToWidth(Math.min(api.W*.8,im.width));im.set(api.mid());if(pt)im.set({left:pt.x,top:pt.y});api.add(im)})}
function fillFrame(f,src){loadImg(src).then(im=>{const sw=f.width,sh=f.height,s=Math.max(sw/im.width,sh/im.height);f.set({fill:new fabric.Pattern({source:im,repeat:'no-repeat',patternTransform:[s,0,0,s,(sw-im.width*s)/2,(sh-im.height*s)/2]}),stroke:null,strokeWidth:0,strokeDashArray:null});f.dirty=true;api.cv.renderAll();api.snap()})}
$('#upBtn').onclick=()=>$('#upFile').click();
$('#upFile').onchange=async e=>{for(const f of e.target.files){try{await mPut({id:'u'+Date.now()+Math.random().toString(36).slice(2,6),kind:'up',name:f.name,data:await fit(f),t:Date.now()})}catch(x){alert('Konnte '+f.name+' nicht speichern.')}}e.target.value='';loadM()};
$('#upGrid').onclick=async e=>{const c=e.target.closest('.gi');if(!c)return;const it=ups.find(x=>x.id===c.dataset.id);if(!it)return;
 if(e.target.dataset.x!==undefined){if(confirm('Bild löschen?')){await mDel(it.id);loadM()}return}
 if(e.target.dataset.r!==undefined){const u=await removeBg(it.data);if(u){await mPut({...it,id:'u'+Date.now(),name:it.name+' (ohne Hintergrund)',data:u,t:Date.now()});loadM()}return}
 if(!api.cv)return;const o=api.A();o&&o.frame?fillFrame(o,it.data):addImg(it.data)};
$$('#upGrid,#lgGrid').forEach(g=>g.ondragstart=e=>{const c=e.target.closest('.gi');if(c)e.dataTransfer.setData('text/ycs',c.dataset.id)});
$('#stage').ondragover=e=>e.preventDefault();
$('#stage').ondrop=e=>{e.preventDefault();const it=all().find(x=>x.id===e.dataTransfer.getData('text/ycs'));if(!it||!api.cv)return;const pt=api.cv.getPointer(e,true),f=[...api.cv.getObjects()].reverse().find(o=>o.frame&&o.containsPoint(pt,null,true));f?fillFrame(f,it.data):addImg(it.data,pt)};
// KI-Hintergrundentfernung
async function removeBg(src){const st=$('#aiStatus');st.textContent='KI wird geladen … (beim ersten Mal groß, bitte warten)';
 try{const m=await import('https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.5.5/+esm');const b=await(await fetch(src)).blob();
  const out=await m.removeBackground(b,{progress:(k,c,t)=>{st.textContent='KI arbeitet … '+(t?Math.round(c/t*100):0)+' %'}});st.textContent='Hintergrund entfernt.';return await toURL(out)}
 catch(x){console.error(x);st.textContent='Hintergrund entfernen fehlgeschlagen: '+x.message;return null}}
$('#rmbg').onclick=async()=>{const o=api.A();if(!o||o.type!=='image')return;const u=await removeBg(o.getSrc());if(u)o.setSrc(u,()=>{api.cv.renderAll();api.snap()})};
// Jugendlogo
const QUICK=['#EC4899','#A78BFA','#FFFFFF','#111018','#F9A8D4','#3B82F6'];let used=JSON.parse(localStorage.getItem('ycs.logoHex')||'[]');
const hexNow=()=>{const h=$('#lgh').value.trim();return HEX.test(h)?h.toUpperCase():null};
function chips(){$('#lgChips').innerHTML=[...QUICK,...used.filter(h=>!QUICK.includes(h))].map(h=>`<b data-h="${h}" style="background:${h}" title="${h}">${used.includes(h)?h:''}</b>`).join('')}
function setHex(h){$('#lgc').value=h.toLowerCase();$('#lgh').value=h}
function remember(h){if(!h)return;used=[h,...used.filter(x=>x!==h)].slice(0,12);localStorage.setItem('ycs.logoHex',JSON.stringify(used));chips()}
$('#lgc').oninput=e=>setHex(e.target.value.toUpperCase());$('#lgh').oninput=e=>{if(HEX.test(e.target.value))$('#lgc').value=e.target.value};
$('#lgChips').onclick=e=>{if(e.target.dataset.h)setHex(e.target.dataset.h)};
async function insertLogo(orig,hex,doTint){if(!api.cv)return;const src=doTint?await tint(orig,hex):orig;
 fabric.Image.fromURL(src,im=>{im.set({logoSrc:orig,logoHex:hex||''});im.scaleToWidth(api.W*.25);im.set(api.mid());api.add(im);remember(hex)})}
$('#lgMain').onclick=async()=>{const h=hexNow();if(!h)return alert('Bitte einen gültigen Hexcode eingeben, z. B. #EC4899.');insertLogo(await toURL(await(await fetch(logoUrl)).blob()),h,true)};
$('#lgRe').onclick=async()=>{const o=api.A(),h=hexNow();if(!h)return alert('Bitte einen gültigen Hexcode eingeben.');if(!(o&&o.logoSrc))return alert('Bitte zuerst ein eingefügtes Logo auswählen.');
 const u=await tint(o.logoSrc,h);o.setSrc(u,()=>{o.set('logoHex',h);api.cv.renderAll();api.snap();remember(h)})};
$('#lgAdd').onclick=()=>$('#lgFile').click();
$('#lgFile').onchange=async e=>{for(const f of e.target.files){const m=[...f.name.matchAll(/#?([0-9a-f]{6})(?![0-9a-f])/gi)].pop();
 await mPut({id:'l'+Date.now()+Math.random().toString(36).slice(2,6),kind:'logo',name:f.name,data:await fit(f,1024),hex:m?'#'+m[1].toUpperCase():'',t:Date.now()})}e.target.value='';loadM()};
$('#lgGrid').onclick=async e=>{const c=e.target.closest('.gi');if(!c)return;const it=lgs.find(x=>x.id===c.dataset.id);if(!it)return;
 if(e.target.dataset.x!==undefined){if(confirm('Logo löschen?')){await mDel(it.id);loadM()}return}
 const t=$('#lgTint').checked,h=t?hexNow():(it.hex||null);if(t&&!h)return alert('Bitte einen gültigen Hexcode eingeben.');insertLogo(it.data,h,t)};
chips();loadM();
