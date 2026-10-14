/* VelnoriCo HQ overlay panels (shared data UI). ES5, no deps. Public page: never render money. */
var HQ=window.HQ||{};window.HQ=HQ;
(function(){
var DAYS=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],STAGES=["idea","building","qa","awaiting","live","paused"],
 SN={idea:"IDEA",building:"BUILDING",qa:"QA (SENTRY)",awaiting:"AWAITING DAWSON",live:"LIVE",paused:"PAUSED"},
 PSTAGE={Idea:"idea",Design:"building",Listing:"qa",Pin:"awaiting",Live:"live"},F={l:"",i:"",b:"",t:""},D=null;
HQ.BNAME={barn:"Etsy Farmhouse & Barn",library:"Payhip Library",workshop:"Apify/Chrome Workshop",greenhouse:"Adobe Stock Greenhouse",newsroom:"Content Newsroom",market:"Fiverr Market Stall"};
HQ.HOME={oki:"plaza",scout:"barn",pixel:"barn",lister:"barn",ledger:"barn",forge:"workshop",sentry:"plaza",lumen:"greenhouse",quill:"newsroom",clerk:"market"};
function el(i){return document.getElementById(i);}HQ.el=el;
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}HQ.esc=esc;
function et(iso){var d=new Date(iso);if(!iso||isNaN(d))return"—";try{return d.toLocaleString("en-US",{timeZone:"America/New_York",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})+" ET";}catch(e){return d.toLocaleString();}}
function age(iso){return(Date.now()-new Date(iso).getTime())/1000;}
function ago(iso){var s=age(iso);if(isNaN(s))return"";if(s<90)return"just now";if(s<5400)return Math.round(s/60)+" min ago";if(s<129600)return Math.round(s/3600)+" h ago";return Math.round(s/86400)+" d ago";}
HQ.ago=ago;HQ.et=et;HQ.age=age;
HQ.etParts=function(){var d=new Date();try{var s=d.toLocaleString("en-US",{timeZone:"America/New_York",weekday:"short",hour:"numeric",minute:"numeric",hour12:false});
 var m=s.match(/(\w{3}),?\s+(\d+):(\d+)/);return{day:m[1],h:parseInt(m[2],10)%24,m:parseInt(m[3],10)};}catch(e){return{day:DAYS[(d.getDay()+6)%7],h:d.getHours(),m:d.getMinutes()};}};
function bm(){var m={};(D.bots||[]).forEach(function(b){m[b.id]=b;});return m;}
function byName(n){n=String(n||"").toLowerCase();var r=null;(D.bots||[]).forEach(function(b){if(b.id===n||b.name.toLowerCase()===n)r=b;});return r;}HQ.byName=function(n){return D?byName(n):null;};
HQ.sleepy=function(b){return b.state!=="working"&&age(b.last_active)>86400;};
HQ.lineFor=function(bld){var r=null;(D.lines||[]).forEach(function(l){if(l.building===bld)r=l;});return r;};
HQ.insts=function(line){return(D.instances||[]).filter(function(i){return i.line===line;});};
function kpiBox(k,v,t){var pct=(typeof v==="number"&&t)?Math.min(100,Math.round(v/t*100)):null;
 return'<span class="kpi"><b>'+esc(v)+(t?' <small>/ '+esc(t)+'</small>':'')+'</b><small>'+esc(k.replace(/_/g," "))+'</small>'+(pct!==null?'<span class="meter"><i style="width:'+pct+'%"></i></span>':'')+'</span>';}
function cardsFor(inst){var c=(D.pipeline||[]).filter(function(p){return p.instance===inst.id;});
 if(inst.line==="L0")(D.products||[]).forEach(function(p){c.push({title:p.name,stage:PSTAGE[p.stage]||"idea",owner:p.stage==="Design"?"pixel":"lister",url:p.url,note:p.note,since:p.since});});return c;}
