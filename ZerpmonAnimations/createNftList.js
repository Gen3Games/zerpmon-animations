const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

async function devideImagesToChunks(apiUrl, destinationFile, headers) {
  try {
    // Fetch API data
    const response = await fetch(apiUrl, { headers });
    const data = await response.json();

    for (const item of data) {
      const ipfsGatewayUrl = "https://ipfs.io/ipfs/";

      const apiUrl = item.uri.replace("ipfs://", ipfsGatewayUrl);

      try {
        const ipfsResponse = await fetch(apiUrl);
        const ipfsData = await ipfsResponse.json();
        const nftName = ipfsData.name;

        const destinationPath = path.join(destinationFile);

        fs.appendFileSync(destinationPath, `${nftName}\n`);
      } catch (error) {
        console.error("Error saving data", error);
      }
    }
  } catch (error) {
    console.error("Error fetching API data:", error.message);
  }
}

const apiUrl = "https://app.zerpmon.world/api/zerpmons";
const fileName = "nftList.log";
const destinationFile = path.resolve(__dirname, fileName);
const headers = {
  Authorization: "Bearer aSxZ8Q1KkuTV8KTLUzI9jdAciGLCgHcI",
};

devideImagesToChunks(apiUrl, destinationFile, headers);
