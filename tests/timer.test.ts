import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Training} from '../src/timer.ts';
test('three second countdown and exact sixty second finish',()=>{const t=new Training();t.start('minute',100);t.tick(3099);assert.equal(t.phase,'countdown');t.tick(3100);assert.equal(t.phase,'running');assert.equal(t.elapsed,0);assert.equal(t.tick(63100),true);assert.equal(t.elapsed,60000);assert.equal(t.phase,'finished');});
test('pause excludes rest and free mode does not auto end',()=>{const t=new Training();t.start('free',0);t.tick(3000);t.pause(8000);t.tick(100000);assert.equal(t.elapsed,5000);t.resume(100000);t.tick(170000);assert.equal(t.elapsed,75000);assert.equal(t.phase,'running');});
test('manual correction cannot become negative',()=>{const t=new Training();t.correct(-1);assert.equal(t.count,0);t.correct(1);assert.equal(t.count,1);});
