const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

async function devideImagesToChunks(nftListFilePath, destinationFolder) {
  try {
    const chunkSize = 100;
    let chunkNumber = 0;
    let imageCount = 0;

    const fileContent = fs.readFileSync(nftListFilePath, "utf-8");
    const lines = fileContent.split("\n");

    for (const line of lines) {
      if (line) {
        const nftName = line;
        const imageUrl = `https://imagedelivery.net/9i0Mt_dC7lopRIG36ZQvKw/${encodeURIComponent(
          nftName
        )}.png/w=3400`;

        const filename = `${chunkNumber}_imageSet`;
        const destinationPath = path.join(destinationFolder, filename);
        fs.appendFileSync(destinationPath, `${nftName},${imageUrl}\n`);
        imageCount++;
        if (imageCount % chunkSize == 0) {
          imageCount = 0;
          chunkNumber++;
          const filename = `${chunkNumber}_imageSet`;
          const destinationPath = path.join(destinationFolder, filename);
          fs.openSync(destinationPath, "w");
        }
      }
    }
  } catch (error) {
    console.error("Error ", error.message);
  }
}

const nftListFilePath = "nftList.log";
const destinationFolder = path.resolve(__dirname, "./imageChunks");

devideImagesToChunks(nftListFilePath, destinationFolder);
