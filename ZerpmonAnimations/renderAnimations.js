const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs").promises;
const fsO = require("fs");
const generateSpritesheet = require("./generateSpritesheet");
const uploadToCloudFlareImages = require("./uploadToCloudflareImages");
const uploadToCloudFlareR2 = require("./uploadToCloudflareR2");

async function renderBlenderAnimation(
  blenderFilePath,
  pythonScriptPath,
  imageFilePath,
  animationName,
  imageName
) {
  return new Promise((resolve, reject) => {
    const renderAnimation = spawn("blender", [
      "-noaudio",
      "-b",
      blenderFilePath,
      "-E",
      "CYCLES",
      "-P",
      pythonScriptPath,
      imageFilePath,
      animationName,
      imageName,
    ]);

    renderAnimation.stdout.on("data", (data) => {
      console.log(`${data}`);
    });

    renderAnimation.stderr.on("data", (data) => {
      console.error(`Python script ERROR: ${data}`);
    });

    renderAnimation.on("close", (code) => {
      if (code !== 1) {
        reject(`Error executing Python script. Exit code: ${code}`);
      } else {
        resolve();
      }
    });
  });
}

// async function generateSpritesheet(nodeScriptPath, textureName) {
//   return new Promise((resolve, reject) => {
//     const renderSpritesheet = spawn("node", [nodeScriptPath, textureName]);

//     renderSpritesheet.stdout.on("data", (nodeData) => {
//       console.log(`${nodeData}`);
//     });

//     renderSpritesheet.stderr.on("data", (nodeErrorData) => {
//       console.error(`Node.js script ERROR: ${nodeErrorData}`);
//     });

//     renderSpritesheet.on("close", (nodeCode) => {
//       if (nodeCode !== 0) {
//         reject(`Error executing Node.js script. Exit code: ${nodeCode}`);
//       } else {
//         resolve();
//       }
//     });
//   });
// }

async function main(animationsPerProcess) {
  const errorLogFilePath = path.resolve(__dirname, "./logs/all/error.log");
  const successLogFilePath = path.resolve(__dirname, "./logs/all/success.log");
  const uploadImageToCloudfareErrorLogFilePath = path.resolve(
    __dirname,
    "./logs/all/error_upload_image.log"
  );
  const uploadJsonToCloudfareR2ErrorLogFilePath = path.resolve(
    __dirname,
    "./logs/all/error_upload_r2.log"
  );

  LogFilePathForRenderAnimation = path.resolve(__dirname, "./logs/all");

  spritesheetsFilePath = path.resolve(__dirname, "./Spritesheets");
  pngSequencesFilePath = path.resolve(__dirname, "./pngSequences");

  // create log directories if they don't exist
  if (!fsO.existsSync(LogFilePathForRenderAnimation)) {
    await fs.mkdir(LogFilePathForRenderAnimation, { recursive: true });
  }

  // create directories if they don't exist
  if (!fsO.existsSync(spritesheetsFilePath)) {
    await fs.mkdir(spritesheetsFilePath);
  }

  if (!fsO.existsSync(pngSequencesFilePath)) {
    await fs.mkdir(pngSequencesFilePath);
  }

  await fs.open(errorLogFilePath, "w");
  await fs.open(successLogFilePath, "w");
  await fs.open(uploadImageToCloudfareErrorLogFilePath, "w");
  await fs.open(uploadJsonToCloudfareR2ErrorLogFilePath, "w");

  const blenderAnimationFiles = [
    "ZerpmonCardAppearanceL",
    // "ZerpmonCardAppearanceR",
    // "ZerpmonCardDestructionL",
    // "ZerpmonCardDestructionR",
    // "ZerpmonJiggleL",
    // "ZerpmonJiggleR",
    // "ZerpmonDamageL",
    // "ZerpmonDamageR",
  ];

  // const [animationName, imageFilePath] = process.argv.slice(2);
  const pythonScriptPath = "generateImageSequence.py";
  const directoryPath = `blenderAnimations/`;

  // use absolute path for ZerpmonImages/ directory
  const zerpmonImagesPath = path.resolve(__dirname, "./ZerpmonImages/");

  try {
    const files = await fs.readdir(zerpmonImagesPath);

    for (const file of files) {
      const fileName = file.slice(0, -4);
      try {
        for (
          let i = 0;
          i < blenderAnimationFiles.length;
          i += animationsPerProcess
        ) {
          const promises = [];
          const fileSlice = blenderAnimationFiles.slice(
            i,
            i + animationsPerProcess
          );
          for (const animationFile of fileSlice) {
            const filePath = `${directoryPath}${animationFile}.blend`;
            promises.push(
              renderBlenderAnimation(
                filePath,
                pythonScriptPath,
                path.resolve(zerpmonImagesPath, file),
                fileName,
                animationFile
              )
            );
          }
          await Promise.all(promises);
        }
        await generateSpritesheet(fileName);

        await uploadToCloudFlareImages(fileName);
        console.log(
          `Images uploaded successfully for ${fileName} to Cloudflare.`
        );

        await uploadToCloudFlareR2(fileName);
        console.log(`R2 uploaded successfully for ${fileName} to Cloudflare.`);

        await fs.appendFile(successLogFilePath, `${fileName}\n`);
      } catch (error) {
        console.error(`Error processing file ${fileName}: ${error}`);
        await fs.appendFile(errorLogFilePath, `${fileName}\n`);
      }
    }

    console.log("All scripts completed successfully");
  } catch (error) {
    console.error(error);
  }
}

const animationsPerProcess = 1;
main(animationsPerProcess);
