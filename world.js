/* VelnoriCo HQ 3D farm campus. three.js r147 (vendored), WebGL2 or WebGL1. ES5 only in this file. */
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
scene.fog=new T.Fog(0x8fd3ff,70,190);
var hemi=new T.HemisphereLight(0xffffff,0x5a7a3a,0.6);scene.add(hemi);
var sun=new T.DirectionalLight(0xfff1d0,0.9);sun.castShadow=!LOW;sun.shadow.mapSize.set(1024,1024);var sc=sun.shadow.camera;sc.left=sc.bottom=-40;sc.right=sc.top=40;sc.far=160;scene.add(sun);scene.add(sun.target);
var moon=new T.DirectionalLight(0x8aa0ff,0);moon.position.set(-30,40,-20);scene.add(moon);
/* ---------- helpers ---------- */
var MC={};function M(c,o){var k=c+(o?JSON.stringify(o):"");if(!MC[k]){var p={color:c};if(o)for(var i in o)p[i]=o[i];MC[k]=new T.MeshLambertMaterial(p);}return MC[k];}
function add(par,g,m,x,y,z,sh){var me=new T.Mesh(g,m);me.position.set(x||0,y||0,z||0);if(sh!==false&&!LOW){me.castShadow=true;me.receiveShadow=true;}par.add(me);return me;}
function box(par,w,h,d,c,x,y,z){return add(par,new T.BoxGeometry(w,h,d),typeof c==="number"?M(c):c,x,y,z);}
function sph(par,r,c,x,y,z,s){var m=add(par,new T.SphereGeometry(r,LOW?8:12,LOW?6:9),typeof c==="number"?M(c):c,x,y,z);if(s)m.scale.set(s[0],s[1],s[2]);return m;}
function cyl(par,rt,rb,h,c,x,y,z,seg){return add(par,new T.CylinderGeometry(rt,rb,h,seg||(LOW?8:12)),typeof c==="number"?M(c):c,x,y,z);}
function cone(par,r,h,c,x,y,z,seg){return add(par,new T.ConeGeometry(r,h,seg||8),typeof c==="number"?M(c):c,x,y,z);}
function roof(par,w,d,h,c,y){var s=new T.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(0,h);s.lineTo(-w/2,0);var g=new T.ExtrudeGeometry(s,{depth:d,bevelEnabled:false});g.translate(0,0,-d/2);return add(par,g,M(c),0,y,0);}
function label(text,opt){opt=opt||{};var cv=document.createElement("canvas"),x=cv.getContext("2d"),fs=48;x.font="bold "+fs+"px Courier New, monospace";var w=Math.ceil(x.measureText(text).width)+40;
 cv.width=w;cv.height=fs+28;x.font="bold "+fs+"px Courier New, monospace";x.fillStyle=opt.bg||"#f3dfb0";x.fillRect(0,0,w,cv.height);x.lineWidth=8;x.strokeStyle="#1a110b";x.strokeRect(0,0,w,cv.height);
 if(opt.dot){x.fillStyle=opt.dot;x.fillRect(12,(cv.height-20)/2,20,20);}x.fillStyle=opt.fg||"#3b2f22";x.textBaseline="middle";x.fillText(text,opt.dot?40:20,cv.height/2+2);
 var tx=new T.CanvasTexture(cv);tx.minFilter=T.LinearFilter;var sp=new T.Sprite(new T.SpriteMaterial({map:tx,depthTest:opt.depth!==false,transparent:true}));var s=opt.size||1;sp.scale.set(s*w/cv.height,s,1);sp.renderOrder=5;return sp;}
function pick(o,type,id){o.traverse(function(m){m.userData.pick={type:type,id:id};});}
var winMat=new T.MeshLambertMaterial({color:0x2a3550,emissive:0x000000}),lampMat=new T.MeshLambertMaterial({color:0xfff2b0,emissive:0x000000});
function windows(par,list){list.forEach(function(w){var m=add(par,new T.BoxGeometry(w[3]||1,w[4]||1,0.12),winMat,w[0],w[1],w[2],false);if(w[5])m.rotation.y=w[5];});}
/* ---------- ground ---------- */
var ground=add(scene,new T.CircleGeometry(95,LOW?24:48),M(0x6fae4b),0,0,0);ground.rotation.x=-Math.PI/2;ground.receiveShadow=!LOW;
var dirt=M(0xc99a63);var pz=add(scene,new T.CircleGeometry(7,24),dirt,0,0.02,0,false);pz.rotation.x=-Math.PI/2;pz.receiveShadow=!LOW;
var BLD={barn:[-17,-9],library:[0,-19],workshop:[17,-9],greenhouse:[-17,11],newsroom:[0,20],market:[17,11],plaza:[0,0]};
Object.keys(BLD).forEach(function(k){if(k==="plaza")return;var p=BLD[k],len=Math.sqrt(p[0]*p[0]+p[1]*p[1]),pa=add(scene,new T.PlaneGeometry(2.6,len-4),dirt,p[0]/2,0.03,p[1]/2,false);
 pa.rotation.x=-Math.PI/2;pa.rotation.z=-Math.atan2(p[0],p[1]);pa.receiveShadow=!LOW;});
