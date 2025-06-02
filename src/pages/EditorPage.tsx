import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SlideEditorToolbar from '../components/slidebook/SlideEditorToolbar';
import SlidesSidebar from '../components/slidebook/SlidesSidebar';
import SlideEditor from '../components/slidebook/SlideEditor';
import ElementProperties from '../components/slidebook/ElementProperties';
import { nanoid } from 'nanoid';

// Define types
interface Slide {
  id: string;
  title?: string;
  thumbnailUrl?: string;
  elements: Element[];
  background?: string;
}

interface Element {
  id: string;
  type: 'text' | 'image' | 'shape' | 'chart';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style?: any;
  shapeType?: string;
  imageUrl?: string;
}

const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';
  
  // Presentation state
  const [title, setTitle] = useState('Untitled Presentation');
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPropertiesPanelCollapsed, setIsPropertiesPanelCollapsed] = useState(false);
  
  // Mock history for undo/redo
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  
  // Initialize with default slide if new presentation
  useEffect(() => {
    if (isNew) {
      // Create a new presentation with one blank slide
      const newSlide: Slide = {
        id: nanoid(),
        elements: [],
        background: '#ffffff'
      };
      setSlides([newSlide]);
    } else {
      // Fetch existing presentation
      // In a real app, this would call an API
      
      // For now, create mock data
      const mockSlides: Slide[] = [
        {
          id: nanoid(),
          title: 'Title Slide',
          thumbnailUrl: 'https://picsum.photos/seed/slide1/400/225',
          elements: [
            {
              id: nanoid(),
              type: 'text',
              x: 200,
              y: 150,
              width: 600,
              height: 120,
              content: 'Presentation Title',
              style: {
                color: '#000000',
                fontSize: 48,
                textAlign: 'center',
                fontWeight: 'bold'
              }
            },
            {
              id: nanoid(),
              type: 'text',
              x: 250,
              y: 300,
              width: 500,
              height: 60,
              content: 'Subtitle or Author Name',
              style: {
                color: '#666666',
                fontSize: 24,
                textAlign: 'center'
              }
            }
          ],
          background: '#ffffff'
        },
        {
          id: nanoid(),
          title: 'Agenda',
          thumbnailUrl: 'https://picsum.photos/seed/slide2/400/225',
          elements: [
            {
              id: nanoid(),
              type: 'text',
              x: 100,
              y: 80,
              width: 500,
              height: 60,
              content: 'Agenda',
              style: {
                color: '#000000',
                fontSize: 36,
                fontWeight: 'bold'
              }
            },
            {
              id: nanoid(),
              type: 'text',
              x: 100,
              y: 180,
              width: 800,
              height: 300,
              content: '1. Introduction\n2. Market Analysis\n3. Product Overview\n4. Sales Strategy\n5. Q&A',
              style: {
                color: '#333333',
                fontSize: 24,
                lineHeight: 1.5
              }
            }
          ],
          background: '#ffffff'
        }
      ];
      
      setTitle('Sample Presentation');
      setSlides(mockSlides);
      setCanUndo(false);
      setCanRedo(false);
    }
  }, [id, isNew]);
  
  // Handle selection of a different slide
  const handleSelectSlide = (index: number) => {
    setCurrentSlideIndex(index);
    setSelectedElementId(null);
  };
  
  // Handle adding a new slide
  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: nanoid(),
      elements: [],
      background: '#ffffff'
    };
    
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
  };
  
  // Handle deleting a slide
  const handleDeleteSlide = (index: number) => {
    if (slides.length <= 1) {
      alert('You cannot delete the last slide in the presentation.');
      return;
    }
    
    const newSlides = [...slides];
    newSlides.splice(index, 1);
    setSlides(newSlides);
    
    // Adjust current slide index if needed
    if (index <= currentSlideIndex) {
      setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
    }
  };
  
  // Handle duplicating a slide
  const handleDuplicateSlide = (index: number) => {
    const slideToClone = slides[index];
    const clone: Slide = {
      ...JSON.parse(JSON.stringify(slideToClone)),
      id: nanoid()
    };
    
    const newSlides = [...slides];
    newSlides.splice(index + 1, 0, clone);
    setSlides(newSlides);
    setCurrentSlideIndex(index + 1);
  };
  
  // Handle updating elements in a slide
  const handleUpdateElements = (elements: Element[]) => {
    const newSlides = [...slides];
    newSlides[currentSlideIndex] = {
      ...newSlides[currentSlideIndex],
      elements
    };
    setSlides(newSlides);
    setCanUndo(true);
  };
  
  // Get the currently selected element
  const getSelectedElementType = () => {
    if (!selectedElementId || !slides[currentSlideIndex]) return undefined;
    
    const element = slides[currentSlideIndex].elements.find(el => el.id === selectedElementId);
    return element?.type;
  };
  
  // Update style of selected element
  const handleStyleChange = (styleUpdates: Partial<Element['style']>) => {
    if (!selectedElementId) return;
    
    const newSlides = [...slides];
    const elements = newSlides[currentSlideIndex].elements.map(el => {
      if (el.id === selectedElementId) {
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
    
    newSlides[currentSlideIndex].elements = elements;
    setSlides(newSlides);
    setCanUndo(true);
  };
  
  // Presentation actions
  const handlePresent = () => {
    alert('Present mode would open a fullscreen presentation viewer');
  };
  
  const handleSave = () => {
    // In a real app, this would save to the database
    alert('Presentation saved successfully!');
  };
  
  const handleShare = () => {
    alert('Share dialog would open here');
  };
  
  // Element addition shortcuts
  const handleAddText = () => {
    const newElement: Element = {
      id: nanoid(),
      type: 'text',
      x: 100,
      y: 100,
      width: 400,
      height: 100,
      content: 'Click to edit this text',
      style: {
        color: '#000000',
        fontSize: 24,
        textAlign: 'left'
      }
    };
    
    const newSlides = [...slides];
    newSlides[currentSlideIndex].elements.push(newElement);
    setSlides(newSlides);
    setSelectedElementId(newElement.id);
    setCanUndo(true);
  };
  
  const handleAddImage = () => {
    const newElement: Element = {
      id: nanoid(),
      type: 'image',
      x: 100,
      y: 100,
      width: 400,
      height: 300,
      imageUrl: 'https://picsum.photos/seed/image1/800/600',
      style: {
        opacity: 1
      }
    };
    
    const newSlides = [...slides];
    newSlides[currentSlideIndex].elements.push(newElement);
    setSlides(newSlides);
    setSelectedElementId(newElement.id);
    setCanUndo(true);
  };
  
  const handleAddShape = (shapeType: string) => {
    const newElement: Element = {
      id: nanoid(),
      type: 'shape',
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      shapeType: shapeType,
      style: {
        backgroundColor: '#2563EB',
        opacity: 0.8,
        borderRadius: shapeType === 'rectangle' ? 0 : undefined
      }
    };
    
    const newSlides = [...slides];
    newSlides[currentSlideIndex].elements.push(newElement);
    setSlides(newSlides);
    setSelectedElementId(newElement.id);
    setCanUndo(true);
  };
  
  // Mock undo/redo
  const handleUndo = () => {
    alert('Undo would be implemented here');
    setCanUndo(false);
    setCanRedo(true);
  };
  
  const handleRedo = () => {
    alert('Redo would be implemented here');
    setCanRedo(false);
  };
  
  // Get the current slide
  const currentSlide = slides[currentSlideIndex];
  const elementType = getSelectedElementType();
  const selectedElement = currentSlide?.elements.find(el => el.id === selectedElementId);
  
  if (!currentSlide) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }
  
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Toolbar */}
      <SlideEditorToolbar
        title={title}
        onTitleChange={setTitle}
        onPresent={handlePresent}
        onSave={handleSave}
        onShare={handleShare}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        onAddText={handleAddText}
        onAddImage={handleAddImage}
        onAddShape={handleAddShape}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Slide thumbnails */}
        <SlidesSidebar
          slides={slides}
          currentSlideIndex={currentSlideIndex}
          onSelectSlide={handleSelectSlide}
          onAddSlide={handleAddSlide}
          onDeleteSlide={handleDeleteSlide}
          onDuplicateSlide={handleDuplicateSlide}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        
        {/* Main editor */}
        <div className="flex-1 overflow-hidden">
          <SlideEditor
            slideId={currentSlide.id}
            elements={currentSlide.elements}
            onUpdateElements={handleUpdateElements}
            background={currentSlide.background}
          />
        </div>
        
        {/* Right sidebar - Element properties */}
        {!isPropertiesPanelCollapsed && (
          <div className="w-64 border-l border-gray-200 bg-white flex-shrink-0">
            <div className="p-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">Properties</h3>
            </div>
            
            <ElementProperties
              elementType={elementType}
              style={selectedElement?.style}
              onStyleChange={(styleUpdates) => handleStyleChange(styleUpdates)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorPage;