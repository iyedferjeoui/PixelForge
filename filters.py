from PIL import Image, ImageFilter, ImageEnhance
import numpy as np

def load_image(path):
    return Image.open(path)

def save_image(img, path):
    img.save(path)

def grayscale(img):
    return img.convert("L")

def invert(img):
    img_array = np.array(img.convert("RGB"))
    inverted = 255 - img_array
    return Image.fromarray(inverted.astype(np.uint8))

def sepia(img):
    img_array = np.array(img.convert("RGB")).astype(np.float64)
    r = img_array[:,:,0] * 0.393 + img_array[:,:,1] * 0.769 + img_array[:,:,2] * 0.189
    g = img_array[:,:,0] * 0.349 + img_array[:,:,1] * 0.686 + img_array[:,:,2] * 0.168
    b = img_array[:,:,0] * 0.272 + img_array[:,:,1] * 0.534 + img_array[:,:,2] * 0.131
    sepia_array = np.stack([r, g, b], axis=2)
    sepia_array = np.clip(sepia_array, 0, 255).astype(np.uint8)
    return Image.fromarray(sepia_array)

def channel_filter(img, channel):
    img_array = np.array(img.convert("RGB"))
    result = np.zeros_like(img_array)
    channels = {"red": 0, "green": 1, "blue": 2}
    idx = channels[channel]
    result[:,:,idx] = img_array[:,:,idx]
    return Image.fromarray(result)

def blur(img, radius=2):
    return img.filter(ImageFilter.GaussianBlur(radius))

def sharpen(img):
    return img.filter(ImageFilter.SHARPEN)

def brightness(img, factor=1.5):
    enhancer = ImageEnhance.Brightness(img)
    return enhancer.enhance(factor)

def flip_horizontal(img):
    return img.transpose(Image.FLIP_LEFT_RIGHT)

def flip_vertical(img):
    return img.transpose(Image.FLIP_TOP_BOTTOM)

def pixelate(img, pixel_size=10):
    small = img.resize(
        (img.width // pixel_size, img.height // pixel_size),
        Image.NEAREST
    )
    return small.resize(img.size, Image.NEAREST)

def edge_detection(img):
    return img.convert("L").filter(ImageFilter.FIND_EDGES)