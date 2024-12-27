from flask import Blueprint, request, jsonify
from flask import render_template
from pdf_processing import handle_pdf
from read_pdf import s3_retrieve
import psycopg2

routes = Blueprint('routes', __name__)

# Upload route
@routes.route('/upload', methods=['POST'])
def upload():
    handle_pdf()
    return render_template("upload.html")

@routes.route('/docs', methods=['GET'])
def user_docs():
    email = request.args.get('email')

    conn = psycopg2.connect(
        host="ep-icy-union-a59g3itp.us-east-2.aws.neon.tech",
        database="cram",
        user="cram_owner",
        password="SZXGa9nA6cIN"
    )

    cursor = conn.cursor()
    cursor.execute("SELECT * FROM pdf_documents WHERE email = %s;", (email,))
    data = cursor.fetchall()  # Retrieve rows matching the email
    cursor.close()
    conn.close()

    results = [
        {
            "id": row[0],
            "email": row[1],
            "filename": row[2],
            "s3_key": row[3],
            "text_content": row[4]
        } 
        for row in data
    ]
    print(jsonify(results))
    return jsonify(results)

@routes.route('/delete', methods=['DELETE'])
def delete():
    email = request.args.get('email')
    filename = request.args.get('filename')
    id = request.args.get('id')

    conn = psycopg2.connect(
        host="ep-icy-union-a59g3itp.us-east-2.aws.neon.tech",
        database="cram",
        user="cram_owner",
        password="SZXGa9nA6cIN"
    )

    params = (email, filename, id)
    query = "DELETE FROM pdf_documents WHERE email = %s AND filename = %s AND id = %s"

    cursor = conn.cursor()
    cursor.execute(query, params)
    conn.commit()
    cursor.close()
    conn.close()
    return render_template("index.html")


# Retrieval route (WIP)
@routes.route('/download')
def download():
    s3_retrieve("files/test123.pdf")
    return render_template("download.html")