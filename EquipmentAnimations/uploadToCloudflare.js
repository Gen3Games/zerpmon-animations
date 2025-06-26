const FormData = require('form-data');
const fetch = require('node-fetch');
const fs = require('fs');

const formData = new FormData();
const fileContent = fs.readFileSync('./bug-equipment-spritesheet/bug-equipment-spritesheet/bug-equipment-spritesheet.png');

formData.append('file', fileContent);
formData.append('id', '1234567')

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
  .then(json => console.log(json))
  .catch(err => console.error('error:' + err));
