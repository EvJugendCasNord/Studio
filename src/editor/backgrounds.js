const fabric=window.fabric;
const G={'Pink':'Bonbon F9A8D4 EC4899,Flamingo FB7185 EC4899,Magenta EC4899 9D174D,Rosé FBCFE8 F472B6,Sunset FB923C EC4899',
'Pink-Violett':'Dream EC4899 A78BFA,Orchid F472B6 7C3AED,Berry BE185D 6D28D9,Aurora F9A8D4 A78BFA,Plum DB2777 4C1D95',
'Blau':'Ocean 3B82F6 06B6D4,Sky 93C5FD 3B82F6,Blau-Lila 3B82F6 A78BFA,Deep 1D4ED8 1E1B4B,Ice BAE6FD 818CF8',
'Pastell':'Pfirsich FDE68A FDA4AF,Mint A7F3D0 BAE6FD,Lavendel DDD6FE FBCFE8,Cotton FBCFE8 BFDBFE,Zitrone FEF9C3 FED7AA',
'Neon':'Neon-Pink FF2E93 7C3AED,Cyber 00F5D4 7B2FF7,Laser FF00E5 00E5FF,Volt C6FF00 00E676,Hot FF1744 FF9100',
'Dunkel':'Nacht 111018 4C1D95,Schwarz-Pink 111018 EC4899,Anthrazit 191722 3B3552,Midnight 0F172A 4338CA,Void 000000 581C87'};
const R={'Glow Pink':['EC4899','111018'],'Glow Violett':['A78BFA','111018'],'Glow Blau':['3B82F6','0B1020'],'Glow Pastell':['FBCFE8','DDD6FE']};
const P=[['Punkte','dots'],['Gitter','grid'],['Streifen','str'],['Karo','chk'],['Körnung','noise'],['Dreiecke','tri']];
export const BGS=[];
Object.entries(G).forEach(([cat,s])=>s.split(',').forEach(x=>{const p=x.split(' '),b=p.pop(),a=p.pop();BGS.push({cat,n:p.join(' '),s:{t:'lin',a:'#'+a,b:'#'+b},css:`linear-gradient(135deg,#${a},#${b})`})}));
Object.entries(R).forEach(([n,[a,b]])=>BGS.push({cat:'Abstrakt',n,s:{t:'rad',a:'#'+a,b:'#'+b},css:`radial-gradient(circle,#${a},#${b})`}));
P.forEach(([n,k])=>BGS.push({cat:'Muster',n,s:{t:'pat',k,base:'#191722',ink:'#EC489966'},css:'#191722'}));
['#FFFFFF','#111018','#191722','#EC4899','#F9A8D4','#A78BFA','#4C1D95','#3B82F6','#FDE68A','#34D399','#FB923C','#000000'].forEach(c=>BGS.push({cat:'Einfarbig',n:c,s:{t:'sol',a:c},css:c}));
export const BG_CATS=[...new Set(BGS.map(b=>b.cat))];
const PAT={dots:x=>{x.beginPath();x.arc(24,24,5,0,7);x.fill()},grid:x=>{x.lineWidth=2;x.strokeRect(0,0,48,48)},str:x=>{x.lineWidth=6;x.beginPath();x.moveTo(0,48);x.lineTo(48,0);x.stroke()},chk:x=>{x.fillRect(0,0,24,24);x.fillRect(24,24,24,24)},
 noise:x=>{for(let i=0;i<260;i++){x.globalAlpha=Math.random()*.5;x.fillRect(Math.random()*48,Math.random()*48,2,2)}},tri:x=>{x.beginPath();x.moveTo(24,6);x.lineTo(42,42);x.lineTo(6,42);x.closePath();x.fill()}};
export function applyBg(cv,W,H,s){let bg;const st=[{offset:0,color:s.a},{offset:1,color:s.b}];
 if(s.t==='lin')bg=new fabric.Gradient({type:'linear',gradientUnits:'pixels',coords:{x1:0,y1:0,x2:W,y2:H},colorStops:st});
 else if(s.t==='rad')bg=new fabric.Gradient({type:'radial',gradientUnits:'pixels',coords:{x1:W/2,y1:H/2,r1:0,x2:W/2,y2:H/2,r2:Math.max(W,H)*.7},colorStops:st});
 else if(s.t==='pat'){const c=document.createElement('canvas');c.width=c.height=48;const x=c.getContext('2d');x.fillStyle=s.base;x.fillRect(0,0,48,48);x.fillStyle=x.strokeStyle=s.ink;PAT[s.k](x);bg=new fabric.Pattern({source:c,repeat:'repeat'})}
 else bg=s.a;
 return new Promise(r=>cv.setBackgroundColor(bg,()=>{cv.renderAll();r()}))}
