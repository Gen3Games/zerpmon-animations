const fs = require('fs');
const axios = require('axios');
const path = require('path');

// Function to upload JSON file
async function uploadJSONFile(zerpmonId) {
  const uploadJsonToCloudfareR2ErrorLogFilePath = path.resolve(
    __dirname,
    "./logs/all/error_upload_r2.log"
  );
  try {
    
    // Read JSON file
    const spriteSheetJsonPath = path.resolve(__dirname,`Spritesheets/${zerpmonId}/${zerpmonId}.json`);
    const jsonData = fs.readFileSync(spriteSheetJsonPath);

    // Make PUT request to API endpoint
    const apiUrl = `https://workers-setup.xscapenft.workers.dev/zerpmon-spritesheet-json/${zerpmonId}.json`;

    const response = await axios.put(apiUrl, jsonData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log(`File uploaded to R2 storage successfully. Response status: ${response.status}`);
  } catch (error) {
    fs.appendFileSync(uploadJsonToCloudfareR2ErrorLogFilePath, `${zerpmonId}\n`);
    console.error('Error uploading file:', error.message);
  }
}

// Usage: node uploadToR2.js <filename> <name>
// Example: node uploadToR2.js data.json mydata
const zerpmonId = process.argv[2];

if (!zerpmonId) {
  console.error('Usage: node uploadtoR2.js <filename> <name>');
  process.exit(1);
}

uploadJSONFile(zerpmonId);
