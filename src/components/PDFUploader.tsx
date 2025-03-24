
import React, { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PDFUploaderProps {
  onPDFUpload: (file: File) => void;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onPDFUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileValidation(file);
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFileValidation(file);
    }
  };
  
  const handleFileValidation = (file: File) => {
    // Check if the file is a PDF
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      toast.error('Please upload a PDF file');
      return;
    }
    
    setSelectedFile(file);
    onPDFUpload(file);
    toast.success('PDF uploaded successfully');
  };
  
  const handleCancelSelection = () => {
    setSelectedFile(null);
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">PDF Uploader</h3>
        </div>
      </div>
      
      <div 
        className={`flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-8 transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50 hover:bg-muted/20'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-16 w-16 bg-primary/10 rounded-full mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <p className="font-medium mb-1">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground mb-4">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={handleCancelSelection}
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
              <Button 
                size="sm" 
                onClick={() => onPDFUpload(selectedFile)}
              >
                <Upload className="h-4 w-4 mr-1" />
                Use this PDF
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center h-16 w-16 bg-primary/10 rounded-full mb-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Upload PDF</h3>
            <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
              Drag and drop your PDF file here, or click the button below to browse your files
            </p>
            <label className="cursor-pointer">
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Browse files
              </Button>
              <input 
                type="file" 
                accept=".pdf,application/pdf" 
                className="hidden" 
                onChange={handleFileSelect}
              />
            </label>
          </>
        )}
      </div>
    </div>
  );
};

export default PDFUploader;
