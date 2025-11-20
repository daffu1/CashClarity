import requests

url = "http://127.0.0.1:5000/upload"
file_path = "C:/Users/Danaf/OneDrive/Desktop/test_upload.py.pdf" 

with open(file_path, "rb") as f:
    files = {"file": f}
    response = requests.post(url, files=files)

print(response.json())
