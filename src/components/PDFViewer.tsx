
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PDFViewerProps {
  pdfUrl: string | null;
  onTextSelect: (text: string) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, onTextSelect }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(100);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    if (pdfUrl) {
      // For demo purposes, set a total page count
      setTotalPages(2);
    }
  }, [pdfUrl]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  // Demo handler for text selection
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== '') {
      onTextSelect(selection.toString());
    }
  };

  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-14rem)] bg-muted/30 rounded-lg border border-border">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium mb-4">No PDF loaded</p>
          <p className="text-sm">Please upload a PDF to start annotating</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="toolbar sticky top-0 z-10 mb-4 flex justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handlePrevPage} 
            disabled={currentPage <= 1}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={currentPage}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value > 0 && value <= totalPages) {
                  setCurrentPage(value);
                }
              }}
              className="w-12 h-8 text-center rounded-md border"
            />
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm text-muted-foreground">{totalPages}</span>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleNextPage} 
            disabled={currentPage >= totalPages}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            className="h-8 w-8"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-sm w-16 text-center">{zoom}%</span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div 
        className="document-container flex-1 overflow-auto rounded-lg relative"
        onMouseUp={handleTextSelection}
      >
        {/* This would be replaced with a PDF rendering library in a real implementation */}
        <div 
          className="pdf-page relative bg-white rounded-lg shadow-lg border border-border/20"
          style={{ 
            width: `${6.12 * (zoom / 100)}rem`, 
            height: `${7.92 * (zoom / 100)}rem`,
            margin: '2rem auto'
          }}
        >
          {pdfUrl && (
            <div className="p-6 absolute inset-0">
              <img 
                src="/lovable-uploads/f27e281e-140d-4362-84d9-f91913b1ec10.png" 
                alt="PDF Preview" 
                className="w-full h-auto object-contain opacity-70"
              />
              
              {/* Example selectable text overlays for demo */}
              <div className="absolute left-[30%] top-[40%] cursor-text">
                <p className="text-sm font-medium">Group Policy No.: TS 05374370-G</p>
              </div>
              <div className="absolute left-[30%] top-[45%] cursor-text">
                <p className="text-sm">Policyholder: Oklahoma Public Employees Health & Welfare Plan</p>
              </div>
              <div className="absolute left-[30%] top-[50%] cursor-text">
                <p className="text-sm">Effective Date: July 1, 2021</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
