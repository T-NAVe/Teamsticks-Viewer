const { app, BrowserWindow } = require('electron')

let win;
const url = require("url");
const path = require("path");



function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200, 
    height: 700,
    backgroundColor: '#ffffff'
  })


  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/Teamsticks-viewer/index.html`),
      protocol: "file:",
      slashes: true
    })
);
  win.setMenuBarVisibility(false);

  //// uncomment below to open the DevTools.
  //win.webContents.openDevTools()

  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  })
}

// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow()
  }
})