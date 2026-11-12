/* Portfolio Bilal Charni - script commun a toutes les pages */
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const root=document.documentElement;
const S=window.SITE,T=S.T;
const L=o=>`<span data-l="fr">${o.fr}</span><span data-l="en">${o.en}</span>`;
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine=matchMedia("(pointer:fine)").matches;
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const page=document.body.dataset.page||"home";
const APP={$,$$,L,T,store,motion:!reduce,fine,tasks:new Set()};
window.APP=APP;

/* ================= structure commune ================= */
const PAGES=[
  {id:"home",href:"index.html",t:T("Accueil","Home")},
  {id:"competences",href:"competences.html",t:T("Compétences","Skills")},
  {id:"projets",href:"projets.html",t:T("Projets","Projects")},
  {id:"parcours",href:"parcours.html",t:T("Parcours","Experience")},
  {id:"contact",href:"contact.html",t:T("Contact","Contact")}
];
const cur=a=>a.id===page?' aria-current="page"':"";
document.body.insertAdjacentHTML("afterbegin",`
<div class="cur" aria-hidden="true"></div><div class="cur-ring" aria-hidden="true"><span></span></div>
<div class="scrollbar" aria-hidden="true"></div>
<a class="sr" href="#main">Aller au contenu</a>
<header class="top">
  <a class="brand" href="index.html">Bilal&nbsp;<b>Charni</b><i>_</i></a>
  <nav class="main" aria-label="Navigation">${PAGES.map(p=>`<a href="${p.href}"${cur(p)}>${L(p.t)}</a>`).join("")}</nav>
  <div class="status"><span class="live"><i></i>${L(T("Disponible","Available"))}</span><span class="muted">${L(T("Alternance · Stage","Work-study · Internship"))}</span></div>
  <button class="menu-btn" aria-expanded="false" aria-controls="mnav">Menu</button>
</header>
<nav class="mnav" id="mnav" aria-label="Menu">
  <button class="round close" aria-label="Fermer"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 3l10 10M13 3L3 13"/></svg></button>
  ${PAGES.map((p,i)=>`<a href="${p.href}"${cur(p)}><small>0${i+1}</small>${L(p.t)}</a>`).join("")}
</nav>`);
document.body.insertAdjacentHTML("beforeend",`
<footer><span>&copy; 2026 Bilal Charni</span>${L(T("Marseille, France. Fait main, sans framework.","Marseille, France. Handmade, no framework."))}<a href="#top" style="color:var(--fg-2)">${L(T("Haut de page ↑","Back to top ↑"))}</a></footer>
<div class="ui-bl">
  <button class="lang" data-lang="fr">FR</button><button class="lang" data-lang="en">EN</button>
  <span class="sep"></span>
  <button class="on" id="motionBtn" aria-pressed="true" title="Animations"><span class="bars"><i></i><i></i><i></i><i></i></span>${L(T("Animations","Motion"))}</button>
</div>
<div class="ui-br">
  <a href="mailto:bilalcharni31@gmail.com"><span class="dot"></span>${L(T("Écrire","Write"))}</a>
  <a href="https://www.linkedin.com/in/bilal-charni-7b0b63357/" target="_blank" rel="noopener"><span class="dot"></span>LinkedIn</a>
</div>
<div class="toast pill" id="toast"></div>`);
$("footer a").addEventListener("click",e=>{e.preventDefault();scrollTo({top:0,behavior:APP.motion?"smooth":"auto"})});

/* menu mobile */
const mnav=$("#mnav"),mbtn=$(".menu-btn");
const setMenu=o=>{mnav.classList.toggle("open",o);mbtn.setAttribute("aria-expanded",o);document.body.classList.toggle("locked",o)};
mbtn.addEventListener("click",()=>setMenu(true));$(".close",mnav).addEventListener("click",()=>setMenu(false));
addEventListener("keydown",e=>{if(e.key==="Escape"&&mnav.classList.contains("open"))setMenu(false)});

/* ================= boucle d'animation (30 i/s pour les canvas) ================= */
let running=true,lastSlow=0;
APP.slow=new Set();
function frame(now){
  if(running){
    APP.tasks.forEach(t=>t(now));
    if(now-lastSlow>=32){lastSlow=now;APP.slow.forEach(t=>t(now))}
  }
  requestAnimationFrame(frame);
}
document.addEventListener("visibilitychange",()=>{running=!document.hidden});
requestAnimationFrame(frame);

/* ================= visuels en chevrons ================= */
const scenes=[];
/* Un visuel ne se redessine que s'il bouge : apparition, survol, ou vague (live). Sinon il est fige (0 calcul). */
const visIO=new IntersectionObserver(es=>es.forEach(e=>{const s=e.target.__scene;if(!s)return;s.vis=e.isIntersecting;
  if(s.vis){if(!s.seen){s.seen=true;s.t0=performance.now()}s.idle=false;draw(s,performance.now())}}),{rootMargin:"40px"});
