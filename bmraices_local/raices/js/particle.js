import {genR} from '../index.js'
export default function lala(){
  console.log("HOLA");
}


// Define y exporta una clase
export class MiClase {
  constructor() {
    console.log("Creando una instancia de MiClase");
  }

  miMetodo() {
    console.log("Llamando a miMetodo de MiClase");
  }
}


export class Particula {
  constructor(p,x, y) {

    this.pos = p.createVector(x, y);
    this.c1 = p.gp.gc1;
    this.c2 = p.gp.gc2;
    //console.log(p);
    //this.c1 = p.color(0);
    //this.c2 = p.color(0);

    this.p = p; //contexto de p5js.
    
    this.c1 = p.lerpColor(this.c1, p.color(255),genR(1));
    this.c2 = p.lerpColor(this.c2, p.color(0), genR(1));

    let st = 20;
    this.speed = p.createVector(genR(-st, st), genR(-st, st));
    this.s = genR(p.gp.maxsize);  
    let sta = genR(0.01);
    this.accel = p.createVector(0, 0);
    this.speedLimit = 3;
    this.life = 1;
    this.alphabegin = 1;
    this.lr = p.gp.lr;  
    this.bs = p.gp.bs;  
    this.rl = p.gp.rl; 
    this.maxalpha = p.gp.maxalpha; 
    this.faser = genR(this.p.TWO_PI);
  }

  display(_ps) {
    /*let ss = this.p.map(this.life, 1, 0, this.s, 0);
    _ps.noStroke();
    let cf = this.p.lerpColor(this.c1, this.c2, this.life);
    cf = this.p.lerpColor(this.c1,this.c2,this.life);
    cf.setAlpha(this.maxalpha * this.alphabegin);

    _ps.fill(0);
    _ps.ellipse(this.pos.x, this.pos.y, ss*1.1, ss*1.1);
    _ps.fill(cf);*/
    if(this.p.gp.brushtipeint == 0){
      this.pincel1(_ps,this.pos.x,this.pos.y)   
    }
    if(this.p.gp.brushtipeint == 1){
      this.pincel2(_ps,this.pos.x,this.pos.y)   
    }
    if(this.p.gp.brushtipeint == 2){
      this.pincel3(_ps,this.pos.x,this.pos.y)   
    }

  }

  pincel1(_ps,_x,_y){
    let ss = this.p.map(this.life, 1, 0, this.s, 0);
    _ps.noStroke();
    let cf = _ps.lerpColor(this.c1, this.c2, this.life);
    this.modocolor =2;
     
     cf = _ps.lerpColor(this.c1,this.c2,this.life);
     cf.setAlpha(this.maxalpha * this.alphabegin);
 
     _ps.fill(cf);
     _ps.noStroke();
 
     _ps.ellipse(this.pos.x, this.pos.y, ss, ss);

  }
  pincel2(_ps,_x,_y){
    let ss = this.p.map(this.life, 1, 0, this.s, 0);
    let cnt = 20;
    _ps.noStroke();
    for(let i = 0;i<cnt; i++){
      let idx = this.p.map(i,0,cnt-1,0,this.p.TWO_PI);
      
      
      let cf = _ps.lerpColor(this.c1,this.c2,this.p.sin(idx+this.life*5.)*.5+.5);
      cf = _ps.lerpColor(cf,this.p.color(0),0.3);
      cf.setAlpha(this.maxalpha * this.alphabegin);
      //cf = _ps.lerpColor(cf,this.p.color(0),idx);

      let amp = this.p.map(this.p.sin(this.life*10.+this.faser),-1,1,0,this.s)+10;
      let xx = this.pos.x+this.p.sin(idx+this.life*3.)*amp;
      let yy = this.pos.y+this.p.cos(idx+this.life*3.)*amp;

      _ps.fill(cf)
      _ps.ellipse(xx, yy, ss*.5, ss*.5);
    }
  }

  pincel3(_ps,_x,_y){
      let ss = this.p.map(this.life, 1, 0, this.s, 0);
      let cnt = 20;
      _ps.noStroke();
      for(let i = 0;i<cnt; i++){
        let idx = this.p.map(i,0,cnt-1,0,this.p.TWO_PI);
        
        
        let cf = _ps.lerpColor(this.c1,this.c2,this.p.sin(idx+this.life*5.)*.5+.5);
        cf = _ps.lerpColor(cf,this.p.color(0),0.3);
        cf.setAlpha(this.maxalpha * this.alphabegin);
        //cf = _ps.lerpColor(cf,this.p.color(0),idx);

        let amp = 20*this.life;
        let xx = this.pos.x+this.p.sin(idx+this.life*3.)*amp;
        let yy = this.pos.y+this.p.cos(idx+this.life*3.)*amp;

        _ps.fill(cf)
        _ps.ellipse(xx, yy, ss, ss);
      }
  }
  update() {

    this.speed.add(this.accel)
    this.speed.limit(this.speedLimit);
    this.pos.add(this.speed);
    //this.pos.x =this.genR(this.p.width);
    this.life -= this.lr;
    this.alphabegin += 0.01;
  }
  
  follow(_x,_y,_f){
      var mouse = this.p.createVector(_x,_y);
      var dir = mouse.sub(this.pos);
      let distance = dir.mag();
      dir.normalize();
      //dir.mult(4.*this.p.map(this.life,0,1,0.2,0.8));
      //dir.mult(4.);
      //F VA DE 0.1 a 4
      dir.mult(_f);
      if(distance > 35){
        this.speed.add(dir);
      }
  }

  applyForce(accel) {
    this.accel = accel;
  }
}
