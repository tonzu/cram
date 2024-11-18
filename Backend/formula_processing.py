import pytesseract
from PIL import Image
#from pix2tex.cli import LatexOCR
from pdf2image import convert_from_path
from io import BytesIO
import os
import re


pdf_path = "n20.pdf"
pages = convert_from_path(pdf_path, dpi=300)

# Process the first page
page1 = pages[0]

#Initialize Pix2Tex Latex OCR
#model = LatexOCR()

# Extracts lines of text that contain an equation
def extract_equation_lines(text):
    equation_pattern = r'[a-zA-Z0-9()]+[\s]*[-+*[/^=<>]+[\s]*[a-zA-Z0-9()]+'
    # Filter lines that match the equation pattern
    equation_lines = [line.strip() for line in text.splitlines() if re.search(equation_pattern, line)]
    return equation_lines
    
# Doesn't work as intended
# Supposed to extract the actual equation
# Want to use this so I can crop the location of the equation using Pytesseract to pass to LatexOCR
def extract_equations(text):
    equation_pattern = r'[a-zA-Z0-9()_]+(?:\s*[-+*/^=<>~!]+\s*[a-zA-Z0-9()_]+)+'
    
    # Find all matches in the text
    equations = re.findall(equation_pattern, text)
    return equations

# Extract text from the image using pytesseract
text = pytesseract.image_to_string(page1)
print(text)

equation_lines = extract_equation_lines(text)
print("equation lines:", equation_lines, "\n\n\n\n")

equations = extract_equations(text)
print("equations:", equations)

