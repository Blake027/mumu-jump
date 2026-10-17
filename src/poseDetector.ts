import { FilesetResolver, PoseLandmarker, type NormalizedLandmark } from '@mediapipe/tasks-vision';
export type Point=NormalizedLandmark;
export class PoseDetector {
 private model:PoseLandmarker|null=null;
 async init(){if(this.model)return;const files=await FilesetResolver.forVisionTasks(`${import.meta.env.BASE_URL}wasm`);
 this.model=await PoseLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:`${import.meta.env.BASE_URL}models/pose_landmarker_lite.task`,delegate:'CPU'},runningMode:'VIDEO',numPoses:1,minPoseDetectionConfidence:.6,minTrackingConfidence:.6});}
 detect(video:HTMLVideoElement,time:number){return this.model!.detectForVideo(video,time).landmarks[0];}
}
export function measure(points:Point[]|undefined){
 if(!points)return null;
 const ids=[0,11,12,23,24,27,28,31,32];
 if(ids.some(i=>!points[i]||(points[i].visibility??0)<.55||points[i].x<.025||points[i].x>.975||points[i].y<.025||points[i].y>.975))return null;
 const shoulders=(points[11].y+points[12].y)/2,hips=(points[23].y+points[24].y)/2;
 return {y:(shoulders+hips)/2,torso:Math.abs(hips-shoulders)};
}
