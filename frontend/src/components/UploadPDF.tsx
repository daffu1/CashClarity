import React, { useState } from "react";
import type { DragEvent } from "react";
import Charts from "./Charts"; // Chart component to visualize transactions

type Transaction = {
  date: string;
  description: string;
  amount: number;
};

const UploadPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setUploadMessage(null);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setUploadMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      setUploadMessage("Uploading your file...");

      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setTransactions(data.transactions);
      setUploadMessage("Upload successful!");
    } catch (error) {
      console.error("Upload error:", error);
      setUploadMessage("Upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 py-8 bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Upload File</h2>

        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center mb-6 transition-colors duration-300 ${
            dragActive ? "border-blue-600 bg-blue-100" : "border-blue-400 bg-blue-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf"
            id="file-upload"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="text-4xl mb-3">📄</div>
            <p className="text-base">
              Drag & Drop your file or{" "}
              <span className="text-blue-500 underline">Browse</span>
            </p>
          </label>
          {file && (
            <p className="mt-4 text-sm text-gray-600">Selected: {file.name}</p>
          )}
        </div>

        {uploadMessage && (
          <p className="text-center text-sm mb-4">{uploadMessage}</p>
        )}

        <div className="flex justify-between text-sm text-gray-500 mb-6">
          <span>Format: PDF</span>
          <span>Max size: 25MB</span>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            className={`px-8 py-3 rounded-md text-white text-base transition ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      {transactions.length > 0 && (
        <div className="mt-10 w-full max-w-3xl">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Spending Overview
          </h3>
          <Charts data={transactions} />
        </div>
      )}
    </div>
  );
};

export default UploadPDF;
