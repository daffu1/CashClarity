from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pdfplumber
import re
from datetime import datetime
from ai.coach import generate_budget_advice

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def home():
    return "Backend is running"

@app.route("/api/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    try:
        file.save(file_path)
    except Exception as e:
        return jsonify({"error": "Failed to save file"}), 500

    try:
        transactions = extract_transactions_from_pdf(file_path)
    except Exception as e:
        return jsonify({"error": "Failed to extract transactions"}), 500

    return jsonify({"transactions": transactions})

@app.route("/api/summary", methods=["POST"])
def summarize():
    try:
        data = request.get_json()
        summary_text = data.get("summary")

        if not summary_text:
            return jsonify({"error": "Missing summary"}), 400

        advice = generate_budget_advice(summary_text)
        return jsonify({"advice": advice})

    except Exception as e:
        print("Error generating advice:", e)
        return jsonify({"error": "Failed to generate summary"}), 500

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
                            "date": date.strftime("%m/%d/%Y"),
                            "description": description,
                            "amount": amount
                        })
                    except Exception as e:
                        continue
    return transactions

def parse_date(date_str):
    try:
        return datetime.strptime(date_str, "%m/%d/%Y").date()
    except ValueError:
        try:
            return datetime.strptime(date_str, "%m/%d/%y").date()
        except ValueError:
            return None

if __name__ == "__main__":
    app.run(debug=True)
