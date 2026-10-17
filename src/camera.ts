export class Camera {
 stream:MediaStream|null=null; facing:'user'|'environment'='user';
 constructor(private video:HTMLVideoElement){}
 async start(){this.stop();if(!navigator.mediaDevices?.getUserMedia)throw new Error('请使用 HTTPS 地址，在 Safari 中打开并允许摄像头。');
 try{this.stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:this.facing},width:{ideal:640},height:{ideal:480}}});this.video.srcObject=this.stream;await this.video.play();}catch(error){this.stop();throw error;}}
 stop(){this.stream?.getTracks().forEach(t=>t.stop());this.stream=null;this.video.srcObject=null;}
 async flip(){this.facing=this.facing==='user'?'environment':'user';await this.start();}
}