function board(inst){var c=cardsFor(inst),m=bm(),h='<div class="board">';
 STAGES.forEach(function(s){var it=c.filter(function(x){return x.stage===s;});h+='<div class="col"><h4>'+SN[s]+' <b>'+it.length+'</b></h4>';
  it.forEach(function(x){var o=m[x.owner],old=x.since&&age(x.since)>7*86400;
   h+='<div class="card'+(old?" old":"")+(x.blocked?" blk":"")+'">'+(o?esc(o.name)+": ":"")+(x.url?'<a href="'+esc(x.url)+'" target="_blank" rel="noopener">'+esc(x.title)+'</a>':esc(x.title))+(x.blocked?' ⛔':'')+
    '<div class="muted">'+(x.since?ago(x.since):"")+(x.note?" · "+esc(x.note):"")+'</div></div>';});h+='</div>';});return h+'</div>';}
function gateMeter(i){var g=i.gate||{},m=(g.met||[]).length,t=m+(g.pending||[]).length;if(!t)return"";
 return'<div><b>'+m+'/'+t+' triggers met</b> → '+esc(g.next)+(m===t?' <span class="pill live">ELIGIBLE</span>':'')+'<span class="meter"><i style="width:'+Math.round(m/t*100)+'%"></i></span><span class="muted">'+
  (g.met||[]).map(function(x){return"✅ "+esc(x);}).concat((g.pending||[]).map(function(x){return"⬜ "+esc(x);})).join(" · ")+'</span></div>';}
function instPanel(i){var m=bm(),k=i.kpis||{},t=i.targets||{},kh="";Object.keys(k).forEach(function(x){kh+=kpiBox(x,k[x],t[x]);});
 return'<div class="sub"><h3>'+esc(i.id)+' · '+esc(i.name)+'<span class="pill '+esc(i.state)+'">'+esc(i.state).toUpperCase()+'</span>'+(i.week?'<span class="pill">launch wk '+esc(i.week)+'</span>':'')+'</h3>'+
  '<div>Crew: '+(i.bots||[]).map(function(b){b=m[b];return b?'<a href="#" data-bot="'+esc(b.id)+'">'+esc(b.name)+'</a>'+(b.state==="working"?" 🟢":""):"";}).join(", ")+'</div><div>'+kh+'</div>'+gateMeter(i)+board(i)+'</div>';}
HQ.buildingHTML=function(bld){if(bld==="plaza")return"<p>The town square: Oki (chief) and Sentry (QA gate) work here. Every parcel passes through Sentry.</p>";
 var line=HQ.lineFor(bld),is=line?HQ.insts(line.id):[],h='<p class="muted">'+(line?esc(line.id+" · "+line.name+" · "+line.state):"")+'</p>';
 if(!is.length)h+="<p>No instances yet (add one with <code>hq.py instance add</code>).</p>";is.forEach(function(i){h+=instPanel(i);});return h;};
HQ.botHTML=function(id){var b=bm()[id];if(!b)return"";var A=(D.activity||[]).filter(function(a){return String(a.bot).toLowerCase()===b.name.toLowerCase()||String(a.to||"").toLowerCase()===b.name.toLowerCase();}).slice(0,6);
 var st=b.state==="working"?"🟢 Working":HQ.sleepy(b)?"💤 Asleep (idle >24h)":"⚪ Idle";
 return'<div class="muted">'+esc(b.role)+' · lines '+esc((b.lines||[]).join(" "))+'</div><p><b>'+st+':</b> '+esc(b.task)+'</p><p class="muted">Last active '+ago(b.last_active)+' ('+et(b.last_active)+')</p>'+
  '<h4>Recent log</h4><ul class="mini">'+(A.map(function(a){return"<li><span class=muted>"+ago(a.time)+"</span> "+esc(a.bot)+(a.to?" → "+esc(a.to):"")+": "+esc(a.message)+"</li>";}).join("")||"<li>No recent activity</li>")+'</ul>'+
  '<p><a href="characters/'+esc(b.id)+'.md" target="_blank" rel="noopener">Character sheet</a></p>';};
