const fs = require("fs/promises");
const path = require("path");
const os = require("os");

function toCamelCase(str) {
  return str
    .trim()
    .split(/[^a-zA-Z0-9]+/) // split on spaces & special chars
    .filter(Boolean)
    .map((word, index) => {
      word = word.toLowerCase();

      if (index === 0) return word;

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join("");
}

async function createJsonFile(files) {
  const baseDir = path.join(os.homedir(), "Desktop", "EquipmentAnimations");
  let jsonFile = {};
  for (const file of files) {
    const equipmentName = file.split(".")[0];
    jsonFile = {
      ...jsonFile,
      [equipmentName]: {
        name: equipmentName,
        png_url: `https://imagedelivery.net/9i0Mt_dC7lopRIG36ZQvKw/${toCamelCase(equipmentName)}-equipment-spritesheet.png/w=3400`,
        json_url: `https://cfr2.zerpmon.world/equipment-spritesheet-json/${toCamelCase(equipmentName)}-equipment-spritesheet.json`,
        deactivatedL_url: `https://imagedelivery.net/9i0Mt_dC7lopRIG36ZQvKw/${toCamelCase(equipmentName)}-DeactivatedL/w=3400`,
        deactivatedR_url: `https://imagedelivery.net/9i0Mt_dC7lopRIG36ZQvKw/${toCamelCase(equipmentName)}-DeactivatedR/w=3400`,
      },
    };
  }

  await fs.writeFile(
    path.join(baseDir, "equipment-spritesheet.json"),
    JSON.stringify(jsonFile, null, 2),
    "utf-8",
    function (err) {
      if (err) {
        console.log(err);
      }
    },
  );
}

module.exports = { createJsonFile, toCamelCase };
