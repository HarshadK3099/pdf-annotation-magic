
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import Header from '@/components/Header';
import PDFViewer from '@/components/PDFViewer';
import AnnotationPanel from '@/components/AnnotationPanel';
import PDFGenerator from '@/components/PDFGenerator';
import PDFUploader from '@/components/PDFUploader';

interface Annotation {
  id: string;
  text: string;
  context: string;
}

const Index = () => {
  const [selectedText, setSelectedText] = useState('');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [jsonData, setJsonData] = useState<any | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  
  // Handle PDF upload
  const handlePDFUpload = (file: File) => {
    setPdfFile(file);
    // Revoke previous URL to prevent memory leaks
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    const url = URL.createObjectURL(file);
    setPdfUrl(url);
    
    // Close uploader after successful upload
    setShowUploader(false);
    
    // Reset annotations when a new PDF is uploaded
    setAnnotations([]);
    setSelectedText('');
    
    // In a real app, this would trigger the backend conversion process
    console.log('PDF uploaded, backend would convert to JSON');
    setTimeout(() => {
      toast.success('PDF processed successfully');
    }, 1000);
  };
  
  // Handle JSON upload
  const handleJSONUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (e.target?.result) {
          const data = JSON.parse(e.target.result as string);
          setJsonData(data);
          
          // Extract annotations from JSON if they exist
          const extractedAnnotations: Annotation[] = [];
          if (Array.isArray(data)) {
            data.forEach((item) => {
              if (item.type === 'text' && item.context) {
                extractedAnnotations.push({
                  id: uuidv4(),
                  text: item.text,
                  context: item.context
                });
              }
            });
          }
          
          if (extractedAnnotations.length > 0) {
            setAnnotations(extractedAnnotations);
            toast.success(`Loaded ${extractedAnnotations.length} annotations`);
          }
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        toast.error('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };
  
  // Handle text selection from PDF
  const handleTextSelect = (text: string) => {
    if (text.trim()) {
      setSelectedText(text);
      console.log('Selected text:', text);
    }
  };
  
  // Handle adding an annotation
  const handleAddAnnotation = (text: string, context: string) => {
    const newAnnotation: Annotation = {
      id: uuidv4(),
      text,
      context
    };
    setAnnotations([...annotations, newAnnotation]);
    setSelectedText('');
  };
  
  // Handle deleting an annotation
  const handleDeleteAnnotation = (id: string) => {
    setAnnotations(annotations.filter(ann => ann.id !== id));
    toast.success('Annotation deleted');
  };
  
  // Handle downloading JSON
  const handleDownloadJSON = () => {
    // Create a JSON structure with annotations
    let jsonOutput: any[] = [];
    
    if (jsonData && Array.isArray(jsonData)) {
      // Clone the original JSON data
      jsonOutput = [...jsonData];
      
      // Update or add context fields to text elements
      jsonOutput = jsonOutput.map(item => {
        if (item.type === 'text') {
          // Find if we have an annotation for this text
          const annotation = annotations.find(ann => ann.text === item.text);
          if (annotation) {
            return {
              ...item,
              context: annotation.context
            };
          }
        }
        return item;
      });
    } else {
      // Create minimal JSON with just the annotations
      jsonOutput = annotations.map(ann => ({
        type: 'text',
        text: ann.text,
        context: ann.context
      }));
    }
    
    // Create and download the JSON file
    const dataStr = JSON.stringify(jsonOutput, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'annotated_template.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('JSON downloaded successfully');
  };
  
  // Handle saving annotations
  const handleSaveAnnotations = () => {
    // In a real app, this would send the annotations to the backend
    console.log('Saving annotations:', annotations);
    toast.success('Annotations saved');
  };
  
  // Toggle the PDF uploader
  const handleToggleUploader = () => {
    setShowUploader(prev => !prev);
  };
  
  useEffect(() => {
    // Cleanup URLs when component unmounts
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, []);
  
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
          <div className="h-[calc(100vh-12rem)]">
            <PDFUploader onPDFUpload={handlePDFUpload} />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
            <div className="col-span-2">
              <PDFViewer pdfUrl={pdfUrl} onTextSelect={handleTextSelect} />
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
                    onAddAnnotation={handleAddAnnotation}
                    onDeleteAnnotation={handleDeleteAnnotation}
                    onDownloadJSON={handleDownloadJSON}
                    onSaveAnnotations={handleSaveAnnotations}
                  />
                </TabsContent>
                
                <TabsContent value="generator" className="h-[calc(100%-2.5rem)] mt-4">
                  <PDFGenerator />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
