
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import PDFViewer from '@/components/PDFViewer';
import AnnotationPanel from '@/components/AnnotationPanel';
import PDFGenerator from '@/components/PDFGenerator';
import PDFUploader from '@/components/PDFUploader';
import { Annotation } from '@/hooks/useAnnotations';

interface MainContentProps {
  showUploader: boolean;
  pdfUrl: string | null;
  selectedText: string;
  annotations: Annotation[];
  editingAnnotation: string | null;
  onTextSelect: (text: string) => void;
  onAddAnnotation: (text: string, context: string) => void;
  onDeleteAnnotation: (id: string) => void;
  onEditAnnotation: (id: string, newContext: string) => void;
  onDownloadJSON: () => void;
  onSaveAnnotations: () => void;
  onPDFUpload: (file: File) => void;
  setEditingAnnotation: (id: string | null) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  showUploader,
  pdfUrl,
  selectedText,
  annotations,
  editingAnnotation,
  onTextSelect,
  onAddAnnotation,
  onDeleteAnnotation,
  onEditAnnotation,
  onDownloadJSON,
  onSaveAnnotations,
  onPDFUpload,
  setEditingAnnotation
}) => {
  if (showUploader) {
    return (
      <div className="h-[calc(100vh-12rem)]">
        <PDFUploader onPDFUpload={onPDFUpload} />
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
      <div className="col-span-2">
        <PDFViewer pdfUrl={pdfUrl} onTextSelect={onTextSelect} />
      </div>
      
      <div className="col-span-1">
        <Tabs defaultValue="annotations" className="h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="annotations">Annotations</TabsTrigger>
            <TabsTrigger value="generator">PDF Generator</TabsTrigger>
          </TabsList>
          
          <TabsContent value="annotations" className="h-[calc(100%-2.5rem)] mt-4">
            <AnnotationPanel 
              selectedText={selectedText}
              annotations={annotations}
              editingAnnotation={editingAnnotation}
              onAddAnnotation={onAddAnnotation}
              onDeleteAnnotation={onDeleteAnnotation}
              onEditAnnotation={onEditAnnotation}
              onDownloadJSON={onDownloadJSON}
              onSaveAnnotations={onSaveAnnotations}
              setEditingAnnotation={setEditingAnnotation}
            />
          </TabsContent>
          
          <TabsContent value="generator" className="h-[calc(100%-2.5rem)] mt-4">
            <PDFGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MainContent;
