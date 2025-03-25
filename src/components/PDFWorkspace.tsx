
import React from 'react';
import PDFViewer from '@/components/PDFViewer';
import AnnotationPanel from '@/components/AnnotationPanel';
import { ResizablePanelGroup, ResizablePanel } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnnotations } from '@/hooks/useAnnotations';

const PDFWorkspace = () => {
  const { 
    selectedText,
    annotations,
    editingAnnotation,
    handleTextSelect,
    handleAddAnnotation,
    handleDeleteAnnotation,
    handleEditAnnotation,
    handleSaveAnnotations,
    setEditingAnnotation
  } = useAnnotations();

  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
      {/* PDF Viewer panel */}
      <ResizablePanel 
        defaultSize={75} 
        minSize={60} 
        maxSize={80} 
        className="flex-1 p-4 overflow-hidden flex flex-col"
      >
        <PDFViewer 
          pdfUrl={window.selectedPdfUrl || null} 
          onTextSelect={handleTextSelect}
        />
      </ResizablePanel>
      
      {/* Annotation panel */}
      <ResizablePanel defaultSize={25} minSize={20} className="flex flex-col overflow-hidden">
        <Tabs defaultValue="annotations" className="h-full flex flex-col">
          <TabsList className="grid grid-cols-1 mx-2 my-2">
            <TabsTrigger value="annotations">Annotations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="annotations" className="flex-1 overflow-auto p-3">
            <AnnotationPanel 
              selectedText={selectedText}
              annotations={annotations}
              editingAnnotation={editingAnnotation}
              onAddAnnotation={handleAddAnnotation}
              onDeleteAnnotation={handleDeleteAnnotation}
              onEditAnnotation={handleEditAnnotation}
              onSaveAnnotations={handleSaveAnnotations}
              onDownloadJSON={() => {}} // We'll implement this separately
              setEditingAnnotation={setEditingAnnotation}
            />
          </TabsContent>
        </Tabs>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default PDFWorkspace;
