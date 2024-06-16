const fs = require("fs");
const path = require("path");
const os = require("os");

async function createImageChunksWithCSV(data) {
  try {
    const baseDir = path.join(os.homedir(), "Desktop", "ZerpmonAnimations");

    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    const lines = data.trim().split("\n");
    let chunkNumber = 0;
    const destinationFolder = path.join(baseDir, "imageChunks");

    const filename = `${chunkNumber}_imageSet`;
    const destinationPath = path.join(destinationFolder, filename);

    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder, { recursive: true });
    }

    if (fs.existsSync(destinationPath)) {
      fs.unlinkSync(destinationPath);
    }

    lines.forEach((line) => {
      const fields = line.split(",");
      const ZerpmonNumber = fields[0];

      if (!isNaN(ZerpmonNumber) && ZerpmonNumber !== "") {
        const imageUrl = `https://imagedelivery.net/9i0Mt_dC7lopRIG36ZQvKw/zerpmon-full-art-${ZerpmonNumber}.png/w=3400`;
        fs.appendFileSync(
          destinationPath,
          `${ZerpmonNumber},${imageUrl}\n`,
          (err) => {
            if (err) {
              console.error("Error appending to file:", err);
              return;
            }
            console.log(`Zerpmon Number ${ZerpmonNumber} appended`);
          }
        );
      }
    });

    return Promise.resolve({
      result: true,
      message: "Files successfully read!",
    });
  } catch (error) {
    console.error("Error ", error.message);
    return Promise.resolve({ result: false, message: `Error : ${error}` });
  }
}

module.exports = createImageChunksWithCSV;
