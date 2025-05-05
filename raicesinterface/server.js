const http = require('http');
const socketIo = require('socket.io');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const osc = require('osc');

// Configuración
const hostname = '0.0.0.0';
const port = 3400;
const oscport = 8061;

// Crear aplicación Express
const app = express();
app.use(cors());
app.use(express.static('public'));

// Crear servidor HTTP
const server = http.createServer(app);

// Configurar Socket.IO con el path correcto
const io = socketIo(server, {
  path: '/raicesinterface/socket.io',  // Configura el path correcto para socket.io
  cors: {
    origin: "*",  // Permitir conexiones desde cualquier origen
    methods: ["GET", "POST"]
  }
});

console.log("My unified socket server is running");

// Configurar Socket.IO
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

    // Manejar la desconexión del cliente
    socket.on('disconnect', () => {
        console.log('Cliente desconectado: ' + socket.id);
    });
});

// Configurar OSC
const udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: oscport,
    metadata: true
});

udpPort.on("ready", function () {
    console.log("OSC UDP port ready at "+oscport);
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
    }
});

udpPort.open();

// Función para enviar mensajes OSC
function sendOSCMessage(address, args, ip, port) {
    const oscMsg = {
        address: address,
        args: args
    };

    udpPort.send(oscMsg, ip, port);
    console.log("OSC message sent", oscMsg);
}

// Iniciar el servidor
server.listen(port, hostname, () => {
    console.log(`Servidor escuchando en *:${port}`);
    console.log(`Socket.IO path: /raicesinterface/socket.io`);
    console.log(`Static files are being served from ${path.join(__dirname, 'public')}`);
});