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
  errroLogFilePath = "./logs/download/error.log";
  successLogFilePath = "./logs/download/success.log";
  fs.openSync(errroLogFilePath, "w");
  fs.openSync(successLogFilePath, "w");

  try {
    const fileContent = fs.readFileSync(chunkfilePath, "utf-8");
    const lines = fileContent.split("\n");

    for (const line of lines) {
      if (line) {
        const lineSplited = line.split(",");
        const nftId = lineSplited[0];
        const imageUrl = lineSplited[1];
        const filename = `${nftId}.png`;
        const destinationPath = path.join(destinationFolder, filename);
        try {
          await downloadImage(imageUrl, destinationPath);
          fs.appendFileSync(successLogFilePath, `${nftId},${imageUrl}\n`);
        } catch (error) {
          fs.appendFileSync(errroLogFilePath, `${nftId},${imageUrl}\n`);
          console.error("Error downloading images:", error.message);
        }
      }
    }
  } catch (error) {
    console.error("Huge Error downloading images:", error.message);
  }
}

// Example usage: Download 2 images

const destinationFolder = "./ZerpmonImages";
const chunkfilePath = "./imageChunks/0_imageSet";

fetchAndDownloadImage(destinationFolder, chunkfilePath);
