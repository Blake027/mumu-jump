export type Mode='minute'|'free';
export type Phase='idle'|'countdown'|'running'|'paused'|'finished';
export class Training {
 phase:Phase='idle'; mode:Mode='minute'; count=0; elapsed=0; countdown=3;
 private anchor=0; private accumulated=0;
 start(mode:Mode,now:number){this.mode=mode;this.phase='countdown';this.count=0;this.elapsed=0;this.accumulated=0;this.anchor=now;this.countdown=3;}
 tick(now:number){
  if(this.phase==='countdown'){this.countdown=Math.max(0,3-Math.floor((now-this.anchor)/1000));if(now-this.anchor>=3000){this.phase='running';this.anchor+=3000;}}
  if(this.phase==='running'){this.elapsed=this.accumulated+now-this.anchor;if(this.mode==='minute'&&this.elapsed>=60000){this.elapsed=60000;this.phase='finished';return true;}}
  return false;
 }
 pause(now:number){this.tick(now);if(this.phase==='running'){this.accumulated=this.elapsed;this.phase='paused';}return this.phase==='finished';}
 resume(now:number){if(this.phase==='paused'){this.anchor=now;this.phase='running';}}
 finish(now:number){this.tick(now);this.phase='finished';}
 correct(delta:number){this.count=Math.max(0,this.count+delta);}
}
