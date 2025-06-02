import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Sliders, PaintBucket, Box, Maximize, CornerDownRight, Rotate3d } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

interface ElementStyle {
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
}

interface ElementPropertiesProps {
  elementType?: 'text' | 'image' | 'shape';
  style?: ElementStyle;
  onStyleChange: (newStyle: Partial<ElementStyle>) => void;
}

const ElementProperties: React.FC<ElementPropertiesProps> = ({
  elementType,
  style = {},
  onStyleChange
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    appearance: true,
    dimensions: false,
    transform: false
  });
  
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  if (!elementType) {
    return (
      <div className="p-4 text-center text-gray-500">
        Select an element to edit its properties
      </div>
    );
  }
  
  return (
    <div className="overflow-y-auto">
      {/* Appearance Section */}
      <div className="border-b border-gray-200">
        <button
          className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection('appearance')}
        >
          <div className="flex items-center text-gray-700">
            <PaintBucket size={16} className="mr-2" />
            <span className="text-sm font-medium">Appearance</span>
          </div>
          {expandedSections.appearance ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>
        
        {expandedSections.appearance && (
          <div className="p-3 space-y-3">
            {/* Text properties */}
            {elementType === 'text' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Text Color
                  </label>
                  <div className="relative">
                    <button
                      className="w-full flex items-center justify-between border border-gray-300 rounded p-2 text-sm"
                      onClick={() => setShowColorPicker(showColorPicker === 'textColor' ? null : 'textColor')}
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-sm mr-2" 
                          style={{ backgroundColor: style.color || '#000000' }}
                        ></div>
                        {style.color || '#000000'}
                      </div>
                      <ChevronDown size={14} />
                    </button>
                    
                    {showColorPicker === 'textColor' && (
                      <div className="absolute z-10 mt-1 w-full">
                        <HexColorPicker 
                          color={style.color || '#000000'} 
                          onChange={(color) => {
                            onStyleChange({ color });
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            
            {/* Shape and image properties */}
            {(elementType === 'shape' || elementType === 'image') && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Opacity
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={Math.round((style.opacity || 1) * 100)}
                    onChange={(e) => onStyleChange({ opacity: parseInt(e.target.value) / 100 })}
                    className="w-full"
                  />
                  <span className="ml-2 text-xs w-8 text-center">{Math.round((style.opacity || 1) * 100)}%</span>
                </div>
              </div>
            )}
            
            {/* Background color for shapes */}
            {elementType === 'shape' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Fill Color
                </label>
                <div className="relative">
                  <button
                    className="w-full flex items-center justify-between border border-gray-300 rounded p-2 text-sm"
                    onClick={() => setShowColorPicker(showColorPicker === 'backgroundColor' ? null : 'backgroundColor')}
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-sm mr-2" 
                        style={{ backgroundColor: style.backgroundColor || '#2563EB' }}
                      ></div>
                      {style.backgroundColor || '#2563EB'}
                    </div>
                    <ChevronDown size={14} />
                  </button>
                  
                  {showColorPicker === 'backgroundColor' && (
                    <div className="absolute z-10 mt-1 w-full">
                      <HexColorPicker 
                        color={style.backgroundColor || '#2563EB'} 
                        onChange={(color) => {
                          onStyleChange({ backgroundColor: color });
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Border radius for shapes */}
            {elementType === 'shape' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Corner Radius
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={style.borderRadius || 0}
                    onChange={(e) => onStyleChange({ borderRadius: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <span className="ml-2 text-xs w-8 text-center">{style.borderRadius || 0}px</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Dimensions Section */}
      <div className="border-b border-gray-200">
        <button
          className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection('dimensions')}
        >
          <div className="flex items-center text-gray-700">
            <Maximize size={16} className="mr-2" />
            <span className="text-sm font-medium">Dimensions</span>
          </div>
          {expandedSections.dimensions ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>
        
        {expandedSections.dimensions && (
          <div className="p-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Width (px)
                </label>
                <input
                  type="number"
                  value={200} // This would come from the element
                  onChange={(e) => {/* Update width */}}
                  className="w-full p-1.5 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Height (px)
                </label>
                <input
                  type="number"
                  value={100} // This would come from the element
                  onChange={(e) => {/* Update height */}}
                  className="w-full p-1.5 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  X Position (px)
                </label>
                <input
                  type="number"
                  value={100} // This would come from the element
                  onChange={(e) => {/* Update x position */}}
                  className="w-full p-1.5 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Y Position (px)
                </label>
                <input
                  type="number"
                  value={100} // This would come from the element
                  onChange={(e) => {/* Update y position */}}
                  className="w-full p-1.5 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Transform Section */}
      <div className="border-b border-gray-200">
        <button
          className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection('transform')}
        >
          <div className="flex items-center text-gray-700">
            <Rotate3d size={16} className="mr-2" />
            <span className="text-sm font-medium">Transform</span>
          </div>
          {expandedSections.transform ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>
        
        {expandedSections.transform && (
          <div className="p-3 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Rotation (degrees)
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={style.rotation || 0}
                  onChange={(e) => onStyleChange({ rotation: parseInt(e.target.value) })}
                  className="w-full"
                />
                <span className="ml-2 text-xs w-8 text-center">{style.rotation || 0}°</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElementProperties;