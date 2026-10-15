/* VelnoriCo HQ 3D orbital station (premium sci-fi: PBR, RoomEnvironment PMREM, ACES). three.js r147 (vendored), WebGL2 or WebGL1. ES5 only in this file. */
(function(){
var HQ=window.HQ,T=window.THREE,el=HQ.el;
function fallback(why){try{console.warn("HQ 3D fallback:",why);}catch(e){}location.replace("2d.html?nowebgl=1");}
if(!T||!T.OrbitControls)return fallback("three missing");
var ok=false;try{var c0=document.createElement("canvas");ok=!!(window.WebGLRenderingContext&&(c0.getContext("webgl2")||c0.getContext("webgl")||c0.getContext("experimental-webgl")));}catch(e){}
if(!ok||/[?&]2d/.test(location.search))return fallback("no webgl");
var Q=location.search.match(/[?&]q=(low|high)/),mobile=/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)||Math.min(screen.width,screen.height)<700;
var LOW=Q?Q[1]==="low":(localStorage.getItem("hqLow")!==null?localStorage.getItem("hqLow")==="1":(mobile||(navigator.hardwareConcurrency||4)<=4));
var renderer;try{renderer=new T.WebGLRenderer({antialias:!LOW,powerPreference:"high-performance",preserveDrawingBuffer:/[?&]shot/.test(location.search)});}catch(e){return fallback(e);}
if(T.ColorManagement)T.ColorManagement.legacyMode=false;
renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.physicallyCorrectLights=false;
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,LOW?1:1.5));renderer.setSize(window.innerWidth,window.innerHeight);
renderer.shadowMap.enabled=!LOW;renderer.shadowMap.type=T.PCFSoftShadowMap;
el("world").appendChild(renderer.domElement);
var WGL2=!!renderer.capabilities.isWebGL2;
var scene=new T.Scene(),cam=new T.PerspectiveCamera(40,window.innerWidth/window.innerHeight,0.5,900);
var HOMECAM=mobile?[0,50,64]:[0,28,44];cam.position.set(HOMECAM[0],HOMECAM[1],HOMECAM[2]);
var ctl=new T.OrbitControls(cam,renderer.domElement);ctl.enableDamping=true;ctl.dampingFactor=0.06;ctl.maxPolarAngle=1.36;ctl.minDistance=5;ctl.maxDistance=120;ctl.target.set(0,0,2);ctl.screenSpacePanning=false;
ctl.autoRotate=!/[?&]shot/.test(location.search);ctl.autoRotateSpeed=.12;
scene.fog=new T.FogExp2(0x0b0e13,.0062);
var hemi=new T.HemisphereLight(0xdfe8ff,0x16181c,0.45);scene.add(hemi);
var sun=new T.DirectionalLight(0xf4f7ff,1.25);sun.castShadow=!LOW;sun.shadow.mapSize.set(2048,2048);sun.shadow.radius=4;sun.shadow.bias=-.0004;var sc=sun.shadow.camera;sc.left=sc.bottom=-42;sc.right=sc.top=42;sc.far=180;sun.position.set(28,60,26);scene.add(sun);scene.add(sun.target);
var moon=new T.DirectionalLight(0x7fe7ff,0.55);moon.position.set(-40,22,-30);scene.add(moon);
var warm=new T.DirectionalLight(0xffc58a,0.35);warm.position.set(-10,12,45);scene.add(warm);
/* environment map for reflections (RoomEnvironment via PMREM) */
try{if(T.RoomEnvironment){var pm=new T.PMREMGenerator(renderer);scene.environment=pm.fromScene(new T.RoomEnvironment(),0.04).texture;pm.dispose();}}catch(e){try{console.warn("env map skipped");}catch(_){}}
/* gradient sky */
(function(){var c=document.createElement("canvas");c.width=2;c.height=512;var x=c.getContext("2d"),g=x.createLinearGradient(0,0,0,512);
 g.addColorStop(0,"#05070a");g.addColorStop(.45,"#0a0d12");g.addColorStop(.7,"#18202b");g.addColorStop(.85,"#222b36");g.addColorStop(1,"#0d1015");x.fillStyle=g;x.fillRect(0,0,2,512);
 var tx=new T.CanvasTexture(c);tx.encoding=T.sRGBEncoding;scene.background=tx;})();
