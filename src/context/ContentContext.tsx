import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { SiteContent, VersionSnapshot, SelectedElement } from '../types/content';
import { initialSiteContent } from '../data/initialContent';
import { CheckCircle2, AlertCircle, ExternalLink, X } from 'lucide-react';

export interface ToastNotification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  link?: { text: string; url: string };
}

interface ContentContextType {
  mode: 'published' | 'draft';
  content: SiteContent;
  updateContent: (updater: (prev: SiteContent) => SiteContent) => void;
  updateField: (path: string, value: any) => void;
  updateElementColor: (elementId: string, color: string, propertyPath?: string) => void;
  removeElementColor: (elementId: string, propertyPath?: string) => void;
  saveDraft: (silent?: boolean) => Promise<{ success: boolean; error?: string }>;
  publishContent: (silent?: boolean) => Promise<{ success: boolean; error?: string }>;
  rollback: (versionId: string) => Promise<{ success: boolean; error?: string }>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isDraftDirty: boolean;
  lastSaved: string | null;
  lastPublished: string | null;
  versions: VersionSnapshot[];
  isLoading: boolean;
  selectedElement: SelectedElement | null;
  setSelectedElement: (el: SelectedElement | null) => void;
  editorViewport: 'desktop' | 'laptop' | 'tablet' | 'mobile';
  setEditorViewport: (vp: 'desktop' | 'laptop' | 'tablet' | 'mobile') => void;
  previewMode: boolean;
  setPreviewMode: (v: boolean) => void;
  toast: ToastNotification | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info', link?: { text: string; url: string }) => void;
  dismissToast: () => void;
}

export const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useSafePortfolioContent = () => {
  return useContext(ContentContext);
};

// Helper for deep immutable updates by path ("personalInfo.heroHeading" or "servicesData.0.title")
function setByPath(obj: any, path: string, value: any): any {
  const parts = path.split('.');
  if (parts.length === 0) return obj;

  const clone = Array.isArray(obj) ? [...obj] : { ...obj };
  let current = clone;

  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const nextKey = parts[i + 1];
    const isNextNumber = !isNaN(Number(nextKey));

    if (current[key] === undefined || current[key] === null) {
      current[key] = isNextNumber ? [] : {};
    } else {
      current[key] = Array.isArray(current[key]) ? [...current[key]] : { ...current[key] };
    }
    current = current[key];
  }

  current[parts[parts.length - 1]] = value;
  return clone;
}

