
import React from 'react';
import { FilePdf, FileJson, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface HeaderProps {
  onPDFUpload: (file: File) => void;
  onJSONUpload: (file: File) => void;
  onDownloadJSON: () => void;
}

const Header: React.FC<HeaderProps> = ({ onPDFUpload, onJSONUpload, onDownloadJSON }) => {
  
  const handlePDFInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onPDFUpload(e.target.files[0]);
      toast.success('PDF uploaded successfully');
    }
  };
  
  const handleJSONInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onJSONUpload(e.target.files[0]);
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
        <div className="relative">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <FilePdf className="h-4 w-4" />
            <span>Upload PDF</span>
          </Button>
          <input
            type="file"
            accept=".pdf"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handlePDFInputChange}
          />
        </div>
        
        <div className="relative">
          <Button 
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileJson className="h-4 w-4" />
            <span>Upload JSON</span>
          </Button>
          <input
            type="file"
            accept=".json"
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
