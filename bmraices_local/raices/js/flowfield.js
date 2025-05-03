import {genR} from '../index.js'

export class FlowField {
  constructor(p) {

    this.scalef = genR(0.2,1.0);
    this.scalef =0.5;
    this.rows = 60*this.scalef;
    this.cols = 30*this.scalef;
    this.pos = [];
    this.speed = [];
    this.graficar = false;
    //this.st = p.random(15);
    this.st = 0;
    this.p = p;
    for (let i = 0; i < this.rows; i++) {
      this.pos[i] = [];
      this.speed[i] = [];
      for (let k = 0; k < this.cols; k++) {
        let x = p.map(i, 0, this.rows - 1, p.width * 0 / 8, p.width * 8 / 8);
        let y = p.map(k, 0, this.cols - 1, p.height * 0 / 8, p.height * 8 / 8);
        
        let idx = i + k + 29823 +genR(1);
        let idy = i - k + 10234 +genR(1);
        let nx = p.map(p.noise(idx), 0, 1, -1, 1);
        let ny = p.map(p.noise(idy), 0, 1, -1, 1);
        this.pos[i][k] = p.createVector(x, y);
        this.speed[i][k] = p.createVector(nx, ny);
      }
    }
  }
  display() {
    this.p.stroke(255, 255);
    this.p.strokeWeight(2);
    for (let i = 0; i < this.rows; i++) {
      for (let k = 0; k < this.cols; k++) {
        let x2 = this.pos[i][k].x + this.speed[i][k].x * this.st*15;
        let y2 = this.pos[i][k].y + this.speed[i][k].y * this.st*15;

        this.p.line(this.pos[i][k].x, this.pos[i][k].y, x2, y2);

        //this.p.ellipse(x2,y2,10,10)
      }
    }
  }
  update() {
    // Implementar la lógica de actualización aquí si es necesario
  }
  updatePS(particleSystem) {
    for (let i = particleSystem.ps.length - 1; i >= 0; i--) {
      for (let k = 0; k < this.rows; k++) {
        for (let l = 0; l < this.cols; l++) {
          let p = particleSystem.ps[i];
          if (p5.Vector.dist(p.pos, this.pos[k][l]) < 40) {
            let n = p5.Vector.sub(p.pos, this.pos[k][l]).normalize().mult(0.2);  
            p.accel.add(n);
          }
        }
      }
    }
  }
}