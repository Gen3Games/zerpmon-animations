const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

// Function to download image from URL
async function downloadImage(url, destinationPath) {
  const response = await fetch(url);
  const buffer = await response.buffer();
  fs.writeFileSync(destinationPath, buffer);
  console.log("Image downloaded successfully:", destinationPath);
}

async function fetchAndDownloadImage(destinationFolder, chunkfilePath) {
  if (fs.existsSync(destinationFolder)) {
    fs.rmSync(`${destinationFolder}`, { recursive: true, force: true });
  }
  fs.mkdirSync(destinationFolder);

  LogFilePathForDownload = path.resolve(__dirname, "./logs/download");

  if (!fs.existsSync(LogFilePathForDownload)) {
    fs.mkdirSync(LogFilePathForDownload, { recursive: true });
  }

  const errroLogFilePath = path.resolve(__dirname, "./logs/download/error.log");
  const successLogFilePath = path.resolve(
    __dirname,
    "./logs/download/success.log"
  );
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
          await downloadImage(imageUrl, destinationPath);
          fs.appendFileSync(successLogFilePath, `${nftName},${imageUrl}\n`);
        } catch (error) {
          fs.appendFileSync(errroLogFilePath, `${nftName},${imageUrl}\n`);
          console.error("Error downloading images:", error.message);
        }
      }
    }
  } catch (error) {
    console.error("Huge Error downloading images:", error.message);
  }
}

// update this accordingly
const CHUNKSET = "0_imageSet";

const destinationFolder = path.resolve(__dirname, "./ZerpmonImages");
const chunkfilePath = path.resolve(__dirname, `./imageChunks/${CHUNKSET}`);
fetchAndDownloadImage(destinationFolder, chunkfilePath);
