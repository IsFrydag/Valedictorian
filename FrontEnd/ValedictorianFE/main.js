//electron app's entry pt...runs in Node.js enviro
//purpose=create & manage app window(s) & handle system events (EventEmitter) using BrowserWindow module
//each instance of BrowserWindow class creates an app window that loads a web pg in a separate renderer process
//you can intreact w/ web pg from the main process using the windows webContents object
//main.js runs in main process, responsible for managing app lifecycle events & creating windows
//renderer.js runs in renderer process, handles UI rendering & user interactions within a window
//node and electron related code only!
const {app, BrowserWindow} = require('electron');
const path = require('node:path');

function createWindow(){

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'main.js'),//change to preload.js?
            contextIsolation: true //enables sandboxing for renderer process
           // nodeIntegration: false //doesnt allow require in frontend renderer, safer
        }
    });
    win.loadFile(path.join(__dirname, 'HTML', 'login_reg.html'));
}

app.whenReady().then(() =>{
    createWindow();
});
//will close Electron window as long as OS running the app is not a Mac
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

