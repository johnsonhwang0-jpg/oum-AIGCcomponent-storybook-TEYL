import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Library, 
  Theater, 
  BarChart3, 
  Star, 
  CheckCircle2, 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  Search,
  Info,
  Target
} from 'lucide-react';
import { 
  Child, 
  Phase, 
  ScoreState, 
  Scene, 
  ChildState, 
  Choice 
} from './types';
import { 
  CHILDREN_DATA, 
  PHASE1_SCENES, 
  PHASE2_SCENES, 
  PHASE3_SCENES 
} from './constants';
import RadarChart from './components/RadarChart';
import feedbackGood from './img/feedback-good.png';
import feedbackOk from './img/feedback-ok.png';
import feedbackBad from './img/feedback-bad.png';

// --- Constants ---

const FEEDBACK_IMAGES = {
  best: feedbackGood,
  ok: feedbackOk,
  poor: feedbackBad
};

type FeedbackType = 'best' | 'ok' | 'poor';

const FEEDBACK_META: Record<FeedbackType, {
  title: string;
  reasonLabel: string;
  tone: string;
  detailBg: string;
  detailText: string;
  detailBorder: string;
}> = {
  best: {
    title: 'Strong choice',
    reasonLabel: 'Why this works well',
    tone: 'This response actively engages children and supports the reading goal.',
    detailBg: 'bg-brand-green/10',
    detailText: 'text-brand-green',
    detailBorder: 'border-brand-green/20'
  },
  ok: {
    title: 'Okay, but limited',
    reasonLabel: 'Why this is only okay',
    tone: 'This response can work, but it gives children less thinking or participation.',
    detailBg: 'bg-amber-100/70',
    detailText: 'text-amber-700',
    detailBorder: 'border-amber-200'
  },
  poor: {
    title: 'Needs improvement',
    reasonLabel: 'Why this is not recommended',
    tone: 'This response misses the learning opportunity or reduces engagement.',
    detailBg: 'bg-red-50',
    detailText: 'text-brand-red',
    detailBorder: 'border-brand-red/20'
  }
};

const getFeedbackTypeFromPoints = (points: number): FeedbackType => {
  if (points >= 3) return 'best';
  if (points > 0) return 'ok';
  return 'poor';
};

const FeedbackReason = ({ rating, explanation, muted = false }: { rating: FeedbackType; explanation: string; muted?: boolean }) => {
  const meta = FEEDBACK_META[rating];

  return (
    <div className={`rounded-lg border px-2.5 py-2 ${meta.detailBg} ${meta.detailBorder} ${muted ? 'opacity-60 grayscale-[0.35]' : ''}`}>
      <div className={`text-[8px] font-black uppercase tracking-wider mb-1 ${meta.detailText}`}>{meta.reasonLabel}</div>
      <p className={`text-[9px] leading-tight ${muted ? 'text-stone-400' : 'text-stone-600'}`}>{explanation}</p>
    </div>
  );
};

type ChoiceFeedback = {
  choiceId: string;
  message: string;
  description: string;
  type: FeedbackType;
};

type TransitionCard = {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: string;
};

const FeedbackSideCard = ({ feedback, onClose }: { feedback: ChoiceFeedback; onClose: () => void }) => {
  const meta = FEEDBACK_META[feedback.type];
  const accents = {
    best: 'border-green-300 bg-green-600 shadow-[0_20px_70px_rgba(0,107,43,0.28)]',
    ok: 'border-amber-300 bg-amber-500 shadow-[0_20px_70px_rgba(245,158,11,0.28)]',
    poor: 'border-red-300 bg-red-600 shadow-[0_20px_70px_rgba(220,38,38,0.28)]'
  };
  const arrowColors = {
    best: 'bg-green-600 border-green-300',
    ok: 'bg-amber-500 border-amber-300',
    poor: 'bg-red-600 border-red-300'
  };

  const card = (
    <div className={`relative rounded-2xl border-2 p-4 ${accents[feedback.type]}`}>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 w-6 h-6 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors flex items-center justify-center text-sm font-black"
        aria-label="Close feedback"
      >
        ×
      </button>
      <div className="inline-flex items-center rounded-full px-2 py-1 text-[8px] font-black uppercase tracking-wider mb-2 bg-white/20 text-white border border-white/25">
        {meta.reasonLabel}
      </div>
      <h4 className="text-sm font-black text-white pr-8 mb-1">{feedback.message}</h4>
      <p className="text-[11px] leading-relaxed text-white/90 font-semibold">{feedback.description}</p>
    </div>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 16, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 16, scale: 0.96 }}
        className="hidden lg:block absolute right-[calc(100%+0.9rem)] top-1/2 -translate-y-1/2 z-[80] w-[330px] max-w-[42vw]"
      >
        {card}
        <div className={`absolute right-[-7px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-r-2 border-t-2 rotate-45 ${arrowColors[feedback.type]}`} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        className="lg:hidden mt-2 z-[80] relative"
      >
        {card}
      </motion.div>
    </>
  );
};

const TransitionOverlay = ({ card, onContinue }: { card: TransitionCard; onContinue: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.18 }}
    className="fixed inset-0 z-[90] flex items-center justify-center bg-brand-cream/80 backdrop-blur-md"
  >
    <motion.div
      initial={{ y: 28, opacity: 0, scale: 0.96 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -18, opacity: 0, scale: 0.98 }}
      transition={{ type: 'spring', damping: 22, stiffness: 180 }}
      className="relative w-[min(560px,calc(100vw-48px))] overflow-hidden rounded-[2rem] bg-white border border-brand-green/15 shadow-[0_30px_90px_rgba(0,107,43,0.18)] p-7 text-center"
    >
      <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-brand-green via-brand-yellow to-brand-red" />
      <div className="absolute -left-16 -top-16 w-36 h-36 rounded-full bg-brand-green/10 blur-2xl" />
      <div className="absolute -right-16 -bottom-16 w-40 h-40 rounded-full bg-brand-yellow/20 blur-2xl" />
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          animate={{ rotate: [0, -4, 4, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, repeatType: 'reverse' }}
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-mint text-4xl shadow-inner"
        >
          {card.icon}
        </motion.div>
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.35em] text-brand-green">{card.eyebrow}</p>
        <h3 className="text-2xl md:text-3xl font-black text-stone-800 tracking-tight font-display">{card.title}</h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-500 font-semibold">{card.subtitle}</p>
        <button
          type="button"
          onClick={onContinue}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-3 text-sm font-black text-white shadow-lg transition-all hover:bg-brand-green/90 hover:shadow-xl"
        >
          Continue
          <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// --- Components ---

