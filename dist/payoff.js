'use strict';
const PAYOFF_TERM_MONTHS=180;
// Derive the monthly rate from the fixed starting payment and 180-month term.
// Extra-payment scenarios use this same rate; annual extras follow payment 12, 24, etc.
function impliedMonthlyRate(principal,payment){
  if(principal===0)return 0;
  if(payment<=0||payment*PAYOFF_TERM_MONTHS<principal)return null;
  if(payment*PAYOFF_TERM_MONTHS===principal)return 0;
  let low=0,high=payment/principal;
  for(let i=0;i<120;i++){
    const r=(low+high)/2;
    const scheduled=principal*r/-Math.expm1(-PAYOFF_TERM_MONTHS*Math.log1p(r));
    if(scheduled>payment)high=r;else low=r;
  }
  return (low+high)/2;
}
function simulatePayoff(principal,payment,extraMonthly=0,extraAnnual=0){
  const inputs=[principal,payment,extraMonthly,extraAnnual];
  if(!inputs.every(Number.isSafeInteger)||inputs.some(n=>n<0))throw new RangeError('Invalid payment amount');
  if(principal===0)return {months:0,interest:0,paid:0};
  const rate=impliedMonthlyRate(principal,payment);
  if(rate===null)return {months:null,interest:null,paid:null};
  if(extraMonthly===0&&extraAnnual===0){
    const paid=payment*PAYOFF_TERM_MONTHS;
    return {months:PAYOFF_TERM_MONTHS,interest:paid-principal,paid};
  }
  // Carry full precision between months; round only the final totals to cents.
  let balance=principal,paid=0;
  for(let month=1;month<=PAYOFF_TERM_MONTHS;month++){
    balance+=balance*rate;
    const regular=Math.min(balance,payment+extraMonthly);balance-=regular;paid+=regular;
    if(month%12===0){const annual=Math.min(balance,extraAnnual);balance-=annual;paid+=annual}
    if(balance<0.000001||month===PAYOFF_TERM_MONTHS){
      paid=Math.round(paid+Math.max(0,balance));
      return {months:month,interest:Math.max(0,paid-principal),paid};
    }
  }
}
if(typeof module!=='undefined'&&module.exports)module.exports={simulatePayoff,impliedMonthlyRate,PAYOFF_TERM_MONTHS};
