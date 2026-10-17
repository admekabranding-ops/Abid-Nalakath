import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { VisualLayoutState, VisualElement, ViewportMode, ElementStyles } from './editorTypes';
import { Sparkles, ArrowUpRight, TrendingUp, Mail, Compass, Palette } from 'lucide-react';
import { InstagramIcon, LinkedinIcon, DribbbleIcon } from '../../../components/SocialIcons';
import { apiRequest } from '../../../api/client';

interface EditorCanvasProps {
  layout: VisualLayoutState;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElementStyles: (id: string, styles: Partial<ElementStyles>) => void;
  onUpdateElementContent: (id: string, content: Record<string, any>) => void;
  viewport: ViewportMode;
  zoom: number;
  previewMode: boolean;
  showGrid: boolean;
  onDeleteElement: (id: string) => void;
  onAddElement?: (element: VisualElement, targetSectionId: string) => void;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  layout,
  selectedElementId,
  onSelectElement,
  onUpdateElementStyles,
  onUpdateElementContent,
  viewport,
  zoom,
  previewMode,
  showGrid,
  onDeleteElement,
  onAddElement,
}) => {
  const artboardRef = useRef<HTMLDivElement>(null);
  const [selectedRect, setSelectedRect] = useState<DOMRect | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ mouseX: number; mouseY: number; initialX: number; initialY: number } | null>(null);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState<{ mouseX: number; mouseY: number; initialW: number; initialH: number } | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  // Drag-and-drop states for assets & files
  const [dragTargetSection, setDragTargetSection] = useState<string | null>(null);
  const [dragTargetElementId, setDragTargetElementId] = useState<string | null>(null);

  // Measure bounding rect of currently selected element relative to artboard
  const updateBoundingRect = useCallback(() => {
    if (!selectedElementId || previewMode || !artboardRef.current) {
      setSelectedRect(null);
      return;
    }

    const domEl = artboardRef.current.querySelector(`[data-element-id="${selectedElementId}"]`);
    if (domEl) {
      const artboardRect = artboardRef.current.getBoundingClientRect();
      const elRect = domEl.getBoundingClientRect();

      // Adjust for zoom scale factor
      const scale = zoom / 100;
      const left = (elRect.left - artboardRect.left) / scale;
      const top = (elRect.top - artboardRect.top) / scale;
      const width = elRect.width / scale;
      const height = elRect.height / scale;

      setSelectedRect(new DOMRect(left, top, width, height));
    } else {
      setSelectedRect(null);
    }
  }, [selectedElementId, previewMode, zoom, layout]);

  useEffect(() => {
    updateBoundingRect();
    window.addEventListener('resize', updateBoundingRect);
    return () => window.removeEventListener('resize', updateBoundingRect);
  }, [updateBoundingRect]);

  // Keyboard navigation: Arrows (1px / 10px shift), Delete, Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedElementId || editingTextId) return;

      const element = layout.elements[selectedElementId];
      if (!element || element.locked) return;

      const step = e.shiftKey ? 10 : 1;
      const currentX = element.styles.x || 0;
      const currentY = element.styles.y || 0;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onUpdateElementStyles(selectedElementId, { x: currentX - step });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onUpdateElementStyles(selectedElementId, { x: currentX + step });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        onUpdateElementStyles(selectedElementId, { y: currentY - step });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        onUpdateElementStyles(selectedElementId, { y: currentY + step });
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          onDeleteElement(selectedElementId);
        }
      } else if (e.key === 'Escape') {
        onSelectElement(null);
        setEditingTextId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, editingTextId, layout, onUpdateElementStyles, onDeleteElement, onSelectElement]);

  // Drag-to-reposition handler
  const handleDragMouseDown = (e: React.MouseEvent) => {
    if (!selectedElementId) return;
    const element = layout.elements[selectedElementId];
    if (!element || element.locked) return;

    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialX: element.styles.x || 0,
      initialY: element.styles.y || 0,
    });
  };

  // Resize handle mousedown
  const handleResizeMouseDown = (handle: string, e: React.MouseEvent) => {
    if (!selectedElementId) return;
    const element = layout.elements[selectedElementId];
    if (!element || element.locked || !selectedRect) return;

    e.stopPropagation();
    setActiveHandle(handle);
    setResizeStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialW: selectedRect.width,
      initialH: selectedRect.height,
    });
  };

  // Global mousemove & mouseup for drag and resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const scale = zoom / 100;

      if (isDragging && dragStart && selectedElementId) {
        const deltaX = (e.clientX - dragStart.mouseX) / scale;
        const deltaY = (e.clientY - dragStart.mouseY) / scale;
        onUpdateElementStyles(selectedElementId, {
          x: Math.round(dragStart.initialX + deltaX),
          y: Math.round(dragStart.initialY + deltaY),
        });
      }

      if (activeHandle && resizeStart && selectedElementId) {
        const deltaX = (e.clientX - resizeStart.mouseX) / scale;
        const deltaY = (e.clientY - resizeStart.mouseY) / scale;

        let newW = resizeStart.initialW;
        let newH = resizeStart.initialH;

        if (activeHandle.includes('e')) newW = Math.max(20, resizeStart.initialW + deltaX);
        if (activeHandle.includes('w')) newW = Math.max(20, resizeStart.initialW - deltaX);
        if (activeHandle.includes('s')) newH = Math.max(20, resizeStart.initialH + deltaY);
        if (activeHandle.includes('n')) newH = Math.max(20, resizeStart.initialH - deltaY);

        onUpdateElementStyles(selectedElementId, {
          width: `${Math.round(newW)}px`,
          height: `${Math.round(newH)}px`,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragStart(null);
      setActiveHandle(null);
      setResizeStart(null);
    };

    if (isDragging || activeHandle) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, activeHandle, resizeStart, selectedElementId, zoom, onUpdateElementStyles]);

  // Click on background deselects
  const handleArtboardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).getAttribute('data-element-id')) return;
    onSelectElement(null);
    setEditingTextId(null);
  };

  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile':
        return '390px';
      case 'tablet':
        return '768px';
      case 'desktop':
      default:
        return '1440px';
    }
  };

  const el = (id: string): VisualElement => {
    return layout.elements[id] || { id, name: id, section: 'hero', type: 'text', styles: {} };
  };

  const getCustomStyle = (id: string): React.CSSProperties => {
    const item = layout.elements[id];
    if (!item || !item.styles) return {};
    const s = item.styles;

    const res: React.CSSProperties = {};
    if (s.x !== undefined || s.y !== undefined) {
      res.transform = `translate(${s.x || 0}px, ${s.y || 0}px)`;
    }
    if (s.fontSize) res.fontSize = s.fontSize;
    if (s.fontWeight) res.fontWeight = s.fontWeight;
    if (s.fontFamily) res.fontFamily = s.fontFamily;
    if (s.lineHeight) res.lineHeight = s.lineHeight;
    if (s.letterSpacing) res.letterSpacing = s.letterSpacing;
    if (s.color) res.color = s.color;
    if (s.textAlign) res.textAlign = s.textAlign;
    if (s.textTransform) res.textTransform = s.textTransform;
    if (s.width) res.width = s.width;
    if (s.maxWidth) res.maxWidth = s.maxWidth;
    if (s.height) res.height = s.height;
    if (s.minHeight) res.minHeight = s.minHeight;
    if (s.backgroundColor) res.backgroundColor = s.backgroundColor;
    if (s.backgroundGradient) res.background = s.backgroundGradient;
    if (s.backgroundImage) res.backgroundImage = s.backgroundImage;
    if (s.borderRadius) res.borderRadius = s.borderRadius;
    if (s.borderWidth) res.borderWidth = s.borderWidth;
    if (s.borderColor) res.borderColor = s.borderColor;
    if (s.borderStyle) res.borderStyle = s.borderStyle;
    if (s.boxShadow) res.boxShadow = s.boxShadow;
    if (s.opacity !== undefined) res.opacity = s.opacity;
    if (s.paddingTop) res.paddingTop = s.paddingTop;
    if (s.paddingBottom) res.paddingBottom = s.paddingBottom;
    if (s.paddingLeft) res.paddingLeft = s.paddingLeft;
    if (s.paddingRight) res.paddingRight = s.paddingRight;
    if (s.marginTop) res.marginTop = s.marginTop;
    if (s.marginBottom) res.marginBottom = s.marginBottom;
    if (s.filter) res.filter = s.filter;
    if (s.objectFit) res.objectFit = s.objectFit;
    if (s.display) res.display = s.display;

    return res;
  };

  // Helper to attach click to select
  const bindEl = (id: string) => {
    const isHidden = layout.elements[id]?.hidden;
    if (isHidden) return { style: { display: 'none' } };

    return {
      'data-element-id': id,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelectElement(id);
      },
      onDoubleClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelectElement(id);
        const item = layout.elements[id];
        if (item && (item.type === 'text' || item.type === 'heading' || item.type === 'button')) {
          setEditingTextId(id);
        }
      },
      style: getCustomStyle(id),
    };
  };

  // ================= DRAG & DROP HANDLING FOR ASSETS (LOGOS & PHOTOS) =================

  // 1. Hovering directly over an existing element (e.g. replace portrait, logo, avatar)
  const handleElementDragOver = (e: React.DragEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    if (dragTargetElementId !== elementId) {
      setDragTargetElementId(elementId);
    }
  };

  const handleElementDragLeave = (e: React.DragEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragTargetElementId === elementId) {
      setDragTargetElementId(null);
    }
  };

  const handleElementDrop = async (e: React.DragEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragTargetElementId(null);
    setDragTargetSection(null);

    // Direct desktop file drop onto element
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const formData = new FormData();
        formData.append('file', file);
        try {
          const res = await apiRequest<{ success: boolean; url: string }>('/admin/media/upload', {
            method: 'POST',
            body: formData,
          });
          if (res.url) {
            onUpdateElementContent(elementId, { imageSrc: res.url });
            onSelectElement(elementId);
          }
        } catch (err) {
          console.error('Failed to upload dropped file:', err);
        }
        return;
      }
    }

    // Asset payload from AssetsPanel
    try {
      const jsonStr = e.dataTransfer.getData('application/json');
      if (jsonStr) {
        const data = JSON.parse(jsonStr);
        if (data.url) {
          onUpdateElementContent(elementId, { imageSrc: data.url });
          onSelectElement(elementId);
          return;
        }
      }
    } catch {}

    const textUrl = e.dataTransfer.getData('text/plain');
    if (textUrl && (textUrl.startsWith('/') || textUrl.startsWith('http') || textUrl.startsWith('data:'))) {
      onUpdateElementContent(elementId, { imageSrc: textUrl });
      onSelectElement(elementId);
    }
  };

  // 2. Hovering and dropping into a Section (Adds a new Logo or Photo element)
  const handleSectionDragOver = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (dragTargetSection !== sectionId) {
      setDragTargetSection(sectionId);
    }
  };

  const handleSectionDragLeave = (e: React.DragEvent, sectionId: string) => {
    const related = e.relatedTarget as HTMLElement;
    if (!related || !related.closest || !related.closest(`#section-${sectionId}`)) {
      if (dragTargetSection === sectionId) {
        setDragTargetSection(null);
      }
    }
  };

  const handleSectionDrop = async (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragTargetSection(null);
    setDragTargetElementId(null);

    let assetUrl = '';
    let assetName = '';

    // Direct desktop file drop onto section
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const formData = new FormData();
        formData.append('file', file);
        try {
          const res = await apiRequest<{ success: boolean; url: string }>('/admin/media/upload', {
            method: 'POST',
            body: formData,
          });
          if (res.url) {
            assetUrl = res.url;
            assetName = file.name.replace(/\.[^/.]+$/, '');
          }
        } catch (err) {
          console.error('Failed to upload dropped file:', err);
          return;
        }
      }
    }

    if (!assetUrl) {
      try {
        const jsonStr = e.dataTransfer.getData('application/json');
        if (jsonStr) {
          const data = JSON.parse(jsonStr);
          assetUrl = data.url;
          assetName = data.name;
        }
      } catch {}
    }

    if (!assetUrl) {
      assetUrl = e.dataTransfer.getData('text/plain');
    }

    if (!assetUrl) return;

    const isLogo = (assetName || '').toLowerCase().includes('logo') || assetUrl.endsWith('.svg');
    const newElemId = `custom_asset_${Date.now()}`;
    const newElem: VisualElement = {
      id: newElemId,
      name: assetName || (isLogo ? 'Custom Logo' : 'Photo Element'),
      section: sectionId,
      type: 'image',
      content: {
        imageSrc: assetUrl,
        altText: assetName || 'Custom Graphic',
      },
      styles: {
        width: isLogo ? '160px' : '360px',
        height: 'auto',
        maxWidth: '100%',
        borderRadius: isLogo ? '8px' : '18px',
        boxShadow: isLogo ? 'none' : '0 12px 35px rgba(0,0,0,0.4)',
        display: 'inline-block',
        x: 0,
        y: 0,
      },
    };

    if (onAddElement) {
      onAddElement(newElem, sectionId);
      onSelectElement(newElemId);
    }
  };

  // Helper to render all custom elements for a section
  const renderSectionCustomElements = (sectionId: string) => {
    const customElements = Object.values(layout.elements).filter(
      (item) => item.section === sectionId && item.id.startsWith('custom_')
    );

    if (customElements.length === 0) return null;

    return (
      <div className="relative z-30 my-6 flex flex-wrap gap-6 items-center justify-center pointer-events-auto">
        {customElements.map((item) => {
          if (item.hidden) return null;
          return (
            <div
              key={item.id}
              {...bindEl(item.id)}
              onDragOver={(e) => handleElementDragOver(e, item.id)}
              onDragLeave={(e) => handleElementDragLeave(e, item.id)}
              onDrop={(e) => handleElementDrop(e, item.id)}
              className="relative cursor-pointer transition-all hover:outline hover:outline-2 hover:outline-[#F4510B]/60 rounded-xl"
            >
              {dragTargetElementId === item.id && (
                <div className="absolute inset-0 pointer-events-none border-2 border-[#00f2fe] bg-[#00f2fe]/20 rounded-xl z-50 flex items-center justify-center">
                  <span className="text-[10px] bg-black/90 px-2 py-0.5 rounded text-white font-bold border border-[#00f2fe]">
                    Drop to Replace
                  </span>
                </div>
              )}
              {item.type === 'image' && (
                <img
                  src={item.content?.imageSrc || '/assets/abid-hero.png'}
                  alt={item.content?.altText || item.name}
                  style={{
                    width: item.styles?.width || 'auto',
                    height: item.styles?.height || 'auto',
                    maxWidth: item.styles?.maxWidth || '100%',
                    maxHeight: item.styles?.maxHeight || '450px',
                    objectFit: (item.styles?.objectFit as any) || 'contain',
                    borderRadius: item.styles?.borderRadius || '16px',
                    border: item.styles?.borderWidth ? `${item.styles.borderWidth} solid ${item.styles.borderColor || 'rgba(255,255,255,0.1)'}` : undefined,
                    boxShadow: item.styles?.boxShadow || '0 10px 30px rgba(0,0,0,0.3)',
                  }}
                  className="select-none pointer-events-none block"
                />
              )}
              {item.type === 'heading' && (
                <h3 className="font-display font-bold text-white text-2xl">
                  {item.content?.text || item.name}
                </h3>
              )}
              {item.type === 'text' && (
                <p className="text-sm text-neutral-300">
                  {item.content?.text || item.name}
                </p>
              )}
              {item.type === 'button' && (
                <button className="px-5 py-2.5 rounded-full bg-[#F4510B] text-white font-semibold text-xs shadow-lg">
                  {item.content?.text || item.name}
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderSectionDropIndicator = (sectionId: string, label: string) => {
    if (dragTargetSection !== sectionId) return null;
    return (
      <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-[#FF9D00] bg-[#F4510B]/10 rounded-[32px] z-40 flex items-center justify-center backdrop-blur-[2px] transition-all">
        <div className="bg-[#140a07] border border-[#FF9D00] px-5 py-2.5 rounded-full text-white text-xs font-bold shadow-2xl flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF9D00] animate-spin" />
          <span>✨ Drop to add Photo or Logo to {label}</span>
        </div>
      </div>
    );
  };

  const selectedElement = selectedElementId ? layout.elements[selectedElementId] : null;

  return (
    <div
      onClick={handleArtboardClick}
      className={`flex-1 h-full overflow-auto flex flex-col items-center justify-start p-8 relative transition-colors ${
        showGrid ? 'bg-[#0b0503] canvas-grid-pattern' : 'bg-[#0e0705]'
      }`}
    >
      {/* Zoomable Scaled Artboard Wrapper */}
      <div
        ref={artboardRef}
        style={{
          width: getViewportWidth(),
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
          transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="bg-[#0e0705] text-neutral-100 font-sans shadow-[0_25px_80px_rgba(0,0,0,0.8)] border border-white/10 rounded-[32px] relative flex-shrink-0 select-none pb-24 overflow-hidden"
      >
        {/* ================= HERO SECTION (ARTBOARD) ================= */}
        <div
          id="section-hero"
          onDragOver={(e) => handleSectionDragOver(e, 'hero')}
          onDragLeave={(e) => handleSectionDragLeave(e, 'hero')}
          onDrop={(e) => handleSectionDrop(e, 'hero')}
          className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto relative"
        >
          {renderSectionDropIndicator('hero', 'Hero Section')}

          {/* Outer Rounded Container with Signature Warm Orange Border */}
          <div
            {...bindEl('hero.artboard')}
            className="relative rounded-[36px] border border-[#F4510B]/40 overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.6)] bg-[#0e0705]"
          >
            {/* Desktop Merged Grid */}
            <div className="grid grid-cols-12 min-h-[660px] relative">
              {/* LEFT SIDE: ORANGE CANVAS (cols 1-7) */}
              <div
                {...bindEl('hero.orange_canvas')}
                className="col-span-12 lg:col-span-7 relative p-8 sm:p-10 xl:p-12 flex flex-col justify-between overflow-hidden z-10 hero-orange-gradient rounded-tl-[36px] rounded-bl-[36px]"
              >
                {/* Background Concentric Geometry */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                  <svg viewBox="0 0 800 800" className="w-full h-full text-white/40" fill="none">
                    <circle cx="560" cy="380" r="260" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="560" cy="380" r="380" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
                    <path d="M 280 120 C 420 200, 500 480, 720 540" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                  </svg>
                </div>

                {/* Top Area: Logo + Outlined Badge */}
                <div className="relative z-10">
                  {/* Monogram / Image Logo (Drag to Replace or Click to Select) */}
                  <div
                    {...bindEl('hero.logo')}
                    onDragOver={(e) => handleElementDragOver(e, 'hero.logo')}
                    onDragLeave={(e) => handleElementDragLeave(e, 'hero.logo')}
                    onDrop={(e) => handleElementDrop(e, 'hero.logo')}
                    className="mb-5 inline-block relative cursor-pointer"
                    title="Click to select or drag logo here to replace"
                  >
                    {dragTargetElementId === 'hero.logo' && (
                      <div className="absolute inset-0 border-2 border-[#00f2fe] bg-[#00f2fe]/20 rounded z-50 flex items-center justify-center">
                        <span className="text-[9px] bg-black/90 px-1.5 py-0.5 rounded text-white font-bold border border-[#00f2fe]">
                          Drop to Replace Logo
                        </span>
                      </div>
                    )}
                    {el('hero.logo').content?.imageSrc ? (
                      <img
                        src={el('hero.logo').content?.imageSrc}
                        alt="Logo"
                        className="h-10 w-auto object-contain select-none pointer-events-none"
                      />
                    ) : (
                      <div className="w-9 h-9 text-white flex items-center justify-center">
                        <svg viewBox="0 0 52 40" fill="none" className="w-full h-full text-white">
                          <path d="M14 8C23 13 23 27 14 32C28 32 28 8 14 8Z" fill="currentColor" />
                          <path d="M38 8C29 13 29 27 38 32C24 32 24 8 38 8Z" fill="currentColor" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Outlined Pill Badge */}
                  <div>
                    <div
                      {...bindEl('hero.badge')}
                      className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm text-white/95 text-xs font-medium tracking-wide mb-6 cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF9D00] animate-pulse" />
                      <span>{el('hero.badge').content?.badgeText || 'Abid Nalakath • Creative Designer'}</span>
                    </div>
                  </div>

                  {/* Main Headline */}
                  <div>
                    <h1
                      {...bindEl('hero.heading')}
                      className="font-display text-[42px] xl:text-[52px] font-light text-white tracking-tight leading-[1.08] max-w-lg mb-7 whitespace-pre-line cursor-pointer"
                    >
                      {el('hero.heading').content?.text || 'Creative\nDesigns\nThat Make\nBrands Stand Out.'}
                    </h1>
                  </div>

                  {/* CTA Button */}
                  <div>
                    <button
                      {...bindEl('hero.cta')}
                      className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-white text-[#151515] font-semibold text-sm glow-pill-btn cursor-pointer"
                    >
                      <span>{el('hero.cta').content?.text || 'View My Work'}</span>
                      <ArrowUpRight className="w-4 h-4 text-[#F4510B]" />
                    </button>
                  </div>
                </div>

                {/* Bottom-Left Statistics Cards */}
                <div className="relative z-10 flex items-center gap-3 pt-8">
                  <div
                    {...bindEl('hero.stat_card_1')}
                    className="bg-white rounded-2xl p-4 shadow-lg border border-black/5 min-w-[130px]"
                  >
                    <div className="flex items-center justify-between gap-3 mb-0.5">
                      <span className="text-[11px] font-medium text-gray-500">
                        {el('hero.stat_card_1').content?.statLabel || 'Projects Built'}
                      </span>
                      <TrendingUp className="w-3.5 h-3.5 text-[#F4510B]" />
                    </div>
                    <div className="text-2xl font-display font-bold text-[#151515]">
                      {el('hero.stat_card_1').content?.statValue || '100+'}
                    </div>
                  </div>

                  <div
                    {...bindEl('hero.stat_card_2')}
                    className="bg-white rounded-2xl p-4 shadow-lg border border-black/5 min-w-[130px]"
                  >
                    <div className="flex items-center justify-between gap-3 mb-0.5">
                      <span className="text-[11px] font-medium text-gray-500">
                        {el('hero.stat_card_2').content?.statLabel || 'Client Support'}
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-[#F4510B]" />
                    </div>
                    <div className="text-2xl font-display font-bold text-[#151515]">
                      {el('hero.stat_card_2').content?.statValue || '24/7'}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: WHITE MERGED PANEL (cols 8-12) */}
              <div
                {...bindEl('hero.white_panel')}
                className="col-span-12 lg:col-span-5 bg-[#FFFFFF] relative p-8 xl:p-12 flex flex-col justify-between rounded-tl-[36px] xl:rounded-tl-[44px] rounded-bl-none z-10"
              >
                <div>
                  {/* Status Badge */}
                  <div {...bindEl('hero.available_pill')} className="mb-6 inline-block">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-[11px] font-medium text-gray-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{el('hero.available_pill').content?.text || 'Available for Projects'}</span>
                    </div>
                  </div>

                  {/* Intro text */}
                  <div>
                    <h2
                      {...bindEl('hero.intro_statement')}
                      className="text-xl xl:text-2xl font-normal text-[#151515] leading-[1.32] tracking-tight whitespace-pre-line mb-4"
                    >
                      {el('hero.intro_statement').content?.text || "Hi, I’m Abid.\nI build modern, bold visuals for brands, businesses & creators."}
                    </h2>

                    <div
                      {...bindEl('hero.intro_lines')}
                      className="pt-2 space-y-1 text-xs xl:text-sm text-[#686868] whitespace-pre-line"
                    >
                      {el('hero.intro_lines').content?.text || "Clean design.\nSmooth animations.\nDistinctive branding."}
                    </div>
                  </div>
                </div>

                {/* Floating Quote Card (Drag avatar here to replace) */}
                <div
                  {...bindEl('hero.quote_card')}
                  onDragOver={(e) => handleElementDragOver(e, 'hero.quote_card')}
                  onDragLeave={(e) => handleElementDragLeave(e, 'hero.quote_card')}
                  onDrop={(e) => handleElementDrop(e, 'hero.quote_card')}
                  className="mt-8 self-end w-full max-w-xs bg-[#FAF9F6] border border-black/5 rounded-2xl p-4 shadow-sm relative cursor-pointer"
                  title="Drop photo here to replace quote avatar"
                >
                  {dragTargetElementId === 'hero.quote_card' && (
                    <div className="absolute inset-0 pointer-events-none border-2 border-[#00f2fe] bg-[#00f2fe]/20 rounded-2xl z-50 flex items-center justify-center">
                      <span className="text-[10px] bg-black/90 px-2.5 py-1 rounded-full text-white font-bold border border-[#00f2fe]">
                        Drop to Replace Avatar
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-2.5">
                    <img
                      src={el('hero.quote_card').content?.imageSrc || '/assets/abid-avatar.jpg'}
                      alt="Avatar"
                      className="w-10 h-10 rounded-xl object-cover select-none pointer-events-none"
                    />
                    <div>
                      <h3 className="font-display font-bold text-xs text-[#151515]">
                        {el('hero.quote_card').content?.author || 'Abid'}
                      </h3>
                      <p className="text-[10px] text-gray-500 font-medium">
                        {el('hero.quote_card').content?.role || 'Creative Designer'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-[#151515] italic leading-snug">
                    {el('hero.quote_card').content?.text || '“I create premium designs that look clean and convert.”'}
                  </p>
                </div>
              </div>

              {/* CENTER PORTRAIT (Overlapping Both Panels — Drag & Drop to Replace) */}
              <div
                {...bindEl('hero.portrait')}
                onDragOver={(e) => handleElementDragOver(e, 'hero.portrait')}
                onDragLeave={(e) => handleElementDragLeave(e, 'hero.portrait')}
                onDrop={(e) => handleElementDrop(e, 'hero.portrait')}
                className="hidden lg:flex absolute bottom-0 left-[49%] -translate-x-1/2 z-20 flex-col items-center justify-end pointer-events-auto w-[540px] xl:w-[600px] cursor-pointer"
                title="Click to select or drag photo directly here to replace portrait"
              >
                {dragTargetElementId === 'hero.portrait' && (
                  <div className="absolute inset-0 pointer-events-none border-2 border-[#00f2fe] bg-[#00f2fe]/25 rounded-2xl z-50 flex items-center justify-center shadow-[0_0_30px_rgba(0,242,254,0.7)] animate-pulse">
                    <div className="bg-black/90 border border-[#00f2fe] px-4 py-1.5 rounded-full text-white text-xs font-bold shadow-xl">
                      🔄 Drop to Replace Portrait Photo
                    </div>
                  </div>
                )}
                <div className="relative w-full flex items-end justify-center">
                  <img
                    src={el('hero.portrait').content?.imageSrc || '/assets/abid-hero.png'}
                    alt="Abid Nalakath"
                    className="w-full h-auto object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.45)] select-none pointer-events-none"
                  />

                  {/* Circular Social Outline Buttons */}
                  <div
                    {...bindEl('hero.social_icons')}
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5"
                  >
                    <div className="w-9 h-9 rounded-full border border-white/30 bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
                      <InstagramIcon className="w-4 h-4" />
                    </div>
                    <div className="w-9 h-9 rounded-full border border-white/30 bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
                      <LinkedinIcon className="w-4 h-4" />
                    </div>
                    <div className="w-9 h-9 rounded-full border border-white/30 bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
                      <DribbbleIcon className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Render any Custom Dragged Logos & Photos in Hero Section */}
          {renderSectionCustomElements('hero')}
        </div>

        {/* ================= STATS SECTION ================= */}
        <div
          id="section-stats"
          onDragOver={(e) => handleSectionDragOver(e, 'stats')}
          onDragLeave={(e) => handleSectionDragLeave(e, 'stats')}
          onDrop={(e) => handleSectionDrop(e, 'stats')}
          className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative"
        >
          {renderSectionDropIndicator('stats', 'Stats Section')}

          <div
            {...bindEl('stats.container')}
            className="bg-gradient-to-r from-[#200d07] via-[#33140b] to-[#200d07] border border-[#F4510B]/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
              {[
                { val: '100+', label: 'Creative Projects', desc: 'Completed with precision' },
                { val: '24/7', label: 'Design Focus', desc: 'Dedicated creative output' },
                { val: '6+', label: 'Years Experience', desc: 'Industry experience' },
                { val: '40+', label: 'Satisfied Clients', desc: 'Global collaborations' },
              ].map((s, idx) => (
                <div key={idx} className="flex flex-col items-center text-center pt-4 sm:pt-0 sm:pl-6">
                  <div className="font-display text-4xl font-extrabold text-white">{s.val}</div>
                  <div className="text-xs font-semibold text-[#FF9D00] uppercase mt-1">{s.label}</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Dropped Elements in Stats Section */}
          {renderSectionCustomElements('stats')}
        </div>

        {/* ================= ABOUT SECTION ================= */}
        <div
          id="section-about"
          onDragOver={(e) => handleSectionDragOver(e, 'about')}
          onDragLeave={(e) => handleSectionDragLeave(e, 'about')}
          onDrop={(e) => handleSectionDrop(e, 'about')}
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 relative"
        >
          {renderSectionDropIndicator('about', 'About Section')}

          <div className="text-center max-w-3xl mx-auto">
            <h2
              {...bindEl('about.header')}
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4"
            >
              {el('about.header').content?.text || 'Design With Purpose.'}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div
              {...bindEl('about.philosophy_card')}
              className="lg:col-span-7 bg-[#140a07] border border-[#F4510B]/20 rounded-3xl p-8 sm:p-10 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F4510B] to-[#C63D08] flex items-center justify-center text-white mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-3">
                {el('about.philosophy_card').content?.title || 'Where Strategy Meets Pure Visual Artistry'}
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {el('about.philosophy_card').content?.text || 'Great design is never just decoration. It is visual problem solving that bridges emotion and business outcomes.'}
              </p>
            </div>

            <div
              {...bindEl('about.skills_matrix')}
              className="lg:col-span-5 bg-[#140a07] border border-[#F4510B]/20 rounded-3xl p-8 flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#F4510B]/15 flex items-center justify-center text-[#FF9D00]">
                  <Palette className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-display font-bold text-white">Core Competencies</h3>
              </div>
              <div className="space-y-3">
                {['Brand Identity (98%)', 'Art Direction (96%)', 'Editorial Typography (95%)', 'Luxury Packaging (92%)'].map((skill, idx) => (
                  <div key={idx} className="text-xs text-neutral-300 bg-white/5 p-2 rounded-lg">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Dropped Elements in About Section */}
          {renderSectionCustomElements('about')}
        </div>

        {/* ================= PROJECTS SECTION ================= */}
        <div
          id="section-projects"
          onDragOver={(e) => handleSectionDragOver(e, 'projects')}
          onDragLeave={(e) => handleSectionDragLeave(e, 'projects')}
          onDrop={(e) => handleSectionDrop(e, 'projects')}
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 relative"
        >
          {renderSectionDropIndicator('projects', 'Projects Section')}

          <div>
            <h2
              {...bindEl('projects.header')}
              className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2"
            >
              {el('projects.header').content?.text || 'Featured Case Studies'}
            </h2>
            <p className="text-xs text-neutral-400">Curated brand identity, advertising, and digital art</p>
          </div>

          <div
            {...bindEl('projects.grid')}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { title: 'Aura Botanicals', cat: 'Brand Identity', img: '/assets/projects/project-1.jpg' },
              { title: 'Nova Sound Festival', cat: 'Posters', img: '/assets/projects/project-2.jpg' },
              { title: 'Kroma Creative Suite', cat: 'Social Media', img: '/assets/projects/project-3.jpg' },
            ].map((p, idx) => (
              <div key={idx} className="bg-[#140a07] border border-white/10 rounded-2xl overflow-hidden p-3 space-y-3">
                <div className="h-44 w-full rounded-xl overflow-hidden bg-black/60">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover select-none pointer-events-none" />
                </div>
                <div className="px-1">
                  <span className="text-[10px] text-[#FF9D00] font-semibold uppercase">{p.cat}</span>
                  <h4 className="font-bold text-sm text-white">{p.title}</h4>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Dropped Elements in Projects Section */}
          {renderSectionCustomElements('projects')}
        </div>

        {/* ================= CONTACT SECTION ================= */}
        <div
          id="section-contact"
          onDragOver={(e) => handleSectionDragOver(e, 'contact')}
          onDragLeave={(e) => handleSectionDragLeave(e, 'contact')}
          onDrop={(e) => handleSectionDrop(e, 'contact')}
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 relative"
        >
          {renderSectionDropIndicator('contact', 'Contact Section')}

          <div className="text-center max-w-2xl mx-auto">
            <h2
              {...bindEl('contact.header')}
              className="font-display text-3xl sm:text-4xl font-bold text-white"
            >
              {el('contact.header').content?.text || 'Let’s Create Something Extraordinary'}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div
              {...bindEl('contact.info_cards')}
              className="lg:col-span-5 bg-[#140a07] border border-white/10 rounded-3xl p-6 space-y-4"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F4510B]/20 flex items-center justify-center text-[#FF9D00]">
                <Mail className="w-5 h-5" />
              </div>
              <div className="text-base font-bold text-white">hello@abidnalakath.design</div>
              <p className="text-xs text-neutral-400">Available worldwide for brand identity and creative direction.</p>
            </div>

            <div
              {...bindEl('contact.form')}
              className="lg:col-span-7 bg-[#140a07] border border-[#F4510B]/25 rounded-3xl p-8"
            >
              <div className="text-xs font-semibold text-neutral-400 mb-4 uppercase tracking-wider">
                Interactive Contact Form
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  disabled
                  placeholder="Your Name"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-neutral-400 cursor-not-allowed"
                />
                <input
                  type="email"
                  disabled
                  placeholder="Your Email"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-neutral-400 cursor-not-allowed"
                />
                <textarea
                  disabled
                  placeholder="Tell me about your project..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-neutral-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Custom Dropped Elements in Contact Section */}
          {renderSectionCustomElements('contact')}
        </div>

        {/* ================= FOOTER SECTION ================= */}
        <div id="section-footer" {...bindEl('footer.container')} className="border-t border-white/10 pt-10 px-8 text-center text-xs text-neutral-500">
          <div>&copy; {new Date().getFullYear()} Abid Nalakath. Visual Website Design Editor Canvas.</div>
        </div>

        {/* ================= INTERACTIVE SELECTION BOUNDING BOX & HANDLES ================= */}
        {!previewMode && selectedRect && selectedElement && (
          <div
            style={{
              position: 'absolute',
              left: `${selectedRect.left}px`,
              top: `${selectedRect.top}px`,
              width: `${selectedRect.width}px`,
              height: `${selectedRect.height}px`,
              pointerEvents: 'none',
            }}
            className="z-50 select-none animate-fadeIn"
          >
            {/* Inline Double-Click Text Editor Overlay */}
            {editingTextId === selectedElementId ? (
              <div className="absolute inset-0 z-50 pointer-events-auto bg-[#140a07]/95 border-2 border-[#F4510B] rounded-lg p-2 flex flex-col shadow-2xl">
                <textarea
                  autoFocus
                  defaultValue={selectedElement.content?.text || ''}
                  onBlur={(e) => {
                    if (editingTextId) {
                      onUpdateElementContent(editingTextId, { text: e.target.value });
                    }
                    setEditingTextId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (editingTextId) {
                        onUpdateElementContent(editingTextId, { text: (e.target as HTMLTextAreaElement).value });
                      }
                      setEditingTextId(null);
                    } else if (e.key === 'Escape') {
                      setEditingTextId(null);
                    }
                  }}
                  className="w-full flex-1 bg-black/60 border border-white/20 text-white text-xs p-2 rounded outline-none resize-none font-sans"
                />
                <div className="text-[9px] text-[#FF9D00] mt-1 font-mono">
                  Enter = Save | Shift+Enter = Linebreak | Esc = Cancel
                </div>
              </div>
            ) : (
              /* 1.5px Solid High-Visibility Orange Bounding Box */
              <div
                onMouseDown={handleDragMouseDown}
                className={`absolute inset-0 border-2 border-[#F4510B] shadow-[0_0_12px_rgba(244,81,11,0.5)] pointer-events-auto transition-colors ${
                  isDragging ? 'cursor-grabbing border-[#FF9D00]' : 'cursor-grab'
                }`}
              />
            )}

            {/* Top Dimensions & Layer Badge */}
            <div className="absolute -top-7 left-0 pointer-events-auto flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#F4510B] text-white text-[10px] font-mono shadow-md font-bold whitespace-nowrap">
              <span>{selectedElement.name}</span>
              <span className="opacity-75 font-normal">
                ({Math.round(selectedRect.width)} × {Math.round(selectedRect.height)}px)
              </span>
            </div>

            {/* 8 Resize Handles (Corner & Edge) */}
            {!selectedElement.locked && (
              <>
                {/* NW */}
                <div
                  onMouseDown={(e) => handleResizeMouseDown('nw', e)}
                  className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#F4510B] rounded-sm pointer-events-auto cursor-nwse-resize shadow-md"
                />
                {/* N */}
                <div
                  onMouseDown={(e) => handleResizeMouseDown('n', e)}
                  className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-[#F4510B] rounded-sm pointer-events-auto cursor-ns-resize shadow-md"
                />
                {/* NE */}
                <div
                  onMouseDown={(e) => handleResizeMouseDown('ne', e)}
                  className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#F4510B] rounded-sm pointer-events-auto cursor-nesw-resize shadow-md"
                />
                {/* E */}
                <div
                  onMouseDown={(e) => handleResizeMouseDown('e', e)}
                  className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-white border-2 border-[#F4510B] rounded-sm pointer-events-auto cursor-ew-resize shadow-md"
                />
                {/* SE */}
                <div
                  onMouseDown={(e) => handleResizeMouseDown('se', e)}
                  className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#F4510B] rounded-sm pointer-events-auto cursor-nwse-resize shadow-md"
                />
                {/* S */}
                <div
                  onMouseDown={(e) => handleResizeMouseDown('s', e)}
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-[#F4510B] rounded-sm pointer-events-auto cursor-ns-resize shadow-md"
                />
                {/* SW */}
                <div
                  onMouseDown={(e) => handleResizeMouseDown('sw', e)}
                  className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#F4510B] rounded-sm pointer-events-auto cursor-nesw-resize shadow-md"
                />
                {/* W */}
                <div
                  onMouseDown={(e) => handleResizeMouseDown('w', e)}
                  className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 bg-white border-2 border-[#F4510B] rounded-sm pointer-events-auto cursor-ew-resize shadow-md"
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
