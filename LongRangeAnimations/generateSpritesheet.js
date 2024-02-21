let texturePacker = require("free-tex-packer-core");
const fs = require('fs');

const args = process.argv.slice(2);

const textureName = args[0];


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
    width: 5000,
    height: 5000,
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

const path = ["Attack/Flying/L", "Attack/Flying/R"]

let images = [];


for(const p of path) {
    const files = fs.readdirSync(p);

    for (const file of files) {
        const filePath = `${p}/${file}`;
    
        // Check if the item is a file (not a directory)
        const isFile = fs.statSync(filePath).isFile();
    
        if (isFile) {
            images.push({ path: filePath, contents: fs.readFileSync(filePath) });
        }
    }
    
    if (!fs.existsSync('Spritesheet')) {
        fs.mkdirSync('Spritesheet', { recursive: true });
    }
    
    
    
}

texturePacker(images, options, (files, error) => {
    if (error) {
        console.error('Packaging failed', error);
    } else { 
        for (let item of files) {
            // Writing PNG file
            if (item.name.endsWith('.png')) {
                fs.writeFileSync(`${'Spritesheet'}/${item.name}`, item.buffer);
                console.log(`${item.name} written successfully.`);
            }
            // Writing JSON file
            else if (item.name.endsWith('.json')) {
                fs.writeFileSync(`${'Spritesheet'}/${item.name}`, JSON.stringify(JSON.parse(item.buffer.toString()), null, 2));
                console.log(`${item.name} written successfully.`);
            }
        }
    }
});