const FeedbackVisual = ({ type }: { type: FeedbackType }) => {
  const getBorderColor = () => {
    switch (type) {
      case 'best': return 'from-green-500/50 to-transparent';
      case 'ok': return 'from-orange-500/50 to-transparent';
      case 'poor': return 'from-red-500/50 to-transparent';
      default: return '';
    }
  };

  const getText = () => {
    switch (type) {
      case 'best': return 'Excellent!';
      case 'ok': return 'Good!';
      case 'poor': return '?';
      default: return '';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'best': return 'text-white';
      case 'ok': return 'text-white';
      case 'poor': return 'text-white';
      default: return '';
    }
  };

  const getTextBgColor = () => {
    switch (type) {
      case 'best': return 'bg-green-500';
      case 'ok': return 'bg-orange-500';
      case 'poor': return 'bg-red-500';
      default: return '';
    }
  };

  return (
    <>
      {/* Screen border glow effect - larger coverage */}
      <div className="fixed inset-0 pointer-events-none z-[99]">
        {/* Top border */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: '60px' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5 }}
          className={`w-full bg-gradient-to-b ${getBorderColor()} animate-pulse`}
        />
        {/* Bottom border */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: '60px' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5 }}
          className={`w-full bg-gradient-to-t ${getBorderColor()} absolute bottom-0 animate-pulse`}
        />
        {/* Left border */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '60px' }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.5 }}
          className={`h-full bg-gradient-to-r ${getBorderColor()} animate-pulse`}
        />
        {/* Right border */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '60px' }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.5 }}
          className={`h-full bg-gradient-to-l ${getBorderColor()} absolute right-0 animate-pulse`}
        />
        {/* Corner glows - larger */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-500/30 to-transparent rounded-bl-full blur-3xl animate-pulse" style={{ opacity: type === 'best' ? 1 : type === 'ok' ? 0 : 0 }}></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-500/30 to-transparent rounded-bl-full blur-3xl animate-pulse" style={{ opacity: type === 'best' ? 1 : type === 'ok' ? 0 : 0 }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-500/30 to-transparent rounded-tr-full blur-3xl animate-pulse" style={{ opacity: type === 'best' ? 1 : type === 'ok' ? 0 : 0 }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-green-500/30 to-transparent rounded-tl-full blur-3xl animate-pulse" style={{ opacity: type === 'best' ? 1 : type === 'ok' ? 0 : 0 }}></div>
        
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-500/30 to-transparent rounded-bl-full blur-3xl animate-pulse" style={{ opacity: type === 'best' ? 0 : type === 'ok' ? 1 : 0 }}></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/30 to-transparent rounded-bl-full blur-3xl animate-pulse" style={{ opacity: type === 'best' ? 0 : type === 'ok' ? 1 : 0 }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-500/30 to-transparent rounded-tr-full blur-3xl animate-pulse" style={{ opacity: type === 'best' ? 0 : type === 'ok' ? 1 : 0 }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-orange-500/30 to-transparent rounded-tl-full blur-3xl animate-pulse" style={{ opacity: type === 'best' ? 0 : type === 'ok' ? 1 : 0 }}></div>
        
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-red-500/30 to-transparent rounded-bl-full blur-3xl animate-pulse" style={{ opacity: type === 'best' ? 0 : type === 'ok' ? 0 : 1 }}></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-500/30 to-transparent rounded-bl-full blur-3xl animate-pulse" style={{ opacity: type === 'best' ? 0 : type === 'ok' ? 0 : 1 }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-500/30 to-transparent rounded-tr-full blur-3xl animate-pulse" style={{ opacity: type === 'best' ? 0 : type === 'ok' ? 0 : 1 }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-red-500/30 to-transparent rounded-tl-full blur-3xl animate-pulse" style={{ opacity: type === 'best' ? 0 : type === 'ok' ? 0 : 1 }}></div>
      </div>

      {/* Feedback text - positioned above the image with solid background */}
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.8 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="fixed bottom-[70vh] left-1/2 -translate-x-1/2 z-[101] pointer-events-none"
      >
        <span className={`text-4xl md:text-6xl font-bold drop-shadow-lg ${getTextColor()} px-6 py-3 rounded-full ${getTextBgColor()}`}>
          {getText()}
        </span>
      </motion.div>

      {/* Confetti for best feedback */}
      {type === 'best' && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 100,
                rotate: 0,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{ 
                y: -100,
                rotate: Math.random() * 360,
                opacity: 0
              }}
              transition={{ 
                duration: Math.random() * 3 + 2,
                ease: "easeInOut"
              }}
              className="absolute w-4 h-4 rounded-full"
              style={{
                backgroundColor: ['#22c55e', '#3b82f6', '#ec4899', '#f97316', '#8b5cf6'][Math.floor(Math.random() * 5)],
                left: `${Math.random() * 100}%`,
                top: '100%'
              }}
            />
          ))}
        </div>
      )}

      {/* Question marks for poor feedback */}
      {type === 'poor' && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0,
                rotate: 0
              }}
              animate={{ 
                scale: [0, 1, 0.8, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute text-3xl text-red-500 font-bold"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            >
              ?
            </motion.div>
          ))}
        </div>
      )}

      {/* Feedback image */}
      <motion.div
        initial={{ y: 800, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 800, opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 150 }}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl z-[100] pointer-events-none flex justify-center items-end"
      >
        <img 
          src={FEEDBACK_IMAGES[type]} 
          alt="Feedback" 
          className="w-full h-auto max-h-[70vh] object-contain drop-shadow-[0_-20px_60px_rgba(0,0,0,0.3)]"
          loading="eager"
          referrerPolicy="no-referrer"
        />
      </motion.div>
    </>
  );
};

interface ChildAvatarProps {
  child: Child;
}

