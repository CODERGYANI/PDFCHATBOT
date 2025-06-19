import React, { useState } from 'react';
import axios from 'axios';

function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setStatus('❌ Please select a file');
      setTimeout(() => setStatus(''), 3000);
      return;
    }

    // Checking if file is PDF
    if (file.type !== 'application/pdf') {
      setStatus('❌ Please select a PDF file');
      setTimeout(() => setStatus(''), 3000);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      setStatus('');
      const res = await axios.post('http://localhost:8000/pdf/upload-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus('✅ ' + res.data.message);
      setFile(null);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error(err);
      setStatus('❌ Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setTimeout(() => setStatus(''), 4000);
    }
  };

  return (
    <div className="upload-component">
      <div className="upload-input-group">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="upload-file-input"
          id="pdf-upload"
        />
        <label htmlFor="pdf-upload" className="upload-file-label">
          <span className="upload-file-icon">📎</span>
          {file ? file.name : 'Choose PDF'}
        </label>
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className={`upload-button ${uploading ? 'uploading' : ''}`}
      >
        {uploading ? (
          <>
            <span className="upload-spinner"></span>
            Uploading...
          </>
        ) : (
          <>
            <span className="upload-icon">📤</span>
            Upload
          </>
        )}
      </button>

      {status && (
        <div className={`upload-status ${status.includes('✅') ? 'success' : 'error'}`}>
          {status}
        </div>
      )}
    </div>
  );
}

export default Upload;
