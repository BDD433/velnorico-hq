/* VelnoriCo HQ 3D orbital station. three.js r147 (vendored), WebGL2 or WebGL1. ES5 only in this file. */
(function(){
var HQ=window.HQ,T=window.THREE,el=HQ.el;
function fallback(why){try{console.warn("HQ 3D fallback:",why);}catch(e){}location.replace("2d.html?nowebgl=1");}
if(!T||!T.OrbitControls)return fallback("three missing");
var ok=false;try{var c0=document.createElement("canvas");ok=!!(window.WebGLRenderingContext&&(c0.getContext("webgl2")||c0.getContext("webgl")||c0.getContext("experimental-webgl")));}catch(e){}
if(!ok||/[?&]2d/.test(location.search))return fallback("no webgl");
var Q=location.search.match(/[?&]q=(low|high)/),mobile=/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)||Math.min(screen.width,screen.height)<700;
var LOW=Q?Q[1]==="low":(localStorage.getItem("hqLow")!==null?localStorage.getItem("hqLow")==="1":(mobile||(navigator.hardwareConcurrency||4)<=4));
var renderer;try{renderer=new T.WebGLRenderer({antialias:!LOW,powerPreference:"low-power",preserveDrawingBuffer:/[?&]shot/.test(location.search)});}catch(e){return fallback(e);}
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,LOW?1:1.5));renderer.setSize(window.innerWidth,window.innerHeight);
renderer.shadowMap.enabled=!LOW;renderer.shadowMap.type=T.PCFShadowMap;
el("world").appendChild(renderer.domElement);
var scene=new T.Scene(),cam=new T.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.5,400);
var HOMECAM=mobile?[0,46,58]:[0,30,40];cam.position.set(HOMECAM[0],HOMECAM[1],HOMECAM[2]);
var ctl=new T.OrbitControls(cam,renderer.domElement);ctl.enableDamping=true;ctl.dampingFactor=0.08;ctl.maxPolarAngle=1.38;ctl.minDistance=5;ctl.maxDistance=110;ctl.target.set(0,0,2);ctl.screenSpacePanning=false;
scene.fog=new T.FogExp2(0x0a0b22,.0052);
var hemi=new T.HemisphereLight(0x8a9cff,0x1a0a24,0.6);scene.add(hemi);
var sun=new T.DirectionalLight(0xb8f6ff,0.6);sun.castShadow=!LOW;sun.shadow.mapSize.set(1024,1024);var sc=sun.shadow.camera;sc.left=sc.bottom=-40;sc.right=sc.top=40;sc.far=160;sun.position.set(30,50,20);scene.add(sun);scene.add(sun.target);
var moon=new T.DirectionalLight(0xff6fd8,0.45);moon.position.set(-30,40,-20);scene.add(moon);
/* ---------- helpers ---------- */
var MC={};function M(c,o){var k=c+(o?JSON.stringify(o):"");if(!MC[k]){var p={color:c};if(o)for(var i in o)p[i]=o[i];MC[k]=new T.MeshLambertMaterial(p);}return MC[k];}
function add(par,g,m,x,y,z,sh){var me=new T.Mesh(g,m);me.position.set(x||0,y||0,z||0);if(sh!==false&&!LOW){me.castShadow=true;me.receiveShadow=true;}par.add(me);return me;}
function box(par,w,h,d,c,x,y,z){return add(par,new T.BoxGeometry(w,h,d),typeof c==="number"?M(c):c,x,y,z);}
function sph(par,r,c,x,y,z,s){var m=add(par,new T.SphereGeometry(r,LOW?8:12,LOW?6:9),typeof c==="number"?M(c):c,x,y,z);if(s)m.scale.set(s[0],s[1],s[2]);return m;}
function cyl(par,rt,rb,h,c,x,y,z,seg){return add(par,new T.CylinderGeometry(rt,rb,h,seg||(LOW?8:12)),typeof c==="number"?M(c):c,x,y,z);}
function cone(par,r,h,c,x,y,z,seg){return add(par,new T.ConeGeometry(r,h,seg||8),typeof c==="number"?M(c):c,x,y,z);}
function roof(par,w,d,h,c,y){var s=new T.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(0,h);s.lineTo(-w/2,0);var g=new T.ExtrudeGeometry(s,{depth:d,bevelEnabled:false});g.translate(0,0,-d/2);return add(par,g,M(c),0,y,0);}
function label(text,opt){opt=opt||{};var cv=document.createElement("canvas"),x=cv.getContext("2d"),fs=44,F="600 "+fs+"px Helvetica, Arial, sans-serif";x.font=F;var w=Math.ceil(x.measureText(text).width)+(opt.dot?64:44);
 cv.width=w;cv.height=fs+30;var H=cv.height,r=H/2,ac=opt.accent||"#5ff3e0";x.font=F;x.beginPath();x.moveTo(r,3);x.lineTo(w-r,3);x.arc(w-r,r,r-3,-Math.PI/2,Math.PI/2);x.lineTo(r,H-3);x.arc(r,r,r-3,Math.PI/2,Math.PI*1.5);x.closePath();
 x.fillStyle=opt.bg||"rgba(10,12,30,.78)";x.fill();x.lineWidth=4;x.strokeStyle=ac;x.shadowColor=ac;x.shadowBlur=10;x.stroke();x.shadowBlur=0;
 if(opt.dot){x.fillStyle=opt.dot;x.beginPath();x.arc(30,H/2,10,0,7);x.fill();}x.fillStyle=opt.fg||"#e8f6ff";x.textBaseline="middle";x.fillText(text,opt.dot?50:22,H/2+2);
 var tx=new T.CanvasTexture(cv);tx.minFilter=T.LinearFilter;var sp=new T.Sprite(new T.SpriteMaterial({map:tx,depthTest:opt.depth!==false,transparent:true,fog:false}));var s=opt.size||1;sp.scale.set(s*w/H,s,1);sp.renderOrder=5;return sp;}
