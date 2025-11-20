import pdfplumber
import re
from datetime import datetime
import pandas as pd

pdf_path = "C:/Users/Danaf/OneDrive/Desktop/test_upload.py.pdf" 

date_pattern = re.compile(r"\b(\d{2}/\d{2}/\d{2,4})\b")
amount_pattern = re.compile(r"\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?")
transactions = []

def clean_amount(amt_str):
    return float(amt_str.replace("$", "").replace(",", "").strip())

with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        if not text:
            continue
        lines = text.split("\n")
        for line in lines:
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

# Create and save DataFrame
df = pd.DataFrame(transactions)
print(df.head())
df.to_csv("parsed_transactions.csv", index=False)
