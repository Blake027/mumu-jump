import {mkdir,copyFile,writeFile,stat} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {dirname,join} from 'node:path';
const require=createRequire(import.meta.url);
const root=dirname(require.resolve('@mediapipe/tasks-vision'));
await mkdir('public/wasm',{recursive:true});await mkdir('public/models',{recursive:true});
for(const file of ['vision_wasm_internal.js','vision_wasm_internal.wasm','vision_wasm_nosimd_internal.js','vision_wasm_nosimd_internal.wasm'])await copyFile(join(root,'wasm',file),join('public/wasm',file));
const target='public/models/pose_landmarker_lite.task';
try{if((await stat(target)).size<1000000)throw Error('Incomplete model');}catch{
 const response=await fetch('https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task');
 if(!response.ok)throw Error(`Model download failed: ${response.status}`);
 const bytes=new Uint8Array(await response.arrayBuffer());if(bytes.length<1000000)throw Error('Model download incomplete');await writeFile(target,bytes);
}
console.log('MediaPipe model and WASM assets ready.');
