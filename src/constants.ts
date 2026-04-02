import { Child, Scene } from './types';

export const CHILDREN_DATA: Child[] = [
  { id: 'amy', name: 'Amy', color: '#FFB74D', expression: 'neutral', isRaisingHand: false, skinTone: '#FFDBAC', hairStyle: 'pigtails' },
  { id: 'ben', name: 'Ben', color: '#64B5F6', expression: 'neutral', isRaisingHand: false, skinTone: '#D2B48C', hairStyle: 'spiky' },
  { id: 'cathy', name: 'Cathy', color: '#81C784', expression: 'neutral', isRaisingHand: false, skinTone: '#FFDBAC', hairStyle: 'bob' },
  { id: 'david', name: 'David', color: '#BA68C8', expression: 'neutral', isRaisingHand: false, skinTone: '#8D5524', hairStyle: 'curly' },
  { id: 'emma', name: 'Emma', color: '#F06292', expression: 'neutral', isRaisingHand: false, skinTone: '#FFDBAC', hairStyle: 'short' },
];

export const PHASE1_SCENES: Scene[] = [
  {
    id: '1-1',
    phase: 1,
    title: 'Before Reading',
    instruction: 'How will you introduce this book to create interest?',
    bookImage: '🐛',
    bookBg: 'from-green-500 to-green-700',
    category: 'before',
    choices: [
      {
        id: '1-1-a',
        icon: '🔮',
        text: '"Look at the cover! What do you think this caterpillar likes to eat?"',
        explanation: 'Prediction questions create curiosity and activate prior knowledge.',
        rating: 'best',
        points: 3,
        reactions: { amy: 'excited', ben: 'happy', cathy: 'excited', david: 'happy', emma: 'excited' },
        handsUp: ['amy', 'cathy', 'emma']
      },
      {
        id: '1-1-b',
        icon: '📋',
        text: '"Today we\'re going to read about a caterpillar."',
        explanation: 'Simple statement, doesn\'t invite thinking.',
        rating: 'ok',
        points: 1,
        reactions: { amy: 'neutral', ben: 'happy', cathy: 'neutral', david: 'happy', emma: 'neutral' }
      },
      {
        id: '1-1-c',
        icon: '📄',
        text: '"Open your books to page 1."',
        explanation: 'No engagement strategy at all.',
        rating: 'poor',
        points: 0,
        reactions: { amy: 'confused', ben: 'bored', cathy: 'confused', david: 'bored', emma: 'confused' }
      }
    ]
  },
  {
    id: '1-2',
    phase: 1,
    title: 'During Reading — Page 1',
    instruction: 'What will you say to keep children engaged?',
    bookImage: '🍎',
    bookBg: 'from-red-400 to-red-600',
    category: 'during',
    choices: [
      {
        id: '1-2-a',
        icon: '🔮',
        text: '"What do you think he\'ll eat tomorrow?"',
        explanation: 'Prediction keeps children thinking ahead.',
        rating: 'best',
        points: 3,
        reactions: { amy: 'thinking', ben: 'thinking', cathy: 'excited', david: 'thinking', emma: 'excited' },
        handsUp: ['cathy', 'emma']
      },
      {
        id: '1-2-b',
        icon: '🔄',
        text: '"What did he eat?"',
        explanation: 'Recall only checks memory.',
        rating: 'ok',
        points: 1,
        reactions: { amy: 'neutral', ben: 'neutral', cathy: 'happy', david: 'neutral', emma: 'happy' }
      },
      {
        id: '1-2-c',
        icon: '💬',
        text: '"Apples are fruits."',
        explanation: 'Statement, not a question.',
        rating: 'poor',
        points: 0,
        reactions: { amy: 'bored', ben: 'bored', cathy: 'neutral', david: 'bored', emma: 'neutral' }
      }
    ]
  },
  {
    id: '1-3',
    phase: 1,
    title: 'During Reading — Page 2',
    instruction: 'How will you encourage participation?',
    bookImage: '🍐🍐',
    bookBg: 'from-green-300 to-green-500',
    category: 'during',
    choices: [
      {
        id: '1-3-a',
        icon: '🔢',
        text: '"Can you count with me? One... two pears!"',
        explanation: 'Participation prompts maintain attention.',
        rating: 'best',
        points: 3,
        reactions: { amy: 'laughing', ben: 'happy', cathy: 'laughing', david: 'happy', emma: 'laughing' },
        handsUp: ['amy', 'ben', 'cathy', 'david', 'emma']
      },
      {
        id: '1-3-b',
        icon: '🎨',
        text: '"What colour are pears?"',
        explanation: 'Relevant but off-topic from story flow.',
        rating: 'ok',
        points: 1,
        reactions: { amy: 'happy', ben: 'neutral', cathy: 'happy', david: 'neutral', emma: 'happy' }
      },
      {
        id: '1-3-c',
        icon: '⏩',
        text: '(Skip to next page without interaction)',
        explanation: 'Missed opportunity for scaffolding.',
        rating: 'poor',
        points: 0,
        reactions: { amy: 'sad', ben: 'bored', cathy: 'sad', david: 'bored', emma: 'sad' }
      }
    ]
  },
  {
    id: '1-4',
    phase: 1,
    title: 'During Reading — Page 3',
    instruction: 'The caterpillar has eaten too much! What do you ask?',
    bookImage: '🍰🧀',
    bookBg: 'from-orange-400 to-orange-600',
    category: 'during',
    choices: [
      {
        id: '1-4-a',
        icon: '🤢',
        text: '"Oh no! Do you think he\'ll get a tummy ache?"',
        explanation: 'Prediction based on personal experience.',
        rating: 'best',
        points: 3,
        reactions: { amy: 'thinking', ben: 'thinking', cathy: 'thinking', david: 'thinking', emma: 'thinking' },
        handsUp: ['ben', 'david']
      },
      {
        id: '1-4-b',
        icon: '📝',
        text: '"Can you name all the foods?"',
        explanation: 'Too demanding for 4–5 year olds.',
        rating: 'ok',
        points: 1,
        reactions: { amy: 'happy', ben: 'happy', cathy: 'happy', david: 'happy', emma: 'happy' }
      },
      {
        id: '1-4-c',
        icon: '💬',
        text: '"That\'s a lot of food."',
        explanation: 'Statement with no invitation to respond.',
        rating: 'poor',
        points: 0,
        reactions: { amy: 'confused', ben: 'neutral', cathy: 'confused', david: 'neutral', emma: 'confused' }
      }
    ]
  },
  {
    id: '1-5',
    phase: 1,
    title: 'After Reading',
    instruction: 'The story is done. What discussion activity will you choose?',
    bookImage: '🦋',
    bookBg: 'from-purple-400 to-purple-600',
    category: 'after',
    choices: [
      {
        id: '1-5-a',
        icon: '👫',
        text: '"What was your favourite food the caterpillar ate? Tell your friend!"',
        explanation: 'Peer discussion is age-appropriate.',
        rating: 'best',
        points: 3,
        reactions: { amy: 'excited', ben: 'excited', cathy: 'excited', david: 'excited', emma: 'excited' },
        handsUp: ['amy', 'ben', 'cathy', 'david', 'emma']
      },
      {
        id: '1-5-b',
        icon: '🔄',
        text: '"Can anyone retell the whole story?"',
        explanation: 'Too challenging for most 4-year-olds.',
        rating: 'ok',
        points: 1,
        reactions: { amy: 'happy', ben: 'happy', cathy: 'happy', david: 'happy', emma: 'happy' }
      },
      {
        id: '1-5-c',
        icon: '➡️',
        text: '"Let\'s move to the next activity."',
        explanation: 'Skipping after-reading wastes opportunity.',
        rating: 'poor',
        points: 0,
        reactions: { amy: 'sad', ben: 'sad', cathy: 'sad', david: 'sad', emma: 'sad' }
      }
    ]
  }
];