function chevron(cv,word,opts={}){
  const s={cv,word,cell:opts.cell||12,live:opts.live!==false,hov:false,seen:false,t0:performance.now(),vis:false,mx:-1e4,my:-1e4,tmx:-1e4,tmy:-1e4};
  cv.__scene=s;scenes.push(s);visIO.observe(cv);size(s);
  const host=opts.host||cv.parentElement;
  if(fine){
    host.addEventListener("pointerenter",()=>{s.hov=true;s.idle=false});
    host.addEventListener("pointermove",e=>{const r=cv.getBoundingClientRect();s.tmx=e.clientX-r.left;s.tmy=e.clientY-r.top;if(s.mx<-1e3){s.mx=s.tmx;s.my=s.tmy}s.idle=false});
    host.addEventListener("pointerleave",()=>{s.hov=false;s.tmx=s.tmy=-1e4});
  }
  return s;
}
function size(s){
  const r=s.cv.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.25);
  if(!r.width||!r.height)return;
  s.w=r.width;s.h=r.height;s.cv.width=Math.round(r.width*dpr);s.cv.height=Math.round(r.height*dpr);
  s.ctx=s.cv.getContext("2d");s.ctx.setTransform(dpr,0,0,dpr,0,0);
  const cc=s.w<420?Math.max(9,s.cell-2):s.cell;s.cc=cc;s.ch=cc*.64;
  const cols=Math.ceil(s.w/cc),rows=Math.ceil(s.h/s.ch);s.cols=cols;s.rows=rows;
  const off=document.createElement("canvas");off.width=cols*4;off.height=rows*4;const o=off.getContext("2d");
  o.scale(4,4);o.fillStyle="#000";o.fillRect(0,0,cols,rows);
  const fx=Math.round(cols*.11),fy=Math.round(rows*.15);
  o.fillStyle="#555";o.fillRect(fx,fy,cols-2*fx,rows-2*fy);
  if(s.word){
    o.fillStyle=o.strokeStyle="#fff";o.textAlign="center";o.textBaseline="middle";o.lineJoin="round";
    const font=f=>`700 ${f}px "Martian Grotesk", sans-serif`;let fs=rows*.7;o.font=font(fs);
    const maxW=(cols-2*fx)*.86,mw=o.measureText(s.word).width;if(mw>maxW){fs*=maxW/mw;o.font=font(fs)}
    o.lineWidth=Math.max(.6,fs*.09);o.strokeText(s.word,cols/2,rows/2+fs*.04);o.fillText(s.word,cols/2,rows/2+fs*.04);
  }
  const d=o.getImageData(0,0,cols*4,rows*4).data;s.map=new Uint8Array(cols*rows);
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const v=d[((y*4+2)*cols*4+(x*4+2))*4];s.map[y*cols+x]=v>170?2:v>40?1:0}
  s.t0=performance.now();draw(s,s.t0+(APP.motion?0:1e6));
}
const NB=5;
function draw(s,now){
  const {ctx,cc,ch,cols,rows,map}=s;if(!ctx)return;
  const anim=APP.motion&&(s.live||s.hov),t=(now-s.t0)/1000;
  ctx.fillStyle="#0e121a";ctx.fillRect(0,0,s.w,s.h);
  const scan=APP.motion&&s.seen?Math.min(rows+3,t*rows*1.6):rows+3;
  s.mx+=(s.tmx-s.mx)*.3;s.my+=(s.tmy-s.my)*.3;
  const R=Math.max(70,s.w*.14),R2=R*R;
  const acc=[];for(let b=0;b<NB;b++)acc.push(new Path2D());
  const white=new Path2D(),dim=new Path2D(),hot=new Path2D();
  const w=cc*.32,h=ch*.36;
  for(let y=0;y<rows&&y<scan;y++){
    const cy=y*ch+ch/2;
    for(let x=0;x<cols;x++){
      const m=map[y*cols+x],cx=x*cc+cc/2;let yy=cy,p;
      const dx=cx-s.mx,dy=cy-s.my,d2=dx*dx+dy*dy;
      if(d2<R2){const k=1-Math.sqrt(d2)/R;yy-=k*k*ch*1.5;p=m===2?white:hot}
      else if(m===2)p=white;
      else if(m===1)p=dim;
      else{const wv=anim?Math.sin(x*.32+y*.21-t*2.4)*.5+.5:1;p=acc[Math.min(NB-1,(wv*NB)|0)]}
      p.moveTo(cx-w,yy-h);p.lineTo(cx,yy+h);p.lineTo(cx+w,yy-h);
    }
  }
  ctx.lineWidth=1.3;ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle="#fb5e28";
  for(let b=0;b<NB;b++){ctx.globalAlpha=.42+.58*(b/(NB-1));ctx.stroke(acc[b])}
  ctx.globalAlpha=1;
  ctx.strokeStyle="rgba(242,242,239,.15)";ctx.stroke(dim);
  ctx.strokeStyle="#f2f2ef";ctx.stroke(white);
  ctx.strokeStyle="#ffd2bd";ctx.lineWidth=1.6;ctx.stroke(hot);
  s.idle=!anim&&scan>=rows+3&&s.tmx<-1e3&&s.mx<-1e3;
}
APP.slow.add(now=>{for(const s of scenes){if(s.vis&&!s.idle)draw(s,now)}});
APP.chevron=chevron;
APP.redraw=()=>scenes.forEach(s=>{s.idle=false;draw(s,performance.now())});
let rz;addEventListener("resize",()=>{clearTimeout(rz);rz=setTimeout(()=>scenes.forEach(size),150)});
document.fonts&&document.fonts.ready.then(()=>scenes.forEach(size));

