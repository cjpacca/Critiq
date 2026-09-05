#!/bin/bash

# Navegar a la carpeta del proyecto
cd /home/carlos/Documents/Proyectos/Critiq/webapp

# Iniciar el servidor en segundo plano
echo "🚀 Arrancando el motor de Critiq..."
npm run dev &
SERVER_PID=$!

# Esperar unos segundos a que el servidor levante
echo "⏳ Esperando a que el servidor esté listo..."
sleep 4

# Abrir el navegador por defecto
echo "🌐 Abriendo Critiq en tu navegador..."
xdg-open http://localhost:3000

# Mantener la terminal abierta para ver los logs o cerrar el servidor al salir
echo "✅ ¡Listo! Presiona CTRL+C en esta terminal para apagar el servidor cuando termines."
wait $SERVER_PID
