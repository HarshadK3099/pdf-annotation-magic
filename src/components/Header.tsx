
import React from 'react';
import { FileText, File, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface HeaderProps {
  onPDFUpload: (file: File) => void;
  onJSONUpload: (file: File) => void;
  onDownloadJSON: () => void;
  onOpenUploader: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onPDFUpload, 
  onJSONUpload, 
  onDownloadJSON,
  onOpenUploader
}) => {
  
  const handlePDFInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check if the file is a PDF
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        toast.error('Please upload a PDF file');
        return;
      }
      onPDFUpload(file);
      toast.success('PDF uploaded successfully');
    }
  };
  
  const handleJSONInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check if the file is a JSON
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        toast.error('Please upload a JSON file');
        return;
      }
      onJSONUpload(file);
      toast.success('JSON uploaded successfully');
    }
  };
  
  return (
    <header className="py-4 px-6 border-b border-border flex items-center justify-between bg-card/60 backdrop-blur-md">
      <div className="flex items-center">
        <h1 className="text-2xl font-semibold">PDF Annotator</h1>
        <span className="ml-3 text-sm text-muted-foreground">base</span>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onOpenUploader}
        >
          <FileText className="h-4 w-4" />
          <span>Open PDF Uploader</span>
        </Button>
        
        <div className="relative">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            <span>Quick Upload PDF</span>
          </Button>
          <input
            type="file"
            accept=".pdf,application/pdf"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handlePDFInputChange}
          />
        </div>
        
        <div className="relative">
          <Button 
            variant="outline"
            className="flex items-center gap-2"
          >
            <File className="h-4 w-4" />
            <span>Upload JSON</span>
          </Button>
          <input
            type="file"
            accept=".json,application/json"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleJSONInputChange}
          />
        </div>
        
        <Button 
          variant="outline"
          onClick={onDownloadJSON}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          <span>Download JSON</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
