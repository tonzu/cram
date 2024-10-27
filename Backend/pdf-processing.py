import boto3
import psycopg2
import pytesseract
import pdf2image
import os
from flask import Flask, request, jsonify

app = Flask(__name__)


AWS_ACCESS_KEY = 'AKIARHQBNIE4N7ZVDIOP'
AWS_SECRET_KEY = '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'
S3_BUCKET_NAME = 'cram-project'

s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY
)


DB_HOST = 'localhost'
DB_PORT = '5432'
DB_NAME = 'your_database'
DB_USER = 'your_db_user'
DB_PASSWORD = 'your_db_password'

def connect_db():
    conn = psycopg2.connect(
        host=DB_HOST, port=DB_PORT, dbname=DB_NAME,
        user=DB_USER, password=DB_PASSWORD
    )
    return conn

def process_pdf(file_path):
    
    images = pdf2image.convert_from_path(file_path)
    text = ""
    for image in images:
        
        text += pytesseract.image_to_string(image)
    return text

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    filename = file.filename
    file_path = f'/tmp/{filename}'
    file.save(file_path)

    
    s3_client.upload_file(file_path, S3_BUCKET_NAME, filename)

    
    text = process_pdf(file_path)
