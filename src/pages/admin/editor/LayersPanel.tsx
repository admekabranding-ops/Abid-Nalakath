import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronDown,
  ChevronRight,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Type,
  Image as ImageIcon,
  Square,
  Sparkles,
  MousePointer,
  Search,
  Check,
  Edit2,
} from 'lucide-react';
import type { VisualLayoutState, ElementType } from './editorTypes';

interface LayersPanelProps {
  layout: VisualLayoutState;
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  onToggleLock: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onRenameElement: (id: string, name: string) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onReorderElement: (id: string, direction: 'up' | 'down') => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
  layout,
  selectedElementId,
  onSelectElement,
  onToggleLock,
  onToggleVisibility,
  onRenameElement,
  onDuplicateElement,
  onDeleteElement,
  onReorderElement,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');

  const toggleSectionCollapse = (secId: string) => {
    setCollapsedSections((prev) => ({ ...prev, [secId]: !prev[secId] }));
  };

  const startRename = (id: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingNameId(id);
    setTempName(currentName);
  };

  const commitRename = (id: string) => {
    if (tempName.trim()) {
      onRenameElement(id, tempName.trim());
    }
    setEditingNameId(null);
  };

  const getElementIcon = (type: ElementType) => {
    switch (type) {
      case 'heading':
      case 'text':
        return <Type className="w-3.5 h-3.5 text-[#FF9D00]" />;
      case 'image':
        return <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />;
      case 'button':
        return <MousePointer className="w-3.5 h-3.5 text-emerald-400" />;
      case 'stat':
      case 'badge':
        return <Sparkles className="w-3.5 h-3.5 text-[#F4510B]" />;
      case 'card':
      case 'container':
      default:
        return <Square className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#120a08] text-white select-none">
      {/* Header & Search */}
      <div className="p-3 border-b border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
            Layers Tree
          </span>
          <span className="text-[10px] font-mono text-neutral-500">
            {Object.keys(layout.elements).length} Layers
          </span>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#F4510B]"
          />
        </div>
      </div>

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3 custom-scrollbar">
        {layout.sections.map((section) => {
          const isCollapsed = collapsedSections[section.id];
          const sectionElements = section.elementIds
            .map((id) => layout.elements[id])
            .filter((el) => {
              if (!el) return false;
              if (!searchQuery.trim()) return true;
              return (
                el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                el.id.toLowerCase().includes(searchQuery.toLowerCase())
              );
            });

          if (searchQuery.trim() && sectionElements.length === 0) return null;

          return (
            <div key={section.id} className="rounded-xl bg-black/20 border border-white/5 overflow-hidden">
              {/* Section Header */}
              <div
                onClick={() => toggleSectionCollapse(section.id)}
                className="flex items-center justify-between px-2.5 py-1.5 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  {isCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                  )}
                  <span className="text-[11px] font-semibold text-neutral-200">
                    {section.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500">
                  {sectionElements.length}
                </span>
              </div>

              {/* Section Elements */}
              {!isCollapsed && (
                <div className="divide-y divide-white/5 p-1">
                  {sectionElements.map((el, idx) => {
                    const isSelected = selectedElementId === el.id;

                    return (
                      <div
                        key={el.id}
                        onClick={() => onSelectElement(el.id)}
                        className={`group flex items-center justify-between px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#F4510B]/25 text-white border border-[#F4510B]/60 shadow-sm'
                            : 'text-neutral-300 hover:bg-white/5'
                        }`}
                      >
                        {/* Left: Icon & Name */}
                        <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
                          {getElementIcon(el.type)}

                          {editingNameId === el.id ? (
                            <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="text"
                                autoFocus
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') commitRename(el.id);
                                  if (e.key === 'Escape') setEditingNameId(null);
                                }}
                                className="w-full px-1.5 py-0.5 rounded bg-black border border-[#F4510B] text-xs text-white focus:outline-none"
                              />
                              <button
                                onClick={() => commitRename(el.id)}
                                className="p-0.5 text-emerald-400 hover:text-emerald-300"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <span
                              className={`truncate font-medium text-[11px] ${
                                el.hidden ? 'line-through opacity-40' : ''
                              }`}
                            >
                              {el.name}
                            </span>
                          )}
                        </div>

                        {/* Right: Actions (Visibility, Lock, Rename, More) */}
                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          {/* Reorder Buttons */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onReorderElement(el.id, 'up');
                            }}
                            disabled={idx === 0}
                            className="p-1 hover:text-[#FF9D00] disabled:opacity-20 transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp className="w-2.5 h-2.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onReorderElement(el.id, 'down');
                            }}
                            disabled={idx === sectionElements.length - 1}
                            className="p-1 hover:text-[#FF9D00] disabled:opacity-20 transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown className="w-2.5 h-2.5" />
                          </button>

                          {/* Rename */}
                          <button
                            onClick={(e) => startRename(el.id, el.name, e)}
                            className="p-1 hover:text-[#FF9D00] transition-colors"
                            title="Rename Layer"
                          >
                            <Edit2 className="w-2.5 h-2.5" />
                          </button>

                          {/* Lock */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleLock(el.id);
                            }}
                            className={`p-1 transition-colors ${
                              el.locked ? 'text-[#FF9D00]' : 'text-neutral-500 hover:text-white'
                            }`}
                            title={el.locked ? 'Unlock' : 'Lock'}
                          >
                            {el.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                          </button>

                          {/* Visibility */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleVisibility(el.id);
                            }}
                            className={`p-1 transition-colors ${
                              el.hidden ? 'text-red-400' : 'text-neutral-500 hover:text-white'
                            }`}
                            title={el.hidden ? 'Show' : 'Hide'}
                          >
                            {el.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>

                          {/* Duplicate */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDuplicateElement(el.id);
                            }}
                            className="p-1 hover:text-[#FF9D00] transition-colors"
                            title="Duplicate Layer (Ctrl+D)"
                          >
                            <Copy className="w-2.5 h-2.5" />
                          </button>

                          {/* Delete (custom elements or hide) */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteElement(el.id);
                            }}
                            className="p-1 hover:text-red-400 transition-colors"
                            title={el.isCustom ? 'Delete Element' : 'Hide Element'}
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
