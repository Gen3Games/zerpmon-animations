const texturePacker = require("free-tex-packer-core");
const { packAsync } = require("free-tex-packer-core");
const fs = require("fs");
const path = require("path");
const os = require("os");

let scales = [0.5, 0.75, 1];

async function generateSpritesheet(zerpmonName) {
  try {
    const baseDir = path.join(os.homedir(), "Desktop", "ZerpmonAnimations");
    const pngSequencePath = path.join(`${baseDir}/pngSequences/${zerpmonName}`);
    const spritesheetPath = path.join(`${baseDir}/Spritesheets/${zerpmonName}`);

    for (let index in scales) {
      const scale = scales[index];
      let options = {
        textureName: zerpmonName,
        textureFormat: "png", //default
        exporter: "Phaser3",
        removeFileExtension: false, //default
        prependFolderName: false, //default
        base64Export: false, //default
        tinify: true, //default
        tinifyKey: "HgMHbnBKj5x2Fq7GH2TPcKJSRDwbMdy9", //default
        scale: scale, //default
        width: 2150,
        height: 2150,
        fixedSize: false, //default
        powerOfTwo: false, //default
        padding: 0, //default
        extrude: 0, //default
        allowRotation: false, //default
        allowTrim: true, //default
        alphaThreshold: 10,
        detectIdentical: true, //default
        packer: "MaxRectsBin",
        packerMethod: "BestLongSideFit",
      };

      const files = fs.readdirSync(pngSequencePath);

      const leftFiles = [];
      const rightFiles = [];

      for (const file of files) {
        const filePath = path.join(pngSequencePath, file);
        const isFile = fs.statSync(filePath).isFile();
        if (isFile) {
          const fileName = file.slice(0, -4); // Remove the file extension
          const category = fileName.slice(-5, -4);
          if (category === "L") {
            leftFiles.push({
              path: filePath,
              contents: fs.readFileSync(filePath),
            });
          } else if (category === "R") {
            rightFiles.push({
              path: filePath,
              contents: fs.readFileSync(filePath),
            });
          }
        }
      }

      if (!fs.existsSync(spritesheetPath)) {
        fs.mkdirSync(spritesheetPath, { recursive: true });
      }

      const tpFilesLeft = await packAsync(leftFiles, options);
      for (let item of tpFilesLeft) {
        // Writing PNG file
        if (item.name.endsWith(".png")) {
          fs.writeFileSync(
            path.join(
              spritesheetPath,
              `${item.name.slice(0, -4)}-left-${options.scale
                .toString()
                .replace(/\./g, "")}x-spritesheet.png`
            ),
            item.buffer
          );
          console.log(`${item.name} left written successfully.`);
        } // Writing JSON file
        else if (item.name.endsWith(".json")) {
          fs.writeFileSync(
            path.join(
              spritesheetPath,
              `${item.name.slice(0, -5)}-left-${options.scale
                .toString()
                .replace(/\./g, "")}x.json`
            ),
            JSON.stringify(JSON.parse(item.buffer.toString()), null, 2)
          );
          console.log(`${item.name} left written successfully.`);
        }
      }

      const tpFilesRight = await packAsync(rightFiles, options);
      for (let item of tpFilesRight) {
        // Writing PNG file
        if (item.name.endsWith(".png")) {
          fs.writeFileSync(
            path.join(
              spritesheetPath,
              `${item.name.slice(0, -4)}-right-${options.scale
                .toString()
                .replace(/\./g, "")}x-spritesheet.png`
            ),
            item.buffer
          );
          console.log(`${item.name} right written successfully.`);
        } // Writing JSON file
        else if (item.name.endsWith(".json")) {
          fs.writeFileSync(
            path.join(
              spritesheetPath,
              `${item.name.slice(0, -5)}-right-${options.scale
                .toString()
                .replace(/\./g, "")}x.json`
            ),
            JSON.stringify(JSON.parse(item.buffer.toString()), null, 2)
          );
          console.log(`${item.name} right written successfully.`);
        }
      }
    }
  } catch (error) {
    throw "error in generate spritesheet";
  }
}

module.exports = generateSpritesheet;
