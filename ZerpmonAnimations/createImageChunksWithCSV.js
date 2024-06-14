const fs = require("fs");
const path = require("path");

async function createImageChunksWithCSV(data) {
  try {
    const lines = data.trim().split("\n");
    let chunkNumber = 0;
    const destinationFolder = path.resolve(__dirname, "./imageChunks");
    const filename = `${chunkNumber}_imageSet`;
    const destinationPath = path.join(destinationFolder, filename);

    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder);
    }

    if (fs.existsSync(destinationPath)) {
      fs.unlinkSync(destinationPath);
    }

    lines.forEach((line) => {
      const fields = line.split(",");
      const ZerpmonNumber = fields[0];

      // Check if the first column is a number
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
