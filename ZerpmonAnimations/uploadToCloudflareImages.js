const FormData = require("form-data");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const os = require("os");
const env = require("./env-config");

let types = ["left", "right"];
let scales = ["05x", "075x", "1x"];

async function uploadToCloudFlareImages(zerpmonNumber) {
  const baseDir = path.join(os.homedir(), "Desktop", "ZerpmonAnimations");

  for (const type of types) {
    for (const scale of scales) {
      const uploadImageToCloudfareErrorLogFilePath = path.join(
        `${baseDir}/logs/all/error_upload_image.log`,
      );
      const formData = new FormData();
      const spriteSheetImagePath = path.join(
        `${baseDir}/Spritesheets/${zerpmonNumber}/${zerpmonNumber}-${type}-${scale}-spritesheet.png`,
      );
      const fileContent = fs.readFileSync(spriteSheetImagePath);
      formData.append("file", fileContent);
      formData.append(
        "id",
        `${zerpmonNumber}-${type}-${scale}-spritesheet.png`,
      );
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
            `${zerpmonNumber}_${type}\n`,
          );
          console.error("Upload failed");
        }
      } catch (err) {
        console.error("Error:", err);
        fs.appendFileSync(
          uploadImageToCloudfareErrorLogFilePath,
          `${zerpmonNumber}_${type}_${scale}\n`,
        );
      }
    }
  }
}

module.exports = uploadToCloudFlareImages;
