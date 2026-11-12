/* Accueil : intro (cadran) + couloir de serveurs */
(function(){
"use strict";
const APP=window.APP,S=window.SITE,{$,$$}=APP;

/* ================= intro ================= */
const tuner=$("#tuner");
const showHero=()=>$$(".hero-st").forEach(e=>e.classList.add("in"));
let seen=false;try{seen=sessionStorage.getItem("entered")==="1"}catch(e){}
if(!tuner||seen){tuner&&tuner.remove();setTimeout(showHero,80)}
else{
  document.body.classList.add("locked");
  const NS="http://www.w3.org/2000/svg",ticks=$(".ring .ticks"),labels=$(".ring .labels");
  const LABELS=["Réseaux","Cisco","Firewall","VLAN","Linux","KVM","Python","SSH","Supervision","IoT","Pentest","Snort"];
  for(let i=0;i<180;i++){const big=i%15===0,mid=i%5===0,l=document.createElementNS(NS,"line");
    l.setAttribute("x1",300);l.setAttribute("x2",300);l.setAttribute("y1",44);l.setAttribute("y2",big?62:mid?55:51);
    l.setAttribute("stroke",big?"rgba(242,242,239,.95)":"rgba(242,242,239,.4)");l.setAttribute("stroke-width",big?1.6:1);
    l.setAttribute("transform",`rotate(${i*2} 300 300)`);ticks.appendChild(l)}
  LABELS.forEach((t,i)=>{const a=i*30,flip=a>90&&a<270,g=document.createElementNS(NS,"text");
    g.setAttribute("x",300);g.setAttribute("y",flip?24:20);g.setAttribute("text-anchor","middle");
    g.setAttribute("transform",`rotate(${a} 300 300)`+(flip?" rotate(180 300 20)":""));g.textContent=t;labels.appendChild(g)});
  const rays=$("#tuner .rays");rays.setAttribute("viewBox","-100 -100 200 200");rays.setAttribute("preserveAspectRatio","xMidYMid slice");
  for(let i=0;i<12;i++){const a=(i*30+15)*Math.PI/180,l=document.createElementNS(NS,"line");
    l.setAttribute("x1",Math.sin(a)*40);l.setAttribute("y1",-Math.cos(a)*40);l.setAttribute("x2",Math.sin(a)*200);l.setAttribute("y2",-Math.cos(a)*200);
    l.setAttribute("stroke","rgba(242,242,239,.1)");l.setAttribute("stroke-width",.25);rays.appendChild(l)}
  const wedges=$("#tuner .wedges");
  S.PASS.forEach((p,i)=>{const d=document.createElement("div");d.className="wedge";d.style.backgroundImage=`url("${p.img}")`;
    const a0=(i*60-15)*Math.PI/180,a1=((i+1)*60-15)*Math.PI/180,R=150,pt=a=>`${50+Math.sin(a)*R}% ${50-Math.cos(a)*R}%`;
    d.style.clipPath=`polygon(50% 50%, ${pt(a0)}, ${pt((a0+a1)/2)}, ${pt(a1)})`;wedges.appendChild(d)});
  const BOOT=["[ <b>OK</b> ] eth0: link up, 1000 Mbps full-duplex","[ <b>OK</b> ] dhcp: lease 10.13.0.42/24","[ <b>OK</b> ] vlan 802.1Q: 10, 20, 99","[ <b>OK</b> ] stormshield: policy loaded","[ <b>OK</b> ] ssh: bilal@luminy","[ .. ] handshake portfolio"];
  const boot=$("#tuner .boot");boot.innerHTML=BOOT.map(l=>`<div>${l}</div>`).join("");
  [...boot.children].forEach((d,i)=>setTimeout(()=>d.classList.add("on"),150+i*200));
  const pct=$("#tuner .pct"),t0=performance.now();
  (function step(){const k=Math.min(1,(performance.now()-t0)/1300);pct.textContent=Math.round((1-Math.pow(1-k,3))*100)+"%";if(k<1)requestAnimationFrame(step);else tuner.classList.add("ready")})();
  const clock=$("#clock");const tick=()=>{if(!document.body.contains(clock))return;clock.textContent=new Date().toLocaleTimeString("fr-FR");setTimeout(tick,1000)};tick();
  const needle=$(".ring .needle"),labelEls=$$(".ring .labels text"),wedgeEls=$$("#tuner .wedge"),dial=$(".dial");
  let pend=null;
  tuner.addEventListener("pointermove",e=>{pend=e;});
  APP.tasks.add(()=>{if(!pend)return;const e=pend;pend=null;
    const r=dial.getBoundingClientRect();let a=Math.atan2(e.clientX-(r.left+r.width/2),-(e.clientY-(r.top+r.height/2)))*180/Math.PI;if(a<0)a+=360;
    needle.style.transform=`rotate(${a}deg)`;ticks.style.transform=`rotate(${a/8}deg)`;
    const idx=Math.round(a/30)%12;labelEls.forEach((t,i)=>t.classList.toggle("hot",i===idx));
    const w=Math.floor(((a+15)%360)/60);wedgeEls.forEach((el,i)=>el.classList.toggle("on",i===w));
  });
  const enter=()=>{
    if(tuner.classList.contains("out"))return;
    tuner.classList.add("out");document.body.classList.remove("locked");
    try{sessionStorage.setItem("entered","1")}catch(e){}
    boost=5;setTimeout(showHero,200);setTimeout(()=>tuner.remove(),900);
  };
  $("#tuneBtn").addEventListener("click",enter);$("[data-enter]").addEventListener("click",enter);
  dial.addEventListener("click",enter);
  addEventListener("keydown",e=>{if(document.body.contains(tuner)&&(e.key==="Enter"||e.key===" ")){e.preventDefault();enter()}});
}

/* ================= couloir de serveurs (canvas, 30 i/s) ================= */
const cor=$("#corridor");if(!cor)return;
const ctx=cor.getContext("2d");
let W=0,H=0,vis=true,camZ=0,boost=0,camX=0,camY=0,lastT=performance.now();
function sizeC(){const r=cor.getBoundingClientRect();W=r.width;H=r.height;cor.width=Math.round(W);cor.height=Math.round(H);draw(performance.now())}
new IntersectionObserver(es=>{vis=es[0].isIntersecting}).observe(cor);
let rz;addEventListener("resize",()=>{clearTimeout(rz);rz=setTimeout(sizeC,150)});
const HW=1.9,FLOOR=1.15,CEIL=-1.25,DEPTH=1.3,NEAR=.35,FAR=30;
const hash=(a,b)=>{let h=(a*374761393+b*668265263)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967295};
const packets=[];for(let i=0;i<12;i++)packets.push({z:2+Math.random()*FAR,lane:i%3,v:6+Math.random()*8});
const LEDC=["#fb5e28","#3ddc84","#f2f2ef"],NB=4;
function draw(now){
  const dt=Math.min(80,now-lastT);lastT=now;
  if(APP.motion){camZ+=(.55+boost)*dt/1000;boost*=.94}
  const f=H*.95,mx=APP.fine?(APP.mouse.x/W*2-1||0):0,my=APP.fine?(APP.mouse.y/H*2-1||0):0;
  camX+=(mx*.2-camX)*.08;camY+=(my*.1-camY)*.08;
  const cx=W/2-camX*f*.3,cy=H*.47-camY*f*.3;
  const P=(x,y,z)=>[cx+(x-camX)*f/z,cy+(y-camY)*f/z];
  ctx.clearRect(0,0,W,H);
  // sol
  const g=new Path2D();
  for(let i=-3;i<=3;i++){const x=i*HW/3,a=P(x,FLOOR,NEAR),b=P(x,FLOOR,FAR);g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1])}
  const off=camZ%1;for(let z=1-off;z<FAR;z+=1){if(z<NEAR)continue;const a=P(-HW,FLOOR,z),b=P(HW,FLOOR,z);g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1])}
  ctx.lineWidth=1;ctx.strokeStyle="rgba(242,242,239,.07)";ctx.stroke(g);
  // baies
  const start=Math.floor(camZ/DEPTH),n=Math.ceil(FAR/DEPTH)+1;
  const lines=[],leds=[];for(let b=0;b<NB;b++){lines.push(new Path2D());leds.push(LEDC.map(()=>new Path2D()))}
  for(let k=n;k>=0;k--){
    const idx=start+k,z0=idx*DEPTH-camZ,z1=z0+DEPTH*.9;
    if(z1<NEAR||z0>FAR)continue;
    const za=Math.max(z0,NEAR),fog=Math.min(1,za/FAR),fade=1-fog,bk=Math.min(NB-1,(fade*NB)|0),sh=Math.round(24-fog*16);
    ctx.fillStyle=`rgb(${sh},${sh+4},${sh+12})`;ctx.beginPath();
    for(const side of[-1,1]){
      const x=side*HW,a=P(x,CEIL,za),b=P(x,CEIL,z1),c=P(x,FLOOR,z1),d=P(x,FLOOR,za);
      ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.lineTo(c[0],c[1]);ctx.lineTo(d[0],d[1]);ctx.closePath();
      const Lp=lines[bk];Lp.moveTo(a[0],a[1]);Lp.lineTo(d[0],d[1]);Lp.moveTo(b[0],b[1]);Lp.lineTo(c[0],c[1]);
      if(fade<.1)continue;
      for(let u=1;u<9;u++){const y=CEIL+(FLOOR-CEIL)*u/9,p=P(x,y,za),q=P(x,y,z1);Lp.moveTo(p[0],p[1]);Lp.lineTo(q[0],q[1])}
      for(let u=0;u<9;u++){const y=CEIL+(FLOOR-CEIL)*(u+.5)/9;
        for(let l=0;l<4;l++){const hv=hash(idx*2+(side>0?1:0),u*7+l);if(hv<.35)continue;
          const lz=z0+DEPTH*(.15+l*.2);if(lz<NEAR)continue;
          if(Math.sin(now*.001*(1+hv*5)+hv*40)<=(hv>.85?-.2:.4))continue;
          const p=P(x,y,lz),sz=Math.max(1,f/lz*.014);leds[bk][hv>.8?0:hv>.6?1:2].rect(p[0]-sz/2,p[1]-sz/2,sz,sz*.7)}}
    }
    ctx.fill();
  }
  for(let b=0;b<NB;b++){const a=(b+1)/NB;ctx.strokeStyle=`rgba(242,242,239,${.1*a})`;ctx.stroke(lines[b]);ctx.globalAlpha=a;LEDC.forEach((c,i)=>{ctx.fillStyle=c;ctx.fill(leds[b][i])});ctx.globalAlpha=1}
  // paquets lumineux
  ctx.lineCap="round";ctx.strokeStyle="#ff8a5c";
  for(const p of packets){
    if(APP.motion)p.z-=(p.v+boost*3)*dt/1000;
    if(p.z<1.4){p.z=FAR;p.v=6+Math.random()*8}
    const x=[-.35,.35,0][p.lane],y=p.lane===2?FLOOR-.02:CEIL+.05,a=P(x,y,p.z),b=P(x,y,Math.min(FAR,p.z+1.2));
    ctx.globalAlpha=.9*(1-p.z/FAR);ctx.lineWidth=Math.max(1,f/p.z*.012);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
  }
  ctx.globalAlpha=1;
}
sizeC();
APP.slow.add(now=>{if(vis&&APP.motion)draw(now)});
APP.onMotion=()=>draw(performance.now());

/* commandes tapees dans la barre de la carte */
const typed=$("#typed");
if(typed){
  const CMDS=["whoami","cat alternance.txt","ping -c 1 recruteur","ssh bilal@votre-entreprise","show ip route","sudo systemctl start motivation"];
  let ci=0;
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  (async function loop(){
    await sleep(1200);
    for(;;){
      const c=CMDS[ci++%CMDS.length];
      if(!APP.motion){typed.textContent=c;await sleep(3000);continue}
      for(let i=1;i<=c.length;i++){typed.textContent=c.slice(0,i);await sleep(45+Math.random()*60)}
      await sleep(1800);
      for(let i=c.length;i>=0;i--){typed.textContent=c.slice(0,i);await sleep(18)}
      await sleep(350);
    }
  })();
  typed.addEventListener("click",()=>APP.openTerm&&APP.openTerm());
  typed.style.cursor="pointer";typed.title="Ouvrir le terminal";
}

/* reflet de la carte */
const card=$(".hero-card");
if(card&&APP.fine)$("#hero").addEventListener("pointermove",e=>{const r=card.getBoundingClientRect();card.style.setProperty("--mx",(e.clientX-r.left)+"px");card.style.setProperty("--my",(e.clientY-r.top)+"px")});
})();
