const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const os = require("os");

const types = ["left", "right"];
const scales = ["05x", "075x", "1x"];

async function checkMissingFiles() {
  const CHUNKSET = "0_imageSet";
  const baseDir = path.join(os.homedir(), "Desktop", "ZerpmonAnimations");

  const chunkfilePath = path.join(`${baseDir}/imageChunks/${CHUNKSET}`);

  LogFilePathForcheckMissingFilesImages = path.join(
    `${baseDir}/logs/checkMissingFiles/images`
  );

  LogFilePathForcheckMissingFilesR2 = path.join(
    `${baseDir}/logs/checkMissingFiles/r2`
  );

  // create log directories if they don't exist
  if (!fs.existsSync(LogFilePathForcheckMissingFilesImages)) {
    fs.mkdirSync(LogFilePathForcheckMissingFilesImages, { recursive: true });
  }

  // create log directories if they don't exist
  if (!fs.existsSync(LogFilePathForcheckMissingFilesR2)) {
    fs.mkdirSync(LogFilePathForcheckMissingFilesR2, { recursive: true });
  }

  LogFileForcheckMissingFilesImages = path.resolve(
    LogFilePathForcheckMissingFilesImages,
    `${CHUNKSET}.log`
  );
  LogFileForcheckMissingFilesR2 = path.resolve(
    LogFilePathForcheckMissingFilesR2,
    `${CHUNKSET}.log`
  );

  fs.openSync(path.resolve(LogFileForcheckMissingFilesImages), "w");
  fs.openSync(path.resolve(LogFileForcheckMissingFilesR2), "w");

  const fileContent = fs.readFileSync(chunkfilePath, "utf-8");
  const lines = fileContent.split("\n");
  let imageCount = 0;
  for (const line of lines) {
    if (line) {
      for (const type of types) {
        for (const scale of scales) {
          const lineSplited = line.split(",");
          const zerpmonId = lineSplited[0];
          const dataPointId = `${zerpmonId}-${type}-${scale}`;

          let imagesUrl = `https://imagedelivery.net/9i0Mt_dC7lopRIG36ZQvKw/${dataPointId}-spritesheet.png/public`;
          let r2Url = `https://cfr2.zerpmon.world/zerpmon-spritesheet-manifest%2F${dataPointId}.json`;

          let options = {
            method: "GET",
          };

          try {
            const res = await fetch(imagesUrl, options);
            if (res.status !== 200) {
              fs.appendFileSync(
                LogFileForcheckMissingFilesImages,
                `${dataPointId}\n`
              );
            }
          } catch (err) {
            console.error("Error:", err);
            fs.appendFileSync(
              LogFileForcheckMissingFilesImages,
              `${dataPointId}\n`
            );
          }

          try {
            const res = await fetch(r2Url, options);
            if (res.status != 200) {
              fs.appendFileSync(
                LogFileForcheckMissingFilesR2,
                `${dataPointId}\n`
              );
            }
          } catch (err) {
            console.error("Error:", err);
            fs.appendFileSync(
              LogFileForcheckMissingFilesR2,
              `${dataPointId}\n`
            );
          }
        }
      }
      imageCount++;
    }
  }

  return Promise.resolve({
    result: true,
    message: "Checked For Missing Files!",
  });
}

module.exports = checkMissingFiles;
