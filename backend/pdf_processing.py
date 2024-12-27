import os 
import boto3  # AWS Python
import fitz  #for PDF processing
import psycopg2 
from extract_data_pdf import process_pdf
from upload_pdf import s3_upload
from read_pdf import s3_retrieve
from sqlalchemy import create_engine, Column, Integer, String, Text, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLAlchemy Base
Base = declarative_base()

class PDFDocument(Base):
    __tablename__ = 'pdf_documents'
    
    id = Column(Integer, primary_key=True)
    email = Column(String, nullable=True)
    filename = Column(String, nullable=False)
    s3_key = Column(String, nullable=False)
    text_content = Column(Text, nullable=True)

# upload and processing
def handle_pdf():
    
    email, filename, s3_key = s3_upload()
   
    extracted_data_content = process_pdf(s3_retrieve(s3_key))
   
    text_content = extracted_data_content["PDF text"]
    image_directories = extracted_data_content["PDF images"]
    
    # Create a database engine
    engine = create_engine('postgresql://cram_owner:SZXGa9nA6cIN@ep-icy-union-a59g3itp.us-east-2.aws.neon.tech/cram?sslmode=require')
    # tables 
    Base.metadata.create_all(engine)
    # session
    Session = sessionmaker(bind=engine)
    session = Session()
    
    # Create a new PDFDocument instance
    pdf_document = PDFDocument(
        filename=filename,
        s3_key=s3_key,
        text_content=text_content,
        email=email
    )
    
    
    session.add(pdf_document)
    session.commit()
    session.close()
