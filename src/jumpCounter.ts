/** Coordinates are normalized by torso length. A count requires return to baseline. */
export class JumpCounter {
  private baseline=0; private filtered=0; private samples=0; private noise=.003;
  private phase:'ground'|'air'='ground'; private takeoff=0; private lastCount=-1000; private lastTime=0;
  reset(){this.baseline=0;this.filtered=0;this.samples=0;this.noise=.003;this.phase='ground';this.lastTime=0;this.lastCount=-1000;}
  update(y:number, torso:number, time:number):boolean {
    if(!Number.isFinite(y)||!Number.isFinite(torso)||torso<.07){this.reset();return false;}
    if(this.lastTime && time-this.lastTime>250)this.reset();
    const dt=this.lastTime ? time-this.lastTime : 33; this.lastTime=time;
    if(!this.samples){this.filtered=y;this.baseline=y;}
    this.filtered+=(1-Math.exp(-dt/38))*(y-this.filtered);
    this.samples++;
    if(this.samples<18){this.baseline+=(this.filtered-this.baseline)*.2;return false;}
    const rise=(this.baseline-this.filtered)/torso;
    const threshold=Math.max(.075,Math.min(.16,this.noise*5/torso));
    if(this.phase==='ground'){
      if(rise>threshold && time-this.lastCount>220){this.phase='air';this.takeoff=time;}
      else if(rise<threshold*.6){this.noise=.95*this.noise+.05*Math.abs(y-this.filtered);this.baseline+=.045*(this.filtered-this.baseline);}
      return false;
    }
    const duration=time-this.takeoff;
    if(duration>950){this.reset();return false;}
    if(rise<threshold*.32){this.phase='ground';if(duration>=65){this.lastCount=time;return true;}}
    return false;
  }
}
