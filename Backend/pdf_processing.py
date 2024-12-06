import os 
import fitz  #for PDF processing
from upload_pdf import s3_upload
from read_pdf import s3_retrieve
from sqlalchemy import create_engine, Column, Integer, String, Text, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
# from extract_data_pdf import process_pdf

# SQLAlchemy Base
Base = declarative_base()

class PDFDocument(Base):
    __tablename__ = 'pdf_documents'
    
    id = Column(Integer, primary_key=True)
    email = Column(String, nullable=True)
    filename = Column(String, nullable=False)
    s3_key = Column(String, nullable=False)
    text_content = Column(Text, nullable=True)

def process_pdf(file_path):
    # Open the PDF file
    doc = fitz.open(s3_retrieve(file_path))
    text_content = ""
    
    #Iterate over each page 
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text()
        text_content += text
    
    doc.close()
    
    return text_content

# upload and processing
def handle_pdf():
    
    email, filename, s3_key = s3_upload()
   
    text_content = process_pdf(s3_key)
    
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