/* ---------- helpers ---------- */
var MC={};function M(c,o){var k=c+(o?JSON.stringify(o):"");if(!MC[k]){var p={color:c,roughness:.62,metalness:0,envMapIntensity:.5};if(o)for(var i in o)p[i]=o[i];MC[k]=new T.MeshStandardMaterial(p);}return MC[k];}
function add(par,g,m,x,y,z,sh){var me=new T.Mesh(g,m);me.position.set(x||0,y||0,z||0);if(sh!==false&&!LOW){me.castShadow=true;me.receiveShadow=true;}par.add(me);return me;}
function box(par,w,h,d,c,x,y,z){return add(par,new T.BoxGeometry(w,h,d),typeof c==="number"?M(c):c,x,y,z);}
function sph(par,r,c,x,y,z,s){var m=add(par,new T.SphereGeometry(r,LOW?8:12,LOW?6:9),typeof c==="number"?M(c):c,x,y,z);if(s)m.scale.set(s[0],s[1],s[2]);return m;}
function cyl(par,rt,rb,h,c,x,y,z,seg){return add(par,new T.CylinderGeometry(rt,rb,h,seg||(LOW?8:12)),typeof c==="number"?M(c):c,x,y,z);}
function cone(par,r,h,c,x,y,z,seg){return add(par,new T.ConeGeometry(r,h,seg||8),typeof c==="number"?M(c):c,x,y,z);}
function roof(par,w,d,h,c,y){var s=new T.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(0,h);s.lineTo(-w/2,0);var g=new T.ExtrudeGeometry(s,{depth:d,bevelEnabled:false});g.translate(0,0,-d/2);return add(par,g,M(c),0,y,0);}
function label(text,opt){opt=opt||{};var fs=40,F="300 "+fs+"px -apple-system, 'Helvetica Neue', 'Segoe UI', Helvetica, Arial, sans-serif",cv=document.createElement("canvas"),x=cv.getContext("2d");x.font=F;
 var tw=Math.ceil(x.measureText(text).width),pad=opt.dot?44:14,w=tw+pad+18,H=fs+26;cv.width=w;cv.height=H;x.font=F;
 if(opt.plate!==false){x.fillStyle="rgba(10,12,16,.42)";x.fillRect(0,0,w,H-6);}
 var ac=opt.accent||"rgba(160,236,255,.9)";x.fillStyle=ac;x.fillRect(0,H-4,w,2);x.fillRect(0,0,2,H-4);
 if(opt.dot){x.fillStyle=opt.dot;x.beginPath();x.arc(24,(H-6)/2,7,0,7);x.fill();}
 x.fillStyle=opt.fg||"rgba(240,246,255,.95)";x.textBaseline="middle";x.fillText(text,pad,(H-6)/2+1);
 var tx=new T.CanvasTexture(cv);tx.encoding=T.sRGBEncoding;tx.minFilter=T.LinearFilter;tx.generateMipmaps=false;
 var sp=new T.Sprite(new T.SpriteMaterial({map:tx,depthTest:opt.depth!==false,transparent:true,fog:false,toneMapped:false}));var s=opt.size||1;sp.scale.set(s*w/H,s,1);sp.renderOrder=5;return sp;}
function pick(o,type,id){o.traverse(function(m){m.userData.pick={type:type,id:id};});}
/* ---------- station architecture: deck, seams, structural ring, atrium core ---------- */
var CYAN=0x8eeaff,WARM=0xffc58a;
var NM={};function N(c,o){var k=c+"|"+(o||1);if(!NM[k])NM[k]=new T.MeshBasicMaterial({color:new T.Color(c).multiplyScalar(o||1),toneMapped:false});return NM[k];}
function glowTex(){var c=document.createElement("canvas");c.width=c.height=64;var x=c.getContext("2d"),g=x.createRadialGradient(32,32,1,32,32,31);g.addColorStop(0,"rgba(255,255,255,1)");g.addColorStop(.3,"rgba(255,255,255,.3)");g.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=g;x.fillRect(0,0,64,64);return new T.CanvasTexture(c);}
var GLOW=glowTex();function halo(par,c,s,x,y,z,o){var sp=new T.Sprite(new T.SpriteMaterial({map:GLOW,color:c,transparent:true,opacity:o||.35,depthWrite:false,blending:T.AdditiveBlending,fog:false,toneMapped:false}));sp.scale.set(s,s,1);sp.position.set(x,y,z);par.add(sp);return sp;}
function S(c,r,m,o){var p={color:c,roughness:r,metalness:m,envMapIntensity:1};if(o)for(var k in o)p[k]=o[k];return new T.MeshStandardMaterial(p);}
function strip(par,r,c,y,o,tube){var m=add(par,new T.TorusGeometry(r,tube||.025,4,LOW?64:128),N(c,o||1),0,y,0,false);m.rotation.x=Math.PI/2;return m;}
var deckM=S(0x23272e,.38,.75),graphite=S(0x15181d,.55,.6),shellM=S(0xd9dee5,.3,.1,{envMapIntensity:1}),silver=S(0xc9cfd8,.22,1),satin=S(0x6a717b,.4,.35);
var glassLow=S(0xdcecff,.12,0,{transparent:true,opacity:.16,depthWrite:false,side:T.DoubleSide,envMapIntensity:1.4});
var frostLow=S(0xe6f0ff,.5,0,{transparent:true,opacity:.22,depthWrite:false,side:T.DoubleSide});
var glassHi=null,frostHi=null;try{if(WGL2){glassHi=new T.MeshPhysicalMaterial({color:0xffffff,roughness:.08,metalness:0,transmission:1,thickness:.3,ior:1.45,envMapIntensity:1.2,side:T.DoubleSide,transparent:true,opacity:1});
 frostHi=new T.MeshPhysicalMaterial({color:0xf4f8ff,roughness:.42,metalness:0,transmission:.92,thickness:.5,ior:1.4,side:T.DoubleSide,transparent:true});}}catch(e){}
