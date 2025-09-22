const {app, BrowserWindow} = require('electron');
const path = require('path');

function createWindow(){

    const win = new BrowserWindow({
        width: 1000,
        height: 1200,
        webPreferences: {
            preload: path.join(__dirname, 'renderer.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    win.loadFile('HTML/Home.html');
}

app.whenReady().then(createWindow);
//will close Electron window as long as OS running the app is not a Mac
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});