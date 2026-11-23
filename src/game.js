import {CREATURES,REGIONS,TYPES,MOVES} from "./creatures.js";

const $ = (id)=>document.getElementById(id);
const canvas=$("world"),ctx=canvas.getContext("2d");
const TILE_W=72,TILE_H=36,WORLD=64,STORE="wildlight-save-v2";
const state={running:false,player:{x:9,z:31,name:"Rin",color:"#D49B7D",hair:"#493A36",outfit:"#E6A58F",facing:1},party:[],collection:[],seen:new Set(),caught:new Set(),lures:8,glow:240,day:3,minutes:9*60+42,steps:0,quest:0,active:0,creatures:[],objects:[],blocked:new Set(),battle:null,panel:null,toastTimer:0,toastText:"",camera:{x:0,y:0},input:{x:0,y:0},target:null,last:0,elapsed:0};
const rand=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)],clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const regionAt=(x,z)=>REGIONS.find(r=>x>=r.x0&&x<=r.x1&&z>=r.z0&&z<=r.z1)||REGIONS[0];
const speciesById=id=>CREATURES.find(c=>c.id===id);
const tileKey=(x,z)=>Math.floor(x)+","+Math.floor(z);
const iso=(x,z)=>({x:(x-z)*TILE_W/2,y:(x+z)*TILE_H/2});
const worldFromScreen=(sx,sy)=>({x:sx/TILE_W+sy/TILE_H,z:sy/TILE_H-sx/TILE_W});
function toast(message){state.toastText=message;state.toastTimer=2.6;$("toast").textContent=message;$("toast").classList.add("show");}
function resize(){const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}
new ResizeObserver(resize).observe(canvas);resize();

function pathNear(x,z){
 const lines=[[[5,31],[17,31],[25,26],[33,20],[44,16],[53,12]],[[25,26],[29,37],[34,47]],[[34,47],[45,49],[53,53]]];
 for(const line of lines)for(let i=0;i<line.length-1;i++){const [ax,az]=line[i],[bx,bz]=line[i+1],dx=bx-ax,dz=bz-az,t=clamp(((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz),0,1);if(Math.hypot(x-(ax+t*dx),z-(az+t*dz))<1.15)return true;}
 return false;
}
function waterAt(x,z){return (x>58&&z<27)||(x>48&&x<57&&z>4&&z<10)||(x>4&&x<12&&z>3&&z<10);}
function groundAt(x,z){const r=regionAt(x,z);return r.ground;}
function buildWorld(){
 let seed=94821;const rng=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<155;i++){const x=rand(0,WORLD),z=rand(0,WORLD),r=regionAt(x,z);if((r.id==="whisperwood"&&rng()<.72)||(r.id==="sunmeadow"&&rng()<.14)||(r.id==="frostveil"&&rng()<.28)){if(!pathNear(x,z)&&!waterAt(x,z)){state.objects.push({kind:"tree",x,z,scale:rand(.75,1.3),variant:Math.floor(rng()*3)});state.blocked.add(tileKey(x,z));}}}
 for(let i=0;i<65;i++){const x=rand(0,WORLD),z=rand(0,WORLD);if(!pathNear(x,z)&&!waterAt(x,z)){state.objects.push({kind:"flower",x,z,scale:rand(.6,1.2),variant:Math.floor(rng()*4)});}}
 for(let i=0;i<28;i++){const x=rand(0,WORLD),z=rand(0,WORLD);if(!pathNear(x,z)&&!waterAt(x,z)&&!state.blocked.has(tileKey(x,z))){state.objects.push({kind:"rock",x,z,scale:rand(.65,1.1)});if(rng()<.6)state.blocked.add(tileKey(x,z));}}
 state.objects.push(
  {kind:"house",x:7,z:25,scale:1},{kind:"house",x:12,z:28,scale:.85},{kind:"windmill",x:17,z:20,scale:1.1},
  {kind:"bridge",x:53,z:17,scale:1},{kind:"crystal",x:50,z:46,scale:1.1}
 );
 for(const o of state.objects)if(["house","windmill"].includes(o.kind)){for(let dx=0;dx<2;dx++)for(let dz=0;dz<2;dz++)state.blocked.add(tileKey(o.x+dx,o.z+dz));}
 for(const r of REGIONS){const list=CREATURES.filter(c=>c.region===r.id);for(let i=0;i<11;i++){const species=pick(list);let x,z,tries=0;do{x=rand(r.x0+1,r.x1-1);z=rand(r.z0+1,r.z1-1);tries++;}while((waterAt(x,z)||state.blocked.has(tileKey(x,z))||pathNear(x,z))&&tries<40);state.creatures.push({id:species.id,x,z,homeX:x,homeZ:z,hp:species.hp,level:Math.floor(rand(3,8)),phase:rand(0,7),dir:rand(0,Math.PI*2),wander:rand(1,5),visible:true});}}
}
buildWorld();

