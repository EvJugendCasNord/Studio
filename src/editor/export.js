import {fabric} from 'fabric';
import {jsPDF} from 'jspdf';
import {loadFont} from '../js/fonts.js';
import {BLANK,download} from '../js/util.js';
async function render(json,W,H,fmt,scale){json=json||BLANK;
 await Promise.all([...new Set((json.objects||[]).map(o=>o.fontFamily).filter(Boolean))].map(loadFont));
 const c=new fabric.StaticCanvas(null,{width:W,height:H});await new Promise(r=>c.loadFromJSON(json,r));
 c.getObjects().forEach(o=>o.initDimensions&&o.initDimensions());c.renderAll();
 const u=c.toDataURL({format:fmt,quality:.95,multiplier:scale});c.dispose();return u}
const ext=f=>f==='jpeg'?'jpg':'png';
export async function exportPage(p,i,fmt,sc,name){download(await render(p.pages[i],p.w,p.h,fmt,sc),`${name}-seite${i+1}.${ext(fmt)}`)}
export async function exportAll(p,fmt,sc,name){for(let i=0;i<p.pages.length;i++){await exportPage(p,i,fmt,sc,name);await new Promise(r=>setTimeout(r,400))}}
export async function exportPdf(p,sc,name){const d=new jsPDF({orientation:p.w>p.h?'l':'p',unit:'px',format:[p.w,p.h],hotfixes:['px_scaling']});
 for(let i=0;i<p.pages.length;i++){if(i)d.addPage([p.w,p.h],p.w>p.h?'l':'p');d.addImage(await render(p.pages[i],p.w,p.h,'jpeg',sc),'JPEG',0,0,p.w,p.h)}
 d.save(name+'.pdf')}
