const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

async function checkMissingNfts(chunkfilePath) {
  try {
    const filenames = fs.readdirSync(chunkfilePath);

    let filesPaths = [];
    let addedNftList = [];
    let missingNftList = [];
    filenames.forEach((file) => {
      filesPaths.push(path.resolve(chunkfilePath, file));
    });

    for (const filesPath of filesPaths) {
      const fileContent = fs.readFileSync(filesPath, "utf-8");
      const lines = fileContent.split("\n");
      let imageCount = 0;
      for (const line of lines) {
        if (line) {
          const lineSplited = line.split(",");
          const nftId = lineSplited[0];
          addedNftList.push(nftId);
        }
      }
    }

    console.log("addedNftList Length", addedNftList.length);

    const apiUrl = "https://preview.zerpmon.world/api/zerpmons";
    const headers = {
      Authorization: "Bearer aSxZ8Q1KkuTV8KTLUzI9jdAciGLCgHcI",
    };

    const response = await fetch(apiUrl, { headers });
    const data = await response.json();

    const ipfsGatewayUrl = "https://ipfs.io/ipfs/";

    for (const item of data) {
      const nftId = `${item.nft_id}`;
      if (!addedNftList.includes(nftId)) {
        missingNftList.push(nftId);
        if (item.hasOwnProperty("uri")) {
          const apiUrl = item.uri.replace("ipfs://", ipfsGatewayUrl);
          const ipfsResponse = await fetch(apiUrl);
          const ipfsData = await ipfsResponse.json();

          const imageUrl = `https://imagedelivery.net/9i0Mt_dC7lopRIG36ZQvKw/${encodeURIComponent(
            ipfsData.name
          )}.png/w=3400`;

          console.log(nftId);
          console.log(imageUrl);
        }
      }
    }

    //   console.log(missingNftList);
  } catch (error) {
    console.log(error);
  }
}

const chunkfilePath = path.resolve(__dirname, "./imageChunks");
checkMissingNfts(chunkfilePath);