export const PHASE2_SCENES: any[] = [
  {
    id: '2-1',
    phase: 2,
    title: 'Highlight Repetition Words',
    instruction: 'Click on words that show a repetition pattern',
    sentence: 'On Saturday he ate through one piece of chocolate cake, one ice-cream cone, one pickle, one slice of Swiss cheese...',
    correctWords: [2, 3, 4, 5, 10, 13, 15],
    category: 'shared'
  },
  {
    id: '2-2',
    phase: 2,
    title: 'Identify Book Features',
    instruction: 'What feature makes this book ideal for Shared Reading?',
    category: 'shared',
    choices: [
      {
        id: 'p2-2-1',
        text: 'Predictable structure',
        explanation: 'Best! Repetition and predictable structures help children feel successful as readers.',
        rating: 'best',
        points: 3
      },
      {
        id: 'p2-2-2',
        text: 'Repetition',
        explanation: 'Best! Repetition and predictable structures help children feel successful as readers.',
        rating: 'best',
        points: 3
      },
      {
        id: 'p2-2-3',
        text: 'Long complex sentences',
        explanation: 'Not recommended. Long sentences are harder for young children to track and repeat.',
        rating: 'poor',
        points: 0
      }
    ]
  },
  {
    id: '2-3',
    phase: 2,
    title: 'Left-to-Right Directionality',
    instruction: 'What reading skill are you modeling?',
    category: 'shared',
    choices: [
      {
        id: 'p2-3-1',
        text: 'Left-to-right directionality',
        explanation: 'Best! Modeling tracking is a key goal of shared reading.',
        rating: 'best',
        points: 3
      },
      {
        id: 'p2-3-2',
        text: 'Phonics',
        explanation: 'Not the primary goal here. Shared reading focuses more on print awareness and tracking.',
        rating: 'poor',
        points: 0
      },
      {
        id: 'p2-3-3',
        text: 'Vocabulary',
        explanation: 'Important, but modeling directionality is the specific task for this page.',
        rating: 'poor',
        points: 0
      }
    ]
  }
];

