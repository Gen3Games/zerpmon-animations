import bpy
import os
import sys
import subprocess

# Check if there are command line arguments
if len(sys.argv) > 5:
    # Get the image path from the command line arguments
    image_path = sys.argv[5]
    animation_name = sys.argv[6]
    image_name = sys.argv[7]

    # Find the node and set the image
    node = bpy.data.materials['EqupL'].node_tree.nodes["Image Texture"]
    node.image = bpy.data.images.load(image_path)

    # Specify the output directory
    output_directory = animation_name + '/'

    # Create the output directory if it doesn't exist
    os.makedirs(output_directory, exist_ok=True)

    # Set the output file format to PNG
    bpy.context.scene.render.image_settings.file_format = 'PNG'

    # Set the output directory in the render settings
    bpy.context.scene.render.filepath = os.path.join(output_directory, image_name)

    # Render animation
    bpy.ops.render.render(animation=True)

else:
    print("Error: Image path not provided as a command line argument.")



"""
## blender -b ZerpmonCardDestraction1.blend -P CardDestruction.py ./Howlar.png

blender = keyword
-b = Run blender in background
file.blend = Blender file
-o = set output path
-F PNG = export as PNG
python_file.py

"""