const { spawn } = require('child_process');
const fs = require('fs').promises;

async function runPythonScript(blenderFilePath, pythonScriptPath, imageFilePath, animationName, imageName) {
    return new Promise((resolve, reject) => {
        const renderAnimation = spawn('blender', ['-b', blenderFilePath, '-P', pythonScriptPath, imageFilePath, animationName, imageName]);

        renderAnimation.stdout.on('data', (data) => {
            console.log(`${data}`);
        });

        renderAnimation.stderr.on('data', (data) => {
            console.error(`Python script ERROR: ${data}`);
        });

        renderAnimation.on('close', (code) => {
            if (code !== 1) {
                reject(`Error executing Python script. Exit code: ${code}`);
            } else {
                resolve();
            }
        });
    });
}

async function runNodeScript(nodeScriptPath, textureName) {
    return new Promise((resolve, reject) => {
        const renderSpritesheet = spawn('node', [nodeScriptPath, textureName]);

        renderSpritesheet.stdout.on('data', (nodeData) => {
            console.log(`${nodeData}`);
        });

        renderSpritesheet.stderr.on('data', (nodeErrorData) => {
            console.error(`Node.js script ERROR: ${nodeErrorData}`);
        });

        renderSpritesheet.on('close', (nodeCode) => {
            if (nodeCode !== 0) {
                reject(`Error executing Node.js script. Exit code: ${nodeCode}`);
            } else {
                resolve();
            }
        });
    });
}

async function main() {
    if (process.argv.slice(2).length < 2) {
        console.error('Usage: node renderAnimations.js <animationName> <imagePath>');
        console.error('Usage Eg : node renderAnimations.js playerWalking ./player.png');
        process.exit(1);
    }

    const animationFiles = ["EquipmentAppearanceL"]
    const [animationName, imageFilePath] = process.argv.slice(2);
    const pythonScriptPath = 'generateImage.py';
    const directoryPath = `blenderAnimations/`;

    try {
        const files = await fs.readdir(directoryPath);

        for (const animation of animationFiles) {
            const filePath = `${directoryPath}${animation}.blend`;
            await runPythonScript(filePath, pythonScriptPath, imageFilePath, animationName, animation);
        }

        await runNodeScript('generateSpritesheet.js', animationName);
        console.log('All scripts completed successfully');
    } catch (error) {
        console.error(error);
    }
}

main();
