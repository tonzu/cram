import pytesseract
from PIL import Image
from pix2tex.cli import LatexOCR
from pdf2image import convert_from_path
from io import BytesIO
import os
import re


# Tests the Latex OCR model on one image that's already cropped

# Initialize paths and model
model = LatexOCR()
image = Image.open("example.png")

latex = model(image)

print(f'LaTeX code from the image: \n {latex}')