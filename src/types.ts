export type ChildState = 'neutral' | 'happy' | 'excited' | 'laughing' | 'thinking' | 'confused' | 'bored' | 'sad';

export interface Child {
  id: string;
  name: string;
  color: string;
  expression: ChildState;
  isRaisingHand: boolean;
  skinTone?: string;
  hairStyle?: 'bob' | 'spiky' | 'pigtails' | 'curly' | 'short';
}

export interface Choice {
  id: string;
  icon?: string;
  text: string;
  explanation: string;
  rating: 'best' | 'ok' | 'poor';
  points: number;
  reactions: Record<string, ChildState>;
  handsUp?: string[]; // IDs of children who raise hands
  analysis?: {
    intonation: number;
    pitch: number;
    volume: number;
  };
}

export interface Scene {
  id: string;
  phase: number;
  title: string;
  subtitle?: string;
  instruction: string;
  bookImage?: string;
  bookBg?: string;
  choices: Choice[];
  category: 'before' | 'during' | 'after' | 'shared' | 'storytelling';
}

export interface ScoreState {
  before: number;
  during: number;
  after: number;
  shared: number;
  storytelling: number;
}

export type Phase = 'welcome' | 'phase1' | 'phase2' | 'phase3' | 'report';
