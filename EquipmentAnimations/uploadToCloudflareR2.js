const fs = require("fs");
const axios = require("axios");
const path = require("path");
const os = require("os");
const { toCamelCase } = require("./createJsonFile");

async function uploadToCloudFlareR2(equipmentName) {
  const baseDir = path.join(os.homedir(), "Desktop", "EquipmentAnimations");

  const uploadJsonToCloudfareR2ErrorLogFilePath = path.join(
    `${baseDir}/logs/all/error_upload_r2.log`,
  );
  try {
    // Read JSON file
    const spriteSheetJsonPath = path.join(
      `${baseDir}/Spritesheets/${equipmentName}/${toCamelCase(equipmentName)}-equipment-spritesheet.json`,
    );
    const jsonData = fs.readFileSync(spriteSheetJsonPath);
    // Make PUT request to API endpoint
    const apiUrl = `https://workers-setup.xscapenft.workers.dev/equipment-spritesheet-json/${toCamelCase(equipmentName)}-equipment-spritesheet.json`;
    const response = await axios.put(apiUrl, jsonData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status == 200) {
      console.log(
        `File uploaded to R2 storage successfully. Response status: ${response.status}`,
      );
    } else {
      fs.appendFileSync(
        uploadJsonToCloudfareR2ErrorLogFilePath,
        ` ${equipmentName}\n`,
      );
      console.error("Error uploading file:", error.message);
    }
  } catch (error) {
    fs.appendFileSync(
      uploadJsonToCloudfareR2ErrorLogFilePath,
      ` ${equipmentName}\n`,
    );
    console.error("Error uploading file:", error.message);
  }
}

module.exports = uploadToCloudFlareR2;