export const ContentProvider: React.FC<{
  mode?: 'published' | 'draft';
  children: React.ReactNode;
}> = ({ mode = 'published', children }) => {
  const [content, setContent] = useState<SiteContent>(initialSiteContent);
  const [isDraftDirty, setIsDraftDirty] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [lastPublished, setLastPublished] = useState<string | null>(null);
  const [versions, setVersions] = useState<VersionSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Visual Editor State
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
  const [editorViewport, setEditorViewport] = useState<'desktop' | 'laptop' | 'tablet' | 'mobile'>('desktop');
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  // Global Toast State
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const toastTimeoutRef = useRef<any>(null);

  const dismissToast = useCallback(() => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast(null);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success', link?: { text: string; url: string }) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    const newToast: ToastNotification = {
      id: Date.now(),
      message,
      type,
      link,
    };
    setToast(newToast);
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  // Undo / Redo Stacks
  const historyRef = useRef<SiteContent[]>([initialSiteContent]);
  const historyIndexRef = useRef<number>(0);
  const [, setHistoryTick] = useState(0);

  // Load content from API or LocalStorage cache
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/admin/content');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            if (data.versions) setVersions(data.versions);

            if (mode === 'draft' && data.draft && data.draft.content) {
              setContent(data.draft.content);
              setLastSaved(data.draft.lastSaved || null);
              historyRef.current = [data.draft.content];
              historyIndexRef.current = 0;
            } else if (data.published && data.published.content) {
              setContent(data.published.content);
              setLastPublished(data.published.publishedAt || null);
              historyRef.current = [data.published.content];
              historyIndexRef.current = 0;
            }
          }
        }
      } catch (e) {
        console.warn('Could not load from API, falling back to initial content', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [mode]);

  // Update content with undo history tracking
  const updateContent = useCallback((updater: (prev: SiteContent) => SiteContent) => {
    setContent((prev) => {
      const next = updater(prev);
      // Push to history
      const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
      newHistory.push(next);
      // Limit history to 35 steps
      if (newHistory.length > 35) newHistory.shift();
      historyRef.current = newHistory;
      historyIndexRef.current = newHistory.length - 1;
      setHistoryTick((t) => t + 1);
      setIsDraftDirty(true);
      return next;
    });
  }, []);

  const updateField = useCallback((path: string, value: any) => {
    updateContent((prev) => setByPath(prev, path, value));
  }, [updateContent]);

  const updateElementColor = useCallback((elementId: string, color: string, propertyPath?: string) => {
    updateContent((prev) => {
      let updated: SiteContent = {
        ...prev,
        customColors: {
          ...(prev.customColors || {}),
          [elementId]: color,
        },
      };
      if (propertyPath) {
        updated = setByPath(updated, propertyPath + 'Color', color);
      }
      return updated;
    });
  }, [updateContent]);

  const removeElementColor = useCallback((elementId: string, propertyPath?: string) => {
    updateContent((prev) => {
      const nextColors = { ...(prev.customColors || {}) };
      delete nextColors[elementId];
      let updated: SiteContent = {
        ...prev,
        customColors: nextColors,
      };
      if (propertyPath) {
        updated = setByPath(updated, propertyPath + 'Color', undefined);
      }
      return updated;
    });
  }, [updateContent]);

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      const targetState = historyRef.current[historyIndexRef.current];
      setContent(targetState);
      setHistoryTick((t) => t + 1);
      setIsDraftDirty(true);
    }
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      const targetState = historyRef.current[historyIndexRef.current];
      setContent(targetState);
      setHistoryTick((t) => t + 1);
      setIsDraftDirty(true);
    }
  }, []);

  const saveDraft = async (silent = false) => {
    try {
      const res = await fetch('/api/admin/save-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        const errMsg = data.error || 'Failed to save draft';
        if (!silent) showToast(errMsg, 'error');
        return { success: false, error: errMsg };
      }
      setIsDraftDirty(false);
      setLastSaved(data.lastSaved);
      if (!silent) {
        showToast('Draft changes saved successfully!', 'success');
      }
      return { success: true };
    } catch (e: any) {
      const errMsg = e.message || 'Error saving draft';
      if (!silent) showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }
  };

  const publishContent = async (silent = false) => {
    try {
      const res = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        const errMsg = data.error || 'Failed to publish';
        if (!silent) showToast(errMsg, 'error');
        return { success: false, error: errMsg };
      }
      setIsDraftDirty(false);
      setLastPublished(data.publishedAt);
      setLastSaved(data.publishedAt);
      if (!silent) {
        showToast('Website Published Live! Visitors now see all changes.', 'success', {
          text: 'View Live Site →',
          url: '/',
        });
      }
      return { success: true };
    } catch (e: any) {
      const errMsg = e.message || 'Error publishing content';
      if (!silent) showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }
  };

  const rollback = async (versionId: string) => {
    try {
      const res = await fetch('/api/admin/rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to rollback' };
      }
      if (data.restoredContent) {
        setContent(data.restoredContent);
        historyRef.current = [data.restoredContent];
        historyIndexRef.current = 0;
        setIsDraftDirty(false);
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Error rolling back' };
    }
  };

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  // Scoped dynamic CSS injector for all customized text colors
  const colorStylesCss = useMemo(() => {
    const colors = content.customColors || {};
    const entries = Object.entries(colors).filter(([_, c]) => Boolean(c));
    if (entries.length === 0) return '';

    return entries
      .map(([id, color]) => `
        [data-editable-id="${id}"],
        [data-editable-id="${id}"] h1,
        [data-editable-id="${id}"] h2,
        [data-editable-id="${id}"] h3,
        [data-editable-id="${id}"] h4,
        [data-editable-id="${id}"] h5,
        [data-editable-id="${id}"] h6,
        [data-editable-id="${id}"] p,
        [data-editable-id="${id}"] a,
        [data-editable-id="${id}"] span:not(.indicator-dot):not(.pill-arrow-white *) {
          color: ${color} !important;
        }
      `)
      .join('\n');
  }, [content.customColors]);

  return (
    <ContentContext.Provider
      value={{
        mode,
        content,
        updateContent,
        updateField,
        updateElementColor,
        removeElementColor,
        saveDraft,
        publishContent,
        rollback,
        undo,
        redo,
        canUndo,
        canRedo,
        isDraftDirty,
        lastSaved,
        lastPublished,
        versions,
        isLoading,
        selectedElement,
        setSelectedElement,
        editorViewport,
        setEditorViewport,
        previewMode,
        setPreviewMode,
        toast,
        showToast,
        dismissToast,
      }}
    >
      {/* Global Floating Toast for Save/Publish/Feedback */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] animate-in fade-in slide-in-from-top-4 duration-200 pointer-events-auto">
          <div className={`px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-xl ${
            toast.type === 'error'
              ? 'bg-red-950/95 border-red-500/50 text-red-200 shadow-red-950/50'
              : 'bg-[#161616]/95 border-emerald-500/50 text-emerald-300 shadow-black/80 ring-1 ring-emerald-500/30'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-semibold text-white">
              {toast.message}
            </span>
            {toast.link && (
              <a
                href={toast.link.url}
                target="_blank"
                rel="noreferrer"
                className="ml-2 px-3 py-1.5 rounded-xl bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#FF5A1F]/20 transition-transform hover:scale-105"
              >
                <span>{toast.link.text}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              type="button"
              onClick={dismissToast}
              className="ml-2 text-white/40 hover:text-white p-1 rounded-lg transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {colorStylesCss && (
        <style
          id="admin-custom-colors-style"
          dangerouslySetInnerHTML={{ __html: colorStylesCss }}
        />
      )}
      {children}
    </ContentContext.Provider>
  );
};

export const usePortfolioContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('usePortfolioContent must be used within a ContentProvider');
  }
  return context;
};
