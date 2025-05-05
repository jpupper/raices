// Configuration file to automatically detect environment
const config = {
  // Detect if we're running on the server or locally
  getInterfaceSocketConfig: function() {
    // Check if we're running on localhost
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';
    
    if (isLocal) {
      // Local configuration
      return {
        url: 'http://' + window.location.hostname + ':3400',
        options: {
          path: '/socket.io'  // Default path for local development
        }
      };
    } else {
      // VPS server configuration
      return {
        url: 'https://vps-4455523-x.dattaweb.com',
        options: {
          path: '/raicesinterface/socket.io'
        }
      };
    }
  },
  
  // Configuration for drawing socket
  getDrawingSocketConfig: function() {
    // Check if we're running on localhost
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';
    
    if (isLocal) {
      // Local configuration
      return {
        url: 'http://' + window.location.hostname + ':3500',
        options: {
          path: '/socket.io'  // Default path for local development
        }
      };
    } else {
      // VPS server configuration
      return {
        url: 'https://vps-4455523-x.dattaweb.com',
        options: {
          path: '/raicesgen/socket.io'
        }
      };
    }
  }
};

// Function to get an interface socket connection
function getInterfaceSocket() {
  const socketConfig = config.getInterfaceSocketConfig();
  return io(socketConfig.url, socketConfig.options);
}

// Function to get a drawing socket connection
function getDrawingSocket() {
  const socketConfig = config.getDrawingSocketConfig();
  return io(socketConfig.url, socketConfig.options);
}

// Export the configuration and connection functions
// Since we're using native JS without modules, we expose them to the window object
window.config = config;
window.getInterfaceSocket = getInterfaceSocket;
window.getDrawingSocket = getDrawingSocket;
