const fs = require("fs");
const axios = require("axios");
const path = require("path");

let types = ['left', 'right'];
let scales = ['05x', '075x', '1x'];

async function uploadToCloudflareR2(zerpmonNumber) {
  for (const type of types) {
    for (const scale of scales) {
      console.log(`${zerpmonNumber}_${type}_${scale}`)
      const uploadJsonToCloudfareR2ErrorLogFilePath = path.resolve(
        __dirname,
        "./logs/all/error_upload_r2.log"
      );
      try {
        // Read JSON file
        const spriteSheetJsonPath = path.resolve(
          __dirname,
          `Spritesheets/${zerpmonNumber}/${zerpmonNumber}_${type}_${scale}.json`
        );
        const jsonData = fs.readFileSync(spriteSheetJsonPath);
        // Make PUT request to API endpoint
        const apiUrl = `https://workers-setup.xscapenft.workers.dev/zerpmon-spritesheet-test-json/${zerpmonNumber}_${type}_${scale}.json`;
        const response = await axios.put(apiUrl, jsonData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(
          `File uploaded to R2 storage successfully. Response status: ${response.status}`
        );
      } catch (error) {
        fs.appendFileSync(
          uploadJsonToCloudfareR2ErrorLogFilePath,
          `${zerpmonNumber}_${type}_${scale}\n`
        );
        console.error("Error uploading file:", error.message);
      }

    }

  }
}

module.exports = uploadToCloudflareR2;
