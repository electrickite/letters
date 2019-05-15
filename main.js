const { app, BrowserWindow } = require('electron');

let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.setMenu(null);
  win.setMenuBarVisibility(false);

  win.loadFile('index.html');
  //win.webContents.openDevTools();

  win.on('closed', function() {
    win = null;
  });
}

app.on('ready', createWindow);
