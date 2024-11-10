import boto3
import os

def s3_retrieve(s3_key):

    upload_folder = './uploads'
    os.makedirs(upload_folder, exist_ok=True)
    
    # S3 connection
    s3_client = boto3.client(
        service_name='s3',
        region_name='us-east-2',
        aws_access_key_id=os.getenv('AWS_KEY'),
        aws_secret_access_key=os.getenv('AWS_SECRET_KEY')
    )

    local_path = os.path.join('./uploads', os.path.basename(s3_key))

    s3_client.download_file('open-project-cram', s3_key, local_path)

    return local_path
