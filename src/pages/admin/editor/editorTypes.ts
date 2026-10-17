export type ElementType =
  | 'text'
  | 'heading'
  | 'image'
  | 'button'
  | 'container'
  | 'card'
  | 'badge'
  | 'stat'
  | 'divider'
  | 'circle'
  | 'rectangle'
  | 'social_group'
  | 'custom';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export interface ElementStyles {
  // Dimensions & Position
  width?: string;
  maxWidth?: string;
  minWidth?: string;
  height?: string;
  maxHeight?: string;
  minHeight?: string;
  x?: number; // relative/offset X (px)
  y?: number; // relative/offset Y (px)
  positionMode?: 'relative' | 'absolute' | 'static';
  zIndex?: number;
  opacity?: number; // 0 to 1
  rotation?: number; // degrees

  // Typography
  fontSize?: string; // e.g. "48px", "14px"
  fontWeight?: string; // "300", "400", "500", "600", "700", "900"
  fontFamily?: string;
  lineHeight?: string;
  letterSpacing?: string;
  color?: string; // text color hex
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';

  // Fills & Backgrounds
  backgroundColor?: string;
  backgroundGradient?: string;
  backgroundImage?: string;
  backdropBlur?: string;

  // Borders & Radius
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  borderRadius?: string; // e.g. "16px", "9999px"

  // Shadows & Effects
  boxShadow?: string;

  // Layout & Spacing
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  display?: 'block' | 'flex' | 'grid' | 'inline-block' | 'none';
  flexDirection?: 'row' | 'column';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  gap?: string;

  // Image specific
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  objectPosition?: string;
  filter?: string;
}

export interface VisualElement {
  id: string; // e.g. 'hero.heading', 'hero.portrait', 'custom_123'
  name: string; // e.g. 'Main Headline'
  section: string; // 'hero' | 'stats' | 'about' | 'projects' | 'services' | 'contact' | 'footer' | 'custom'
  type: ElementType;
  locked?: boolean;
  hidden?: boolean;
  parentId?: string | null;
  children?: string[]; // array of child element IDs
  styles: ElementStyles;
  responsive?: {
    tablet?: Partial<ElementStyles>;
    mobile?: Partial<ElementStyles>;
  };
  content?: {
    text?: string;
    subtext?: string;
    imageSrc?: string;
    linkUrl?: string;
    altText?: string;
    badgeText?: string;
    statValue?: string;
    statLabel?: string;
    html?: string;
    [key: string]: any;
  };
  isCustom?: boolean;
  order?: number;
}

export interface SectionDefinition {
  id: string;
  name: string;
  iconName: string;
  elementIds: string[];
}

export interface VisualLayoutState {
  version: number;
  lastUpdated: string;
  elements: Record<string, VisualElement>;
  sections: SectionDefinition[];
  order: string[]; // root element ordering
}

export interface HistoryState {
  layout: VisualLayoutState;
  timestamp: number;
  description: string;
}