function pick(o,type,id){o.traverse(function(m){m.userData.pick={type:type,id:id};});}
/* ---------- station: atrium deck, ring corridor, skyline ---------- */
var TEAL=0x2ef2e0,MAG=0xff4fd8,VIO=0x8a6bff,AMB=0xffb86b;
var NM={};function N(c,o){var k=c+"|"+(o||1);if(!NM[k])NM[k]=new T.MeshBasicMaterial({color:new T.Color(c).multiplyScalar(o||1)});return NM[k];}
function glowTex(){var c=document.createElement("canvas");c.width=c.height=64;var x=c.getContext("2d"),g=x.createRadialGradient(32,32,1,32,32,31);g.addColorStop(0,"rgba(255,255,255,1)");g.addColorStop(.25,"rgba(255,255,255,.45)");g.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=g;x.fillRect(0,0,64,64);return new T.CanvasTexture(c);}
var GLOW=glowTex();function halo(par,c,s,x,y,z,o){var sp=new T.Sprite(new T.SpriteMaterial({map:GLOW,color:c,transparent:true,opacity:o||.55,depthWrite:false,blending:T.AdditiveBlending,fog:false}));sp.scale.set(s,s,1);sp.position.set(x,y,z);par.add(sp);return sp;}
function ringN(par,r,tube,c,y,o){var m=add(par,new T.TorusGeometry(r,tube,LOW?6:8,LOW?40:72),N(c,o),0,y,0,false);m.rotation.x=Math.PI/2;return m;}
var deckM=new T.MeshLambertMaterial({color:0x1a1d33}),hullM=new T.MeshLambertMaterial({color:0x1b1f3a}),trimM=new T.MeshLambertMaterial({color:0x3a4170});
var glassM=new T.MeshLambertMaterial({color:0x6fdcff,transparent:true,opacity:.14,depthWrite:false,side:T.DoubleSide,emissive:0x0b2440});
var ground=add(scene,new T.CylinderGeometry(34,33,1.2,LOW?32:64),hullM,0,-.6,0);ground.receiveShadow=!LOW;
add(scene,new T.CylinderGeometry(33,20,6,LOW?32:64,1,true),new T.MeshLambertMaterial({color:0x14172b}),0,-4.2,0,false);
ringN(scene,33.9,.12,TEAL,.02,.9);ringN(scene,20.5,.08,VIO,-6.5,.8);
var pz=add(scene,new T.CircleGeometry(8,LOW?24:48),new T.MeshLambertMaterial({color:0x232846}),0,.02,0,false);pz.rotation.x=-Math.PI/2;
ringN(scene,8,.07,TEAL,.05);ringN(scene,5.2,.05,MAG,.05,.8);ringN(scene,26,.06,VIO,.04,.7);
var BLD={barn:[-17,-9],library:[0,-19],workshop:[17,-9],greenhouse:[-17,11],newsroom:[0,20],market:[17,11],plaza:[0,0]};
/* corridors: rounded glass tubes with light strips */
Object.keys(BLD).forEach(function(k){if(k==="plaza")return;var p=BLD[k],len=Math.sqrt(p[0]*p[0]+p[1]*p[1])-13,g=new T.Group();g.position.set(p[0]*.5,0,p[1]*.5);g.rotation.y=Math.atan2(p[0],p[1]);
 var fl=add(g,new T.BoxGeometry(3.2,.12,len),deckM,0,.06,0,false);fl.receiveShadow=!LOW;
 var tube=add(g,new T.CylinderGeometry(2,2,len,LOW?10:16,1,true,-Math.PI/2,Math.PI),glassM,0,0,0,false);tube.rotation.x=Math.PI/2;
 add(g,new T.BoxGeometry(.08,.05,len),N(TEAL),-1.45,.14,0,false);add(g,new T.BoxGeometry(.08,.05,len),N(MAG,.8),1.45,.14,0,false);
 for(var i=0;i<3;i++){var rb=add(g,new T.TorusGeometry(2,.09,6,LOW?14:20,Math.PI),trimM,0,0,(i-1)*len*.33,false);}
 scene.add(g);});
/* atrium: central holo-column + floating rings */
var atrium=new T.Group();scene.add(atrium);
var col=add(atrium,new T.CylinderGeometry(.9,1.2,.6,LOW?16:32),trimM,0,.3,0);
var beam=add(atrium,new T.CylinderGeometry(.35,.6,9,16,1,true),new T.MeshBasicMaterial({color:TEAL,transparent:true,opacity:.18,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide}),0,5,0,false);
var HR=[];[[2.2,3,TEAL],[1.6,5.2,MAG],[1.1,7.2,VIO]].forEach(function(a){var r=ringN(atrium,a[0],.05,a[2],a[1]);HR.push(r);});
var core=add(atrium,new T.IcosahedronGeometry(.7,1),new T.MeshLambertMaterial({color:0x9ffcf2,emissive:0x1fb8a8,flatShading:true}),0,9.6,0,false);halo(atrium,TEAL,6,0,9.6,0,.5);
/* benches + light posts (rounded) */
var lampMat=new T.MeshBasicMaterial({color:0xbffbff}),winMat=new T.MeshBasicMaterial({color:0xffd9a0});
function lamp(x,z,c){cyl(scene,.07,.1,3,0x2a2f50,x,1.5,z,8);add(scene,new T.SphereGeometry(.22,10,8),N(c),x,3.1,z,false);halo(scene,c,2.4,x,3.1,z,.5);}
lamp(6,6,TEAL);lamp(-6,6,MAG);lamp(6,-6,MAG);lamp(-6,-6,TEAL);
function windows(){}
/* outer megastructure skyline (round towers, emissive bands) */
var rs=7;function rnd(){rs=(rs*16807)%2147483647;return(rs-1)/2147483646;}
var towM=new T.MeshLambertMaterial({color:0x161a36,emissive:0x05061a}),bandC=[TEAL,MAG,VIO,AMB];
for(var i=0;i<(LOW?18:36);i++){var a=i/(LOW?18:36)*Math.PI*2+rnd()*.12,r=70+rnd()*45,h=20+rnd()*55,w=2.5+rnd()*4,x=Math.cos(a)*r,z=Math.sin(a)*r;
 add(scene,new T.CylinderGeometry(w*.8,w,h,LOW?8:14),towM,x,h/2-12,z,false);add(scene,new T.SphereGeometry(w*.8,LOW?8:12,6,0,Math.PI*2,0,Math.PI/2),towM,x,h-12,z,false);
 var nb=1+(rnd()*3|0);for(var j=0;j<nb;j++){var bc=bandC[(rnd()*4)|0];var bnd=add(scene,new T.TorusGeometry(w*.86,.12,4,LOW?12:20),N(bc,.85),x,h*(.35+j*.18)-12,z,false);bnd.rotation.x=Math.PI/2;}
 if(rnd()<.5){var sg=add(scene,new T.PlaneGeometry(w*1.2,w*2.2),N(bandC[(rnd()*3)|0],.7),x*.985,h*.6-12,z*.985,false);sg.lookAt(0,sg.position.y,0);}}
