#!/bin/bash
# --- MAGIA PARA LINUX ---
if [ ! -t 0 ]; then
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "\"$0\""
        exit 0
    elif command -v konsole &> /dev/null; then
        konsole -e "bash -c '\"$0\"'"
        exit 0
    fi
fi

if [ -s "$HOME/.nvm/nvm.sh" ]; then
    export NVM_DIR="$HOME/.nvm"
    source "$HOME/.nvm/nvm.sh"
fi

echo "========================================"
echo "         Iniciando Critiq..."
echo "========================================"

if [ ! -d "node_modules" ]; then
    echo "[1/3] Instalando dependencias (solo la primera vez)..."
    npm install
fi

if [ ! -f "critiq.db" ]; then
    echo "[2/3] Preparando base de datos local..."
    npx prisma db push
fi

echo "[3/3] Abriendo aplicación de escritorio..."
npm run desktop
