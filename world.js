/* VelnoriCo HQ 3D command deck (ship interior: PBR + RoomEnvironment PMREM, Reflector floor, EffectComposer bloom/grade/FXAA on High). three.js r147 (vendored), WebGL2 or WebGL1. ES5 only in this file. */
(function(){
var HQ=window.HQ,T=window.THREE,el=HQ.el;
function fallback(why){try{console.warn("HQ 3D fallback:",why);}catch(e){}location.replace("2d.html?nowebgl=1");}
if(!T||!T.OrbitControls)return fallback("three missing");
var ok=false;try{var c0=document.createElement("canvas");ok=!!(window.WebGLRenderingContext&&(c0.getContext("webgl2")||c0.getContext("webgl")||c0.getContext("experimental-webgl")));}catch(e){}
if(!ok||/[?&]2d/.test(location.search))return fallback("no webgl");
var SHOT=/[?&]shot/.test(location.search),Q=location.search.match(/[?&]q=(low|high)/),mobile=/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)||Math.min(screen.width,screen.height)<700;
var HASGL2=false;try{HASGL2=!!document.createElement("canvas").getContext("webgl2");}catch(e){}
var LOW=Q?Q[1]==="low":(localStorage.getItem("hqLow")!==null?localStorage.getItem("hqLow")==="1":(mobile||!HASGL2));
var renderer;try{renderer=new T.WebGLRenderer({antialias:false,powerPreference:"high-performance",preserveDrawingBuffer:SHOT});}catch(e){return fallback(e);}
if(T.ColorManagement)T.ColorManagement.legacyMode=false;
renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,LOW?1:1.5));renderer.setSize(window.innerWidth,window.innerHeight);
renderer.shadowMap.enabled=!LOW;renderer.shadowMap.type=T.PCFSoftShadowMap;
el("world").appendChild(renderer.domElement);
var WGL2=!!renderer.capabilities.isWebGL2;
var scene=new T.Scene(),cam=new T.PerspectiveCamera(mobile?62:50,window.innerWidth/window.innerHeight,0.3,2000);
var HOMECAM=mobile?[0,8,27]:[0,7.2,26],HOMET=[0,3.2,-4];cam.position.set(HOMECAM[0],HOMECAM[1],HOMECAM[2]);
var ctl=new T.OrbitControls(cam,renderer.domElement);ctl.enableDamping=true;ctl.dampingFactor=0.06;ctl.maxPolarAngle=1.45;ctl.minPolarAngle=.25;ctl.minDistance=4;ctl.maxDistance=32;ctl.target.set(HOMET[0],HOMET[1],HOMET[2]);ctl.screenSpacePanning=false;
ctl.autoRotate=!SHOT;ctl.autoRotateSpeed=.1;
scene.fog=new T.FogExp2(0x0a0d12,.011);
var SUNDIR=new T.Vector3(-1,.38,-.62).normalize();
var hemi=new T.HemisphereLight(0x9fb7d6,0x1a1410,0.38);scene.add(hemi);
var sun=new T.DirectionalLight(0xe4eeff,1.7);sun.castShadow=!LOW;sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.0005;sun.shadow.normalBias=.02;var sc=sun.shadow.camera;sc.left=sc.bottom=-38;sc.right=sc.top=38;sc.near=1;sc.far=200;sun.position.copy(SUNDIR).multiplyScalar(80);scene.add(sun);scene.add(sun.target);
var moon=new T.DirectionalLight(0xffb36b,0.32);moon.position.set(25,12,45);scene.add(moon);
var dais=new T.PointLight(0x7fe3ff,1.6,30,2);dais.visible=!LOW;dais.position.set(0,5,0);scene.add(dais);
/* environment map for reflections (RoomEnvironment via PMREM) */
try{if(T.RoomEnvironment){var pm=new T.PMREMGenerator(renderer);scene.environment=pm.fromScene(new T.RoomEnvironment(),0.04).texture;pm.dispose();}}catch(e){try{console.warn("env map skipped");}catch(_){}}
scene.background=new T.Color(0x020306);
/* ---------- helpers ---------- */
var MC={};function M(c,o){var k=c+(o?JSON.stringify(o):"");if(!MC[k]){var p={color:c,roughness:.62,metalness:0,envMapIntensity:.5};if(o)for(var i in o)p[i]=o[i];MC[k]=new T.MeshStandardMaterial(p);}return MC[k];}
function add(par,g,m,x,y,z,sh){var me=new T.Mesh(g,m);me.position.set(x||0,y||0,z||0);if(sh!==false){me.castShadow=true;me.receiveShadow=true;}par.add(me);return me;}
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
/* ================= COMMAND DECK: hull, panoramic window, ceiling ribs, bays, holo-table, space ================= */
var CYAN=0x7fe3ff,WARM=0xffb36b,R=34,H=13;
var NM={};function N(c,o){var k=c+"|"+(o||1);if(!NM[k])NM[k]=new T.MeshBasicMaterial({color:new T.Color(c).multiplyScalar(o||1)});return NM[k];}
function glowTex(){var c=document.createElement("canvas");c.width=c.height=64;var x=c.getContext("2d"),g=x.createRadialGradient(32,32,1,32,32,31);g.addColorStop(0,"rgba(255,255,255,1)");g.addColorStop(.3,"rgba(255,255,255,.3)");g.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=g;x.fillRect(0,0,64,64);return new T.CanvasTexture(c);}
var GLOW=glowTex();function halo(par,c,s,x,y,z,o){var sp=new T.Sprite(new T.SpriteMaterial({map:GLOW,color:c,transparent:true,opacity:o||.35,depthWrite:false,blending:T.AdditiveBlending,fog:false}));sp.scale.set(s,s,1);sp.position.set(x,y,z);par.add(sp);return sp;}
function S(c,r,m,o){var p={color:c,roughness:r,metalness:m,envMapIntensity:.6};if(o)for(var k in o)p[k]=o[k];return new T.MeshStandardMaterial(p);}
var rs=7;function rnd(){rs=(rs*16807)%2147483647;return(rs-1)/2147483646;}
/* procedural canvas textures */
function cvs(w,h,fn){var c=document.createElement("canvas");c.width=w;c.height=h;fn(c.getContext("2d"),w,h);var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.anisotropy=4;return t;}
var panelTex=cvs(512,512,function(x,w,h){x.fillStyle="#3a3f47";x.fillRect(0,0,w,h);for(var i=0;i<400;i++){x.fillStyle="rgba("+(rnd()<.5?0:255)+","+(rnd()<.5?0:255)+",255,"+(rnd()*.025)+")";x.fillRect(rnd()*w,rnd()*h,rnd()*80,rnd()*80);}
 x.strokeStyle="rgba(8,10,14,.85)";x.lineWidth=3;[[0,0,256,170],[256,0,256,170],[0,170,170,170],[170,170,342,90],[170,260,342,80],[0,340,512,172]].forEach(function(r){x.strokeRect(r[0]+2,r[1]+2,r[2]-4,r[3]-4);});
 x.strokeStyle="rgba(255,255,255,.07)";x.lineWidth=1;[[0,0,256,170],[256,0,256,170],[0,340,512,172]].forEach(function(r){x.strokeRect(r[0]+5,r[1]+5,r[2]-10,r[3]-10);});
 x.fillStyle="rgba(10,12,16,.8)";for(i=0;i<8;i++){x.fillRect(200+i*14,400,8,60);}for(i=0;i<40;i++){x.beginPath();x.arc(10+((i*61)%500),(i%2?12:158)+(i>20?340:0),2,0,7);x.fill();}});
