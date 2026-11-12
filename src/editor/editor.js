const fabric=window.fabric,logoUrl=new URL('../assets/logo-pink.png',import.meta.url).href;
import {$,BLANK} from '../js/util.js';
import {dbPut} from '../js/db.js';
import {loadFont,openFonts} from '../js/fonts.js';
import {BGS,BG_CATS,applyBg} from './backgrounds.js';
import {exportPage,exportAll,exportPdf} from './export.js';
const PROPS=['frame','logoSrc','logoHex'];
let cv,W,H,Z=.4,proj,cur=0,hist=[],pos=-1,busy=false,st,back,clip;
const A=()=>cv&&cv.getActiveObject(),isT=o=>o&&(o.type==='i-text'||o.type==='textbox');
const pages=()=>proj.pages,flush=()=>{pages()[cur]=cv.toJSON(PROPS)};
export function openEditor(p,onBack){proj=p;W=p.w;H=p.h;back=onBack;
 $('#dash').style.display='none';$('#ed').style.display='flex';$('#name').value=p.name;
 if(cv)try{cv.dispose()}catch(e){}
 const el=document.createElement('canvas'),g=document.createElement('div');g.id='guide';$('#wrap').replaceChildren(el,g);
 Z=Math.min(.6,Math.max(.1,Math.min(($('#stage').clientWidth-60)/W,($('#stage').clientHeight-60)/H)));$('#zoom').value=Z*100;
 cv=new fabric.Canvas(el,{width:W*Z,height:H*Z,preserveObjectStacking:true});setZ();
 const story=H/W>1.7;$('#guideBtn').classList.toggle('hide',!story);
 g.style.cssText='position:absolute;inset:0;pointer-events:none;display:none';g.innerHTML=story?'<i style="top:0;height:14%"></i><i style="bottom:0;height:20%"></i>':'';
 cv.on({'object:modified':snap,'object:added':snap,'object:removed':snap,'selection:created':sel,'selection:updated':sel,'selection:cleared':sel});
 load(0,false)}
function setZ(){cv.setZoom(Z);cv.setDimensions({width:W*Z,height:H*Z})}
async function load(i,store=true){if(store)flush();cur=i;busy=true;const j=pages()[i]||BLANK;
 await Promise.all([...new Set((j.objects||[]).map(o=>o.fontFamily).filter(Boolean))].map(loadFont));
 cv.loadFromJSON(j,()=>{cv.getObjects().forEach(o=>o.initDimensions&&o.initDimensions());cv.renderAll();busy=false;hist=[JSON.stringify(cv.toJSON(PROPS))];pos=0;sel();bar()})}
function snap(){if(busy)return;hist=hist.slice(0,pos+1);hist.push(JSON.stringify(cv.toJSON(PROPS)));pos=hist.length-1;clearTimeout(st);st=setTimeout(save,800)}
function restore(){busy=true;cv.loadFromJSON(hist[pos],()=>{cv.renderAll();busy=false;sel();clearTimeout(st);st=setTimeout(save,800)})}
async function save(){try{flush();proj.name=$('#name').value||'Unbenannt';await dbPut({...proj,upd:Date.now(),thumb:cv.toDataURL({format:'jpeg',quality:.5,multiplier:160/(W*Z)})})}catch(e){console.error('Speichern fehlgeschlagen',e)}}
function bar(){const b=$('#pages');b.innerHTML=pages().map((_,i)=>`<button data-i="${i}" class="${i===cur?'on':''}">Seite ${i+1}</button>`).join('')+'<button data-a="add">+ Neu</button><button data-a="dup">Duplizieren</button><button data-a="del">Löschen</button><button data-a="l">◀</button><button data-a="r">▶</button>'}
$('#pages').onclick=async e=>{const d=e.target.dataset,P=pages();if(d.i!==undefined)return load(+d.i);
 if(d.a==='add'){flush();P.splice(cur+1,0,null);await load(cur+1,false)}
 if(d.a==='dup'){flush();P.splice(cur+1,0,P[cur]);await load(cur+1,false)}
 if(d.a==='del'&&P.length>1&&confirm('Seite löschen?')){P.splice(cur,1);await load(Math.min(cur,P.length-1),false)}
 if(d.a==='l'&&cur>0){flush();[P[cur-1],P[cur]]=[P[cur],P[cur-1]];await load(cur-1,false)}
 if(d.a==='r'&&cur<P.length-1){flush();[P[cur+1],P[cur]]=[P[cur],P[cur+1]];await load(cur+1,false)}
 save()};
