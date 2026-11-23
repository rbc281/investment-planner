'use strict';
(()=>{
 const version='cash24-20261123';
 if(location.protocol==='file:')return;
 const dialog=document.createElement('dialog');
 dialog.setAttribute('aria-labelledby','updateTitle');
 dialog.innerHTML='<h2 id="updateTitle">An update is ready</h2><p>Refresh to continue.</p><button type="button" class="solid">Refresh</button>';
 dialog.addEventListener('cancel',event=>event.preventDefault());
 document.body.append(dialog);
 let busy=false,pending=false;
 function showUpdate(){
  if(!pending||dialog.open||document.hidden)return;
  if(document.querySelector('#signatureDialog[open]'))return;
  dialog.showModal();
 }
 dialog.querySelector('button').onclick=()=>{
  const drafts={};
  for(const input of document.querySelectorAll('#setup input,#deposit,#customRows input,#promotionRows input'))drafts[input.id]=input.value;
  try{sessionStorage.setItem('planner-refresh-drafts',JSON.stringify(drafts))}catch{}
  location.reload();
 };
 try{
  const drafts=JSON.parse(sessionStorage.getItem('planner-refresh-drafts'));
  if(drafts)for(const [id,value] of Object.entries(drafts)){const input=document.getElementById(id);if(input)input.value=value}
  sessionStorage.removeItem('planner-refresh-drafts');
 }catch{}
 async function check(){
  if(busy||document.hidden||!navigator.onLine)return;
  busy=true;
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),10000);
  try{
   const response=await fetch('version.json?t='+Date.now(),{cache:'no-store',signal:controller.signal});
   if(response.ok){const latest=await response.json();pending=latest.version!==version;showUpdate()}
  }catch{}finally{clearTimeout(timeout);busy=false}
 }
 document.getElementById('signatureDialog').addEventListener('close',showUpdate);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)void check()});
 window.addEventListener('pageshow',()=>void check());
 window.addEventListener('online',()=>void check());
 setInterval(()=>void check(),60000);
 void check();
})();
