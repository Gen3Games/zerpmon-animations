const FormData = require("form-data");
const fetch = require("node-fetch");
const fs = require("fs");

const formData = new FormData();
const fileContent = fs.readFileSync(
  "./bug-equipment-spritesheet/bug-equipment-spritesheet/bug-equipment-spritesheet.png"
);

formData.append("file", fileContent);
formData.append("id", "1234567");

let url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`;

let options = {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGES_KEY}`,
  },
  body: formData,
};

fetch(url, options)
  .then((res) => res.json())
  .then((json) => console.log(json))
  .catch((err) => console.error("error:" + err));