var GLASS=[];function gm(frost){return (!LOW&&glassHi)?(frost?frostHi:glassHi):(frost?frostLow:glassLow);}
function glass(par,g,frost,x,y,z){var m=add(par,g,gm(frost),x,y,z,false);m.userData.frost=frost;GLASS.push(m);return m;}
/* deck */
var ground=add(scene,new T.CylinderGeometry(34,34,.8,LOW?48:128),deckM,0,-.4,0);ground.receiveShadow=!LOW;
add(scene,new T.LatheGeometry([new T.Vector2(34,-.8),new T.Vector2(33.4,-2.4),new T.Vector2(29,-5.2),new T.Vector2(20,-7.6),new T.Vector2(8,-9),new T.Vector2(0,-9.4)],LOW?48:96),graphite,0,0,0,false);
add(scene,new T.TorusGeometry(34,.18,10,LOW?64:160),silver,0,-.02,0,false).rotation.x=Math.PI/2;
strip(scene,33.55,CYAN,.02,.8);strip(scene,26,0xffffff,-6.4,.25,.03);
/* panel seams */
(function(){var v=[],i,a,R=[8.2,14,20,26,31];R.forEach(function(r){var n=LOW?48:96;for(i=0;i<n;i++){a=i/n*6.283;var b=(i+1)/n*6.283;v.push(Math.cos(a)*r,.012,Math.sin(a)*r,Math.cos(b)*r,.012,Math.sin(b)*r);}});
 for(i=0;i<24;i++){a=i/24*6.283;v.push(Math.cos(a)*8.2,.012,Math.sin(a)*8.2,Math.cos(a)*33.4,.012,Math.sin(a)*33.4);}
 var g=new T.BufferGeometry();g.setAttribute("position",new T.Float32BufferAttribute(v,3));scene.add(new T.LineSegments(g,new T.LineBasicMaterial({color:0x07080a,transparent:true,opacity:.75})));})();
var pz=add(scene,new T.CylinderGeometry(8,8.2,.08,LOW?48:96),S(0x8a919b,.3,.5),0,.04,0,false);pz.receiveShadow=!LOW;strip(scene,8.25,CYAN,.06,.9);strip(scene,6.2,0xffffff,.09,.35,.012);
/* structural ring + slim spokes (Endurance-style halo just below deck level) */
var halRing=add(scene,new T.TorusGeometry(40,.2,8,LOW?96:200),silver,0,-1.6,0,false);halRing.rotation.x=Math.PI/2;strip(scene,40,CYAN,-1.84,.45,.025);
for(var i=0;i<12;i++){var sa=i/12*6.283+.13,sp=add(scene,new T.CylinderGeometry(.06,.06,6.2,6),silver,Math.cos(sa)*37,-1.25,Math.sin(sa)*37,false);sp.rotation.z=Math.PI/2;sp.rotation.y=-sa;}
var BLD={barn:[-17,-9],library:[0,-19],workshop:[17,-9],greenhouse:[-17,11],newsroom:[0,20],market:[17,11],plaza:[0,0]};
/* corridors: frosted vault + ribs + floor light strips */
Object.keys(BLD).forEach(function(k){if(k==="plaza")return;var p=BLD[k],len=Math.sqrt(p[0]*p[0]+p[1]*p[1])-14,g=new T.Group();g.position.set(p[0]*.53,0,p[1]*.53);g.rotation.y=Math.atan2(p[0],p[1]);
 var fl=add(g,new T.BoxGeometry(3,.1,len),satin,0,.05,0,false);fl.receiveShadow=!LOW;
 var v=glass(g,new T.CylinderGeometry(1.9,1.9,len,LOW?12:28,1,true,-Math.PI/2,Math.PI),true,0,0,0);v.rotation.x=Math.PI/2;
 for(var i=0;i<4;i++)add(g,new T.TorusGeometry(1.92,.035,6,LOW?16:32,Math.PI),silver,0,0,(i/3-.5)*len*.92,false);
 add(g,new T.BoxGeometry(.03,.02,len),N(CYAN,.7),-1.42,.11,0,false);add(g,new T.BoxGeometry(.03,.02,len),N(CYAN,.7),1.42,.11,0,false);
 scene.add(g);});
