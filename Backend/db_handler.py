from app import db
from models import Document

def add_document(user_id, filename, content):
    new_document = Document(user_id=user_id, filename=filename, content=content)
    db.session.add(new_document)
    db.session.commit()