/* stars + distant planet (orbital view) */
(function(){var Ns=LOW?250:600,ps=new Float32Array(Ns*3);for(var i=0;i<Ns;i++){var u=rnd()*6.283,v=rnd()*.9+.05,R=260;ps[i*3]=Math.cos(u)*Math.cos(v)*R;ps[i*3+1]=Math.sin(v)*R;ps[i*3+2]=Math.sin(u)*Math.cos(v)*R;}
 var g=new T.BufferGeometry();g.setAttribute("position",new T.BufferAttribute(ps,3));scene.add(new T.Points(g,new T.PointsMaterial({color:0xcfd8ff,size:1.4,sizeAttenuation:false,fog:false,transparent:true,opacity:.8})));
 var pl=new T.Mesh(new T.SphereGeometry(60,32,20),new T.MeshBasicMaterial({color:0x2a1f5c,fog:false}));pl.position.set(-150,90,-260);scene.add(pl);var at=halo(scene,VIO,150,-150,90,-262,.35);})();
/* ---------- rooms (pods off the atrium) ---------- */
var B={},smokeSrc=null,HOLO=[];
var ACC={barn:MAG,library:VIO,workshop:AMB,greenhouse:TEAL,newsroom:0x5fa8ff,market:0xff7a9a};
function holoSign(g,k,y){var c="#"+new T.Color(ACC[k]).getHexString(),s=label(HQ.BNAME[k],{size:1.05,accent:c});s.position.set(0,y,0);g.add(s);HOLO.push(s);}
function pod(g,k,r,h){var c=ACC[k];var fl=add(g,new T.CylinderGeometry(r,r+.3,.4,LOW?20:40),deckM,0,.2,0);fl.receiveShadow=!LOW;
 var wall=add(g,new T.CylinderGeometry(r,r,h,LOW?20:40,1,true,Math.PI*.35,Math.PI*1.3),hullM,0,h/2,0);wall.material=new T.MeshLambertMaterial({color:0x2a2f58,side:T.DoubleSide,transparent:true,opacity:.55,depthWrite:false});
 var dome=add(g,new T.SphereGeometry(r,LOW?20:36,LOW?8:14,0,Math.PI*2,0,Math.PI/2),glassM,0,h,0,false);dome.scale.y=.45;
 ringN(g,r+.05,.08,c,h);ringN(g,r+.3,.06,c,.42,.8);var cg=new T.Group();g.add(cg);
 var lf=add(g,new T.CylinderGeometry(r*.5,r*.5,.04,24),new T.MeshBasicMaterial({color:c,transparent:true,opacity:.22,blending:T.AdditiveBlending,depthWrite:false}),0,.43,0,false);
 return c;}
function console_(g,x,z,c,ry){var cg=new T.Group();add(cg,new T.CylinderGeometry(.5,.7,1,12),trimM,0,.9,0);var sc=add(cg,new T.PlaneGeometry(1.4,.8),N(c,.75),0,1.85,0,false);sc.rotation.x=-.3;cg.position.set(x,0,z);cg.rotation.y=ry||0;g.add(cg);return cg;}
function mk(k,fn){var g=new T.Group(),p=BLD[k];g.position.set(p[0],0,p[1]);g.rotation.y=Math.atan2(-p[0],-p[1]);fn(g);scene.add(g);pick(g,"bld",k);B[k]={g:g,rooms:new T.Group()};g.add(B[k].rooms);}
mk("barn",function(g){var c=pod(g,"barn",6,3.4);console_(g,-2.6,-1.5,c,.3);console_(g,2.6,-1.5,c,-.3);
 var st=add(g,new T.TorusKnotGeometry(.6,.18,LOW?40:80,8),new T.MeshLambertMaterial({color:0xffb0ee,emissive:0x7a1a6a}),0,2.6,-2.6,false);B.knot=st;holoSign(g,"barn",8.4);});
mk("library",function(g){var c=pod(g,"library",6,3.4);for(var i=-2;i<=2;i++){var sh=add(g,new T.CylinderGeometry(.5,.5,3.4,12),trimM,i*1.6,1.9,-3.6+Math.abs(i)*.5);add(g,new T.TorusGeometry(.52,.04,6,16),N(VIO),i*1.6,2.4+i%2*.6,-3.6+Math.abs(i)*.5,false).rotation.x=Math.PI/2;}
 holoSign(g,"library",8.4);});
mk("workshop",function(g){var c=pod(g,"workshop",6,3.4);var gear=add(g,new T.TorusGeometry(1.1,.22,8,LOW?16:28),new T.MeshLambertMaterial({color:0xffcf8f,emissive:0x8a4a10}),0,2.8,-3.2,false);B.workshopGear=gear;
 console_(g,2.8,0,c,-.6);add(g,new T.CapsuleGeometry?new T.CapsuleGeometry(.5,1.4,4,10):new T.CylinderGeometry(.5,.5,2,10),trimM,-3,1.3,-1);holoSign(g,"workshop",8.4);});
mk("greenhouse",function(g){var c=pod(g,"greenhouse",6,3.4);for(var i=0;i<(LOW?5:9);i++){var a=i/(LOW?5:9)*6.283,x=Math.cos(a)*3.2,z=Math.sin(a)*3.2-.3;
  cyl(g,.35,.45,.6,0x2a2f50,x,.7,z,10);add(g,new T.SphereGeometry(.5,10,8),new T.MeshLambertMaterial({color:0x7cf5c8,emissive:0x0f6a50}),x,1.4,z,false);}holoSign(g,"greenhouse",8.4);});
mk("newsroom",function(g){var c=pod(g,"newsroom",6,3.4);var drum=add(g,new T.CylinderGeometry(1.4,1.4,1.2,LOW?12:24,1,true),new T.MeshBasicMaterial({color:0x5fa8ff,transparent:true,opacity:.35,side:T.DoubleSide,blending:T.AdditiveBlending,depthWrite:false}),0,3,-2,false);B.drum=drum;
 console_(g,-2.6,-1,c,.4);console_(g,2.6,-1,c,-.4);holoSign(g,"newsroom",8.4);});
