import React, { useState } from 'react';
import axios from 'axios';

type Transaction = {
  date: string;
  description: string;
  amount: number;
};

type ApiResponse = {
  transactions: Transaction[];
};

const UploadPDF: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post<ApiResponse>('http://127.0.0.1:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResponse(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <input type="file" accept="application/pdf" onChange={handleChange} />
      <button onClick={handleUpload} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Upload PDF
      </button>

      {response && (
        <pre className="mt-4 bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify(response.transactions, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default UploadPDF;
