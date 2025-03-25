
import React from 'react';
import Header from '@/components/Header';
import PDFWorkspace from '@/components/PDFWorkspace';
import PDFUploader from '@/components/PDFUploader';
import { useAnnotations } from '@/hooks/useAnnotations';
import { useFileManagement } from '@/hooks/useFileManagement';

const Index = () => {
  const {
    selectedText,
    annotations,
    editingAnnotation,
    handleTextSelect,
    handleAddAnnotation,
    handleDeleteAnnotation,
    handleEditAnnotation,
    handleSaveAnnotations,
    setAnnotations,
    setEditingAnnotation
  } = useAnnotations();
  
  const {
    pdfUrl,
    showUploader,
    handlePDFUpload,
    handleJSONUpload,
    handleToggleUploader,
    createDownloadJSONWithAnnotations
  } = useFileManagement(setAnnotations);
  
  // Create a download handler with current annotations
  const handleDownloadJSON = createDownloadJSONWithAnnotations(annotations);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        onPDFUpload={handlePDFUpload} 
        onJSONUpload={handleJSONUpload} 
        onDownloadJSON={handleDownloadJSON}
        onOpenUploader={handleToggleUploader}
      />
      
      <main className="flex-1 container py-6">
        {showUploader ? (
          <PDFUploader onPDFUpload={handlePDFUpload} />
        ) : pdfUrl ? (
          <PDFWorkspace />
        ) : (
          <div className="flex items-center justify-center h-[calc(100vh-14rem)] bg-muted/30 rounded-lg">
            <div className="text-center text-muted-foreground">
              <p className="text-lg font-medium mb-4">No PDF loaded</p>
              <p className="text-sm mb-6">Please upload a PDF to start annotating</p>
              <button 
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                onClick={handleToggleUploader}
              >
                Open PDF Uploader
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
