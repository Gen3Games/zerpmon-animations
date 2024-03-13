const texturePacker = require("free-tex-packer-core");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);

if (args.length < 1) {
  console.error("Usage: node generateSpritesheet.js <textureName>");
  process.exit(1);
}

const textureName = args[0];
const pngSequencePath = path.resolve(__dirname, `pngSequences/${textureName}`);
const spritesheetPath = path.resolve(__dirname, `Spritesheets/${textureName}`);

let options = {
  textureName: textureName,
  textureFormat: "png", //default
  exporter: "Phaser3",
  removeFileExtension: false, //default
  prependFolderName: false, //default
  base64Export: false, //default
  tinify: true, //default
  tinifyKey: "HgMHbnBKj5x2Fq7GH2TPcKJSRDwbMdy9", //default
  scale: 1, //default
  width: 4000,
  height: 4000,
  fixedSize: false, //default
  powerOfTwo: false, //default
  padding: 0, //default
  extrude: 0, //default
  allowRotation: false, //default
  allowTrim: true, //default
  alphaThreshold: 16,
  detectIdentical: true, //default
  packer: "MaxRectsBin",
  packerMethod: "BestLongSideFit",
};

let images = [];

const files = fs.readdirSync(pngSequencePath);

for (const file of files) {
  const filePath = path.join(pngSequencePath, file);

  // Check if the item is a file (not a directory)
  const isFile = fs.statSync(filePath).isFile();

  if (isFile) {
    images.push({ path: filePath, contents: fs.readFileSync(filePath) });
  }
}

if (!fs.existsSync(spritesheetPath)) {
  fs.mkdirSync(spritesheetPath, { recursive: true });
}

texturePacker(images, options, (files, error) => {
  if (error) {
    console.error("Packaging failed", error);
  } else {
    for (let item of files) {
      // Writing PNG file
      if (item.name.endsWith(".png")) {
        fs.writeFileSync(path.join(spritesheetPath, item.name), item.buffer);
        console.log(`${item.name} written successfully.`);
      }
      // Writing JSON file
      else if (item.name.endsWith(".json")) {
        fs.writeFileSync(
          path.join(spritesheetPath, item.name),
          JSON.stringify(JSON.parse(item.buffer.toString()), null, 2)
        );
        console.log(`${item.name} written successfully.`);
      }
    }
  }
});
