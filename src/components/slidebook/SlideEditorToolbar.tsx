import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  Play, 
  Save, 
  Share2, 
  Settings, 
  Download, 
  Undo, 
  Redo, 
  Layout, 
  Grid, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Underline, 
  Type, 
  Image, 
  Square, 
  Circle,
  Triangle, 
  Minus, 
  MoreVertical
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface SlideEditorToolbarProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  onPresent: () => void;
  onSave: () => void;
  onShare: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onAddText: () => void;
  onAddImage: () => void;
  onAddShape: (shape: string) => void;
}

const SlideEditorToolbar: React.FC<SlideEditorToolbarProps> = ({
  title,
  onTitleChange,
  onPresent,
  onSave,
  onShare,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onAddText,
  onAddImage,
  onAddShape
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editableTitle, setEditableTitle] = useState(title);
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const shapeButtonRef = useRef<HTMLButtonElement>(null);
  const shapeMenuRef = useRef<HTMLDivElement>(null);
  
  // Handle title editing
  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };
  
  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (editableTitle.trim() !== title) {
      onTitleChange(editableTitle);
    }
  };
  
  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false);
      onTitleChange(editableTitle);
    } else if (e.key === 'Escape') {
      setEditableTitle(title);
      setIsEditingTitle(false);
    }
  };
  
  // Focus input when editing title
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);
  
  // Handle click outside of shape menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showShapeMenu &&
        shapeMenuRef.current &&
        !shapeMenuRef.current.contains(event.target as Node) &&
        shapeButtonRef.current &&
        !shapeButtonRef.current.contains(event.target as Node)
      ) {
        setShowShapeMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShapeMenu]);
  
  return (
    <div className="flex items-center p-2 border-b border-gray-200 bg-white">
      {/* Left section */}
      <div className="flex items-center mr-4">
        <Link to="/dashboard" className="p-1.5 rounded text-gray-600 hover:bg-gray-100 mr-2" title="Back to Dashboard">
          <ChevronLeft size={20} />
        </Link>
        
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            value={editableTitle}
            onChange={(e) => setEditableTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            className="text-lg font-medium px-2 py-1 border-b-2 border-blue-500 focus:outline-none"
            maxLength={50}
          />
        ) : (
          <h1 
            className="text-lg font-medium cursor-pointer hover:text-blue-600 transition-colors"
            onClick={handleTitleClick}
            title="Edit title"
          >
            {title}
          </h1>
        )}
      </div>
      
      {/* Center section - Edit Tools */}
      <div className="flex items-center space-x-1">
        <button
          className="p-1.5 rounded text-gray-600 hover:bg-gray-100"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
        >
          <Undo size={18} className={canUndo ? '' : 'opacity-50'} />
        </button>
        <button
          className="p-1.5 rounded text-gray-600 hover:bg-gray-100"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo"
        >
          <Redo size={18} className={canRedo ? '' : 'opacity-50'} />
        </button>
        
        <div className="h-5 mx-1 border-l border-gray-300"></div>
        
        <button
          className="p-1.5 rounded text-gray-600 hover:bg-gray-100"
          onClick={onAddText}
          title="Add text"
        >
          <Type size={18} />
        </button>
        
        <button
          className="p-1.5 rounded text-gray-600 hover:bg-gray-100"
          onClick={onAddImage}
          title="Add image"
        >
          <Image size={18} />
        </button>
        
        <div className="relative">
          <button
            ref={shapeButtonRef}
            className="p-1.5 rounded text-gray-600 hover:bg-gray-100"
            onClick={() => setShowShapeMenu(!showShapeMenu)}
            title="Add shape"
          >
            <Square size={18} />
          </button>
          
          {showShapeMenu && (
            <div 
              ref={shapeMenuRef}
              className="absolute left-0 mt-1 w-40 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
            >
              <button
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => {
                  onAddShape('rectangle');
                  setShowShapeMenu(false);
                }}
              >
                <Square size={14} className="mr-2" />
                Rectangle
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => {
                  onAddShape('circle');
                  setShowShapeMenu(false);
                }}
              >
                <Circle size={14} className="mr-2" />
                Circle
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => {
                  onAddShape('triangle');
                  setShowShapeMenu(false);
                }}
              >
                <Triangle size={14} className="mr-2" />
                Triangle
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => {
                  onAddShape('line');
                  setShowShapeMenu(false);
                }}
              >
                <Minus size={14} className="mr-2" />
                Line
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Right section - Actions */}
      <div className="ml-auto flex items-center space-x-2">
        <button
          className="p-1.5 rounded text-gray-600 hover:bg-gray-100"
          title="Settings"
        >
          <Settings size={18} />
        </button>
        
        <button
          className="p-1.5 rounded text-gray-600 hover:bg-gray-100"
          onClick={onShare}
          title="Share"
        >
          <Share2 size={18} />
        </button>
        
        <button
          className="px-2.5 py-1.5 rounded text-gray-600 hover:bg-gray-100 flex items-center"
          onClick={onSave}
          title="Save"
        >
          <Save size={16} className="mr-1" />
          Save
        </button>
        
        <button
          className="px-2.5 py-1.5 bg-blue-600 text-white rounded flex items-center hover:bg-blue-700 transition-colors"
          onClick={onPresent}
          title="Present"
        >
          <Play size={16} className="mr-1" />
          Present
        </button>
      </div>
    </div>
  );
};

export default SlideEditorToolbar;