const FormData = require("form-data");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

async function uploadToCloudFlareImages() {
  const folderPath = "Equipment_Dim_V2";

  fs.readdir(folderPath, async (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    for (const file of files) {
      if (path.extname(file) === ".png") {
        const fileContent = fs.readFileSync(path.join(folderPath, file));
        const formData = new FormData();
        formData.append("file", fileContent, { filename: file });
        formData.append("id", file.split(".")[0]);

        let url =
          "https://api.cloudflare.com/client/v4/accounts/f2183aa9a7cd9634f52e696950d49f06/images/v1";

        let options = {
          method: "POST",
          headers: {
            Authorization: "Bearer jDVp8XqiWkFijaCF55gEmqYGnjrtt1bXSmSFFzH6",
          },
          body: formData,
        };

        try {
          const response = await fetch(url, options);
          const json = await response.json();
          console.log(`Uploaded ${file} to Cloudflare Images Successfully`);
        } catch (err) {
          console.error(`Error uploading ${file} to Cloudflare Images:`, err);
        }
      }
    }
  });
}

uploadToCloudFlareImages();