var pond=add(scene,new T.CircleGeometry(4,20),new T.MeshLambertMaterial({color:0x4aa3d8,transparent:true,opacity:.85}),-30,0.04,0,false);pond.rotation.x=-Math.PI/2;pond.scale.set(1.4,1,1);
function tree(x,z,s){var g=new T.Group();cyl(g,.25,.35,1.6,0x6b4226,0,.8,0,6);cone(g,1.4,2.6,0x3f7f3a,0,2.6,0,7);cone(g,1.05,2,0x4c9444,0,3.6,0,7);g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g);}
var rs=7;function rnd(){rs=(rs*16807)%2147483647;return(rs-1)/2147483646;}
for(var i=0;i<(LOW?26:48);i++){var a=rnd()*Math.PI*2,r=34+rnd()*40;tree(Math.cos(a)*r,Math.sin(a)*r,.8+rnd()*.7);}
for(i=0;i<36;i++){var fa=i/36*Math.PI*2;box(scene,.2,1,.2,0xe9dcc0,Math.cos(fa)*31,.5,Math.sin(fa)*31);var nb=new T.Mesh(new T.BoxGeometry(5.5,.15,.12),M(0xe9dcc0));nb.position.set(Math.cos(fa+.087)*31,.75,Math.sin(fa+.087)*31);nb.rotation.y=-fa-.087+Math.PI/2;scene.add(nb);}
function lamp(x,z){cyl(scene,.08,.1,3,0x333333,x,1.5,z,6);add(scene,new T.SphereGeometry(.3,8,6),lampMat,x,3.1,z,false);}
lamp(6,6);lamp(-6,6);lamp(6,-6);lamp(-6,-6);
var well=new T.Group();cyl(well,1,1,1,0x9a9a9a,0,.5,0);roof(well,2.6,2,1,0xa33a2c,2);box(well,.15,1.6,.15,0x6b4226,-1,1.4,0);box(well,.15,1.6,.15,0x6b4226,1,1.4,0);well.position.set(3.2,0,-2.6);scene.add(well);
/* ---------- buildings ---------- */
var B={},smokeSrc=null;
function signFor(g,k,y){var s=label(HQ.BNAME[k].toUpperCase(),{size:1.1});s.position.set(0,y,0);g.add(s);}
function mk(k,fn){var g=new T.Group(),p=BLD[k];g.position.set(p[0],0,p[1]);g.rotation.y=Math.atan2(-p[0],-p[1]);fn(g);scene.add(g);pick(g,"bld",k);B[k]={g:g,rooms:new T.Group()};g.add(B[k].rooms);}
mk("barn",function(g){box(g,8,5,6,0xa8322a,-2,2.5,0);var r=roof(g,9,6.4,3.2,0x4a2a20,5);r.position.x=-2;box(g,.3,3.4,.2,0xffffff,-2,1.7,3.05);
 var dx=box(g,3,3.4,.15,0x8a2620,-2,1.7,3.02);box(g,3.6,.25,.2,0xffffff,-2,3.5,3.1);windows(g,[[-2,4.2,3.06,1.2,1]]);
 cyl(g,1.5,1.5,8,0xd9d0c0,3.6,4,-1);sph(g,1.5,0x8a8a8a,3.6,8,-1,[1,.6,1]);
 var fh=new T.Group();box(fh,4.6,3.2,4,0xf3e5c4,0,1.6,0);roof(fh,5.4,4.4,2,0x6b3a2a,3.2);var ch=box(fh,.7,2,.7,0x8a4a3a,1.2,4.2,-.6);windows(fh,[[-1,1.8,2.03,.9,.9],[1,1.8,2.03,.9,.9]]);box(fh,.9,1.6,.1,0x5b3820,0,.8,2.03);
 fh.position.set(-9.5,0,2);fh.rotation.y=.25;g.add(fh);smokeSrc=new T.Vector3();ch.updateMatrixWorld();
 ch.userData.smoke=true;smokeSrc.ch=ch;signFor(g,"barn",9.2);});
