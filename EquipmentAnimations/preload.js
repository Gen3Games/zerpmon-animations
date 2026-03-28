const os = require("os");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const { contextBridge, ipcRenderer } = require("electron");
const Toastify = require("toastify-js");
const main = require("./renderAnimations");
const checkMissingFiles = require("./checkMissingFiles");
const saveSelectedFiles = require("./saveSelectedFiles");

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

contextBridge.exposeInMainWorld("main", main);
contextBridge.exposeInMainWorld("checkMissingFiles", checkMissingFiles);
contextBridge.exposeInMainWorld("saveSelectedFiles", saveSelectedFiles);
contextBridge.exposeInMainWorld("electronAPI", {
  readJsonFile: () => {
    const baseDir = path.join(os.homedir(), "Desktop", "EquipmentAnimations");
    const destinationFile = path.join(baseDir, "equipment-spritesheet.json");
    return fs.readFileSync(destinationFile, "utf8");
  },
  openJsonFile: () => {
    const openCommands = {
      darwin: "open",
      win32: "start",
      linux: "xdg-open",
    };

    const baseDir = path.join(os.homedir(), "Desktop", "EquipmentAnimations");
    const destinationFile = path.join(baseDir, `equipment-spritesheet.json`);
    const command = `${openCommands[process.platform]} "${destinationFile}"`;

    exec(command, (error) => {
      if (error) {
        console.error(`Error opening file: ${error.message}`);
        return;
      }
      console.log("File opened successfully!");
    });
  },
});
