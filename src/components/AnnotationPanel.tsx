import React, { useState, useEffect } from 'react';
import { Tag, Search, Plus, Trash, Download, Save, Edit, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Annotation {
  id: string;
  text: string;
  context: string;
}

interface AnnotationPanelProps {
  selectedText: string;
  annotations: Annotation[];
  editingAnnotation: string | null;
  onAddAnnotation: (text: string, context: string) => void;
  onDeleteAnnotation: (id: string) => void;
  onEditAnnotation: (id: string, newContext: string) => void;
  onDownloadJSON: () => void;
  onSaveAnnotations: () => void;
  setEditingAnnotation: (id: string | null) => void;
}

const AnnotationPanel: React.FC<AnnotationPanelProps> = ({
  selectedText,
  annotations,
  editingAnnotation,
  onAddAnnotation,
  onDeleteAnnotation,
  onEditAnnotation,
  onDownloadJSON,
  onSaveAnnotations,
  setEditingAnnotation
}) => {
  const [contextName, setContextName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editText, setEditText] = useState('');

  const filteredAnnotations = annotations.filter(annotation => 
    annotation.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    annotation.context.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAnnotation = () => {
    if (!selectedText) {
      toast.error('Please select text from the document first');
      return;
    }
    
    if (!contextName) {
      toast.error('Please enter an annotation name');
      return;
    }
    
    if (annotations.some(ann => ann.context === contextName)) {
      toast.error('Annotation name already exists');
      return;
    }
    
    onAddAnnotation(selectedText, contextName);
    setContextName('');
    toast.success('Annotation added');
  };

  const handleStartEdit = (id: string, currentContext: string) => {
    setEditingAnnotation(id);
    setEditText(currentContext);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleCancelEdit = () => {
    setEditingAnnotation(null);
    setEditText('');
  };

  const handleSaveEdit = (id: string) => {
    onEditAnnotation(id, editText);
    setEditText('');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Tag className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Annotations</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {annotations.length} items
          </span>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDownloadJSON}
            className="h-8"
          >
            <Download className="h-4 w-4 mr-1" />
            <span className="text-xs">Export</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSaveAnnotations}
            className="h-8"
          >
            <Save className="h-4 w-4 mr-1" />
            <span className="text-xs">Save</span>
          </Button>
        </div>
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search annotations..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {selectedText && (
        <div className="bg-muted/50 p-4 rounded-lg mb-4 animate-fade-in">
          <p className="text-sm font-medium mb-2">Selected Text:</p>
          <p className="text-sm border-l-2 border-primary pl-3 py-1 bg-primary/5">{selectedText}</p>
          <div className="flex mt-3 space-x-2">
            <Input
              type="text"
              placeholder="Annotation name"
              value={contextName}
              onChange={(e) => setContextName(e.target.value)}
              className="text-sm"
            />
            <Button size="sm" onClick={handleAddAnnotation}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-auto">
        {filteredAnnotations.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <p className="text-sm">No annotations found</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {filteredAnnotations.map((annotation) => (
              <li 
                key={annotation.id} 
                className="bg-card border border-border p-3 rounded-lg group hover:border-primary/50 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {editingAnnotation === annotation.id ? (
                      <div className="flex items-center space-x-2 mb-1">
                        <Input
                          type="text"
                          value={editText}
                          onChange={handleEditChange}
                          className="text-xs h-7 py-1"
                          autoFocus
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => handleSaveEdit(annotation.id)}
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={handleCancelEdit}
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-medium text-primary mb-1">{annotation.context}</p>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                          onClick={() => handleStartEdit(annotation.id, annotation.context)}
                        >
                          <Edit className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </div>
                    )}
                    <p className="text-sm">{annotation.text}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onDeleteAnnotation(annotation.id)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AnnotationPanel;
