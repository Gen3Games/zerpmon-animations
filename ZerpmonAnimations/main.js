const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");

const isMac = process.platform === "darwin";

let mainWindow;

// Main Window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: "./icon/zerpmon-logo.png",
  });

  mainWindow.webContents.openDevTools();

  mainWindow.loadFile(path.join(__dirname, "./index.html"));
}

app.on("ready", () => {
  createMainWindow();

  mainWindow.on("closed", () => (mainWindow = null));
});

app.on("window-all-closed", () => {
  if (!isMac) app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
