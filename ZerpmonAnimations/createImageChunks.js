const fs = require("fs");
const path = require("path");
const os = require("os");

async function createImageChunks(start, end) {
  try {
    const baseDir = path.join(os.homedir(), "Desktop", "ZerpmonAnimations");

    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir);
    }
    const destinationFolder = path.join(`${baseDir}/imageChunks`);
    const chunkSize = 200;
    let chunkNumber = 0;
    let imageCount = 0;

    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder);
    }

    for (let zerpmon = start; zerpmon <= end; zerpmon++) {
      const imageUrl = `https://imagedelivery.net/9i0Mt_dC7lopRIG36ZQvKw/zerpmon-full-art-${zerpmon}.png/w=3400`;

      const filename = `${chunkNumber}_imageSet`;
      const destinationPath = path.join(destinationFolder, filename);
      if (imageCount === 0) {
        fs.writeFileSync(destinationPath, `${zerpmon},${imageUrl}\n`);
      } else {
        fs.appendFileSync(destinationPath, `${zerpmon},${imageUrl}\n`);
      }
      imageCount++;
      if (imageCount % chunkSize == 0) {
        imageCount = 0;
        chunkNumber++;
        const filename = `${chunkNumber}_imageSet`;
        const destinationPath = path.join(destinationFolder, filename);
        fs.openSync(destinationPath, "w");
      }
    }
    return Promise.resolve({
      result: true,
      message: "Files successfully read!",
    });
  } catch (error) {
    console.error("Error ", error.message);
    return Promise.resolve({ result: false, message: `Error : ${error}` });
  }
}

module.exports = createImageChunks;
