const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const waitOn = require('wait-on');

let mainWindow;
let nextProcess;

app.on('ready', async () => {
  // Ocultar el menú por defecto
  app.name = 'Critiq';
  
  // Iniciar Next.js en el fondo silenciosamente
  nextProcess = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run', 'dev'], { 
    shell: true, 
    stdio: 'ignore' 
  });

  // Esperar a que el servidor de Next.js esté listo
  await waitOn({ resources: ['http://localhost:3000'], timeout: 30000 });

  // Crear la ventana de aplicación de escritorio
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    autoHideMenuBar: true,
    title: 'Critiq',
    backgroundColor: '#000000',
    icon: __dirname + '/public/taskbar_icon.jpeg',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadURL('http://localhost:3000');
});

// Cuando se cierra la ventana, matar el servidor de Next.js y salir
app.on('window-all-closed', () => {
  if (nextProcess) {
    if (/^win/.test(process.platform)) {
      spawn('taskkill', ['/pid', nextProcess.pid, '/f', '/t']);
    } else {
      nextProcess.kill('SIGINT');
    }
  }
  app.quit();
});

app.on('will-quit', () => {
  if (nextProcess) nextProcess.kill('SIGINT');
});
