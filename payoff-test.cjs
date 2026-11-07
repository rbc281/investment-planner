const assert=require('assert');const {simulatePayoff:s,impliedMonthlyRate:rate}=require('./dist/payoff.js');
for(const p of [1,100,12345,1000000,3000000,4000001,1000000000]){
 const payment=Math.ceil(p*13/100000)*100,base=s(p,payment);
 assert.equal(base.months,180);assert.equal(base.paid,payment*180);
 assert.equal(base.interest,base.paid-p);
 // Check the independently evaluated annuity equation.
 const r=rate(p,payment),pv=payment*(-Math.expm1(-180*Math.log1p(r)))/r;
 assert(Math.abs(pv-p)<Math.max(.001,p*1e-10));
}
const base=s(3000000,39000),monthly=s(3000000,39000,10000),annual=s(3000000,39000,0,200000),both=s(3000000,39000,10000,200000);
for(const result of [monthly,annual,both]){assert(result.months<180);assert(result.interest<base.interest);assert.equal(result.paid,3000000+result.interest)}
assert(both.months<=monthly.months&&both.months<=annual.months);
assert.deepEqual(s(0,0),{months:0,interest:0,paid:0});assert.equal(s(10000,0).months,null);assert.throws(()=>s(NaN,100));
const zeroInterest=s(18000,100,0,1000);assert.equal(zeroInterest.interest,0);assert.equal(zeroInterest.months,100);
assert.equal(s(3000000,39000,0,10000000).months,12);
const final=s(3000000,39000,10000000);assert.equal(final.months,1);assert(final.paid<10039000);
assert.deepEqual(s(3000000,39000,0,0),base);
console.log(JSON.stringify({base,monthly,annual,both}));console.log('180-month baselines, implied-rate equation, extras, final-payment cap and edge cases passed');
