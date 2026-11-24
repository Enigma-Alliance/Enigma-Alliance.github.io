"use strict";
const $=id=>document.getElementById(id);
const base=(window.CELESTIAL_CONFIG?.apiBase||'');
const storageKey='celestial.affair.admin.v1';
let saved={};try{saved=JSON.parse(localStorage.getItem(storageKey)||'{}')}catch{}
$('endpoint').value=saved.endpoint||base;
$('secret').value=saved.secret||sessionStorage.getItem('celestial.admin.session')||'';
$('rememberAccess').checked=Boolean(saved.secret);
function rememberAccess(){const endpoint=$('endpoint').value.trim(),secret=$('secret').value;if(secret)sessionStorage.setItem('celestial.admin.session',secret);
 if($('rememberAccess').checked){localStorage.setItem(storageKey,JSON.stringify({endpoint,secret}))}else localStorage.removeItem(storageKey)}
$('rememberAccess').addEventListener('change',rememberAccess);
$('forgetAccess').onclick=()=>{localStorage.removeItem(storageKey);sessionStorage.removeItem('celestial.admin.session');$('rememberAccess').checked=false;$('secret').value='';status('Saved access cleared.');};

const inviteBase=new URL('index.html',location.href).href;
let guests=[],previewRows=[],selected=new Set();
function status(msg,err=false,id='message'){const e=$(id);e.textContent=msg;e.classList.toggle('error',err)}
async function request(path,method='GET',data){const url=$('endpoint').value.trim().replace(/\/$/,'');const secret=$('secret').value;
 if(!url||!secret)throw Error('Enter your Worker URL and ADMIN_TOKEN');
 const response=await fetch(url+path,{method,headers:{'Content-Type':'application/json','Authorization':'Bearer '+secret},body:data?JSON.stringify(data):undefined});
 const result=await response.json().catch(()=>({}));if(response.ok)rememberAccess();if(!response.ok)throw Error(result.error||`HTTP ${response.status}`);return result;
}
function textEl(tag,text){const e=document.createElement(tag);e.textContent=text;return e}
function makeButton(label,handler){const e=textEl('button',label);e.type='button';e.onclick=handler;return e}
function updateSelection(){const chosen=guests.filter(g=>selected.has(g.id));$('selectedCount').textContent=`${chosen.length} selected`;const enabled=guests.filter(g=>!g.revoked&&!g.link_moved);$('selectAll').checked=enabled.length>0&&enabled.every(g=>selected.has(g.id));}
function personalLink(g){return inviteBase+'?invite='+encodeURIComponent(g.token)}
function normalizedEmail(v){return String(v||'').trim().toLowerCase()}
function normalizedPhone(v){const d=String(v||'').replace(/\D/g,'');return d.length===10?'1'+d:d}
function getDuplicates(list){
 const byEmail=new Map(),byPhone=new Map(),flags=new Map();
 for(const g of list){
  const email=normalizedEmail(g.email), phone=normalizedPhone(g.phone);
  if(email){if(!byEmail.has(email))byEmail.set(email,[]);byEmail.get(email).push(g)}
  if(phone){if(!byPhone.has(phone))byPhone.set(phone,[]);byPhone.get(phone).push(g)}
 }
 for(const g of list){
  const matched=new Map();
  const email=normalizedEmail(g.email),phone=normalizedPhone(g.phone);
  if(email)for(const other of byEmail.get(email)||[])if(other.id!==g.id)matched.set(other.id,{name:other.name,reason:'email'});
  if(phone)for(const other of byPhone.get(phone)||[])if(other.id!==g.id){const existing=matched.get(other.id);matched.set(other.id,{name:other.name,reason:existing?'email and phone':'phone'})}
  if(matched.size)flags.set(g.id,[...matched.values()]);
 }
 return flags;
}
/* Email/SMS draft links cannot tell whether the person actually pressed Send.
   Ask on return to the dashboard before recording a manual send. */
