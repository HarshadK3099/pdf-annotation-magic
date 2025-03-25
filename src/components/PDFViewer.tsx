
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (pdfUrl) {
      // For demo purposes, set a total page count
      setTotalPages(2);
      setCurrentPage(1);
    }
  }, [pdfUrl]);

  useEffect(() => {
    // Set up global listener for text selection
    const handleGlobalSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim() !== '') {
        onTextSelect(selection.toString());
      }
    };

    document.addEventListener('mouseup', handleGlobalSelection);
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalSelection);
    };
  }, [onTextSelect]);

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
      <div className="toolbar sticky top-0 z-10 mb-4 flex justify-between bg-card/80 backdrop-blur-md rounded-lg p-2 shadow-sm">
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
        ref={containerRef}
        className="document-container flex-1 overflow-auto rounded-lg relative p-4"
      >
        {pdfUrl && (
          <div 
            className="pdf-page relative bg-white rounded-lg shadow-lg border border-border/20 mx-auto"
            style={{ 
              width: `${8.5 * (zoom / 100)}in`, 
              height: `${11 * (zoom / 100)}in`,
            }}
          >
            {/* Display the PDF using an iframe */}
            <iframe
              ref={iframeRef}
              src={pdfUrl}
              className="absolute inset-0 w-full h-full"
              title="PDF Viewer"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
