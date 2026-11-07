const assert=require('assert');const {simulatePayoff:s}=require('./dist/payoff.js');
const base=s(3000000,39000),extra=s(3000000,39000,10000,200000);
assert.equal(base.paid,3000000+base.interest);assert.equal(extra.paid,3000000+extra.interest);
assert(extra.months<base.months);assert(extra.interest<base.interest);
// Independent closed-form amortization estimate agrees within monthly rounding.
const expected=Math.ceil(-Math.log(1-3000000*(.129/12)/39000)/Math.log(1+.129/12));assert.equal(base.months,expected);
assert.deepEqual(s(0,0),{months:0,interest:0,paid:0});assert.deepEqual(s(10000,20000),{months:1,interest:108,paid:10108});
assert.deepEqual(s(10000,0,0,100000),{months:12,interest:1370,paid:11370});
assert.equal(s(10000,0).months,null);assert.throws(()=>s(NaN,100));
assert.deepEqual(s(3000000,39000,0,0),base);
console.log(JSON.stringify({base,extra}));console.log('Payoff math, annual timing, interest savings, final payment, zero balance and invalid input checks passed');
