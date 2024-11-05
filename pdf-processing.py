# Gets the text from a PDF file in S3 Bucket
from io import BytesIO
import boto3
from PyPDF2 import PdfReader

# Put in bucket access keys and the correct region
s3 = boto3.resource(
    service_name = 's3',
    region_name = 'us-east-1',
    aws_access_key_id = '',
    aws_secret_access_key = ''
)

# Put bucket name and file name in Bucket() and Object()
obj = s3.Bucket("cram-test").Object("Lorem_ipsum.pdf").get()

reader = PdfReader(BytesIO(obj['Body'].read()))

for page in reader.pages:
    print(page.extract_text())