export const PHASE3_SCENES: Scene[] = [
  {
    id: '3-1',
    phase: 3,
    title: 'Vocal Skills',
    instruction: 'Use your voice to set the mood. How will you start?',
    category: 'storytelling',
    choices: [
      {
        id: '3-1-a',
        icon: '🎭',
        text: 'Slow, mysterious whisper that builds to excitement',
        explanation: 'Best! Captures attention through vocal dynamics.',
        rating: 'best',
        points: 3,
        reactions: { amy: 'excited', ben: 'excited', cathy: 'happy', david: 'excited', emma: 'excited' },
        analysis: { intonation: 95, pitch: 90, volume: 85 }
      },
      {
        id: '3-1-b',
        icon: '😐',
        text: 'Steady, even-paced reading voice',
        explanation: 'Poor. Lacks engagement for storytelling.',
        rating: 'poor',
        points: 0,
        reactions: { amy: 'happy', ben: 'confused', cathy: 'happy', david: 'happy', emma: 'confused' },
        analysis: { intonation: 20, pitch: 20, volume: 30 }
      },
      {
        id: '3-1-c',
        icon: '📢',
        text: 'Very loud and fast throughout',
        explanation: 'OK, but lacks variation.',
        rating: 'ok',
        points: 1,
        reactions: { amy: 'bored', ben: 'bored', cathy: 'happy', david: 'bored', emma: 'bored' },
        analysis: { intonation: 40, pitch: 50, volume: 90 }
      }
    ]
  },
  {
    id: '3-2',
    phase: 3,
    title: 'Body Language',
    instruction: 'How will you show the caterpillar eating?',
    category: 'storytelling',
    choices: [
      {
        id: '3-2-a',
        icon: '🙌',
        text: 'Growing hand gestures — small then BIG! Lean forward',
        explanation: 'Best! Visual cues enhance comprehension.',
        rating: 'best',
        points: 3,
        reactions: { amy: 'laughing', ben: 'excited', cathy: 'laughing', david: 'excited', emma: 'laughing' },
        handsUp: ['amy', 'cathy', 'emma']
      },
      {
        id: '3-2-b',
        icon: '🧍',
        text: 'Stand still, hands at sides',
        explanation: 'Poor. No visual engagement.',
        rating: 'poor',
        points: 0,
        reactions: { amy: 'happy', ben: 'happy', cathy: 'happy', david: 'happy', emma: 'happy' }
      },
      {
        id: '3-2-c',
        icon: '😮',
        text: 'Facial expressions only',
        explanation: 'OK, but limited engagement.',
        rating: 'ok',
        points: 1,
        reactions: { amy: 'bored', ben: 'bored', cathy: 'bored', david: 'confused', emma: 'bored' }
      }
    ]
  },
  {
    id: '3-3',
    phase: 3,
    title: 'Visual Aids',
    instruction: 'How will you support the story visually?',
    category: 'storytelling',
    choices: [
      {
        id: '3-3-a',
        icon: '🍎',
        text: 'Real fruit props/flashcards children can touch',
        explanation: 'Best! Concrete objects are highly engaging for 4-5 year olds.',
        rating: 'best',
        points: 3,
        reactions: { amy: 'excited', ben: 'laughing', cathy: 'excited', david: 'excited', emma: 'laughing' },
        handsUp: ['amy', 'ben', 'cathy', 'david', 'emma']
      },
      {
        id: '3-3-b',
        icon: '💻',
        text: 'PowerPoint slideshow',
        explanation: 'OK, but less interactive than props.',
        rating: 'ok',
        points: 1,
        reactions: { amy: 'happy', ben: 'happy', cathy: 'happy', david: 'happy', emma: 'happy' },
        handsUp: ['david']
      },
      {
        id: '3-3-c',
        icon: '🚫',
        text: 'No visual aids',
        explanation: 'Poor. Young children need visual support for L2 stories.',
        rating: 'poor',
        points: 0,
        reactions: { amy: 'bored', ben: 'happy', cathy: 'bored', david: 'happy', emma: 'bored' }
      }
    ]
  }
];
