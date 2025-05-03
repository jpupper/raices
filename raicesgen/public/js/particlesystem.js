

import { Particula } from './particle.js'

export class ParticleSystem {
  constructor(_p) {
    this.ps = []; // ArrayList en JavaScript
    this.p = _p;
    this.durnextparticle = 0.2; //Cuanto tarda en agregar la siguiente particula.
    //this.lasttimeparticle = 0;

    this.timer = 0; //Vamos a hacer nuestro propio timer para no depender de millis que creo que ahi es donde rompe el determinismo.
    this.timerlasttime = 0;
  }

  display(_ps) {
    for (let p of this.ps) {
      p.display(_ps);
    }
  }

  update() {
    this.timer++;
    for (let i = this.ps.length - 1; i >= 0; i--) {
      let p = this.ps[i];
      p.update();
      if (p.life < 0) {
        this.ps.splice(i, 1);
      }
    }
  }
  addParticle(_x, _y) {
    if(this.timer  - this.timerlasttime  > this.p.map(this.p.gp.particleamount,0.0,1.0,0.1,7.0)){
      this.timerlasttime = this.timer;
      this.ps.push(new Particula(this.p,_x, _y));
    }
  }
  reset(){
    this.lasttimeparticle = this.p.millis();
  }
  follow(_x,_y,_f){
    for (let i = this.ps.length - 1; i >= 0; i--) {
      let p = this.ps[i];
      p.follow(_x,_y,_f);
    }
  }

}