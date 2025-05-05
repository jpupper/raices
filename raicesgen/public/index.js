import { Particula } from './js/particle.js'
import { ParticleSystem } from './js/particlesystem.js'
import { FlowField } from './js/flowfield.js'
import { ShaderManager} from './js/rendermanager.js'
import { PointManager} from './js/secuenciapuntos.js'

// demonstrate seed reset
// for (let i = 0; i < 10; i++) {
//   console.log(i, $fx.rand(), $fx.randminter())
//   $fx.rand.reset();
//   $fx.randminter.reset();
// }
const sp = new URLSearchParams(window.location.search)
var socket;

// Función para determinar si estamos en local o en el VPS
function isLocalhost() {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' || 
         window.location.hostname === '';
}

export function genR(min, max) {
	let result = 0;
	if (!max) { result = $fx.rand() * (min - 0) + 0; } else { result = $fx.rand() * (max - min) + min; }
	return result;
}


//Variables globales ?! Esto no se que onda pero despues lo transformo en otra cosa. 
//0 = Modo Mint //Acá lo de ponerle los puntos y eso.
//1 = Modo Freestyle.
var Gmodomint = 1; 
var autoclean  = true;
$fx.params([
  {
    id: "maxsize",
    name: "Max ParticleSize",
    type: "number",
    default: 50,
    options: {
      min: 1,
      max: 200,
      step: 1.0,
    },
    update: "sync",
  },
  {
    id: "life",
    name: "Life Particle",
    type: "number",
    default: 0.01,
    options: {
      min: 0.0,
      max: 1.,
      step: 0.001,
    },
    update: "sync",
  },
  {
    id: "particleamount",
    name: "Particle amount",
    type: "number",
    default: 0.5,
    options: {
      min: 0,
      max: 1,
      step: 0.001,
    },
    update: "sync",
  },
  {
    id: "brush",
    name: "Brush Type",
    type: "select",
    options: {
      options: [
          "Clasic Ellipse",
          "3D Root",
          "Tentacles"
      ]
    },
    update: "sync",
  },
    {
      id: "palette",
      name: "Palette",
      type: "select",
      options: {
        options: [
            "Blue Sunrise",
            "Autumn Sky",
            "Lavender Sun",
            "Ocean Daylight",
            "Rose Lagoon",
            "Golden Dusk",
            "Skyline Yellow",
            "Cocoa Cream",
            "Mystic Violet",
            "Blueberry Pie",
            "Emerald Fire",
            "Orchid Dream",
            "Peach Blossom",
            "Cherry Night",
            "Mint Caramel",
            "Galaxy Gold",
            "Lilac Dawn",
            "Violet Candy",
            "Aqua Wood",
            "Berry Twilight",
            "Minty Magenta",
            "Crimson Cloud",
            "Copper Sky",
            "Forest Whisper",
            "Starry Clash",
            "Meadow Honey",
            "Nightshade Blue",
            "Emerald Night",
            "Royal Blend",
            "Sunset Dream",
            "Berry Wine",
            "Mocha Blend",
            "Blazing Inferno",
            "Golden Majesty",
            "Frozen Tundra",
            "Emerald Enigma",
            "Desert Rose"
        ]
      },
      update: "sync",
  },
  {
    id: "mousef",
    name: "Mouse Force",
    type: "number",
    default: .5,
    options: {
      min: 0,
      max: 1,
      step: 0.001,
    },
    update: "sync",
  },
  {
    id: "noiseforce",
    name: "Noise Force",
    type: "number",
    default: 0.3,
    options: {
      min: 0,
      max: 1,
      step: 0.001,
    },
    update: "sync",
  },
  {
    id: "feedbackforce",
    name: "Feedback Force",
    type: "number",
    default: 0.8,
    options: {
      min: 0,
      max: 1,
      step: 0.001,
    },
    update: "sync",
  },
  {
    id: "vignette",
    name: "Vignette",
    type: "number",
    default: 0.3,
    options: {
      min: 0,
      max: 1,
      step: 0.001,
    },
    update: "sync",
  },
 
  {
    id: "positionsxys",
    name: "Positions",
    type: "string",
    options: {
      minLength: 0,
      maxLength: 8000,
    },
    // uneditable from ui, will be controlled by the code!!
    update: "code-driven",
    default: "PkrHaT35l9E+Q15RPhDaZT46nEs+I8uhPjHaRj432h4+KRhBPlF62T4jtIw+bnNTPiJbnz6ECgc+IQKyPpKGRT4gVjs+o8uhPiBWOz6xKp8+IFY7PsHhXD4gVjs+1WE4PiBWOz7tVhM+Hv1OPwUnRz4eUNg/ExTkPiUNeT8amlM+MdpGPyECgj5Lc+A/KECgPm8obD8uYX8+k4luPzOsbj6w15Q/O8B9Ps8obD9AfMw+8CseP0ONOz8F5Q0/RKp7PxKx2j9Cb/w/HHaSPz1sXD8i3Pg/OGi9PysdpD8w408/MNeUPyld4D81OJc/H+VCPzY7ST8ZNcM/M4luPxFpBT8u/U4/DGVmPyZmZj8J45Y/IS3PPwsA1j8acS4/C492Pw8obD8NgqU/BmZmPw8uhT7+/U4/D3XVPu579T8NyfU+4rHaPwpyNj7ZQ14/BFFXPs8obD72QBI+yhrzPuT6tT7GECs+0Ow5PsQKxz69bFw+w7SMPqy1oD7FDXk+njliPse/VD6ShkU+zXlDPoh/Bj7XlDY+fgzQPujCBT51ItI++O0jPnUi0j8C3Pg+e9JRPwmZmj6GRIc/EIFZPpBLxT8W578+mBiDPx579T6fVqI/Jz37PqM9AT82ECs+qwnAPz3Pfz6zZR4/QYQLPr36/D9H6nE+2vN3P0x2kj71ItI/TU4mPwW15z9LSMI/Dy6FP0e/VD8X0TQ/QKx3PyM9AT87c+A/K9+wPzWO0j8yAI8/K/U5PzoUnT8kYQM/Pfr8PxSMID9EYys+/qcTP01NKj7lDXk/TvkJPtY7ST9Mvoo+wQKyP0e66z6rHaQ/Qm/8PpqcSz89JQ0+hLc+PzQ7Dj5hArI/KnsgPj1OJj8hkSI+JQ15Pxb7RD4W578/CeOWPhQ15T7+DNA+HPfqPt28lj4pxLc+v6bcPjEtzz6vfr8+O0jCPqM9AT5NeUM+lU9kPmW58D6L1sY+hQ15Podhxz6iW58+jPQGPsBWOz6WbKQ+3lDYPp/lQj8LHaQ+ccsTPw15Qz5rG5Q/ElufPl7Z1j8epxM+WUeXPy1OJj5QXZk=",
  },

])

