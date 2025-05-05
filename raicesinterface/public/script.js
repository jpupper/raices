var socket;
var socket2;

let drawactive = false;
let fondo;
let isInfo = false;


let ps;
let imgs = []

function preload(){
	for(let i=0; i<5; i++){
		imgs[i] = loadImage("img/logo"+(i+1)+"_r.png");
	}
	//imgs[i]
}
function setup() {
	
	
	createCanvas(windowWidth, windowHeight, WEBGL)
	console.log("AAA");
	
	// Usar exactamente la misma estructura que funciona para fifuli
	socket = io('https://vps-4455523-x.dattaweb.com', {
		path: '/raicesinterface/socket.io'  // Exactamente como fifuli usa /fifuli/socket.io
	});
	
	// Desactivar temporalmente la segunda conexión para aislar el problema
	// socket2 = io('https://vps-4455523-x.dattaweb.com', {
	//     path: '/raicesgen/socket.io'
	// });

	socket.on('mouse',newDrawing);
	// socket2.on('mouse',newDrawing);

	socket.on('connect', () => {
		console.log('Conectado al servidor:', socket.id);
	});
	socket.on('connect_error', (error) => {
		console.error('Error de conexión:', error);
	});
	socket.on('particlesize',(data)=>{
		console.log("particlesize"+data);
		document.getElementById('particleSize').value = data;
		//socket.broadcast.emit("particlesize", data);
	});
	socket.on('life',(data)=>{
		console.log("life"+data);
		document.getElementById('life').value = data;
		//socket.broadcast.emit("life", data);
	});
	
	socket.on('particleamount',(data)=>{
		console.log("particleamount"+data);
		document.getElementById('particleamount').value = data;
		//socket.broadcast.emit("particleamount", data);
	});
	socket.on('brush',(data)=>{
		console.log("BRUSH"+data);
		document.getElementById('brush').value = data;
		//socket.broadcast.emit("brush", data);
	});
	socket.on('palette',(data)=>{
		console.log("palette"+data);
		document.getElementById('palette').value = data;
		//socket.broadcast.emit("palette", data);
	});
	
	socket.on('mouseforce',(data)=>{
		console.log("mouseforce"+data);
		document.getElementById('mouseforce').value = data;
		//socket.broadcast.emit("mouseforce", data);
	});
	
	socket.on('noiseforce',(data)=>{
		console.log("noiseforce"+data);
		document.getElementById('noiseforce').value = data;
		//socket.broadcast.emit("noiseforce", data);
	});
	
	socket.on('feedbackforce',(data)=>{
		console.log("feedbackforce"+data);
		document.getElementById('feedbackforce').value = data;
		//socket.broadcast.emit("feedbackforce", data);
	});
	
	socket.on('vignette',(data)=>{
		console.log("vignette"+data);
		document.getElementById('vignette').value = data;
		//socket.broadcast.emit("vignette", data);
	});
	socket.on('clean',(data)=>{
		console.log("clean"+data);
		//socket.broadcast.emit("clean", data);
	});
	fondo = loadImage("img/background.png");
	ps = new ParticleSystem();
}
class ParticleSystem{
	constructor(){
		this.particles = []
		this.lasttime =0;
		this.duration = 2500;
		this.idx = 0;
	}
	addParticle(){
		this.particles.push(new Particle(random(width*3/10,width*7/10),
										-10,
										this.idx),
										);
		this.idx++
		if(this.idx > imgs.length-1){
			this.idx = 0;
		}
	}
	display(){
		for(let i=this.particles.length-1; i>=0; i--){
			this.particles[i].display();
		}
	}

	update(){

		if(millis()-this.lasttime > this.duration){
			this.lasttime = millis();
			this.addParticle();
		}
		for(let i=this.particles.length-1; i>=0; i--){
			this.particles[i].update();
			if(this.particles[i].dead){
				this.particles.splice(i,1);
			}
		}
	}
}
class Particle{
	constructor(_x,_y,_idx,_imgptr){
		this.pos = createVector(_x,_y)
		this.speed = createVector(0,1);
		this.idx = _idx;
		this.dead =false;
		this.img = _imgptr;
	}
	display(){
		imageMode(CENTER);
		image(imgs[this.idx],this.pos.x,this.pos.y);
		imageMode(CORNER);
		//fill(255,0,0);
		//ellipse(this.pos.x,this.pos.y,40,40);
	}
	update(){
		this.pos.add(this.speed);

		if(this.pos.y > height){
			this.dead = true;
		}
	}
}


function newDrawing(data){
	fill(255,0,0);
	ellipse(map(data.x,0,1,0,width),map(data.y,0,1,0,height),30,30);
}
function mouseDragged() {
	if(drawactive){
		var data = {
					x:map(mouseX,0,width,0,1),
					y:map(mouseY,0,height,0,1)
				}
		socket.emit("mouse",data);
		//socket2.emit("mouse",data);
		fill(255,255);
		ellipse(mouseX,mouseY,30,30);
		socket.emit("lala",10);
		//socket2.emit("lala",10);
	}
}
function sendPointerData(){
	if(drawactive){
		var data = {
					x:map(mouseX,0,width,0,1),
					y:map(mouseY,0,height,0,1)
				}
		//socket.emit("mouse",data);
		//socket2.emit("mouse",data);
		emitSockets("mouse",data);
		//fill(255,255);
		//ellipse(mouseX,mouseY,30,30);
	}
}
function touchStarted() {

}
function mouseWheel(event) {
	
}

