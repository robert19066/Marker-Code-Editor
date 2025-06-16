const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, 'images/Marker.ico'),
    width: 900,
    height: 600,
    webPreferences: {
      nodeIntegration: true,  // allows use of require in renderer
      contextIsolation: false // required with nodeIntegration: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
