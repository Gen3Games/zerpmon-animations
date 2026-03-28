const FormData = require("form-data");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { toCamelCase } = require("./createJsonFile");
const env = require("./env-config");

async function uploadToCloudFlareImages(equipmentName) {
  const baseDir = path.join(os.homedir(), "Desktop", "EquipmentAnimations");

  const uploadImageToCloudfareErrorLogFilePath = path.join(
    `${baseDir}/logs/all/error_upload_image.log`,
  );

  const files = [
    {
      id: `${toCamelCase(equipmentName)}-equipment-spritesheet.png`,
      imagePath: path.join(
        `${baseDir}/Spritesheets/${equipmentName}/${toCamelCase(equipmentName)}-equipment-spritesheet.png`,
      ),
    },
    {
      id: `${toCamelCase(equipmentName)}-DeactivatedL`,
      imagePath: path.join(
        `${baseDir}/pngSequences/${equipmentName}/EquipAppearL0001.png`,
      ),
    },
    {
      id: `${toCamelCase(equipmentName)}-DeactivatedR`,
      imagePath: path.join(
        `${baseDir}/pngSequences/${equipmentName}/EquipAppearR0001.png`,
      ),
    },
  ];

  for (const file of files) {
    const formData = new FormData();
    const fileContent = fs.readFileSync(file.imagePath);
    formData.append("file", fileContent);
    formData.append("id", file.id);
    let url = `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/images/v1`;
    let options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.CLOUDFLARE_IMAGES_KEY}`,
      },
      body: formData,
    };

    try {
      const res = await fetch(url, options);
      const json = await res.json();
      // Check the "success" field in the JSON response

      if (json.success) {
        console.log(
          "Uploaded the Spritesheet to Cloudflare Images Successfully",
        );
      } else {
        fs.appendFileSync(
          uploadImageToCloudfareErrorLogFilePath,
          `${equipmentName}\n`,
        );
        console.error("Upload failed");
      }
    } catch (err) {
      console.error("Error:", err);
      fs.appendFileSync(
        uploadImageToCloudfareErrorLogFilePath,
        `${equipmentName}\n`,
      );
    }
  }
}

module.exports = uploadToCloudFlareImages;
