const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');   
const path = require('path');
 
let mainWindow;
 
function createWindow() {
    mainWindow = new BrowserWindow({
        width:1100,
        height:700,
        show: false,
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true
        },
        icon: path.join(__dirname, 'kanji.ico')
    });
    const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;
 
    mainWindow.loadURL(startURL);
 
    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    mainWindow.removeMenu()
}
app.on('ready', createWindow);
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';