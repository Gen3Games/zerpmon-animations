let texturePacker = require("free-tex-packer-core");
const fs = require('fs');

const args = process.argv.slice(2);

if (args.length < 1) {
    console.error('Usage: node generateSpritesheet.js <textureName>');
    process.exit(1);
}

const textureName = args[0];
const pngSequencePath = `pngSequences/${textureName}`
const spritesheetPath = `Spritesheets/${textureName}`;

let options = {
    // textureName: "equipAppear",
    textureName: textureName,
    textureFormat: "png",   //defualt
    exporter: "Phaser3",
    removeFileExtension: false, //default
    prependFolderName: false,   //defualt
    base64Export: false,    //defualt
    tinify: true,  //defualt
    tinifyKey: "mZmdM3QSN180BlBXDBdkh5jK5Z1LsQ7J",  //defualt
    scale: 1,   //defualt
    // filter: none //default
    width: 3400,
    height: 3400,
    fixedSize: false,   //default
    powerOfTwo: false,  //default
    padding: 0,     //default
    extrude: 0,     //default
    allowRotation: false,   //default
    allowTrim: true,    //default
    //trimMode: trim,   //default
    alphaThreshold: 16,
    detectIdentical: true,  //default
    packer: "MaxRectsBin",
    packerMethod: "BestLongSideFit",
};

let images = [];

const files = fs.readdirSync(pngSequencePath);

for (const file of files) {
    const filePath = `${pngSequencePath}/${file}`;

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
        console.error('Packaging failed', error);
    } else {  
        for (let item of files) {
            // Writing PNG file
            if (item.name.endsWith('.png')) {
                fs.writeFileSync(`${spritesheetPath}/${item.name}`, item.buffer);
                console.log(`${item.name} written successfully.`);
            }
            // Writing JSON file
            else if (item.name.endsWith('.json')) {
                fs.writeFileSync(`${spritesheetPath}/${item.name}`, JSON.stringify(JSON.parse(item.buffer.toString()), null, 2));
                console.log(`${item.name} written successfully.`);
            }
        }
    }
});
