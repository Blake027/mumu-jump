import {test} from 'node:test';
import assert from 'node:assert/strict';
import {loadRecords,saveRecord} from '../src/storage.ts';
let raw:string|null=null;
Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:()=>raw,setItem:(_key:string,value:string)=>{raw=value;}}});
test('records persist with all training fields and newest first',()=>{raw=null;const r={id:'one',date:'2026-10-17T12:00:00Z',mode:'minute' as const,count:100,duration:60,rpm:100};saveRecord(r);saveRecord({...r,id:'two'});assert.deepEqual(loadRecords().map(r=>r.id),['two','one']);assert.equal(loadRecords()[0].rpm,100);});
test('damaged storage and invalid rows recover safely',()=>{raw='bad json';assert.deepEqual(loadRecords(),[]);raw='[{"id":"broken","count":-1}]';assert.deepEqual(loadRecords(),[]);});
