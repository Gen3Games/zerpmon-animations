# How to generate the Equipment animations

Setup Blender CLI on the machine<br>

Install Blender - [https://www.blender.org/download/](https://www.blender.org/download/)

## [Windows](https://docs.blender.org/manual/en/latest/advanced/command_line/launch/windows.html)

1. Go to the location where Blender is installed</br>

(C:\Program Files\Blender Foundation\Blender\blender.exe)

2. Copy the path

3. Add this path to your system `PATH` variable in the machine

https://www.architectryan.com/2018/03/17/add-to-the-path-on-windows-10/

## [MacOS](https://docs.blender.org/manual/en/latest/advanced/command_line/launch/macos.html)

1. Copy the location where Blender is installed</br>

( /Applications/Blender.app/Contents/MacOS/Blender )

2. Add this directory to your machine `PATH`

## Rendering Equipment Animation

// Left Side
Open the `EquipmentAppearenceL.blend` file in the `blenderAnimations` folder and add the relevant equipment png into first node in the `Shader Nodetree` and render the animation. Frame names should be in the format,

```
EquipAppearL0001.png
EquipAppearL0002.png
EquipAppearL0003.png
```

// Right Side
Open the `EquipmentAppearenceR.blend` file in the `blenderAnimations` folder and add the relevant equipment png into first node in the `Shader Nodetree` and render the animation into the same folder as above. Frame names should be in the format,

```
EquipAppearL0001.png
EquipAppearL0002.png
EquipAppearL0003.png
```

- Change the `spritesheetPath` variable in the `generateSpritesheet.js` file if needed so that it is directed to the parent directory of the png sequences

- Run the `generateSpritesheet.js` file by `node generateSpritesheet.js {textureName}`

```
node generateSpritesheet.js water-equipment-spritesheet
```

- This will render the spritesheet for that equipment

- Upload the spritesheet png's to cloudflare images and include the url with `w=3400` in the `equipment-spritesheets.json` file in the Zerpmon repo.

- Upload the spritesheet json files to the R2 Object storage in cloudflare in the `zerpmon/attack-spritesheet-scaled-json/` bucket, and include the url in `equipment-spritesheets.json` file in the Zerpmon repo.

## Rendering Dim Equipment

// Left Side
Open the `DimEquipmentL.blend` file in the `blenderAnimations` folder and add the relevant equipment png into first node in the `Shader Nodetree` and render the animation. Frame name should be in the format,

```
{EquipmentName}DeactivatedL.png
```

// Right Side
Open the `DimEquipmentR.blend` file in the `blenderAnimations` folder and add the relevant equipment png into first node in the `Shader Nodetree` and render the animation. Frame name should be in the format,

```
{EquipmentName}DeactivatedR.png
```

- Upload the png to cloudflare images and include the url with `w=3400` in the `equipment-spritesheets.json` file into `deactivatedL_url` and `deactivatedR_url` field in the Zerpmon repo.
