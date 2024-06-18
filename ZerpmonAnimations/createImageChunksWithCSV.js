const fs = require("fs").promises;
const path = require("path");
const os = require("os");

async function createImageChunksWithCSV(data) {
  try {
    const baseDir = path.join(os.homedir(), "Desktop", "ZerpmonAnimations");

    // Check if the directory exists and create it if it doesn't
    await fs.mkdir(baseDir, { recursive: true });

    // Check if the directory is empty
    const files = await fs.readdir(baseDir);
    if (files.length > 0) {
      return {
        result: false,
        message: `ZerpmonAnimations Folder already exists, Please clear it`,
      };
    }

    const lines = data.trim().split("\n");
    let chunkNumber = 0;
    const destinationFolder = path.join(baseDir, "imageChunks");

    await fs.mkdir(destinationFolder, { recursive: true });

    const filename = `${chunkNumber}_imageSet`;
    const destinationPath = path.join(destinationFolder, filename);

    for (const line of lines) {
      const fields = line.split(",");
      const ZerpmonNumber = fields[0];

      if (!isNaN(ZerpmonNumber) && ZerpmonNumber !== "") {
        const imageUrl = `https://imagedelivery.net/9i0Mt_dC7lopRIG36ZQvKw/zerpmon-full-art-${ZerpmonNumber}.png/w=3400`;
        await fs.appendFile(destinationPath, `${ZerpmonNumber},${imageUrl}\n`);
        console.log(`Zerpmon Number ${ZerpmonNumber} appended`);
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

module.exports = createImageChunksWithCSV;
