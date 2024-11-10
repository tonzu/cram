import os 
from flask import request, render_template
import boto3 
from werkzeug.utils import secure_filename 

def s3_upload():

    upload_folder = './uploads'

    # S3 connection
    s3_client = boto3.client(
        service_name='s3',
        region_name='us-east-2',
        aws_access_key_id=os.getenv('AWS_KEY'),
        aws_secret_access_key=os.getenv('AWS_SECRET_KEY')
    )
    
    # Gets the file from the form in the front-end and cleans the name
    file = request.files.get('file')
    filename = secure_filename(file.filename)

    # Saves the file onto local folder to get a file path (since HTML blocks file path access in forms)
    file_path = os.path.join(upload_folder, filename)
    file.save(file_path)

    # Location saved in S3
    s3_key = f"files/{filename}"
    s3_client.upload_file(file_path, 'open-project-cram', s3_key)

    return s3_key
