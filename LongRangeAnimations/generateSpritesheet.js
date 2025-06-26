let texturePacker = require("free-tex-packer-core");
const fs = require("fs");

const args = process.argv.slice(2);

const textureName = args[0];

let scales = [0.5, 0.75, 1];
let types = ["left", "right"];

types.forEach((type) => {
  let options = {
    textureName: textureName,
    textureFormat: "png",
    exporter: "Phaser3",
    removeFileExtension: false,
    prependFolderName: false,
    base64Export: false,
    tinify: true,
    tinifyKey: "mZmdM3QSN180BlBXDBdkh5jK5Z1LsQ7J",
    scale: 1, // Set the scale here
    width: 2200,
    height: 2200,
    fixedSize: false,
    powerOfTwo: false,
    padding: 0,
    extrude: 0,
    allowRotation: false,
    allowTrim: true,
    alphaThreshold: 10,
    detectIdentical: true,
    packer: "MaxRectsBin",
    packerMethod: "BestLongSideFit",
  };

  const path = [`LongRangeAnimation/${`Cosmic`}/${type[0].toUpperCase()}`];

  let images = [];

  for (const p of path) {
    const files = fs.readdirSync(p);

    for (const file of files) {
      const filePath = `${p}/${file}`;

      // Check if the item is a file (not a directory)
      const isFile = fs.statSync(filePath).isFile();

      if (isFile) {
        images.push({ path: filePath, contents: fs.readFileSync(filePath) });
      }
    }

    if (!fs.existsSync(`Spritesheet/${textureName}`)) {
      fs.mkdirSync(`Spritesheet/${textureName}`, { recursive: true });
    }
  }

  texturePacker(images, options, (files, error) => {
    if (error) {
      console.error("Packaging failed", error);
    } else {
      for (let item of files) {
        // Writing PNG file
        if (item.name.endsWith(".png")) {
          fs.writeFileSync(
            `${"Spritesheet"}/${textureName}/${item.name.slice(
              0,
              -4
            )}-${type}-${options.scale}x.png`,
            item.buffer
          );
          console.log(`${item.name} written successfully.`);
        }
        // Writing JSON file
        else if (item.name.endsWith(".json")) {
          fs.writeFileSync(
            `${"Spritesheet"}/${textureName}/${item.name.slice(
              0,
              -5
            )}-${type}-${options.scale}x.json`,
            JSON.stringify(JSON.parse(item.buffer.toString()), null, 2)
          );
          console.log(`${item.name} written successfully.`);
        }
      }
    }
  });
});
