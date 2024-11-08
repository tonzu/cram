from app import db
from models import User, Document

# Create and add a test user
test_user = User(email='testuser@example.com', password_hash='hashed_password')
db.session.add(test_user)
db.session.commit()  # Save the user to the database

# Create and add a test document linked to the test user
test_document = Document(user_id=test_user.id, filename='sample_document.pdf', content='Sample content of the PDF')
db.session.add(test_document)
db.session.commit()  # Save the document to the database

print("Test data has been added.")