panelTex.wrapS=panelTex.wrapT=T.RepeatWrapping;
var floorTex=cvs(512,512,function(x,w,h){x.fillStyle="#24282e";x.fillRect(0,0,w,h);for(var i=0;i<600;i++){x.fillStyle="rgba(255,255,255,"+(rnd()*.02)+")";x.fillRect(rnd()*w,rnd()*h,rnd()*40,1);}
 x.strokeStyle="rgba(5,6,8,.9)";x.lineWidth=4;for(i=0;i<=4;i++){x.beginPath();x.moveTo(i*128,0);x.lineTo(i*128,h);x.stroke();x.beginPath();x.moveTo(0,i*128);x.lineTo(w,i*128);x.stroke();}
 x.fillStyle="rgba(0,0,0,.35)";for(i=0;i<16;i++){var cx=(i%4)*128+64,cy=((i/4)|0)*128+64;for(var j=0;j<5;j++)x.fillRect(cx-30,cy-22+j*10,60,4);}});
floorTex.wrapS=floorTex.wrapT=T.RepeatWrapping;floorTex.repeat.set(14,14);
var hullTex=panelTex.clone();hullTex.needsUpdate=true;hullTex.repeat.set(18,2);
var hullM=S(0x9aa2ad,.62,.45,{map:hullTex,side:T.BackSide,envMapIntensity:.35}),panelM=S(0x8a929c,.55,.5,{map:panelTex,envMapIntensity:.45}),
 metal=S(0x8d949d,.3,.9,{envMapIntensity:.6}),darkM=S(0x15181d,.5,.6),whiteM=S(0xc9d0d8,.38,.2),rubber=S(0x0c0d0f,.85,0,{envMapIntensity:.2}),
 floorM=S(0x8b929c,.32,.55,{map:floorTex,envMapIntensity:.55});
var RBG=T.RoundedBoxGeometry;function rbox(par,w,h,d,mat,x,y,z,rad,sh){var g=RBG?new RBG(w,h,d,LOW?1:2,rad||Math.min(w,h,d)*.18):new T.BoxGeometry(w,h,d);return add(par,g,mat,x,y,z,sh);}
function tube(par,pts,r,mat,seg,closed,sh){var c=new T.CatmullRomCurve3(pts,!!closed);return add(par,new T.TubeGeometry(c,seg||Math.max(8,pts.length*6),r,LOW?5:8,!!closed),mat,0,0,0,sh===true);}
function arcPts(r,y,a0,a1,n){var p=[];for(var i=0;i<=n;i++){var a=a0+(a1-a0)*i/n;p.push(new T.Vector3(Math.sin(a)*r,y,Math.cos(a)*r));}return p;}
function arc(par,r,y,a0,a1,tr,mat,n){return tube(par,arcPts(r,y,a0,a1,n||Math.max(12,Math.round((a1-a0)*r))),tr,mat,(n||Math.max(12,Math.round((a1-a0)*r)))*2,Math.abs(a1-a0)>6.28);}
function strip(par,r,c,y,o,t){return arc(par,r,y,0,Math.PI*2-.0001,t||.03,N(c,o||1.6),LOW?64:128);}
/* blinking console lights: three phase groups */
var BL=[N(CYAN,2.4).clone(),N(WARM,2.4).clone(),N(0x8cffb0,2).clone(),N(0xff6b6b,2).clone()],BLC=BL.map(function(m){return m.color.clone();});
function blinker(par,x,y,z,i){return add(par,new T.BoxGeometry(.09,.05,.09),BL[i%4],x,y,z,false);}
/* light-shaft material: fresnel-weighted additive cone */
var shaftMats=[];function shaftMat(c,o){var m=new T.ShaderMaterial({uniforms:{c:{value:new T.Color(c)},o:{value:o}},transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide,
 vertexShader:"varying vec3 vN;varying vec3 vV;varying float vY;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);vY=uv.y;gl_Position=projectionMatrix*mv;}",
 fragmentShader:"uniform vec3 c;uniform float o;varying vec3 vN;varying vec3 vV;varying float vY;void main(){float f=abs(dot(vN,vV));f=f*f;float a=f*o*pow(vY,1.6);gl_FragColor=vec4(c*a,a);}"});shaftMats.push(m);return m;}
function shaft(par,x,y,z,rt,rb,h,c,o){var m=add(par,new T.CylinderGeometry(rt,rb,h,LOW?16:28,1,true),shaftMat(c,o),x,y,z,false);m.renderOrder=3;return m;}
/* ---------- hull: wall, panoramic window, ceiling, ribs ---------- */
var WA=1.2,W0=Math.PI-WA,W1=Math.PI+WA;/* window arc centred on -z */
var wall=add(scene,new T.CylinderGeometry(R,R,H,LOW?48:120,1,true,W1,Math.PI*2-WA*2),hullM,0,H/2,0,false);wall.receiveShadow=!LOW;
var ceil=add(scene,new T.CircleGeometry(R,LOW?48:96),S(0x5a616b,.7,.4,{map:(function(){var t=panelTex.clone();t.needsUpdate=true;t.repeat.set(10,10);return t;})(),envMapIntensity:.3}),0,H,0,false);ceil.rotation.x=Math.PI/2;
/* window frame: mullions, sill, header, faint glass */
var NM_=LOW?8:12;for(var i=0;i<=NM_;i++){var a=W0+(W1-W0)*i/NM_,m=rbox(scene,.55,H,.9,metal,Math.sin(a)*(R-.2),H/2,Math.cos(a)*(R-.2),.12,false);m.rotation.y=a;}
arc(scene,R-.35,1.1,W0,W1,.45,metal);arc(scene,R-.35,H-.5,W0,W1,.5,metal);arc(scene,R-.6,1.55,W0,W1,.035,N(CYAN,2.2));arc(scene,R-.4,.45,W0,W1,.55,darkM);
add(scene,new T.CylinderGeometry(R-.1,R-.1,H-1.6,LOW?24:64,1,true,W0,W1-W0),new T.MeshBasicMaterial({color:0x9fd8ff,transparent:true,opacity:.035,depthWrite:false,side:T.BackSide}),0,H/2+.2,0,false);
/* ceiling ribs + central ring + light coves */
var NR=LOW?10:20;for(i=0;i<NR;i++){var ra=i/NR*Math.PI*2+.08,s=Math.sin(ra),c=Math.cos(ra);
 tube(scene,[new T.Vector3(s*(R-.3),H-1.9,c*(R-.3)),new T.Vector3(s*(R-2),H-.9,c*(R-2)),new T.Vector3(s*22,H-.45,c*22),new T.Vector3(s*10,H-.3,c*10)],.22,metal,24);
 if(!LOW&&i%2===0)add(scene,new T.BoxGeometry(.06,.04,9),N(0xdfefff,2.2),s*16,H-.32,c*16,false).rotation.y=ra;}
arc(scene,9.6,H-.7,0,Math.PI*2-.0001,.38,metal,LOW?48:96);strip(scene,9.1,CYAN,H-.75,2.4,.05);strip(scene,26,0xdfefff,H-.4,1.4,.05);
/* wall greebles (instanced), wall light lines, cable runs */
(function(){var n=LOW?70:220,g=RBG?new RBG(1,1,1,1,.12):new T.BoxGeometry(1,1,1),im=new T.InstancedMesh(g,darkM,n),im2=new T.InstancedMesh(g,metal,Math.round(n/3)),M4=new T.Matrix4(),q=new T.Quaternion(),e=new T.Euler(),p=new T.Vector3(),sc=new T.Vector3();
 function put(mesh,j){var a=W1+.05+rnd()*(Math.PI*2-WA*2-.1),y=.8+rnd()*(H-2.2),d=.15+rnd()*.35;p.set(Math.sin(a)*(R-d/2-.05),y,Math.cos(a)*(R-d/2-.05));e.set(0,a,0);q.setFromEuler(e);sc.set(.4+rnd()*2.2,.2+rnd()*(rnd()<.2?2.5:.7),d);M4.compose(p,q,sc);mesh.setMatrixAt(j,M4);}
 for(var j=0;j<n;j++)put(im,j);for(j=0;j<im2.count;j++)put(im2,j);im.frustumCulled=im2.frustumCulled=false;scene.add(im);scene.add(im2);})();