const pendingDraftKey='celestial.affair.pendingDraft.v1';
let draftPromptBusy=false;
async function confirmReturnedDraft(){
 if(draftPromptBusy||document.visibilityState==='hidden'||!$('secret').value)return;
 const raw=sessionStorage.getItem(pendingDraftKey);if(!raw)return;
 let pending;try{pending=JSON.parse(raw)}catch{sessionStorage.removeItem(pendingDraftKey);return}
 // Allow navigation into the mail / messaging app before showing the question.
 if(Date.now()-pending.started<900)return;
 draftPromptBusy=true;sessionStorage.removeItem(pendingDraftKey);
 try{
  const yes=confirm(`Did you actually send the ${pending.kind==='email'?'email':'text message'} invitation to ${pending.name}?\n\nSelect OK only if you pressed Send in your mail or messaging app. Opening a draft alone does not count.`);
  if(yes){await request('/admin/guests/'+pending.id+'/sent','POST');await load();status('Marked '+pending.name+' as sent after your confirmation.')}else status('Draft not marked sent.');
 }catch(e){status('Could not mark draft as sent: '+e.message,true)}
 finally{draftPromptBusy=false}
}
window.addEventListener('focus',()=>setTimeout(confirmReturnedDraft,250));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')setTimeout(confirmReturnedDraft,250)});

