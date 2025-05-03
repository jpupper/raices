#!/bin/bash

# Script de despliegue para las aplicaciones bmraices_local y brinterface
echo "Iniciando despliegue de las aplicaciones bmraices_local y brinterface..."

# Directorio base en el servidor
BASE_DIR="/root/brfinaljeyder"

# Crear directorio base si no existe
echo "Creando directorios..."
mkdir -p $BASE_DIR/bmraices_local
mkdir -p $BASE_DIR/brinterface

# Copiar archivos de bmraices_local
echo "Copiando archivos de bmraices_local..."
cp -r bmraices_local/* $BASE_DIR/bmraices_local/

# Copiar archivos de brinterface
echo "Copiando archivos de brinterface..."
cp -r brinterface/* $BASE_DIR/brinterface/

# Instalar dependencias para bmraices_local
echo "Instalando dependencias para bmraices_local..."
cd $BASE_DIR/bmraices_local
npm install express http socket.io osc cors

# Instalar dependencias para brinterface
echo "Instalando dependencias para brinterface..."
cd $BASE_DIR/brinterface
npm install express http ws osc socket.io cors

# Crear servicio systemd para bmraices_local
echo "Creando servicio systemd para bmraices_local..."
cat > /etc/systemd/system/bmraices.service << EOF
[Unit]
Description=bmraices_local Socket Server
After=network.target

[Service]
ExecStart=/usr/bin/node server.js
WorkingDirectory=$BASE_DIR/bmraices_local
Restart=always
User=root
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Crear servicio systemd para brinterface
echo "Creando servicio systemd para brinterface..."
cat > /etc/systemd/system/brinterface.service << EOF
[Unit]
Description=brinterface Socket Server
After=network.target

[Service]
ExecStart=/usr/bin/node server.js
WorkingDirectory=$BASE_DIR/brinterface
Restart=always
User=root
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Recargar systemd
echo "Recargando systemd..."
systemctl daemon-reload

# Habilitar y iniciar servicios
echo "Habilitando e iniciando servicios..."
systemctl enable bmraices.service
systemctl start bmraices.service
systemctl enable brinterface.service
systemctl start brinterface.service

# Copiar configuración de Nginx
echo "Copiando configuración de Nginx..."
cp nginx-config.conf /etc/nginx/sites-available/brfinaljeyder

# Crear enlace simbólico si no existe
if [ ! -f /etc/nginx/sites-enabled/brfinaljeyder ]; then
    ln -s /etc/nginx/sites-available/brfinaljeyder /etc/nginx/sites-enabled/
fi

# Verificar configuración de Nginx
echo "Verificando configuración de Nginx..."
nginx -t

# Reiniciar Nginx si la configuración es correcta
if [ $? -eq 0 ]; then
    echo "Reiniciando Nginx..."
    systemctl restart nginx
else
    echo "Error en la configuración de Nginx. Por favor, revisa el archivo de configuración."
    exit 1
fi

echo "¡Despliegue completado con éxito!"
echo "Aplicación principal: https://vps-4455523-x.dattaweb.com/"
echo "Interfaz: https://vps-4455523-x.dattaweb.com/interface/"