function main() {
 
}
main()

$fx.on(
  "params:update",
  newRawValues => {

    sketchInstance.updateParamsFromFxParams();
    
  },
  (optInDefault, newValues) => main()
)


let sketchInstance;

window.sketch = (p) => {
  let a = 100 ;
  let gc1,gc2,bgc1,bgc2; // COLORES 

  sketchInstance = p;
  //OBJETOS : 
  let shmanag,shmanag2 ;
  let ff;
  let ps;
  let modocolor;
  let automatic = false;
  let lasttime ;
  let pgparticles;
  let pgshader1;
  let pg2_light;
  let sh1 ;
  let shloaded = false; //Si cargo el shader o no.
  let ps2 ;
  let gp ; 
  let pm ; //point manager
  let isDebug = false;
  let duration = 40 ; //Tiempo que tarda para estar disponible para poder volver a spawnear una particula. 
  let durationaf = 3000; //DURATION DESDE QUE PUEDO REINICIAR.
  let lasttimeaf = 0;
  let font ;

  let isRecording = false;
  let readyRecord = true;
  p.preload = () => {
    p.noiseSeed(genR(1000));
    //Asignamos valores iniciales para que no crashee ? 
    font = p.loadFont('font/windowsregular.ttf');
    pm = new PointManager(p);
    shmanag = new ShaderManager(p,"shaders/imageprocessing/feedbackbr.frag");
    shmanag2 = new ShaderManager(p,"shaders/imageprocessing/lighting3dminimal.frag");
   
    //console.log(shmanag.sh);
    p.gp = {
      maxsize:10,
      lr:10,
      bs:3,
      rl:0,
      maxalpha:255,
      fff:30,
      feedbackmodeint:0,
      feedbackforce:.8,
      vignette:.5,
      noiseforce:0.8,
      brushtipeint:0,
      particleamount:0.8,
      gc1:p.color(genR(255), genR(255), genR(255)),
      gc2:p.color(genR(255), genR(255), genR(255)),
	  mouseforce:4
    }
    //console.log("PRELOAD");
    sh1 = p.loadShader('shaders/base.vert', "shaders/imageprocessing/feedbackbr.frag", () => {
      shloaded = true;
      //console.log("CARGO SHADER");
    });
    //ff = new FlowField();
    lasttime = 0;
    pg2_light = p.createGraphics(p.windowWidth,p.windowHeight,p.WEBGL);
    pg2_light.translate(-p.windowWidth /2,-p.windowHeight/2)
    pgparticles = p.createGraphics(p.windowWidth,p.windowHeight,p.WEBGL);
    pgparticles.translate(-p.windowWidth /2,-p.windowHeight/2)
    pgshader1 = p.createGraphics(p.windowWidth,p.windowHeight,p.WEBGL);
    pgshader1.translate(-p.windowWidth /2,-p.windowHeight/2)
    //feedbackmodeint = 0;
    console.log("COLOR1"+p.gp.gc1);
    console.log("COLOR2"+p.gp.gc2);
  }
  
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    p.rectMode(p.CENTER);
    p.generative();
    p.textFont(font);
    p.textSize(20);

    let str = "P16nEz47Md0/XEt0Pjj3XT9UNeU+K5hgP0hryj4k6OE/PtIxPiGRIj82O0k+HRwjPykYQT4UMiQ/GcS3PgfwZz8QAAA+A3tnPwYQKz4CXig++UNePgW15z7ryhs+DGVmPthArD4VT2Q+yMIFPh0cIz6xLc8+MA1fPp36nD5GVls+lOJcPlgqVz6HEt0+fgzQPoJbnz6NgqU+ggVkPqM9AT6IFY8+vWxcPo8obD7KPLo+mZmaPtF62T6owgU+1e/YPrryhz7a83c+yx2kPtRD+D7bSMI+xce7Pue/VD6+iZw+9IwgPrxPHT8DtIw+uzHdPw15Qz66oz0/FpGEPr36/D8kjCA+xTkbPzCBWT7Jrho/P36nPtIJeT9K8oc+2vN3P1e/VD7oUnQ/X6nFPvkJMT9jXlE/BbXnP2OJbj8OEUU/YYQLPxb7RD9deUM/HfISP1MzMz8koZE/SvKHPyW+0T89Iwg/JOjhPzHaRj8iH8I/JxLdPxyNgz8coa8/GTXDPxECsj8T6tQ/AdpGPwz0Bj7jXlE/Bf03Psx2kj8BQOg+tY7SPv+4sD6dTiY/AzQXPo4luj8JDaY+dpGEPxeJ5D5pxLc/IUnSPlmZmj8tREA+RLc+Pz9fjD4579U/S1n6Pjc9+z9SCXk+RWO1P1lHlz5+pxM/YRRWPqKx2j9lQgU+xArHP2bt5T7hWO0/Z3yFPvlDXj9sONQ/Eoa9P2/X4z8gAAA/cTxzPy1OJj9y6FI/OsdpP3E8cz9IFY8/beSzP0pGED9omcQ/S0jCP17Z1j9GECs/U/yoPzcS3T9LoUo/KRhBP0n1aj8f1OI/TC/qPxTiXD9O+Qk/BOJcP1KYGT704lw/UF2ZPuBWOz9IkNo+yx2kPz5CTD647SM/MXHvPqVjtT8iH8I+jyhsPxGwVT5ue/U/AqV4Pk4luj7pb7Q+NIwgPtBdmT4pxLc+uqM9PikYQT6hAoI+Nz37PoUnRz5jtIw+ZGwVPo7SMT5Jrho+zCBWPlBdmT8SBWQ+bVYTP1S3Pj5wrdM/OW58PoxlZj8b9Tk+ti4+PzfqcT64910/N+pxPrj3XQ=="
    //str = $fx.getParam("positionsxys");
    pm.puntos = pm.decodePoints(str);
    console.log(pm.puntos)
    pm.trigger();

    // Usar la función de config.js para obtener el socket
    //socket = getRaicesgenSocket();
   
    if(isLocalhost()){
      socket = io('http://localhost:3000', {
        path: '/raicesgen/socket.io'  // Exactamente como fifuli usa /fifuli/socket.io
      });
    }else{
      socket = io('https://vps-4455523-x.dattaweb.com', {
        path: '/raicesgen/socket.io'  // Exactamente como fifuli usa /fifuli/socket.io
      });
    }
    

    socket.on('connect', () => {
      console.log('Conectado al servidor:', socket.id);
    });
    socket.on('connect_error', (error) => {
      console.error('Error de conexión:', error);
    });
    socket.on('mouse',function newDrawing(data){
		  console.log(data);
		  ps.addParticle(p.map(data.x,0,1,0,p.width), p.map(data.y,0,1,0,p.height));
		  fill(255,0,0);
		  ellipse(data.x,data.y,40,40);
    });
	socket.on('particlesize',(data)=>{
		console.log("particlesize"+data);
		p.gp.maxsize = p.map(data,0,100,5,200);
		//socket.broadcast.emit("particlesize", data);
	});
	socket.on('life',(data)=>{
		console.log("life"+data);
		p.gp.lr = p.map(data,0.0,100.0,0.003,0.03);
		//socket.broadcast.emit("life", data);
	});
	
	socket.on('particleamount',(data)=>{
		console.log("particleamount"+data);
		p.gp.particleamount = p.map(data,0,100,1.,0.01);
		//socket.broadcast.emit("particleamount", data);
	});
	socket.on('brush',(data)=>{
		console.log("BRUSH"+data);
		//socket.broadcast.emit("brush", data);
		 if(data == "Clasic Ellipse"){
		  p.gp.brushtipeint = 0;
		}
		if(data == "3D Root"){
		  p.gp.brushtipeint = 2;
		}
		if(data == "Tentacles"){
		  p.gp.brushtipeint = 1;
		}
	});
	socket.on('palette',(data)=>{
		console.log("palette"+data);
		//socket.broadcast.emit("palette", data);
		let cpalet = p.getPaletteByName(data);   
		p.gp.gc1 =cpalet.c1;
		p.gp.gc2 =cpalet.c2;
	});
	
	socket.on('mouseforce',(data)=>{
		console.log("mouseforce"+data);
		//socket.broadcast.emit("mouseforce", data);
		p.gp.mouseforce = p.map(data,0.0,100.0,0.0,4.0);
	});
	
	socket.on('noiseforce',(data)=>{
		console.log("noiseforce"+data);
		p.gp.noiseforce = p.map(data,0.0,100.0,0.0,1.0);
	});
	
	socket.on('feedbackforce',(data)=>{
		console.log("feedbackforce"+data);
		p.gp.feedbackforce = p.map(data,0.0,100.0,0.0,1.0);
		//socket.broadcast.emit("feedbackforce", data);
	});
	
	socket.on('vignette',(data)=>{
		console.log("vignette"+data);
		p.gp.vignette = p.map(data,0.0,100.0,0.0,1.0);
		//socket.broadcast.emit("vignette", data);
	});
	
	socket.on('clean',(data)=>{
		//console.log("clean"+data);
		//p.gp.vignette = p.map(data,0.0,100.0,0.0,1.0);
		p.clean();
	});
	
	
	
    p.gp.gc1 = p.color(genR(255), genR(255), genR(255));
    p.gp.gc2 = p.color(genR(255), genR(255), genR(255));
  };
  
	function sendPointerData(){
			var data = {
						x:p.map(p.mouseX,0,p.width,0,1),
						y:p.map(p.mouseY,0,p.height,0,1)
					}
			socket.emit("mouse",data);
			//socket2.emit("mouse",data);
			//p.fill(255,255);
			//p.ellipse(mouseX,mouseY,30,30);
		
	}
  p.draw = () => {
    


    if(autoclean){
      pgparticles.fill(0,10);
      pgparticles.rect(0,0,p.windowWidth,p.windowHeight);
    }

    p.update();
    p.updateShader();
    p.translate(-p.windowWidth /2,-p.windowHeight/2)
    ps.display(pgparticles);
    p.image(pgshader1,0,0,p.windowWidth,p.windowHeight);
    p.fill(255);


    if(isDebug){
      let sepy = 50;
      let posx = 30;
      p.fill(255,255);
      p.text("Points lenght"+pm.puntos.length,posx,sepy);
    }
   
    if(pm.graficar){
      pm.display();
    }
    if(ff.graficar){
      ff.display();
    }
    if(isRecording){
      p.dibujarPunteroMint();
    }
	if(p.mouseIsPressed){
		sendPointerData();
	}
  };

  p.dibujarPunteroMint = () =>{
    p.strokeWeight(5);
    p.stroke(255,255,255, 0.5);
    p.noFill();
    let s = 45;
    if (pm.puntos.length < pm.maxpuntos) {
      p.arc(p.mouseX, p.mouseY, s, s, (pm.puntos.length/pm.maxpuntos) *p.PI*2-p.TAU*.25, -.001-p.TAU*.25)
    };
  }

  p.updateShader = () =>{
    shmanag.update(pgparticles,pgshader1);
    
    shmanag.sh.setUniform("r1",p.red(p.gp.gc1)/255.)
    shmanag.sh.setUniform("g1",p.green(p.gp.gc1)/255.)
    shmanag.sh.setUniform("b1",p.blue(p.gp.gc1)/255.)
    shmanag.sh.setUniform("r2",p.red(p.gp.gc2)/255.)
    shmanag.sh.setUniform("g2",p.green(p.gp.gc2)/255.)
    shmanag.sh.setUniform("b2",p.blue(p.gp.gc2)/255.)

    shmanag.sh.setUniform("feedbackmode", p.gp.feedbackmodeint);
    shmanag.sh.setUniform("feedbackforce", p.gp.feedbackforce);
    shmanag.sh.setUniform("noiseforce", p.gp.noiseforce);
    shmanag.sh.setUniform("vignette", p.gp.vignette);
    pgshader1.push();
    pgshader1.shader(shmanag.sh);
    pgshader1.rect(0,0,p.width,p.height);
    pgshader1.pop();


  }
  p.newDrawing = (data2) => {
    console.log(data2);
    if (renderMode) {
      addParticle(data2);
    }
  }
  p.update = () =>{
    p.updateNewCombinedMode();
  }
  p.updateNewCombinedMode = () =>{
    ff.updatePS(ps);
    ps.update();
    pm.update(ps);
    if(pm.moving){
      ps.addParticle(pm.pos.x, pm.pos.y);
      ps.follow(pm.pos.x,pm.pos.y,p.map($fx.getParam("mousef"),0.0,1.0,0.0,4.0))
    }else{
      //ps.ps = [] ;
      if (p.mouseIsPressed) {
        ps.follow(p.mouseX,p.mouseY,p.map($fx.getParam("mousef"),0.0,1.0,0.0,4.0))
        ps.addParticle(p.mouseX, p.mouseY); 
        if(pm.puntos.length < pm.maxpuntos+1){
          pm.agregarPunto(p.mouseX,p.mouseY);
        }
      }
    }

    if(pm.puntos.length == pm.maxpuntos){
      $fx.emit("params:update", {
        positionsxys: pm.encodePoints(pm.puntos),
      })
      document.querySelector('.btn1').textContent = "Record";
      isRecording = false;
    }
  }

  p.windowResized = () => {
    pg2_light.resizeCanvas(p.windowWidth,p.windowHeight,p.WEBGL);
    pgparticles.resizeCanvas(p.windowWidth,p.windowHeight,p.WEBGL);
    pgshader1.resizeCanvas(p.windowWidth,p.windowHeight,p.WEBGL);
    pg2_light.translate(-p.windowWidth /2,-p.windowHeight/2)
    pgparticles.translate(-p.windowWidth /2,-p.windowHeight/2)
    pgshader1.translate(-p.windowWidth /2,-p.windowHeight/2)
    p.resizeCanvas(p.windowWidth,p.windowHeight,p.WEBGL);
    p.translate(-p.windowWidth /2,-p.windowHeight/2)
    p.clean();
  }
  p.mouseDragged = () => {
    var data = {
      x:p.mouseX,
      y:p.mouseY
    }
    socket.emit("mouse",data);
  };

  p.mousePressed = () => {};
  p.keyPressed = () => {
    if(p.key == 't'){
        
    }
    if (p.key === 'a') {
      p.background(0);
      ps = new ParticleSystem();
    }
    if (p.key === 's') {
      p.cleanEverything();
    }
    if (p.key === 'd') {
      isDebug = !isDebug;
    }
    if(p.key == 'g'){
      p.clean();
    }
    if(p.key == 'p'){
      pm.graficar = !pm.graficar;
    }
    if(p.key == 'o'){
      ff.graficar = !ff.graficar;
    }
    if(p.key == 'k'){
      pm.puntos = [];
      p.clean();
    }
    if(p.key == 't'){
      p.cleanBuffers();
      pm.trigger();
      ps = new ParticleSystem(p);
      $fx.rand.reset();
      $fx.randminter.reset()
      p.noiseSeed(genR(1000));
    }
    if(p.key == 'b'){
      //let str = pm.encodePoints(pm.puntos);
      let str = "P16nEz47Md0/XEt0Pjj3XT9UNeU+K5hgP0hryj4k6OE/PtIxPiGRIj82O0k+HRwjPykYQT4UMiQ/GcS3PgfwZz8QAAA+A3tnPwYQKz4CXig++UNePgW15z7ryhs+DGVmPthArD4VT2Q+yMIFPh0cIz6xLc8+MA1fPp36nD5GVls+lOJcPlgqVz6HEt0+fgzQPoJbnz6NgqU+ggVkPqM9AT6IFY8+vWxcPo8obD7KPLo+mZmaPtF62T6owgU+1e/YPrryhz7a83c+yx2kPtRD+D7bSMI+xce7Pue/VD6+iZw+9IwgPrxPHT8DtIw+uzHdPw15Qz66oz0/FpGEPr36/D8kjCA+xTkbPzCBWT7Jrho/P36nPtIJeT9K8oc+2vN3P1e/VD7oUnQ/X6nFPvkJMT9jXlE/BbXnP2OJbj8OEUU/YYQLPxb7RD9deUM/HfISP1MzMz8koZE/SvKHPyW+0T89Iwg/JOjhPzHaRj8iH8I/JxLdPxyNgz8coa8/GTXDPxECsj8T6tQ/AdpGPwz0Bj7jXlE/Bf03Psx2kj8BQOg+tY7SPv+4sD6dTiY/AzQXPo4luj8JDaY+dpGEPxeJ5D5pxLc/IUnSPlmZmj8tREA+RLc+Pz9fjD4579U/S1n6Pjc9+z9SCXk+RWO1P1lHlz5+pxM/YRRWPqKx2j9lQgU+xArHP2bt5T7hWO0/Z3yFPvlDXj9sONQ/Eoa9P2/X4z8gAAA/cTxzPy1OJj9y6FI/OsdpP3E8cz9IFY8/beSzP0pGED9omcQ/S0jCP17Z1j9GECs/U/yoPzcS3T9LoUo/KRhBP0n1aj8f1OI/TC/qPxTiXD9O+Qk/BOJcP1KYGT704lw/UF2ZPuBWOz9IkNo+yx2kPz5CTD647SM/MXHvPqVjtT8iH8I+jyhsPxGwVT5ue/U/AqV4Pk4luj7pb7Q+NIwgPtBdmT4pxLc+uqM9PikYQT6hAoI+Nz37PoUnRz5jtIw+ZGwVPo7SMT5Jrho+zCBWPlBdmT8SBWQ+bVYTP1S3Pj5wrdM/OW58PoxlZj8b9Tk+ti4+PzfqcT64910/N+pxPrj3XQ=="
      console.log(str);
      console.log(pm.decodePoints(str));
    }
  };
    p.getPaletteByName = (name) => {
      const palettes = {
          "Blue Sunrise": {c1: p.color(59,99,237), c2: p.color(227,147,65)},
          "Autumn Sky": {c1: p.color(220,107,22), c2: p.color(78,116,143)},
          "Lavender Sun": {c1: p.color(111,87,226), c2: p.color(247,140,11)},
          "Ocean Daylight": {c1: p.color(69,147,176), c2: p.color(187,190,35)},
          "Rose Lagoon": {c1: p.color(247,86,156), c2: p.color(17,70,71)},
          "Golden Dusk": {c1: p.color(215,173,110), c2: p.color(154,8,10)},
          "Skyline Yellow": {c1: p.color(94,143,246), c2: p.color(221,208,40)},
          "Cocoa Cream": {c1: p.color(149,82,15), c2: p.color(236,245,210)},
          "Mystic Violet": {c1: p.color(140,64,140), c2: p.color(53,122,131)},
          "Blueberry Pie": {c1: p.color(110,144,225), c2: p.color(223,153,137)},
          "Emerald Fire": {c1: p.color(149,169,22), c2: p.color(215,53,8)},
          "Orchid Dream": {c1: p.color(143,75,198), c2: p.color(216,171,127)},
          "Peach Blossom": {c1: p.color(246,197,240), c2: p.color(127,66,21)},
          "Cherry Night": {c1: p.color(218,61,55), c2: p.color(67,10,138)},
          "Mint Caramel": {c1: p.color(139,219,176), c2: p.color(216,105,2)},
          "Galaxy Gold": {c1: p.color(117,13,247), c2: p.color(234,214,162)},
          "Lilac Dawn": {c1: p.color(223,193,235), c2: p.color(218,124,40)},
          "Violet Candy": {c1: p.color(252,139,241), c2: p.color(71,61,165)},
          "Aqua Wood": {c1: p.color(146,249,233), c2: p.color(145,103,68)},
          "Berry Twilight": {c1: p.color(204,112,136), c2: p.color(119,110,170)},
          "Minty Magenta": {c1: p.color(0,242,181), c2: p.color(222,26,161)},
          "Crimson Cloud": {c1: p.color(193,23,6), c2: p.color(123,120,150)},
          "Copper Sky": {c1: p.color(137,78,27), c2: p.color(152,170,222)},
          "Forest Whisper": {c1: p.color(88,143,109), c2: p.color(156,78,52)},
          "Starry Clash": {c1: p.color(8,70,240), c2: p.color(251,26,41)},
          "Meadow Honey": {c1: p.color(152,207,112), c2: p.color(209,187,92)},
          "Nightshade Blue": {c1: p.color(70,74,230), c2: p.color(13,42,20)},
          "Emerald Night": {c1: p.color(10,183,63), c2: p.color(14,32,107)},
          "Royal Blend": {c1: p.color(111,102,180), c2: p.color(149,83,157)},
          "Sunset Dream": {c1: p.color(243,201,129), c2: p.color(44,22,125)},
          "Berry Wine": {c1: p.color(215,65,145), c2: p.color(86,70,114)},
          "Mocha Blend": {c1: p.color(223,197,146), c2: p.color(132,97,104)},
          "Blazing Inferno": {c1: p.color(255,48,48), c2: p.color(255,165,0)},
          "Golden Majesty": {c1: p.color(255,215,0), c2: p.color(184,134,11)},
          "Frozen Tundra": {c1: p.color(135,206,250), c2: p.color(240,248,255)},
          "Emerald Enigma": {c1: p.color(0,128,0), c2: p.color(144,238,144)},
          "Desert Rose": {c1: p.color(255,182,193), c2: p.color(210,180,140)}
      };
    return palettes[name];
  }
  p.clean = () =>{
    console.log("CLEAN");
    p.cleanBuffers();
    //$fx.rand.reset();
    //$fx.randminter.reset();
    p.noiseSeed(genR(1000));
    ff = new FlowField(p);
    ps = new ParticleSystem(p);
    isRecording = false;
  }
  p.cleanBuffers = () => {
    pgparticles.background(0);
    pgshader1.background(0);  
  }
  p.cleanSequence = () =>{
    pm.clean();
  }
  p.generative = () =>{

    console.log("GENERATE");
   
   // points = [];
    p.gp.bs = genR(8);
    p.gp.fff = genR(0.8);
    p.gp.maxsize = genR(30,150);
    p.gp.maxalpha = genR(150,255);
    p.gp.sizeamp = genR(0);
    p.gp.sizespeed =1.0;
    p.gp.brushtipeint = Math.floor(genR(3));

    console.log("BRUSH"+p.gp.brushtipeint);
    //let p.getPaletteByName("Golden Dusk")
    //FXHASH PARAMS CONTROL : 
    p.gp.lr = genR(0.001, 0.01);
    p.gp.rl = genR(1) > 1;
    p.noiseSeed(p.floor(genR(1000)));
   
    p.gp = {
      maxsize:genR(30,200),
      lr:genR(0.001, 0.01),
      rl:genR(0.001, 0.01),
      maxalpha:genR(150,255),
      fff:genR(0.8),
      feedbackmodeint:0,
      feedbackforce:.8,
      vignette:.5,
      noiseforce:0.1,
      brushtipeint:Math.floor(genR(3)),
      particleamount:0.8,
      gc1:p.color(genR(255), genR(255), genR(255)),
      gc1:p.color(genR(255), genR(255), genR(255))
    }
    p.gp.gc1 = p.color(genR(255), genR(255), genR(255));
    p.gp.gc2 = p.color(genR(255), genR(255), genR(255));

    console.log("color1"+ p.gp.gc1);
    console.log("color2"+ p.gp.gc2);
    ff = new FlowField(p);
    ps = new ParticleSystem(p);
  }

  p.updateParamsFromFxParams = ()=>{
    let cpalet = p.getPaletteByName($fx.getParam("palette"));   
    p.gp.gc1 =cpalet.c1;
    p.gp.gc2 =cpalet.c2;
    p.gp.feedbackmodeint = 0;
    p.gp.particleamount = $fx.getParam("particleamount");
    if($fx.getParam("brush") == "Clasic Ellipse"){
      p.gp.brushtipeint = 0;
    }
    if($fx.getParam("brush") == "3D Root"){
      p.gp.brushtipeint = 2;
    }
    if($fx.getParam("brush") == "Tentacles"){
      p.gp.brushtipeint = 1;
    }
    p.gp.feedbackforce = $fx.getParam("feedbackforce");
    p.gp.noiseforce = $fx.getParam("noiseforce");
    p.gp.feedbackforce = $fx.getParam("feedbackforce")
    p.gp.vignette = $fx.getParam("vignette")
    p.gp.lr = p.map($fx.getParam("life"),0.0,1.0,0.003,0.03);
    p.gp.maxsize = $fx.getParam("maxsize");
  }

  p.startRecording = () =>{
    //var btn1 = document.querySelector('.btn1');
    //btn1.textContent = 'Recording';
  }
  p.triggerPlay = () =>{
    p.clean();
    pm.trigger();
  }
  p.savePoints = () =>{
    $fx.emit("params:update", {
      positionsxys: pm.encodePoints(pm.puntos),
    })
  }
  p.activateRecord = () =>{
    isRecording = true;
  }
};
new p5(sketch);
document.addEventListener("DOMContentLoaded", function() {
  var btn1 = document.querySelector('.btn1');
  var btn2 = document.querySelector('.btn2');
  var btn3 = document.querySelector('.btn3');
  var btn4 = document.querySelector('.btn4');

  btn1.addEventListener('click', function() {
    if (btn1.textContent.trim() === 'Record') {
      sketchInstance.clean();
      sketchInstance.cleanSequence();
      sketchInstance.activateRecord();
      btn1.textContent = 'Recording';
      btn2.textContent = 'Play';
    }else if (btn1.textContent.trim() === 'Recording') {
      btn1.textContent = 'Record';
      sketchInstance.savePoints();
    }
  });

  btn2.addEventListener('click', function() {
    sketchInstance.triggerPlay();
    btn2.textContent = 'Playing';
  });
  btn3.addEventListener('click', function() {
    sketchInstance.clean();
    sketchInstance.cleanSequence();
    //sketchInstance.pm.clean();
  });

  btn4.addEventListener('click', function() {
    sketchInstance.clean();
    sketchInstance.generative();
  });

});