function compose(g,kind){
 const url=personalLink(g);
 const subject="You're invited to A Celestial Affair";
 const emailBody=`${g.name}! You're invited to A Celestial Affair!\n\nJoin us December 31 at 7 PM for an evening among the stars.\n\nYour personal invitation and RSVP:\n${url}\n\nCelestial cocktail attire encouraged.\n\nHope to see you there!`;
 const smsBody=`${g.name}! You're invited to A Celestial Affair on Dec 31 at 7 PM! Celestial cocktail attire encouraged. Your personal invitation and RSVP: ${url}`;
 sessionStorage.setItem(pendingDraftKey,JSON.stringify({id:g.id,name:g.name,kind,started:Date.now()}));
 if(kind==='email')location.href=`mailto:${g.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
 else location.href=`sms:${g.phone}?body=${encodeURIComponent(smsBody)}`;
}
function render(){const body=$('rows');body.replaceChildren();const duplicates=getDuplicates(guests);for(const g of guests){const tr=document.createElement('tr');const box=document.createElement('input');box.type='checkbox';box.checked=selected.has(g.id);box.disabled=Boolean(g.revoked||g.link_moved);box.setAttribute('aria-label','Select '+g.name);box.onchange=()=>{box.checked?selected.add(g.id):selected.delete(g.id);updateSelection()};let td=document.createElement('td');td.append(box);tr.append(td);
 td=document.createElement('td');td.append(textEl('strong',g.name));
 const duplicatesForGuest=duplicates.get(g.id);
 if(duplicatesForGuest){const flag=textEl('span','Possible duplicate');flag.className='duplicate-pill';flag.title='Matches another guest by email or phone';td.append(' ',flag)}
 td.append(document.createElement('br'),textEl('span',[g.email,g.phone].filter(Boolean).join(' · ')));
 if(duplicatesForGuest){const detail=textEl('div','Matches: '+duplicatesForGuest.map(x=>x.name+' ('+x.reason+')').join(', '));detail.className='duplicate-details';td.append(detail)}
 tr.append(td);
 td=textEl('td',g.link_moved?'Link moved':g.revoked?'Revoked':g.status||'Awaiting RSVP');if(g.party_size)td.append(' ('+g.party_size+')');tr.append(td);
 tr.append(textEl('td',String(g.visits||0)+(g.first_visit?' · '+g.first_visit:'')),textEl('td',[g.dish,g.note].filter(Boolean).join(' / ')));
 td=document.createElement('td');const a=textEl('a','Open invitation');a.href=personalLink(g);a.target='_blank';a.rel='noopener noreferrer';td.append(a);tr.append(td);
 td=document.createElement('td');td.append(makeButton('Copy link',async()=>{try{await navigator.clipboard.writeText(personalLink(g));status('Copied link for '+g.name)}catch{status('Clipboard unavailable. Open the link and copy it.',true)}}));
 if(g.email)td.append(makeButton('Email draft',()=>compose(g,'email')));if(g.phone)td.append(makeButton('Text draft',()=>compose(g,'sms')));
 if(!g.sent_at){td.append(makeButton('Confirm sent manually',async()=>{if(!confirm('Only mark '+g.name+' as sent if you actually delivered their invitation. Continue?'))return;try{await request('/admin/guests/'+g.id+'/sent','POST');await load()}catch(e){status(e.message,true)}}))}else td.append(textEl('span','Sent recorded '));
 if(!g.revoked)td.append(makeButton('Revoke',async()=>{if(!confirm('Disable the invitation link for '+g.name+'?'))return;try{await request('/admin/guests/'+g.id+'/revoke','POST');selected.delete(g.id);await load()}catch(e){status(e.message,true)}}));
 td.append(makeButton(g.link_moved?'Restore link':'Link moved',async()=>{
  if(!confirm(g.link_moved?`Restore the invitation link for ${g.name}?`:`Show a moved-link notice to ${g.name}? Their RSVP will remain stored.`))return;
  try{await request('/admin/guests/'+g.id+'/moved','POST',{moved:!g.link_moved});await load()}catch(e){status(e.message,true)}
 }));
 const remove=makeButton('Delete guest',async()=>{
  if(!confirm(`Permanently delete ${g.name} and their RSVP and delivery history? This cannot be undone.`))return;
  const answer=prompt(`Type DELETE to permanently remove ${g.name}`);if(answer!=='DELETE')return;
  try{await request('/admin/guests/'+g.id,'DELETE');selected.delete(g.id);await load()}catch(e){status(e.message,true)}
 });remove.classList.add('danger');td.append(remove);
 tr.append(td);[...tr.children].forEach((cell,i)=>cell.dataset.label=['Select','Guest','RSVP','Visits','Dish and note','Invitation','Actions'][i]);body.append(tr)
}updateSelection()}
async function load(){try{const out=await request('/admin/guests');guests=out.guests;selected=new Set([...selected].filter(id=>guests.some(g=>g.id===id&&!g.revoked)));render();const duplicates=getDuplicates(guests).size;status(`${guests.length} guests loaded · ${duplicates} possible duplicate records · ${guests.filter(g=>g.status==='yes').length} attending · ${guests.filter(g=>g.status==='maybe').length} maybe · ${guests.filter(g=>g.status==='no').length} declined`)}catch(e){status(e.message,true)}}
$('load').onclick=load;
$('create').onsubmit=async e=>{e.preventDefault();try{await request('/admin/guests','POST',{name:$('name').value,email:$('email').value,phone:$('phone').value});$('create').reset();await load()}catch(err){status(err.message,true)}};
function parseCsv(source){const table=[];let field='',row=[],quoted=false;source=source.replace(/^\uFEFF/,'');for(let i=0;i<source.length;i++){const c=source[i];if(quoted){if(c==='"'&&source[i+1]==='"'){field+='"';i++}else if(c==='"')quoted=false;else field+=c}else if(c==='"')quoted=true;else if(c===','){row.push(field);field=''}else if(c==='\n'||c==='\r'){if(c==='\r'&&source[i+1]==='\n')i++;row.push(field);if(row.some(v=>v.trim()))table.push(row);row=[];field=''}else field+=c}if(quoted)throw Error('CSV contains an unclosed quoted field');row.push(field);if(row.some(v=>v.trim()))table.push(row);return table}
function prepareCsv(content){const table=parseCsv(content);if(table.length<2)throw Error('CSV needs a header and at least one guest');const headers=table.shift().map(v=>v.toLowerCase().trim());const ni=headers.indexOf('name'),ei=headers.indexOf('email'),pi=headers.indexOf('phone');if(ni<0||(ei<0&&pi<0))throw Error('CSV needs name and email or phone headers');if(table.length>3000)throw Error('Maximum 3000 rows per file');
 return table.map((r,i)=>{const obj={line:i+2,name:(r[ni]||'').trim(),email:ei<0?'':(r[ei]||'').trim().toLowerCase(),phone:pi<0?'':(r[pi]||'').trim()};obj.valid=Boolean(obj.name&&(obj.email||obj.phone)&&(!obj.email||/^\S+@\S+\.\S+$/.test(obj.email))&&(!obj.phone||/^\+[1-9]\d{7,14}$/.test(obj.phone)));return obj})}
$('previewCsv').onclick=async()=>{try{const file=$('csv').files[0];if(!file)throw Error('Choose a CSV file first');previewRows=prepareCsv(await file.text());$('importCsv').disabled=!previewRows.some(r=>r.valid);let box=$('csvPreview');box.replaceChildren();const sample=previewRows.slice(0,15);const tbl=document.createElement('table');tbl.style.minWidth='620px';const head=document.createElement('tr');['Line','Name','Email','Phone','Validation'].forEach(n=>head.append(textEl('th',n)));tbl.append(head);for(const g of sample){const tr=document.createElement('tr');[g.line,g.name,g.email,g.phone,g.valid?'Ready':'Invalid'].forEach(v=>tr.append(textEl('td',String(v))));tbl.append(tr)}box.append(tbl);status(`${previewRows.length} rows, ${previewRows.filter(r=>r.valid).length} valid. Showing first 15. Nothing has been imported or sent.`,false,'csvStatus')}catch(e){previewRows=[];$('importCsv').disabled=true;status(e.message,true,'csvStatus')}};
$('importCsv').onclick=async()=>{const items=previewRows.filter(g=>g.valid);if(!items.length)return;if(!confirm(`Import ${items.length} valid guests? Existing matching contacts will be skipped. No invitations will be sent.`))return;
 $('importCsv').disabled=true;let created=0,duplicates=0,invalid=0;try{for(let i=0;i<items.length;i+=100){const out=await request('/admin/import','POST',{guests:items.slice(i,i+100).map(g=>({name:g.name,email:g.email,phone:g.phone}))});for(const r of out.results){if(r.status==='created')created++;else if(r.status==='duplicate')duplicates++;else invalid++}status(`Imported ${Math.min(i+100,items.length)} of ${items.length} rows...`,false,'csvStatus')}status(`Finished: ${created} created, ${duplicates} duplicates skipped, ${invalid} rejected. No messages sent.`,false,'csvStatus');await load()}catch(e){status(`Import interrupted after ${created} created: ${e.message}. Refresh guest list before retrying.`,true,'csvStatus')}finally{$('importCsv').disabled=false}};
$('selectAll').onchange=e=>{if(e.target.checked){guests.filter(g=>!g.revoked&&!g.link_moved).forEach(g=>selected.add(g.id))}else selected.clear();render()};
$('selectUnsent').onclick=()=>{selected=new Set(guests.filter(g=>!g.revoked&&!g.link_moved&&!g.sent_at).map(g=>g.id));render()};
$('clearSelection').onclick=()=>{selected.clear();render()};
$('sendSelected').onclick=async()=>{const channel=$('channel').value;const eligible=guests.filter(g=>selected.has(g.id)&&!g.revoked&&!g.link_moved&&(channel==='email'?g.email:g.phone));if(!eligible.length){status('Select guests who have a '+(channel==='email'?'valid email':'phone number'),true);return}
 const label=channel==='email'?'email':'SMS';if(!confirm(`Send ${label} invitations to ${eligible.length} selected guests?\n\nMessages are sent to real contacts and may incur provider charges. Each guest gets their personal link. Already delivered invitations through this channel will be skipped.`))return;
 const button=$('sendSelected');button.disabled=true;const report=$('deliveryResults');report.hidden=false;let lines=[];try{for(let i=0;i<eligible.length;i+=25){const batch=eligible.slice(i,i+25);const out=await request('/admin/send','POST',{channel,ids:batch.map(g=>g.id)});for(const r of out.results){const g=batch.find(g=>g.id===r.id);lines.push(`${g?.name||r.id}: ${r.status} · ${r.detail}`)}report.textContent=lines.join('\n')+`\n\nProcessed ${Math.min(i+25,eligible.length)} of ${eligible.length}`;}await load()}catch(e){report.textContent=lines.join('\n')+`\n\nError: ${e.message}. Refresh guests before attempting a retry.`}finally{button.disabled=false}};


/* v7.4: mobile contacts importer and personalized SMS sending */
const pickedContacts=[];
const pickerSupported=Boolean(window.isSecureContext && navigator.contacts && typeof navigator.contacts.select==='function');
const contactInfo=$('contactsSupport');
const isPhone=window.matchMedia('(max-width: 740px), (pointer: coarse)').matches || /Android|iPhone|iPad/i.test(navigator.userAgent);
$('pickContacts').hidden=!isPhone || !pickerSupported;
contactInfo.textContent=pickerSupported && isPhone
 ? 'Your phone may ask permission to choose contacts. Only the contacts you select are read.'
 : 'Your browser does not support selecting phone contacts directly. Use Add contact manually or import a CSV instead. Chrome on Android offers the best support.';
function normalizeContactPhone(value){
 const original=String(value||'').trim();
 const digits=original.replace(/\D/g,'');
 if(original.startsWith('+') && /^[1-9]\d{7,14}$/.test(digits))return '+'+digits;
 if(digits.length===10)return '+1'+digits;
 if(digits.length===11 && digits.startsWith('1'))return '+'+digits;
 return original;
}
function renderContacts(){
 const parent=$('contactsStaging');parent.replaceChildren();
 pickedContacts.forEach((entry,index)=>{
  const wrap=document.createElement('div');wrap.className='contact-entry';
  for(const [field,label] of [['name','Contact name'],['phone','Mobile number']]){
   const lbl=document.createElement('label');lbl.textContent=label;
   const inp=document.createElement('input');inp.value=entry[field]||'';
   inp.placeholder=field==='phone'?'+13145551234':'Name';
   inp.setAttribute('aria-label',label+' '+(index+1));
   inp.oninput=()=>{entry[field]=inp.value;updateContactsStatus()};
   lbl.append(inp);wrap.append(lbl);
  }
  const remove=makeButton('Remove',()=>{pickedContacts.splice(index,1);renderContacts()});remove.classList.add('secondary');wrap.append(remove);parent.append(wrap);
 });
 updateContactsStatus();
}
function updateContactsStatus(){
 const valid=pickedContacts.filter(g=>g.name.trim() && /^\+[1-9]\d{7,14}$/.test(normalizeContactPhone(g.phone)));
 $('sendContacts').disabled=!valid.length;
 $('sendContacts').textContent=valid.length?`Create links and send texts (${valid.length})`:'Create links and send texts';
}
$('pickContacts').onclick=async()=>{
 try{
  const fields=await navigator.contacts.getProperties();
  if(!fields.includes('name')||!fields.includes('tel'))throw Error('Your browser cannot access names and numbers. Use manual entry instead.');
  const results=await navigator.contacts.select(['name','tel'],{multiple:true});
  for(const c of results){
   const name=(Array.isArray(c.name)?c.name[0]:c.name)||'';
   const nums=Array.isArray(c.tel)?c.tel:[];
   if(!name||!nums.length)continue;
   for(const number of nums){
    const phone=normalizeContactPhone(number);
    if(pickedContacts.some(g=>normalizeContactPhone(g.phone)===phone))continue;
    pickedContacts.push({name:String(name),phone});
   }
  }
  renderContacts();
 }catch(e){contactInfo.textContent='Contact selection unavailable or cancelled: '+(e.message||'Try manual entry.');}
};
$('addManualContact').onclick=()=>{pickedContacts.push({name:'',phone:''});renderContacts();$('contactsStaging').lastElementChild?.querySelector('input')?.focus()};
$('clearContacts').onclick=()=>{pickedContacts.length=0;renderContacts();$('contactsReport').hidden=true};
function prepareContactRows(){
 const valid=pickedContacts.map(g=>({name:g.name.trim(),phone:normalizeContactPhone(g.phone)}));
 const seen=new Set();
 for(const g of valid){
  if(!g.name || !/^\+[1-9]\d{7,14}$/.test(g.phone))throw Error('Check every contact name and phone number. Use a country code such as +1.');
  if(seen.has(g.phone))throw Error('The selected contacts include duplicate phone numbers. Remove duplicates before sending.');
  seen.add(g.phone);
 }
 return valid;
}
$('sendContacts').onclick=async()=>{
 const report=$('contactsReport');report.hidden=false;
 let items=[];
 try{items=prepareContactRows()}catch(e){report.textContent=e.message;return}
 if(!items.length)return;
 if(!confirm(`Create or reuse invitation links for ${items.length} contact(s) and attempt to send SMS?\n\nSMS is sent only if Twilio is configured in Cloudflare. Carrier charges may apply. Only continue for contacts who agreed to receive invitations.`))return;
 const button=$('sendContacts');button.disabled=true;
 let log=[];let created=0;
 try{
  // Import contacts without overwriting existing guests or creating new tokens for duplicates.
  for(let i=0;i<items.length;i+=100){
   const batch=items.slice(i,i+100);
   const result=await request('/admin/import','POST',{guests:batch.map(g=>({...g,email:''}))});
   for(const entry of result.results){log.push(`${entry.name}: ${entry.status}`);if(entry.status==='created')created++}
  }
  await load();
  // Refresh IDs and personalized links from the server, not from guessed data.
  const toSend=[];
  for(const item of items){
   const guest=guests.find(g=>normalizeContactPhone(g.phone)===item.phone && !g.revoked && !g.link_moved);
   if(guest && !toSend.some(g=>g.id===guest.id))toSend.push(guest);
   else if(!guest)log.push(`${item.name}: no active invitation was found; skipped`);
  }
  if(!toSend.length){report.textContent=log.join('\n');return}
  if(!confirm(`Guest list updated (${created} new). Send personalized texts to ${toSend.length} contact(s) now?`)){
   log.push('Sending cancelled. All created invitations remain in the guest list.');
  }else{
   for(let i=0;i<toSend.length;i+=25){
    const batch=toSend.slice(i,i+25);
    const result=await request('/admin/send','POST',{channel:'sms',ids:batch.map(g=>g.id)});
    for(const r of result.results){
     const guest=batch.find(g=>g.id===r.id);
     log.push(`${guest?.name||r.id}: ${r.status} (${r.detail})`);
     if(r.status==='failed')log.push(`  Manual alternative: use the Text draft button in the guest list for ${guest?.name||r.id}.`);
    }
   }
  }
  await load();
  report.textContent=log.join('\n')+'\n\nGuest list updated. Personal links can be copied or opened from each guest row.';
  report.scrollIntoView({behavior:'smooth',block:'nearest'});
 }catch(e){report.textContent=log.join('\n')+'\nError: '+e.message+'\nRefresh the guest list before retrying.'}
 finally{button.disabled=false;updateContactsStatus()}
};
renderContacts();
