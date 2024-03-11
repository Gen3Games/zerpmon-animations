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

async function devideImagesToChunks(apiUrl, destinationFolder, headers) {
  try {
    // Fetch API data
    const response = await fetch(apiUrl, { headers });
    const data = await response.json();

    const errroLogFilePath = path.join(destinationFolder, "error.log");
    fs.openSync(errroLogFilePath, "w");

    const chunkSize = 50;
    let chunkNumber = 0;
    let imageCount = 0;
    for (const item of data) {
      const ipfsGatewayUrl = "https://ipfs.io/ipfs/";

      // Replace 'ipfs://' with the IPFS gateway URL
      const apiUrl = item.uri.replace("ipfs://", ipfsGatewayUrl);

      try {
        const ipfsResponse = await fetch(apiUrl);
        const ipfsData = await ipfsResponse.json();

        const imageUrl = `https://imagedelivery.net/9i0Mt_dC7lopRIG36ZQvKw/${encodeURIComponent(
          ipfsData.name
        )}.png/w=3400`;

        const nftId = `${item.nft_id}`;
        const filename = `${chunkNumber}_imageSet`;
        const destinationPath = path.join(destinationFolder, filename);

        fs.appendFileSync(destinationPath, `${nftId},${imageUrl}\n`);

        imageCount++;
        if (imageCount % chunkSize == 0) {
          imageCount = 0;
          chunkNumber++;
          const filename = `${chunkNumber}_imageSet`;
          const destinationPath = path.join(destinationFolder, filename);
          fs.openSync(destinationPath, "w");
        }
      } catch (error) {
        fs.appendFileSync(errroLogFilePath, `${nftId},${imageUrl}\n`);
        console.error("Error fetching IPFS data:", error);
      }
    }
  } catch (error) {
    console.error("Error fetching API data:", error.message);
  }
}

// Example usage: Download 2 images
const apiUrl = "https://app.zerpmon.world/api/zerpmons";
const destinationFolder = "./imageChunks";
const headers = {
  Authorization: "Bearer aSxZ8Q1KkuTV8KTLUzI9jdAciGLCgHcI",
};

devideImagesToChunks(apiUrl, destinationFolder, headers);