arc(scene,R-.25,3.4,W1+.02,W0+Math.PI*2-.02,.035,N(CYAN,1.8));arc(scene,R-.25,H-1.6,W1+.02,W0+Math.PI*2-.02,.035,N(WARM,1.6));
[.25,.42,.6].forEach(function(y,j){arc(scene,R-.6-j*.18,y,W1+.05,W0+Math.PI*2-.05,.09+j*.02,rubber);});
/* floor (+ real mirror reflection on High) */
var floor=add(scene,new T.CircleGeometry(R,LOW?48:96),floorM,0,0,0,false);floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;
var mirror=null;try{if(T.Reflector&&!mobile){mirror=new T.Reflector(new T.CircleGeometry(R,64),{textureWidth:Math.round(window.innerWidth*.5),textureHeight:Math.round(window.innerHeight*.5),color:0x6a727c,clipBias:.003});mirror.rotation.x=-Math.PI/2;mirror.position.y=-.02;scene.add(mirror);}}catch(e){mirror=null;}
function floorMode(){if(mirror)mirror.visible=!LOW;floorM.transparent=!!(mirror&&!LOW);floorM.opacity=floorM.transparent?.86:1;floorM.needsUpdate=true;}floorMode();
var BLD={barn:[-10,-17.3],library:[10,-17.3],workshop:[20,0],greenhouse:[-20,0],newsroom:[-10,17.3],market:[10,17.3],plaza:[0,0]};
/* floor light lanes from the dais to each bay */
Object.keys(BLD).forEach(function(k){if(k==="plaza")return;var p=BLD[k],a=Math.atan2(p[0],p[1]),l=Math.sqrt(p[0]*p[0]+p[1]*p[1]);[-1.3,1.3].forEach(function(o){var m=add(scene,new T.BoxGeometry(.05,.02,l-15),N(CYAN,1.5),0,.015,0,false);m.position.set(Math.sin(a)*(l/2+.5)+Math.cos(a)*o,.015,Math.cos(a)*(l/2+.5)-Math.sin(a)*o);m.rotation.y=a;});});
strip(scene,8.6,CYAN,.02,2,.04);strip(scene,30.5,WARM,.02,1.2,.03);
/* ---------- central command dais + holo table (plaza) ---------- */
var atrium=new T.Group();scene.add(atrium);
add(atrium,new T.CylinderGeometry(7.6,7.8,.3,LOW?48:96),darkM,0,.15,0);add(atrium,new T.CylinderGeometry(6.2,6.3,.3,LOW?48:96),panelM,0,.45,0);
arc(atrium,7.7,.31,0,Math.PI*2-.0001,.05,metal,96);arc(atrium,6.25,.61,0,Math.PI*2-.0001,.04,N(CYAN,1.8),96);
var tbl=add(atrium,new T.CylinderGeometry(2.3,1.6,1.1,LOW?32:64),metal,0,1.15,0);add(atrium,new T.CylinderGeometry(2.25,2.25,.04,LOW?32:64),N(0x0d2a36,1),0,1.72,0,false);
strip(atrium,2.25,CYAN,1.74,2.6,.035);strip(atrium,1.4,CYAN,1.745,1.6,.015);
for(i=0;i<12;i++)blinker(atrium,Math.sin(i/12*6.283)*2.05,1.5,Math.cos(i/12*6.283)*2.05,i);
var holo=new T.Group();holo.position.set(0,3.9,0);atrium.add(holo);
var hm=new T.MeshBasicMaterial({color:new T.Color(CYAN).multiplyScalar(1.4),wireframe:true,transparent:true,opacity:.45,blending:T.AdditiveBlending,depthWrite:false});
var hsph=add(holo,new T.IcosahedronGeometry(1.35,LOW?2:3),hm,0,0,0,false);
var HR=[];[[1.9,.4],[2.4,-.6],[2.9,.25]].forEach(function(a){var r=add(holo,new T.TorusGeometry(a[0],.012,4,96),N(CYAN,2),0,0,0,false);r.rotation.x=Math.PI/2+a[1];HR.push(r);var mo=add(r,new T.SphereGeometry(.07,10,8),N(WARM,3),a[0],0,0,false);});
var core={material:{emissiveIntensity:1}};
shaft(atrium,0,2.9,0,1.5,1.9,2.4,CYAN,.55).rotation.x=Math.PI;shaft(atrium,0,H-3.5,0,3.2,2.2,7,0xbfe9ff,.12);
/* railings around the dais with gaps toward each bay */
var GAPS=Object.keys(BLD).filter(function(k){return k!=="plaza";}).map(function(k){return Math.atan2(BLD[k][0],BLD[k][1]);});
(function(){var segs=[],sorted=GAPS.slice().sort(function(a,b){return a-b;});for(var j=0;j<sorted.length;j++){var a0=sorted[j]+.22,a1=(j+1<sorted.length?sorted[j+1]:sorted[0]+Math.PI*2)-.22;segs.push([a0,a1]);}
 segs.forEach(function(s){arc(atrium,7.35,1.35,s[0],s[1],.045,metal);arc(atrium,7.35,.85,s[0],s[1],.025,metal);for(var a=s[0];a<=s[1]+.01;a+=Math.max(.16,(s[1]-s[0])/Math.ceil((s[1]-s[0])/.18))){add(atrium,new T.CylinderGeometry(.03,.03,1.05,6),metal,Math.sin(a)*7.35,.82,Math.cos(a)*7.35,false);}});})();
/* ---------- holographic screens (canvas UI, redrawn live; counts/text only, never money) ---------- */
var SCR=[];
function screenTex(k,acc){var w=LOW?256:512,h=LOW?128:256,cv=document.createElement("canvas");cv.width=w;cv.height=h;var tx=new T.CanvasTexture(cv);tx.encoding=T.sRGBEncoding;tx.minFilter=T.LinearFilter;tx.generateMipmaps=false;
 var o={k:k,cv:cv,x:cv.getContext("2d"),tex:tx,acc:"#"+new T.Color(acc).getHexString(),hist:[],bars:[],scroll:0,next:rnd()*.8};for(var i=0;i<48;i++)o.hist.push(.5+Math.sin(i*.4)*.2);for(i=0;i<10;i++)o.bars.push(rnd());SCR.push(o);drawScreen(o,0);return tx;}
var BOTSIN={};function linesFor(k){var a=(HQ.data&&HQ.data.activity)||[],out=[];for(var i=0;i<a.length&&out.length<8;i++){var b=HQ.byName?HQ.byName(a[i].bot):null,hk=b?(HQ.HOME[b.id]||""):"";if(k==="plaza"||hk===k||!hk)out.push((a[i].bot||"")+" · "+String(a[i].message||"").slice(0,46));}
 if(!out.length)out=["link stable","telemetry nominal","queue synced","awaiting next task"];return out;}
