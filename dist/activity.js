'use strict';
// Only shortened customer labels are stored locally or sent to the shared log.
const Activity=(()=>{
 const queuePrefix='planner-event-v1:';
 let busy=false, volatile=new Map(), lastError='';
 const shorten=name=>{const p=String(name).trim().split(/\s+/);return p[0]+(p.length>1?' '+Array.from(p[p.length-1])[0]+'.':'')};
 const uid=()=>{if(crypto.randomUUID)return crypto.randomUUID();const bytes=crypto.getRandomValues(new Uint8Array(16));bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;const h=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');return h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20)};
 function pending(){const all=new Map(volatile);try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k?.startsWith(queuePrefix)){try{const e=JSON.parse(localStorage.getItem(k));all.set(e.id,e)}catch{}}}}catch{}return [...all.values()].sort((a,b)=>a.occurred_at.localeCompare(b.occurred_at))}
 function status(){const el=document.getElementById('syncStatus');if(!el)return;const count=pending().length;el.textContent=count?count+' activit'+(count===1?'y':'ies')+' pending sync':'Activity synced';el.title=lastError||'Activity syncs automatically when connected';el.classList.toggle('pending',count>0)}
 function add(event){const e={...event,id:uid(),occurred_at:new Date().toISOString(),customer_label:shorten(event.customer_label)};volatile.set(e.id,e);try{localStorage.setItem(queuePrefix+e.id,JSON.stringify(e))}catch{lastError='Browser storage unavailable; keep this page open until activity syncs.'}status();void flush();return e}
 async function request(query,options={}){const cfg=window.PLANNER_CONFIG;const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);try{const response=await fetch(cfg.url+'/rest/v1/planner_events'+query,{...options,signal:controller.signal,headers:{apikey:cfg.key,'Content-Type':'application/json',...options.headers}});if(!response.ok)throw new Error('Activity service unavailable ('+response.status+').');const text=await response.text();return text?JSON.parse(text):null}finally{clearTimeout(timeout)}}
 async function flush(){if(busy||!navigator.onLine)return;busy=true;try{for(const e of pending()){await request('?on_conflict=id',{method:'POST',headers:{Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify(e)});volatile.delete(e.id);try{localStorage.removeItem(queuePrefix+e.id)}catch{}}lastError=''}catch(e){lastError=e.message}finally{busy=false;status()}}
 addEventListener('online',()=>void flush());addEventListener('storage',status);setInterval(()=>void flush(),5000);
 return {shorten,uid,add,flush,pending,request,status};
})();