const ChildAvatar: React.FC<ChildAvatarProps & { isActive?: boolean, index: number }> = ({ child, isActive, index }) => {
  const emojis: Record<ChildState, string> = {
    neutral: '😊',
    happy: '😄',
    excited: '🤩',
    laughing: '😆',
    thinking: '🤔',
    confused: '😕',
    bored: '😑',
    sad: '😟'
  };

  // Staggered layout for semi-circle effect
  const yOffset = Math.sin((index / 4) * Math.PI) * 15;

  const renderHair = () => {
    const hairColor = '#4A3728'; // Dark brown default
    switch (child.hairStyle) {
      case 'bob':
        return (
          <div className="absolute -top-1 -inset-x-1 h-10 rounded-t-[2rem] -z-10" style={{ backgroundColor: hairColor }} />
        );
      case 'pigtails':
        return (
          <>
            <div className="absolute -top-1 -left-2 w-6 h-6 rounded-full -z-10" style={{ backgroundColor: hairColor }} />
            <div className="absolute -top-1 -right-2 w-6 h-6 rounded-full -z-10" style={{ backgroundColor: hairColor }} />
            <div className="absolute -top-1 inset-x-0 h-6 rounded-t-full -z-10" style={{ backgroundColor: hairColor }} />
          </>
        );
      case 'spiky':
        return (
          <div className="absolute -top-3 inset-x-0 flex justify-center gap-0.5 -z-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-3 h-5 bg-[#4A3728] clip-path-triangle" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
            ))}
          </div>
        );
      case 'curly':
        return (
          <div className="absolute -top-2 -inset-x-1 flex flex-wrap justify-center gap-0.5 -z-10">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: hairColor }} />
            ))}
          </div>
        );
      default: // short
        return (
          <div className="absolute -top-1 inset-x-1 h-5 rounded-t-full -z-10" style={{ backgroundColor: hairColor }} />
        );
    }
  };

  return (
    <motion.div 
      style={{ y: yOffset }}
      className="flex flex-col items-center gap-1 relative"
    >
      <motion.div
        key={child.expression}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative"
      >
        <motion.div
          animate={
            child.expression === 'excited' || child.expression === 'laughing' 
              ? { y: [0, -8, 0], scale: [1, 1.05, 1] } 
              : child.expression === 'confused' 
              ? { rotate: [0, 8, -8, 0] }
              : { y: [0, -2, 0] } // Subtle breathing
          }
          transition={{ 
            repeat: Infinity, 
            duration: child.expression === 'neutral' ? 3 : 0.6,
            ease: "easeInOut"
          }}
          className="relative flex flex-col items-center"
        >
          {/* Head & Hair Container */}
          <div className="relative w-14 h-14 mb-1">
            {renderHair()}
            <div 
              className={`w-full h-full rounded-full shadow-md transition-all flex items-center justify-center relative border-2 ${
                isActive ? 'border-brand-green ring-4 ring-brand-green/20' : 'border-white/50'
              }`}
              style={{ backgroundColor: child.skinTone || '#FFDBAC' }}
            >
              {/* Drawn Face Features */}
              <div className="flex flex-col items-center gap-1.5 pt-1 relative">
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-stone-800/80" />
                  <div className="w-1.5 h-1.5 rounded-full bg-stone-800/80" />
                </div>
                
                {/* Rosy Cheeks */}
                <div className="absolute top-3.5 flex justify-between w-10 px-0.5 opacity-50 pointer-events-none">
                  <div className="w-2.5 h-1.5 bg-rose-300 rounded-full blur-[1px]" />
                  <div className="w-2.5 h-1.5 bg-rose-300 rounded-full blur-[1px]" />
                </div>

                <div 
                  className="w-5 h-2.5 border-b-2 border-stone-800/60 rounded-full" 
                  style={{ 
                    borderRadius: child.expression === 'sad' ? '50% 50% 0 0 / 100% 100% 0 0' : '0 0 50% 50% / 0 0 100% 100%',
                    borderBottom: child.expression === 'sad' ? '0' : '2px solid rgba(41, 37, 36, 0.6)',
                    borderTop: child.expression === 'sad' ? '2px solid rgba(41, 37, 36, 0.6)' : '0',
                    marginTop: child.expression === 'sad' ? '4px' : '0'
                  }} 
                />
              </div>

              {/* Emotion Emoji Badge */}
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-lg border-2 border-stone-100 z-10">
                <span className="select-none">{emojis[child.expression]}</span>
              </div>
            </div>
          </div>

          {/* Neck */}
          <div className="w-3 h-2 -mt-2 z-0" style={{ backgroundColor: child.skinTone || '#FFDBAC' }} />

          {/* Shoulders / Shirt */}
          <div 
            className={`w-16 h-8 rounded-t-[1.5rem] shadow-sm transition-all ${
              isActive ? 'ring-2 ring-brand-green/20' : ''
            }`}
            style={{ backgroundColor: child.color }}
          >
            {/* Simple shirt detail */}
            <div className="w-full h-full flex justify-center pt-1">
              <div className="w-4 h-2 rounded-full bg-black/5" />
            </div>
          </div>
          
          {/* Shadow on rug */}
          <div className="absolute -bottom-2 w-12 h-3 bg-black/5 rounded-full blur-sm -z-20" />
          
          {/* Active Indicator */}
          {isActive && (
            <motion.div 
              layoutId="active-child"
              className="absolute -top-2 -right-2 w-5 h-5 bg-brand-green rounded-full border-2 border-white flex items-center justify-center z-20 shadow-sm"
            >
              <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            </motion.div>
          )}
        </motion.div>
      </motion.div>
      
      <span className={`text-[10px] font-black uppercase tracking-widest mt-2 ${isActive ? 'text-brand-green' : 'text-stone-500/60'}`}>
        {child.name}
      </span>
      
      <AnimatePresence>
        {child.isRaisingHand && (
          <motion.div
            initial={{ scale: 0, opacity: 0, x: 15, y: 0 }}
            animate={{ scale: 1, opacity: 1, x: 22, y: -30 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute text-2xl pointer-events-none z-30"
          >
            <span className="inline-block animate-bounce">✋</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [phase, setPhase] = useState<Phase>('welcome');
  const [sceneIndex, setSceneIndex] = useState(0);
  const [score, setScore] = useState<ScoreState>({
    before: 0,
    during: 0,
    after: 0,
    shared: 0,
    storytelling: 0
  });
  const [children, setChildren] = useState<Child[]>(CHILDREN_DATA);
  const [visualFeedback, setVisualFeedback] = useState<FeedbackType | null>(null);
  const [choiceFeedback, setChoiceFeedback] = useState<ChoiceFeedback | null>(null);
  const [transitionCard, setTransitionCard] = useState<TransitionCard | null>(null);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const visualFeedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingTransitionAction = useRef<(() => void) | null>(null);
  
  // Phase 2 specific state
  const [p2Task, setP2Task] = useState(1);
  const [highlightedWords, setHighlightedWords] = useState<number[]>([]);
  const [p2Finished, setP2Finished] = useState(false);

  // Preload feedback images on mount
  useEffect(() => {
    const preloadImages = async () => {
      const images = [
        FEEDBACK_IMAGES.best,
        FEEDBACK_IMAGES.ok,
        FEEDBACK_IMAGES.poor
      ];
      
      const preloadPromises = images.map(src => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      });
      
      await Promise.all(preloadPromises);
      setImagesLoaded(true);
    };
    
    preloadImages();
  }, []);

  useEffect(() => {
    return () => {
      if (visualFeedbackTimer.current) clearTimeout(visualFeedbackTimer.current);
    };
  }, []);

  // Shuffle choices for the current scene
  const shuffledChoices = useMemo(() => {
    let choices: any[] = [];
    if (phase === 'phase1') {
      choices = PHASE1_SCENES[sceneIndex]?.choices || [];
    } else if (phase === 'phase3') {
      choices = PHASE3_SCENES[sceneIndex]?.choices || [];
    } else if (phase === 'phase2') {
      if (p2Task === 2) {
        choices = [
          { text: 'Predictable structure', pts: 3, id: 'p2-2-1', explanation: 'Best! Repetition and predictable structures help children feel successful as readers.' },
          { text: 'Repetition', pts: 3, id: 'p2-2-2', explanation: 'Best! Repetition and predictable structures help children feel successful as readers.' },
          { text: 'Long complex sentences', pts: 0, id: 'p2-2-3', explanation: 'Not recommended. Long sentences are harder for young children to track and repeat.' }
        ];
      } else if (p2Task === 3) {
        choices = [
          { text: 'Left-to-right directionality', pts: 3, id: 'p2-3-1', explanation: 'Best! Modeling tracking is a key goal of shared reading.' },
          { text: 'Phonics', pts: 0, id: 'p2-3-2', explanation: 'Not the primary goal here. Shared reading focuses more on print awareness and tracking.' },
          { text: 'Vocabulary', pts: 0, id: 'p2-3-3', explanation: 'Important, but modeling directionality is the specific task for this page.' }
        ];
      }
    }
    return [...choices].sort(() => Math.random() - 0.5);
  }, [phase, sceneIndex, p2Task]);

  const currentTotalScore = (Object.values(score) as number[]).reduce((a, b) => a + b, 0);

  const resetChildren = () => {
    setChildren(prev => prev.map(c => ({ ...c, expression: 'neutral', isRaisingHand: false })));
  };

  const showChoiceFeedback = (choiceId: string, type: FeedbackType, description: string) => {
    const meta = FEEDBACK_META[type];
    if (visualFeedbackTimer.current) clearTimeout(visualFeedbackTimer.current);
    setVisualFeedback(type);
    setChoiceFeedback({ choiceId, message: meta.title, description, type });
    visualFeedbackTimer.current = setTimeout(() => setVisualFeedback(null), 2100);
  };

  const clearChoiceFeedback = () => {
    if (visualFeedbackTimer.current) clearTimeout(visualFeedbackTimer.current);
    setChoiceFeedback(null);
    setVisualFeedback(null);
  };

  const getPhaseIntro = (targetPhase: Phase): TransitionCard => {
    switch (targetPhase) {
      case 'phase1':
        return {
          eyebrow: 'Module 1',
          title: 'Ask Better Questions After Each Page',
          subtitle: 'Practice how to use questions after reading a page to guide children into prediction, response, and interaction.',
          icon: '📖'
        };
      case 'phase2':
        return {
          eyebrow: 'Module 2',
          title: 'Guide Children During Shared Reading',
          subtitle: 'Learn what to do when reading one book together so children can follow print, notice patterns, and read with confidence.',
          icon: '👀'
        };
      case 'phase3':
        return {
          eyebrow: 'Module 3',
          title: 'Tell Stories With Voice and Body',
          subtitle: 'Explore how intonation, pitch, volume, gestures, and visual support make English storytelling clearer and more engaging.',
          icon: '🎭'
        };
      case 'report':
        return {
          eyebrow: 'Module 4',
          title: 'Review Your Teaching Report',
          subtitle: 'Wrap up with a report that summarizes how your choices supported interaction, shared reading, and storytelling skills.',
          icon: '🏆'
        };
      default:
        return {
          eyebrow: 'Welcome',
          title: 'Back to the Starting Point',
          subtitle: 'Review the simulation entry point before beginning again.',
          icon: '🐛'
        };
    }
  };

  const playTransition = (card: TransitionCard, action: () => void) => {
    if (transitionCard) return;
    pendingTransitionAction.current = action;
    setTransitionCard(card);
  };

  const continueTransition = () => {
    const action = pendingTransitionAction.current;
    pendingTransitionAction.current = null;
    setTransitionCard(null);
    action?.();
  };

  const startPhase = (targetPhase: Phase) => {
    playTransition(getPhaseIntro(targetPhase), () => {
      clearChoiceFeedback();
      setSelectedChoiceId(null);
      resetChildren();
      setPhase(targetPhase);
      setSceneIndex(0);
      setP2Task(1);
      setP2Finished(false);
      setHighlightedWords([]);
    });
  };

  const handleChoice = (choice: Choice, scene: Scene) => {
    if (selectedChoiceId) return;
    
    setSelectedChoiceId(choice.id);
    
    // Update score
    setScore(prev => ({
      ...prev,
      [scene.category]: (prev[scene.category] as number) + choice.points
    }));

    const meta = FEEDBACK_META[choice.rating];
    showChoiceFeedback(choice.id, choice.rating, `${meta.tone} ${choice.explanation}`);

    // Update children reactions
    setChildren(prev => prev.map(c => ({
      ...c,
      expression: choice.reactions[c.id.toLowerCase()] || 'neutral',
      isRaisingHand: choice.handsUp?.includes(c.id.toLowerCase()) || false
    })));
  };

  const nextScene = () => {
    const advance = () => {
      setSelectedChoiceId(null);
      clearChoiceFeedback();
      resetChildren();
      
      if (phase === 'phase1') {
        if (sceneIndex < PHASE1_SCENES.length - 1) {
          setSceneIndex(prev => prev + 1);
        } else {
          setPhase('phase2');
          setSceneIndex(0);
          setP2Task(1);
        }
      } else if (phase === 'phase2') {
        if (p2Task < 3) {
          setP2Task(prev => prev + 1);
          setP2Finished(false);
          setHighlightedWords([]);
        } else {
          setPhase('phase3');
          setSceneIndex(0);
        }
      } else if (phase === 'phase3') {
        if (sceneIndex < PHASE3_SCENES.length - 1) {
          setSceneIndex(prev => prev + 1);
        } else {
          setPhase('report');
        }
      }
    };

    if (phase === 'phase1' && sceneIndex === PHASE1_SCENES.length - 1) {
      playTransition(getPhaseIntro('phase2'), advance);
      return;
    }

    if (phase === 'phase2' && p2Task === 3) {
      playTransition(getPhaseIntro('phase3'), advance);
      return;
    }

    if (phase === 'phase3' && sceneIndex === PHASE3_SCENES.length - 1) {
      playTransition(getPhaseIntro('report'), advance);
      return;
    }

    advance();
  };

  const prevScene = () => {
    setSelectedChoiceId(null);
    clearChoiceFeedback();
    resetChildren();

    if (phase === 'phase1') {
      if (sceneIndex > 0) {
        setSceneIndex(prev => prev - 1);
      } else {
        setPhase('welcome');
      }
    } else if (phase === 'phase2') {
      if (p2Task > 1) {
        setP2Task(prev => prev - 1);
        setP2Finished(false);
        setHighlightedWords([]);
      } else {
        setPhase('phase1');
        setSceneIndex(PHASE1_SCENES.length - 1);
      }
    } else if (phase === 'phase3') {
      if (sceneIndex > 0) {
        setSceneIndex(prev => prev - 1);
      } else {
        setPhase('phase2');
        setP2Task(3);
      }
    }
  };

  // --- Phase 2 Logic ---
  const p2Sentence = "On Saturday, he ate through one piece of chocolate cake, one ice-cream cone, one pickle, one slice of Swiss cheese...".split(' ');
  const correctP2Words = [2, 3, 4, 5, 10, 13, 15]; // he, ate, through, one...

  const handleP2WordClick = (idx: number) => {
    if (p2Finished) return;
    setHighlightedWords(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const submitP2Task1 = () => {
    const correctCount = highlightedWords.filter(idx => correctP2Words.includes(idx)).length;
    const totalCorrect = correctP2Words.length;
    const ratio = correctCount / totalCorrect;
    
    let pts = 1;
    let type: FeedbackType = 'poor';
    if (ratio >= 0.7) { pts = 3; type = 'best'; }
    else if (ratio >= 0.4) { pts = 2; type = 'ok'; }

    setScore(prev => ({ ...prev, shared: prev.shared + pts }));
    setP2Finished(true);

    if (visualFeedbackTimer.current) clearTimeout(visualFeedbackTimer.current);
    setVisualFeedback(type);
    setChoiceFeedback(null);
    visualFeedbackTimer.current = setTimeout(() => setVisualFeedback(null), 2100);
  };

  const handleP2Choice = (choice: { text: string, pts: number, id: string, explanation: string }) => {
    if (selectedChoiceId) return;
    setSelectedChoiceId(choice.id);
    setScore(prev => ({ ...prev, shared: prev.shared + choice.pts }));
    setP2Finished(true);
    
    const type = getFeedbackTypeFromPoints(choice.pts);
    const meta = FEEDBACK_META[type];
    showChoiceFeedback(choice.id, type, `${meta.tone} ${choice.explanation}`);
  };

  // --- Render Helpers ---

  const renderWelcome = () => (
    <div className="h-screen flex flex-col items-center justify-center bg-[#FDFDF5] text-stone-800 p-4 text-center overflow-hidden relative">
      {/* Background Decorative Elements - More subtle and professional */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-[-15%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#E8F5E9] blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#006B2B]/5 blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#006B2B 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* The Book Component */}
        <div className="relative mb-8">
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotateZ: [-0.5, 0.5, -0.5],
              rotateY: [-3, 3, -3]
            }}
            whileHover={{ 
              scale: 1.05,
              rotateY: -15,
              rotateX: 5,
              transition: { duration: 0.4, ease: "easeOut" }
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="group w-40 h-56 bg-brand-red rounded-r-[2rem] rounded-l-md shadow-[20px_20px_40px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center cursor-pointer relative preserve-3d perspective-1000 z-20"
            onClick={() => startPhase('phase1')}
          >
            {/* Pages Layer (Behind) */}
            <div 
              className="absolute inset-0 bg-white rounded-r-[2rem] translate-x-1 translate-y-1 opacity-90" 
              style={{ transform: 'translateZ(-1px)' }}
            />
            
            {/* Book Spine Detail */}
            <div className="absolute left-0 top-0 bottom-0 w-5 bg-black/10 rounded-l-md border-r border-black/5 shadow-inner z-30" />
            
            {/* Cover Content */}
            <div className="relative z-40 flex flex-col items-center px-6 text-center">
              <motion.div 
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-6xl mb-6 filter drop-shadow-xl"
              >
                🐛
              </motion.div>
              <h3 className="font-sans text-lg leading-tight text-white font-extrabold tracking-tight drop-shadow-sm">
                The Very Hungry <br/> Caterpillar
              </h3>
            </div>

            {/* Hover Glow & Gloss */}
            <motion.div 
              initial={{ x: '-100%', opacity: 0 }}
              whileHover={{ x: '100%', opacity: 0.2 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 pointer-events-none z-50" 
            />
          </motion.div>

          {/* Dynamic Shadow */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.25, 0.15, 0.25]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-5 bg-black/20 rounded-[100%] blur-2xl -z-10"
          />
        </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-3 tracking-tighter text-brand-green font-display">
            Storybook <span className="text-stone-800">Classroom</span>
          </h1>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-6 bg-brand-green/30" />
            <h2 className="text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-[0.4em]">Interactive Teaching Simulation</h2>
            <div className="h-px w-6 bg-brand-green/30" />
          </div>
          
          <p className="max-w-lg text-base mb-8 text-stone-500 leading-relaxed mx-auto font-sans">
            Step into a virtual kindergarten and practice sharing literature with young children through immersive teaching simulations.
          </p>
          
          <motion.button
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "#005522",
              boxShadow: "0 10px 25px -5px rgba(0, 107, 43, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => startPhase('phase1')}
            className="bg-brand-green text-white px-10 py-4 rounded-full font-bold text-base shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto group"
          >
            Start Simulation
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>

      {/* Footer Info */}
      <div className="absolute bottom-6 left-0 w-full text-center text-[9px] text-stone-300 uppercase tracking-[0.3em] font-bold">
        Educational Excellence • Interactive Learning • Professional Development
      </div>
    </div>
  );

  const renderTopNav = () => (
    <nav className="h-14 bg-brand-cream/80 backdrop-blur-md z-40 flex items-center justify-between px-6 border-b border-stone-100 shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-brand-green tracking-tight">Storybook Classroom</span>
      </div>

      <div className="flex items-center gap-6">
        {[
          { id: 'phase1', label: 'INTERACTIVE READING' },
          { id: 'phase2', label: 'SHARED READING' },
          { id: 'phase3', label: 'STORYTELLING' },
          { id: 'report', label: 'REPORT' },
        ].map((step) => {
          const isActive = phase === step.id;
          return (
            <button
              key={step.id}
              onClick={() => {
                if (step.id === phase) return;
                if (step.id === 'report' && currentTotalScore < 5) return;
                startPhase(step.id as Phase);
              }}
              className={`text-[10px] font-bold tracking-[0.1em] transition-all relative py-1.5 ${
                isActive ? 'text-brand-green' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              {step.label}
              {isActive && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-green"
                />
              )}
            </button>
          );
        })}
      </div>
      
      <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-stone-100 shadow-sm">
        <Star className="text-brand-yellow fill-brand-yellow" size={12} />
        <span className="font-bold text-[10px] text-stone-600">{currentTotalScore} / 33</span>
      </div>
    </nav>
  );

  const renderChildren = () => (
    <div className="flex flex-col items-center pt-16 pb-4 relative">
      {/* Classroom Rug Area */}
      <div className="absolute inset-x-4 bottom-0 top-12 bg-stone-100/50 rounded-[3rem] -z-10 border border-stone-200/50 shadow-inner" />
      
      <div className="flex justify-center gap-6 px-8 relative">
        {/* Classroom Props */}
        <div className="absolute -left-4 bottom-2 text-xl opacity-20 grayscale">🧸</div>
        <div className="absolute -right-4 bottom-2 text-xl opacity-20 grayscale">📚</div>
        
        {children.map((child, idx) => (
          <ChildAvatar 
            key={child.id} 
            child={child} 
            index={idx}
            isActive={phase === 'phase1' ? sceneIndex % children.length === idx : false} 
          />
        ))}
      </div>
    </div>
  );

  const renderChoiceCards = (scene: Scene) => (
    <div className="flex flex-col gap-2.5 w-full">
      <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Select your technique:</h4>
      {shuffledChoices.map(choice => {
        const isSelected = selectedChoiceId === choice.id;
        const showResults = selectedChoiceId !== null;
        const isBest = choice.rating === 'best';
        const isGood = choice.rating === 'ok';
        const isBad = choice.rating === 'poor';
        
        return (
          <div key={choice.id} className="relative">
            <AnimatePresence>
              {choiceFeedback?.choiceId === choice.id && (
                <FeedbackSideCard feedback={choiceFeedback} onClose={() => setChoiceFeedback(null)} />
              )}
            </AnimatePresence>
          <motion.button
            disabled={showResults}
            whileHover={!showResults ? { x: 2 } : {}}
            onClick={() => handleChoice(choice, scene)}
            className={`w-full p-3.5 rounded-xl text-left transition-all relative flex items-center gap-3 border-2 ${
              showResults 
                ? isSelected 
                  ? isBest ? 'bg-brand-mint border-brand-green ring-2 ring-brand-green/20' : isGood ? 'bg-amber-50 border-brand-yellow ring-2 ring-brand-yellow/20' : 'bg-red-50 border-brand-red ring-2 ring-brand-red/20'
                  : isBest ? 'bg-white border-brand-green/20 opacity-80 border-dashed' : 'bg-stone-50 border-stone-100 opacity-50 grayscale-[0.5]'
                : 'bg-white border-transparent hover:border-brand-green/30 card-shadow'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0 border ${
              showResults && !isSelected && !isBest ? 'bg-stone-50 border-stone-100 opacity-40' : 'bg-stone-50 border-stone-100'
            }`}>
              {choice.rating === 'best' ? '🎭' : choice.rating === 'ok' ? '😐' : '📢'}
            </div>
            
            <div className="flex flex-col flex-grow">
              <div className="flex justify-between items-center gap-2">
                <p className={`font-bold text-xs ${showResults && !isSelected && !isBest ? 'text-stone-400' : 'text-stone-800'}`}>
                  {choice.text}
                </p>
                {showResults && isSelected && (
                  <div className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-white ${isBest ? 'bg-brand-green' : isGood ? 'bg-brand-yellow' : 'bg-brand-red'}`}>
                    {isBest ? <CheckCircle2 size={10} /> : isGood ? <Info size={10} /> : <RotateCcw size={10} className="rotate-45" />}
                  </div>
                )}
              </div>
              
              {showResults && (
                <div className="flex flex-col gap-1.5 mt-1.5">
                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        isBest ? 'bg-brand-green text-white' : isGood ? 'bg-brand-yellow text-stone-800' : 'bg-brand-red text-white'
                      }`}>
                        Your Choice
                      </span>
                    )}
                    {!isSelected && isBest && (
                      <span className="text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider bg-brand-green/10 text-brand-green border border-brand-green/20">
                        Best Choice
                      </span>
                    )}
                  </div>
                  <FeedbackReason rating={choice.rating} explanation={choice.explanation} muted={showResults && !isSelected && !isBest} />
                </div>
              )}
            </div>
          </motion.button>
          </div>
        );
      })}
    </div>
  );

  const renderPhase1 = () => {
    const scene = PHASE1_SCENES[sceneIndex];
    return (
      <div className="py-4 px-6 h-full">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start h-full">
          {/* Left Column: Book Preview (Main Content) */}
          <div className="flex flex-col gap-4 h-full">
            <div className="relative flex-1 min-h-[400px] max-h-[600px] w-full flex items-center justify-center p-4 overflow-hidden">
              {/* Book Spread Container */}
              <div className="relative w-full max-w-4xl aspect-[16/10] flex shadow-2xl rounded-lg overflow-hidden border-8 border-stone-800/10 bg-stone-100 ring-1 ring-black/5">
                {/* Left Page: Illustration */}
                <div className={`flex-1 flex items-center justify-center p-8 bg-gradient-to-br ${scene.bookBg} border-r border-stone-200/30 relative book-page-left`}>
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                  <motion.span 
                    key={scene.id + 'img'}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-8xl drop-shadow-2xl z-10"
                  >
                    {scene.bookImage}
                  </motion.span>
                </div>

                {/* Book Gutter/Spine */}
                <div className="absolute left-1/2 top-0 bottom-0 w-10 -ml-5 book-spine z-20 pointer-events-none" />

                {/* Right Page: Text */}
                <div className="flex-1 bg-white p-10 flex flex-col items-center justify-center text-center relative book-page-right">
                  <div className="absolute top-4 right-6 text-[8px] font-bold text-stone-300 uppercase tracking-widest">
                    PAGE {sceneIndex + 1}
                  </div>
                  
                  <div className="max-w-xs">
                    {scene.id === '1-1' && <p className="text-stone-800 text-2xl font-bold font-sans tracking-tight leading-tight">The Very Hungry Caterpillar</p>}
                    {scene.id === '1-2' && <p className="text-stone-700 text-xl font-serif leading-relaxed italic">"On Monday he ate through one apple. But he was still hungry."</p>}
                    {scene.id === '1-3' && <p className="text-stone-700 text-xl font-serif leading-relaxed italic">"On Tuesday he ate through two pears. But he was still hungry."</p>}
                    {scene.id === '1-4' && <p className="text-stone-700 text-lg font-serif leading-relaxed italic">"On Saturday he ate through one piece of chocolate cake, one ice-cream cone, one pickle, one slice of Swiss cheese..."</p>}
                    {scene.id === '1-5' && <p className="text-stone-700 text-xl font-serif leading-relaxed italic">"The caterpillar has turned into a beautiful butterfly!"</p>}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center gap-2 pb-2">
              {PHASE1_SCENES.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === sceneIndex ? 'w-8 bg-brand-green' : 'w-2 bg-stone-200'}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Instructions & Choices */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-4 bg-white/50 p-4 rounded-[2rem] border border-stone-100 shadow-sm relative"
          >
            <motion.div
              animate={{ 
                boxShadow: [
                  '0 4px 20px rgba(0,0,0,0.05)',
                  '0 8px 30px rgba(0,107,43,0.15)',
                  '0 4px 20px rgba(0,0,0,0.05)'
                ]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute inset-0 rounded-[2rem] pointer-events-none border-2 border-brand-green/20"
            />
            <div className="bg-white p-5 rounded-[1.5rem] card-shadow border border-stone-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-brand-mint flex items-center justify-center text-brand-green shrink-0">
                  <BookOpen size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-800 leading-tight">Interactive Reading</h3>
                  <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Phase 1: Dialogic Reading</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-brand-mint/30 p-4 rounded-2xl border border-brand-green/10 relative overflow-hidden group">
                  <div className="absolute -right-2 -top-2 text-brand-green/10 rotate-12 group-hover:scale-110 transition-transform duration-500">
                    <Target size={48} />
                  </div>
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                      <p className="text-[10px] font-black text-brand-green uppercase tracking-[0.2em]">Current Goal</p>
                    </div>
                    <p className="text-sm font-bold text-stone-800 leading-tight">{scene.instruction}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Choices moved here */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Select your response:</h4>
              <div className="flex flex-col gap-3">
                {shuffledChoices.map(choice => {
                  const isSelected = selectedChoiceId === choice.id;
                  const showResults = selectedChoiceId !== null;
                  const isBest = choice.rating === 'best';
                  const isGood = choice.rating === 'ok';
                  const isBad = choice.rating === 'poor';

                  return (
                    <div key={choice.id} className="relative">
                      <AnimatePresence>
                        {choiceFeedback?.choiceId === choice.id && (
                          <FeedbackSideCard feedback={choiceFeedback} onClose={() => setChoiceFeedback(null)} />
                        )}
                      </AnimatePresence>
                    <motion.button
                      disabled={showResults}
                      onClick={() => handleChoice(choice, scene)}
                      className={`w-full p-4 rounded-[1.5rem] text-left transition-all border-2 relative overflow-hidden ${
                        showResults 
                          ? isSelected 
                            ? isBest ? 'bg-brand-mint border-brand-green ring-2 ring-brand-green/20' : isGood ? 'bg-amber-50 border-brand-yellow ring-2 ring-brand-yellow/20' : 'bg-red-50 border-brand-red ring-2 ring-brand-red/20'
                            : isBest ? 'bg-white border-brand-green/20 opacity-80 border-dashed' : 'bg-stone-50 border-stone-100 opacity-50 grayscale-[0.5]'
                          : 'bg-white border-transparent hover:border-brand-green/30 card-shadow'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <p className={`text-xs font-bold leading-snug ${showResults && !isSelected && !isBest ? 'text-stone-400' : 'text-stone-800'}`}>{choice.text}</p>
                        {showResults && isSelected && (
                          <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white ${isBest ? 'bg-brand-green' : isGood ? 'bg-brand-yellow' : 'bg-brand-red'}`}>
                            {isBest ? <CheckCircle2 size={12} /> : isGood ? <Info size={12} /> : <RotateCcw size={12} className="rotate-45" />}
                          </div>
                        )}
                      </div>

                      {showResults && (
                        <div className="flex flex-col gap-2 mt-2">
                          <div className="flex items-center gap-2">
                            {isSelected && (
                              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                isBest ? 'bg-brand-green text-white' : isGood ? 'bg-brand-yellow text-stone-800' : 'bg-brand-red text-white'
                              }`}>
                                Your Choice
                              </span>
                            )}
                            {!isSelected && isBest && (
                              <span className="text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider bg-brand-green/10 text-brand-green border border-brand-green/20">
                                Best Choice
                              </span>
                            )}
                          </div>
                          <FeedbackReason rating={choice.rating} explanation={choice.explanation} muted={showResults && !isSelected && !isBest} />
                        </div>
                      )}
                    </motion.button>
                    </div>
                  );
                })}
              </div>
            </div>

            <AnimatePresence>
              {selectedChoiceId && (
                <div className="flex gap-3">
                  <button
                    onClick={prevScene}
                    className="flex-1 bg-stone-100 text-stone-600 py-3 rounded-full font-bold shadow-sm text-sm hover:bg-stone-200 transition-colors"
                  >
                    Previous
                  </button>
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={nextScene}
                    className="flex-[2] bg-brand-green text-white py-3 rounded-full font-bold shadow-md text-sm hover:bg-brand-green/90 transition-colors"
                  >
                    Next Scene
                  </motion.button>
                </div>
              )}
            </AnimatePresence>

            <div className="bg-[#FFF0F0] p-5 rounded-[1.5rem] border border-dashed border-brand-red/30">
              <h4 className="text-[9px] font-bold text-brand-red uppercase tracking-wider mb-1.5">TEACHER TIP</h4>
              <p className="text-[11px] text-brand-red/80 leading-relaxed italic">
                {scene.id === '1-1' && "Observe how children react to the cover. Encourage them to predict what happens next."}
                {scene.id === '1-2' && "Point to the apple as you read. Ask children if they like apples too."}
                {scene.id === '1-3' && "Count the pears together with the children to build numeracy skills."}
                {scene.id === '1-4' && "Emphasize the variety of foods. This is a great moment for vocabulary expansion."}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderPhase2 = () => {
    return (
      <div className="py-4 px-6 h-full">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start h-full">
          {/* Left Column: Main Content (Book Preview) */}
          <div className="flex flex-col gap-4 h-full">
            {/* Step Indicator moved to top */}
            <div className="flex justify-center gap-4 mb-1">
              {[
                { id: 1, label: 'Repetition' },
                { id: 2, label: 'Features' },
                { id: 3, label: 'Modeling' }
              ].map((step) => (
                <div key={step.id} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors ${p2Task >= step.id ? 'bg-brand-green border-brand-green text-white' : 'border-stone-200 text-stone-300'}`}>
                    {step.id}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${p2Task >= step.id ? 'text-stone-600' : 'text-stone-300'}`}>
                    {step.label}
                  </span>
                  {step.id < 3 && <div className="w-4 h-px bg-stone-100 ml-2" />}
                </div>
              ))}
            </div>

            <div className="relative flex-1 min-h-[400px] max-h-[600px] w-full flex items-center justify-center p-4 overflow-hidden">
              {/* Book Spread Container */}
              <div className="relative w-full max-w-4xl aspect-[16/10] flex shadow-2xl rounded-lg overflow-hidden border-8 border-stone-800/10 bg-stone-100 ring-1 ring-black/5">
                {/* Left Page: Illustration */}
                <div className="flex-1 flex items-center justify-center p-8 bg-[#7BA8B3] border-r border-stone-200/30 relative book-page-left">
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                  
                  {p2Task === 1 && (
                    <div className="text-7xl drop-shadow-xl z-10 select-none flex gap-2">
                      <span>🍰</span><span>🍦</span><span>🧀</span>
                    </div>
                  )}
                  
                  {p2Task === 2 && (
                    <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-white text-4xl z-10">
                      <Search size={40} />
                    </div>
                  )}
                  
                  {p2Task === 3 && (
                    <div className="w-full max-w-[320px] p-8 flex flex-col items-center justify-center overflow-hidden bg-white/10 rounded-2xl border border-white/20 z-10 relative">
                      <div className="relative w-full py-4">
                        <p className="text-white/60 text-sm font-serif italic text-center select-none">
                          "On Saturday, he ate through one piece of chocolate cake..."
                        </p>
                        <motion.div
                          animate={{ x: [-120, 120] }}
                          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                          className="text-4xl absolute top-10 left-1/2 -ml-6 drop-shadow-lg"
                        >
                          👉
                        </motion.div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Book Gutter/Spine */}
                <div className="absolute left-1/2 top-0 bottom-0 w-10 -ml-5 book-spine z-20 pointer-events-none" />

                {/* Right Page: Interactive Content */}
                <div className="flex-1 bg-white p-8 flex flex-col items-center justify-center text-center relative overflow-y-auto custom-scrollbar book-page-right">
                  <div className="absolute top-4 right-6 text-[8px] font-bold text-stone-300 uppercase tracking-widest">
                    TASK {p2Task}
                  </div>

                  {p2Task === 1 && (
                    <div className="w-full">
                      <div className="flex flex-wrap justify-center gap-x-2 gap-y-3 text-xl font-sans font-medium text-stone-800 leading-relaxed">
                        {p2Sentence.map((word, idx) => {
                          const isHighlighted = highlightedWords.includes(idx);
                          const isCorrect = correctP2Words.includes(idx);
                          const isIncorrectlySelected = isHighlighted && !isCorrect;
                          const isMissed = p2Finished && isCorrect && !isHighlighted;
                          
                          return (
                            <span
                              key={idx}
                              onClick={() => handleP2WordClick(idx)}
                              className={`cursor-pointer px-1.5 py-0.5 rounded-lg transition-all ${
                                p2Finished
                                  ? isHighlighted
                                    ? isCorrect
                                      ? 'bg-brand-green text-white shadow-sm scale-105' // Correctly selected
                                      : 'bg-brand-red text-white shadow-sm scale-105' // Incorrectly selected
                                    : isCorrect
                                      ? 'bg-brand-green/30 text-stone-800' // Missed correct word - lighter green
                                      : 'text-stone-400' // Not selected and not correct
                                  : isHighlighted
                                    ? 'bg-brand-yellow text-stone-800 shadow-sm scale-105' // Selected before submission
                                    : 'hover:bg-stone-100' // Not selected before submission
                              }`}
                            >
                              {word}
                            </span>
                          );
                        })}
                      </div>
                      {!p2Finished && highlightedWords.length > 0 && (
                        <button 
                          onClick={submitP2Task1}
                          className="mt-8 bg-brand-green text-white px-8 py-2 rounded-full font-bold shadow-lg hover:bg-opacity-90 text-xs transition-all"
                        >
                          Check Pattern
                        </button>
                      )}

                    </div>
                  )}

                  {p2Task === 2 && (
                    <div className="max-w-xs">
                      <h3 className="text-xl font-bold text-stone-800 mb-3">Analyze the Book Features</h3>
                      <p className="text-stone-500 text-sm leading-relaxed italic">
                        "Look at the layout, font size, and illustrations. What makes this book effective for a group?"
                      </p>
                    </div>
                  )}

                  {p2Task === 3 && (
                    <div className="max-w-xs">
                      <h3 className="text-xl font-bold text-stone-800 mb-3">Demonstrate Tracking Skills</h3>
                      <p className="text-stone-700 text-sm leading-relaxed italic mb-4">
                        "On Saturday, he ate through one piece of chocolate cake, one ice-cream cone, one pickle, one slice of Swiss cheese..."
                      </p>
                      <p className="text-stone-400 text-[10px] leading-relaxed italic">
                        How would you guide the children's eyes across the page to model correct reading direction?
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Instructions & Choices */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-4 bg-white/50 p-4 rounded-[2rem] border border-stone-100 shadow-sm relative"
          >
            <motion.div
              animate={{ 
                boxShadow: [
                  '0 4px 20px rgba(0,0,0,0.05)',
                  '0 8px 30px rgba(0,107,43,0.15)',
                  '0 4px 20px rgba(0,0,0,0.05)'
                ]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute inset-0 rounded-[2rem] pointer-events-none border-2 border-brand-green/20"
            />
            <div className="bg-white p-5 rounded-[1.5rem] card-shadow border border-stone-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-brand-mint flex items-center justify-center text-brand-green shrink-0">
                  <Library size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-800 leading-tight">Big Book Shared Reading</h3>
                  <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Phase 2: Shared Reading</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-brand-mint/30 p-4 rounded-2xl border border-brand-green/10 relative overflow-hidden group">
                  <div className="absolute -right-2 -top-2 text-brand-green/10 rotate-12 group-hover:scale-110 transition-transform duration-500">
                    <Target size={48} />
                  </div>
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                      <p className="text-[10px] font-black text-brand-green uppercase tracking-[0.2em]">Current Goal</p>
                    </div>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Task {p2Task}: {p2Task === 1 ? 'Word Repetition' : p2Task === 2 ? 'Book Features' : 'Modeling Skills'}</p>
                    <p className="text-sm font-bold text-stone-800 leading-tight">
                      {p2Task === 1 && "Listen to the rhythm. Click the words that repeat to build print awareness."}
                      {p2Task === 2 && "Identify the features that make this book ideal for shared reading experiences."}
                      {p2Task === 3 && "Model left-to-right directionality and tracking as you read aloud."}
                    </p>
                  </div>
                </div>
                
                {p2Task === 1 && (
                  <div className="pt-3 border-t border-stone-100">
                    <div className="flex justify-between text-[9px] font-bold text-stone-400 mb-1">
                      <span>REPETITION FOUND</span>
                      <span>{highlightedWords.filter(idx => correctP2Words.includes(idx)).length} / {correctP2Words.length}</span>
                    </div>
                    <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
                      <motion.div 
                        animate={{ width: `${(highlightedWords.filter(idx => correctP2Words.includes(idx)).length / correctP2Words.length) * 100}%` }}
                        className="h-full bg-brand-green" 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Choices for Task 2 & 3 moved here */}
            {p2Task !== 1 && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Select your response:</h4>
                <div className="flex flex-col gap-3">
                  {shuffledChoices.map((opt) => {
                    const isSelected = selectedChoiceId === opt.id;
                    const showResults = p2Finished;
                    const isBest = opt.pts > 0;
                    const feedbackType = getFeedbackTypeFromPoints(opt.pts);

                    return (
                      <div key={opt.id} className="relative">
                        <AnimatePresence>
                          {choiceFeedback?.choiceId === opt.id && (
                            <FeedbackSideCard feedback={choiceFeedback} onClose={() => setChoiceFeedback(null)} />
                          )}
                        </AnimatePresence>
                      <button
                        disabled={showResults}
                        onClick={() => handleP2Choice(opt)}
                        className={`w-full p-4 rounded-xl border-2 text-left font-bold transition-all text-xs relative overflow-hidden ${
                          showResults 
                            ? isSelected 
                              ? isBest ? 'bg-brand-mint border-brand-green ring-2 ring-brand-green/20' : 'bg-red-50 border-brand-red ring-2 ring-brand-red/20'
                              : isBest ? 'bg-white border-brand-green/20 opacity-80 border-dashed' : 'bg-stone-50 border-stone-100 opacity-50 grayscale-[0.5]'
                            : 'bg-white border-transparent hover:border-brand-green/30 card-shadow'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <p className={`leading-snug ${showResults && !isSelected && !isBest ? 'text-stone-400' : 'text-stone-800'}`}>{opt.text}</p>
                          {showResults && isSelected && (
                            <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white ${isBest ? 'bg-brand-green' : 'bg-brand-red'}`}>
                              {isBest ? <CheckCircle2 size={12} /> : <RotateCcw size={12} className="rotate-45" />}
                            </div>
                          )}
                        </div>

                        {showResults && (
                          <div className="flex flex-col gap-2 mt-2">
                            <div className="flex items-center gap-2">
                              {isSelected && (
                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                  isBest ? 'bg-brand-green text-white' : 'bg-brand-red text-white'
                                }`}>
                                  Your Choice
                                </span>
                              )}
                              {!isSelected && isBest && (
                                <span className="text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider bg-brand-green/10 text-brand-green border border-brand-green/20">
                                  Best Choice
                                </span>
                              )}
                            </div>
                            <FeedbackReason rating={feedbackType} explanation={opt.explanation} muted={showResults && !isSelected && !isBest} />
                          </div>
                        )}
                      </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <AnimatePresence>
              {p2Finished && (
                <div className="flex gap-3">
                  <button
                    onClick={prevScene}
                    className="flex-1 bg-stone-100 text-stone-600 py-3 rounded-full font-bold shadow-sm text-sm hover:bg-stone-200 transition-colors"
                  >
                    Previous
                  </button>
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={nextScene}
                    className="flex-[2] bg-brand-green text-white py-3 rounded-full font-bold shadow-md text-sm hover:bg-brand-green/90 transition-colors"
                  >
                    Next Task
                  </motion.button>
                </div>
              )}
            </AnimatePresence>

            <div className="bg-[#FFF0F0] p-5 rounded-[1.5rem] border border-dashed border-brand-red/30">
              <h4 className="text-[9px] font-bold text-brand-red uppercase tracking-wider mb-1.5">TEACHER TIP</h4>
              <p className="text-[11px] text-brand-red/80 leading-relaxed italic">
                {p2Task === 1 && "Emphasize the word 'one' as you point. Notice how students react to the pattern."}
                {p2Task === 2 && "Repetition and predictable structures help children feel successful as readers."}
                {p2Task === 3 && "Use your finger or a pointer to show how we read from left to right."}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderPhase3 = () => {
    const scene = PHASE3_SCENES[sceneIndex];
    const selectedChoice = scene.choices.find(c => c.id === selectedChoiceId);
    const analysisData = selectedChoice?.analysis || { intonation: 0, pitch: 0, volume: 0 };

    const getSceneTitle = () => {
      if (scene.id === '3-1') return 'Vocal Performance';
      if (scene.id === '3-2') return 'Body Language';
      if (scene.id === '3-3') return 'Visual Aids';
      return 'Storytelling';
    };

    const getPerformanceTip = () => {
      if (scene.id === '3-1') {
        return '"Vary your pitch and pace to keep children engaged. Use pauses for dramatic effect before turning the page."';
      } else if (scene.id === '3-2') {
        return '"Use large, exaggerated gestures to help children understand the story. Lean forward to create excitement."';
      } else if (scene.id === '3-3') {
        return '"Choose visual aids that children can touch and interact with. This helps build connections to the story."';
      }
      return '';
    };

    const renderVisualization = () => {
      if (scene.id === '3-1') {
        // Vocal Skills Scene
        return (
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.4em] flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              VOCAL PERFORMANCE ANALYSIS
            </h4>
            
            <div className="max-w-md mx-auto space-y-6">
              {[
                { label: 'INTONATION', value: analysisData.intonation, color: 'bg-brand-green', desc: analysisData.intonation > 80 ? 'Excellent dynamic range' : analysisData.intonation > 50 ? 'Good variation' : 'Needs more energy' },
                { label: 'PITCH RANGE', value: analysisData.pitch, color: 'bg-brand-green', desc: analysisData.pitch > 80 ? 'Great character differentiation' : analysisData.pitch > 50 ? 'Clear voice' : 'A bit monotone' },
                { label: 'VOLUME CONTROL', value: analysisData.volume, color: 'bg-brand-yellow', desc: analysisData.volume > 80 ? 'Perfect for group setting' : analysisData.volume > 50 ? 'Audible and clear' : 'Too quiet' },
              ].map((skill) => (
                <div key={skill.label} className="relative">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-[10px] font-bold text-stone-600 tracking-wider block uppercase">{skill.label}</span>
                      <span className="text-[9px] text-stone-400 italic">{skill.desc}</span>
                    </div>
                    <span className="font-mono text-lg font-bold text-stone-800">{skill.value}%</span>
                  </div>
                  <div className="h-3 bg-white/60 rounded-full overflow-hidden border border-white/40 shadow-inner p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.value}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full rounded-full ${skill.color} shadow-sm`} 
                    />
                  </div>
                </div>
              ))}
            </div>

            {!selectedChoiceId && (
              <div className="mt-8 text-center">
                <p className="text-stone-400 text-xs italic">Select a storytelling strategy to see the vocal analysis.</p>
              </div>
            )}
          </div>
        );
      } else if (scene.id === '3-2') {
        // Body Language Scene
        return (
          <div className="text-center space-y-6">
            <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.4em] flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              BODY LANGUAGE VISUALIZATION
            </h4>
            
            <div className="max-w-md mx-auto">
              <div className="bg-white/80 rounded-2xl p-6 border border-white/40 shadow-sm">
                <div className="text-6xl mb-6">
                  🙌
                </div>
                <p className="text-stone-600 text-sm leading-relaxed mb-4">
                  Body language is crucial for engaging young learners. Use expressive gestures and facial expressions to bring the story to life.
                </p>
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="bg-stone-50 p-3 rounded-xl text-center">
                    <div className="text-2xl mb-2">👆</div>
                    <p className="text-[10px] font-bold text-stone-600">Gestures</p>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl text-center">
                    <div className="text-2xl mb-2">😊</div>
                    <p className="text-[10px] font-bold text-stone-600">Facial Expressions</p>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl text-center">
                    <div className="text-2xl mb-2">🧍</div>
                    <p className="text-[10px] font-bold text-stone-600">Body Posture</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else if (scene.id === '3-3') {
        // Visual Aids Scene
        return (
          <div className="text-center space-y-6">
            <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.4em] flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              VISUAL AIDS SHOWCASE
            </h4>
            
            <div className="max-w-md mx-auto">
              <div className="bg-white/80 rounded-2xl p-6 border border-white/40 shadow-sm">
                <div className="flex justify-center gap-4 mb-6">
                  <div className="text-3xl">🍎</div>
                  <div className="text-3xl">🍐</div>
                  <div className="text-3xl">🍰</div>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed mb-4">
                  Visual aids help young children understand and engage with the story. Choose aids that are interactive and age-appropriate.
                </p>
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="bg-stone-50 p-3 rounded-xl text-center">
                    <div className="text-2xl mb-2">🎨</div>
                    <p className="text-[10px] font-bold text-stone-600">Props</p>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl text-center">
                    <div className="text-2xl mb-2">📸</div>
                    <p className="text-[10px] font-bold text-stone-600">Flashcards</p>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl text-center">
                    <div className="text-2xl mb-2">🖥️</div>
                    <p className="text-[10px] font-bold text-stone-600">Digital</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    };

    return (
      <div className="py-4 px-6 h-full">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start h-full">
          {/* Left Column: Main Content: Teacher + Visualization */}
          <div className="space-y-6 flex-1">
            {/* Teacher and Sentence */}
            <div className="bg-white p-6 rounded-[2.5rem] card-shadow border border-stone-100">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-brand-red flex items-center justify-center text-2xl shadow-sm border-2 border-white shrink-0 mt-1">
                  🧑‍🏫
                </div>
                <div className="relative bg-stone-50 p-5 rounded-2xl border border-stone-100 flex-grow">
                  <div className="absolute -left-2 top-6 w-2 h-2 bg-stone-50 rotate-45 border-l border-b border-stone-100" />
                  <p className="text-[16px] font-serif italic text-stone-700 leading-relaxed">
                    {scene.id === '3-1' && "'Let me tell you the story of a very... hungry... caterpillar...'"}
                    {scene.id === '3-2' && "'The caterpillar ate and ate and ATE!'"}
                    {scene.id === '3-3' && "'He ate through one apple, two pears, three plums...'"}
                  </p>
                </div>
              </div>
            </div>

            {/* Visualization Pad */}
            <div className="bg-[#E8EAE0] p-8 rounded-[2.5rem] card-shadow relative overflow-hidden min-h-[400px] flex flex-col justify-center w-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-green/5 rounded-full -ml-32 -mb-32 blur-3xl" />
              
              <div className="relative z-10">
                {renderVisualization()}
              </div>
            </div>
          </div>

          {/* Right Column: Instructions & Choices */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-4 bg-white/50 p-4 rounded-[2rem] border border-stone-100 shadow-sm relative"
          >
            <motion.div
              animate={{ 
                boxShadow: [
                  '0 4px 20px rgba(0,0,0,0.05)',
                  '0 8px 30px rgba(0,107,43,0.15)',
                  '0 4px 20px rgba(0,0,0,0.05)'
                ]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute inset-0 rounded-[2rem] pointer-events-none border-2 border-brand-green/20"
            />
            <div className="bg-white p-5 rounded-[1.5rem] card-shadow border border-stone-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-mint flex items-center justify-center text-brand-green shrink-0">
                  <Theater size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-800 leading-tight">{getSceneTitle()}</h3>
                  <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Phase 3: Storytelling</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="bg-brand-mint/30 p-4 rounded-2xl border border-brand-green/10 relative overflow-hidden group">
                  <div className="absolute -right-2 -top-2 text-brand-green/10 rotate-12 group-hover:scale-110 transition-transform duration-500">
                    <Target size={48} />
                  </div>
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                      <p className="text-[10px] font-black text-brand-green uppercase tracking-[0.2em]">Current Goal</p>
                    </div>
                    <p className="text-sm font-bold text-stone-800 leading-tight">{scene.instruction}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {renderChoiceCards(scene)}
                
                <AnimatePresence>
                  {selectedChoiceId && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={nextScene}
                      className="w-full bg-brand-green text-white py-3 rounded-full font-bold shadow-md text-sm hover:bg-brand-green/90 transition-colors flex items-center justify-center gap-2"
                    >
                      Next Technique <ChevronRight size={16} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="bg-brand-mint/30 p-4 rounded-[1.5rem] border border-brand-green/20">
              <h4 className="text-[9px] font-bold text-brand-green uppercase tracking-wider mb-1.5">PERFORMANCE TIP</h4>
              <p className="text-[11px] text-brand-green/80 leading-relaxed italic">
                {getPerformanceTip()}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderReport = () => {
    const totalScoreNum = Number(currentTotalScore);
    const percentage = Math.round((totalScoreNum / 33) * 100);
    let rating = 'Explorer';
    let badgeColor = 'from-blue-500 to-sky-600';
    let emoji = '🌱';
    
    if (percentage >= 85) {
      rating = 'Master';
      badgeColor = 'from-brand-green to-emerald-700';
      emoji = '🏆';
    } else if (percentage >= 60) {
      rating = 'Guide';
      badgeColor = 'from-brand-green to-emerald-600';
      emoji = '🌟';
    }

    const categories = [
      { name: 'Interactive Reading (Before)', score: score.before, max: 3 },
      { name: 'Interactive Reading (During)', score: score.during, max: 9 },
      { name: 'Interactive Reading (After)', score: score.after, max: 3 },
      { name: 'Shared Reading', score: score.shared, max: 9 },
      { name: 'Storytelling', score: score.storytelling, max: 9 },
    ];

    return (
      <div className="py-4 px-6 bg-brand-cream/30 h-full overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] shadow-[0_20px_80px_rgba(0,0,0,0.1)] overflow-hidden border border-stone-100 relative"
          >
            {/* Certificate Border Decor */}
            <div className="absolute inset-3 border-2 border-stone-50 rounded-[1.5rem] pointer-events-none" />
            
            <div className={`p-8 text-center text-white bg-gradient-to-br ${badgeColor} relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              <div className="absolute -right-20 -top-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-black/10 rounded-full blur-3xl" />
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 relative z-10">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-4xl border-2 border-white/40 shadow-xl"
                >
                  {emoji}
                </motion.div>
                
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold tracking-tight font-display">Teaching {rating}</h2>
                  <div className="flex items-center justify-center md:justify-start gap-3 opacity-80">
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em]">Professional Performance Report</p>
                  </div>
                </div>

                <div className="hidden md:block w-px h-12 bg-white/20 mx-4" />

                <div className="flex gap-10">
                  <div className="text-center">
                    <span className="block text-4xl font-bold">{currentTotalScore}</span>
                    <span className="text-[8px] uppercase font-bold opacity-70 tracking-[0.2em]">Total Points</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-4xl font-bold">{percentage}%</span>
                    <span className="text-[8px] uppercase font-bold opacity-70 tracking-[0.2em]">Mastery</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-brand-green/5 rounded-[2rem] blur-2xl group-hover:bg-brand-green/10 transition-colors duration-500" />
                  <div className="relative bg-white p-4 rounded-[2rem] border border-stone-100 shadow-sm flex justify-center">
                    <RadarChart scores={score} />
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.2em]">Competency Radar</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="h-px flex-grow bg-stone-100" />
                    <h3 className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.3em] whitespace-nowrap">Category Breakdown</h3>
                    <div className="h-px flex-grow bg-stone-100" />
                  </div>
                  
                  {categories.map((cat, i) => {
                    const catPerc = (cat.score / cat.max) * 100;
                    const color = catPerc >= 80 ? 'bg-brand-green' : catPerc >= 50 ? 'bg-brand-yellow' : 'bg-brand-red';
                    return (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">{cat.name}</span>
                          <span className="text-[10px] font-mono font-bold text-stone-400">{cat.score} / {cat.max}</span>
                        </div>
                        <div className="h-1.5 bg-stone-50 rounded-full overflow-hidden border border-stone-100">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${catPerc}%` }}
                            transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                            className={`h-full rounded-full ${color}`} 
                          />
                        </div>
                      </div>
                    );
                  })}

                  <div className="pt-4 flex justify-center">
                    <button 
                      onClick={() => window.location.reload()}
                      className="bg-stone-800 text-white px-8 py-2.5 rounded-full font-bold text-xs shadow-lg hover:bg-stone-700 transition-all flex items-center gap-2"
                    >
                      Restart Simulation <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="mt-6 text-center text-[9px] text-stone-400 font-bold uppercase tracking-[0.4em]">
            Storybook Classroom Certification • 2026
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col font-sans overflow-hidden bg-stone-50">
      {!imagesLoaded && (
        <div className="fixed inset-0 z-[1000] bg-stone-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
            <p className="text-stone-500 text-sm font-medium">Loading...</p>
          </motion.div>
        </div>
      )}
      <AnimatePresence>
        {visualFeedback && (
          <motion.div key={`visual-${visualFeedback}`}>
            <FeedbackVisual type={visualFeedback} />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {transitionCard && <TransitionOverlay card={transitionCard} onContinue={continueTransition} />}
      </AnimatePresence>

      {phase === 'welcome' ? renderWelcome() : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {renderTopNav()}
          <main className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={phase + sceneIndex + p2Task}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full overflow-y-auto custom-scrollbar"
              >
                {phase === 'phase1' && renderPhase1()}
                {phase === 'phase2' && renderPhase2()}
                {phase === 'phase3' && renderPhase3()}
                {phase === 'report' && renderReport()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      )}
    </div>
  );
}
