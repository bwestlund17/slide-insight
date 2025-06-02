import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Move, 
  Type, 
  Image, 
  Square, 
  Circle, 
  Triangle, 
  Save, 
  Copy, 
  Trash2, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  ChevronDown,
  Plus,
  Minus
} from 'lucide-react';

// Define types for slide elements
type ElementType = 'text' | 'image' | 'shape' | 'chart';
type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'line';

interface Element {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style?: {
    color?: string;
    backgroundColor?: string;
    fontSize?: number;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    textAlign?: 'left' | 'center' | 'right';
    opacity?: number;
    borderRadius?: number;
    borderWidth?: number;
    borderColor?: string;
    rotation?: number;
  };
  shapeType?: ShapeType;
  imageUrl?: string;
}

interface SlideEditorProps {
  slideId: string;
  elements: Element[];
  onUpdateElements: (elements: Element[]) => void;
  background?: string;
}

const SlideEditor: React.FC<SlideEditorProps> = ({ 
  slideId, 
  elements, 
  onUpdateElements,
  background = '#ffffff'
}) => {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ElementType | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [moveStartPos, setMoveStartPos] = useState({ x: 0, y: 0 });
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [fontOptions, setFontOptions] = useState({
    family: 'Inter',
    size: 16,
    color: '#000000',
  });
  
  const selectedElement = elements.find(el => el.id === selectedElementId);
  
  // Function to add a new element
  const addElement = (type: ElementType) => {
    const newId = Date.now().toString();
    const centerX = editorRef.current ? editorRef.current.clientWidth / 2 - 100 : 100;
    const centerY = editorRef.current ? editorRef.current.clientHeight / 2 - 50 : 100;
    
    let newElement: Element = {
      id: newId,
      type,
      x: centerX,
      y: centerY,
      width: 200,
      height: 100,
    };
    
    // Set default properties based on type
    switch (type) {
      case 'text':
        newElement.content = 'Double click to edit text';
        newElement.style = {
          color: '#000000',
          fontSize: 16,
          textAlign: 'left',
        };
        break;
      case 'shape':
        newElement.shapeType = 'rectangle';
        newElement.style = {
          backgroundColor: '#2563EB',
          opacity: 0.8,
          borderRadius: 0,
        };
        break;
      case 'image':
        newElement.imageUrl = 'https://via.placeholder.com/200x100';
        break;
    }
    
    const newElements = [...elements, newElement];
    onUpdateElements(newElements);
    setSelectedElementId(newId);
    setActiveTool(null);
  };
  
  // Function to handle element selection
  const handleElementClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedElementId(id);
  };
  
  // Function to handle element movement
  const handleElementMoveStart = (e: React.MouseEvent) => {
    if (!selectedElementId) return;
    
    setIsMoving(true);
    setMoveStartPos({
      x: e.clientX,
      y: e.clientY
    });
  };
  
  const handleElementMove = (e: React.MouseEvent) => {
    if (!isMoving || !selectedElementId) return;
    
    const dx = e.clientX - moveStartPos.x;
    const dy = e.clientY - moveStartPos.y;
    
    setMoveStartPos({
      x: e.clientX,
      y: e.clientY
    });
    
    const newElements = elements.map(el => {
      if (el.id === selectedElementId) {
        return {
          ...el,
          x: el.x + dx,
          y: el.y + dy
        };
      }
      return el;
    });
    
    onUpdateElements(newElements);
  };
  
  const handleElementMoveEnd = () => {
    setIsMoving(false);
  };
  
  // Function to update text content
  const handleTextChange = (id: string, newContent: string) => {
    const newElements = elements.map(el => {
      if (el.id === id) {
        return {
          ...el,
          content: newContent
        };
      }
      return el;
    });
    
    onUpdateElements(newElements);
  };
  
  // Function to update element style
  const updateElementStyle = (id: string, styleUpdates: Partial<Element['style']>) => {
    const newElements = elements.map(el => {
      if (el.id === id) {
        return {
          ...el,
          style: {
            ...(el.style || {}),
            ...styleUpdates
          }
        };
      }
      return el;
    });
    
    onUpdateElements(newElements);
  };
  
  // Function to delete the selected element
  const deleteSelectedElement = () => {
    if (!selectedElementId) return;
    
    const newElements = elements.filter(el => el.id !== selectedElementId);
    onUpdateElements(newElements);
    setSelectedElementId(null);
  };
  
  // Reset selection when clicking on the editor background
  const handleEditorClick = () => {
    setSelectedElementId(null);
  };
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete element with Delete key
      if (e.key === 'Delete' && selectedElementId) {
        deleteSelectedElement();
      }
      
      // Copy element with Ctrl+C
      if (e.key === 'c' && e.ctrlKey && selectedElementId) {
        // Implementation for copy functionality
      }
      
      // Paste element with Ctrl+V
      if (e.key === 'v' && e.ctrlKey) {
        // Implementation for paste functionality
      }
      
      // Save with Ctrl+S
      if (e.key === 's' && e.ctrlKey) {
        e.preventDefault();
        // Implementation for save functionality
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, elements]);
  
  // Render element based on type
  const renderElement = (element: Element) => {
    const isSelected = element.id === selectedElementId;
    
    const baseProps = {
      style: {
        position: 'absolute',
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        ...(element.style?.rotation ? { transform: `rotate(${element.style.rotation}deg)` } : {})
      },
      onClick: (e: React.MouseEvent) => handleElementClick(e, element.id),
      className: `absolute ${isSelected ? 'ring-2 ring-blue-500' : ''}`
    };
    
    switch (element.type) {
      case 'text':
        return (
          <div
            {...baseProps}
            style={{
              ...baseProps.style as React.CSSProperties,
              color: element.style?.color,
              fontSize: `${element.style?.fontSize}px`,
              fontWeight: element.style?.fontWeight,
              fontStyle: element.style?.fontStyle,
              textDecoration: element.style?.textDecoration,
              textAlign: element.style?.textAlign,
              padding: '8px',
              outline: 'none',
            }}
            contentEditable={isSelected}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleTextChange(element.id, e.currentTarget.textContent || '')}
          >
            {element.content}
          </div>
        );
      
      case 'shape':
        let ShapeComponent: React.ReactNode;
        
        switch (element.shapeType) {
          case 'rectangle':
            ShapeComponent = (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: element.style?.backgroundColor,
                  opacity: element.style?.opacity,
                  borderRadius: `${element.style?.borderRadius}px`,
                  border: element.style?.borderWidth 
                    ? `${element.style.borderWidth}px solid ${element.style.borderColor || '#000'}`
                    : 'none'
                }}
              />
            );
            break;
          
          case 'circle':
            ShapeComponent = (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: element.style?.backgroundColor,
                  opacity: element.style?.opacity,
                  borderRadius: '50%',
                  border: element.style?.borderWidth 
                    ? `${element.style.borderWidth}px solid ${element.style.borderColor || '#000'}`
                    : 'none'
                }}
              />
            );
            break;
          
          case 'triangle':
            ShapeComponent = (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '50%',
                    width: '0',
                    height: '0',
                    borderLeft: `${element.width / 2}px solid transparent`,
                    borderRight: `${element.width / 2}px solid transparent`,
                    borderBottom: `${element.height}px solid ${element.style?.backgroundColor || '#2563EB'}`,
                    transform: 'translateX(-50%)',
                    opacity: element.style?.opacity,
                  }}
                />
              </div>
            );
            break;
            
          default:
            ShapeComponent = <div />;
        }
        
        return (
          <div {...baseProps}>
            {ShapeComponent}
          </div>
        );
      
      case 'image':
        return (
          <div {...baseProps}>
            <img
              src={element.imageUrl}
              alt="Slide element"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                opacity: element.style?.opacity
              }}
            />
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Top toolbar */}
      <div className="flex items-center p-2 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-1">
          <button
            className={`p-1.5 rounded ${activeTool === 'text' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTool(activeTool === 'text' ? null : 'text')}
            title="Add text"
          >
            <Type size={18} />
          </button>
          <button
            className={`p-1.5 rounded ${activeTool === 'image' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTool(activeTool === 'image' ? null : 'image')}
            title="Add image"
          >
            <Image size={18} />
          </button>
          <button
            className={`p-1.5 rounded ${activeTool === 'shape' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTool(activeTool === 'shape' ? null : 'shape')}
            title="Add shape"
          >
            <Square size={18} />
          </button>
          <div className="h-5 mx-1 border-l border-gray-300"></div>
          <button
            className="p-1.5 rounded text-gray-600 hover:bg-gray-100"
            title="Move"
          >
            <Move size={18} />
          </button>
          <button
            className="p-1.5 rounded text-gray-600 hover:bg-gray-100"
            onClick={() => selectedElementId && deleteSelectedElement()}
            disabled={!selectedElementId}
            title="Delete"
          >
            <Trash2 size={18} className={selectedElementId ? '' : 'opacity-50'} />
          </button>
        </div>
        
        <div className="ml-4 border-l border-gray-300 pl-4 flex items-center space-x-1">
          {selectedElement?.type === 'text' && (
            <>
              <select 
                className="h-8 rounded border border-gray-200 text-sm"
                value={fontOptions.family}
                onChange={(e) => setFontOptions({...fontOptions, family: e.target.value})}
              >
                <option value="Inter">Inter</option>
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
              </select>
              
              <div className="flex items-center border border-gray-200 rounded">
                <button
                  className="p-1 hover:bg-gray-100"
                  onClick={() => setFontOptions({...fontOptions, size: Math.max(8, fontOptions.size - 1)})}
                >
                  <Minus size={14} />
                </button>
                <span className="px-2 text-sm">{fontOptions.size}</span>
                <button
                  className="p-1 hover:bg-gray-100"
                  onClick={() => setFontOptions({...fontOptions, size: Math.min(72, fontOptions.size + 1)})}
                >
                  <Plus size={14} />
                </button>
              </div>
              
              <div className="flex items-center space-x-1">
                <button
                  className={`p-1.5 rounded ${selectedElement?.style?.fontWeight === 'bold' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                  onClick={() => updateElementStyle(selectedElementId!, { 
                    fontWeight: selectedElement?.style?.fontWeight === 'bold' ? 'normal' : 'bold'
                  })}
                >
                  <Bold size={16} />
                </button>
                <button
                  className={`p-1.5 rounded ${selectedElement?.style?.fontStyle === 'italic' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                  onClick={() => updateElementStyle(selectedElementId!, {
                    fontStyle: selectedElement?.style?.fontStyle === 'italic' ? 'normal' : 'italic'
                  })}
                >
                  <Italic size={16} />
                </button>
                <button
                  className={`p-1.5 rounded ${selectedElement?.style?.textDecoration === 'underline' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                  onClick={() => updateElementStyle(selectedElementId!, {
                    textDecoration: selectedElement?.style?.textDecoration === 'underline' ? 'none' : 'underline'
                  })}
                >
                  <Underline size={16} />
                </button>
              </div>
              
              <div className="flex items-center space-x-1 ml-2">
                <button
                  className={`p-1.5 rounded ${selectedElement?.style?.textAlign === 'left' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                  onClick={() => updateElementStyle(selectedElementId!, { textAlign: 'left' })}
                >
                  <AlignLeft size={16} />
                </button>
                <button
                  className={`p-1.5 rounded ${selectedElement?.style?.textAlign === 'center' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                  onClick={() => updateElementStyle(selectedElementId!, { textAlign: 'center' })}
                >
                  <AlignCenter size={16} />
                </button>
                <button
                  className={`p-1.5 rounded ${selectedElement?.style?.textAlign === 'right' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                  onClick={() => updateElementStyle(selectedElementId!, { textAlign: 'right' })}
                >
                  <AlignRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
        
        <div className="ml-auto flex items-center">
          <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm flex items-center hover:bg-blue-700 transition-colors">
            <Save size={16} className="mr-1.5" />
            Save
          </button>
        </div>
      </div>
      
      {/* Editor canvas */}
      <div className="flex-1 relative overflow-auto bg-gray-100 p-8">
        <div 
          ref={editorRef}
          className="mx-auto aspect-[16/9] relative shadow-lg"
          style={{ 
            width: '1024px', 
            maxWidth: '100%', 
            backgroundColor: background,
            outline: selectedElementId ? 'none' : '1px solid #e5e7eb'
          }}
          onClick={handleEditorClick}
          onMouseMove={isMoving ? handleElementMove : undefined}
          onMouseUp={isMoving ? handleElementMoveEnd : undefined}
          onMouseLeave={isMoving ? handleElementMoveEnd : undefined}
        >
          {elements.map(element => renderElement(element))}
          
          {/* Element handles when selected */}
          {selectedElementId && (
            <div 
              className="absolute cursor-move"
              onMouseDown={handleElementMoveStart}
            >
              {/* Resize handles would go here */}
            </div>
          )}
        </div>
      </div>
      
      {/* Tool action bar */}
      <AnimatePresence>
        {activeTool && (
          <motion.div 
            className="p-3 bg-white border-t border-gray-200"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">
                {activeTool === 'text' && 'Add Text'}
                {activeTool === 'image' && 'Add Image'}
                {activeTool === 'shape' && 'Add Shape'}
              </h3>
              
              <div className="flex items-center space-x-2">
                <button
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  onClick={() => addElement(activeTool)}
                >
                  Add to Slide
                </button>
                <button
                  className="px-3 py-1.5 border border-gray-300 text-gray-600 rounded-md text-sm hover:bg-gray-50"
                  onClick={() => setActiveTool(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
            
            {activeTool === 'shape' && (
              <div className="mt-3 flex space-x-3">
                <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                  <Square size={24} />
                </button>
                <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                  <Circle size={24} />
                </button>
                <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                  <Triangle size={24} />
                </button>
              </div>
            )}
            
            {activeTool === 'image' && (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Enter image URL"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <div className="mt-2 text-center text-sm text-gray-500">- or -</div>
                <button className="mt-2 w-full p-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  Upload from device
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SlideEditor;