
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export interface Annotation {
  id: string;
  text: string;
  context: string;
}

export const useAnnotations = () => {
  const [selectedText, setSelectedText] = useState('');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

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

  // Handle saving annotations
  const handleSaveAnnotations = () => {
    // In a real app, this would send the annotations to the backend
    console.log('Saving annotations:', annotations);
    toast.success('Annotations saved');
  };

  return {
    selectedText,
    annotations,
    handleTextSelect,
    handleAddAnnotation,
    handleDeleteAnnotation,
    handleSaveAnnotations,
    setAnnotations
  };
};
