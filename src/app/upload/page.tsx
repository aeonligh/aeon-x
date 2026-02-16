'use client';

import { useState } from 'react';
import { Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ message: string; count: number } | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Ingest Past Questions</h1>
        <p className="text-gray-500">Upload UNIBEN Pharmacy PDF past questions to expand your library.</p>
      </header>

      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 bg-white">
        <div className="bg-blue-50 p-4 rounded-full text-blue-600">
          <Upload size={32} />
        </div>
        <div className="text-center">
          <p className="font-medium">Click to upload or drag and drop</p>
          <p className="text-sm text-gray-400">PDF files (max. 10MB)</p>
        </div>
        <input 
          type="file" 
          accept=".pdf" 
          className="hidden" 
          id="file-upload"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <label 
          htmlFor="file-upload"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium cursor-pointer"
        >
          Select File
        </label>
        {file && (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            <FileText size={16} />
            {file.name}
          </div>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full bg-black text-white py-4 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="animate-spin" /> : 'Process PDF'}
      </button>

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle className="text-green-600 shrink-0" size={24} />
          <div>
            <p className="font-semibold text-green-800">{result.message}</p>
            <p className="text-sm text-green-700">The questions have been extracted and mapped to topics.</p>
          </div>
        </div>
      )}
    </div>
  );
}