$('#zoom').oninput=e=>{Z=e.target.value/100;setZ()};
$('#guideBtn').onclick=()=>{const g=$('#guide');g.style.display=g.style.display==='none'?'block':'none'};
$('#undo').onclick=()=>{if(pos>0){pos--;restore()}};$('#redo').onclick=()=>{if(pos<hist.length-1){pos++;restore()}};
$('#name').onchange=save;$('#back').onclick=async()=>{await save();$('#ed').style.display='none';$('#dash').style.display='block';back()};
const add=o=>{cv.add(o);cv.setActiveObject(o);cv.renderAll()},mid=()=>({left:W/2,top:H/2,originX:'center',originY:'center'});
function addText(f,w,size,txt){loadFont(f).then(()=>add(new fabric.Textbox(txt||'Dein Text',{...mid(),width:W*.8,fontSize:Math.round(size||W/9),fill:'#ffffff',fontFamily:f,fontWeight:w,textAlign:'center'})))}
$('#bgCat').innerHTML=BG_CATS.map(c=>`<option>${c}</option>`).join('');
const bgs=()=>{$('#bgs').innerHTML=BGS.map((b,i)=>b.cat===$('#bgCat').value?`<b data-i="${i}" title="${b.n}" style="background:${b.css}"></b>`:'').join('')};bgs();$('#bgCat').onchange=bgs;
$('#bgs').onclick=async e=>{const i=e.target.dataset.i;if(i==null)return;await applyBg(cv,W,H,BGS[i].s);snap()};
$('#bgc').oninput=e=>{cv.setBackgroundColor(e.target.value,()=>cv.renderAll())};$('#bgc').onchange=snap;
function sel(){const o=A();$('#props').classList.toggle('hide',!o);$('#hint').classList.toggle('hide',!!o);if(!o)return;
 $('#tp').classList.toggle('hide',!isT(o));$('#rmbg').classList.toggle('hide',o.type!=='image');$('#op').value=o.opacity;if(typeof o.fill==='string'&&/^#[0-9a-f]{6}$/i.test(o.fill))$('#fill').value=o.fill;
 if(isT(o)){$('#fontBtn').textContent=o.fontFamily;$('#fs').value=Math.round(o.fontSize);$('#ls').value=o.charSpacing;$('#lh').value=o.lineHeight}
 $('#lock').textContent=o.lockMovementX?'Entsperren':'Sperren'}
const set=(k,v,c)=>{const o=A();if(!o)return;o.set(k,v);cv.renderAll();if(c)snap()};
$('#fill').oninput=e=>set('fill',e.target.value);$('#fill').onchange=snap;$('#op').oninput=e=>set('opacity',+e.target.value);$('#op').onchange=snap;
$('#fs').onchange=e=>set('fontSize',+e.target.value,true);$('#ls').oninput=e=>set('charSpacing',+e.target.value);$('#ls').onchange=snap;$('#lh').oninput=e=>set('lineHeight',+e.target.value);$('#lh').onchange=snap;
$('#al').onclick=()=>set('textAlign','left',true);$('#ac').onclick=()=>set('textAlign','center',true);$('#ar').onclick=()=>set('textAlign','right',true);
const pick=async(n,w)=>{const o=A();if(!isT(o))return addText(n,w);await loadFont(n);o.set({fontFamily:n,fontWeight:w});o.initDimensions();cv.renderAll();sel();snap()};
$('#fontBtn').onclick=()=>openFonts(pick);
const del=()=>{const o=A();if(!o||o.isEditing)return;cv.getActiveObjects().forEach(x=>cv.remove(x));cv.discardActiveObject();cv.renderAll()};$('#del').onclick=del;
const dup=()=>{const o=A();if(o)o.clone(c=>{c.set({left:o.left+30,top:o.top+30});cv.add(c);cv.setActiveObject(c)})};$('#dup').onclick=dup;
$('#fw').onclick=()=>{const o=A();if(o){cv.bringForward(o);snap()}};$('#bw').onclick=()=>{const o=A();if(o){cv.sendBackwards(o);snap()}};
$('#lock').onclick=()=>{const o=A();if(!o)return;const l=!o.lockMovementX;o.set({lockMovementX:l,lockMovementY:l,lockScalingX:l,lockScalingY:l,lockRotation:l,hasControls:!l});cv.renderAll();sel();snap()};
$('#grp').onclick=()=>{const o=A();if(!o)return;if(o.type==='activeSelection')o.toGroup();else if(o.type==='group')o.toActiveSelection();cv.requestRenderAll();snap()};
$('#ctr').onclick=()=>{const o=A();if(o){o.setPositionByOrigin(new fabric.Point(W/2,H/2),'center','center');o.setCoords();cv.renderAll();snap()}};
document.addEventListener('keydown',e=>{if($('#ed').style.display!=='flex'||['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;const m=e.ctrlKey||e.metaKey;
 if(e.key==='Delete'||e.key==='Backspace')del();
 if(m&&e.key==='z'){e.preventDefault();$(e.shiftKey?'#redo':'#undo').click()}
 if(m&&e.key==='c'){const o=A();if(o&&!o.isEditing)o.clone(x=>clip=x)}
 if(m&&e.key==='v'&&clip&&!(A()&&A().isEditing))clip.clone(x=>{x.set({left:x.left+30,top:x.top+30});cv.add(x);cv.setActiveObject(x)})});
const ex=async f=>{try{cv.discardActiveObject();flush();await f(proj,$('#name').value||'design')}catch(e){alert('Export fehlgeschlagen: '+e.message)}};
const sc=()=>+$('#sc').value;
$('#exPng').onclick=()=>ex((p,n)=>exportPage(p,cur,'png',sc(),n));$('#exJpg').onclick=()=>ex((p,n)=>exportPage(p,cur,'jpeg',sc(),n));
$('#exAll').onclick=()=>ex((p,n)=>exportAll(p,'png',sc(),n));$('#exPdf').onclick=()=>ex((p,n)=>exportPdf(p,sc(),n));

export const api={get cv(){return cv},get W(){return W},get H(){return H},add,mid,snap,A,addText,pick};
