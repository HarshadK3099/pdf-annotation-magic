
import React, { useState } from 'react';
import { Upload, FileText, Download, Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const PDFGenerator: React.FC = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
      toast.success('CSV file uploaded successfully');
    }
  };
  
  const handleGeneratePDFs = () => {
    if (!csvFile) {
      toast.error('Please upload a CSV file first');
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate PDF generation process
    setTimeout(() => {
      setIsGenerating(false);
      
      // Create a synthetic PDF for download
      const pdfContent = generateSyntheticPDF();
      const pdfBlob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(pdfBlob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = 'generated_document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('PDF generated and downloaded');
    }, 2000);
  };
  
  // Function to generate a simple PDF document as a string
  const generateSyntheticPDF = () => {
    // This is a very simple PDF structure
    return '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Resources<<>>/Contents 4 0 R/Parent 2 0 R>>endobj 4 0 obj<</Length 22>>stream\nBT /F1 12 Tf 100 700 Td (Generated PDF from CSV data) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\n0000000199 00000 n\ntrailer<</Size 5/Root 1 0 R>>\nstartxref\n271\n%%EOF';
  };
  
  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">PDF Generator</h3>
        </div>
      </div>
      
      <div className="bg-muted/30 rounded-lg border border-border p-6 mb-4">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Upload CSV Data</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload your CSV file with data for PDF generation
          </p>
          
          <div className="flex items-center justify-center">
            <label 
              htmlFor="csv-upload" 
              className="cursor-pointer flex items-center justify-center px-4 py-2 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm text-primary font-medium">Select CSV file</span>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleCsvUpload}
              />
            </label>
          </div>
          
          {csvFile && (
            <div className="mt-4 text-sm flex items-center justify-center">
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{csvFile.name}</span>
            </div>
          )}
        </div>
      </div>
      
      <Separator className="my-6" />
      
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Generation Options</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Output Folder
            </label>
            <Input value="./output" disabled className="text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              File Prefix
            </label>
            <Input defaultValue="doc_" className="text-sm" />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          variant="secondary" 
          size="sm" 
          className="mr-2"
          onClick={() => toast.info('Settings panel would open here')}
        >
          <Settings className="h-4 w-4 mr-1" />
          Settings
        </Button>
        <Button 
          onClick={handleGeneratePDFs} 
          disabled={!csvFile || isGenerating}
          className="relative overflow-hidden group"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Generate PDFs
            </>
          )}
          <span className="absolute inset-0 w-full h-full bg-primary/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
        </Button>
      </div>
    </div>
  );
};

export default PDFGenerator;
