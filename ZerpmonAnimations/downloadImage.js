const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Function to download image from URL
async function downloadImage(url, destinationPath) {
    const response = await fetch(url);
    const buffer = await response.buffer();
    fs.writeFileSync(destinationPath, buffer);
    console.log('Image downloaded successfully:', destinationPath);
}

async function fetchAndDownloadImage(apiUrl, destinationFolder, headers) {
    if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder);
    }

    try {
        // Fetch API data
        const response = await fetch(apiUrl, { headers });
        const data = await response.json();

        // Iterate over each object in the array
        for (const item of data) {
            const ipfsGatewayUrl = "https://cloudflare-ipfs.com/ipfs/";

            // Replace 'ipfs://' with the IPFS gateway URL
            const apiUrl = item.uri.replace("ipfs://", ipfsGatewayUrl);

            try {
                const ipfsResponse = await fetch(apiUrl);
                const ipfsData = await ipfsResponse.json();

                const imageUrl = `https://imagedelivery.net/9i0Mt_dC7lopRIG36ZQvKw/${encodeURIComponent(ipfsData.name)}.png/w=3400`;

                const filename = `${item.nft_id}.png`;
                const destinationPath = path.join(destinationFolder, filename);

                // Check if the file already exists in the destination folder
                if (!fs.existsSync(destinationPath)) {
                    // Download image only if it doesn't exist
                    await downloadImage(imageUrl, destinationPath);
                } else {
                    console.log('Image already exists, skipping:', destinationPath);
                }
            } catch (error) {
                console.error("Error fetching IPFS data:", error);
            }

            break;
        }
    } catch (error) {
        console.error('Error fetching API data:', error.message);
    }
}

// Example usage
const apiUrl = 'https://app.zerpmon.world/api/zerpmons';
const destinationFolder = './ZerpmonImages';
const headers = {
    'Authorization': 'Bearer aSxZ8Q1KkuTV8KTLUzI9jdAciGLCgHcI',
};

fetchAndDownloadImage(apiUrl, destinationFolder, headers);
