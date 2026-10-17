import type { Mode } from './timer.ts';
export interface RecordEntry {id:string;date:string;mode:Mode;count:number;duration:number;rpm:number}
const KEY='mumu-records-v1';
export function loadRecords():RecordEntry[]{try{const data=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(data)?data.filter(r=>typeof r.id==='string'&&Number.isFinite(Date.parse(r.date))&&['minute','free'].includes(r.mode)&&Number.isFinite(r.count)&&r.count>=0&&Number.isFinite(r.duration)&&r.duration>0&&Number.isFinite(r.rpm)):[];}catch{return [];}}
export function saveRecord(record:RecordEntry){localStorage.setItem(KEY,JSON.stringify([record,...loadRecords()].slice(0,1000)));}
