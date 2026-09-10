import React, { useState, useRef } from 'react';
import { UploadCloud, FileType, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function DatasetUploader() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    if (selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.xlsx')) {
      setFile(selectedFile);
      setStatus('idle');
      setMessage('');
    } else {
      setStatus('error');
      setMessage('Please upload a valid CSV or Excel file.');
    }
  };

  const onUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setStatus('idle');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // In production use env var for URL
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await axios.post(`${API_URL}/api/v1/upload/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setStatus('success');
      setMessage('Dataset uploaded successfully! The AI is now processing the data.');
      setFile(null);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.detail || 'Failed to upload dataset. Ensure backend is running.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
      <h1 className="text-h2" style={{ marginBottom: '1rem' }}>Upload Dataset</h1>
      <p className="text-body" style={{ marginBottom: '2rem' }}>
        Upload your tabular data (CSV or Excel). DataLens will automatically analyze the schema, 
        clean the data, compute business metrics, and generate AI insights.
      </p>

      <div 
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input 
          ref={inputRef}
          type="file" 
          accept=".csv, .xlsx, .xls"
          style={{ display: 'none' }}
          onChange={handleChange}
        />
        
        {!file ? (
          <>
            <UploadCloud size={48} className="upload-icon mx-auto" style={{ margin: '0 auto' }} />
            <h3 className="text-h3" style={{ marginBottom: '0.5rem' }}>Drag & Drop your dataset here</h3>
            <p className="text-small">or click to browse files</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
              <span className="text-small" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FileType size={14} /> CSV</span>
              <span className="text-small" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FileType size={14} /> XLSX</span>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <FileType size={48} className="text-accent" />
            <div>
              <h3 className="text-h3">{file.name}</h3>
              <p className="text-small">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                className="btn btn-secondary" 
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                disabled={uploading}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={(e) => { e.stopPropagation(); onUpload(); }}
                disabled={uploading}
              >
                {uploading ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : 'Analyze Data'}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {status === 'success' && (
        <div style={{ marginTop: '2rem', padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <CheckCircle2 className="text-success" />
          <span style={{ color: 'var(--text-primary)' }}>{message}</span>
        </div>
      )}
      
      {status === 'error' && (
        <div style={{ marginTop: '2rem', padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <AlertCircle color="#EF4444" />
          <span style={{ color: 'var(--text-primary)' }}>{message}</span>
        </div>
      )}
    </div>
  );
}
