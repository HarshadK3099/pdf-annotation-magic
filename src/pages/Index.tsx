
import React from 'react';
import Header from '@/components/Header';
import MainContent from '@/components/MainContent';
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
        <MainContent 
          showUploader={showUploader}
          pdfUrl={pdfUrl}
          selectedText={selectedText}
          annotations={annotations}
          editingAnnotation={editingAnnotation}
          onTextSelect={handleTextSelect}
          onAddAnnotation={handleAddAnnotation}
          onDeleteAnnotation={handleDeleteAnnotation}
          onEditAnnotation={handleEditAnnotation}
          onDownloadJSON={handleDownloadJSON}
          onSaveAnnotations={handleSaveAnnotations}
          onPDFUpload={handlePDFUpload}
          setEditingAnnotation={setEditingAnnotation}
        />
      </main>
    </div>
  );
};

export default Index;