/* atrium core: slim lathed spire, floating silver rings, a single light line */
var atrium=new T.Group();scene.add(atrium);
var spire=add(atrium,new T.LatheGeometry([new T.Vector2(0,0),new T.Vector2(1.6,0),new T.Vector2(1.7,.2),new T.Vector2(1.1,.6),new T.Vector2(.55,2),new T.Vector2(.32,6),new T.Vector2(.22,10.5),new T.Vector2(.05,11.2),new T.Vector2(0,11.25)],LOW?24:64),shellM,0,.08,0);
var beam=add(atrium,new T.CylinderGeometry(.012,.012,10,4),N(CYAN,.9),0,6,.36,false);
var HR=[];[[2.4,4.2],[1.7,6.6],[1.15,8.8]].forEach(function(a,i){var r=add(atrium,new T.TorusGeometry(a[0],.03,6,LOW?48:96),silver,0,a[1],0,false);r.rotation.x=Math.PI/2;HR.push(r);});
var core=add(atrium,new T.SphereGeometry(.42,32,20),S(0xffffff,.05,0,{emissive:0x9feeff,emissiveIntensity:.9}),0,11.9,0,false);halo(atrium,CYAN,5,0,11.9,0,.35);
strip(atrium,1.75,CYAN,.1,.9,.02);
/* low bollards around the atrium (warm accent) */
var lampMat=N(WARM,.9),winMat=N(WARM,.9);function windows(){}
for(i=0;i<8;i++){var ba=i/8*6.283+.39;cyl(scene,.1,.12,.9,silver,Math.cos(ba)*9.3,.45,Math.sin(ba)*9.3,12);add(scene,new T.CylinderGeometry(.105,.105,.06,12),lampMat,Math.cos(ba)*9.3,.86,Math.sin(ba)*9.3,false);}
/* far field: stars, a planet with thin atmosphere, a distant ring station */
var rs=7;function rnd(){rs=(rs*16807)%2147483647;return(rs-1)/2147483646;}
(function(){var Ns=LOW?160:360,ps=new Float32Array(Ns*3);for(var i=0;i<Ns;i++){var u=rnd()*6.283,v=rnd()*1.2+.08,R=600;ps[i*3]=Math.cos(u)*Math.cos(v)*R;ps[i*3+1]=Math.sin(v)*R;ps[i*3+2]=Math.sin(u)*Math.cos(v)*R;}
 var g=new T.BufferGeometry();g.setAttribute("position",new T.BufferAttribute(ps,3));scene.add(new T.Points(g,new T.PointsMaterial({color:0xdfe8ff,size:1.1,sizeAttenuation:false,fog:false,transparent:true,opacity:.55,toneMapped:false})));
 var pl=new T.Mesh(new T.SphereGeometry(160,48,32),new T.MeshStandardMaterial({color:0x10141b,roughness:1,metalness:0,fog:false,envMapIntensity:0}));pl.position.set(-260,-40,-520);scene.add(pl);
 halo(scene,0xbfe9ff,420,-260,-40,-530,.16);
 var far=new T.Mesh(new T.TorusGeometry(70,.8,6,LOW?64:128),new T.MeshStandardMaterial({color:0x8a929e,roughness:.4,metalness:.9,fog:true}));far.position.set(220,70,-380);far.rotation.set(1.1,.3,.2);scene.add(far);})();
/* ---------- rooms: smooth white shells with glass fronts ---------- */
var B={},smokeSrc=null,HOLO=[];
function holoSign(g,k,y){var s=label(HQ.BNAME[k],{size:1.25});s.position.set(0,y,0);g.add(s);HOLO.push(s);}
function profile(r,h){var pts=[],n=LOW?10:22;for(var i=0;i<=n;i++){var a=i/n*Math.PI/2;pts.push(new T.Vector2(Math.max(.001,r*Math.pow(Math.cos(a),.55)),h*Math.sin(a)));}return pts;}
function pod(g,k,r,h){var fl=add(g,new T.CylinderGeometry(r+.35,r+.5,.3,LOW?32:72),deckM,0,.15,0);fl.receiveShadow=!LOW;
 var pr=profile(r,h),seg=LOW?28:72,open=Math.PI*.42;
 var sh=add(g,new T.LatheGeometry(pr,seg,open,Math.PI*2-open*2),shellM,0,.3,0);sh.material=shellM;
 glass(g,new T.LatheGeometry(pr,LOW?10:24,-open,open*2),false,0,.3,0);
 add(g,new T.TorusGeometry(r,.05,6,seg),silver,0,.32,0,false).rotation.x=Math.PI/2;strip(g,r+.42,CYAN,.31,.75);
 /* meridian seams on the shell */
 for(var i=1;i<6;i++){var a=open+(Math.PI*2-open*2)*i/6,sm=add(g,new T.LatheGeometry(profile(r+.012,h+.01),2,a-.004,.008),graphite,0,.3,0,false);}
 return g;}