mk("library",function(g){box(g,10,4.5,6,0xd9c39a,0,2.25,0);box(g,11,.5,7,0xbfa676,0,4.7,0);roof(g,11,7,2.2,0x3c5a8a,4.95);
 for(var i=-4;i<=4;i+=2)cyl(g,.3,.3,4.2,0xf3ead6,i,2.1,3.3,8);box(g,11,.4,1.4,0xbfa676,0,.2,3.4);box(g,1.6,2.6,.1,0x5b3820,0,1.3,3.02);
 windows(g,[[-3.5,2.6,3.02,1.2,1.6],[3.5,2.6,3.02,1.2,1.6],[-1.6,2.6,3.02,.9,1.4],[1.6,2.6,3.02,.9,1.4]]);
 var bk=[0xc0392b,0x2e86de,0xf1c40f,0x27ae60];for(i=0;i<4;i++)box(g,.5,1.4,1,bk[i],-5.6,.7+0,-1.5+i*.6).rotation.z=i%2?.1:-.05;signFor(g,"library",8.2);});
mk("workshop",function(g){box(g,9,4,6,0x8a6a45,0,2,0);var r=roof(g,9.8,6.6,1.6,0x5d5d5d,4);box(g,4,3,.12,0x3d3d3d,-1.5,1.5,3.02);
 var gear=add(g,new T.TorusGeometry(.9,.3,6,8),M(0x9a9a9a),2.8,2.6,3.15);g.userData.gear=gear;cyl(g,.6,.6,2.5,0x6b6b6b,3.2,5.2,-1.5,8);
 box(g,1.6,.8,.8,0x444444,4.8,.4,4);box(g,2.2,.3,1,0x555555,4.8,.95,4);windows(g,[[2.8,1.2,3.02,1.4,.9]]);signFor(g,"workshop",7.6);B.workshopGear=gear;});
mk("greenhouse",function(g){var glass=new T.MeshLambertMaterial({color:0xbff0e6,transparent:true,opacity:.35,depthWrite:false});
 add(g,new T.BoxGeometry(10,3.4,6),glass,0,1.7,0,false);var rf=roof(g,10.2,6.2,2,0x9fe0d0,3.4);rf.material=glass;
 for(var i=-5;i<=5;i+=2.5){box(g,.15,3.4,.15,0xffffff,i,1.7,3);box(g,.15,3.4,.15,0xffffff,i,1.7,-3);}
 for(i=-3.5;i<=3.5;i+=3.5){box(g,2.6,.5,4.4,0x6b4226,i,.25,0);for(var j=-1.5;j<=1.5;j+=1){cone(g,.35,.9,j>0?0xe74c3c:0x3fae4b,i-.6,.95,j,6);cone(g,.35,.9,0x7bc96f,i+.6,.95,j,6);}}
 signFor(g,"greenhouse",7);});
mk("newsroom",function(g){box(g,9,5,6,0xe8e2d0,0,2.5,0);box(g,9.4,.6,6.4,0x2f2f3a,0,5.3,0);box(g,1.5,2.4,.1,0x5b3820,0,1.2,3.02);
 windows(g,[[-3,3.2,3.02,1.6,1.2],[3,3.2,3.02,1.6,1.2],[-3,1.4,3.02,1.6,1],[3,1.4,3.02,1.6,1]]);cyl(g,.06,.06,4,0x333333,3,7.6,-1,4);sph(g,.25,0xe74c3c,3,9.6,-1);
 var drum=cyl(g,.8,.8,3,0x3b3b3b,-5.6,.9,1);drum.rotation.x=Math.PI/2;B.drum=drum;box(g,1.8,.4,3.4,0xf3ead6,-5.6,1.9,1);signFor(g,"newsroom",8.4);});