function draw() {
	translate(-windowWidth/2,-windowHeight/2);
	if(mouseIsPressed){
		sendPointerData();
	}
	noStroke();

	fill(0,20)
	rect(0,0,width,height);

	if(!drawactive && !isInfo){
		image(fondo,0,0,1920,1080)
	}


	if(isInfo){
		background(0);
		ps.display();
		ps.update();
	}
}
function emitSockets(_key,_val){
	socket.emit(_key,_val);
	//socket2.emit(_key,_val);
}
document.addEventListener("DOMContentLoaded", function() {
	var btn1 = document.getElementById('jpopen');
	var btn_info = document.getElementById('jpinfo');
	var div  = document.getElementById('jpinterface');

	btn1.addEventListener('click', function() {
		console.log("BOTON APRETADO")
	  if (btn1.textContent.trim() === 'Close') {
		btn1.textContent = 'Open';
		div.style.display = 'none'; // Ocultar el div
		document.getElementById('jpclean').style.display = 'none'
		document.getElementById('jpgenerate').style.display = 'none'
		document.getElementById('information').style.display = 'none';
		btn_info.style.display = 'none'
		drawactive = true;
	  }else if (btn1.textContent.trim() === 'Open') {
		btn1.textContent = 'Close';
		div.style.display = 'block'; // Ocultar el div
		document.getElementById('jpclean').style.display = 'block'
		document.getElementById('jpgenerate').style.display = 'block'
		document.getElementById('information').style.display = 'none';
		btn_info.style.display = 'block'
		drawactive = false;
	  }
	});

	btn_info.addEventListener('click', function() {
		isInfo = !isInfo;
		if(isInfo){
			div.style.display = 'none'; // Ocultar el div
			document.getElementById('information').style.display = 'block';
		}else{
			document.getElementById('information').style.display = 'none';
			div.style.display = 'block'
		}
	})
	
	document.getElementById('jpclean').addEventListener('click',function(){
		emitSockets("clean",0);
	})




	document.getElementById('jpgenerate').addEventListener('click',function(){

		let particlesize = document.getElementById('particleSize');
		let life = document.getElementById('life')
		let particleamount = document.getElementById('particleamount')
		let mouseforce =document.getElementById('mouseforce')
		let feedbackforce =document.getElementById('feedbackforce')
		let noiseforce = document.getElementById('noiseforce')
		let vignette =document.getElementById('vignette')

		particlesize.value = Math.random()*100;
		life.value = Math.random()*100;
		particleamount.value = Math.random()*100;
		mouseforce.value = Math.random()*100;
		feedbackforce.value = Math.random()*100;
		noiseforce.value = Math.random()*100;
		vignette.value = Math.random()*100;


		let palette = document.getElementById('palette');
		palette.selectedIndex =  Math.floor(Math.random() * palette.options.length);

		
		let brush = document.getElementById('brush');
		brush.selectedIndex =  Math.floor(Math.random() * brush.options.length);

		emitSockets("particlesize",particlesize.value);
		emitSockets("life",life.value);
		emitSockets("particleamount",particleamount.value);
		emitSockets("mouseforce",mouseforce.value);
		emitSockets("feedbackforce",feedbackforce.value);
		emitSockets("noiseforce",noiseforce.value);
		emitSockets("vignette",vignette.value);
		emitSockets("palette",palette.value);
		emitSockets("brush",brush.value);
	})


	var particleSizeSlider = document.getElementById('particleSize');
	particleSizeSlider.addEventListener('input', function() {
	  console.log('Particle Size: ' + particleSizeSlider.value);
	  emitSockets("particlesize",particleSizeSlider.value);
	});


	var lifeSlider = document.getElementById('life');
	lifeSlider.addEventListener('input', function() {
	  console.log('Life: ' + lifeSlider.value);
	  emitSockets("life",lifeSlider.value);
	});


	var particleamount = document.getElementById('particleamount');
	particleamount.addEventListener('input', function() {
	  console.log('particleamount: ' + particleamount.value);
	  emitSockets("particleamount",particleamount.value);
	});


	var brush = document.getElementById('brush');
	brush.addEventListener('change', function() {
	  console.log('brush: ' + brush.value);
	  emitSockets("brush", brush.value);
	});


	var mouseForceSlider = document.getElementById('mouseforce');
	mouseForceSlider.addEventListener('input', function() {
	  console.log('Mouse Force: ' + mouseForceSlider.value);
	  emitSockets("mouseforce",mouseForceSlider.value);
	});
	var feedbackForceSlider = document.getElementById('feedbackforce');
	feedbackForceSlider.addEventListener('input', function() {
	  console.log('Feedback Force: ' + feedbackForceSlider.value);
	  emitSockets("feedbackforce", feedbackForceSlider.value);
	});
	var noiseForceSlider = document.getElementById('noiseforce');
	noiseForceSlider.addEventListener('input', function() {
	  console.log('Noise Force: ' + noiseForceSlider.value);
	  emitSockets("noiseforce", noiseForceSlider.value);
	});
	var paletteDropdown = document.getElementById('palette');
	paletteDropdown.addEventListener('change', function() {
	  console.log('Palette: ' + paletteDropdown.value);
	  emitSockets("palette", paletteDropdown.value);
	});

	var vignette = document.getElementById('vignette');
	vignette.addEventListener('change', function() {
	  console.log('vignette: ' + vignette.value);
	  emitSockets("vignette", vignette.value);
	});




  });
  