function desk(g,x,z,ry){var d=new T.Group();add(d,new T.TorusGeometry(1.1,.18,10,LOW?16:32,Math.PI),satin,0,.95,0).rotation.x=Math.PI/2;cyl(d,.12,.2,.9,graphite,0,.45,0,10);
 var hp=add(d,new T.PlaneGeometry(1.5,.85),new T.MeshBasicMaterial({color:CYAN,transparent:true,opacity:.18,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false}),0,1.75,-.4,false);
 add(d,new T.BoxGeometry(1.5,.012,.012),N(CYAN),0,1.32,-.4,false);d.position.set(x,.3,z);d.rotation.y=ry||0;g.add(d);return d;}
function mk(k,fn){var g=new T.Group(),p=BLD[k];g.position.set(p[0],0,p[1]);g.rotation.y=Math.atan2(-p[0],-p[1]);fn(g);scene.add(g);pick(g,"bld",k);B[k]={g:g,rooms:new T.Group()};g.add(B[k].rooms);}
mk("barn",function(g){pod(g,"barn",6,4.6);desk(g,-2.2,-1.6,.4);desk(g,2.2,-1.6,-.4);holoSign(g,"barn",6.4);});
mk("library",function(g){pod(g,"library",6,4.6);for(var i=-2;i<=2;i++){cyl(g,.42,.42,2.8,satin,i*1.3,1.7,-3.4+Math.abs(i)*.45,24);strip(g,.43,CYAN,.6+(i+2)*.45,.6,.012).position.set(i*1.3,.6+(i+2)*.45+.3,-3.4+Math.abs(i)*.45);}holoSign(g,"library",6.4);});
mk("workshop",function(g){pod(g,"workshop",6,4.6);var gear=add(g,new T.TorusGeometry(1.25,.05,8,LOW?48:96),silver,0,2.6,-3,false);B.workshopGear=gear;add(g,new T.TorusGeometry(.9,.02,6,64),N(WARM,.8),0,2.6,-3,false);
 cyl(g,.18,.3,1.6,graphite,0,1.1,-3,12);desk(g,2.6,.2,-.7);holoSign(g,"workshop",6.4);});
mk("greenhouse",function(g){pod(g,"greenhouse",6,4.6);var gm2=S(0x7fa58c,.7,0);for(var i=0;i<(LOW?5:7);i++){var a=i/(LOW?5:7)*Math.PI+Math.PI,x=Math.cos(a)*3.2,z=Math.sin(a)*2.6-.2;
  cyl(g,.38,.3,.55,satin,x,.6,z,20);add(g,new T.SphereGeometry(.42,16,12),gm2,x,1.15,z);}holoSign(g,"greenhouse",6.4);});
mk("newsroom",function(g){pod(g,"newsroom",6,4.6);var drum=add(g,new T.CylinderGeometry(1.5,1.5,.9,LOW?24:64,1,true),new T.MeshBasicMaterial({color:CYAN,transparent:true,opacity:.12,side:T.DoubleSide,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}),0,2.6,-2,false);B.drum=drum;
 strip(g,1.5,CYAN,2.15,.8,.012).position.set(0,2.15,-2);desk(g,-2.4,-.6,.5);desk(g,2.4,-.6,-.5);holoSign(g,"newsroom",6.4);});
mk("market",function(g){pod(g,"market",5.4,4);add(g,new T.TorusGeometry(2.4,.22,12,LOW?24:48,Math.PI),satin,0,1,-.8,false).rotation.x=-Math.PI/2;
 for(var i=-2;i<=2;i++)add(g,new T.SphereGeometry(.18,16,12),i===0?N(WARM,.9):silver,i*.9,1.45,-2.6+Math.abs(i)*.3,false);holoSign(g,"market",5.8);});
