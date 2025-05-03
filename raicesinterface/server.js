console.log("My unified socket server is running");

// Importar las dependencias necesarias
var express = require("express");
var app = express();
var http = require("http");
var server = http.Server(app);
var WebSocket = require("ws");
var osc = require("osc");
var socketIO = require("socket.io");



/*var io = socketIO(server, {
  cors: {
    origin: ["*"],  // Reemplaza esto con el origen de tu aplicación cliente
    methods: ["GET", "POST"],
    credentials: true
  }
});*/
const io = socketIO(server, {
    cors: {
      origin: "*",  // Sin array, solo el string
      methods: ["GET", "POST"]
    }
  });

var cors = require("cors");
// Configurar el servidor para servir archivos estáticos
app.use(cors());
app.use(express.static('public'));

const websocketport = 3400;
const oscport = 8061


/*server.listen(websocketport, function() {
    console.log('Listening on port '+ websocketport);
});*/

// Escucha en todas las direcciones IP y en el puerto 3400
server.listen(3400, '0.0.0.0', () => {
    console.log('Servidor escuchando en *:3400');
  });

io.on("connection", function(socket) {
    console.log("New connection " + socket.id);

    socket.on('lala', function(data) {
        socket.broadcast.emit("lala", data);
        console.log("lala"+data);
    });
    socket.on('mouse', function(data) {
        socket.broadcast.emit("mouse", data);
        console.log(data);
    });
    

    socket.on('particlesize',(data)=>{
		console.log("particlesize"+data);
		socket.broadcast.emit("particlesize", data);
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
    /*socket.on('mouse', function(data) {
        socket.broadcast.emit("mouse", data);
        console.log(data);
    }*/
    /*socket.on('sliderChange', function(data) {
        console.log('Slider Value:', data.value);
        sendOSCMessage('/particleSize', [{ type: 'f', value: parseFloat(data.value) }], '127.0.0.1', 4600);
    });
	
	
    socket.on('test', function(data) {
        console.log("TEST");
    });*/

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