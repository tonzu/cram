from app import db

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    filename = db.Column(db.String(255))
    uploaded_at = db.Column(db.DateTime, server_default=db.func.now())
    content = db.Column(db.Text)