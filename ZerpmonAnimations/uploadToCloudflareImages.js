const FormData = require('form-data');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length < 1) {
    console.error('Usage: node generateSpritesheet.js <textureName>');
    process.exit(1);
}

const zerpmonId = args[0];

async function uploadToCloudFlareImages() {
    const formData = new FormData();
    const spriteSheetImagePath = path.resolve(__dirname,`Spritesheets/${zerpmonId}/${zerpmonId}.png`);
    const fileContent = fs.readFileSync(spriteSheetImagePath);
    
    
    formData.append('file', fileContent);
    formData.append('id', `${zerpmonId}_spritesheet`)
    
    let url = 'https://api.cloudflare.com/client/v4/accounts/f2183aa9a7cd9634f52e696950d49f06/images/v1';
    
    let options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer jDVp8XqiWkFijaCF55gEmqYGnjrtt1bXSmSFFzH6'
      },
      body: formData
    };
    
    fetch(url, options)
      .then(res => res.json())
      .then(json => console.log("Uploaded the Spritesheet to Cloudflare Images Successfully"))
      .catch(err => console.error('error:' + err));
}


uploadToCloudFlareImages();