function drawScreen(o,t){var x=o.x,w=o.cv.width,h=o.cv.height,u=w/512;x.clearRect(0,0,w,h);var g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,"rgba(6,22,32,.92)");g.addColorStop(1,"rgba(3,10,16,.92)");x.fillStyle=g;x.fillRect(0,0,w,h);
 x.strokeStyle="rgba(127,227,255,.08)";x.lineWidth=1;for(var i=0;i<w;i+=16*u){x.beginPath();x.moveTo(i,0);x.lineTo(i,h);x.stroke();}for(i=0;i<h;i+=16*u){x.beginPath();x.moveTo(0,i);x.lineTo(w,i);x.stroke();}
 x.fillStyle=o.acc;x.font=(14*u)+"px Helvetica, Arial, sans-serif";x.textBaseline="top";x.fillText((o.k==="plaza"?"COMMAND":(HQ.BNAME[o.k]||o.k).toUpperCase())+"  ·  LIVE",12*u,10*u);
 x.fillStyle="rgba(200,240,255,.5)";x.fillText(["SYNC","SIGNAL","UPLINK","QUEUE"][((t/4)|0)%4]+" "+("0"+((t*7|0)%60)).slice(-2),w-110*u,10*u);
 o.hist.shift();o.hist.push(Math.max(.08,Math.min(.95,o.hist[o.hist.length-1]+(rnd()-.5)*.18)));
 x.strokeStyle=o.acc;x.lineWidth=2*u;x.beginPath();for(i=0;i<o.hist.length;i++){var px=12*u+i*(250*u/47),py=36*u+(1-o.hist[i])*90*u;if(i)x.lineTo(px,py);else x.moveTo(px,py);}x.stroke();
 x.globalAlpha=.18;x.lineTo(262*u,126*u);x.lineTo(12*u,126*u);x.fillStyle=o.acc;x.fill();x.globalAlpha=1;
 for(i=0;i<o.bars.length;i++){o.bars[i]+=(rnd()-.5)*.2;o.bars[i]=Math.max(.1,Math.min(1,o.bars[i]));x.fillStyle=i%3?"rgba(127,227,255,.65)":o.acc;x.fillRect(280*u+i*22*u,126*u-o.bars[i]*86*u,14*u,o.bars[i]*86*u);}
 x.save();x.beginPath();x.rect(0,136*u,w,h-140*u);x.clip();var L=linesFor(o.k);o.scroll=(o.scroll+1)%(L.length*20);x.font=(13*u)+"px Menlo, Consolas, monospace";
 for(i=0;i<L.length+6;i++){var yy=140*u+i*20*u-o.scroll*u;x.fillStyle=i%L.length===0?"rgba(255,255,255,.85)":"rgba(170,225,245,.65)";x.fillText("› "+L[i%L.length],12*u,yy);}x.restore();
 x.fillStyle=o.acc;x.beginPath();x.arc(w-16*u,h-16*u,4*u,0,7);x.globalAlpha=(t*2|0)%2?1:.3;x.fill();x.globalAlpha=1;o.tex.needsUpdate=true;}
function screenMat(tex,boost){return new T.MeshBasicMaterial({map:tex,color:new T.Color(1,1,1).multiplyScalar(boost||1.5),side:T.DoubleSide,transparent:true});}
/* ---------- bays ---------- */
var B={},smokeSrc=null,HOLO=[],SHUT=[];
var ACC={barn:WARM,library:0x9fb2ff,workshop:0xff9a4a,greenhouse:0x8cffb0,newsroom:CYAN,market:0xff8fbf};
function holoSign(g,k,y){var s=label(HQ.BNAME[k],{size:.95,accent:"#"+new T.Color(ACC[k]).getHexString()});s.position.set(0,y,0);g.add(s);HOLO.push(s);}
function deskGeo(ri,ro,ang,hgt){var sh=new T.Shape(),a0=-Math.PI/2-ang,a1=-Math.PI/2+ang;sh.absarc(0,0,ro,a0,a1,false);sh.absarc(0,0,ri,a1,a0,true);
 var g=new T.ExtrudeGeometry(sh,{depth:hgt,bevelEnabled:true,bevelThickness:.08,bevelSize:.08,bevelSegments:LOW?1:3,curveSegments:LOW?12:32});g.rotateX(-Math.PI/2);return g;}
function bay(g,k){var ac=ACC[k];
 rbox(g,10,.36,7.6,panelM,0,.18,-.6,.12);add(g,new T.BoxGeometry(9.4,.03,.05),N(ac,2.2),0,.37,3.18,false);
 var bw=add(g,new T.CylinderGeometry(5.6,5.6,6.4,LOW?24:48,1,true,Math.PI-1.05,2.1),S(0x8a929c,.55,.5,{map:(function(){var t=panelTex.clone();t.needsUpdate=true;t.repeat.set(3,1.2);return t;})(),side:T.BackSide,envMapIntensity:.4}),0,3.5,.4,false);
 arc(g,5.45,6.75,Math.PI-1.05,Math.PI+1.05,.12,metal,24).position.z=.4;arc(g,5.4,.5,Math.PI-1.05,Math.PI+1.05,.035,N(ac,2),24).position.z=.4;
 /* shutter door in the back wall */
 var fr=new T.Group();fr.position.set(0,0,-5.05);g.add(fr);rbox(fr,3,.3,.4,metal,0,3.9,0,.08);rbox(fr,.3,3.9,.4,metal,-1.35,1.95,0,.08);rbox(fr,.3,3.9,.4,metal,1.35,1.95,0,.08);
 add(fr,new T.PlaneGeometry(2.4,3.6),N(ac,.9),0,1.95,-.15,false);var sl=new T.Group();sl.position.set(0,3.75,0);fr.add(sl);for(var i=0;i<7;i++)rbox(sl,2.4,.5,.1,metal,0,-.27-i*.52,.02,.04,false);SHUT.push({g:sl,o:0,k:k});
 /* curved console desk + live screens */
 var dk=add(g,deskGeo(2.4,3.3,.85,.95),darkM,0,.36,-.6);add(g,deskGeo(3.25,3.32,.85,.02),N(ac,2.2),0,1.37,-.6,false);
 var tx=screenTex(k,ac),sm=screenMat(tx,1.6),sc1=add(g,new T.CylinderGeometry(3.05,3.05,1.25,LOW?16:40,1,true,-.8,1.6),sm,0,2.15,-.6,false);
 var fl=add(g,new T.PlaneGeometry(2.6,1.3),new T.MeshBasicMaterial({map:tx,color:new T.Color(1,1,1).multiplyScalar(1.1),transparent:true,opacity:.55,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide}),0,4.4,-2.2,false);fl.userData.bob=1;g.userData.float=fl;
 for(i=0;i<9;i++){var ba=-.7+i*.175;blinker(g,Math.sin(ba)*2.75,1.39,-.6+Math.cos(ba)*2.75,i+(k.length));}
 /* side railings */
 [-1,1].forEach(function(sx){var pts=[new T.Vector3(sx*4.85,1.3,-2.2),new T.Vector3(sx*4.85,1.3,2.9)];tube(g,pts,.04,metal,4);for(var z=-2.2;z<=2.95;z+=1.03)add(g,new T.CylinderGeometry(.03,.03,.95,6),metal,sx*4.85,.84,z,false);});
 shaft(g,0,H-5.4,-.8,1.4,3.4,H-2.2,ac,.16);
 /* hanging cables from the ceiling to the bay */
 tube(g,[new T.Vector3(-3.2,H,-6),new T.Vector3(-3.4,H-2.8,-4.8),new T.Vector3(-3.6,6.4,-4.4)],.06,rubber,16);tube(g,[new T.Vector3(3,H,-6.4),new T.Vector3(3.3,H-3.5,-5),new T.Vector3(3.5,6.4,-4.4)],.05,rubber,16);
 holoSign(g,k,7.7);return ac;}
function mk(k,fn){var g=new T.Group(),p=BLD[k];g.position.set(p[0],0,p[1]);g.rotation.y=Math.atan2(-p[0],-p[1]);fn(g);scene.add(g);pick(g,"bld",k);B[k]={g:g,rooms:new T.Group()};g.add(B[k].rooms);}
var HM2=function(c,o){return new T.MeshBasicMaterial({color:new T.Color(c).multiplyScalar(o||1.4),wireframe:true,transparent:true,opacity:.5,blending:T.AdditiveBlending,depthWrite:false});};
mk("barn",function(g){var ac=bay(g,"barn");cyl(g,.6,.75,1.2,metal,-3.4,.96,-2.6,24);B.spin1=add(g,new T.TorusKnotGeometry(.42,.13,LOW?48:96,8),HM2(ac),-3.4,2.3,-2.6,false);shaft(g,-3.4,1.9,-2.6,.65,.62,.9,ac,.6);});
mk("library",function(g){bay(g,"library");for(var i=0;i<4;i++){var sx=(i<2?-1:1)*(3.5+(i%2)*.0),z=-3.3+(i%2)*1.5;rbox(g,.8,3.6,1.1,darkM,sx,2.16,z,.08);for(var j=0;j<6;j++)blinker(g,sx+(sx<0?.41:-.41),.8+j*.5,z+(j%2?.2:-.2),j+i);}});
mk("workshop",function(g){var ac=bay(g,"workshop");var arm=new T.Group();arm.position.set(-3.3,.36,-2.4);g.add(arm);cyl(arm,.45,.55,.5,metal,0,.25,0,20);var s1=new T.Group();s1.position.y=.5;arm.add(s1);rbox(s1,.35,1.9,.35,whiteM,0,.95,0,.1);var s2=new T.Group();s2.position.y=1.9;s1.add(s2);rbox(s2,.28,1.4,.28,whiteM,0,.7,0,.08);add(s2,new T.SphereGeometry(.12,12,10),N(ac,3),0,1.45,0,false);
 B.arm={a:arm,s1:s1,s2:s2};var gear=add(g,new T.TorusGeometry(.75,.08,8,LOW?24:48),metal,3.3,2.2,-2.6,false);B.workshopGear=gear;add(g,new T.TorusGeometry(.5,.02,6,48),N(ac,2.4),3.3,2.2,-2.6,false);cyl(g,.15,.25,1.8,darkM,3.3,1.1,-2.6,12);});
