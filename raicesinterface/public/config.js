// Socket Configuration for Raices Interface
// This file handles the socket connection configuration

// Determine if we're in production or development environment
const isProduction = window.location.protocol === 'https:' || 
                     window.location.hostname.includes('jeyder.com.ar') ||
                     window.location.hostname.includes('dattaweb.com');

// Configure socket URLs based on environment
const socketConfig = {
    // The URL to connect to for the interface socket (this app)
    interfaceUrl: isProduction 
        ? 'https://vps-4455523-x.dattaweb.com/raicesinterface'  // Production server path
        : 'http://' + window.location.hostname + ':3400',  // Local development
    
    // The URL to connect to for the drawing app socket (raicesgen)
    drawingUrl: isProduction 
        ? 'https://vps-4455523-x.dattaweb.com/raicesgen'  // Production server path
        : 'http://' + window.location.hostname + ':3500',  // Local development
        
    // Additional socket options if needed
    options: {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    }
};

// Function to get an interface socket connection
function getInterfaceSocket() {
    return io.connect(socketConfig.interfaceUrl, socketConfig.options);
}

// Function to get a drawing socket connection
function getDrawingSocket() {
    return io.connect(socketConfig.drawingUrl, socketConfig.options);
}

// Export the configuration and connection functions
// Since we're using native JS without modules, we expose them to the window object
window.socketConfig = socketConfig;
window.getInterfaceSocket = getInterfaceSocket;
window.getDrawingSocket = getDrawingSocket;
