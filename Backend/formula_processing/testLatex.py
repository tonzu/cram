import pytesseract
from PIL import Image
from pix2tex.cli import LatexOCR
from pdf2image import convert_from_path
from io import BytesIO
import os
import re

# Initialize paths and model
pdf_path = 'n8.pdf'
output_folder = 'results'
os.makedirs(output_folder, exist_ok=True)  # Create folder if it doesn't exist
model = LatexOCR()

# Extract text and LaTeX from each PDF page
pages = convert_from_path(pdf_path, 300)

# Function to identify likely equation regions
def extract_equation_lines(text):
    # Regex to detect lines with mathematical expressions
    equation_pattern = r'[\d\w]*\s*[-+*/^=]+\s*[\d\w()]+'
    equation_lines = [line for line in text.splitlines() if re.search(equation_pattern, line)]
    return equation_lines

for i, page in enumerate(pages):
    print(f"\nProcessing page {i+1}...")

    # Process each page image in memory
    image_stream = BytesIO()
    page.save(image_stream, format="PNG")
    image_stream.seek(0)

    # Extract regular text and detect equation regions using Tesseract
    with Image.open(image_stream) as img:
        text = pytesseract.image_to_string(img)
        print(f'Regular Text from page {i+1}:\n{text}\n')

        # Find likely equation regions from text
        equation_lines = extract_equation_lines(text)
        print(f"Detected equation lines on page {i+1}: {equation_lines}")
        
        latex_code = []

        # Get detailed OCR data with bounding boxes for each word
        data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
        
        # Process each equation line
        for line in equation_lines:
            # Find indices of words that match the current line
            word_indices = [j for j, txt in enumerate(data['text']) if txt in line and int(data['conf'][j]) > 0]

            # If words from the line were found, calculate bounding box
            if word_indices:
                # Initialize bounding box coordinates
                min_x = min(data['left'][j] for j in word_indices)
                min_y = min(data['top'][j] for j in word_indices)
                max_x = max(data['left'][j] + data['width'][j] for j in word_indices)
                max_y = max(data['top'][j] + data['height'][j] for j in word_indices)
                
                # Debugging: Verify calculated bounding box dimensions
                print(f"Calculated bounding box for line '{line}': (min_x: {min_x}, min_y: {min_y}, max_x: {max_x}, max_y: {max_y})")

                # Crop the bounding box from the original image
                if min_x < max_x and min_y < max_y:  # Validate coordinates
                    crop_img = img.crop((min_x, min_y, max_x, max_y))
                    
                    # Save cropped image for debugging
                    crop_path = os.path.join(output_folder, f'crop_page_{i+1}_line_{equation_lines.index(line)+1}.png')
                    crop_img.save(crop_path)
                    print(f"Cropped image saved for debugging: {crop_path}")

                    # Pass the cropped image to pix2tex
                    try:
                        latex = model(crop_img)
                        if latex:  # Ensure LaTeX output is valid
                            latex_code.append(latex)
                            print(f'LaTeX Code from line in page {i+1}:\n{latex}\n')
                        else:
                            latex_code.append("No LaTeX detected")
                            print(f"No LaTeX detected for line in page {i+1}")
                    except Exception as e:
                        print(f"Error processing LaTeX on page {i+1}: {e}")
                        latex_code.append("Error processing region")
                else:
                    print(f"Invalid bounding box for line '{line}': (min_x: {min_x}, min_y: {min_y}, max_x: {max_x}, max_y: {max_y})")

    # Convert LaTeX code list to a single string for better readability in the output file
    latex_code_str = "\n".join(latex_code)

    # Save the results to the results folder
    results_path = os.path.join(output_folder, f'results_page_{i+1}.txt')
    with open(results_path, 'w') as text_file:
        text_file.write(f'Regular Text:\n{text}\n\nLaTeX Code:\n{latex_code_str}')
    print(f"Results saved to {results_path}")

print("\nProcessing complete.")


"""

import pytesseract
from PIL import Image
from pix2tex.cli import LatexOCR
from pdf2image import convert_from_path
from io import BytesIO
import os
import re

# Initialize paths and model
pdf_path = 'n8.pdf'
output_folder = 'results'
os.makedirs(output_folder, exist_ok=True)  # Create folder if it doesn't exist
model = LatexOCR()

# Extract text and LaTeX from each PDF page
pages = convert_from_path(pdf_path, 300)

# Function to identify likely equation regions
def extract_equation_regions(text):
    # Regex to detect lines with mathematical expressions
    equation_pattern = r'[\d\w]*\s*[-+*/^=]+\s*[\d\w()]+'
    equation_lines = [line for line in text.splitlines() if re.search(equation_pattern, line)]
    return equation_lines

for i, page in enumerate(pages):
    print(f"\nProcessing page {i+1}...")

    # Process each page image in memory
    image_stream = BytesIO()
    page.save(image_stream, format="PNG")
    image_stream.seek(0)

    # Extract regular text and detect equation regions using Tesseract
    with Image.open(image_stream) as img:
        text = pytesseract.image_to_string(img)
        print(f'Regular Text from page {i+1}:\n{text}\n')

        # Find likely equation regions from text
        equation_lines = extract_equation_regions(text)
        print(equation_lines)
        latex_code = []

        # Crop regions that may contain equations and process them with pix2tex
        for line in equation_lines:
            try:
                # Locate the bounding box for each line using Tesseract's layout analysis
                data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
                for j, txt in enumerate(data['text']):
                    if line in txt:
                        # Get bounding box coordinates
                        x, y, w, h = data['left'][j], data['top'][j], data['width'][j], data['height'][j]

                        # Debugging: Print bounding box coordinates
                        print(f"Bounding box for line '{line}': (x: {x}, y: {y}, w: {w}, h: {h})")

                        if w > 0 and h > 0:  # Ensure valid width and height for cropping
                            crop_img = img.crop((x, y, x + w, y + h))
                            
                            # Save cropped image for debugging
                            crop_path = os.path.join(output_folder, f'crop_page_{i+1}_region_{j+1}.png')
                            crop_img.save(crop_path)
                            print(f"Cropped image saved for debugging: {crop_path}")

                            # Pass the cropped image to pix2tex
                            latex = model(crop_img)
                            if latex:  # Ensure LaTeX output is valid
                                latex_code.append(latex)
                                print(f'LaTeX Code from region in page {i+1}:\n{latex}\n')
                            else:
                                latex_code.append("No LaTeX detected")
                                print(f"No LaTeX detected in region {j+1} of page {i+1}")
                        else:
                            print(f"Skipping invalid bounding box: (x: {x}, y: {y}, w: {w}, h: {h})")
            except Exception as e:
                print(f"Error processing LaTeX on page {i+1}: {e}")
                latex_code.append("Error processing region")

    # Convert LaTeX code list to a single string for better readability in the output file
    latex_code_str = "\n".join(latex_code)

    # Save the results to the results folder
    results_path = os.path.join(output_folder, f'results_page_{i+1}.txt')
    #with open(results_path, 'w') as text_file:
    #    text_file.write(f'Regular Text:\n{text}\n\nLaTeX Code:\n{latex_code_str}')
    print(f"Results saved to {results_path}")

print("\nProcessing complete.")
"""