function renderWait(){var w=D.waiting_on_dawson||[],e=el("wait");if(!e)return;
 if(!w.length){e.className="wait none";e.innerHTML="✅ Nothing waiting on Dawson";return;}e.className="wait";
 e.innerHTML="<b>⏳ Waiting on Dawson ("+w.length+"):</b> "+w.map(function(x){return"<span>"+esc(x.label)+" · "+ago(x.since)+"</span>";}).join("");}
function renderKpis(){var tot={},live=0,pl=0;(D.instances||[]).forEach(function(i){if(i.state==="live")live++;else if(i.state==="planned")pl++;var k=i.kpis||{};
  Object.keys(k).forEach(function(x){if(typeof k[x]==="number"&&!/pct|rating/.test(x))tot[x]=(tot[x]||0)+k[x];});});
 var h=kpiBox("instances_live",live)+kpiBox("instances_planned",pl)+kpiBox("bots",(D.bots||[]).length)+kpiBox("bots_working",(D.bots||[]).filter(function(b){return b.state==="working";}).length);
 Object.keys(tot).forEach(function(x){h+=kpiBox(x,tot[x]);});el("kpis").innerHTML=h;
 var g="";(D.instances||[]).forEach(function(i){var m=gateMeter(i);if(m)g+='<div class="sub"><b>'+esc(i.id)+'</b> '+m+'</div>';});el("gates").innerHTML=g||"No gates defined.";}
function rMin(r){var t=String(r.time_et||"00:00").split(":");return DAYS.indexOf(r.day)*1440+parseInt(t[0],10)*60+parseInt(t[1]||0,10);}
function routineState(){var p=HQ.etParts(),now=DAYS.indexOf(p.day)*1440+p.h*60+p.m,rs=(D.routines||[]).slice(),st=[];
 var up=rs.filter(function(r){return r.active!==false;}).map(function(r){return{r:r,d:(rMin(r)-now+10080)%10080};}).sort(function(a,b){return a.d-b.d;}).slice(0,3).map(function(x){return x.r;});
 rs.forEach(function(r){var s="";if(r.active===false)s="off";else if(up.indexOf(r)>=0)s="next";else{var m=rMin(r);if(m<=now&&now-m>120){var b=byName(r.bot),bn=b?b.name:r.bot,ok=false,due=Date.now()-(now-m)*60000;
   (D.activity||[]).forEach(function(a){var t=new Date(a.time).getTime();if(String(a.bot).toLowerCase()===String(bn).toLowerCase()&&t>=due-60000&&t<=due+7200000)ok=true;});s=ok?"done":"miss";}}st.push([r,s]);});return{now:now,day:p.day,list:st};}
function renderTimeline(){var R=routineState(),m=bm(),bots=[];R.list.forEach(function(x){if(bots.indexOf(x[0].bot)<0)bots.push(x[0].bot);});
 var h='<table><tr><th>Bot</th>';DAYS.forEach(function(d){h+='<th class="'+(d===R.day?"today":"")+'">'+d+(d===R.day?" ◀ now":"")+'</th>';});h+='</tr>';
 bots.forEach(function(b){var o=m[b];h+='<tr><td>'+(o?esc(o.name):esc(b))+'</td>';DAYS.forEach(function(d){h+='<td class="'+(d===R.day?"today":"")+'">';
  R.list.forEach(function(x){if(x[0].bot===b&&x[0].day===d)h+='<span class="rt '+x[1]+'">'+esc(x[0].time_et)+" "+esc(x[0].label)+(x[1]==="miss"?" ⚠":"")+'</span>';});h+='</td>';});h+='</tr>';});
 el("tl").innerHTML=h+'</table><div class="muted">green = next 3 · red = missed (no activity within 2h) · blue = done · faded = starts at launch</div>';return R;}