mk("market",function(g){var c=pod(g,"market",5.4,3.2);add(g,new T.TorusGeometry(2.4,.5,10,LOW?20:36,Math.PI),trimM,0,.9,-.8,false).rotation.x=-Math.PI/2;
 for(var i=-2;i<=2;i++)add(g,new T.SphereGeometry(.3,10,8),N([TEAL,MAG,VIO,AMB,0x5fa8ff][i+2]),i*.9,1.6,-2.4+Math.abs(i)*.3,false);holoSign(g,"market",7.6);});
(function(){var g=new T.Group();var s=label("Central Atrium",{size:.9,accent:"#5ff3e0"});s.position.set(0,11.6,0);g.add(s);HOLO.push(s);g.add(atrium);pick(g,"bld","plaza");scene.add(g);B.plaza={g:g,rooms:new T.Group()};})();
function door(k){var p=BLD[k];if(k==="plaza")return new T.Vector3(0,0,0);var l=Math.sqrt(p[0]*p[0]+p[1]*p[1]),f=(l-6.5)/l;return new T.Vector3(p[0]*f,0,p[1]*f);}
function roomsFor(k){var R=B[k].rooms;while(R.children.length)R.remove(R.children[0]);var line=HQ.lineFor(k);if(!line)return;var is=HQ.insts(line.id);
 is.forEach(function(inst,n){var g=new T.Group(),col=inst.state==="live"?0x2ef2a0:inst.state==="paused"?0xff4f7a:0x6a70a0;cyl(g,.08,.08,2.4,0x3a4170,0,1.2,0,5);
  var fl=add(g,new T.PlaneGeometry(1,.6),N(col),.5,2.1,0,false);fl.material=new T.MeshBasicMaterial({color:col,side:T.DoubleSide});var tg=label(inst.id,{size:.55,accent:inst.state==="live"?"#5ff3a0":inst.state==="paused"?"#ff6f8f":"#8a90b8"});tg.position.set(0,2.9,0);g.add(tg);
  var x=-4.5+n*1.6;g.position.set(x>4?x-9:x,0,4.6+(x>4?1.4:0));g.userData.flag=fl;R.add(g);pick(g,"bld",k);});}
