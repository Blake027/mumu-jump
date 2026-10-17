export class Voice {
 muted=false;
 say(text:string){if(this.muted||!('speechSynthesis' in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=1.1;window.speechSynthesis.speak(u);}
 stop(){if('speechSynthesis' in window)window.speechSynthesis.cancel();}
}
