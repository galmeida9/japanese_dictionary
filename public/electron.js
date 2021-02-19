const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');   
const path = require('path');
 
let mainWindow;
 
function createWindow() {
    mainWindow = new BrowserWindow({
        width:1000,
        height:650,
        show: false,
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true
        }
    });
    const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;
 
    mainWindow.loadURL(startURL);
 
    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    // mainWindow.removeMenu()
}
app.on('ready', createWindow);
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');