mk("greenhouse",function(g){var ac=bay(g,"greenhouse"),gl=new T.MeshPhysicalMaterial({color:0xd8fff0,roughness:.1,metalness:0,transparent:true,opacity:.22,depthWrite:false}),lf=S(0x5fae74,.6,0,{emissive:0x0e3a1c});
 for(var r=0;r<3;r++){var t=add(g,new T.CylinderGeometry(.32,.32,3,LOW?12:24),gl,-3.4,1+r*.8,-1.6,false);t.rotation.x=Math.PI/2;for(var j=0;j<5;j++)add(g,new T.SphereGeometry(.2,10,8),lf,-3.4,1+r*.8,-2.9+j*.65,false);add(g,new T.BoxGeometry(.04,.02,3),N(0xff9fe0,2),-3.4,1.36+r*.8,-1.6,false);}});
mk("newsroom",function(g){bay(g,"newsroom");var tx=screenTex("plaza",CYAN);add(g,new T.CylinderGeometry(4.9,4.9,2.2,LOW?24:56,1,true,Math.PI-.9,1.8),screenMat(tx,1.3),0,5.2,.4,false).material.side=T.BackSide;
 B.drum=add(g,new T.CylinderGeometry(1,1,.5,LOW?24:48,1,true),new T.MeshBasicMaterial({color:new T.Color(CYAN).multiplyScalar(1.4),transparent:true,opacity:.25,side:T.DoubleSide,blending:T.AdditiveBlending,depthWrite:false}),3.4,2.2,-2.4,false);cyl(g,.4,.5,1.4,metal,3.4,1.06,-2.4,16);});
mk("market",function(g){var ac=bay(g,"market");cyl(g,.7,.9,1.1,metal,3.3,.9,-2.4,24);var k=new T.Group();k.position.set(3.3,2.4,-2.4);g.add(k);for(var i=0;i<6;i++){var p=add(k,new T.PlaneGeometry(.6,.4),new T.MeshBasicMaterial({color:new T.Color(ac).multiplyScalar(1.6),transparent:true,opacity:.45,side:T.DoubleSide,blending:T.AdditiveBlending,depthWrite:false}),Math.sin(i/6*6.283)*1,0,Math.cos(i/6*6.283)*1,false);p.rotation.y=i/6*6.283;}B.kiosk=k;});
(function(){var g=new T.Group();var s=label("Command Deck",{size:1});s.position.set(0,6.4,0);g.add(s);HOLO.push(s);g.add(atrium);pick(g,"bld","plaza");scene.add(g);B.plaza={g:g,rooms:new T.Group()};
 var cs=screenTex("plaza",CYAN);[0,1,2].forEach(function(i){var a=i/3*6.283+.5,p=add(atrium,new T.PlaneGeometry(1.6,.8),screenMat(cs,1.4),Math.sin(a)*3.2,2.2,Math.cos(a)*3.2,false);p.rotation.y=a;p.rotation.x=-.25;});})();
/* ---------- space: nebula, twinkling stars, planet with shader atmosphere + rings, moon, traffic ---------- */
function vnoise(){var P=[];for(var i=0;i<512;i++)P.push(rnd());function h(x,y){return P[((x*73856093)^(y*19349663))>>>0&511];}
 function n(x,y){var xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);return(h(xi,yi)*(1-u)+h(xi+1,yi)*u)*(1-v)+(h(xi,yi+1)*(1-u)+h(xi+1,yi+1)*u)*v;}
 return function(x,y,o){var s=0,a=.5,f=1;for(var i=0;i<o;i++){s+=a*n(x*f,y*f);a*=.5;f*=2;}return s;};}
var fbm=vnoise();
var nebTex=cvs(LOW?256:512,LOW?128:256,function(x,w,h){var id=x.createImageData(w,h),d=id.data,sx=8/w;for(var j=0;j<h;j++)for(var i=0;i<w;i++){var v=fbm(i*sx,j*sx,5),v2=fbm(i*sx+9,j*sx+3,4),m=Math.max(0,v-.42)*2.2,lat=Math.sin(j/h*Math.PI);
 var k=(j*w+i)*4;d[k]=Math.min(255,(20*m+50*Math.max(0,v2-.5)*m)*lat*3);d[k+1]=Math.min(255,(38*m)*lat*3);d[k+2]=Math.min(255,(70*m+30*v2*m)*lat*3);d[k+3]=255;}x.putImageData(id,0,0);});
var neb=new T.Mesh(new T.SphereGeometry(900,32,16),new T.MeshBasicMaterial({map:nebTex,side:T.BackSide,fog:false,depthWrite:false}));neb.rotation.y=2.2;scene.add(neb);
var starMat=new T.ShaderMaterial({uniforms:{t:{value:0},pr:{value:renderer.getPixelRatio()}},transparent:true,depthWrite:false,blending:T.AdditiveBlending,
 vertexShader:"attribute float sz;attribute float ph;uniform float t;uniform float pr;varying float vA;void main(){vA=.55+.45*sin(t*(1.+ph)+ph*6.28);gl_PointSize=sz*pr;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
 fragmentShader:"varying float vA;void main(){vec2 c=gl_PointCoord-.5;float d=length(c);float a=smoothstep(.5,0.,d);gl_FragColor=vec4(vec3(.85,.92,1.)*a*vA*1.6,a*vA);}"});
(function(){var n=LOW?700:1800,p=new Float32Array(n*3),s=new Float32Array(n),f=new Float32Array(n);for(var i=0;i<n;i++){var u=rnd()*2-1,a=rnd()*6.283,r=800,q=Math.sqrt(1-u*u);p[i*3]=q*Math.cos(a)*r;p[i*3+1]=u*r;p[i*3+2]=q*Math.sin(a)*r;s[i]=1+Math.pow(rnd(),6)*4;f[i]=rnd();}
 var g=new T.BufferGeometry();g.setAttribute("position",new T.BufferAttribute(p,3));g.setAttribute("sz",new T.BufferAttribute(s,1));g.setAttribute("ph",new T.BufferAttribute(f,1));var pts=new T.Points(g,starMat);pts.frustumCulled=false;scene.add(pts);})();
var planetTex=cvs(LOW?512:1024,LOW?256:512,function(x,w,h){var id=x.createImageData(w,h),d=id.data,sx=6/w;for(var j=0;j<h;j++)for(var i=0;i<w;i++){var e=fbm(i*sx,j*sx*1.6,6),c=fbm(i*sx*2+20,j*sx*4,5),lat=Math.abs(j/h-.5)*2,k=(j*w+i)*4,r,g,b;
 if(e<.5){r=10+e*30;g=40+e*60;b=80+e*110;}else{var t=(e-.5)*2;r=70+t*90;g=78+t*60;b=60+t*30;}if(lat>.86){r=g=b=220;}var cl=Math.max(0,c-.48)*3.2;r=r+(235-r)*Math.min(1,cl);g=g+(240-g)*Math.min(1,cl);b=b+(250-b)*Math.min(1,cl);d[k]=r;d[k+1]=g;d[k+2]=b;d[k+3]=255;}x.putImageData(id,0,0);});
