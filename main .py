from filters import *
import os

INPUT = "sample.jpg"
OUTPUT_DIR = "output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

img = load_image(INPUT)

while True:
    print("\n=== Image Filter Program ===")
    print("1. Grayscale")
    print("2. Invert")
    print("3. Sepia")
    print("4. Red filter")
    print("5. Green filter")
    print("6. Blue filter")
    print("7. Blur")
    print("8. Sharpen")
    print("9. Brightness")
    print("10. Flip Horizontal")
    print("11. Flip Vertical")
    print("12. Pixelate")
    print("13. Edge Detection")
    print("0. Exit")

    choice = input("\nEnter your choice (0-13): ")

    if not choice.isdigit():
        print("❌ Error: please enter a number between 0 and 13.")
        continue

    choice = int(choice)

    if choice < 0 or choice > 13:
        print("❌ Error: number must be between 0 and 13.")
        continue

    if choice == 0:
        print("Goodbye!")
        break

    if choice == 1:
        result = grayscale(img)
        name = "grayscale"
    elif choice == 2:
        result = invert(img)
        name = "invert"
    elif choice == 3:
        result = sepia(img)
        name = "sepia"
    elif choice == 4:
        result = channel_filter(img, "red")
        name = "red"
    elif choice == 5:
        result = channel_filter(img, "green")
        name = "green"
    elif choice == 6:
        result = channel_filter(img, "blue")
        name = "blue"
    elif choice == 7:
        result = blur(img)
        name = "blur"
    elif choice == 8:
        result = sharpen(img)
        name = "sharpen"
    elif choice == 9:
        result = brightness(img)
        name = "brightness"
    elif choice == 10:
        result = flip_horizontal(img)
        name = "flip_horizontal"
    elif choice == 11:
        result = flip_vertical(img)
        name = "flip_vertical"
    elif choice == 12:
        result = pixelate(img)
        name = "pixelate"
    elif choice == 13:
        result = edge_detection(img)
        name = "edge_detection"

    path = OUTPUT_DIR + "/" + name + ".jpg"
    counter = 1
    while os.path.exists(path):
        path = OUTPUT_DIR + "/" + name + "_" + str(counter) + ".jpg"
        counter += 1

    save_image(result, path)
    print("✅ Filter applied successfully! Image saved as: " + path)