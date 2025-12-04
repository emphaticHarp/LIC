'use client';

import { useState, useRef } from 'react';
import { Upload, X, File, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: Date;
  url?: string;
}

interface DocumentUploadProps {
  onDocumentsChange: (documents: Document[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  documents?: Document[];
}

export function DocumentUpload({
  onDocumentsChange,
  maxFiles = 5,
  maxFileSize = 10,
  acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  documents = [],
}: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <ImageIcon className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Check file count
    if (documents.length + files.length > maxFiles) {
      toast.error('Too many files', `Maximum ${maxFiles} files allowed`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const newDocuments: Document[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!acceptedTypes.includes(file.type)) {
          toast.warning('Invalid file type', `${file.name} is not supported`);
          continue;
        }

        // Validate file size
        if (file.size > maxFileSize * 1024 * 1024) {
          toast.warning('File too large', `${file.name} exceeds ${maxFileSize}MB limit`);
          continue;
        }

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + Math.random() * 30;
          });
        }, 100);

        // Create document object
        const doc: Document = {
          id: `doc-${Date.now()}-${i}`,
          name: file.name,
          type: file.type,
          size: formatFileSize(file.size),
          uploadedAt: new Date(),
          url: URL.createObjectURL(file),
        };

        newDocuments.push(doc);
        clearInterval(progressInterval);
      }

      if (newDocuments.length > 0) {
        const updatedDocuments = [...documents, ...newDocuments];
        onDocumentsChange(updatedDocuments);
        toast.success('Documents uploaded', `${newDocuments.length} file(s) uploaded successfully`);
      }

      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 500);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed', 'Please try again');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveDocument = (id: string) => {
    const updated = documents.filter(doc => doc.id !== id);
    onDocumentsChange(updated);
    toast.info('Document removed');
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          disabled={isUploading || documents.length >= maxFiles}
          className="hidden"
          accept={acceptedTypes.join(',')}
        />

        <div className="flex flex-col items-center gap-2">
          <Upload className="w-8 h-8 text-gray-400" />
          <div>
            <p className="font-medium text-gray-700">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500">
              {acceptedTypes.includes('application/pdf') && 'PDF, '}
              {acceptedTypes.includes('image/jpeg') && 'JPG, '}
              {acceptedTypes.includes('image/png') && 'PNG '}
              up to {maxFileSize}MB
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || documents.length >= maxFiles}
          className="mt-4"
        >
          {isUploading ? 'Uploading...' : 'Select Files'}
        </Button>

        {isUploading && uploadProgress > 0 && (
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      {documents.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Uploaded Documents ({documents.length}/{maxFiles})
          </p>
          <div className="space-y-2">
            {documents.map(doc => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-gray-400">
                    {getFileIcon(doc.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {doc.size} • {doc.uploadedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDocument(doc.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
