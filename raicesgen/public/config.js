// Socket Configuration for Raices Generator
// This file handles the socket connection configuration

// Determine if we're in production or development environment
const isProduction = window.location.protocol === 'https:' || 
                     window.location.hostname.includes('jeyder.com.ar') ||
                     window.location.hostname.includes('dattaweb.com');

// Configure socket URL based on environment
const socketConfig = {
    // The URL to connect to for the socket
    url: isProduction 
        ? '/raicesgen'  // Production server path (handled by nginx)
        : 'http://' + window.location.hostname + ':3500',  // Local development
        
    // Additional socket options if needed
    options: {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    }
};

// Function to get a socket connection
function getSocketConnection() {
    return io.connect(socketConfig.url, socketConfig.options);
}

// Export the configuration and connection function
// Since we're using native JS without modules, we expose them to the window object
window.socketConfig = socketConfig;
window.getSocketConnection = getSocketConnection;
