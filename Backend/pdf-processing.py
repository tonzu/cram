import os 
import boto3  # AWS Python
import fitz  #for PDF processing
import psycopg2 
from sqlalchemy import create_engine, Column, Integer, String, Text, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLAlchemy Base
Base = declarative_base()

class PDFDocument(Base):
    __tablename__ = 'pdf_documents'
    
    id = Column(Integer, primary_key=True)
    filename = Column(String, nullable=False)
    s3_key = Column(String, nullable=False)
    text_content = Column(Text, nullable=True)
    # Do we need images, form

#  PDF to AWS S3
def upload_pdf_to_s3(file_path, bucket_name, s3_client):
    
    filename = os.path.basename(file_path)
    # Define the S3 key 
    s3_key = f"pdfs/{filename}"
    # Upload the file to S3
    s3_client.upload_file(file_path, bucket_name, s3_key)
    return s3_key

# process PDF and extract text
def process_pdf(file_path):
    # Open the PDF file
    doc = fitz.open(file_path)
    text_content = ""
    
    #Iterate over each page 
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text()
        text_content += text
    
    doc.close()
    
    return text_content

# upload and processing
def handle_pdf(file_path):
   
    bucket_name = ''  #######Replace 
    
    
    s3_client = boto3.client(
        's3',
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY'), #replace?
        aws_secret_access_key=os.getenv('AWS_SECRET_KEY') #replace? 
    )
    
    
    s3_key = upload_pdf_to_s3(file_path, bucket_name, s3_client)
    
   
    text_content = process_pdf(file_path)
    
    ########## repalce###### 
    db_user = ''  
    db_password = '' 
    db_host = ''  
    db_port = '' 
    db_name = ''  
    
    # Create a database engine
    engine = create_engine(f'postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}')
    # tables 
    Base.metadata.create_all(engine)
    # session
    Session = sessionmaker(bind=engine)
    session = Session()
    
    # Create a new PDFDocument instance
    pdf_document = PDFDocument(
        filename=os.path.basename(file_path),
        s3_key=s3_key,
        text_content=text_content
    )
    
    
    session.add(pdf_document)
    session.commit()
    session.close()
    print("PDF processing complete and data stored successfully.")

#fOR TESTING
if __name__ == '__main__':
    # Example usage
    # Assume you have set environment variables for AWS and have a PDF file to process
    pdf_file_path = ''  ######Replace 
    handle_pdf(pdf_file_path)