/* ---------- characters ---------- */
var BOT={},SPEC={
 oki:{c:0x8a5a3a,belly:0xf3e5c4,s:1.25,kind:"owl",extra:function(b,P){box(b,.12,1.3,.06,0xb8322b,0,1.05,.42).rotation.z=.7;sph(b,.07,0xf1c40f,.2,1.25,.47);P.prop=box(b,.5,.6,.06,0x8a5a30,.55,.85,.3);box(P.prop,.4,.4,.02,0xffffff,0,0,.04);}},
 ledger:{c:0x2f6b3a,belly:0xf3e5c4,s:.95,kind:"owl",extra:function(b,P){var t=add(P.head,new T.TorusGeometry(.13,.025,6,12),M(0xc9a227),-.17,.05,.42);add(P.head,new T.TorusGeometry(.13,.025,6,12),M(0xc9a227),.17,.05,.42);P.prop=box(b,.55,.7,.18,0x1e5b2a,.55,.8,.3);box(P.prop,.12,.12,.2,0xc9a227,.2,0,.02);}},
 scout:{c:0xe0702a,belly:0xfff3e0,s:1,kind:"fox",extra:function(b,P){var h=cyl(P.head,.62,.62,.06,0xc8b27a,0,.42,0,12);cyl(P.head,.32,.36,.3,0xc8b27a,0,.6,0,10);box(P.head,.04,.3,.02,0xd63031,.3,.65,.1).rotation.z=-.4;
  box(b,.72,.6,.62,0x6b7a3a,0,.75,0);P.prop=cyl(b,.07,.09,.8,0xc9a227,.55,.95,.3,8);P.prop.rotation.x=1.3;}},
 lister:{c:0xd9a441,belly:0xfff3d6,s:1,kind:"dog",extra:function(b,P){box(b,.72,.55,.62,0x2c3e70,0,.75,0);add(b,new T.TorusGeometry(.33,.07,6,12),M(0xd63031),0,1.12,0).rotation.x=Math.PI/2;
  P.prop=box(b,.45,.6,.05,0x8a5a30,.55,.85,.3);for(var i=0;i<3;i++)box(P.prop,.08,.12+i*.1,.03,0x27ae60,-.12+i*.12,-.1+i*.05,.04);}},
 pixel:{c:0xf3ead6,belly:0xe8b84a,s:1,kind:"robot",extra:function(b,P){sph(P.head,.38,0xb8322b,0,.42,0,[1,.35,1]);box(b,.72,.62,.62,0xe8b84a,0,.7,0);
  P.prop=new T.Group();cyl(P.prop,.04,.04,.9,0x6b4226,0,0,0,6);box(P.prop,.16,.22,.16,0xe74c3c,0,.52,0);P.prop.position.set(.6,.9,.3);P.prop.rotation.z=-.4;b.add(P.prop);P.paint=P.prop.children[1];}},
 forge:{c:0x6b4226,belly:0xa87a50,s:1.05,kind:"beaver",extra:function(b,P){sph(P.head,.4,0xe67e22,0,.32,0,[1,.6,1]);cyl(P.head,.5,.5,.05,0xe67e22,0,.24,.05,12);sph(P.head,.08,0xfff6b0,0,.35,.38);
  box(b,.66,.65,.1,0x3d5a8a,0,.7,.33);P.prop=new T.Group();cyl(P.prop,.05,.05,.7,0x9a9a9a,0,0,0,6);add(P.prop,new T.TorusGeometry(.12,.04,6,8),new T.MeshLambertMaterial({color:0x7ef09a,emissive:0x1f7a3a}),0,.4,0);P.prop.position.set(.6,.9,.3);b.add(P.prop);}},
 sentry:{c:0x8a7a68,belly:0xf3e5c4,s:.95,kind:"hedgehog",extra:function(b,P){box(b,.74,.5,.66,0xf1c40f,0,.75,0);P.prop=new T.Group();add(P.prop,new T.TorusGeometry(.18,.04,6,12),M(0xc9a227),0,0,0);cyl(P.prop,.03,.03,.4,0x6b4226,0,-.36,0,5);P.prop.position.set(.6,1,.35);b.add(P.prop);}},
 lumen:{c:0xb9a3e3,belly:0xd8c8f3,s:.9,kind:"butterfly",extra:function(b,P){P.prop=box(b,.3,.22,.2,0x333333,0,.55,.35);cyl(P.prop,.06,.06,.1,0x999999,0,0,.12,8).rotation.x=Math.PI/2;}},
 quill:{c:0xb5512a,belly:0xfff0dc,s:.95,kind:"squirrel",extra:function(b,P){var v=cyl(P.head,.46,.46,.05,0x2e7d4f,0,.3,.12,12);v.scale.z=.6;P.prop=cone(b,.06,.8,0xffffff,.55,1,.3,5);P.prop.rotation.z=-.5;}},
 clerk:{c:0x22252b,belly:0xffffff,s:1,kind:"penguin",extra:function(b,P){sph(b,.22,0xf6c945,0,1.12,.25,[1.6,.5,.6]);cone(b,.1,.2,0x1abc9c,-.1,1.05,.42,4).rotation.z=Math.PI/2;cone(b,.1,.2,0x1abc9c,.1,1.05,.42,4).rotation.z=-Math.PI/2;
  cyl(P.head,.32,.34,.2,0x2c3e70,0,.4,0,10);box(P.head,.4,.04,.3,0x2c3e70,0,.3,.2);P.prop=box(b,.4,.35,.15,0xc0392b,-.5,.7,.1);}}
};
function makeBot(b){var sp=SPEC[b.id]||{c:0x999999,belly:0xffffff,s:1,kind:"dog"},root=new T.Group(),body=new T.Group(),P={};root.add(body);
 var k=sp.kind,fly=k==="butterfly";
 if(k==="robot"){box(body,.75,.75,.6,sp.c,0,.7,0);}else if(fly){cyl(body,.12,.08,.9,sp.c,0,.75,0,8);}else{sph(body,.45,sp.c,0,.75,0,[1,1.15,.95]);sph(body,.32,sp.belly,0,.72,.22,[1,1.2,.6]);}
 var head=P.head=new T.Group();head.position.set(0,k==="robot"?1.4:fly?1.3:1.42,0);body.add(head);
 if(k==="robot"){box(head,.75,.6,.6,0xe8b84a,0,0,0);box(head,.58,.44,.05,0x111820,0,0,.31);var em=new T.MeshLambertMaterial({color:0x5ff3e0,emissive:0x2bb5a5});add(head,new T.BoxGeometry(.1,.1,.03),em,-.13,.05,.34,false);add(head,new T.BoxGeometry(.1,.1,.03),em,.13,.05,.34,false);add(head,new T.BoxGeometry(.24,.05,.03),em,0,-.1,.34,false);}
 else if(fly){sph(head,.16,sp.c,0,0,0);for(var a=-1;a<=1;a+=2){var an=cyl(head,.015,.015,.5,0x333333,a*.08,.25,0,4);an.rotation.z=-a*.3;sph(head,.04,0x333333,a*.16,.48,0);}
  P.wl=new T.Group();P.wr=new T.Group();[P.wl,P.wr].forEach(function(w,i){var s=i?1:-1,m1=new T.MeshLambertMaterial({color:0x2ec4b6,side:T.DoubleSide}),m2=new T.MeshLambertMaterial({color:0x8e44ad,side:T.DoubleSide});
   var u=add(w,new T.CircleGeometry(.55,10),m1,s*.5,.25,0,false);u.scale.set(1,1.2,1);var l=add(w,new T.CircleGeometry(.38,10),m2,s*.38,-.35,0,false);add(w,new T.CircleGeometry(.12,8),M(0xf1c40f,{side:T.DoubleSide}),s*.6,.35,.01,false);
   w.position.set(0,.85,-.1);body.add(w);});}
 else{sph(head,.38,sp.c,0,0,0);
  if(k==="owl"){sph(head,.3,sp.belly,0,-.02,.18,[1.1,1,.5]);[-1,1].forEach(function(s){sph(head,.1,0xf5b342,s*.13,.06,.32);sph(head,.05,0x111111,s*.13,.06,.4);cone(head,.09,.3,sp.c,s*.25,.38,0,5).rotation.z=-s*.3;});cone(head,.06,.16,0xf39c12,0,-.08,.4,5).rotation.x=Math.PI/2;}
  else{[-1,1].forEach(function(s){sph(head,.06,0x111111,s*.14,.08,.33);});
   if(k==="fox"){cone(head,.16,.4,sp.c,0,-.05,.45,6).rotation.x=Math.PI/2;sph(head,.05,0x111111,0,-.05,.66);[-1,1].forEach(function(s){cone(head,.12,.32,sp.c,s*.22,.4,0,4);});}
   if(k==="dog"){sph(head,.2,sp.belly,0,-.1,.3,[1,.8,1]);sph(head,.07,0x111111,0,-.02,.48);[-1,1].forEach(function(s){var e=box(head,.14,.4,.24,0xa8742a,s*.38,-.08,0);e.rotation.z=s*.2;});}
   if(k==="beaver"){sph(head,.2,0xa87a50,0,-.12,.3,[1,.7,.8]);box(head,.14,.12,.05,0xffffff,0,-.26,.43);[-1,1].forEach(function(s){sph(head,.08,sp.c,s*.3,.3,0);});}
   if(k==="hedgehog"){cone(head,.14,.36,sp.belly,0,-.06,.4,6).rotation.x=Math.PI/2;sph(head,.05,0x111111,0,-.06,.6);var sm=M(0x5a4a3a);for(var q=0;q<(LOW?10:22);q++){var t=q/22*Math.PI*2,y=(q%3)*.25;var sp1=add(body,new T.ConeGeometry(.07,.4,4),sm,Math.sin(t)*.42,.6+y,-.15-Math.abs(Math.cos(t))*.25,false);sp1.rotation.x=-1.1;sp1.rotation.z=Math.sin(t)*-.8;}}
   if(k==="squirrel"){sph(head,.16,sp.belly,0,-.1,.3);[-1,1].forEach(function(s){cone(head,.09,.3,sp.c,s*.2,.42,0,4);});}
   if(k==="penguin"){cone(head,.07,.2,0xf39c12,0,-.05,.42,5).rotation.x=Math.PI/2;sph(head,.25,0xffffff,0,-.02,.18,[1,.9,.6]);}
  }}
 if(!fly){P.al=new T.Group();P.ar=new T.Group();[P.al,P.ar].forEach(function(arm,i){var s=i?1:-1;var m=sph(arm,.13,k==="robot"?0xe8b84a:sp.c,0,-.25,0,[1,2.2,1]);arm.position.set(s*.48,1.05,0);body.add(arm);});
  P.ll=new T.Group();P.lr=new T.Group();[P.ll,P.lr].forEach(function(l,i){var s=i?1:-1;cyl(l,.1,.1,.35,k==="owl"||k==="penguin"?0xf39c12:k==="fox"||k==="dog"?0x5b3820:sp.c,0,-.17,0,6);box(l,.2,.08,.3,k==="owl"||k==="penguin"?0xf39c12:0x3d2414,0,-.36,.06);l.position.set(s*.2,.4,0);root.add(l);});}
 if(k==="fox"||k==="squirrel"||k==="beaver"||k==="dog"){P.tail=new T.Group();P.tail.position.set(0,.55,-.4);body.add(P.tail);
  if(k==="fox"){sph(P.tail,.22,sp.c,0,.1,-.3,[1,1,2]);sph(P.tail,.14,0xffffff,0,.15,-.68);}
  if(k==="squirrel"){sph(P.tail,.3,sp.c,0,.5,-.2,[1,2.2,1]);sph(P.tail,.22,sp.c,0,1,.05);}
  if(k==="beaver"){box(P.tail,.45,.08,.7,0x3a2a1e,0,-.4,-.25);}
  if(k==="dog"){cyl(P.tail,.06,.04,.5,sp.c,0,.2,-.1,5).rotation.x=-.7;}}
 sp.extra&&sp.extra(body,P);
 if(fly)body.position.y=.6;
 var ring=add(root,new T.RingGeometry(.6,.75,20),new T.MeshBasicMaterial({color:0x2ef2e0,transparent:true,opacity:.8,blending:T.AdditiveBlending,side:T.DoubleSide}),0,.05,0,false);ring.rotation.x=-Math.PI/2;
 var parcel=box(root,.5,.4,.5,0xc8955a,0,2.3,.1);box(parcel,.52,.08,.1,0x7a4b2a,0,.0,0);parcel.visible=false;
 root.scale.setScalar(sp.s*1.6);
 var o={id:b.id,root:root,body:body,P:P,ring:ring,parcel:parcel,fly:fly,kind:k,home:null,pos:new T.Vector3(),path:[],speed:3.2,phase:rnd()*6,wander:0,data:b,tag:null,zz:null,tagKey:""};
 scene.add(root);pick(root,"bot",b.id);return o;}
