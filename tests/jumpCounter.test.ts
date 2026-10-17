import {test} from 'node:test';
import assert from 'node:assert/strict';
import {JumpCounter} from '../src/jumpCounter.ts';
test('counts complete jumps once at 30 and 60 fps',()=>{
 for(const dt of [16.67,33.33]){const c=new JumpCounter();let n=0;for(let t=0;t<5000;t+=dt){const phase=(t-1100)%500;const displacement=t<1100?0:.055*Math.sin(Math.PI*Math.min(phase,300)/300);if(c.update(.5-displacement,.24,t))n++;}assert.equal(n,8);}
});
test('standing jitter and gradual drift never count',()=>{const c=new JumpCounter();let n=0;for(let t=0;t<10000;t+=33){if(c.update(.5+Math.sin(t)*.002+t*.000002,.25,t))n++;}assert.equal(n,0);});
test('incomplete takeoff and tracking gaps do not count',()=>{const c=new JumpCounter();let n=0;for(let t=0;t<1200;t+=33)if(c.update(t<800?.5:.44,.24,t))n++;if(c.update(.5,.24,2000))n++;assert.equal(n,0);});
test('reset clears an airborne cycle',()=>{const c=new JumpCounter();for(let t=0;t<1400;t+=33)c.update(t<1000?.5:.44,.24,t);c.reset();assert.equal(c.update(.5,.24,1500),false);});
