
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
  const [editingAnnotation, setEditingAnnotation] = useState<string | null>(null);

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

  // Handle editing an annotation name
  const handleEditAnnotation = (id: string, newContext: string) => {
    if (!newContext.trim()) {
      toast.error('Annotation name cannot be empty');
      return;
    }
    
    // Check if the new name already exists in other annotations
    if (annotations.some(ann => ann.id !== id && ann.context === newContext)) {
      toast.error('Annotation name already exists');
      return;
    }
    
    setAnnotations(annotations.map(ann => 
      ann.id === id ? { ...ann, context: newContext } : ann
    ));
    setEditingAnnotation(null);
    toast.success('Annotation updated');
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
    editingAnnotation,
    handleTextSelect,
    handleAddAnnotation,
    handleDeleteAnnotation,
    handleEditAnnotation,
    handleSaveAnnotations,
    setAnnotations,
    setEditingAnnotation
  };
};
