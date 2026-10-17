import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  PlusSquare,
  Image as ImageIcon,
  Compass,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react';
import { apiRequest } from '../../../api/client';
import { useEditorHistory } from './useEditorHistory';
import { defaultVisualLayout } from './defaultLayout';
import type { ViewportMode, VisualElement } from './editorTypes';
import { EditorToolbar } from './EditorToolbar';
import { LayersPanel } from './LayersPanel';
import { AddElementPanel } from './AddElementPanel';
import { AssetsPanel } from './AssetsPanel';
import { SectionsPanel } from './SectionsPanel';
import { PropertiesPanel } from './PropertiesPanel';
import { EditorCanvas } from './EditorCanvas';

export const VisualEditor: React.FC = () => {
  const navigate = useNavigate();

  // History and state management
  const {
    layout,
    isDirty,
    canUndo,
    canRedo,
    undo,
    redo,
    updateElementStyles,
    updateElementContent,
    renameElement,
    toggleLock,
    toggleVisibility,
    addElement,
    duplicateElement,
    deleteElement,
    reorderElement,
    setLoadedLayout,
    resetToDefault,
    markSaved,
  } = useEditorHistory(defaultVisualLayout);

  // Canvas viewport, zoom & display states
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [zoom, setZoom] = useState<number>(100);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Left sidebar tab navigation
  const [activeSidebarTab, setActiveSidebarTab] = useState<'layers' | 'elements' | 'assets' | 'sections'>('layers');

  // Operation status flags
  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // 1. Session verification & layout loading on mount
  useEffect(() => {
    apiRequest('/auth/verify')
      .then(() => {
        loadVisualLayout();
      })
      .catch(() => {
        navigate('/admin/login');
      });
  }, [navigate]);

  const loadVisualLayout = async () => {
    try {
      const data = await apiRequest('/admin/visual-layout');
      if (data) {
        if (data.draft && data.draft.sections && data.draft.elements) {
          setLoadedLayout(data.draft);
          showNotification('Loaded working draft layout from local database.', 'info');
        } else if (data.layout && data.layout.sections && data.layout.elements) {
          setLoadedLayout(data.layout);
        }
      }
    } catch (err) {
      console.warn('Could not load saved visual layout, using default template', err);
    }
  };

  // Save draft
  const handleSaveDraft = async () => {
    try {
      setSavingDraft(true);
      await apiRequest('/admin/visual-layout', {
        method: 'PUT',
        body: JSON.stringify({ layout }),
      });
      markSaved();
      showNotification('Working draft saved to local SQLite database!');
    } catch (err: any) {
      showNotification(err.message || 'Failed to save draft', 'error');
    } finally {
      setSavingDraft(false);
    }
  };

  // Publish live
  const handlePublish = async () => {
    try {
      setPublishing(true);
      await apiRequest('/admin/visual-layout/publish', {
        method: 'POST',
        body: JSON.stringify({ layout }),
      });
      markSaved();
      showNotification('Successfully published! The live website is now updated with your design.');
    } catch (err: any) {
      showNotification(err.message || 'Failed to publish changes', 'error');
    } finally {
      setPublishing(false);
    }
  };

  // Reset to default
  const handleResetDefault = async () => {
    const confirmReset = window.confirm(
      'Are you sure you want to reset all visual customizations to the original template? This will discard unsaved draft modifications.'
    );
    if (!confirmReset) return;

    try {
      await apiRequest('/admin/visual-layout/reset', { method: 'POST' });
      resetToDefault();
      setSelectedElementId(null);
      showNotification('Reset to the original portfolio reference template.', 'info');
    } catch (err: any) {
      showNotification(err.message || 'Failed to reset layout', 'error');
    }
  };

  // Export JSON backup
  const handleExportBackup = () => {
    try {
      const jsonStr = JSON.stringify(layout, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `abid-visual-layout-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification('Exported layout backup JSON file.');
    } catch (err) {
      showNotification('Failed to export backup file', 'error');
    }
  };

  // Import JSON backup
  const handleImportBackup = (importedData: any) => {
    try {
      if (!importedData || !importedData.elements || !importedData.sections) {
        throw new Error('Invalid layout backup structure');
      }
      setLoadedLayout(importedData);
      showNotification('Successfully imported layout backup!');
    } catch (err: any) {
      showNotification(err.message || 'Failed to parse layout backup', 'error');
    }
  };

  // Scroll canvas to section
  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(`section-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Apply asset image directly to selected element
  const handleApplyImageToSelected = (imageUrl: string) => {
    if (!selectedElementId) {
      showNotification('Please select an element on the canvas first to apply this image.', 'info');
      return;
    }
    const element = layout.elements[selectedElementId];
    if (!element) return;

    if (element.type === 'image') {
      updateElementContent(selectedElementId, { imageSrc: imageUrl });
      showNotification(`Applied image to "${element.name}"`);
    } else {
      updateElementStyles(selectedElementId, { backgroundImage: `url(${imageUrl})` });
      showNotification(`Set background image for "${element.name}"`);
    }
  };

  // Currently selected element object
  const selectedElement = selectedElementId ? layout.elements[selectedElementId] || null : null;

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0a0503] text-white flex flex-col font-sans select-none">
      {/* ================= TOP APPLICATION TOOLBAR ================= */}
      <EditorToolbar
        viewport={viewport}
        onViewportChange={setViewport}
        zoom={zoom}
        onZoomChange={setZoom}
        previewMode={previewMode}
        onTogglePreview={() => setPreviewMode(!previewMode)}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        isDirty={isDirty}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onResetDefault={handleResetDefault}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        onExit={() => navigate('/admin')}
        savingDraft={savingDraft}
        publishing={publishing}
      />

      {/* ================= MAIN THREE-COLUMN WORKSPACE ================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Toast Notification Banner */}
        {notification && (
          <div
            className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full flex items-center gap-2 text-xs font-semibold shadow-2xl backdrop-blur-md transition-all animate-bounce ${
              notification.type === 'success'
                ? 'bg-emerald-500/90 text-white border border-emerald-400/40 shadow-emerald-500/20'
                : notification.type === 'error'
                ? 'bg-red-500/90 text-white border border-red-400/40 shadow-red-500/20'
                : 'bg-[#F4510B]/90 text-white border border-[#FF9D00]/40 shadow-orange-500/20'
            }`}
          >
            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
            {notification.type === 'error' && <AlertCircle className="w-4 h-4" />}
            {notification.type === 'info' && <Info className="w-4 h-4" />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* ================= LEFT SIDEBAR (Layers, Elements, Assets, Sections) ================= */}
        {!previewMode && (
          <aside className="w-80 flex-shrink-0 bg-[#120a07] border-r border-white/10 flex flex-col z-20 shadow-xl">
            {/* Sidebar Navigation Tabs */}
            <div className="flex items-center border-b border-white/10 bg-[#160c08] p-1 gap-1">
              <button
                onClick={() => setActiveSidebarTab('layers')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-[11px] font-bold transition-colors ${
                  activeSidebarTab === 'layers'
                    ? 'bg-[#F4510B] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
                title="Hierarchical Layers Tree"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Layers</span>
              </button>

              <button
                onClick={() => setActiveSidebarTab('elements')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-[11px] font-bold transition-colors ${
                  activeSidebarTab === 'elements'
                    ? 'bg-[#F4510B] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
                title="Insert Design Components"
              >
                <PlusSquare className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>

              <button
                onClick={() => setActiveSidebarTab('assets')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-[11px] font-bold transition-colors ${
                  activeSidebarTab === 'assets'
                    ? 'bg-[#F4510B] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
                title="Media & Image Assets"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Assets</span>
              </button>

              <button
                onClick={() => setActiveSidebarTab('sections')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-[11px] font-bold transition-colors ${
                  activeSidebarTab === 'sections'
                    ? 'bg-[#F4510B] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
                title="Sections Quick Jump"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Sections</span>
              </button>
            </div>

            {/* Active Sidebar Tab Content Body */}
            <div className="flex-1 overflow-hidden">
              {activeSidebarTab === 'layers' && (
                <LayersPanel
                  layout={layout}
                  selectedElementId={selectedElementId}
                  onSelectElement={(id) => setSelectedElementId(id)}
                  onToggleLock={toggleLock}
                  onToggleVisibility={toggleVisibility}
                  onRenameElement={renameElement}
                  onDuplicateElement={duplicateElement}
                  onDeleteElement={deleteElement}
                  onReorderElement={reorderElement}
                />
              )}

              {activeSidebarTab === 'elements' && (
                <AddElementPanel
                  activeSectionId={selectedElement?.section || 'hero'}
                  onAddElement={(newElem: VisualElement, targetSectionId: string) => {
                    addElement(newElem, targetSectionId);
                    setSelectedElementId(newElem.id);
                    showNotification(`Added ${newElem.name} to section "${targetSectionId}"`);
                  }}
                />
              )}

              {activeSidebarTab === 'assets' && (
                <AssetsPanel
                  selectedElementId={selectedElementId}
                  onApplyImageToSelected={handleApplyImageToSelected}
                  onAddImageToCanvas={(url: string, name: string) => {
                    const isLogo = name.toLowerCase().includes('logo') || url.endsWith('.svg');
                    const targetSec = selectedElement?.section || 'hero';
                    const newElem: VisualElement = {
                      id: `custom_asset_${Date.now()}`,
                      name: name || (isLogo ? 'Custom Logo' : 'Photo Element'),
                      section: targetSec,
                      type: 'image',
                      content: {
                        imageSrc: url,
                        altText: name || 'Custom Graphic',
                      },
                      styles: {
                        width: isLogo ? '160px' : '360px',
                        height: 'auto',
                        borderRadius: isLogo ? '8px' : '18px',
                        boxShadow: isLogo ? 'none' : '0 12px 35px rgba(0,0,0,0.4)',
                        display: 'block',
                        x: 0,
                        y: 0,
                      },
                    };
                    addElement(newElem, targetSec);
                    setSelectedElementId(newElem.id);
                    showNotification(`Added "${newElem.name}" to section "${targetSec}"`);
                  }}
                />
              )}

              {activeSidebarTab === 'sections' && (
                <SectionsPanel
                  layout={layout}
                  activeSectionId={selectedElement?.section || 'hero'}
                  onScrollToSection={handleScrollToSection}
                />
              )}
            </div>
          </aside>
        )}

        {/* ================= CENTER INTERACTIVE CANVAS ================= */}
        <main className="flex-1 h-full overflow-hidden relative flex flex-col">
          <EditorCanvas
            layout={layout}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElementId}
            onUpdateElementStyles={updateElementStyles}
            onUpdateElementContent={updateElementContent}
            viewport={viewport}
            zoom={zoom}
            previewMode={previewMode}
            showGrid={showGrid}
            onDeleteElement={deleteElement}
            onAddElement={(newElem: VisualElement, targetSectionId: string) => {
              addElement(newElem, targetSectionId);
              setSelectedElementId(newElem.id);
              showNotification(`Added "${newElem.name}" to section "${targetSectionId}"`);
            }}
          />
        </main>

        {/* ================= RIGHT PROPERTIES INSPECTOR PANEL ================= */}
        {!previewMode && (
          <aside className="w-80 flex-shrink-0 bg-[#120a07] border-l border-white/10 flex flex-col z-20 shadow-xl overflow-hidden">
            <PropertiesPanel
              element={selectedElement}
              onUpdateStyles={(styles) => {
                if (selectedElementId) {
                  updateElementStyles(selectedElementId, styles);
                }
              }}
              onUpdateContent={(content) => {
                if (selectedElementId) {
                  updateElementContent(selectedElementId, content);
                }
              }}
              onToggleLock={() => {
                if (selectedElementId) {
                  toggleLock(selectedElementId);
                }
              }}
              onToggleVisibility={() => {
                if (selectedElementId) {
                  toggleVisibility(selectedElementId);
                }
              }}
            />
          </aside>
        )}
      </div>
    </div>
  );
};

export default VisualEditor;
