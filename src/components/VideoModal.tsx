import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Sparkles } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, title, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(25);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Simulate progress when playing
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 300);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="AI Video Player"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl rounded-3xl overflow-hidden bg-[#141414] border border-white/20 shadow-2xl flex flex-col"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-4 px-6 bg-black/70 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A1F] animate-pulse" />
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{title || 'AI Cinematic Video Showcase'}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-[#FF6A00]">
                  4K 60FPS
                </span>
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Close video player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Video Canvas / Visual Simulation */}
          <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden group">
            {/* Ambient Background Simulation */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80)',
                filter: isPlaying ? 'brightness(0.9) contrast(1.1)' : 'brightness(0.5) contrast(1.1)',
              }}
            />

            {/* Cinematic overlay lighting */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />

            {/* Neural scan line effect */}
            <div 
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FF5A1F] to-transparent opacity-60 pointer-events-none"
              style={{ top: `${progress}%`, transition: 'top 0.3s ease-linear' }}
            />

            {/* Center Play/Pause button */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`relative z-20 w-16 h-16 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-2xl shadow-[#FF5A1F]/50 ${
                isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
              }`}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-current" />
              ) : (
                <Play className="w-7 h-7 fill-current ml-1" />
              )}
            </button>

            {/* AI Generation watermark / badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-white/90">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6A00]" />
              <span>Prompt: Photorealistic horology in molten obsidian space</span>
            </div>
          </div>

          {/* Bottom Player Controls */}
          <div className="p-4 px-6 bg-black/80 border-t border-white/10 space-y-3">
            {/* Progress Timeline */}
            <div 
              className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newProgress = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
                setProgress(newProgress);
              }}
            >
              <div 
                className="h-full bg-gradient-to-r from-[#FF5A1F] to-[#FF6A00] transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-white/70">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-white transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="hover:text-white transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="font-mono text-[11px]">
                  00:{progress < 10 ? `0${Math.floor(progress * 0.45)}` : Math.floor(progress * 0.45)} / 00:45
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-white/50 hidden sm:inline font-mono">
                  Generative Diffusion v3.5
                </span>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-white transition-colors"
                  aria-label="Toggle Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
