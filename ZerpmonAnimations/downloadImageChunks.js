const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const os = require("os");

async function fetchAndDownloadImage() {
  const baseDir = path.join(os.homedir(), "Desktop", "ZerpmonAnimations");

  const CHUNKSET = "0_imageSet";

  const destinationFolder = path.join(`${baseDir}/ZerpmonImages`);
  const chunkfilePath = path.join(`${baseDir}/imageChunks/${CHUNKSET}`);
  if (fs.existsSync(destinationFolder)) {
    fs.rmSync(`${destinationFolder}`, { recursive: true, force: true });
  }
  fs.mkdirSync(destinationFolder);

  LogFilePathForDownload = path.join(`${baseDir}/logs/download`);

  if (!fs.existsSync(LogFilePathForDownload)) {
    fs.mkdirSync(LogFilePathForDownload, { recursive: true });
  }

  const errroLogFilePath = path.join(`${baseDir}/logs/download/error.log`);
  const successLogFilePath = path.join(`${baseDir}/logs/download/success.log`);
  fs.openSync(errroLogFilePath, "w");
  fs.openSync(successLogFilePath, "w");

  try {
    const fileContent = fs.readFileSync(chunkfilePath, "utf-8");
    const lines = fileContent.split("\n");

    for (const line of lines) {
      if (line) {
        const lineSplited = line.split(",");
        const nftName = lineSplited[0];
        const imageUrl = lineSplited[1];
        const filename = `${nftName}.png`;
        const destinationPath = path.join(destinationFolder, filename);
        try {
          const response = await fetch(imageUrl);
          if (response.status === 200) {
            const buffer = await response.buffer();
            fs.writeFileSync(destinationPath, buffer);
            console.log("Image downloaded successfully:", destinationPath);
          } else {
            return Promise.resolve({
              result: false,
              message: `Error : Zerpmon ${nftName} is not available`,
            });
          }
          fs.appendFileSync(successLogFilePath, `${nftName},${imageUrl}\n`);
        } catch (error) {
          fs.appendFileSync(errroLogFilePath, `${nftName},${imageUrl}\n`);
          console.error("Error downloading images:", error.message);
        }
      }
    }
    return Promise.resolve({
      result: true,
      message: "Files successfully downloaded!",
    });
  } catch (error) {
    console.error("Huge Error downloading images:", error.message);
    return Promise.resolve({ result: false, message: `Error : ${error}` });
  }
}

module.exports = fetchAndDownloadImage;
