// tool.ts - ツール関連の型定義
// AstroネイティブアプローチでTypeScript Strictモード対応

export type AnimationType = 'scale' | 'slide' | 'fade';

export interface InteractiveElements {
  hasHoverEffect?: boolean;
  hasClickAction?: boolean;
  animationType?: AnimationType;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  color?: string;
  link: string;
  interactiveElements?: InteractiveElements;
}

export interface ToolCardProps {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  color?: string;
  link: string;
  interactiveElements?: InteractiveElements;
}
