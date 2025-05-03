import { ParticleSystem } from './particlesystem.js'

export class PointManager {

    constructor(_p) {
        this.p = _p;
        this.puntos = [];
        this.pos = this.p.createVector(0, 0);
        this.totalDuration = 200;
        this.segmentDuration = 0;
        this.startTime = 0;
        this.currentPointIndex = 0;
        this.moving = false;
        this.timer = 0;
        this.maxpuntos = 700;
    }

    clean() {
        this.puntos = []
        this.startTime = this.timer;
        this.currentPointIndex = 0;
        this.moving = false;
    }

    trigger() {
        if (this.puntos.length > 1) {
            this.pos.x = this.puntos[0].x;
            this.pos.y = this.puntos[0].y;
            this.currentPointIndex = 0;
            this.moving = true;
            this.startTime = this.timer;
            this.segmentDuration = this.totalDuration / (this.puntos.length - 1);
        }
    }

    display() {
        for (let i = 0; i < this.puntos.length - 1; i++) {
            this.p.fill(255, 255);
            this.p.ellipse(this.puntos[i].x, this.puntos[i].y, 10, 10);
        }
        this.p.fill(255, 0, 0);
        this.p.ellipse(this.pos.x, this.pos.y, 15, 15);
    }

    update(_particlesystem) {
        this.timer++;
        if (this.moving && this.currentPointIndex < this.puntos.length - 1) {
            let elapsed = this.timer - this.startTime;
            let t = this.p.constrain(elapsed / this.segmentDuration, 0, 1);
            let p1 = this.puntos[this.currentPointIndex];
            let p2 = this.puntos[this.currentPointIndex + 1];
            this.pos.x = p1.x * (1 - t) + p2.x * t;
            this.pos.y = p1.y * (1 - t) + p2.y * t;

            if (t >= 1) {
                this.currentPointIndex++;
                this.startTime = this.timer;
                if (this.currentPointIndex >= this.puntos.length - 1) {
                    this.moving = false;
                    //particlesystem.ps = []
                    document.querySelector('.btn2').textContent = "Play";
					$fx.preview();
                }
            }
        }
    }

    agregarPunto(_x, _y) {
        this.puntos.push({ x: _x, y: _y })
    }

    encodePoints(points) {
        let buffer = new ArrayBuffer(points.length * 8);
        let dataView = new DataView(buffer);
        points.forEach((point, index) => {
            let normalizedX = point.x / this.p.windowWidth;
            let normalizedY = point.y / this.p.windowHeight;
            dataView.setFloat32(index * 8, normalizedX);
            dataView.setFloat32(index * 8 + 4, normalizedY);
        });
        let binaryString = String.fromCharCode.apply(null, new Uint8Array(buffer));
        return btoa(binaryString);
    }

    decodePoints(str) {
        let binaryString = atob(str);
        let len = binaryString.length;
        let bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        let dataView = new DataView(bytes.buffer);
        let points = [];
        for (let i = 0; i < dataView.byteLength; i += 8) {
            let normalizedX = dataView.getFloat32(i);
            let normalizedY = dataView.getFloat32(i + 4);
            let x = normalizedX * this.p.windowWidth;
            let y = normalizedY * this.p.windowHeight;
            points.push({ x, y });
        }
        return points;
    }
}
