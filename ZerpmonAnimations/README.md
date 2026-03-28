# How to generate the zerpmon animations

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

## Rendering

- Open the `ZerpmonAnimations` Application

- Insert the relevant data and Start "Render"

- A folder with the name "ZerpmonAnimations" will appear in your Desktop where you can check the rendered animations

- After process is over check for error files not uploaded in
  ```sh
  Desktop/ZerpmonAnimations/logs/checkMissingFiles/images
  ```