function renderHealth(R){var a=age(D.updated),c=a<3600?"g":a<86400?"a":"r",miss=R.list.filter(function(x){return x[1]==="miss";}).length,sl=(D.bots||[]).filter(HQ.sleepy).length;
 el("health").innerHTML='<span><i class="dot '+c+'"></i>status.json '+ago(D.updated)+'</span><span><i class="dot '+(miss?"r":"g")+'"></i>'+miss+' missed routines</span>'+
  '<span><i class="dot '+(sl?"a":"g")+'"></i>'+sl+' bots asleep</span><span><i class="dot g"></i>money guard: hq.py + pre-commit + CI</span><span id="fps"></span>'+
  '<span><img alt="" onerror="this.parentNode.style.display=\'none\'" style="vertical-align:middle;height:18px" src="https://github.com/BDD433/velnorico-hq/actions/workflows/money-check.yml/badge.svg"></span>';}
function opts(id,lab,vals,cur){var h='<option value="">'+lab+': all</option>';vals.forEach(function(v){h+='<option value="'+esc(v)+'"'+(v===cur?" selected":"")+'>'+esc(v)+'</option>';});el(id).innerHTML=h;}
function uniq(a){var o=[];a.forEach(function(x){if(x&&o.indexOf(x)<0)o.push(x);});return o;}
function renderFeed(){var A=D.activity||[];
 opts("fl","Line",(D.lines||[]).map(function(l){return l.id;}),F.l);opts("fi","Instance",(D.instances||[]).map(function(i){return i.id;}),F.i);
 opts("fb","Bot",uniq(A.map(function(a){return a.bot;})),F.b);opts("ft","Type",uniq(["build","handoff","publish","review","alert"].concat(A.map(function(a){return a.type;}))),F.t);
 var h="";A.filter(function(a){return(!F.l||a.line===F.l||String(a.instance||"").split("-")[0]===F.l)&&(!F.i||a.instance===F.i)&&(!F.b||a.bot===F.b||a.to===F.b)&&(!F.t||(a.type||"build")===F.t);}).slice(0,60).forEach(function(a){
  h+='<li><span class="muted">'+ago(a.time)+'</span> <b>'+esc(a.bot)+'</b>'+(a.to?' → <b>'+esc(a.to)+'</b>':'')+' '+esc(a.message)+' <span class="ty '+esc(a.type||"build")+'">'+esc(a.type||"build")+'</span>'+(a.instance?'<span class="ty">'+esc(a.instance)+'</span>':'')+'</li>';});
 el("feed").innerHTML=h||"<li>No matching activity</li>";}
function renderCards(){var h="";(D.bots||[]).forEach(function(b){h+='<div class="sub tm"><a href="#" data-bot="'+esc(b.id)+'"><b>'+esc(b.name)+'</b></a> <small>· '+esc(b.role)+'</small><div>'+(b.state==="working"?"🟢 ":HQ.sleepy(b)?"💤 ":"⚪ ")+esc(b.task)+'</div></div>';});el("cards").innerHTML=h;}
["fl","fi","fb","ft"].forEach(function(id,n){var e=el(id);if(e)e.onchange=function(){F["libt".charAt(n)]=this.value;renderFeed();};});
HQ.render=function(d){D=d;HQ.data=d;renderWait();renderKpis();renderHealth(renderTimeline());renderFeed();renderCards();var u=el("upd");if(u)u.textContent="As of "+et(d.updated)+" ("+ago(d.updated)+")";};
HQ.load=function(cb){var x=new XMLHttpRequest();x.open("GET","status.json?t="+Date.now(),true);x.onload=function(){if(x.status===200){try{var d=JSON.parse(x.responseText);HQ.render(d);cb&&cb(d);}catch(e){}}};x.send();};
})();
