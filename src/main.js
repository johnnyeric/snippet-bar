'use strict';

const ipcMain = require('electron').ipcMain;
const menubar = require('menubar');

const Menu = require('menu');
var path = require('path');

const appPath = __dirname;

const config = {
  openDevTools: false,
  title:        'snippets',
  icon:         path.join(__dirname,'/static/img/code-snippet-icon.png'),
  iconAlt:      path.join(__dirname,'/static/img/code-snippet-icon.png')
};

const mb = menubar({
  dir:             appPath,
  icon:            config.icon,
  width:           600,
  height:          370,
  preloadWindow:   true,
  'always-on-top': true,
  resizable:       false
});

const shortcuts = [{
  submenu: [
    { label: "Undo", accelerator: "CmdOrCctrl+Z", selector: "undo:" },
    { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
    { type: "separator" },
    { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
    { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
    { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
    { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
  ]
}];

if (config.openDevTools) {
  mb.on('after-create-window', () => {
    mb.window.openDevTools();
  });
}

// Quit when all windows are closed.
mb.app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    mb.app.quit();
  }
});

mb.on('focus-lost', () => {
    setTimeout(() => mb.hideWindow(),100);
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
mb.app.on('ready', () => {
  mb.tray.setToolTip(config.title);
  mb.tray.setPressedImage(config.iconAlt);

  Menu.setApplicationMenu(Menu.buildFromTemplate(shortcuts));

  ipcMain.on('mb-app', (event, arg) => {
    if (arg === "quit") {
      console.log('goodbye!');
      mb.app.quit();
    }
  });
});
