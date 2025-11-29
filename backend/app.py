from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pdfplumber
import re
from datetime import datetime

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def home():
    return "✅ Backend is running"

@app.route("/api/upload", methods=["POST"])
def upload():
   
    print("📥 Incoming request:", request.content_type)

    if "file" not in request.files:
        print("❌ No file part in request.files")
        return jsonify({"error": "No file part in request"}), 400

    file = request.files["file"]

    if file.filename == "":
        print("❌ No file selected")
        return jsonify({"error": "No selected file"}), 400

    
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    try:
        file.save(file_path)
        print(f"📂 File saved to {file_path}")
    except Exception as e:
        print(f"❌ Error saving file: {e}")
        return jsonify({"error": "Failed to save file"}), 500

    
    try:
        transactions = extract_transactions_from_pdf(file_path)
    except Exception as e:
        print(f"❌ Error extracting transactions: {e}")
        return jsonify({"error": "Failed to extract transactions"}), 500

    return jsonify({"transactions": transactions})

date_pattern = re.compile(r"\b(\d{2}/\d{2}/\d{2,4})\b")
amount_pattern = re.compile(r"\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?")

def clean_amount(amt_str):
    return float(amt_str.replace("$", "").replace(",", "").strip())

def extract_transactions_from_pdf(pdf_path):
    transactions = []
    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages, start=1):
            text = page.extract_text()
            if not text:
                print(f"⚠️ Page {page_num} has no text.")
                continue
            for line in text.split("\n"):
                date_match = date_pattern.search(line)
                amount_matches = amount_pattern.findall(line)

                if date_match and amount_matches:
                    try:
                        date = parse_date(date_match.group(1))
                        amount = clean_amount(amount_matches[-1])
                        description = (
                            line.replace(date_match.group(1), "")
                                .replace(amount_matches[-1], "")
                                .strip()
                        )
                        transactions.append({
                            "date": date.isoformat(),
                            "description": description,
                            "amount": amount
                        })
                    except Exception as e:
                        print(f"⚠️ Skipped line due to error: {e}")
                        continue
    return transactions

def parse_date(date_str):
    """Try both 2-digit and 4-digit year formats."""
    for fmt in ("%m/%d/%y", "%m/%d/%Y"):
        try:
            return datetime.strptime(date_str, fmt).date()
        except ValueError:
            continue
    raise ValueError(f"Unrecognized date format: {date_str}")

if __name__ == "__main__":
    app.run(debug=True)