/* ================= texte decoupe + apparitions ================= */
function splitText(el){
  let i=0;
  (function walk(n){
    [...n.childNodes].forEach(c=>{
      if(c.nodeType===3){
        const frag=document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(p=>{if(!p)return;if(/^\s+$/.test(p)){frag.appendChild(document.createTextNode(" "));return}
          const w=document.createElement("span");w.className="w";const s=document.createElement("span");s.textContent=p;s.style.setProperty("--i",i++);w.appendChild(s);frag.appendChild(w)});
        c.replaceWith(frag);
      }else if(c.nodeType===1&&c.tagName!=="BR"&&c.tagName!=="I"&&!c.classList.contains("w"))walk(c);
      else if(c.tagName==="I"){const w=document.createElement("span");w.className="w";const s=document.createElement("span");s.style.setProperty("--i",i++);c.replaceWith(w);s.appendChild(c);w.appendChild(s)}
    });
  })(el);
}
$$(".st").forEach(splitText);
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const t=e.target;t.classList.add("in");
  const v=t.querySelector("[data-count]");if(v)countUp(v);io.unobserve(t)}),{rootMargin:"0px 0px -8% 0px"});
APP.observe=el=>io.observe(el);
function countUp(el){const n=+el.dataset.count;if(!APP.motion){el.textContent=n;return}const t0=performance.now();(function s(){const k=Math.min(1,(performance.now()-t0)/1300);el.textContent=Math.round(n*(1-Math.pow(1-k,4)));if(k<1)requestAnimationFrame(s)})()}

