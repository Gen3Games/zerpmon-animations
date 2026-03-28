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

## Creating EquipmentAnimations app setup

1. Run `npm install` in the `EquipmentAnimations` directory

2. Run `npm run make` to create application, it will create the `Equipment Animations` app in the `out` directory

## Rendering Equipment Animation

1. Run `npm run make` to create application, it will create the `Equipment Animations` app in the `out` directory

2. Open the `Equipment Animations` app

3. Upload full art PNGs of the equipment and click `Render`

4. The app will create a `EquipmentAnimations` folder in the Desktop and start rendering the animations.

5. Once the animations are done, the app will create a `equipment-spritesheet.json` file in the `EquipmentAnimations` directory.

6. <span style="color: red;">Copy the contents of the `equipment-spritesheet.json` file and update the [`equipment-spritesheet.json`](https://github.com/Gen3Games/zerpmon-web-app/blob/main/battleGameplay/utils/equipment-spritesheet.json) file of the Zerpmon Webapp Repository by pasting the contents.</span>
