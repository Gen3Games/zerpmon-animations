const { spawn } = require("child_process");
const fs = require("fs").promises;

async function renderBlenderAnimation(
  blenderFilePath,
  pythonScriptPath,
  imageFilePath,
  animationName,
  imageName
) {
  return new Promise((resolve, reject) => {
    const renderAnimation = spawn("blender", [
      "-b",
      blenderFilePath,
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

async function generateSpritesheet(nodeScriptPath, textureName) {
  return new Promise((resolve, reject) => {
    const renderSpritesheet = spawn("node", [nodeScriptPath, textureName]);

    renderSpritesheet.stdout.on("data", (nodeData) => {
      console.log(`${nodeData}`);
    });

    renderSpritesheet.stderr.on("data", (nodeErrorData) => {
      console.error(`Node.js script ERROR: ${nodeErrorData}`);
    });

    renderSpritesheet.on("close", (nodeCode) => {
      if (nodeCode !== 0) {
        reject(`Error executing Node.js script. Exit code: ${nodeCode}`);
      } else {
        resolve();
      }
    });
  });
}

async function uploadToCloudFlareImages(nodeScriptPath, zerpmon_id) {
  return new Promise((resolve, reject) => {
    const renderSpritesheet = spawn("node", [nodeScriptPath, zerpmon_id]);

    renderSpritesheet.stdout.on("data", (nodeData) => {
      console.log(`${nodeData}`);
    });

    renderSpritesheet.stderr.on("data", (nodeErrorData) => {
      console.error(
        `uploadToCloudFlareImages.js script ERROR: ${nodeErrorData}`
      );
    });

    renderSpritesheet.on("close", (nodeCode) => {
      if (nodeCode !== 0) {
        reject(
          `Error executing uploadToCloudFlareImages.js script. Exit code: ${nodeCode}`
        );
      } else {
        resolve();
      }
    });
  });
}

async function uploadToCloudFlareR2(nodeScriptPath, zerpmon_id) {
  return new Promise((resolve, reject) => {
    const renderSpritesheet = spawn("node", [nodeScriptPath, zerpmon_id]);

    renderSpritesheet.stdout.on("data", (nodeData) => {
      console.log(`${nodeData}`);
    });

    renderSpritesheet.stderr.on("data", (nodeErrorData) => {
      console.error(`uploadToCloudFlareR2.js script ERROR: ${nodeErrorData}`);
    });

    renderSpritesheet.on("close", (nodeCode) => {
      if (nodeCode !== 0) {
        reject(
          `Error executing uploadToCloudFlareR2.js script. Exit code: ${nodeCode}`
        );
      } else {
        resolve();
      }
    });
  });
}

async function main() {
  errroLogFilePath = "./logs/all/error.log";
  successLogFilePath = "./logs/all/success.log";

  await fs.open(errroLogFilePath, "w");
  await fs.open(successLogFilePath, "w");

  const blenderAnimationFiles = [
    "ZerpmonCardAppearanceL",
    "ZerpmonCardAppearanceR",
    "ZerpmonCardDestructionL",
    "ZerpmonCardDestructionR",
    "ZerpmonJiggleL",
    "ZerpmonJiggleR",
    "ZerpmonDamageL",
    "ZerpmonDamageR",
  ];
  const [animationName, imageFilePath] = process.argv.slice(2);
  const pythonScriptPath = "generateImageSequence.py";
  const directoryPath = `blenderAnimations/`;
  const zerpmonImagesPath = "ZerpmonImages/";

  try {
    const files = await fs.readdir(zerpmonImagesPath);

    for (const file of files) {
      try {
        for (const blenderAnimationFile of blenderAnimationFiles) {
          const filePath = `${directoryPath}${blenderAnimationFile}.blend`;
          await renderBlenderAnimation(
            filePath,
            pythonScriptPath,
            `${zerpmonImagesPath}${file}`,
            file.slice(0, -4),
            blenderAnimationFile
          );
        }

        await generateSpritesheet("generateSpritesheet.js", file.slice(0, -4));

        await uploadToCloudFlareImages(
          "uploadToCloudFlareImages.js",
          file.slice(0, -4)
        );

        await uploadToCloudFlareR2(
          "uploadToCloudFlareR2.js",
          file.slice(0, -4)
        );
        fs.appendFileSync(successLogFilePath, `${file.slice(0, -4)}\n`);
      } catch (error) {
        fs.appendFileSync(errroLogFilePath, `${file.slice(0, -4)}\n`);
      }
    }

    console.log("All scripts completed successfully");
  } catch (error) {
    console.error(error);
  }
}

main();