(function(){var g=new T.Group();var s=label("Central Atrium",{size:1.1});s.position.set(0,13.4,0);g.add(s);HOLO.push(s);g.add(atrium);pick(g,"bld","plaza");scene.add(g);B.plaza={g:g,rooms:new T.Group()};})();
function door(k){var p=BLD[k];if(k==="plaza")return new T.Vector3(0,0,0);var l=Math.sqrt(p[0]*p[0]+p[1]*p[1]),f=(l-6.5)/l;return new T.Vector3(p[0]*f,0,p[1]*f);}
function roomsFor(k){var R=B[k].rooms;while(R.children.length)R.remove(R.children[0]);var line=HQ.lineFor(k);if(!line)return;var is=HQ.insts(line.id);
 is.forEach(function(inst,n){var g=new T.Group(),col=inst.state==="live"?0x8eeaff:inst.state==="paused"?0xffc58a:0x6b7280;cyl(g,.03,.03,2.4,0xc9cfd8,0,1.2,0,5);
  var fl=add(g,new T.PlaneGeometry(1,.6),N(col),.5,2.1,0,false);fl.material=new T.MeshBasicMaterial({color:col,side:T.DoubleSide,transparent:true,opacity:.35,depthWrite:false,toneMapped:false});var tg=label(inst.id,{size:.5,accent:inst.state==="live"?"#8eeaff":inst.state==="paused"?"#ffc58a":"#6b7280"});tg.position.set(0,2.9,0);g.add(tg);
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
  box(b,.66,.65,.1,0x3d5a8a,0,.7,.33);P.prop=new T.Group();cyl(P.prop,.05,.05,.7,0x9a9a9a,0,0,0,6);add(P.prop,new T.TorusGeometry(.12,.04,6,8),new T.MeshStandardMaterial({color:0x7ef09a,emissive:0x1f7a3a}),0,.4,0);P.prop.position.set(.6,.9,.3);b.add(P.prop);}},
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
 if(k==="robot"){box(head,.75,.6,.6,0xe8b84a,0,0,0);box(head,.58,.44,.05,0x111820,0,0,.31);var em=new T.MeshStandardMaterial({color:0x5ff3e0,emissive:0x2bb5a5});add(head,new T.BoxGeometry(.1,.1,.03),em,-.13,.05,.34,false);add(head,new T.BoxGeometry(.1,.1,.03),em,.13,.05,.34,false);add(head,new T.BoxGeometry(.24,.05,.03),em,0,-.1,.34,false);}
 else if(fly){sph(head,.16,sp.c,0,0,0);for(var a=-1;a<=1;a+=2){var an=cyl(head,.015,.015,.5,0x333333,a*.08,.25,0,4);an.rotation.z=-a*.3;sph(head,.04,0x333333,a*.16,.48,0);}
  P.wl=new T.Group();P.wr=new T.Group();[P.wl,P.wr].forEach(function(w,i){var s=i?1:-1,m1=new T.MeshStandardMaterial({color:0x2ec4b6,side:T.DoubleSide}),m2=new T.MeshStandardMaterial({color:0x8e44ad,side:T.DoubleSide});
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
 var ring=add(root,new T.RingGeometry(.68,.72,48),new T.MeshBasicMaterial({color:0x8eeaff,transparent:true,opacity:.7,toneMapped:false,side:T.DoubleSide}),0,.05,0,false);ring.rotation.x=-Math.PI/2;
 var parcel=box(root,.5,.4,.5,0xc8955a,0,2.3,.1);box(parcel,.52,.08,.1,0x7a4b2a,0,.0,0);parcel.visible=false;
 root.scale.setScalar(sp.s*1.6);
 var o={id:b.id,root:root,body:body,P:P,ring:ring,parcel:parcel,fly:fly,kind:k,home:null,pos:new T.Vector3(),path:[],speed:3.2,phase:rnd()*6,wander:0,data:b,tag:null,zz:null,tagKey:""};
 scene.add(root);pick(root,"bot",b.id);return o;}
function tagFor(o){var b=o.data,w=b.state==="working",sl=HQ.sleepy(b),key=b.name+w+sl;if(key===o.tagKey)return;o.tagKey=key;if(o.tag)o.root.remove(o.tag);
 o.tag=label(b.name,{size:.5,dot:w?"#8eeaff":sl?"#6b7280":"#c9cfd8"});o.tag.position.set(0,o.fly?3.1:2.75,0);o.root.add(o.tag);pick(o.tag,"bot",b.id);
 if(!o.zz){o.zz=label("z z",{size:.32,plate:false});o.root.add(o.zz);}o.zz.visible=sl;}
var HOMESLOT={};
function homeOf(o){var k=HQ.HOME[o.id]||(o.data.lines&&o.data.lines[0]?(function(){var r="barn";(HQ.data.lines||[]).forEach(function(l){if(l.id===o.data.lines[0])r=l.building;});return r;})():"plaza");
 var n=HOMESLOT[k]=(HOMESLOT[k]||0)+1,d=door(k),side=new T.Vector3(-d.z,0,d.x).normalize();if(k==="plaza")side.set(1,0,0);var off=(n%2?1:-1)*Math.ceil(n/2)*1.6-(k==="plaza"?0:0);
 return d.clone().add(side.multiplyScalar(off)).add(k==="plaza"?new T.Vector3(0,0,1.5):new T.Vector3(0,0,0));}
function syncBots(d){HOMESLOT={};(d.bots||[]).forEach(function(b){var o=BOT[b.id];if(!o){o=BOT[b.id]=makeBot(b);o.home=homeOf(o);o.pos.copy(o.home);}else{o.data=b;}tagFor(o);});
 Object.keys(B).forEach(function(k){if(k!=="plaza"&&B[k].g&&B[k].rooms)roomsFor(k);});}
/* ---------- ambience: very subtle dust motes (High only) ---------- */
var motes=null;(function(){var Nn=90,pos=new Float32Array(Nn*3);for(var i=0;i<Nn;i++){var a=rnd()*6.28,r=3+rnd()*30;pos[i*3]=Math.cos(a)*r;pos[i*3+1]=.6+rnd()*9;pos[i*3+2]=Math.sin(a)*r;}
 var g=new T.BufferGeometry();g.setAttribute("position",new T.BufferAttribute(pos,3));motes=new T.Points(g,new T.PointsMaterial({color:0xffffff,size:.06,transparent:true,opacity:.35,depthWrite:false,toneMapped:false}));motes.visible=!LOW;scene.add(motes);})();
var WEATHER="clear",NIGHT=true;
function light(){var p=HQ.etParts();el("sky").textContent="Station time · "+(p.h%12||12)+":"+("0"+p.m).slice(-2)+(p.h<12?" am":" pm")+" ET";}
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
 HR.forEach(function(r,i){r.rotation.z=t*(.05+i*.03)*(i%2?-1:1);r.position.y=[4.2,6.6,8.8][i]+Math.sin(t*.5+i)*.08;});core.material.emissiveIntensity=.8+Math.sin(t*.8)*.15;
 if(motes&&motes.visible)motes.rotation.y=t*.008;
 viewOffset(dt);
 if(B.workshopGear)B.workshopGear.rotation.z=t*(BOT.forge&&BOT.forge.data.state==="working"?3:.4);if(B.drum)B.drum.rotation.y=t*(BOT.quill&&BOT.quill.data.state==="working"?4:.3);
 Object.keys(B).forEach(function(k){if(B[k].rooms)B[k].rooms.children.forEach(function(r,i){if(r.userData.flag)r.userData.flag.rotation.y=Math.sin(t*.6+i)*.12;});});
 if(FOLLOW&&!FOCUS&&el("info").style.display==="block"){fv.copy(FOLLOW.pos).setY(1.6).sub(ctl.target).multiplyScalar(1-Math.exp(-dt*2));ctl.target.add(fv);cam.position.add(fv);}
 if(FOCUS){var fk=1-Math.exp(-dt*3.2);ctl.target.lerp(FOCUS.t,fk);cam.position.lerp(FOCUS.c,fk);if(cam.position.distanceTo(FOCUS.c)<.2)FOCUS=null;}
 ctl.update();renderer.render(scene,cam);}
/* ---------- interaction ---------- */
var ray=new T.Raycaster(),ndc=new T.Vector2(),down=null;
function hit(ev){var r=renderer.domElement.getBoundingClientRect();ndc.x=((ev.clientX-r.left)/r.width)*2-1;ndc.y=-((ev.clientY-r.top)/r.height)*2+1;ray.setFromCamera(ndc,cam);
 var hs=ray.intersectObjects(scene.children,true);for(var i=0;i<hs.length;i++){var u=hs[i].object.userData.pick;if(u)return u;}return null;}
function focusOn(v,dist){ctl.autoRotate=false;clearTimeout(idleT);var dir=cam.position.clone().sub(ctl.target).normalize();FOCUS={t:v.clone(),c:v.clone().add(dir.multiplyScalar(dist)).setY(Math.max(v.y+dist*.45,4))};}
function openInfo(title,html){el("infoT").textContent=title;el("infoB").innerHTML=html;el("info").style.display="block";el("info").scrollTop=0;}
var FOLLOW=null,fv=new T.Vector3();HQ.showBot=function(id){var o=BOT[id];if(!o)return;FOLLOW=o;openInfo(o.data.name,HQ.botHTML(id));focusOn(o.pos.clone().setY(1.6),mobile?21:16);};
HQ.showBld=function(k){FOLLOW=null;openInfo(k==="plaza"?"Central Atrium":HQ.BNAME[k],HQ.buildingHTML(k));var p=BLD[k];focusOn(new T.Vector3(p[0],2,p[1]),k==="plaza"?14:18);};
renderer.domElement.addEventListener("pointerdown",function(e){down=[e.clientX,e.clientY];FOCUS=null;FOLLOW=null;});
renderer.domElement.addEventListener("pointerup",function(e){if(!down||Math.abs(e.clientX-down[0])+Math.abs(e.clientY-down[1])>8)return;var u=hit(e);if(!u)return;if(u.type==="bot")HQ.showBot(u.id);else HQ.showBld(u.id);});
var hovT=0;if(!mobile)renderer.domElement.addEventListener("pointermove",function(e){var n=Date.now();if(n-hovT<120)return;hovT=n;renderer.domElement.style.cursor=hit(e)?"pointer":"grab";});
document.addEventListener("click",function(e){var a=e.target;while(a&&a!==document){if(a.getAttribute&&a.getAttribute("data-bot")){e.preventDefault();HQ.showBot(a.getAttribute("data-bot"));return;}if(a.getAttribute&&a.getAttribute("data-bld")){e.preventDefault();HQ.showBld(a.getAttribute("data-bld"));return;}a=a.parentNode;}});
el("reset").onclick=function(){FOCUS={t:new T.Vector3(0,0,2),c:new T.Vector3(HOMECAM[0],HOMECAM[1],HOMECAM[2])};el("info").style.display="none";};
function setLow(v,auto){LOW=v;localStorage.setItem("hqLow",v?"1":"0");renderer.setPixelRatio(v?1:Math.min(window.devicePixelRatio||1,1.5));renderer.shadowMap.enabled=!v;sun.castShadow=!v;GLASS.forEach(function(m){m.material=gm(m.userData.frost);});if(motes)motes.visible=!v;
 scene.traverse(function(m){if(m.material)m.material.needsUpdate=true;});el("qual").textContent=v?"Quality · Low":"Quality · High";if(auto)toast("Switched to Low quality for smoother motion");}
el("qual").textContent=LOW?"Quality · Low":"Quality · High";el("qual").onclick=function(){setLow(!LOW);};
window.addEventListener("resize",function(){cam.aspect=window.innerWidth/window.innerHeight;cam.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight);});
renderer.domElement.addEventListener("webglcontextlost",function(e){e.preventDefault();fallback("context lost");});
/* keep the focused bot/room out from under the info panel: shift the projection centre into the free screen area */
var VO={x:0,y:0,tx:0,ty:0},voN=0;
function viewOffset(dt){var w=window.innerWidth,h=window.innerHeight,inf=el("info");
 if(++voN%6===0){VO.tx=0;VO.ty=0;if(inf.style.display==="block"){var r=inf.getBoundingClientRect();
  if(w<=620){var top=118,cy=(top+Math.max(top+80,r.top))/2;VO.ty=h/2-cy;}
  else{var dr=el("drawer"),right=dr.className==="open"?w-dr.offsetWidth:w,cx=(r.right+right)/2;VO.tx=w/2-cx;}}}
 var vk=1-Math.exp(-(dt||.016)*4),nx=VO.x+(VO.tx-VO.x)*vk,ny=VO.y+(VO.ty-VO.y)*vk;
 if(VO.tx===0&&VO.ty===0&&Math.abs(nx)<.5&&Math.abs(ny)<.5){if(cam.view&&cam.view.enabled)cam.clearViewOffset();VO.x=VO.y=0;return;}
 if(Math.abs(nx-VO.x)+Math.abs(ny-VO.y)<.05)return;VO.x=nx;VO.y=ny;cam.setViewOffset(w,h,VO.x,VO.y,w,h);}
/* calm camera drift when idle */
var idleT=null;function poke(){ctl.autoRotate=false;clearTimeout(idleT);if(/[?&]shot/.test(location.search))return;idleT=setTimeout(function(){if(el("info").style.display!=="block"&&!FOCUS)ctl.autoRotate=true;},15000);}
["pointerdown","wheel","touchstart"].forEach(function(ev){renderer.domElement.addEventListener(ev,poke,{passive:true});});
/* ---------- boot ---------- */
var first=true;function data(d){syncBots(d);queueHandoffs(d,first);if(first){var qb=location.search.match(/[?&]bot=(\w+)/),qk=location.search.match(/[?&]b=(\w+)/);if(qb)setTimeout(function(){HQ.showBot(qb[1]);},50);else if(qk)setTimeout(function(){HQ.showBld(qk[1]);},50);}first=false;light();}
HQ.load(data);setInterval(function(){HQ.load(data);},60000);setInterval(light,60000);light();frame();
window.HQ3D={scene:scene,bots:BOT,cam:cam,ctl:ctl,ok:true};
})();
