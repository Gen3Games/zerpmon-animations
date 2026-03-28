const fs = require("fs");
const path = require("path");
const os = require("os");

async function saveSelectedFiles(selectedFiles) {
  const baseDir = path.join(os.homedir(), "Desktop", "EquipmentAnimations");

  const destinationFolder = path.join(baseDir, "EquipmentImages");

  // Reset folder
  if (fs.existsSync(destinationFolder)) {
    fs.rmSync(destinationFolder, { recursive: true, force: true });
  }
  fs.mkdirSync(destinationFolder, { recursive: true });

  const logDir = path.join(baseDir, "logs", "download");
  fs.mkdirSync(logDir, { recursive: true });

  const errorLogPath = path.join(logDir, "error.log");
  const successLogPath = path.join(logDir, "success.log");

  fs.writeFileSync(errorLogPath, "");
  fs.writeFileSync(successLogPath, "");

  try {
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      // Electron's File object gives you the direct source path
      const sourcePath = file.path;

      // Use the existing filename (which includes .png)
      const fileName = file.name;
      const filePath = path.join(destinationFolder, fileName);

      try {
        fs.copyFileSync(sourcePath, filePath);
        fs.appendFileSync(successLogPath, `${fileName} saved\n`);
      } catch (err) {
        fs.appendFileSync(
          errorLogPath,
          `Failed to save image_${i}: ${err.message}\n`,
        );
      }
    }

    return {
      result: true,
      message: "Files successfully saved!",
    };
  } catch (error) {
    console.error("Huge Error saving images:", error.message);
    return { result: false, message: `Error : ${error}` };
  }
}

module.exports = saveSelectedFiles;