mk("market",function(g){var st=new T.Group();for(var i=-1;i<=1;i+=2)for(var j=-1;j<=1;j+=2)cyl(st,.12,.12,3.4,0x6b4226,i*4,1.7,j*2.2,6);
 for(i=0;i<8;i++){var s=box(st,1.1,.2,5.2,i%2?0xfff3d6:0xe04b4b,-3.85+i*1.1,3.6,0);s.rotation.x=0;}
 box(st,8,1.1,1.2,0xb9874f,0,.55,1.9);box(st,8.2,.15,1.4,0x8a5a30,0,1.15,1.9);for(i=-3;i<=3;i+=1.5)box(st,.7,.5,.7,[0xf1c40f,0x2e86de,0x27ae60,0xe67e22,0x9b59b6][((i+3)/1.5)|0],i,1.45,1.9);
 g.add(st);signFor(g,"market",6);});
(function(){var g=new T.Group();pick(g,"bld","plaza");var s=label("TOWN SQUARE",{size:.9});s.position.set(0,4.8,0);g.add(s);var po=cyl(g,.15,.15,4,0x6b4226,0,2,0,6);pick(g,"bld","plaza");scene.add(g);B.plaza={g:g,rooms:new T.Group()};})();
function door(k){var p=BLD[k];if(k==="plaza")return new T.Vector3(0,0,0);var l=Math.sqrt(p[0]*p[0]+p[1]*p[1]),f=(l-6.5)/l;return new T.Vector3(p[0]*f,0,p[1]*f);}
function roomsFor(k){var R=B[k].rooms;while(R.children.length)R.remove(R.children[0]);var line=HQ.lineFor(k);if(!line)return;var is=HQ.insts(line.id);
 is.forEach(function(inst,n){var g=new T.Group(),col=inst.state==="live"?0x3ea84d:inst.state==="paused"?0xc0392b:0xb0a890;cyl(g,.08,.08,2.4,0x5b3820,0,1.2,0,5);
  var fl=box(g,1,.6,.05,col,.5,2.1,0);var tg=label(inst.id,{size:.55,bg:inst.state==="live"?"#b8e07a":"#e8e2d0"});tg.position.set(0,2.9,0);g.add(tg);
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
 var ring=add(root,new T.RingGeometry(.6,.75,20),new T.MeshBasicMaterial({color:0x3ee35e,transparent:true,opacity:.8,side:T.DoubleSide}),0,.05,0,false);ring.rotation.x=-Math.PI/2;
 var parcel=box(root,.5,.4,.5,0xc8955a,0,2.3,.1);box(parcel,.52,.08,.1,0x7a4b2a,0,.0,0);parcel.visible=false;
 root.scale.setScalar(sp.s*1.6);
 var o={id:b.id,root:root,body:body,P:P,ring:ring,parcel:parcel,fly:fly,kind:k,home:null,pos:new T.Vector3(),path:[],speed:3.2,phase:rnd()*6,wander:0,data:b,tag:null,zz:null,tagKey:""};
 scene.add(root);pick(root,"bot",b.id);return o;}
function tagFor(o){var b=o.data,w=b.state==="working",sl=HQ.sleepy(b),key=b.name+w+sl;if(key===o.tagKey)return;o.tagKey=key;if(o.tag)o.root.remove(o.tag);
 o.tag=label(b.name,{size:.42,dot:w?"#3ee35e":sl?"#7f8fa6":"#bbbbbb"});o.tag.position.set(0,o.fly?3.1:2.75,0);o.root.add(o.tag);pick(o.tag,"bot",b.id);
 if(!o.zz){o.zz=label("z z",{size:.35,bg:"#1a110b",fg:"#ffffff"});o.root.add(o.zz);}o.zz.visible=sl;}
var HOMESLOT={};
function homeOf(o){var k=HQ.HOME[o.id]||(o.data.lines&&o.data.lines[0]?(function(){var r="barn";(HQ.data.lines||[]).forEach(function(l){if(l.id===o.data.lines[0])r=l.building;});return r;})():"plaza");
 var n=HOMESLOT[k]=(HOMESLOT[k]||0)+1,d=door(k),side=new T.Vector3(-d.z,0,d.x).normalize();if(k==="plaza")side.set(1,0,0);var off=(n%2?1:-1)*Math.ceil(n/2)*1.6-(k==="plaza"?0:0);
 return d.clone().add(side.multiplyScalar(off)).add(k==="plaza"?new T.Vector3(0,0,1.5):new T.Vector3(0,0,0));}
function syncBots(d){HOMESLOT={};(d.bots||[]).forEach(function(b){var o=BOT[b.id];if(!o){o=BOT[b.id]=makeBot(b);o.home=homeOf(o);o.pos.copy(o.home);}else{o.data=b;}tagFor(o);});
 Object.keys(B).forEach(function(k){if(k!=="plaza"&&B[k].g&&B[k].rooms)roomsFor(k);});}
/* ---------- ambient life ---------- */
var chick=new T.Group();sph(chick,.35,0xffffff,0,.45,0,[1,.9,1.2]);sph(chick,.22,0xffffff,0,.85,.25);cone(chick,.06,.15,0xf39c12,0,.83,.47,4).rotation.x=Math.PI/2;box(chick,.08,.15,.15,0xe74c3c,0,1.08,.25);
cyl(chick,.03,.03,.25,0xf39c12,-.1,.12,0,4);cyl(chick,.03,.03,.25,0xf39c12,.1,.12,0,4);chick.scale.setScalar(1.3);scene.add(chick);var ck={p:new T.Vector3(3,0,4),t:new T.Vector3(3,0,4),wait:0};
var chicks=[];for(i=0;i<(LOW?1:3);i++){var cc=new T.Group();sph(cc,.18,0xf6e05e,0,.2,0);sph(cc,.12,0xf6e05e,0,.38,.1);cc.scale.setScalar(1.2);scene.add(cc);chicks.push(cc);}
var birds=[];for(i=0;i<(LOW?3:6);i++){var bg=new T.Group(),bm=M(0x2c2c2c,{side:T.DoubleSide});var wl=add(bg,new T.PlaneGeometry(.9,.3),bm,-.45,0,0,false),wr=add(bg,new T.PlaneGeometry(.9,.3),bm,.45,0,0,false);wl.rotation.x=wr.rotation.x=-Math.PI/2;
 bg.userData={wl:wl,wr:wr,r:22+rnd()*20,h:16+rnd()*8,s:.15+rnd()*.15,o:rnd()*6};scene.add(bg);birds.push(bg);}
var clouds=[];for(i=0;i<(LOW?4:8);i++){var cg=new T.Group();for(var j=0;j<4;j++)sph(cg,2+rnd()*1.5,new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.85,fog:false}),j*2.2-3,rnd(),rnd()*1.5).castShadow=false;cg.position.set(-90+rnd()*180,48+rnd()*12,-110+rnd()*90);cg.userData.v=.4+rnd()*.6;scene.add(cg);clouds.push(cg);}
var smokeTex=(function(){var c=document.createElement("canvas");c.width=c.height=64;var x=c.getContext("2d"),g=x.createRadialGradient(32,32,2,32,32,30);g.addColorStop(0,"rgba(255,255,255,.9)");g.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=g;x.fillRect(0,0,64,64);return new T.CanvasTexture(c);})();
var smoke=[];for(i=0;i<(LOW?5:10);i++){var sm=new T.Sprite(new T.SpriteMaterial({map:smokeTex,color:0xdddddd,transparent:true,depthWrite:false}));sm.userData.t=i/(LOW?5:10);scene.add(sm);smoke.push(sm);}
/* weather: deterministic per ET day */
var ep=HQ.etParts(),seed=(new Date().getUTCFullYear()*400+new Date().getUTCMonth()*31+new Date().getUTCDate())%7,WEATHER=seed<4?"clear":seed<6?"cloudy":"rain";
var rain=null;if(WEATHER==="rain"){var N=LOW?400:1500,pos=new Float32Array(N*3);for(i=0;i<N;i++){pos[i*3]=-50+rnd()*100;pos[i*3+1]=rnd()*40;pos[i*3+2]=-50+rnd()*100;}
 var rg=new T.BufferGeometry();rg.setAttribute("position",new T.BufferAttribute(pos,3));rain=new T.Points(rg,new T.PointsMaterial({color:0xaaccff,size:.18,transparent:true,opacity:.7}));scene.add(rain);}
