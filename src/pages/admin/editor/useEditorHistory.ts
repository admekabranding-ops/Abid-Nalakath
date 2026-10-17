import { useState, useCallback, useRef } from 'react';
import type { VisualLayoutState, VisualElement, ElementStyles } from './editorTypes';
import { defaultVisualLayout } from './defaultLayout';

const MAX_HISTORY = 50;

export function useEditorHistory(initialLayout: VisualLayoutState = defaultVisualLayout) {
  const [layout, setLayout] = useState<VisualLayoutState>(initialLayout);
  const [history, setHistory] = useState<VisualLayoutState[]>([initialLayout]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // Track latest layout ref for quick access without closure staleness
  const layoutRef = useRef<VisualLayoutState>(layout);
  layoutRef.current = layout;

  const pushState = useCallback((newLayout: VisualLayoutState) => {
    setHistory((prev) => {
      // Discard any forward history if we made changes after undo
      const trimmed = prev.slice(0, historyIndex + 1);
      const next = [...trimmed, newLayout];
      if (next.length > MAX_HISTORY) {
        next.shift();
      }
      return next;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, MAX_HISTORY - 1));
    setLayout(newLayout);
    setIsDirty(true);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const targetState = history[prevIndex];
      setHistoryIndex(prevIndex);
      setLayout(targetState);
      setIsDirty(true);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const targetState = history[nextIndex];
      setHistoryIndex(nextIndex);
      setLayout(targetState);
      setIsDirty(true);
    }
  }, [historyIndex, history]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Update specific element styles
  const updateElementStyles = useCallback((elementId: string, styles: Partial<ElementStyles>) => {
    const current = layoutRef.current;
    const existing = current.elements[elementId];
    if (!existing || existing.locked) return;

    const updatedElement: VisualElement = {
      ...existing,
      styles: {
        ...existing.styles,
        ...styles,
      },
    };

    const newLayout: VisualLayoutState = {
      ...current,
      lastUpdated: new Date().toISOString(),
      elements: {
        ...current.elements,
        [elementId]: updatedElement,
      },
    };

    pushState(newLayout);
  }, [pushState]);

  // Update specific element content
  const updateElementContent = useCallback((elementId: string, contentUpdates: Record<string, any>) => {
    const current = layoutRef.current;
    const existing = current.elements[elementId];
    if (!existing || existing.locked) return;

    const updatedElement: VisualElement = {
      ...existing,
      content: {
        ...(existing.content || {}),
        ...contentUpdates,
      },
    };

    const newLayout: VisualLayoutState = {
      ...current,
      lastUpdated: new Date().toISOString(),
      elements: {
        ...current.elements,
        [elementId]: updatedElement,
      },
    };

    pushState(newLayout);
  }, [pushState]);

  // Rename layer
  const renameElement = useCallback((elementId: string, newName: string) => {
    const current = layoutRef.current;
    const existing = current.elements[elementId];
    if (!existing) return;

    const updatedElement: VisualElement = {
      ...existing,
      name: newName,
    };

    const newLayout: VisualLayoutState = {
      ...current,
      lastUpdated: new Date().toISOString(),
      elements: {
        ...current.elements,
        [elementId]: updatedElement,
      },
    };

    pushState(newLayout);
  }, [pushState]);

  // Toggle lock state
  const toggleLock = useCallback((elementId: string) => {
    const current = layoutRef.current;
    const existing = current.elements[elementId];
    if (!existing) return;

    const updatedElement: VisualElement = {
      ...existing,
      locked: !existing.locked,
    };

    const newLayout: VisualLayoutState = {
      ...current,
      lastUpdated: new Date().toISOString(),
      elements: {
        ...current.elements,
        [elementId]: updatedElement,
      },
    };

    pushState(newLayout);
  }, [pushState]);

  // Toggle visibility
  const toggleVisibility = useCallback((elementId: string) => {
    const current = layoutRef.current;
    const existing = current.elements[elementId];
    if (!existing) return;

    const updatedElement: VisualElement = {
      ...existing,
      hidden: !existing.hidden,
    };

    const newLayout: VisualLayoutState = {
      ...current,
      lastUpdated: new Date().toISOString(),
      elements: {
        ...current.elements,
        [elementId]: updatedElement,
      },
    };

    pushState(newLayout);
  }, [pushState]);

  // Add a newly created element
  const addElement = useCallback((newElement: VisualElement, targetSectionId = 'hero') => {
    const current = layoutRef.current;
    const elementId = newElement.id || `custom_${Date.now()}`;
    const finalized: VisualElement = {
      ...newElement,
      id: elementId,
      section: targetSectionId,
      isCustom: true,
      locked: false,
      hidden: false,
    };

    // Update section elementIds
    const updatedSections = current.sections.map((sec) => {
      if (sec.id === targetSectionId) {
        return {
          ...sec,
          elementIds: [...sec.elementIds, elementId],
        };
      }
      return sec;
    });

    const newLayout: VisualLayoutState = {
      ...current,
      lastUpdated: new Date().toISOString(),
      elements: {
        ...current.elements,
        [elementId]: finalized,
      },
      sections: updatedSections,
      order: [...current.order, elementId],
    };

    pushState(newLayout);
    return elementId;
  }, [pushState]);

  // Duplicate element
  const duplicateElement = useCallback((elementId: string) => {
    const current = layoutRef.current;
    const existing = current.elements[elementId];
    if (!existing) return null;

    const newId = `${existing.id}_copy_${Date.now().toString().slice(-4)}`;
    const cloned: VisualElement = {
      ...existing,
      id: newId,
      name: `${existing.name} (Copy)`,
      isCustom: true,
      styles: {
        ...existing.styles,
        x: (existing.styles.x || 0) + 20,
        y: (existing.styles.y || 0) + 20,
      },
    };

    const updatedSections = current.sections.map((sec) => {
      if (sec.id === existing.section) {
        const idx = sec.elementIds.indexOf(elementId);
        const newIds = [...sec.elementIds];
        newIds.splice(idx + 1, 0, newId);
        return { ...sec, elementIds: newIds };
      }
      return sec;
    });

    const newLayout: VisualLayoutState = {
      ...current,
      lastUpdated: new Date().toISOString(),
      elements: {
        ...current.elements,
        [newId]: cloned,
      },
      sections: updatedSections,
      order: [...current.order, newId],
    };

    pushState(newLayout);
    return newId;
  }, [pushState]);

  // Delete element
  const deleteElement = useCallback((elementId: string) => {
    const current = layoutRef.current;
    const existing = current.elements[elementId];
    if (!existing) return;

    // If it's a core system element, hide it instead of destroying schema
    if (!existing.isCustom) {
      toggleVisibility(elementId);
      return;
    }

    const newElements = { ...current.elements };
    delete newElements[elementId];

    const updatedSections = current.sections.map((sec) => ({
      ...sec,
      elementIds: sec.elementIds.filter((id) => id !== elementId),
    }));

    const newLayout: VisualLayoutState = {
      ...current,
      lastUpdated: new Date().toISOString(),
      elements: newElements,
      sections: updatedSections,
      order: current.order.filter((id) => id !== elementId),
    };

    pushState(newLayout);
  }, [pushState, toggleVisibility]);

  // Reorder elements within section
  const reorderElement = useCallback((elementId: string, direction: 'up' | 'down') => {
    const current = layoutRef.current;
    const existing = current.elements[elementId];
    if (!existing) return;

    const updatedSections = current.sections.map((sec) => {
      if (sec.id === existing.section) {
        const ids = [...sec.elementIds];
        const idx = ids.indexOf(elementId);
        if (idx === -1) return sec;

        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= ids.length) return sec;

        const temp = ids[idx];
        ids[idx] = ids[targetIdx];
        ids[targetIdx] = temp;

        return { ...sec, elementIds: ids };
      }
      return sec;
    });

    const newLayout: VisualLayoutState = {
      ...current,
      lastUpdated: new Date().toISOString(),
      sections: updatedSections,
    };

    pushState(newLayout);
  }, [pushState]);

  // Set entire state (e.g. on load from backend or restore backup)
  const setLoadedLayout = useCallback((newLayout: VisualLayoutState) => {
    setLayout(newLayout);
    setHistory([newLayout]);
    setHistoryIndex(0);
    setIsDirty(false);
  }, []);

  // Reset to default
  const resetToDefault = useCallback(() => {
    setLayout(defaultVisualLayout);
    setHistory([defaultVisualLayout]);
    setHistoryIndex(0);
    setIsDirty(true);
  }, []);

  const markSaved = useCallback(() => {
    setIsDirty(false);
  }, []);

  return {
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
  };
}
