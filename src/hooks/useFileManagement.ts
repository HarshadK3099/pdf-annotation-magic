
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Annotation } from './useAnnotations';

export const useFileManagement = (setAnnotations: (annotations: Annotation[]) => void) => {
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
                  id: crypto.randomUUID(),
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
  
  // Handle downloading JSON
  const handleDownloadJSON = () => {
    // Create a JSON structure with annotations
    let jsonOutput: any[] = [];
    
    if (jsonData && Array.isArray(jsonData)) {
      // Clone the original JSON data
      jsonOutput = [...jsonData];
      
      // This would be populated from the annotations passed in from props
    } else {
      // Create minimal JSON with just the annotations
      // This would be populated from the annotations passed in from props
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
  
  // Toggle the PDF uploader
  const handleToggleUploader = () => {
    setShowUploader(prev => !prev);
  };
  
  // Create a wrapped version of handleDownloadJSON that includes annotations
  const createDownloadJSONWithAnnotations = (annotations: Annotation[]) => {
    return () => {
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
  };
  
  useEffect(() => {
    // Cleanup URLs when component unmounts
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);
  
  return {
    pdfUrl,
    showUploader,
    handlePDFUpload,
    handleJSONUpload,
    handleToggleUploader,
    createDownloadJSONWithAnnotations
  };
};