/* ================= curseur + boutons aimantes ================= */
const mouse={x:-100,y:-100};APP.mouse=mouse;
addEventListener("pointermove",e=>{mouse.x=e.clientX;mouse.y=e.clientY;if(fine&&e.pointerType==="mouse")document.body.classList.add("has-cursor")},{passive:true});
document.addEventListener("pointerleave",()=>document.body.classList.remove("has-cursor"));
if(fine){
  const c=$(".cur"),ring=$(".cur-ring"),txt=$(".cur-ring span");let rx=0,ry=0;
  document.addEventListener("pointerover",e=>{
    const p=e.target.closest(".proj,.ex");const a=e.target.closest("a,button,[tabindex]");
    ring.classList.toggle("big",!!p);ring.classList.toggle("hov",!p&&!!a);
    txt.textContent=p?(root.lang==="en"?"Open":"Ouvrir"):"";
  });
  APP.tasks.add(()=>{rx+=(mouse.x-rx)*.22;ry+=(mouse.y-ry)*.22;c.style.transform=`translate(${mouse.x}px,${mouse.y}px)`;ring.style.transform=`translate(${rx}px,${ry}px)`});
  APP.magnet=el=>{
    el.addEventListener("pointermove",e=>{if(!APP.motion)return;const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.22}px,${(e.clientY-r.top-r.height/2)*.3}px)`});
    el.addEventListener("pointerleave",()=>{el.style.transform=""});
  };
}else APP.magnet=()=>{};

/* ================= barre de defilement ================= */
const bar=$(".scrollbar");let ticking=false;
addEventListener("scroll",()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;bar.style.transform=`scaleX(${max>0?scrollY/max:0})`;ticking=false})},{passive:true});

/* ================= langue + animations ================= */
function setLang(l){root.lang=l;$$(".ui-bl .lang").forEach(b=>b.classList.toggle("on",b.dataset.lang===l));store.set("lang",l);APP.redraw()}
$$(".ui-bl .lang").forEach(b=>b.addEventListener("click",()=>setLang(b.dataset.lang)));
const mBtn=$("#motionBtn");
function setMotion(on){APP.motion=on;mBtn.classList.toggle("on",on);mBtn.setAttribute("aria-pressed",on);root.classList.toggle("still",!on);store.set("motion",on?"1":"0");APP.redraw();APP.onMotion&&APP.onMotion(on)}
mBtn.addEventListener("click",()=>setMotion(!APP.motion));

/* ================= contenu par page ================= */
const ICON_ARROW='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12L12 4M5 4h7v7"/></svg>';

// bandeau
$$(".marquee .track").forEach(mq=>{const words=mq.dataset.words?mq.dataset.words.split("|"):S.MARQ;const h=words.map(w=>`<span>${w}</span>`).join("");mq.innerHTML=h+h+h});

// competences
const skillsEl=$("#skills");
if(skillsEl){
  S.SKILLS.forEach((k,i)=>{
    const it=document.createElement("div");it.className="acc-item"+(i===0?" on":"");
    it.innerHTML=`<button aria-expanded="${i===0}"><span class="n">0${i+1}</span><span class="t">${L(k.t)}</span><span class="plus"></span></button>
    <div class="acc-body"><p>${L(k.p)}</p><div class="tags">${k.tags.map(x=>`<span>${x}</span>`).join("")}</div></div>`;
    it.querySelector("button").addEventListener("click",()=>openSkill(i));
    skillsEl.appendChild(it);
  });
  const sc=chevron($("#skillScreen canvas"),S.SKILLS[0].word);
  const openSkill=i=>{
    $$(".acc-item",skillsEl).forEach((e,j)=>{e.classList.toggle("on",i===j);e.querySelector("button").setAttribute("aria-expanded",i===j)});
    sc.word=S.SKILLS[i].word;size(sc);
    $("#skillPill").innerHTML=`${L(S.SKILLS[i].t)} <em>0${i+1}</em>`;$("#skillIdx").textContent=`0${i+1} / 04`;
  };
  $("#skillPill").innerHTML=`${L(S.SKILLS[0].t)} <em>01</em>`;
}
const softEl=$("#soft");
if(softEl)softEl.innerHTML=S.SOFT.map(s=>`<div><h3><small>${s.c}</small>${L(s.t)}</h3><ul>${s.l.map(x=>`<li>${L(x)}</li>`).join("")}</ul></div>`).join("");

// projets + modale
const pg=$("#projGrid");
if(pg){
  S.PROJ.forEach((p,i)=>{
    const b=document.createElement("button");b.className="proj reveal";
    b.innerHTML=`<canvas></canvas><span class="shade"></span><div class="top"><span>${L(p.kind)}</span><b>0${i+1}</b></div><p class="desc">${L(p.d)}</p>
    <div class="label"><span class="pill">${L(p.t)} <em>${p.stack[0]}</em></span><span class="round" aria-hidden="true">${ICON_ARROW}</span></div>`;
    b.addEventListener("click",()=>openModal(i));
    pg.appendChild(b);chevron(b.querySelector("canvas"),p.word,{cell:13,host:b,live:false});
  });
  document.body.insertAdjacentHTML("beforeend",`<div class="modal" id="modal" aria-hidden="true"><div class="bg" data-close></div>
  <div class="box" role="dialog" aria-modal="true" aria-labelledby="mTitle"><div class="head"><canvas></canvas><button class="round close" data-close aria-label="Fermer"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 3l10 10M13 3L3 13"/></svg></button></div><div class="content" id="mContent"></div></div></div>`);
  const modal=$("#modal");let mScene=null,last=null,curP=0;
  const openModal=i=>{
    curP=i;const p=S.PROJ[i],n=S.PROJ.length,nx=(i+1)%n,pv=(i+n-1)%n;
    if(!modal.classList.contains("open"))last=document.activeElement;
    $("#mContent").innerHTML=`<div class="kick">${L(p.kind)} · 0${i+1}</div><h3 id="mTitle">${L(p.t)}</h3>
    <h4>${L(T("Contexte","Context"))}</h4><p>${L(p.ctx)}</p>
    <h4>${L(T("Implémentation technique","Technical implementation"))}</h4>
    <ul data-l="fr">${p.impl.fr.map(x=>`<li>${x}</li>`).join("")}</ul><ul data-l="en">${p.impl.en.map(x=>`<li>${x}</li>`).join("")}</ul>
    <div class="eval"><h4>${L(T("Ce que j'en retiens","What I took from it"))}</h4><p>${L(p.ev)}</p></div>
    <div class="stack">${p.stack.map(s=>`<span>${s}</span>`).join("")}</div>
    <div class="nav"><button class="pill dark" data-go="${pv}">← ${L(S.PROJ[pv].t)}</button><button class="pill dark" data-go="${nx}">${L(S.PROJ[nx].t)} →</button></div>`;
    $$("[data-go]",modal).forEach(b=>b.addEventListener("click",()=>{openModal(+b.dataset.go);$(".box",modal).scrollTop=0}));
    modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.classList.add("locked");
    requestAnimationFrame(()=>{if(!mScene)mScene=chevron($(".head canvas",modal),p.word,{cell:11});else{mScene.word=p.word;size(mScene)}});
    $(".close",modal).focus({preventScroll:true});
  };
  const closeModal=()=>{modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.classList.remove("locked");last&&last.focus({preventScroll:true})};
  $$("[data-close]",modal).forEach(e=>e.addEventListener("click",closeModal));
  addEventListener("keydown",e=>{if(!modal.classList.contains("open"))return;
    if(e.key==="Escape")closeModal();if(e.key==="ArrowRight")openModal((curP+1)%S.PROJ.length);if(e.key==="ArrowLeft")openModal((curP+S.PROJ.length-1)%S.PROJ.length)});
  const want=+(location.hash.match(/^#p(\d)$/)||[])[1];if(want>=1&&want<=S.PROJ.length)setTimeout(()=>openModal(want-1),300);
}

// passions
const passEl=$("#passGrid");
if(passEl)passEl.innerHTML=S.PASS.map((p,i)=>`<div class="pa reveal" style="transition-delay:${(i%3)*70}ms"><img src="${p.img}" alt="${p.t.fr}" loading="lazy" width="400" height="340"><span class="num">0${i+1}</span><span class="code">${p.c}</span><div class="txt"><p>${L(p.d)}</p><span class="pill">${L(p.t)}</span></div></div>`).join("");

// contact
const cc=$("#contactCanvas");if(cc)chevron(cc,"SYN",{cell:13,host:$(".contact")});
$$("[data-copy]").forEach(b=>b.addEventListener("click",async()=>{
  try{await navigator.clipboard.writeText(b.dataset.copy)}catch(e){}
  const t=$("#toast");t.innerHTML=`<span class="dot" style="color:var(--acc)"></span>${root.lang==="en"?"Email copied":"Adresse copiée"}`;t.classList.add("on");setTimeout(()=>t.classList.remove("on"),1800)}));

/* ================= EFFETS v3 (declenches par evenement) ================= */
const PAGE_NAMES={"index.html":T("Accueil","Home"),"competences.html":T("Compétences","Skills"),"projets.html":T("Projets","Projects"),"parcours.html":T("Parcours","Experience"),"contact.html":T("Contact","Contact")};

/* --- transitions entre pages --- */
document.body.insertAdjacentHTML("beforeend",'<div class="pt-label" aria-hidden="true"></div>');
const ptLabel=$(".pt-label");
const endEnter=()=>{if(!root.classList.contains("pt-enter"))return;root.classList.add("pt-out");setTimeout(()=>root.classList.remove("pt-enter","pt-out"),900)};
try{sessionStorage.removeItem("pt")}catch(e){}
setTimeout(endEnter,40);
setTimeout(()=>root.classList.remove("pt-enter","pt-out"),1600); /* securite : jamais de volet bloque */
addEventListener("pageshow",e=>{if(e.persisted)root.classList.remove("pt-leave","pt-enter","pt-out")});
document.addEventListener("click",e=>{
  const a=e.target.closest("a[href]");if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  if(a.target==="_blank"||a.hasAttribute("download"))return;
  const url=new URL(a.href,location.href);
  if(url.origin!==location.origin||!/\.html$|\/$/.test(url.pathname))return;
  if(url.pathname===location.pathname&&url.hash)return;
  if(!APP.motion)return;
  e.preventDefault();
  const file=url.pathname.split("/").pop()||"index.html",nm=PAGE_NAMES[file];
  ptLabel.innerHTML=nm?`${root.lang==="en"?nm.en:nm.fr}<i>.</i>`:"";
  if(mnav.classList.contains("open"))setMenu(false);
  root.classList.add("pt-leave");
  try{sessionStorage.setItem("pt","1")}catch(err){}
  setTimeout(()=>{location.href=url.href},620);
});

/* --- texte qui se "decode" au survol --- */
const GLY="!<>-_\\/[]{}=+*^?#01";
function scramble(el){
  const leaf=[...el.querySelectorAll("[data-l]")].find(x=>x.offsetParent!==null)||el;
  if(leaf.__busy||!APP.motion||leaf.children.length)return;
  const final=leaf.textContent;leaf.__busy=true;const t0=performance.now(),D=420;
  (function step(now){
    const k=Math.min(1,(now-t0)/D),n=Math.floor(final.length*k);
    let s=final.slice(0,n);for(let i=n;i<final.length;i++)s+=final[i]===" "?" ":GLY[(Math.random()*GLY.length)|0];
    leaf.textContent=s;
    if(k<1)requestAnimationFrame(step);else{leaf.textContent=final;leaf.__busy=false}
  })(t0);
}
$$("nav.main a,.mnav a,.ex h3,.next small,.status .live,.ui-br a").forEach(el=>el.addEventListener("pointerenter",()=>scramble(el)));

/* --- glitch sur les grands titres --- */
$$(".page-hero h1,.hero-card h1,.contact h2,.wordmark div").forEach(el=>el.classList.add("glitch"));

/* --- vague de lettres sur "page suivante" --- */
$$(".next h2").forEach(h=>{
  $$("[data-l]",h).forEach(sp=>{const txt=sp.textContent;sp.innerHTML="";sp.classList.add("wave");[...txt].forEach((c,i)=>{const s=document.createElement("span");s.className="ch";s.style.setProperty("--c",i);s.textContent=c===" "?" ":c;sp.appendChild(s)})});
  if(!h.querySelector("[data-l]")){const txt=h.textContent;h.innerHTML="";h.classList.add("wave");[...txt].forEach((c,i)=>{const s=document.createElement("span");s.className="ch";s.style.setProperty("--c",i);s.textContent=c;h.appendChild(s)})}
});

/* --- lumiere qui suit la souris --- */
if(fine){
  $$(".ex,.soft>div,.stats>div,.tl-row,.contact,.fut>div,.acc-list").forEach(el=>{
    el.classList.add("spot");
    el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect();el.style.setProperty("--sx",(e.clientX-r.left)+"px");el.style.setProperty("--sy",(e.clientY-r.top)+"px")});
  });
}

/* --- onde au clic --- */
addEventListener("pointerdown",e=>{
  if(!APP.motion||e.button!==0)return;
  const d=document.createElement("div");d.className="ripple";d.style.left=e.clientX+"px";d.style.top=e.clientY+"px";
  d.addEventListener("animationend",()=>d.remove());document.body.appendChild(d);
},{passive:true});

/* --- terminal interactif --- */
$(".ui-bl .sep").insertAdjacentHTML("beforebegin",'<button class="term-btn" id="termBtn" title="Terminal (touche T)" aria-label="Ouvrir le terminal">&gt;_</button>');
document.body.insertAdjacentHTML("beforeend",`<div class="term" id="term" aria-hidden="true"><div class="bg" data-tclose></div>
<div class="win" role="dialog" aria-modal="true" aria-label="Terminal"><div class="tbar"><i></i><i></i><i></i><span>bilal@portfolio: ~</span><button data-tclose>esc ✕</button></div>
<div class="out" id="tout" aria-live="polite"></div>
<form id="tform" autocomplete="off"><label for="tin">bilal@portfolio:~$</label><input id="tin" spellcheck="false" autocapitalize="off"></form>
<div class="hint">${L(T("Tapez <b>help</b> pour la liste des commandes. ↑ ↓ pour l'historique, Tab pour compléter.","Type <b>help</b> for the command list. ↑ ↓ for history, Tab to complete."))}</div></div></div>`);
const term=$("#term"),tout=$("#tout"),tin=$("#tin");let hist=[],hi=0,termLast=null;
const en=()=>root.lang==="en";
const print=(h,cls)=>{const d=document.createElement("div");if(cls)d.className=cls;d.innerHTML=h;tout.appendChild(d);tout.scrollTop=tout.scrollHeight};
const go=(f)=>{closeTerm();setTimeout(()=>{const a=document.createElement("a");a.href=f;document.body.appendChild(a);a.click()},150)};
const CMDS={
  help:()=>print(en()?
`<span class="c">Available commands</span>
  <span class="a">whoami</span>       who I am
  <span class="a">ls</span>           list pages
  <span class="a">cd</span> &lt;page&gt;    open a page (skills, projects, experience, contact, home)
  <span class="a">skills</span>       my technical stack
  <span class="a">projects</span>     my projects
  <span class="a">status</span>       what I am looking for
  <span class="a">cv</span>           open my CV
  <span class="a">mail</span>         write to me
  <span class="a">linkedin</span>     my LinkedIn
  <span class="a">ping</span>         test the connection
  <span class="a">lang</span> fr|en   switch language
  <span class="a">clear</span>        clear the screen
  <span class="a">exit</span>         close the terminal`:
`<span class="c">Commandes disponibles</span>
  <span class="a">whoami</span>       qui je suis
  <span class="a">ls</span>           liste des pages
  <span class="a">cd</span> &lt;page&gt;    ouvrir une page (competences, projets, parcours, contact, accueil)
  <span class="a">skills</span>       ma stack technique
  <span class="a">projets</span>      mes projets
  <span class="a">status</span>       ce que je recherche
  <span class="a">cv</span>           ouvrir mon CV
  <span class="a">mail</span>         m'écrire
  <span class="a">linkedin</span>     mon LinkedIn
  <span class="a">ping</span>         tester la connexion
  <span class="a">lang</span> fr|en   changer de langue
  <span class="a">clear</span>        effacer l'écran
  <span class="a">exit</span>         fermer le terminal`),
  whoami:()=>print(en()?"Bilal Charni, 3rd-year student, Bachelor in Networks &amp; Telecom (Cybersecurity), IUT Aix-Marseille, Luminy.\nCisco CCNA 1-2-3, Stormshield CSNA. Based in Marseille.":"Bilal Charni, étudiant en 3e année de BUT Réseaux et Télécoms (Cybersécurité), IUT d'Aix-Marseille, Luminy.\nCisco CCNA 1-2-3, Stormshield CSNA. Basé à Marseille."),
  ls:()=>print('<span class="a">accueil/</span>  <span class="a">competences/</span>  <span class="a">projets/</span>  <span class="a">parcours/</span>  <span class="a">contact/</span>  cv.pdf'),
  skills:()=>print(S.SKILLS.map(k=>`<span class="a">${en()?k.t.en:k.t.fr}</span>\n  ${k.tags.join(" · ")}`).join("\n")),
  projets:()=>print(S.PROJ.map((p,i)=>`<span class="a">0${i+1}</span> ${en()?p.t.en:p.t.fr}  <span style="color:var(--fg-3)">(${p.stack.slice(0,3).join(", ")})</span>`).join("\n")+(en()?"\n\nType <span class=\"a\">cd projects</span> to see them.":"\n\nTapez <span class=\"a\">cd projets</span> pour les voir.")),
  status:()=>print(en()?'<span class="g">● AVAILABLE</span>\nWork-study in systems &amp; network administration, now until August 2027 (16 weeks at school, 28 in company).\nAlso open to an internship from March to August 2027.':'<span class="g">● DISPONIBLE</span>\nAlternance en administration systèmes et réseaux, dès maintenant et jusqu\'en août 2027 (16 semaines à l\'IUT, 28 en entreprise).\nOuvert aussi à un stage de mars à août 2027.'),
  cv:()=>{print(en()?"Opening CV...":"Ouverture du CV...");window.open("CV/CV_Bilal_Charni.pdf","_blank","noopener")},
  mail:()=>{print("mailto:bilalcharni31@gmail.com");location.href="mailto:bilalcharni31@gmail.com"},
  linkedin:()=>{print(en()?"Opening LinkedIn...":"Ouverture de LinkedIn...");window.open("https://www.linkedin.com/in/bilal-charni-7b0b63357/","_blank","noopener")},
  ping:()=>{print("PING recruteur (10.13.0.1) 56(84) bytes of data.");let n=0;const iv=setInterval(()=>{n++;print(`64 bytes from 10.13.0.1: icmp_seq=${n} ttl=64 time=${(Math.random()*8+2).toFixed(1)} ms`);if(n>=4){clearInterval(iv);print(en()?'<span class="g">4 packets transmitted, 4 received, 0% packet loss. Ready to work together.</span>':'<span class="g">4 paquets transmis, 4 reçus, 0% de perte. Prêt à travailler ensemble.</span>')}},350)},
  sudo:()=>print(en()?'<span class="a">[sudo]</span> permission denied... but very motivated. Try <span class="a">mail</span> instead.':'<span class="a">[sudo]</span> permission refusée... mais très motivé. Essayez plutôt <span class="a">mail</span>.'),
  clear:()=>{tout.innerHTML=""},
  exit:()=>closeTerm(),
  date:()=>print(new Date().toLocaleString(en()?"en-GB":"fr-FR")),
  lang:a=>{const l=(a[0]||"").toLowerCase();if(l==="fr"||l==="en"){setLang(l);print(l==="en"?"Language: English":"Langue : français")}else print("lang fr | lang en")},
  cd:a=>{const m={"":"index.html","~":"index.html","accueil":"index.html","home":"index.html","competences":"competences.html","skills":"competences.html","projets":"projets.html","projects":"projets.html","parcours":"parcours.html","experience":"parcours.html","contact":"contact.html"};
    const k=(a[0]||"").toLowerCase().replace(/\/$/,"").normalize("NFD").replace(/[̀-ͯ]/g,"");
    if(k in m)go(m[k]);else print((en()?"cd: no such page: ":"cd : page introuvable : ")+(a[0]||""))}
};
CMDS.projects=CMDS.projets;CMDS.competences=CMDS.skills;CMDS.cls=CMDS.clear;CMDS.aide=CMDS.help;
function runCmd(raw){
  const line=raw.trim();print(`<span class="a">bilal@portfolio:~$</span> <span class="c">${line.replace(/[<>&]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;"}[c]))}</span>`);
  if(!line)return;hist.push(line);hi=hist.length;
  const [c,...args]=line.split(/\s+/);const f=CMDS[c.toLowerCase()];
  if(f)f(args);else print((en()?"command not found: ":"commande introuvable : ")+c.replace(/[<>&]/g,"")+(en()?" (type help)":" (tapez help)"));
}
function openTerm(){
  termLast=document.activeElement;term.classList.add("open");term.setAttribute("aria-hidden","false");document.body.classList.add("locked");
  if(!tout.childElementCount){print(en()?'<span class="g">Connection established.</span> Welcome to Bilal\'s terminal.':'<span class="g">Connexion établie.</span> Bienvenue dans le terminal de Bilal.');CMDS.help()}
  setTimeout(()=>tin.focus(),60);
}
function closeTerm(){term.classList.remove("open");term.setAttribute("aria-hidden","true");if(!$("#modal.open"))document.body.classList.remove("locked");termLast&&termLast.focus&&termLast.focus({preventScroll:true})}
$("#termBtn").addEventListener("click",openTerm);
$$("[data-tclose]",term).forEach(b=>b.addEventListener("click",closeTerm));
$("#tform").addEventListener("submit",e=>{e.preventDefault();runCmd(tin.value);tin.value=""});
tin.addEventListener("keydown",e=>{
  if(e.key==="ArrowUp"){e.preventDefault();if(hi>0)tin.value=hist[--hi]}
  else if(e.key==="ArrowDown"){e.preventDefault();hi=Math.min(hist.length,hi+1);tin.value=hist[hi]||""}
  else if(e.key==="Tab"){e.preventDefault();const v=tin.value.toLowerCase();const m=Object.keys(CMDS).filter(k=>k.startsWith(v));if(m.length===1)tin.value=m[0]+" ";else if(m.length)print(m.join("  "))}
});
addEventListener("keydown",e=>{
  if(e.key==="Escape"&&term.classList.contains("open")){closeTerm();return}
  const tag=(document.activeElement&&document.activeElement.tagName)||"";
  if((e.key==="t"||e.key==="T"||e.key==="`")&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!/INPUT|TEXTAREA/.test(tag)&&!term.classList.contains("open")&&!$("#tuner")){e.preventDefault();openTerm()}
});
APP.openTerm=openTerm;

/* ================= EFFETS v4 ================= */
/* --- inclinaison 3D des cartes (souris uniquement) --- */
if(fine){
  $$(".proj,.ex,.pa").forEach(el=>{
    el.classList.add("tilt");let raf=0,ev=null;
    el.addEventListener("pointermove",e=>{if(!APP.motion)return;ev=e;if(raf)return;raf=requestAnimationFrame(()=>{raf=0;const r=el.getBoundingClientRect(),x=(ev.clientX-r.left)/r.width-.5,y=(ev.clientY-r.top)/r.height-.5;
      el.classList.add("tilting");el.style.transform=`perspective(1000px) rotateY(${x*7}deg) rotateX(${-y*7}deg) translateY(-4px)`})});
    el.addEventListener("pointerleave",()=>{el.classList.remove("tilting");el.style.transform=""});
  });
}

/* --- titre des projets qui se decode au survol --- */
$$(".proj").forEach(b=>b.addEventListener("pointerenter",()=>{const p=b.querySelector(".label .pill");if(p)scramble(p)}));

/* --- clic sur un visuel : il se redessine en balayage --- */
$$("#skillScreen,.contact .r").forEach(h=>h.addEventListener("click",()=>{const cv=h.querySelector("canvas");const s=cv&&cv.__scene;if(!s||!APP.motion)return;
  s.t0=performance.now();s.idle=false;const box=h.closest(".screen,.contact");box.classList.remove("flash");void box.offsetWidth;box.classList.add("flash")}));

/* --- retour en haut avec anneau de progression --- */
document.body.insertAdjacentHTML("beforeend",`<a class="totop" href="#top" aria-label="${root.lang==="en"?"Back to top":"Haut de page"}"><svg class="ring" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="20.5" stroke-dasharray="128.8" stroke-dashoffset="128.8"/></svg><svg class="arr" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M8 14V2M3 7l5-5 5 5"/></svg></a>`);
const totop=$(".totop"),ringC=$(".totop circle");
totop.addEventListener("click",e=>{e.preventDefault();scrollTo({top:0,behavior:APP.motion?"smooth":"auto"})});
let tt=false;
const updTop=()=>{tt=false;const max=document.documentElement.scrollHeight-innerHeight,k=max>0?scrollY/max:0;ringC.style.strokeDashoffset=128.8*(1-k);totop.classList.toggle("on",scrollY>innerHeight*.6)};
addEventListener("scroll",()=>{if(!tt){tt=true;requestAnimationFrame(updTop)}},{passive:true});updTop();

/* ================= init ================= */
$$(".reveal,.st:not(.hero-st)").forEach(el=>io.observe(el));
$$("[data-mag],.ui-br a").forEach(el=>APP.magnet(el));
setLang(store.get("lang")||"fr");
if(store.get("motion")==="0"||reduce)setMotion(false);
})();
