const fs = require("fs").promises;
const path = require("path");
const os = require("os");

async function createImageChunks(start, end) {
  try {
    const baseDir = path.join(os.homedir(), "Desktop", "ZerpmonAnimations");

    try {
      await fs.mkdir(baseDir, { recursive: true });
    } catch (err) {
      throw new Error(`Failed to create directory: ${err.message}`);
    }

    const files = await fs.readdir(baseDir);
    if (files.length > 0) {
      return {
        result: false,
        message: `ZerpmonAnimations Folder already exists, Please clear it`,
      };
    }

    const destinationFolder = path.join(baseDir, "imageChunks");
    const chunkSize = 200;
    let chunkNumber = 0;
    let imageCount = 0;

    await fs.mkdir(destinationFolder, { recursive: true });

    for (let zerpmon = start; zerpmon <= end; zerpmon++) {
      const imageUrl = `https://imagedelivery.net/9i0Mt_dC7lopRIG36ZQvKw/zerpmon-full-art-${zerpmon}.png/w=3400`;
      const filename = `${chunkNumber}_imageSet`;
      const destinationPath = path.join(destinationFolder, filename);

      if (imageCount === 0) {
        await fs.writeFile(destinationPath, `${zerpmon},${imageUrl}\n`);
      } else {
        await fs.appendFile(destinationPath, `${zerpmon},${imageUrl}\n`);
      }

      imageCount++;
      if (imageCount % chunkSize === 0) {
        imageCount = 0;
        chunkNumber++;
        const newFilename = `${chunkNumber}_imageSet`;
        const newDestinationPath = path.join(destinationFolder, newFilename);
        await fs.writeFile(newDestinationPath, ""); // Create new file
      }
    }

    return {
      result: true,
      message: "Files successfully read!",
    };
  } catch (error) {
    console.error("Error ", error.message);
    return {
      result: false,
      message: `ZerpmonAnimations Folder already exists, Please clear it`,
    };
  }
}

module.exports = createImageChunks;
