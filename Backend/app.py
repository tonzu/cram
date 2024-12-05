from flask import Flask
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from routes import routes
from flask_cors import CORS

# Environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Set up PostgreSQL database
db = SQLAlchemy()
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://cram_owner:SZXGa9nA6cIN@ep-icy-union-a59g3itp.us-east-2.aws.neon.tech/cram?sslmode=require"
db.init_app(app)

# Load Flask routes
app.register_blueprint(routes)

if __name__ == '__main__':
    app.run(debug=True)
