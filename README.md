# How to generate the zerpmon animations

1. go to root directory<br><br>

2. go inside ZerpmonAnimations folder<br><br>

   ```sh
   cd ZerpmonAnimations
   ```

3. install dependencies

   ```sh
   npm i
   ```

4. create folder structure

   ```sh
   mkdir -p ZerpmonImages imageChunks logs/all logs/download pngSequences Spritesheets
   ```

5. start rendering

   ```sh
   npm start
   ```

6. After process is over check for files not uploaded in
   ```sh
   logs/checkMissingFiles/images
   ```
