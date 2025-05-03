const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const osc = require("osc");
const cors = require("cors");

const app = express();
const server = http.Server(app);
const io = socketIO(server, {
  cors: {
    origin: ["http://192.168.0.4:3400",
             "http://localhost:3400",
             "http://localhost:3000",
             "http://192.168.0.4:3000",
             "http://127.0.0.1:3400",
             "http://127.0.0.1:3000"],  // El origen de tu aplicación cliente
    methods: ["GET", "POST"],         // Métodos permitidos
    credentials: true                 // Permitir el envío de credenciales
  }
});
var path = require('path');

// Configurar el servidor para servir archivos estáticos desde la carpeta public
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));


const websocketport = 3000;
const oscport = 6061


server.listen(websocketport, '0.0.0.0', function() {
    console.log('Listening on port '+ websocketport);
});

io.on("connection", function(socket) {
    console.log("New connection " + socket.id);
    
	socket.on('mouse',(data)=>{
		socket.broadcast.emit("mouse", data);
		console.log("mouse"+data);
	});
	socket.on('lala',(data)=>{
		//socket.broadcast.emit("mouse", data);
		console.log("lala");
	});
	socket.on('particlesize',(data)=>{
	
		socket.broadcast.emit("particlesize", data);
			console.log("particlesize"+data);
	});
	socket.on('life',(data)=>{
		console.log("life"+data);
		socket.broadcast.emit("life", data);
	});
	
	socket.on('particleamount',(data)=>{
		console.log("particleamount"+data);
		socket.broadcast.emit("particleamount", data);
	});
	socket.on('brush',(data)=>{
		console.log("BRUSH"+data);
		socket.broadcast.emit("brush", data);
	});
	socket.on('palette',(data)=>{
		console.log("palette"+data);
		socket.broadcast.emit("palette", data);
	});
	
	socket.on('mouseforce',(data)=>{
		console.log("mouseforce"+data);
		socket.broadcast.emit("mouseforce", data);
	});
	
	socket.on('noiseforce',(data)=>{
		console.log("noiseforce"+data);
		socket.broadcast.emit("noiseforce", data);
	});
	
	socket.on('feedbackforce',(data)=>{
		console.log("feedbackforce"+data);
		socket.broadcast.emit("feedbackforce", data);
	});
	
	socket.on('vignette',(data)=>{
		console.log("vignette"+data);
		socket.broadcast.emit("vignette", data);
	});
	socket.on('clean',(data)=>{
		console.log("clean"+data);
		socket.broadcast.emit("clean", data);
	});
});

const udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: oscport,
    metadata: true
});

udpPort.on("ready", function () {
    console.log("OSC UDP port ready at "+oscport );
});

udpPort.on("message", function (oscMsg) {
    console.log("An OSC message was received!", oscMsg);
	 if (oscMsg.address === '/ptr') {
        console.log("Message /ptr received", oscMsg);

        // Crear un objeto data con las coordenadas x e y recibidas en el mensaje OSC
        var data = {
            x: oscMsg.args[0].value,
            y: oscMsg.args[1].value
        };

        // Emitir el objeto data a todos los clientes conectados
        io.sockets.emit("mouse", data);
        //socket.broadcast.emit("mouse", data);
    }
});
udpPort.open();

function sendOSCMessage(address, args, ip, port) {
    const oscMsg = {
        address: address,
        args: args
    };

    udpPort.send(oscMsg, ip, port);
    console.log("OSC message sent", oscMsg);
}