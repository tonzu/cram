import os
import time
import requests
import zipfile
import json

# Your Mathpix API credentials
headers = {
  "app_key": "61da92742fede75bfe4e3c1fc436ed7411c43ce7057699a5f60e419ec945ba2e",  # Replace with your Mathpix app key
  "app_id": "opcram_43b2da_473b69"     # Replace with your Mathpix app id
}

# Options for Mathpix API
options = {
    "conversion_formats": {"tex.zip": True},
    "math_inline_delimiters": ["$", "$"],
    "rm_spaces": True
}

def process_pdf(pdf_path):
    pdf_id = upload_pdf(pdf_path)
    extracted_contents_dir = extract_text(pdf_id)
    extracted_data = extract_data(extracted_contents_dir)
    return extracted_data


def upload_pdf(pdf_path):
    """
    Input: PDF directory path (String)
    Uploads pdf to Mathpix API, using options specified in options
    Returns: Mathpix PDF ID (String)
    """
    # Upload the PDF and start processing
    with open(pdf_path, "rb") as file:
        r = requests.post(
            "https://api.mathpix.com/v3/pdf",
            headers=headers,
            files={"file": file},
            data={"options_json": json.dumps(options)}
        )

    # Get the PDF ID
    r_json = r.json()
    pdf_id = r_json.get("pdf_id")
    if not pdf_id:
        print("Failed to upload PDF.")
        exit()

    print(f"PDF uploaded. PDF ID: {pdf_id}")

    # Polling for processing status
    status_url = f"https://api.mathpix.com/v3/pdf/{pdf_id}"
    while True:
        status_response = requests.get(status_url, headers=headers)
        status_data = status_response.json()
        status = status_data.get("status")
        if status == "completed":
            print("Processing complete. Files are ready.")
            break
        elif status == "failed":
            print("Processing failed.")
            exit()
        else:
            print(f"Processing status: {status}. Retrying in 5 seconds.")
            time.sleep(5)
    
    return pdf_id


def extract_text(pdf_id):
    
    # Download the LaTeX ZIP file
    latex_url = f"https://api.mathpix.com/v3/pdf/{pdf_id}.tex"
    latex_response = requests.get(latex_url, headers=headers)

    # Save the LaTeX ZIP file locally
    if latex_response.status_code == 200:
        with open(f"{pdf_id}.tex.zip", "wb") as f:
            f.write(latex_response.content)

    # Path to the .tex.zip file
    zip_file_path = f'{pdf_id}.tex.zip'
    output_dir = f'{pdf_id}_extracted_files'  # Directory to extract files into

    # Step 1: Unzip the .tex.zip file
    with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
        zip_ref.extractall(output_dir)

    # Delete the ZIP file after extraction
    os.remove(zip_file_path)

    extracted_contents_dir = os.path.join(output_dir, pdf_id)

    return extracted_contents_dir


def extract_data(extracted_contents_dir):
    """
    Input: Directory of extracted .tex.zip file contents
    Returns: Dictionary containing extracted text and list of paths for extracted image files
    """
    # Step 2: Process the extracted files
    # Locate the .tex file
    tex_file = None
    for file in os.listdir(extracted_contents_dir):
        if file.endswith(".tex"):
            tex_file = os.path.join(extracted_contents_dir, file)
            break

    if tex_file:
        # Step 3: Extract text from the .tex file
        with open(tex_file, "r", encoding="utf-8") as f:
            tex_content = f.read()
        print(tex_content)


    # Step 4: Locate and save images
    images_dir = os.path.join(extracted_contents_dir, "images")  # Adjust if the folder has a different name
    if os.path.isdir(images_dir):
        image_files = [os.path.join(images_dir, img) for img in os.listdir(images_dir)]


    return {"PDF text": tex_content, "PDF images": image_files}