function tagFor(o){var b=o.data,w=b.state==="working",sl=HQ.sleepy(b),key=b.name+w+sl;if(key===o.tagKey)return;o.tagKey=key;if(o.tag)o.root.remove(o.tag);
 o.tag=label(b.name,{size:.42,dot:w?"#3ee35e":sl?"#7f8fa6":"#bbbbbb"});o.tag.position.set(0,o.fly?3.1:2.75,0);o.root.add(o.tag);pick(o.tag,"bot",b.id);
 if(!o.zz){o.zz=label("z z",{size:.35,accent:"#8a6bff"});o.root.add(o.zz);}o.zz.visible=sl;}
var HOMESLOT={};
function homeOf(o){var k=HQ.HOME[o.id]||(o.data.lines&&o.data.lines[0]?(function(){var r="barn";(HQ.data.lines||[]).forEach(function(l){if(l.id===o.data.lines[0])r=l.building;});return r;})():"plaza");
 var n=HOMESLOT[k]=(HOMESLOT[k]||0)+1,d=door(k),side=new T.Vector3(-d.z,0,d.x).normalize();if(k==="plaza")side.set(1,0,0);var off=(n%2?1:-1)*Math.ceil(n/2)*1.6-(k==="plaza"?0:0);
 return d.clone().add(side.multiplyScalar(off)).add(k==="plaza"?new T.Vector3(0,0,1.5):new T.Vector3(0,0,0));}
function syncBots(d){HOMESLOT={};(d.bots||[]).forEach(function(b){var o=BOT[b.id];if(!o){o=BOT[b.id]=makeBot(b);o.home=homeOf(o);o.pos.copy(o.home);}else{o.data=b;}tagFor(o);});
 Object.keys(B).forEach(function(k){if(k!=="plaza"&&B[k].g&&B[k].rooms)roomsFor(k);});}
/* ---------- ambient life: drones, motes, rain ---------- */
var drones=[];for(i=0;i<(LOW?3:6);i++){var dg=new T.Group();add(dg,new T.SphereGeometry(.35,12,8),trimM,0,0,0,false);var dc=[TEAL,MAG,VIO][i%3];add(dg,new T.TorusGeometry(.5,.05,6,20),N(dc),0,0,0,false).rotation.x=Math.PI/2;halo(dg,dc,1.6,0,0,0,.5);
 dg.userData={r:12+rnd()*16,h:7+rnd()*7,s:.08+rnd()*.12,o:rnd()*6};scene.add(dg);drones.push(dg);}
var rain=null;(function(){var Nn=LOW?250:900,pos=new Float32Array(Nn*3);for(var i=0;i<Nn;i++){pos[i*3]=-60+rnd()*120;pos[i*3+1]=rnd()*40;pos[i*3+2]=-60+rnd()*120;}
 var rg=new T.BufferGeometry();rg.setAttribute("position",new T.BufferAttribute(pos,3));rain=new T.Points(rg,new T.PointsMaterial({color:0x9fd8ff,size:.12,transparent:true,opacity:.45,depthWrite:false}));scene.add(rain);})();
var flies=null;(function(){var Nn=LOW?30:80,pos=new Float32Array(Nn*3);for(var i=0;i<Nn;i++){var a=rnd()*6.28,r=4+rnd()*26;pos[i*3]=Math.cos(a)*r;pos[i*3+1]=.5+rnd()*6;pos[i*3+2]=Math.sin(a)*r;}
 var g=new T.BufferGeometry();g.setAttribute("position",new T.BufferAttribute(pos,3));flies=new T.Points(g,new T.PointsMaterial({color:0xff9ff0,size:.2,transparent:true,opacity:.7,blending:T.AdditiveBlending,depthWrite:false}));scene.add(flies);})();
