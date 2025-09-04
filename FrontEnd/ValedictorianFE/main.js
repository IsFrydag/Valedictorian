const {app, BrowserWindow} = require('electron');
const path = require('path');

function createWindow(){

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'renderer.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    win.loadFile('Home.html');
}

app.whenReady().then(createWindow);

app.on('windo-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});