function makeCreature(id,level=5){const s=speciesById(id);return {id,level,xp:0,hp:s.hp,maxHp:s.hp,atk:s.atk,def:s.def,spd:s.spd,moves:s.learn.slice(0,4)};}
function startGame(){
 const name=$("trainerName").value.trim();state.player.name=name||"Rin";state.player.color=$("skinColor").value;state.player.hair=$("hairColor").value;state.player.outfit=$("outfitColor").value;
 state.party=[makeCreature($("starterChoice").value,5)];state.running=true;$("startScreen").classList.add("hidden");toast("Your journey begins in Sunmeadow!");updateUI();save();
}
function save(){try{localStorage.setItem(STORE,JSON.stringify({...state,seen:[...state.seen],caught:[...state.caught],camera:undefined,input:undefined,target:undefined,blocked:undefined,objects:undefined,creatures:undefined,battle:undefined,panel:undefined}));$("saveStatus").textContent="Saved";}catch(e){$("saveStatus").textContent="Save unavailable";}}
function load(){
 try{const d=JSON.parse(localStorage.getItem(STORE)||"null");if(!d)return false;
  Object.assign(state,d);state.seen=new Set(d.seen||[]);state.caught=new Set(d.caught||[]);state.running=true;state.battle=null;state.panel=null;state.target=null;$("startScreen").classList.add("hidden");updateUI();toast("Welcome back, "+state.player.name+".");return true;
 }catch(e){return false;}
}
function updateUI(){
 $("trainerLabel").textContent=state.player.name;$("glowCount").textContent=state.glow;$("lureCount").textContent=state.lures;
 $("partyCount").textContent=state.party.length+"/6";$("guideCount").textContent=state.caught.size+"/"+CREATURES.length;
 $("partyList").innerHTML=state.party.map((p,i)=>{const s=speciesById(p.id),active=i===state.active;return '<button class="party-entry '+(active?"selected":"")+'" data-party="'+i+'"><span class="mini-creature" style="--creature:'+s.color+';--accent:'+s.accent+'"></span><span class="party-copy"><b>'+s.name+'</b><small>'+TYPES[s.type].label+' · Lv. '+p.level+'</small><span class="hp-track"><i style="width:'+Math.max(0,p.hp/p.maxHp*100)+'%"></i></span></span><b class="hp-num">'+Math.max(0,p.hp)+'/'+p.maxHp+'</b></button>';}).join("");
 document.querySelectorAll("[data-party]").forEach(b=>b.addEventListener("click",()=>{state.active=Number(b.dataset.party);updateUI();}));
 $("guideProgress").style.width=(state.caught.size/CREATURES.length*100)+"%";
}
function drawDiamond(x,y,fill,stroke){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+TILE_W/2,y+TILE_H/2);ctx.lineTo(x,y+TILE_H);ctx.lineTo(x-TILE_W/2,y+TILE_H/2);ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=.6;ctx.stroke();}
function tileColor(x,z){const r=regionAt(x,z);let base=r.ground;if(waterAt(x,z))return "#86C3CF";if(pathNear(x+.5,z+.5))return "#D6C59D";const n=Math.sin(x*12.9898+z*78.233)*43758.5453;const v=n-Math.floor(n);return v>.82?shade(base,8):v<.12?shade(base,-6):base;}
function shade(hex,amount){const n=parseInt(hex.slice(1),16),r=clamp((n>>16)+amount,0,255),g=clamp(((n>>8)&255)+amount,0,255),b=clamp((n&255)+amount,0,255);return "rgb("+r+","+g+","+b+")";}
function drawWorld(){
 const w=canvas.clientWidth,h=canvas.clientHeight,p=iso(state.player.x,state.player.z);
 state.camera.x+=(p.x-w*.5-state.camera.x)*.12;state.camera.y+=(p.y-h*.55-state.camera.y)*.12;
 ctx.clearRect(0,0,w,h);ctx.fillStyle="#C9DFE4";ctx.fillRect(0,0,w,h);
 const cam=state.camera, corners=[worldFromScreen(cam.x-w*.7,cam.y-h*.7),worldFromScreen(cam.x+w*1.7,cam.y-h*.7),worldFromScreen(cam.x-w*.7,cam.y+h*1.7),worldFromScreen(cam.x+w*1.7,cam.y+h*1.7)];
 const minX=clamp(Math.floor(Math.min(...corners.map(c=>c.x)))-2,0,WORLD-1),maxX=clamp(Math.ceil(Math.max(...corners.map(c=>c.x)))+2,0,WORLD-1),minZ=clamp(Math.floor(Math.min(...corners.map(c=>c.z)))-2,0,WORLD-1),maxZ=clamp(Math.ceil(Math.max(...corners.map(c=>c.z)))+2,0,WORLD-1);
 for(let sum=minX+minZ;sum<=maxX+maxZ;sum++){for(let x=minX;x<=maxX;x++){const z=sum-x;if(z<minZ||z>maxZ)continue;const q=iso(x,z);drawDiamond(q.x-cam.x,q.y-cam.y,tileColor(x,z),"#ffffff18");}}
 const renderables=[];
 for(const o of state.objects){const q=iso(o.x+.5,o.z+.5);if(q.x-cam.x>-100&&q.x-cam.x<w+100&&q.y-cam.y>-120&&q.y-cam.y<h+120)renderables.push({y:q.y,draw:()=>drawObject(o,q.x-cam.x,q.y-cam.y)});}
 for(const c of state.creatures){if(!c.visible)continue;const q=iso(c.x+.5,c.z+.5);if(q.x-cam.x>-100&&q.x-cam.x<w+100&&q.y-cam.y>-100&&q.y-cam.y<h+100)renderables.push({y:q.y,draw:()=>drawCreature(c,q.x-cam.x,q.y-cam.y+Math.sin(state.elapsed*3+c.phase)*3,.8)});}
 const pq=iso(state.player.x+.5,state.player.z+.5);renderables.push({y:pq.y+.1,draw:()=>drawPlayer(pq.x-cam.x,pq.y-cam.y)});
 renderables.sort((a,b)=>a.y-b.y);for(const r of renderables)r.draw();
 const r=regionAt(state.player.x,state.player.z);$("regionName").textContent=r.name;$("regionSubtitle").textContent=r.subtitle;
 const near=nearestCreature();$("interactHint").classList.toggle("visible",!!near);
}
function drawObject(o,x,y){
 ctx.save();const s=o.scale||1;
 if(o.kind==="tree"){ctx.fillStyle="#765B43";ctx.fillRect(x-5*s,y-28*s,10*s,34*s);const colors=["#668A61","#77996A","#587D5D"];for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(x+(i-1)*13*s,y-40*s+i*2,24*s,24*s,0,0,Math.PI*2);ctx.fillStyle=colors[(o.variant+i)%3];ctx.fill();}ctx.beginPath();ctx.ellipse(x,y-16*s,28*s,8*s,0,0,Math.PI*2);ctx.fillStyle="#405E4B40";ctx.fill();}
 else if(o.kind==="rock"){ctx.beginPath();ctx.ellipse(x,y-8*s,18*s,12*s,0,0,Math.PI*2);ctx.fillStyle="#8D927F";ctx.fill();ctx.beginPath();ctx.ellipse(x-5*s,y-13*s,8*s,5*s,0,0,Math.PI*2);ctx.fillStyle="#B7B6A1";ctx.fill();}
 else if(o.kind==="flower"){const cols=["#E8A5A0","#E8CB81","#B6A6CF","#F5E9D1"];ctx.strokeStyle="#65845E";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-12*s);ctx.stroke();for(let i=0;i<5;i++){const a=i*Math.PI*2/5;ctx.beginPath();ctx.arc(x+Math.cos(a)*5*s,y-13*s+Math.sin(a)*5*s,3.5*s,0,Math.PI*2);ctx.fillStyle=cols[o.variant];ctx.fill();}ctx.beginPath();ctx.arc(x,y-13*s,3*s,0,Math.PI*2);ctx.fillStyle="#F4D989";ctx.fill();}
 else if(o.kind==="house"){ctx.fillStyle="#F2E5C8";ctx.fillRect(x-37*s,y-65*s,74*s,58*s);ctx.fillStyle="#C87966";ctx.beginPath();ctx.moveTo(x-45*s,y-62*s);ctx.lineTo(x,y-102*s);ctx.lineTo(x+45*s,y-62*s);ctx.closePath();ctx.fill();ctx.fillStyle="#7B5A4A";ctx.fillRect(x-8*s,y-38*s,17*s,31*s);ctx.fillStyle="#9FC9C7";ctx.fillRect(x-28*s,y-49*s,13*s,14*s);ctx.fillRect(x+15*s,y-49*s,13*s,14*s);}
 else if(o.kind==="windmill"){ctx.fillStyle="#E9DFC7";ctx.fillRect(x-17*s,y-86*s,34*s,85*s);ctx.fillStyle="#C87966";ctx.beginPath();ctx.moveTo(x-24*s,y-83*s);ctx.lineTo(x,y-110*s);ctx.lineTo(x+24*s,y-83*s);ctx.fill();ctx.strokeStyle="#F7F0DF";ctx.lineWidth=7*s;ctx.beginPath();ctx.moveTo(x,y-130*s);ctx.lineTo(x,y-63*s);ctx.moveTo(x-33*s,y-96*s);ctx.lineTo(x+33*s,y-96*s);ctx.stroke();ctx.fillStyle="#D9C8A7";ctx.beginPath();ctx.arc(x,y-96*s,6*s,0,Math.PI*2);ctx.fill();}
 else if(o.kind==="bridge"){ctx.fillStyle="#9D795A";ctx.fillRect(x-34*s,y-12*s,68*s,16*s);ctx.strokeStyle="#E4CDA7";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x-32*s,y-17*s);ctx.lineTo(x+32*s,y-17*s);ctx.stroke();}
 else if(o.kind==="crystal"){ctx.fillStyle="#9AC6D2";ctx.beginPath();ctx.moveTo(x,y-54*s);ctx.lineTo(x+18*s,y-15*s);ctx.lineTo(x+8*s,y+1*s);ctx.lineTo(x-13*s,y+1*s);ctx.lineTo(x-21*s,y-15*s);ctx.closePath();ctx.fill();ctx.strokeStyle="#E4F4F1";ctx.lineWidth=3;ctx.stroke();}
 ctx.restore();
}
function drawCreature(c,x,y,scale=1){
 const s=speciesById(c.id);if(!s)return;const sc=scale*(s.shape==="bear"?1.1:1);
 ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);ctx.fillStyle="#40583A35";ctx.beginPath();ctx.ellipse(0,4,25,8,0,0,Math.PI*2);ctx.fill();
 const body=(cx,cy,rx,ry,col)=>{ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();};
 const shape=s.shape;
 if(shape==="moth"||shape==="bird"){body(-18,-12,18,13,s.accent);body(18,-12,18,13,s.accent);}
 if(shape==="rabbit"||shape==="cat"||shape==="fox"||shape==="cub"||shape==="bear"){body(-13,-31,8,16,s.color);body(13,-31,8,16,s.color);}
 if(shape==="sprout"){body(-11,-43,7,17,s.accent);body(11,-43,7,17,s.accent);body(0,-50,13,7,s.color);}
 if(shape==="rock"){ctx.beginPath();ctx.moveTo(-24,-13);ctx.lineTo(-17,-42);ctx.lineTo(0,-52);ctx.lineTo(20,-39);ctx.lineTo(25,-13);ctx.closePath();ctx.fillStyle=s.color;ctx.fill();}
 else if(shape==="float"||shape==="wisp"){body(0,-25,24,24,s.color);body(-10,-49,10,10,s.accent);body(10,-49,10,10,s.accent);}
 else if(shape==="fish"){body(0,-25,25,16,s.color);ctx.beginPath();ctx.moveTo(21,-25);ctx.lineTo(39,-40);ctx.lineTo(37,-10);ctx.closePath();ctx.fillStyle=s.accent;ctx.fill();}
 else if(shape==="turtle"){body(0,-24,28,20,s.color);body(0,-29,19,14,s.accent);}
 else if(shape==="deer"){body(0,-25,23,20,s.color);ctx.strokeStyle=s.accent;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-9,-43);ctx.lineTo(-16,-59);ctx.lineTo(-23,-63);ctx.moveTo(9,-43);ctx.lineTo(16,-59);ctx.lineTo(23,-63);ctx.stroke();}
 else if(shape==="seal"||shape==="frog"||shape==="mole"||shape==="salamander"||shape==="hedgehog"||shape==="owl"||shape==="lizard"){body(0,-25,25,21,s.color);}
 else {body(0,-25,24,23,s.color);}
 if(shape==="hedgehog"){ctx.fillStyle=s.accent;for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(-20+i*6,-40);ctx.lineTo(-17+i*6,-56);ctx.lineTo(-10+i*6,-40);ctx.fill();}}
 if(shape==="owl"){body(-12,-45,9,10,s.accent);body(12,-45,9,10,s.accent);}
 if(shape==="cub"||shape==="bear"||shape==="fox"||shape==="cat"){body(-18,-44,10,9,s.color);body(18,-44,10,9,s.color);}
 body(0,-24,24,22,s.color);
 body(-8,-29,3.5,4.5,"#34433D");body(8,-29,3.5,4.5,"#34433D");
 ctx.beginPath();ctx.arc(0,-17,4,0,Math.PI);ctx.strokeStyle="#594B45";ctx.lineWidth=1.5;ctx.stroke();
 if(s.type==="EMBER"){body(0,-55,5,7,"#F6C27A");}
 if(s.type==="LEAF"){ctx.strokeStyle="#E4EBC0";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,-51);ctx.quadraticCurveTo(8,-64,16,-59);ctx.stroke();}
 if(s.type==="FROST"){ctx.fillStyle="#F3FAF7";ctx.beginPath();ctx.arc(-15,-47,4,0,Math.PI*2);ctx.arc(16,-46,3,0,Math.PI*2);ctx.fill();}
 ctx.restore();
}
function drawPlayer(x,y){
 ctx.save();ctx.translate(x,y);ctx.fillStyle="#40583A35";ctx.beginPath();ctx.ellipse(0,0,16,6,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle="#7A5D4B";ctx.fillRect(-8,-29,7,26);ctx.fillRect(2,-29,7,26);
 ctx.fillStyle=state.player.outfit;ctx.beginPath();ctx.roundRect(-12,-55,24,29,8);ctx.fill();
 ctx.fillStyle=state.player.color;ctx.beginPath();ctx.arc(0,-67,12,0,Math.PI*2);ctx.fill();
 ctx.fillStyle=state.player.hair;ctx.beginPath();ctx.arc(0,-72,12,Math.PI,Math.PI*2);ctx.fill();ctx.fillRect(-12,-73,5,12);
 ctx.fillStyle="#3D4D45";ctx.beginPath();ctx.arc(-4,-66,1.4,0,Math.PI*2);ctx.arc(4,-66,1.4,0,Math.PI*2);ctx.fill();ctx.restore();
}
function nearestCreature(){let best=null,dist=2.2;for(const c of state.creatures){if(!c.visible)continue;const d=Math.hypot(c.x-state.player.x,c.z-state.player.z);if(d<dist){best=c;dist=d;}}return best;}
function tryMove(dt){
 let sx=state.input.x,sy=state.input.y;
 if(state.target){const p=iso(state.player.x,state.player.z),t=iso(state.target.x,state.target.z);const dx=t.x-p.x,dy=t.y-p.y,d=Math.hypot(dx,dy);if(d<8){state.target=null;}else{sx=dx/d;sy=dy/d;}}
 const mag=Math.hypot(sx,sy);if(mag<.08)return;
 sx/=mag;sy/=mag;
 let vx=sx+sy,vz=sy-sx;const n=Math.hypot(vx,vz)||1;vx=vx/n;vz=vz/n;
 const speed=4.4*dt;const nx=state.player.x+vx*speed,nz=state.player.z+vz*speed;
 if(!isBlocked(nx,state.player.z))state.player.x=nx;
 if(!isBlocked(state.player.x,nz))state.player.z=nz;
 state.player.facing=sx<0?-1:1;state.steps+=dt*speed;
 if(state.target&&Math.hypot(state.player.x-state.target.x,state.player.z-state.target.z)<.7)state.target=null;
}
function isBlocked(x,z){if(x<.5||z<.5||x>WORLD-1.5||z>WORLD-1.5)return true;if(waterAt(x,z)&&!pathNear(x,z))return true;return state.blocked.has(tileKey(x,z));}
function updateCreatures(dt){
 for(const c of state.creatures){c.phase+=dt*2.2;c.wander-=dt;if(c.wander<=0){c.dir=rand(0,Math.PI*2);c.wander=rand(2,5);}
  const nx=c.x+Math.cos(c.dir)*dt*.32,nz=c.z+Math.sin(c.dir)*dt*.32,r=regionAt(c.homeX,c.homeZ);
  if(nx>r.x0+.5&&nx<r.x1-.5&&nz>r.z0+.5&&nz<r.z1-.5&&!isBlocked(nx,nz)){c.x=nx;c.z=nz;}else{c.dir+=Math.PI*.7;c.wander=.5;}
 }
}
function loop(ts){const dt=Math.min(.04,(ts-state.last)/1000||0);state.last=ts;state.elapsed+=dt;if(state.running&&!state.battle){tryMove(dt);updateCreatures(dt);state.minutes+=dt*1.2;if(state.minutes>=1440){state.minutes=360;state.day++;}if(state.toastTimer>0){state.toastTimer-=dt;if(state.toastTimer<=0)$("toast").classList.remove("show");}}drawWorld();requestAnimationFrame(loop);}
requestAnimationFrame(loop);

function interact(){if(!state.running||state.battle)return;const c=nearestCreature();if(c){startBattle(c);return;}const npc=Math.hypot(state.player.x-10,state.player.z-31);if(npc<3){state.quest=Math.max(state.quest,1);toast("Field note updated: discover creatures in every region.");save();return;}toast("Nothing nearby to interact with.");}
$("interactBtn").addEventListener("click",interact);window.addEventListener("keydown",e=>{const k=e.key.toLowerCase();if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"," "].includes(k))e.preventDefault();if(k==="w"||k==="arrowup")state.input.y=-1;if(k==="s"||k==="arrowdown")state.input.y=1;if(k==="a"||k==="arrowleft")state.input.x=-1;if(k==="d"||k==="arrowright")state.input.x=1;if(k==="e"||k===" ")interact();if(k==="escape")closePanel();});
window.addEventListener("keyup",e=>{const k=e.key.toLowerCase();if(k==="w"||k==="arrowup"||k==="s"||k==="arrowdown")state.input.y=0;if(k==="a"||k==="arrowleft"||k==="d"||k==="arrowright")state.input.x=0;});
const stick=$("stick"),nub=$("stickNub");let stickPointer=null;
function stickMove(e){const r=stick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,max=r.width*.34,d=Math.hypot(dx,dy),m=Math.min(max,d);state.input.x=d?dx/d*m/max:0;state.input.y=d?dy/d*m/max:0;nub.style.transform="translate("+state.input.x*max+"px,"+state.input.y*max+"px)";}
stick.addEventListener("pointerdown",e=>{stickPointer=e.pointerId;stick.setPointerCapture(e.pointerId);stickMove(e);state.target=null;});
stick.addEventListener("pointermove",e=>{if(stickPointer===e.pointerId)stickMove(e);});
const stickEnd=e=>{if(stickPointer===e.pointerId){stickPointer=null;state.input.x=0;state.input.y=0;nub.style.transform="translate(0,0)";}};
stick.addEventListener("pointerup",stickEnd);stick.addEventListener("pointercancel",stickEnd);
canvas.addEventListener("pointerdown",e=>{if(e.pointerType==="mouse"&&e.button!==0)return;const r=canvas.getBoundingClientRect(),sx=e.clientX-r.left+state.camera.x,sy=e.clientY-r.top+state.camera.y,t=worldFromScreen(sx,sy);state.target={x:clamp(t.x,1,WORLD-2),z:clamp(t.z,1,WORLD-2)};});
function typeMult(moveType,targetType){if(TYPES[moveType]?.strong===targetType)return 1.35;if(TYPES[moveType]?.weak===targetType)return .72;return 1;}
function startBattle(c){const s=speciesById(c.id);state.battle={wild:c,species:s,turn:"player",message:"A wild "+s.name+" appeared!",locked:false};state.seen.add(c.id);state.target=null;state.input.x=0;state.input.y=0;renderBattle();$("battleOverlay").classList.remove("hidden");}
function renderBattle(){
 const b=state.battle;if(!b)return;const s=b.species,p=state.party[state.active];$("wildName").textContent=s.name;$("wildLevel").textContent="Lv. "+b.wild.level+" · "+TYPES[s.type].label;$("wildHp").style.width=(b.wild.hp/s.hp*100)+"%";$("battleMessage").textContent=b.message;
 $("allyName").textContent=p?speciesById(p.id).name:"No companion";$("allyLevel").textContent=p?"Lv. "+p.level:"";$("allyHp").style.width=p?(p.hp/p.maxHp*100)+"%":"0%";
 const art=$("battleArt"),c=art.getContext("2d");art.width=art.clientWidth*2;art.height=art.clientHeight*2;c.scale(2,2);c.clearRect(0,0,art.clientWidth,art.clientHeight);
 c.fillStyle="#D8E7D0";c.fillRect(0,0,art.clientWidth,art.clientHeight);c.fillStyle="#A6C28A";c.beginPath();c.ellipse(art.clientWidth*.5,art.clientHeight*.72,art.clientWidth*.4,22,0,0,Math.PI*2);c.fill();
 const old=ctx;ctx=c;drawCreature({...b.wild,id:s.id,phase:0},art.clientWidth*.68,art.clientHeight*.7,1.5);if(p)drawCreature({id:p.id,phase:0},art.clientWidth*.28,art.clientHeight*.76,1.15);ctx=old;
 $("moveButtons").innerHTML=(p?p.moves:[]).map(m=>{const d=MOVES[m];return '<button class="move-button" data-move="'+m+'"><b>'+m+'</b><small>'+TYPES[d.type].label+' · '+d.power+' power</small></button>';}).join("");
 document.querySelectorAll("[data-move]").forEach(btn=>btn.addEventListener("click",()=>playerMove(btn.dataset.move)));
 $("catchBtn").disabled=state.lures<=0;$("catchBtn").textContent="Use Lure ("+state.lures+")";
}
function damage(attacker,defender,move){const m=MOVES[move],mult=typeMult(m.type,speciesById(defender.id).type);return Math.max(3,Math.round((m.power+attacker.atk*.55-defender.def*.28)*mult*rand(.88,1.12)));}
function playerMove(move){
 const b=state.battle,p=state.party[state.active];if(!b||b.locked||!p||p.hp<=0)return;b.locked=true;
 const d=damage(p,b.wild,move);b.wild.hp=Math.max(0,b.wild.hp-d);b.message=p.moves[0]===move?speciesById(p.id).name+" used "+move+"!":move+" hit for "+d+" damage!";renderBattle();
 setTimeout(()=>{if(b.wild.hp<=0){winBattle();return;}enemyTurn();},650);
}
function enemyTurn(){const b=state.battle,p=state.party[state.active];if(!b||!p)return;if(p.hp<=0){const next=state.party.findIndex(c=>c.hp>0);if(next<0){state.party.forEach(c=>c.hp=Math.max(1,Math.round(c.maxHp*.45)));endBattle("Your companions need a rest. They recovered at the village.");return;}state.active=next;}
 const active=state.party[state.active],move=pick(b.species.learn);const d=damage(makeCreature(b.wild.id,b.wild.level),active,move);active.hp=Math.max(0,active.hp-d);b.message=b.species.name+" used "+move+"! Your "+speciesById(active.id).name+" took "+d+" damage.";b.locked=false;renderBattle();updateUI();}
function winBattle(){const b=state.battle,p=state.party[state.active];if(p){p.xp+=12+b.wild.level*3;if(p.xp>=p.level*18){p.xp-=p.level*18;p.level++;p.maxHp+=4;p.hp=Math.min(p.maxHp,p.hp+10);p.atk+=2;p.def+=1;const s=speciesById(p.id);if(s.evolvesTo&&p.level>=s.evolveAt){p.id=s.evolvesTo;const evolved=speciesById(p.id);p.maxHp=evolved.hp;p.hp=evolved.hp;p.atk=evolved.atk;p.def=evolved.def;p.spd=evolved.spd;toast(s.name+" evolved into "+evolved.name+"!");}}}
 b.message="You won! "+(p?speciesById(p.id).name+" gained experience.":"");b.locked=true;renderBattle();setTimeout(()=>endBattle(b.message),1100);}
function catchWild(){const b=state.battle;if(!b||b.locked||state.lures<=0)return;state.lures--;const s=b.species,ratio=b.wild.hp/s.hp,rarity=s.rarity==="Rare"?.13:s.rarity==="Uncommon"?.06:0,chance=clamp(.72-ratio*.55-rarity,.12,.78);if(Math.random()<chance){const caught=makeCreature(s.id,b.wild.level);caught.hp=Math.max(1,b.wild.hp);state.caught.add(s.id);if(state.party.length<6)state.party.push(caught);else state.collection.push(caught);state.glow+=s.rarity==="Rare"?45:18;b.message=s.name+" joined your collection!";b.locked=true;renderBattle();updateUI();setTimeout(()=>endBattle(b.message),1000);}else{b.message=s.name+" slipped away from the lure!";renderBattle();setTimeout(enemyTurn,550);}save();}
function runAway(){if(state.battle)endBattle("You stepped away safely.");}
function endBattle(message){$("battleOverlay").classList.add("hidden");state.battle=null;updateUI();toast(message);save();}
$("catchBtn").addEventListener("click",catchWild);$("runBtn").addEventListener("click",runAway);
function openPanel(name){if(state.battle)return;state.panel=name;$("infoOverlay").classList.remove("hidden");const title=$("panelTitle"),content=$("panelContent");if(name==="guide"){title.textContent="Field Guide";content.innerHTML='<p class="panel-sub">Every species has a home region. Keep exploring to discover all '+CREATURES.length+'.</p><div class="guide-grid">'+CREATURES.map(s=>'<div class="guide-cell '+(state.caught.has(s.id)?"found":"")+'"><span class="mini-creature" style="--creature:'+s.color+';--accent:'+s.accent+'"></span><b>'+(state.caught.has(s.id)?s.name:"???")+'</b><small>'+TYPES[s.type].label+' · '+(state.caught.has(s.id)?s.rarity:"Unknown")+'</small></div>').join("")+'</div>';}
 else if(name==="party"){title.textContent="Creature Party";content.innerHTML=state.party.map((p,i)=>{const s=speciesById(p.id);return '<div class="collection-row"><span class="mini-creature" style="--creature:'+s.color+';--accent:'+s.accent+'"></span><div><b>'+s.name+'</b><small>'+TYPES[s.type].label+' · Level '+p.level+' · '+p.hp+'/'+p.maxHp+' HP</small></div><button data-active="'+i+'">Lead</button></div>';}).join("")+(state.collection.length?'<h3>Collection</h3>'+state.collection.map(p=>'<div class="collection-row"><b>'+speciesById(p.id).name+'</b><small>Lv. '+p.level+'</small></div>').join(""):"");content.querySelectorAll("[data-active]").forEach(b=>b.addEventListener("click",()=>{state.active=Number(b.dataset.active);updateUI();closePanel();toast(speciesById(state.party[state.active].id).name+" is leading.");}));}
 else{title.textContent="World Map";content.innerHTML='<div class="map-grid">'+REGIONS.map(r=>'<div class="map-region" style="background:'+r.ground+'"><b>'+r.name+'</b><small>'+r.subtitle+'</small><span>'+state.creatures.filter(c=>regionAt(c.x,c.z).id===r.id).length+' wild creatures nearby</span></div>').join("")+'</div>';}
}
function closePanel(){state.panel=null;$("infoOverlay").classList.add("hidden");}
document.querySelectorAll("[data-panel]").forEach(b=>b.addEventListener("click",()=>openPanel(b.dataset.panel)));
$("closePanel").addEventListener("click",closePanel);$("saveBtn").addEventListener("click",()=>{save();toast("Journey saved.");});
$("newGameBtn").addEventListener("click",startGame);$("continueBtn").addEventListener("click",()=>{if(!load())toast("No saved journey yet.");});
if(localStorage.getItem(STORE))$("continueBtn").classList.remove("hidden");
$("skinColor").addEventListener("input",e=>$("avatarPreview").style.setProperty("--skin",e.target.value));
$("hairColor").addEventListener("input",e=>$("avatarPreview").style.setProperty("--hair",e.target.value));
$("outfitColor").addEventListener("input",e=>$("avatarPreview").style.setProperty("--outfit",e.target.value));
$("starterChoice").addEventListener("change",e=>{const s=speciesById(e.target.value);$("starterPreview").style.setProperty("--creature",s.color);$("starterPreview").style.setProperty("--accent",s.accent);});
window.addEventListener("beforeunload",save);