var WEATHER="rain",NIGHT=true;scene.background=new T.Color(0x070818);
function light(){var p=HQ.etParts();el("sky").textContent="◐ Station night-cycle · light rain on the outer ring · "+(p.h%12||12)+":"+("0"+p.m).slice(-2)+(p.h<12?" am":" pm")+" ET";}
/* ---------- handoffs ---------- */
var HQUEUE=[],SEEN={},ACTIVE=null;
function queueHandoffs(d,first){var hs=(d.activity||[]).filter(function(a){return a.type==="handoff"&&a.to;});
 (first?hs.slice(0,5).reverse():hs.slice(0,5).reverse()).forEach(function(a){var k=a.time+a.message;if(SEEN[k])return;SEEN[k]=1;HQUEUE.push(a);});}
function route(a,b){var mid=new T.Vector3(0,0,0),pts=[];if(a.distanceTo(b)<6)return[b.clone()];pts.push(a.clone().multiplyScalar(.45));pts.push(mid.clone().add(b.clone().multiplyScalar(.15)));pts.push(b.clone());return pts;}
function nextHandoff(){if(ACTIVE||!HQUEUE.length)return;var a=HQUEUE.shift(),f=HQ.byName(a.bot),t=HQ.byName(a.to);if(!f||!t||!BOT[f.id]||!BOT[t.id])return;
 var o=BOT[f.id],r=BOT[t.id];ACTIVE={o:o,r:r,a:a};o.parcel.visible=true;var dest=r.pos.clone().add(new T.Vector3(1.2,0,1.2));o.path=route(o.pos,dest);o.after=function(){o.parcel.visible=false;r.hop=1;
  toast("📦 "+f.name+" → "+t.name+": "+a.message);setTimeout(function(){o.path=route(o.pos,o.home);o.after=function(){ACTIVE=null;};},900);};}
var toastT=null;function toast(s){var e=el("toast");e.textContent=s;e.style.display="block";clearTimeout(toastT);toastT=setTimeout(function(){e.style.display="none";},4200);}
/* ---------- animation ---------- */
var clock=new T.Clock(),acc=0,fpsN=0,fpsT=0,FPS=60,slowT=0,tmp=new T.Vector3(),FOCUS=null;
function animBot(o,t,dt){var P=o.P,b=o.data,w=b.state==="working",sl=HQ.sleepy(b),walking=o.path.length>0,ph=o.phase+t;
 if(!walking&&!w&&!sl&&!ACTIVE&&(o.wander-=dt)<0){o.wander=6+Math.random()*10;if(Math.random()<.5){o.path=[o.home.clone().add(new T.Vector3(Math.random()*3-1.5,0,Math.random()*3-1.5))];o.after=null;}}
 if(walking){var tg=o.path[0];tmp.copy(tg).sub(o.pos);tmp.y=0;var dist=tmp.length(),st=o.speed*dt;if(dist<=st){o.pos.copy(tg);o.path.shift();if(!o.path.length&&o.after){var f=o.after;o.after=null;f();}}
  else{tmp.multiplyScalar(st/dist);o.pos.add(tmp);var ry=Math.atan2(tmp.x,tmp.z),dr=ry-o.root.rotation.y;while(dr>Math.PI)dr-=6.283;while(dr<-Math.PI)dr+=6.283;o.root.rotation.y+=dr*Math.min(1,dt*10);}}
 else{var face=Math.atan2(-o.pos.x,-o.pos.z+.01);var dr2=face-o.root.rotation.y;while(dr2>Math.PI)dr2-=6.283;while(dr2<-Math.PI)dr2+=6.283;o.root.rotation.y+=dr2*Math.min(1,dt*2);}
 var hop=0;if(o.hop){o.hop-=dt*1.5;hop=Math.max(0,Math.sin((1-o.hop)*Math.PI*2))*.6;if(o.hop<=0)o.hop=0;}
 o.root.position.set(o.pos.x,hop+(o.fly?.4+Math.sin(ph*2)*.25:0),o.pos.z);
 var sw=walking?Math.sin(ph*10)*.7:0,bob=walking?Math.abs(Math.sin(ph*10))*.08:w?Math.abs(Math.sin(ph*7))*.1:Math.sin(ph*1.5)*.02;o.body.position.y=bob;
 if(P.ll){P.ll.rotation.x=sw;P.lr.rotation.x=-sw;}
 if(P.al){P.al.rotation.x=walking?-sw*.8:w?Math.sin(ph*12)*.6:Math.sin(ph)*.05;P.ar.rotation.x=walking?sw*.8:w?-1.1+Math.sin(ph*12)*.5:-.3;P.ar.rotation.z=o.parcel.visible?-.2:0;if(o.parcel.visible){P.al.rotation.x=P.ar.rotation.x=-2.6;}}
 if(P.prop){P.prop.visible=!o.parcel.visible;if(w)P.prop.rotation.y=Math.sin(ph*12)*.3;}
 if(P.wl){var fl=w||walking?Math.sin(ph*14)*.9:Math.sin(ph*2.5)*.5;P.wl.rotation.y=fl;P.wr.rotation.y=-fl;}
 if(P.tail)P.tail.rotation.y=Math.sin(ph*(w?9:3))*.5;
 if(P.paint&&w)P.paint.material=M([0xe74c3c,0x2ec4b6,0xf1c40f,0x8e44ad][Math.floor(t*3)%4]);
 P.head.rotation.y=o.id==="oki"&&!w?Math.sin(ph*.4)*1.2:Math.sin(ph*.7)*.25;P.head.rotation.z=sl?.35:0;if(sl)o.body.rotation.x=.12;else o.body.rotation.x=0;
 o.ring.visible=w;if(w)o.ring.scale.setScalar(1+Math.sin(ph*4)*.08);
 if(o.zz){o.zz.position.set(.6,2.6+(t*.5%1)*.6,0);o.zz.material.opacity=1-(t*.5%1);}}
