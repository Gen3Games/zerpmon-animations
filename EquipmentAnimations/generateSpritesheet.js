const { packAsync } = require("free-tex-packer-core");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { toCamelCase } = require("./createJsonFile");

async function generateSpritesheet(equipmentName) {
  try {
    const baseDir = path.join(os.homedir(), "Desktop", "EquipmentAnimations");
    const pngSequencePath = path.join(
      `${baseDir}/pngSequences/${equipmentName}`,
    );
    const spritesheetPath = path.join(
      `${baseDir}/Spritesheets/${equipmentName}`,
    );

    let options = {
      // textureName: "equipAppear",
      textureName: equipmentName,
      textureFormat: "png", //defualt
      exporter: "Phaser3",
      removeFileExtension: false, //default
      prependFolderName: false, //defualt
      base64Export: false, //defualt
      tinify: true, //defualt
      tinifyKey: "HgMHbnBKj5x2Fq7GH2TPcKJSRDwbMdy9", //defualt
      scale: 1, //defualt
      // filter: none //default
      width: 3400,
      height: 3400,
      fixedSize: false, //default
      powerOfTwo: false, //default
      padding: 0, //default
      extrude: 0, //default
      allowRotation: false, //default
      allowTrim: true, //default
      //trimMode: trim,   //default
      alphaThreshold: 16,
      detectIdentical: true, //default
      packer: "MaxRectsBin",
      packerMethod: "BestLongSideFit",
    };

    let images = [];

    const files = fs.readdirSync(pngSequencePath);

    for (const file of files) {
      const filePath = path.join(pngSequencePath, file);
      const isFile = fs.statSync(filePath).isFile();

      if (isFile) {
        images.push({ path: filePath, contents: fs.readFileSync(filePath) });
      }
    }

    if (!fs.existsSync(spritesheetPath)) {
      fs.mkdirSync(spritesheetPath, { recursive: true });
    }

    const packedFiles = await packAsync(images, options);

    for (let item of packedFiles) {
      // Writing PNG file
      if (item.name.endsWith(".png")) {
        fs.writeFileSync(
          path.join(
            spritesheetPath,
            `${toCamelCase(item.name.split(".")[0])}-equipment-spritesheet.png`,
          ),
          item.buffer,
        );
        console.log(`${item.name} written successfully.`);
      } // Writing JSON file
      else if (item.name.endsWith(".json")) {
        fs.writeFileSync(
          path.join(
            spritesheetPath,
            `${toCamelCase(item.name.split(".")[0])}-equipment-spritesheet.json`,
          ),
          JSON.stringify(JSON.parse(item.buffer.toString()), null, 2),
        );
        console.log(`${item.name} written successfully.`);
      }
    }
  } catch (error) {
    throw "error in generate spritesheet" + error;
  }
}

module.exports = generateSpritesheet;