var PL=new T.Group();PL.position.set(-70,-100,-470);scene.add(PL);var PR=130;
var planet=new T.Mesh(new T.SphereGeometry(PR,LOW?48:96,LOW?32:64),new T.MeshStandardMaterial({map:planetTex,roughness:.85,metalness:0,envMapIntensity:0,fog:false}));PL.add(planet);planet.rotation.z=.2;
var atmoU={sunDir:{value:SUNDIR},c:{value:new T.Color(0x6fc4ff)}};
var atmo=new T.Mesh(new T.SphereGeometry(PR*1.06,64,48),new T.ShaderMaterial({uniforms:atmoU,side:T.BackSide,transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false,
 vertexShader:"varying vec3 vNw;varying vec3 vNv;void main(){vNw=normalize(mat3(modelMatrix)*normal);vNv=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
 fragmentShader:"uniform vec3 sunDir;uniform vec3 c;varying vec3 vNw;varying vec3 vNv;void main(){float i=pow(clamp(.72+dot(vNv,vec3(0.,0.,1.)),0.,1.),5.);float l=.12+1.3*smoothstep(-.3,.6,dot(vNw,sunDir));gl_FragColor=vec4(c*i*l*1.8,1.);}"}));PL.add(atmo);
var rim=new T.Mesh(new T.SphereGeometry(PR*1.004,64,48),new T.ShaderMaterial({uniforms:atmoU,transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false,
 vertexShader:"varying vec3 vNw;varying vec3 vNv;varying vec3 vV;void main(){vNw=normalize(mat3(modelMatrix)*normal);vec4 mv=modelViewMatrix*vec4(position,1.);vNv=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}",
 fragmentShader:"uniform vec3 sunDir;uniform vec3 c;varying vec3 vNw;varying vec3 vNv;varying vec3 vV;void main(){float f=pow(1.-max(dot(vNv,vV),0.),3.);float l=smoothstep(-.25,.5,dot(vNw,sunDir));gl_FragColor=vec4(c*f*l*1.4,1.);}"}));PL.add(rim);
var ring=new T.Mesh(new T.RingGeometry(PR*1.45,PR*2.25,LOW?96:192,1),new T.ShaderMaterial({uniforms:{c:{value:new T.Color(0xcfd6e0)}},side:T.DoubleSide,transparent:true,depthWrite:false,fog:false,
 vertexShader:"varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
 fragmentShader:"uniform vec3 c;varying vec3 vP;void main(){float r=length(vP.xy)/"+(PR).toFixed(1)+";float b=.5+.5*sin(r*60.)*sin(r*23.+1.);float e=smoothstep(1.45,1.55,r)*smoothstep(2.25,2.0,r)*(r>1.8&&r<1.86?.15:1.);gl_FragColor=vec4(c*.55,(.18+.35*b)*e*.75);}"}));
ring.rotation.set(1.25,.15,.35);PL.add(ring);
var moonM=new T.Mesh(new T.SphereGeometry(14,32,24),S(0x9a9ea6,.95,0,{envMapIntensity:0,fog:false,map:cvs(256,128,function(x,w,h){var id=x.createImageData(w,h),d=id.data;for(var j=0;j<h;j++)for(var i=0;i<w;i++){var v=110+fbm(i*.05,j*.05,5)*120,k=(j*w+i)*4;d[k]=d[k+1]=d[k+2]=v;d[k+3]=255;}x.putImageData(id,0,0);})}));moonM.position.set(170,60,-520);scene.add(moonM);
var sunSp=halo(scene,0xfff1dc,220,SUNDIR.x*850,SUNDIR.y*850,SUNDIR.z*850,1);sunSp.material.color.multiplyScalar(3);halo(scene,0xfff6ea,40,SUNDIR.x*850,SUNDIR.y*850,SUNDIR.z*850,1).material.color.multiplyScalar(6);
var TRAF=[];for(i=0;i<(LOW?2:4);i++){var tg=new T.Group();halo(tg,i%2?WARM:0xffffff,3,0,0,0,.9);add(tg,new T.BoxGeometry(.6,.2,2.4),darkM,0,0,0,false);tg.userData={r:120+i*40,y:10+i*12,s:.01+i*.004,o:i*1.7};scene.add(tg);TRAF.push(tg);}
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
function homeOf(o){var k=HQ.HOME[o.id]||(o.data.lines&&o.data.lines[0]?(function(){var r="barn";(HQ.data.lines||[]).forEach(function(l){if(l.id===o.data.lines[0])r=l.building;});return r;})():"plaza");o.bayKey=k;
 var n=HOMESLOT[k]=(HOMESLOT[k]||0)+1,d=door(k),side=new T.Vector3(-d.z,0,d.x).normalize();if(k==="plaza")side.set(1,0,0);var off=(n%2?1:-1)*Math.ceil(n/2)*1.6-(k==="plaza"?0:0);
 return d.clone().add(side.multiplyScalar(off)).add(k==="plaza"?new T.Vector3(0,0,4.4):new T.Vector3(0,0,0));}
function syncBots(d){HOMESLOT={};(d.bots||[]).forEach(function(b){var o=BOT[b.id];if(!o){o=BOT[b.id]=makeBot(b);o.home=homeOf(o);o.pos.copy(o.home);}else{o.data=b;}tagFor(o);});
 Object.keys(B).forEach(function(k){if(k!=="plaza"&&B[k].g&&B[k].rooms)roomsFor(k);});}
/* ---------- ambience: drifting dust in the light shafts (High only) ---------- */
var motes=null;(function(){var Nn=140,pos=new Float32Array(Nn*3);for(var i=0;i<Nn;i++){var a=rnd()*6.28,r=2+rnd()*28;pos[i*3]=Math.cos(a)*r;pos[i*3+1]=.5+rnd()*11;pos[i*3+2]=Math.sin(a)*r;}
 var g=new T.BufferGeometry();g.setAttribute("position",new T.BufferAttribute(pos,3));motes=new T.Points(g,new T.PointsMaterial({color:0xcfe9ff,size:.05,transparent:true,opacity:.4,depthWrite:false,blending:T.AdditiveBlending}));motes.visible=!LOW;scene.add(motes);})();
var WEATHER="clear",NIGHT=true;
function light(){var p=HQ.etParts();el("sky").textContent="Ship time · "+(p.h%12||12)+":"+("0"+p.m).slice(-2)+(p.h<12?" am":" pm")+" ET";}
/* ---------- post-processing (High + WebGL2): bloom → ACES/sRGB + vignette + grain → FXAA ---------- */
var composer=null,bloom=null,fxaa=null,fin=null;
var FINAL={uniforms:{tDiffuse:{value:null},time:{value:0},exposure:{value:1.05},vig:{value:.55},grain:{value:.035}},
 vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
 fragmentShader:"uniform sampler2D tDiffuse;uniform float time;uniform float exposure;uniform float vig;uniform float grain;varying vec2 vUv;"+
 "vec3 acesF(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}"+
 "vec3 toSRGB(vec3 c){return mix(c*12.92,1.055*pow(c,vec3(1./2.4))-.055,step(.0031308,c));}"+
 "float hsh(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}"+
 "void main(){vec3 c=texture2D(tDiffuse,vUv).rgb*exposure;c=acesF(c);c=toSRGB(c);float d=distance(vUv,vec2(.5));c*=mix(1.,smoothstep(.95,.3,d),vig);"+
 "c+=(hsh(vUv*1000.+fract(time)*61.)-.5)*grain;c=mix(c,c*vec3(.96,1.,1.05),.6);gl_FragColor=vec4(c,1.);}"};
