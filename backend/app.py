from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
import pdfplumber
import re

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def home():
    return "Backend is working 🎉"

@app.route("/upload", methods=["POST"])
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    os.makedirs("uploads", exist_ok=True)
    file_path = os.path.join("uploads", file.filename)
    file.save(file_path)

    try:
        transactions = extract_transactions_from_pdf(file_path)
        return jsonify({"transactions": transactions})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

date_pattern = re.compile(r"\b(\d{2}/\d{2}/\d{2,4})\b")
amount_pattern = re.compile(r"\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?")

def clean_amount(amt_str):
    return float(amt_str.replace("$", "").replace(",", "").strip())

def extract_transactions_from_pdf(pdf_path):
    transactions = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if not text:
                continue
            for line in text.split("\n"):
                date_match = date_pattern.search(line)
                amount_matches = amount_pattern.findall(line)
                if date_match and amount_matches:
                    try:
                        date = datetime.strptime(date_match.group(1), "%m/%d/%y").date()
                    except ValueError:
                        try:
                            date = datetime.strptime(date_match.group(1), "%m/%d/%Y").date()
                        except ValueError:
                            continue
                    amount = clean_amount(amount_matches[-1])
                    description = line.replace(date_match.group(1), "").replace(amount_matches[-1], "").strip()
                    transactions.append({
                        "date": date.isoformat(),
                        "description": description,
                        "amount": amount
                    })
    return transactions

if __name__ == "__main__":
    app.run(debug=True)
