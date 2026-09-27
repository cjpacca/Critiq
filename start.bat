@echo off
title Critiq Local Desktop
echo ========================================
echo        Iniciando Critiq...
echo ========================================

:: Check if Node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado. 
    echo Por favor instala Node.js (v20 o superior).
    pause
    exit /b
)

:: Install dependencies if not present
if not exist "node_modules" (
    echo [1/3] Instalando dependencias base...
    call npm install
)

:: Initialize DB if not present
if not exist "critiq.db" (
    echo [2/3] Preparando base de datos local...
    call npx prisma db push
)

:: Start Electron Desktop App
echo [3/3] Abriendo aplicacion de escritorio...
call npm run desktop