function buildPost(){if(composer)return true;if(!WGL2||!T.EffectComposer||!T.UnrealBloomPass||!T.FXAAShader)return false;try{
 var w=window.innerWidth,h=window.innerHeight,pr=renderer.getPixelRatio(),rt=new T.WebGLRenderTarget(w*pr,h*pr,{type:T.HalfFloatType});
 composer=new T.EffectComposer(renderer,rt);composer.setPixelRatio(pr);composer.setSize(w,h);composer.addPass(new T.RenderPass(scene,cam));
 bloom=new T.UnrealBloomPass(new T.Vector2(w,h),.7,.55,.88);composer.addPass(bloom);fin=new T.ShaderPass(FINAL);composer.addPass(fin);
 fxaa=new T.ShaderPass(T.FXAAShader);fxaa.material.uniforms.resolution.value.set(1/(w*pr),1/(h*pr));composer.addPass(fxaa);return true;}catch(e){try{console.warn("post fx off");}catch(_){}composer=null;return false;}}
function postSize(){if(!composer)return;var w=window.innerWidth,h=window.innerHeight,pr=renderer.getPixelRatio();composer.setPixelRatio(pr);composer.setSize(w,h);fxaa.material.uniforms.resolution.value.set(1/(w*pr),1/(h*pr));}
if(!LOW)buildPost();
/* ---------- handoffs ---------- */
var HQUEUE=[],SEEN={},ACTIVE=null;
function queueHandoffs(d,first){var hs=(d.activity||[]).filter(function(a){return a.type==="handoff"&&a.to;});
 (first?hs.slice(0,5).reverse():hs.slice(0,5).reverse()).forEach(function(a){var k=a.time+a.message;if(SEEN[k])return;SEEN[k]=1;HQUEUE.push(a);});}
function route(a,b){if(a.distanceTo(b)<6)return[b.clone()];var pts=[],a0=Math.atan2(a.x,a.z),a1=Math.atan2(b.x,b.z),d=a1-a0;while(d>Math.PI)d-=6.283;while(d<-Math.PI)d+=6.283;var n=Math.max(1,Math.ceil(Math.abs(d)/.35));for(var i=0;i<=n;i++){var q=a0+d*i/n;pts.push(new T.Vector3(Math.sin(q)*9.4,0,Math.cos(q)*9.4));}pts.push(b.clone());return pts;}
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
 else{var ftx=-o.pos.x,ftz=-o.pos.z+.01;o.gl=false;if(o.bayKey&&o.bayKey!=="plaza"&&BLD[o.bayKey]&&Math.sin(ph*.23+o.phase*3)>.25){ftx=BLD[o.bayKey][0]-o.pos.x;ftz=BLD[o.bayKey][1]-o.pos.z;o.gl=true;}var face=Math.atan2(ftx,ftz);var dr2=face-o.root.rotation.y;while(dr2>Math.PI)dr2-=6.283;while(dr2<-Math.PI)dr2+=6.283;o.root.rotation.y+=dr2*Math.min(1,dt*2);}
 var hop=0;if(o.hop){o.hop-=dt*1.5;hop=Math.max(0,Math.sin((1-o.hop)*Math.PI*2))*.6;if(o.hop<=0)o.hop=0;}
 var rr=Math.sqrt(o.pos.x*o.pos.x+o.pos.z*o.pos.z),fy=rr<6.3?.6:rr<7.8?.3:0;o.root.position.set(o.pos.x,fy+hop+(o.fly?.4+Math.sin(ph*2)*.25:0),o.pos.z);
 var sw=walking?Math.sin(ph*10)*.7:0,bob=walking?Math.abs(Math.sin(ph*10))*.08:w?Math.abs(Math.sin(ph*7))*.1:Math.sin(ph*1.5)*.02;o.body.position.y=bob;
 if(P.ll){P.ll.rotation.x=sw;P.lr.rotation.x=-sw;}
 if(P.al){P.al.rotation.x=walking?-sw*.8:w?Math.sin(ph*12)*.6:Math.sin(ph)*.05;P.ar.rotation.x=walking?sw*.8:w?-1.1+Math.sin(ph*12)*.5:(o.gl?-.85+Math.sin(ph*5)*.18:-.3);P.ar.rotation.z=o.parcel.visible?-.2:0;if(o.parcel.visible){P.al.rotation.x=P.ar.rotation.x=-2.6;}}
 if(P.prop){P.prop.visible=!o.parcel.visible;if(w)P.prop.rotation.y=Math.sin(ph*12)*.3;}
 if(P.wl){var fl=w||walking?Math.sin(ph*14)*.9:Math.sin(ph*2.5)*.5;P.wl.rotation.y=fl;P.wr.rotation.y=-fl;}
 if(P.tail)P.tail.rotation.y=Math.sin(ph*(w?9:3))*.5;
 if(P.paint&&w)P.paint.material=M([0xe74c3c,0x2ec4b6,0xf1c40f,0x8e44ad][Math.floor(t*3)%4]);
 P.head.rotation.y=o.id==="oki"&&!w?Math.sin(ph*.4)*1.2:Math.sin(ph*.7)*.25;P.head.rotation.z=sl?.35:0;if(sl)o.body.rotation.x=.12;else o.body.rotation.x=0;
 o.ring.visible=w;if(w)o.ring.scale.setScalar(1+Math.sin(ph*4)*.08);
 if(o.zz){o.zz.position.set(.6,2.6+(t*.5%1)*.6,0);o.zz.material.opacity=1-(t*.5%1);}}
function frame(){requestAnimationFrame(frame);var dt=Math.min(clock.getDelta(),.1);acc+=dt;var cap=LOW?1/30:1/60;if(acc<cap*.92)return;dt=acc;acc=0;var t=clock.elapsedTime;
 fpsN++;fpsT+=dt;if(fpsT>1){FPS=fpsN/fpsT;fpsN=0;fpsT=0;var f=el("fps");if(f)f.textContent=Math.round(FPS)+" fps · "+(LOW?"low":"high")+" quality";
  if(!LOW&&!SHOT&&!Q&&FPS<26){if(++slowT>3)setLow(true,true);}else slowT=0;}
 Object.keys(BOT).forEach(function(k){animBot(BOT[k],t,dt);});nextHandoff();
 HR.forEach(function(r,i){r.rotation.z=t*(.25+i*.12)*(i%2?-1:1);});hsph.rotation.y=t*.15;holo.position.y=3.9+Math.sin(t*.7)*.06;
 if(motes&&motes.visible)motes.rotation.y=t*.006;
 starMat.uniforms.t.value=t;planet.rotation.y=t*.004;neb.rotation.y=2.2+t*.0008;ring.rotation.z=.35+t*.001;
 TRAF.forEach(function(g){var u=g.userData,a=t*u.s+u.o;g.position.set(Math.cos(a)*u.r-40,u.y,-260+Math.sin(a)*u.r*.4);g.rotation.y=-a;g.children[0].material.opacity=(Math.sin(t*4+u.o)>.6)?1:.35;});
 for(var bi=0;bi<BL.length;bi++){var on=Math.sin(t*(1.3+bi*.9)+bi*2)+Math.sin(t*(3.1+bi))*.5>.2;BL[bi].color.copy(BLC[bi]).multiplyScalar(on?1:.12);}
 SCR.forEach(function(o){o.next-=dt;if(o.next<=0){o.next=LOW?1.4:.7;drawScreen(o,t);}});
 SHUT.forEach(function(s,i){var bots=Object.keys(BOT).filter(function(id){return BOT[id].bayKey===s.k&&BOT[id].data.state==="working";}).length,tg=bots?1:(Math.sin(t*.07+i*1.9)>.55?.9:.08);s.o+=(tg-s.o)*Math.min(1,dt*.8);s.g.scale.y=1-s.o*.86;});
 Object.keys(B).forEach(function(k){var f=B[k].g&&B[k].g.userData.float;if(f){f.position.y=4.4+Math.sin(t*.8+k.length)*.08;f.material.opacity=.45+Math.sin(t*1.7+k.length)*.08;}});
 if(B.spin1)B.spin1.rotation.y=t*.6;if(B.kiosk)B.kiosk.rotation.y=t*.25;
 if(B.arm){var aw=BOT.forge&&BOT.forge.data.state==="working"?1.6:.5;B.arm.a.rotation.y=Math.sin(t*.4*aw)*.9;B.arm.s1.rotation.z=.35+Math.sin(t*.6*aw)*.25;B.arm.s2.rotation.z=.6+Math.sin(t*.9*aw+1)*.35;}
 viewOffset(dt);
 if(B.workshopGear)B.workshopGear.rotation.z=t*(BOT.forge&&BOT.forge.data.state==="working"?3:.4);if(B.drum)B.drum.rotation.y=t*(BOT.quill&&BOT.quill.data.state==="working"?4:.3);
 Object.keys(B).forEach(function(k){if(B[k].rooms)B[k].rooms.children.forEach(function(r,i){if(r.userData.flag)r.userData.flag.rotation.y=Math.sin(t*.6+i)*.12;});});
 if(FOLLOW&&!FOCUS&&el("info").style.display==="block"){fv.copy(FOLLOW.pos).setY(1.6).sub(ctl.target).multiplyScalar(1-Math.exp(-dt*2));ctl.target.add(fv);cam.position.add(fv);}
 if(FOCUS){var fk=1-Math.exp(-dt*3.2);ctl.target.lerp(FOCUS.t,fk);cam.position.lerp(FOCUS.c,fk);if(cam.position.distanceTo(FOCUS.c)<.2)FOCUS=null;}
 ctl.update();clampCam();parallax(!mobile,dt);if(!LOW&&composer){fin.uniforms.time.value=t;composer.render(dt);}else renderer.render(scene,cam);parallax(false,dt);}
