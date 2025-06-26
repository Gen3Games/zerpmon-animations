const os = require("os");
const path = require("path");
const { contextBridge, ipcRenderer } = require("electron");
const Toastify = require("toastify-js");
const createImageChunks = require("./createImageChunks");
const fetchAndDownloadImage = require("./downloadImageChunks");
const main = require("./renderAnimations");
const checkMissingFiles = require("./checkMissingFiles");
const createImageChunksWithCSV = require("./createImageChunksWithCSV");

contextBridge.exposeInMainWorld("os", {
  homedir: () => os.homedir(),
});

contextBridge.exposeInMainWorld("path", {
  join: (...args) => path.join(...args),
});

contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args)),
});

contextBridge.exposeInMainWorld("Toastify", {
  toast: (options) => Toastify(options).showToast(),
});

// Expose the test function
contextBridge.exposeInMainWorld("createImageChunks", createImageChunks);
contextBridge.exposeInMainWorld("fetchAndDownloadImage", fetchAndDownloadImage);
contextBridge.exposeInMainWorld("main", main);
contextBridge.exposeInMainWorld("checkMissingFiles", checkMissingFiles);
contextBridge.exposeInMainWorld(
  "createImageChunksWithCSV",
  createImageChunksWithCSV
);
