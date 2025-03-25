'use client';

import { useState } from 'react';
import { Upload, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface FileUploadProps {
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
  setAnalysisResults: (value: any) => void;
  setPdfContent: (value: any) => void;
  errorMessage: string | null;
  setErrorMessage: (value: string | null) => void;
}

const FileUpload = ({
  isUploading,
  setIsUploading,
  setAnalysisResults,
  setPdfContent,
  errorMessage,
  setErrorMessage
}: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    await handleFiles(files);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      await handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    setErrorMessage(null);

    if (files?.[0]) {
      const file = files[0];

      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('File size must be less than 10MB');
        return;
      }

      if (!file.type.includes('pdf')) {
        setErrorMessage('Please upload a PDF file');
        return;
      }

      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append('file', file);

        try {
          const fileReader = new FileReader();
          fileReader.onload = (e) => {
            const content = e.target?.result;
            setPdfContent(content);
          };
          fileReader.readAsArrayBuffer(file);
        } catch (pdfError) {
          console.error('Error reading PDF:', pdfError);
        }

        const response = await fetch('/api/analyze', {
          method: 'POST',
          body: formData,
        });

        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('text/html')) {
          throw new Error('Server returned an HTML error page. API configuration issue detected.');
        }

        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          throw new Error('Failed to parse server response. Check server logs for details.');
        }

        if (!response.ok) {
          throw new Error(data.error || 'Analysis failed');
        }

        setAnalysisResults(data);

      } catch (error: any) {
        console.error('Error:', error);
        setErrorMessage(error.message || 'Failed to analyze the pitch deck. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-xl mx-auto"
      >
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center ${dragActive ? 'border-[#be00e8] bg-purple-50' :
              errorMessage ? 'border-red-400 bg-red-50' : 'border-gray-300'
            } transition-colors hover:border-purple-400`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleChange}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />

          <label
            htmlFor="file-upload"
            className={`flex flex-col items-center ${!isUploading ? 'cursor-pointer' : ''}`}
          >
            {isUploading ? (
              <Loader2 className="h-12 w-12 text-[#be00e8] animate-spin" />
            ) : errorMessage ? (
              <AlertCircle className="h-12 w-12 text-red-500" />
            ) : (
              <Upload className="h-12 w-12 text-[#be00e8]" />
            )}

            <h3 className={`mt-4 text-2xl font-semibold ${errorMessage ? 'text-red-600' : 'text-gray-800'
              }`}>
              {isUploading ? 'Analyzing your deck...' :
                errorMessage ? 'Error' : 'Upload your pitch deck'}
            </h3>

            {errorMessage ? (
              <p className="mt-2 text-red-600">{errorMessage}</p>
            ) : (
              <p className="mt-2 text-gray-600">
                Drop your PDF here or click to browse
              </p>
            )}

            {!errorMessage && (
              <p className="mt-1 text-sm text-gray-400">
                Maximum file size: 10MB
              </p>
            )}

            {errorMessage && (
              <button
                onClick={() => setErrorMessage(null)}
                className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                type="button"
              >
                Try Again
              </button>
            )}
          </label>
        </div>

        {errorMessage && errorMessage.includes('API configuration') && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            <h4 className="font-semibold">Configuration Issue Detected</h4>
            <p className="mt-1">This appears to be a server configuration issue. Please check:</p>
            <ul className="list-disc ml-5 mt-2">
              <li>OpenAI API key is set in your .env.local file</li>
              <li>Server has been restarted after environment changes</li>
              <li>API route is correctly implemented</li>
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FileUpload;