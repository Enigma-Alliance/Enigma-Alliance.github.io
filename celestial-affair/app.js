"use strict";
const config=window.CELESTIAL_CONFIG||{};
const art=window.CELESTIAL_ART||{};
const motion=(window.CELESTIAL_MOTION||{}).layers||{};
const params=new URLSearchParams(location.search);
const inviteToken=params.get('invite');
const demo=params.get('demo')==='1'||(!inviteToken&&config.demoByDefault);
const $=id=>document.getElementById(id);
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(n,min=0,max=1)=>Math.min(max,Math.max(min,n));
const smooth=t=>{t=clamp(t);return t*t*(3-2*t)};
const ordered=(x)=>Array.isArray(x)?x.filter(Boolean):[];
const sky=$('experience');
function getMotion(type,i){const key=type==='invite'?'invite':type+'-'+String(i+1).padStart(2,'0');return motion[key]||null}
function positionAsset(el,m){if(!m)return;el.style.left=m.x+'%';el.style.top=m.y+'%';el.style.right='auto';el.style.bottom='auto';el.style.width=m.size+'vw';el.style.rotate=(m.rotation||0)+'deg'}
const cloudLayer=$('cloudIntro');
const clouds=[];
const planets=[];
const ornaments=[];
const constellations=[];
function image(url,className,parent){
 const element=document.createElement('img');element.src=url;element.alt='';element.decoding='async';element.className=className;
 element.addEventListener('error',()=>{element.hidden=true});parent.append(element);return element;
}
if(art.background){let img=$('artBackground');img.src=art.background;img.hidden=false;img.onerror=()=>img.hidden=true}
ordered(art.constellations).forEach((url,i)=>{
 const img=image(url,'constellation-item', $('constellationArt'));
 img.style.setProperty('--slot',i);positionAsset(img,getMotion('constellations',i));constellations.push(img)
});
ordered(art.planets).forEach((url,i)=>{
 const img=image(url,'planet-item',$('planetArt'));
 img.style.setProperty('--slot',i);positionAsset(img,getMotion('planets',i));planets.push(img)
});
ordered(art.ornaments).forEach((url,i)=>{
 const img=image(url,'ornament-item',$('ornamentArt'));
 img.style.setProperty('--slot',i);positionAsset(img,getMotion('ornaments',i));ornaments.push(img)
});
const cloudInputs=ordered(art.clouds);
// Separate, independently moving clouds. First three form left, right, then foreground.
// More PNGs are distributed in repeating left/right/front layers.
cloudInputs.forEach((url,i)=>{
 const role=['left','right','front'][i%3];
 const cloud=image(url,`cloud-cloud cloud-${role}`,cloudLayer);
 cloud.dataset.role=role;cloud.style.setProperty('--layer',Math.floor(i/3));cloud.style.zIndex=role==='front'?30+i:10+i;
 positionAsset(cloud,getMotion('clouds',i));clouds.push(cloud)
});
let cloudsArrived=false,skipIntro=false,rafPending=false;
const introDelay=clouds.length?2300:200;
let introTimer;
function revealInvite(){
 sky.classList.add('invite-flying');
 $('skip').hidden=true;
}
function initIntro(){
 if(reduceMotion){skipClouds();return}
 requestAnimationFrame(()=>sky.classList.add('clouds-entering'));
 introTimer=setTimeout(()=>{cloudsArrived=true;revealInvite();scheduleReveal()},introDelay);
}
function skipClouds(){skipIntro=true;cloudsArrived=true;clearTimeout(introTimer);sky.classList.add('invite-flying','intro-skipped');$('skip').hidden=true;scheduleReveal()}
$('skip').addEventListener('click',skipClouds);
function applyMotion(el,m,p,kind){
 if(!m)return false;
 const entryAt=Number(m.enterAt??0), exitAt=Number(m.exitAt??1), duration=Math.max(.02,Number(m.duration??.22));
 const enter=smooth((p-entryAt)/duration);
 const exit=smooth((p-(exitAt-duration))/duration);
 const x=Number(m.enterX||0)*(1-enter)+Number(m.exitX||0)*exit;
 const y=Number(m.enterY||0)*(1-enter)+Number(m.exitY||0)*exit;
 const parallax=kind==='invite'?0:Number(m.parallax||0)*(p-.5);
 el.style.transform=`translate3d(calc(-50% + ${x}vw), calc(-50% + ${y+parallax}vh),0)`;
 el.style.opacity=String(Number(m.opacity??100)/100*enter*(1-exit));
 return true;
}
function updateReveal(){
 rafPending=false;
 const hero=$('hero');
 const range=Math.max(1,hero.offsetHeight-window.innerHeight);
 const progress=clamp(window.scrollY/range);
 const exit=reduceMotion||skipIntro?1:smooth((progress-.10)/.70);
 const planetIn=reduceMotion?1:smooth((progress-.25)/.58);
 cloudLayer.classList.toggle('finished',exit>.995 && !clouds.some((_,i)=>getMotion('clouds',i)));
 if(cloudsArrived&&!skipIntro){
  cloudLayer.classList.add('scrubbing');
  const width=window.innerWidth,height=window.innerHeight;
  clouds.forEach((c,i)=>{
   const m=getMotion('clouds',i);
   if(m){
    // Cloud entrance occurs first in the CSS intro; motion controls the scroll exit.
    const to=smooth((progress-(m.enterAt||0))/Math.max(.1,(m.exitAt||.9)-(m.enterAt||0)));
    const x=Number(m.exitX||0)*to;
    const y=Number(m.exitY||0)*to+(Number(m.parallax||0)*progress);
    c.style.transform=`translate3d(${x}vw,${y}vh,0)`;
    c.style.opacity=String((m.opacity??100)/100*(1-to));
   }else{
    const role=c.dataset.role;
    const offset=Math.floor(i/3)*.08;
    const travel=(role==='left'?-1:role==='right'?1:(i%2?1:-1));
    c.style.transform=`translate3d(${travel*width*exit*(1.03+offset)}px,${-height*.13*exit}px,0)`;
    c.style.opacity=String(1-smooth((exit-.22)/.78));
   }
  });
 }
 planets.forEach((el,i)=>{if(!applyMotion(el,getMotion('planets',i),progress,'planets')){
   el.style.opacity=String(planetIn*.88);el.style.transform=`translate3d(0,${(1-planetIn)*(35+i*6)-progress*10}px,0)`;
 }});
 ornaments.forEach((el,i)=>{if(!applyMotion(el,getMotion('ornaments',i),progress,'ornaments')){
   el.style.opacity=String(planetIn*.8);el.style.transform=`translate3d(0,${(1-planetIn)*26-progress*8}px,0)`;
 }});
 constellations.forEach((el,i)=>{if(!applyMotion(el,getMotion('constellations',i),progress,'constellations')){
   el.style.opacity=String(.42+.5*planetIn);el.style.transform=`translate3d(0,${-progress*12}px,0)`;
 }});
 $('scrollToRsvp').style.opacity=String((sky.classList.contains('invite-flying')?1:0)*(1-smooth((progress-.55)/.35)));
}
function scheduleReveal(){if(!rafPending){rafPending=true;requestAnimationFrame(updateReveal)}}
window.addEventListener('scroll',scheduleReveal,{passive:true});
window.addEventListener('resize',scheduleReveal,{passive:true});
$('scrollToRsvp').addEventListener('click',()=>{$('rsvp').scrollIntoView({behavior:reduceMotion?'instant':'smooth',block:'start'})});
const inviteMotion=getMotion('invite',0);
if(inviteMotion){
 const card=document.querySelector('.hero-card');
 card.classList.add('custom-invite-motion');
 card.style.left=inviteMotion.x+'%';card.style.top=inviteMotion.y+'%';
 card.style.width=`min(${inviteMotion.size}vw, calc(85svh * 5 / 7))`;
 card.style.setProperty('--invite-in-x',(inviteMotion.enterX||0)+'vw');
 card.style.setProperty('--invite-in-y',(inviteMotion.enterY??130)+'vh');
 card.style.setProperty('--invite-end-x',String(inviteMotion.exitX||0)+'vw');
 card.style.setProperty('--invite-end-y',String(inviteMotion.exitY||0)+'vh');
}
if(art.invite){$('finalInvite').src=art.invite;$('finalInvite').hidden=false;$('placeholder').hidden=true}
else{$('finalInvite').hidden=true;$('placeholder').hidden=false}
$('finalInvite').addEventListener('error',()=>{$('finalInvite').hidden=true;$('placeholder').hidden=false});
initIntro();scheduleReveal();
async function api(path,opts={}){if(!config.apiBase)throw Error('RSVP backend not configured. See README.md.');const r=await fetch(config.apiBase.replace(/\/$/,'')+path,{...opts,headers:{'Content-Type':'application/json',...(opts.headers||{})}});const data=await r.json().catch(()=>({}));if(!r.ok)throw Error(data.error||`Request failed (${r.status})`);return data}
const demoDishes=['Star shaped puff pastry bites','Nebula blueberry mocktails','Moon cheese and crackers'];
async function loadDishes(){const status=$('dishBoardStatus'),list=$('dishList'),refresh=$('refreshDishes');list.replaceChildren();refresh.disabled=true;status.hidden=false;status.textContent='Checking the celestial menu...';try{const dishes=demo?demoDishes:(await api('/dishes/'+encodeURIComponent(inviteToken))).dishes;if(!Array.isArray(dishes))throw Error('Unexpected response');status.textContent=dishes.length?(demo?'Sample dishes for preview only':'Already claimed by other guests'):'No dishes claimed yet. Be the first!';for(const dish of dishes){const li=document.createElement('li');li.textContent=dish;list.append(li)}}catch(err){status.textContent='Could not load the menu. Try refreshing.'}finally{refresh.disabled=false}}
$('refreshDishes').addEventListener('click',loadDishes);
async function begin(){if(demo){$('guestGreeting').textContent='Let us know if you’ll be joining us';$('rsvpMessage').textContent='Demo mode: responses are not saved.';await loadDishes();return}if(!inviteToken){$('guestGreeting').textContent='Open your personal invitation link to respond';$('rsvpForm').querySelector('button[type=submit]').disabled=true;return}try{const data=await api('/invite/'+encodeURIComponent(inviteToken));$('guestGreeting').textContent=`${data.name}, will you join us?`;if(data.rsvp){const radio=document.querySelector(`input[name=status][value="${data.rsvp.status}"]`);if(radio)radio.checked=true;$('partySize').value=data.rsvp.party_size||1;$('dish').value=data.rsvp.dish||'';$('note').value=data.rsvp.note||''}await loadDishes()}catch(e){$('guestGreeting').textContent='Invitation unavailable';$('rsvpMessage').textContent=e.message;$('rsvpForm').querySelector('button[type=submit]').disabled=true}}
$('rsvpForm').addEventListener('submit',async e=>{e.preventDefault();const status=new FormData(e.target).get('status');const msg=$('rsvpMessage');if(!status)return;const payload={status,party_size:status==='yes'?Number($('partySize').value):0,dish:$('dish').value.trim(),note:$('note').value.trim()};if(demo){msg.textContent='Demo RSVP received on screen only. Nothing saved.';return}const button=e.target.querySelector('button[type=submit]');button.disabled=true;msg.textContent='Sending...';try{await api('/rsvp/'+encodeURIComponent(inviteToken),{method:'POST',body:JSON.stringify(payload)});
showRsvpConfirmation(payload);
await loadDishes()}catch(err){msg.textContent=err.message}finally{button.disabled=false}});
begin();