var flies=null;(function(){var N=LOW?20:60,pos=new Float32Array(N*3);for(var i=0;i<N;i++){var a=rnd()*6.28,r=8+rnd()*22;pos[i*3]=Math.cos(a)*r;pos[i*3+1]=.5+rnd()*2.5;pos[i*3+2]=Math.sin(a)*r;}
 var g=new T.BufferGeometry();g.setAttribute("position",new T.BufferAttribute(pos,3));flies=new T.Points(g,new T.PointsMaterial({color:0xfff27a,size:.25,transparent:true,opacity:0}));scene.add(flies);})();
/* ---------- day/night (US Eastern) ---------- */
var C_NIGHT=new T.Color(0x141b3d),C_DAWN=new T.Color(0xffb88a),C_DAY=new T.Color(0x8fd3ff),sky=new T.Color(),NIGHT=false;
function light(){var p=HQ.etParts(),h=p.h+p.m/60,ang=(h-6)/12*Math.PI,el_=Math.sin(ang),day=Math.max(0,Math.min(1,el_*3+.2));
 sun.position.set(Math.cos(ang)*60,Math.max(5,el_*70),25);sun.intensity=.95*day;moon.intensity=.35*(1-day);hemi.intensity=.25+.45*day;
 if(day>.6)sky.copy(C_DAY);else if(el_>-.15)sky.copy(C_DAWN).lerp(C_DAY,Math.max(0,(day-.1)/.5)).lerp(C_NIGHT,Math.max(0,-el_/.15));else sky.copy(C_NIGHT);
 if(WEATHER!=="clear")sky.lerp(new T.Color(0x9aa5b1),.45*day);scene.background=sky;scene.fog.color.copy(sky);NIGHT=day<.25;
 winMat.emissive.setHex(NIGHT?0xffc94a:0x000000);winMat.color.setHex(NIGHT?0xffd36b:0x2a3550);lampMat.emissive.setHex(NIGHT?0xffe08a:0x000000);flies.material.opacity=NIGHT?.9:0;
 el("sky").textContent=(NIGHT?"🌙 Night":day<.8?"🌅 Twilight":"☀️ Day")+" · "+(WEATHER==="rain"?"🌧 light rain":WEATHER==="cloudy"?"☁️ cloudy":"clear")+" · "+(p.h%12||12)+":"+("0"+p.m).slice(-2)+(p.h<12?" am":" pm")+" ET";}
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
 if(ck.wait>0)ck.wait-=dt;else{tmp.copy(ck.t).sub(ck.p);var dd=tmp.length();if(dd<.2){ck.t.set(Math.random()*16-8,0,Math.random()*16-8);ck.wait=1+Math.random()*3;}else{tmp.multiplyScalar(Math.min(dd,1.6*dt)/dd);ck.p.add(tmp);chick.rotation.y=Math.atan2(tmp.x,tmp.z);}}
 chick.position.copy(ck.p);chick.position.y=ck.wait>0?0:Math.abs(Math.sin(t*12))*.08;chick.children[1].position.y=ck.wait>0?.85-Math.max(0,Math.sin(t*8))*.25:.85;
 chicks.forEach(function(c,i){var a=-.9-i*.6;c.position.set(ck.p.x-Math.sin(chick.rotation.y)*(1+i*.6)+Math.sin(a+t)*.2,Math.abs(Math.sin(t*14+i))*.06,ck.p.z-Math.cos(chick.rotation.y)*(1+i*.6));c.rotation.y=chick.rotation.y;});
 birds.forEach(function(b){var u=b.userData,a=t*u.s+u.o;b.position.set(Math.cos(a)*u.r,u.h+Math.sin(a*2)*1.5,Math.sin(a)*u.r);b.rotation.y=-a;var fl=Math.sin(t*9+u.o)*.6;u.wl.rotation.z=fl;u.wr.rotation.z=-fl;b.visible=!NIGHT;});
 clouds.forEach(function(c){c.position.x+=c.userData.v*dt;if(c.position.x>90)c.position.x=-90;});
 if(smokeSrc){smokeSrc.ch.getWorldPosition(tmp);smoke.forEach(function(s){var u=(s.userData.t+t*.12)%1;s.position.set(tmp.x+Math.sin(u*6+t)*.4*u+u*1.5,tmp.y+1+u*6,tmp.z);s.scale.setScalar(.8+u*2.6);s.material.opacity=.7*(1-u);});}
 if(rain){var pa=rain.geometry.attributes.position;for(var i=1;i<pa.array.length;i+=3){pa.array[i]-=dt*22;if(pa.array[i]<0)pa.array[i]=40;}pa.needsUpdate=true;}
 if(flies.material.opacity>0)flies.rotation.y=t*.02;
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
HQ.showBot=function(id){var o=BOT[id];if(!o)return;openInfo(o.data.name,HQ.botHTML(id));focusOn(o.pos.clone().setY(1.5),9);};
HQ.showBld=function(k){openInfo(k==="plaza"?"Town Square":HQ.BNAME[k],HQ.buildingHTML(k));var p=BLD[k];focusOn(new T.Vector3(p[0],2,p[1]),k==="plaza"?14:18);};
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
