#!/bin/bash

echo "🎵 Iniciando SoundScape Frontend..."
echo "📍 Puerto: 3001"
echo "🌐 URL: http://localhost:3001"
echo ""
echo "Presiona Ctrl+C para detener el servidor"
echo "----------------------------------------"

# Verificar que las dependencias estén instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Iniciar el servidor de desarrollo
npm run dev