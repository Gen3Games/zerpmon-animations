const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

async function uploadToCloudFlareImages(chunkfilePath, chunkName) {
  LogFilePathForcheckMissingFilesImages = path.resolve(
    __dirname,
    "./logs/checkMissingFiles/images"
  );

  LogFilePathForcheckMissingFilesR2 = path.resolve(
    __dirname,
    "./logs/checkMissingFiles/r2"
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
    `${chunkName}.log`
  );
  LogFileForcheckMissingFilesR2 = path.resolve(
    LogFilePathForcheckMissingFilesR2,
    `${chunkName}.log`
  );

  fs.openSync(path.resolve(LogFileForcheckMissingFilesImages), "w");
  fs.openSync(path.resolve(LogFileForcheckMissingFilesR2), "w");

  const fileContent = fs.readFileSync(chunkfilePath, "utf-8");
  const lines = fileContent.split("\n");
  let imageCount = 0;
  for (const line of lines) {
    if (line) {
      const lineSplited = line.split(",");
      const nftId = lineSplited[0];

      let imagesUrl = `https://imagedelivery.net/9i0Mt_dC7lopRIG36ZQvKw/${nftId}_spritesheet/public`;
      let r2Url = `https://cfr2.zerpmon.world/zerpmon-spritesheet-json%2F${nftId}.json`;

      let options = {
        method: "GET",
      };

      try {
        const res = await fetch(imagesUrl, options);
        if (res.status !== 200) {
          fs.appendFileSync(LogFileForcheckMissingFilesImages, `${nftId}\n`);
        }
      } catch (err) {
        console.error("Error:", err);
        fs.appendFileSync(LogFileForcheckMissingFilesImages, `${nftId}\n`);
      }

      try {
        const res = await fetch(r2Url, options);
        if (res.status != 200) {
          fs.appendFileSync(LogFileForcheckMissingFilesR2, `${nftId}\n`);
        }
      } catch (err) {
        console.error("Error:", err);
        fs.appendFileSync(LogFileForcheckMissingFilesR2, `${nftId}\n`);
      }
      console.log("image count : ", imageCount);
      imageCount++;
    }
  }
}

// update this accordingly
const CHUNKSET = "10_imageSet";

const chunkfilePath = path.resolve(__dirname, `./imageChunks/${CHUNKSET}`);
uploadToCloudFlareImages(chunkfilePath, CHUNKSET);
