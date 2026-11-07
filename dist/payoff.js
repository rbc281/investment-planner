'use strict';
// Fixed starting payment; monthly interest accrues before payment. Annual extras
// are applied after the regular payment every twelfth month. All amounts in cents.
function simulatePayoff(principal, payment, extraMonthly=0, extraAnnual=0){
  if(![principal,payment,extraMonthly,extraAnnual].every(Number.isSafeInteger)||[principal,payment,extraMonthly,extraAnnual].some(n=>n<0))throw new RangeError('Invalid payment amount');
  if(principal===0)return {months:0,interest:0,paid:0};
  const monthlyRate=0.129/12;
  let balance=principal,interest=0,paid=0;
  for(let month=1;month<=1200;month++){
    const charge=Math.round(balance*monthlyRate);interest+=charge;balance+=charge;
    const regular=Math.min(balance,payment+extraMonthly);balance-=regular;paid+=regular;
    if(month%12===0){const annual=Math.min(balance,extraAnnual);balance-=annual;paid+=annual}
    if(balance===0)return {months:month,interest,paid};
  }
  return {months:null,interest:null,paid:null};
}
if(typeof module!=='undefined'&&module.exports)module.exports={simulatePayoff};