function frame(){requestAnimationFrame(frame);var dt=Math.min(clock.getDelta(),.1);acc+=dt;var cap=LOW?1/30:1/60;if(acc<cap*.92)return;dt=acc;acc=0;var t=clock.elapsedTime;
 fpsN++;fpsT+=dt;if(fpsT>1){FPS=fpsN/fpsT;fpsN=0;fpsT=0;var f=el("fps");if(f)f.textContent=Math.round(FPS)+" fps · "+(LOW?"low":"high")+" quality";
  if(!LOW&&FPS<24){if(++slowT>3)setLow(true,true);}else slowT=0;}
 Object.keys(BOT).forEach(function(k){animBot(BOT[k],t,dt);});nextHandoff();
 drones.forEach(function(b){var u=b.userData,a=t*u.s+u.o;b.position.set(Math.cos(a)*u.r,u.h+Math.sin(a*2)*1.2,Math.sin(a)*u.r);});
 HR.forEach(function(r,i){r.rotation.z=t*(.3+i*.2)*(i%2?-1:1);r.position.y=[3,5.2,7.2][i]+Math.sin(t+i)*.15;});core.rotation.y=t*.5;core.rotation.x=t*.2;beam.material.opacity=.14+Math.sin(t*2)*.04;
 HOLO.forEach(function(s,i){s.material.opacity=.88+Math.sin(t*3+i*1.7)*.08+(Math.sin(t*23+i)>.97?-.4:0);});
 if(B.knot)B.knot.rotation.y=t*(BOT.scout&&BOT.scout.data.state==="working"?1.5:.3);
 if(rain){var pa=rain.geometry.attributes.position;for(var i=1;i<pa.array.length;i+=3){pa.array[i]-=dt*18;if(pa.array[i]<0)pa.array[i]=40;}pa.needsUpdate=true;}
 flies.rotation.y=t*.02;
 if(B.workshopGear)B.workshopGear.rotation.z=t*(BOT.forge&&BOT.forge.data.state==="working"?3:.4);if(B.drum)B.drum.rotation.y=t*(BOT.quill&&BOT.quill.data.state==="working"?4:.3);
 Object.keys(B).forEach(function(k){if(B[k].rooms)B[k].rooms.children.forEach(function(r,i){if(r.userData.flag)r.userData.flag.rotation.y=Math.sin(t*2+i)*.25;});});
 if(FOCUS){ctl.target.lerp(FOCUS.t,.08);cam.position.lerp(FOCUS.c,.08);if(cam.position.distanceTo(FOCUS.c)<.2)FOCUS=null;}
 ctl.update();renderer.render(scene,cam);}
/* ---------- interaction ---------- */
var ray=new T.Raycaster(),ndc=new T.Vector2(),down=null;
function hit(ev){var r=renderer.domElement.getBoundingClientRect();ndc.x=((ev.clientX-r.left)/r.width)*2-1;ndc.y=-((ev.clientY-r.top)/r.height)*2+1;ray.setFromCamera(ndc,cam);
 var hs=ray.intersectObjects(scene.children,true);for(var i=0;i<hs.length;i++){var u=hs[i].object.userData.pick;if(u)return u;}return null;}
function focusOn(v,dist){var dir=cam.position.clone().sub(ctl.target).normalize();FOCUS={t:v.clone(),c:v.clone().add(dir.multiplyScalar(dist)).setY(Math.max(v.y+dist*.45,4))};}
function openInfo(title,html){el("infoT").textContent=title;el("infoB").innerHTML=html;el("info").style.display="block";el("info").scrollTop=0;}
HQ.showBot=function(id){var o=BOT[id];if(!o)return;openInfo(o.data.name,HQ.botHTML(id));focusOn(o.pos.clone().setY(1.5),12);};
HQ.showBld=function(k){openInfo(k==="plaza"?"Central Atrium":HQ.BNAME[k],HQ.buildingHTML(k));var p=BLD[k];focusOn(new T.Vector3(p[0],2,p[1]),k==="plaza"?14:18);};
renderer.domElement.addEventListener("pointerdown",function(e){down=[e.clientX,e.clientY];FOCUS=null;});
renderer.domElement.addEventListener("pointerup",function(e){if(!down||Math.abs(e.clientX-down[0])+Math.abs(e.clientY-down[1])>8)return;var u=hit(e);if(!u)return;if(u.type==="bot")HQ.showBot(u.id);else HQ.showBld(u.id);});
var hovT=0;if(!mobile)renderer.domElement.addEventListener("pointermove",function(e){var n=Date.now();if(n-hovT<120)return;hovT=n;renderer.domElement.style.cursor=hit(e)?"pointer":"grab";});
document.addEventListener("click",function(e){var a=e.target;while(a&&a!==document){if(a.getAttribute&&a.getAttribute("data-bot")){e.preventDefault();HQ.showBot(a.getAttribute("data-bot"));return;}if(a.getAttribute&&a.getAttribute("data-bld")){e.preventDefault();HQ.showBld(a.getAttribute("data-bld"));return;}a=a.parentNode;}});
el("reset").onclick=function(){FOCUS={t:new T.Vector3(0,0,2),c:new T.Vector3(HOMECAM[0],HOMECAM[1],HOMECAM[2])};el("info").style.display="none";};
function setLow(v,auto){LOW=v;localStorage.setItem("hqLow",v?"1":"0");renderer.setPixelRatio(v?1:Math.min(window.devicePixelRatio||1,1.5));renderer.shadowMap.enabled=!v;sun.castShadow=!v;
 scene.traverse(function(m){if(m.material)m.material.needsUpdate=true;});el("qual").textContent=v?"✨ High quality":"⚡ Low quality";if(auto)toast("Switched to low quality for smoother motion");}
el("qual").textContent=LOW?"✨ High quality":"⚡ Low quality";el("qual").onclick=function(){setLow(!LOW);};
window.addEventListener("resize",function(){cam.aspect=window.innerWidth/window.innerHeight;cam.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight);});
renderer.domElement.addEventListener("webglcontextlost",function(e){e.preventDefault();fallback("context lost");});
/* ---------- boot ---------- */
var first=true;function data(d){syncBots(d);queueHandoffs(d,first);if(first){var qb=location.search.match(/[?&]bot=(\w+)/),qk=location.search.match(/[?&]b=(\w+)/);if(qb)setTimeout(function(){HQ.showBot(qb[1]);},50);else if(qk)setTimeout(function(){HQ.showBld(qk[1]);},50);}first=false;light();}
HQ.load(data);setInterval(function(){HQ.load(data);},60000);setInterval(light,60000);light();frame();
window.HQ3D={scene:scene,bots:BOT,ok:true};
})();
