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
    try {
        // Fetch API data
        const response = await fetch(apiUrl, { headers });
        const data = await response.json();
        
        // Iterate over each object in the array
        for (const item of data) {
            const ipfsGatewayUrl = "https://ipfs.io/ipfs/";

            // Replace 'ipfs://' with the IPFS gateway URL
            const apiUrl = item.uri.replace("ipfs://", ipfsGatewayUrl);

            try {
                const ipfsResponse = await fetch(apiUrl);
                const ipfsData = await ipfsResponse.json();

                const imageUrl = `https://imagedelivery.net/9i0Mt_dC7lopRIG36ZQvKw/${encodeURIComponent(ipfsData.name)}.png/w=3400`;

                const filename = `${item.nft_id}.png`;
                const destinationPath = path.join(destinationFolder, filename);
                console.log(imageUrl);
                
                // Download image
                await downloadImage(imageUrl, destinationPath);
            } catch (error) {
                console.error("Error fetching IPFS data:", error);
            }
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
