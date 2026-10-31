import React, { useState, useRef, useEffect } from 'react';
import { usePortfolioContent } from '../context/ContentContext';
import type { SelectedElement } from '../types/content';
import { Edit3, Check, X, AlertTriangle } from 'lucide-react';

interface EditableElementProps {
  id: string;
  section: string;
  type: 'text' | 'image' | 'button' | 'card' | 'section';
  label: string;
  propertyPath: string;
  currentValue?: any;
  options?: SelectedElement['options'];
  children: React.ReactNode;
  className?: string;
  inlineEdit?: boolean;
}

export const EditableElement: React.FC<EditableElementProps> = ({
  id,
  section,
  type,
  label,
  propertyPath,
  currentValue,
  options,
  children,
  className = '',
  inlineEdit = true,
}) => {
  const {
    mode,
    previewMode,
    selectedElement,
    setSelectedElement,
    updateField,
  } = usePortfolioContent();

  const [isHovered, setIsHovered] = useState(false);
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [tempText, setTempText] = useState(String(currentValue || ''));
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTempText(String(currentValue || ''));
  }, [currentValue]);

  useEffect(() => {
    if (isInlineEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isInlineEditing]);

  // If in published mode or pure preview mode, render child with data-editable-id for color styles
  if (mode === 'published' || previewMode) {
    return (
      <div data-editable-id={id} className={`contents ${className}`}>
        {children}
      </div>
    );
  }

  const isSelected = selectedElement?.id === id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElement({
      id,
      section,
      type,
      label,
      propertyPath,
      currentValue,
      options,
    });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (type === 'text' && inlineEdit) {
      e.stopPropagation();
      setIsInlineEditing(true);
    }
  };

  const saveInlineEdit = () => {
    updateField(propertyPath, tempText);
    setIsInlineEditing(false);
  };

  const cancelInlineEdit = () => {
    setTempText(String(currentValue || ''));
    setIsInlineEditing(false);
  };

  // Text overflow check
  const isOverflowWarning = type === 'text' && typeof currentValue === 'string' && currentValue.length > 220;

  return (
    <div
      data-editable-id={id}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group/editable transition-all duration-200 cursor-pointer ${className} ${
        isSelected
          ? 'ring-2 ring-[#FF5A1F] ring-offset-2 ring-offset-black z-30 shadow-[0_0_15px_rgba(255,90,31,0.35)]'
          : isHovered
          ? 'ring-1 ring-[#FF5A1F]/70 ring-offset-1 ring-offset-black/50 z-20'
          : ''
      }`}
      title={`Click to edit ${label} in properties panel`}
    >
      {/* Floating Tag Badge */}
      {(isHovered || isSelected) && (
        <div className="absolute -top-6 left-0 flex items-center gap-1.5 px-2 py-0.5 rounded-t-md bg-[#FF5A1F] text-white text-[10px] font-mono font-bold tracking-wider uppercase shadow-md pointer-events-none z-40">
          <span>{label}</span>
          {isOverflowWarning && (
            <span className="flex items-center gap-0.5 text-amber-200" title="Text is quite long for this area">
              <AlertTriangle className="w-2.5 h-2.5" />
            </span>
          )}
        </div>
      )}

      {/* Inline Text Editor Overlay */}
      {isInlineEditing ? (
        <div
          className="relative z-50 p-2 rounded-xl bg-[#181818] border border-[#FF5A1F] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <textarea
            ref={inputRef}
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                saveInlineEdit();
              } else if (e.key === 'Escape') {
                cancelInlineEdit();
              }
            }}
            rows={Math.max(2, tempText.split('\n').length)}
            className="w-full p-2 text-sm bg-black/60 text-white border border-white/10 rounded-lg focus:outline-none focus:border-[#FF5A1F] resize-y font-sans leading-relaxed"
          />
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
            <span className="text-[10px] text-white/40 font-mono">
              Press Enter to save, Shift+Enter for new line
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={cancelInlineEdit}
                className="p-1 rounded bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={saveInlineEdit}
                className="px-2.5 py-1 rounded bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Save"
              >
                <Check className="w-3 h-3" />
                <span>Done</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {children}
          {/* Subtle click-to-edit indicator icon on hover */}
          {isHovered && !isSelected && (
            <div className="absolute top-2 right-2 p-1 rounded-full bg-black/80 text-[#FF5A1F] opacity-80 pointer-events-none shadow-sm">
              <Edit3 className="w-3 h-3" />
            </div>
          )}
        </>
      )}
    </div>
  );
};
