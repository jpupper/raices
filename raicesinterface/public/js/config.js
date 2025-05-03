/**
 * Configuración del cliente para raicesinterface
 * Este archivo maneja la configuración de conexión al socket.io server
 */

// Función para determinar la URL del socket según el entorno
function getSocketUrl() {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
  
  // En producción (servidor)
  if (hostname === 'vps-4455523-x.dattaweb.com') {
    return `${protocol}://${hostname}/raicesinterface`;
  }
  
  // En desarrollo local
  return `${protocol}://${hostname}:3400`;
}

// Configuración global
const socketConfig = {
  socketUrl: getSocketUrl()
};
