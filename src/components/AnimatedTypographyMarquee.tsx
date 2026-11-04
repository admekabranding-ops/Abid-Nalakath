import React from 'react';
import { usePortfolioContent } from '../context/ContentContext';
import { EditableElement } from '../admin/EditableElement';
import type { MarqueeItem } from '../types/content';
import { defaultMarqueeSettings } from '../data/portfolioData';

interface MarqueeRowProps {
  items: MarqueeItem[];
  direction: 'left' | 'right';
  speed: number;
  rowNumber: 1 | 2;
}

const getItemStyleClass = (item: MarqueeItem) => {
  switch (item.style) {
    case 'italic':
      // Style B — Elegant Italic Typography (editorial serif)
      return 'font-serif italic font-normal tracking-wide';
    case 'outline':
      // Style C — Outlined Typography (transparent text with thin orange outline)
      if (item.color === '#FF9D00') return 'font-black uppercase tracking-tight stroke-orange-gold';
      if (item.color === '#C63D08') return 'font-black uppercase tracking-tight stroke-orange-burnt';
      return 'font-black uppercase tracking-tight stroke-orange-vibrant';
    case 'bold':
    default:
      // Style A — Bold Typography (large modern sans-serif, solid fill)
      return 'font-black uppercase tracking-tighter font-sans';
  }
};

const getItemColor = (item: MarqueeItem) => {
  if (item.style === 'outline') {
    return 'transparent';
  }
  return item.color || '#F4510B';
};

const MarqueeRow: React.FC<MarqueeRowProps> = ({ items, direction, speed, rowNumber }) => {
  const animationClass = direction === 'left' ? 'marquee-row-left' : 'marquee-row-right';
  const speedVar = {
    [direction === 'left' ? '--speed-left' : '--speed-right']: `${speed}s`,
  } as React.CSSProperties;

  // We repeat items to ensure seamless continuous looping with -50% translateX
  const duplicatedItems = [...items, ...items];

  return (
    <div className="relative w-full overflow-hidden select-none py-1 sm:py-2">
      <div className={`${animationClass} flex items-center`} style={speedVar}>
        {duplicatedItems.map((item, idx) => {
          const styleClass = getItemStyleClass(item);
          const color = getItemColor(item);
          const isClone = idx >= items.length;
          const originalIdx = idx % items.length;
          const uniqueKey = `mq-${rowNumber}-${originalIdx}-${isClone ? 'clone' : 'orig'}`;

          return (
            <div key={uniqueKey} className="flex items-center shrink-0">
              {/* Phrase with Visual Editor support */}
              <EditableElement
                id={`marquee-row${rowNumber}-${originalIdx}`}
                section="capabilities"
                type="text"
                label={`Marquee Row ${rowNumber} — ${item.text}`}
                propertyPath={`marqueeSettings.row${rowNumber}Items.${originalIdx}.text`}
                currentValue={item.text}
                className="shrink-0"
              >
                <span
                  style={{ color }}
                  className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-none inline-block transition-transform duration-300 hover:scale-[1.02] cursor-default ${styleClass}`}
                >
                  {item.text}
                </span>
              </EditableElement>

              {/* Glowing circular orange dot separator */}
              <span
                className="inline-block w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full bg-[#F4510B] shrink-0 mx-4 sm:mx-6 md:mx-8 lg:mx-10 shadow-[0_0_12px_rgba(244,81,11,0.8)]"
                aria-hidden="true"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const AnimatedTypographyMarquee: React.FC = () => {
  const { content } = usePortfolioContent();
  const marquee = content.marqueeSettings || defaultMarqueeSettings;

  if (marquee.enabled === false) return null;

  const row1 = marquee.row1Items && marquee.row1Items.length > 0 ? marquee.row1Items : defaultMarqueeSettings.row1Items;
  const row2 = marquee.row2Items && marquee.row2Items.length > 0 ? marquee.row2Items : defaultMarqueeSettings.row2Items;
  const speedRow1 = marquee.speedRow1 || 34;
  const speedRow2 = marquee.speedRow2 || 42;

  return (
    <div
      aria-label="Creative specialties typography marquee"
      className="relative w-full overflow-hidden bg-[#0B0B0B] py-6 sm:py-8 md:py-10 border-y border-white/[0.06] select-none"
    >
      {/* Subtle edge fade overlays for cinematic transition */}
      <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-24 md:w-36 bg-gradient-to-r from-[#0B0B0B] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-24 md:w-36 bg-gradient-to-l from-[#0B0B0B] to-transparent z-10 pointer-events-none" />

      {/* Row 1: Right-to-Left Continuous Flow */}
      <MarqueeRow items={row1} direction="left" speed={speedRow1} rowNumber={1} />

      {/* Row 2: Left-to-Right Continuous Flow (Opposing direction, tight vertical spacing) */}
      <MarqueeRow items={row2} direction="right" speed={speedRow2} rowNumber={2} />
    </div>
  );
};
