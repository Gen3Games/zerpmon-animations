const fs = require("fs").promises;
const path = require("path");

const lol = [
  "BlueShieldExplodeWithAppear",
  "Bug",
  "Cosmic",
  "Dark",
  "Dragon",
  "Electric",
  "Fairy",
  "Fire",
  "Flying",
  "Ghost",
  "Grass",
  "Ground",
  "Ice",
  "Normal",
  "Poison",
  "Psychic",
  "BlueShieldAppear",
  "Steel",
];

async function renameFiles() {
  for (const image of lol) {
    const folders = [
      `LongRangeAnimation/${image}/L`,
      `LongRangeAnimation/${image}/R`,
    ]; // List of folders
    const prefixMap = {
      [`LongRangeAnimation/${image}/L`]: "AttackL",
      [`LongRangeAnimation/${image}/R`]: "AttackR",
    };
    for (const folder of folders) {
      const files = await fs.readdir(folder);

      // Iterate through each file in the folder
      for (const file of files) {
        const extname = path.extname(file);
        const basename = path.basename(file, extname);
        const newFilename = `${prefixMap[folder]}${basename
          .slice(-4)
          .padStart(4, "0")}${extname}`;

        // Construct the old and new paths
        const oldPath = path.join(folder, file);
        const newPath = path.join(folder, newFilename);

        // Rename the file
        await fs.rename(oldPath, newPath);
      }
    }
  }
}

// Call the function to start renaming files
renameFiles()
  .then(() => console.log("All files renamed successfully."))
  .catch((error) => console.error("Error renaming files:", error));