/* ---------- interaction ---------- */
var ray=new T.Raycaster(),ndc=new T.Vector2(),down=null;
function hit(ev){var r=renderer.domElement.getBoundingClientRect();ndc.x=((ev.clientX-r.left)/r.width)*2-1;ndc.y=-((ev.clientY-r.top)/r.height)*2+1;ray.setFromCamera(ndc,cam);
 var hs=ray.intersectObjects(scene.children,true);for(var i=0;i<hs.length;i++){var u=hs[i].object.userData.pick;if(u)return u;}return null;}
function focusOn(v,dist){ctl.autoRotate=false;clearTimeout(idleT);var dir=cam.position.clone().sub(ctl.target).normalize();FOCUS={t:v.clone(),c:v.clone().add(dir.multiplyScalar(dist)).setY(Math.max(v.y+dist*.45,4))};}
function openInfo(title,html){el("infoT").textContent=title;el("infoB").innerHTML=html;el("info").style.display="block";el("info").scrollTop=0;}
var FOLLOW=null,fv=new T.Vector3();HQ.showBot=function(id){var o=BOT[id];if(!o)return;FOLLOW=o;openInfo(o.data.name,HQ.botHTML(id));focusOn(o.pos.clone().setY(1.6),mobile?21:16);};
HQ.showBld=function(k){FOLLOW=null;openInfo(k==="plaza"?"Command Deck":HQ.BNAME[k],HQ.buildingHTML(k));var p=BLD[k];focusOn(new T.Vector3(p[0],2,p[1]),k==="plaza"?13:12);};
renderer.domElement.addEventListener("pointerdown",function(e){down=[e.clientX,e.clientY];FOCUS=null;FOLLOW=null;});
renderer.domElement.addEventListener("pointerup",function(e){if(!down||Math.abs(e.clientX-down[0])+Math.abs(e.clientY-down[1])>8)return;var u=hit(e);if(!u)return;if(u.type==="bot")HQ.showBot(u.id);else HQ.showBld(u.id);});
var hovT=0;if(!mobile)renderer.domElement.addEventListener("pointermove",function(e){var n=Date.now();if(n-hovT<120)return;hovT=n;renderer.domElement.style.cursor=hit(e)?"pointer":"grab";});
document.addEventListener("click",function(e){var a=e.target;while(a&&a!==document){if(a.getAttribute&&a.getAttribute("data-bot")){e.preventDefault();HQ.showBot(a.getAttribute("data-bot"));return;}if(a.getAttribute&&a.getAttribute("data-bld")){e.preventDefault();HQ.showBld(a.getAttribute("data-bld"));return;}a=a.parentNode;}});
el("reset").onclick=function(){FOLLOW=null;FOCUS={t:new T.Vector3(HOMET[0],HOMET[1],HOMET[2]),c:new T.Vector3(HOMECAM[0],HOMECAM[1],HOMECAM[2])};el("info").style.display="none";};
function setLow(v,auto){LOW=v;localStorage.setItem("hqLow",v?"1":"0");renderer.setPixelRatio(v?1:Math.min(window.devicePixelRatio||1,1.5));renderer.setSize(window.innerWidth,window.innerHeight);renderer.shadowMap.enabled=!v;sun.castShadow=!v;dais.visible=!v;if(motes)motes.visible=!v;if(!v)buildPost();postSize();floorMode();
 scene.traverse(function(m){if(m.material)m.material.needsUpdate=true;});el("qual").textContent=v?"Quality · Low":"Quality · High";if(auto)toast("Switched to Low quality for smoother motion");}
el("qual").textContent=LOW?"Quality · Low":"Quality · High";el("qual").onclick=function(){setLow(!LOW);};
window.addEventListener("resize",function(){cam.aspect=window.innerWidth/window.innerHeight;cam.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight);postSize();});
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
/* subtle mouse parallax (camera nudged in its own plane for the render only) */
var PX={x:0,y:0,sx:0,sy:0},pOff=new T.Vector3(),pR=new T.Vector3(),pU=new T.Vector3();
if(!mobile)window.addEventListener("pointermove",function(e){PX.x=e.clientX/window.innerWidth*2-1;PX.y=e.clientY/window.innerHeight*2-1;},{passive:true});
function parallax(on,dt){if(on){PX.sx+=(PX.x-PX.sx)*Math.min(1,dt*2);PX.sy+=(PX.y-PX.sy)*Math.min(1,dt*2);pR.setFromMatrixColumn(cam.matrixWorld,0);pU.setFromMatrixColumn(cam.matrixWorld,1);pOff.copy(pR).multiplyScalar(-PX.sx*.5).addScaledVector(pU,PX.sy*.3);cam.position.add(pOff);cam.lookAt(ctl.target);}else{cam.position.sub(pOff);cam.lookAt(ctl.target);}}
/* keep the camera inside the hull */
var cv2=new T.Vector2();function clampCam(){cv2.set(cam.position.x,cam.position.z);if(cv2.length()>R-2.5){cv2.setLength(R-2.5);cam.position.x=cv2.x;cam.position.z=cv2.y;}
 cv2.set(ctl.target.x,ctl.target.z);if(cv2.length()>22){cv2.setLength(22);ctl.target.x=cv2.x;ctl.target.z=cv2.y;}ctl.target.y=Math.max(0,Math.min(6,ctl.target.y));}
/* calm camera drift when idle */
var idleT=null;function poke(){ctl.autoRotate=false;clearTimeout(idleT);if(SHOT)return;idleT=setTimeout(function(){if(el("info").style.display!=="block"&&!FOCUS)ctl.autoRotate=true;},15000);}
["pointerdown","wheel","touchstart"].forEach(function(ev){renderer.domElement.addEventListener(ev,poke,{passive:true});});
/* ---------- boot ---------- */
var first=true;function data(d){syncBots(d);queueHandoffs(d,first);if(first){var qb=location.search.match(/[?&]bot=(\w+)/),qk=location.search.match(/[?&]b=(\w+)/);if(qb)setTimeout(function(){HQ.showBot(qb[1]);},50);else if(qk)setTimeout(function(){HQ.showBld(qk[1]);},50);}first=false;light();}
HQ.load(data);setInterval(function(){HQ.load(data);},60000);setInterval(light,60000);light();frame();
window.HQ3D={scene:scene,bots:BOT,cam:cam,ctl:ctl,ok:true};
})();
