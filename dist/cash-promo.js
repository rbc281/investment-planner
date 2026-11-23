'use strict';
const cashOfferEnds=Date.parse('2026-12-01T00:00:00-08:00');
const cashOfferAvailable=()=>Date.now()<cashOfferEnds;
const cashShell=$('cashPromoShell'),cashArrow=$('cashTermArrow');
const cashCard=cashShell.querySelector('.card'),cashContent=cashCard.querySelector('.cash-content');
let cashAnimating=false,cashPointer=null,cashStartX=0,cashStartY=0,cashDrag=0,cashSuppressClickUntil=0;
function syncCashTile(){
 if(![12,24].includes(state.cashTerm))state.cashTerm=12;
 if(state.cashTerm===24&&!cashOfferAvailable()&&!state.cash24Accepted)state.cashTerm=12;
 if(state.cashTerm===24&&state.tileStages.promo===2)state.cash24Accepted=true;
 const extended=state.cashTerm===24;
 cashShell.classList.toggle('is-24',extended);
 $('cashTerm').textContent='No payments for '+state.cashTerm+' months';
 cashArrow.hidden=state.tileStages.promo===0||(!cashOfferAvailable()&&!extended);
 cashArrow.setAttribute('aria-label',extended?'Show 12-month Same as Cash':'Show 24-month Same as Cash');
 cashArrow.setAttribute('aria-controls','details-promo');
 persist();
}
async function switchCashTerm(term){
 if(cashAnimating||state.tileStages.promo===0||term===state.cashTerm)return;
 if(term===24&&!cashOfferAvailable()){syncCashTile();return}
 cashAnimating=true;cashShell.classList.add('switching');
 const outgoing=cashContent.cloneNode(true);
 outgoing.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
 outgoing.setAttribute('aria-hidden','true');outgoing.inert=true;
 outgoing.querySelector('.cash-special').style.visibility=state.cashTerm===24?'visible':'hidden';
 const height=cashContent.getBoundingClientRect().height;
 outgoing.classList.add('cash-outgoing');outgoing.style.width=cashContent.getBoundingClientRect().width+'px';
 outgoing.style.left=cashContent.offsetLeft+'px';outgoing.style.top=cashContent.offsetTop+'px';
 cashCard.append(outgoing);
 const direction=term===24?-1:1,start=cashDrag;
 cashContent.style.transform='';
 state.cashTerm=term;state.cash24Accepted=false;
 if(state.plan==='promo'){state.plan=null;state.tileStages.promo=1;cashCard.classList.remove('selected');cashCard.setAttribute('aria-pressed','false')}
 syncCashTile();
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 try{
  const options={duration:reduced?0:280,easing:'cubic-bezier(.2,.7,.2,1)'};
  await Promise.all([
   outgoing.animate([{transform:'translateY('+start+'px)'},{transform:'translateY('+(direction*(height+24))+'px)'}],options).finished,
   cashContent.animate([{transform:'translateY('+(-direction*(height+24))+'px)'},{transform:'translateY(0)'}],options).finished
  ]);
 }finally{outgoing.remove();cashAnimating=false;cashDrag=0;cashShell.classList.remove('switching')}
}
cashArrow.onclick=()=>void switchCashTerm(state.cashTerm===24?12:24);
cashCard.addEventListener('click',event=>{
 if(cashAnimating||Date.now()<cashSuppressClickUntil){event.preventDefault();event.stopImmediatePropagation()}
},true);
cashCard.addEventListener('pointerdown',event=>{
 if(cashAnimating||state.tileStages.promo===0||event.button!==0)return;
 cashPointer=event.pointerId;cashStartX=event.clientX;cashStartY=event.clientY;cashDrag=0;
});
cashCard.addEventListener('pointermove',event=>{
 if(event.pointerId!==cashPointer)return;
 const y=event.clientY-cashStartY,x=event.clientX-cashStartX;
 if(Math.abs(y)<10||Math.abs(x)>Math.abs(y))return;
 if((state.cashTerm===12&&(y>0||!cashOfferAvailable()))||(state.cashTerm===24&&y<0))return;
 event.preventDefault();cashCard.setPointerCapture(event.pointerId);
 cashDrag=Math.max(-90,Math.min(90,y));cashContent.style.transform='translateY('+cashDrag+'px)';
});
function finishCashSwipe(event){
 if(event.pointerId!==cashPointer)return;
 cashPointer=null;
 if(cashCard.hasPointerCapture(event.pointerId))cashCard.releasePointerCapture(event.pointerId);
 const moved=Math.abs(cashDrag);
 if(moved>10)cashSuppressClickUntil=Date.now()+500;
 if(event.type==='pointerup'&&moved>=40)void switchCashTerm(state.cashTerm===24?12:24);
 else{cashContent.style.transform='';cashDrag=0}
}
cashCard.addEventListener('pointerup',finishCashSwipe);
cashCard.addEventListener('pointercancel',finishCashSwipe);
function checkCashExpiry(){syncCashTile();if(cashOfferAvailable())setTimeout(checkCashExpiry,Math.min(cashOfferEnds-Date.now(),2147483647))}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncCashTile()});
checkCashExpiry();
