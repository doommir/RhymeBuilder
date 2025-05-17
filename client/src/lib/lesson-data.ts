// Define different types of microlearning exercises
type ExerciseType = 
  | 'multiple-choice' 
  | 'fill-blank'
  | 'matching'
  | 'tap-word'
  | 'flashcard'
  | 'info_card'
  | 'rhyme_match';

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface BaseExercise {
  id: string;
  type: ExerciseType;
  question: string;
  explanation?: string;
  xpReward: number;
}

interface MultipleChoiceExercise extends BaseExercise {
  type: 'multiple-choice';
  options: Option[];
}

interface FillBlankExercise extends BaseExercise {
  type: 'fill-blank';
  sentence: string;
  blankIndex: number;
  options: Option[];
}

interface MatchingExercise extends BaseExercise {
  type: 'matching';
  pairs: Array<{
    id: string;
    left: string;
    right: string;
  }>;
}

interface RhymeMatchExercise extends BaseExercise {
  type: 'rhyme_match';
  pairs: Array<{
    id: string;
    left: string;
    right: string;
  }>;
}

interface TapWordExercise extends BaseExercise {
  type: 'tap-word';
  correctSequence: string[];
  wordOptions: string[];
}

interface FlashcardExercise extends BaseExercise {
  type: 'flashcard';
  term: string;
  definition: string;
}

interface InfoCardExercise extends BaseExercise {
  type: 'info_card';
  term: string;
  definition: string;
}

type Exercise = 
  | MultipleChoiceExercise
  | FillBlankExercise
  | MatchingExercise
  | TapWordExercise
  | FlashcardExercise
  | InfoCardExercise
  | RhymeMatchExercise;

interface Lesson {
  id: string;
  title: string;
  description: string;
  level: number;
  totalXp: number;
  exercises: Exercise[];
  unlockRequirement?: {
    lessonId: string;
    minLevel?: number;
  };
}

// Lesson data with microlearning exercises
const lessons: Record<string, Lesson> = {
  "intro-rhymes": {
    id: "intro-rhymes",
    title: "Intro to Rhymes",
    description: "Learn the basics of rhyming patterns",
    level: 1,
    totalXp: 30,
    exercises: [
      {
        id: "ex1",
        type: "info_card",
        question: "What is a rhyme?",
        term: "Rhyme",
        definition: "A repetition of similar sounds in two or more words, often at the ends of lines",
        xpReward: 5
      },
      {
        id: "ex2",
        type: "multiple-choice",
        question: "Select the word that rhymes with \"flow\"",
        options: [
          { id: "opt1", text: "Glow", isCorrect: true },
          { id: "opt2", text: "Beat", isCorrect: false },
          { id: "opt3", text: "Rhyme", isCorrect: false }
        ],
        xpReward: 5
      },
      {
        id: "ex3",
        type: "rhyme_match",
        question: "Match these rhyming pairs",
        pairs: [
          { id: "pair1", left: "Beat", right: "Street" },
          { id: "pair2", left: "Mic", right: "Like" },
          { id: "pair3", left: "Flow", right: "Grow" }
        ],
        xpReward: 5
      },
      {
        id: "ex4",
        type: "multiple-choice",
        question: "Which of these words rhymes with 'cat'?",
        options: [
          { id: "opt1", text: "Hat", isCorrect: true },
          { id: "opt2", text: "Dog", isCorrect: false },
          { id: "opt3", text: "Car", isCorrect: false }
        ],
        explanation: "Cat and hat share the same ending sound pattern '-at'",
        xpReward: 5
      },
      {
        id: "ex5",
        type: "info_card",
        question: "Types of Rhymes",
        term: "Perfect vs. Slant Rhymes",
        definition: "Perfect rhymes match exactly in sound (e.g., cat/hat). Slant rhymes are close but not exact (e.g., home/stone).",
        xpReward: 5
      },
      {
        id: "ex6",
        type: "rhyme_match",
        question: "Match these slant rhyming pairs",
        pairs: [
          { id: "pair1", left: "Home", right: "Stone" },
          { id: "pair2", left: "Move", right: "Proof" },
          { id: "pair3", left: "Work", right: "Hurt" }
        ],
        xpReward: 5
      }
    ]
  },
  "flow-basics": {
    id: "flow-basics",
    title: "Flow Basics",
    description: "Master your rhythm and timing",
    level: 1,
    totalXp: 30,
    exercises: [
      {
        id: "fb-ex1",
        type: "info_card",
        question: "What is flow in rap?",
        term: "Flow",
        definition: "The rhythm and timing of words over a beat",
        xpReward: 5
      },
      {
        id: "fb-ex2",
        type: "multiple-choice",
        question: "What determines a rapper's flow?",
        options: [
          { id: "fb-opt1", text: "How fast they can talk", isCorrect: false },
          { id: "fb-opt2", text: "The rhythm and pattern of their words", isCorrect: true },
          { id: "fb-opt3", text: "The volume of their voice", isCorrect: false }
        ],
        xpReward: 5
      },
      {
        id: "fb-ex3",
        type: "fill-blank",
        question: "Complete this statement about flow",
        sentence: "A good flow means staying in _____ with the beat",
        blankIndex: 6,
        options: [
          { id: "fb-blank-opt1", text: "sync", isCorrect: true },
          { id: "fb-blank-opt2", text: "front", isCorrect: false },
          { id: "fb-blank-opt3", text: "competition", isCorrect: false }
        ],
        xpReward: 5
      },
      {
        id: "fb-ex4",
        type: "rhyme_match",
        question: "Match these flow-related rhyming pairs",
        pairs: [
          { id: "fb-pair1", left: "Beat", right: "Feet" },
          { id: "fb-pair2", left: "Flow", right: "Go" },
          { id: "fb-pair3", left: "Rhyme", right: "Time" }
        ],
        xpReward: 5
      },
      {
        id: "fb-ex5",
        type: "multiple-choice",
        question: "Which of these is NOT an element of good flow?",
        options: [
          { id: "fb-mc1", text: "Using the exact same rhythm for every line", isCorrect: true },
          { id: "fb-mc2", text: "Varying your cadence for emphasis", isCorrect: false },
          { id: "fb-mc3", text: "Staying on beat", isCorrect: false }
        ],
        explanation: "Good flow often involves variety and dynamics rather than monotonous rhythms",
        xpReward: 5
      },
      {
        id: "fb-ex6",
        type: "info_card",
        question: "What is cadence?",
        term: "Cadence",
        definition: "The rhythmic flow of words - the rise and fall, speed and emphasis of your delivery",
        xpReward: 5
      }
    ],
    unlockRequirement: {
      lessonId: "intro-rhymes",
      minLevel: 1
    }
  },
  "rhyme-patterns": {
    id: "rhyme-patterns",
    title: "Rhyme Patterns",
    description: "Learn different rhyming structures",
    level: 2,
    totalXp: 35,
    exercises: [
      {
        id: "rp-ex1",
        type: "info_card",
        question: "What are rhyme patterns?",
        term: "Rhyme Patterns",
        definition: "Structured arrangements of rhymes that create predictable sound schemes in your lyrics",
        xpReward: 5
      },
      {
        id: "rp-ex2",
        type: "multiple-choice",
        question: "What is an AABB rhyme scheme?",
        options: [
          { id: "rp-opt1", text: "When the first and third lines rhyme, and the second and fourth lines rhyme", isCorrect: false },
          { id: "rp-opt2", text: "When the first two lines rhyme with each other, and the next two lines rhyme with each other", isCorrect: true },
          { id: "rp-opt3", text: "When every line has the same rhyme", isCorrect: false }
        ],
        xpReward: 5
      },
      {
        id: "rp-ex3",
        type: "rhyme_match",
        question: "Match these words that follow an AABB pattern",
        pairs: [
          { id: "rp-pair1", left: "Cat", right: "Hat" },
          { id: "rp-pair2", left: "Cat", right: "Bat" },
          { id: "rp-pair3", left: "Flow", right: "Glow" },
          { id: "rp-pair4", left: "Speed", right: "Need" }
        ],
        xpReward: 5
      },
      {
        id: "rp-ex4",
        type: "multiple-choice",
        question: "What is internal rhyme?",
        options: [
          { id: "rp-mc1", text: "Rhyming words at the end of consecutive lines", isCorrect: false },
          { id: "rp-mc2", text: "Rhyming words within the same line", isCorrect: true },
          { id: "rp-mc3", text: "Rhyming the first word of each line", isCorrect: false }
        ],
        explanation: "Internal rhymes occur when words rhyme within a single line, not just at the end",
        xpReward: 5
      },
      {
        id: "rp-ex5",
        type: "info_card",
        question: "Advanced Techniques",
        term: "Multisyllabic Rhymes",
        definition: "Rhyming multiple syllables instead of just one (e.g., 'remember' with 'December')",
        xpReward: 5
      }
    ],
    unlockRequirement: {
      lessonId: "flow-basics",
      minLevel: 2
    }
  },
  "filler-phrases-101": {
    id: "filler-phrases-101",
    title: "Filler Phrases 101",
    description: "Learn essential filler phrases to maintain your flow",
    level: 1,
    totalXp: 30,
    exercises: [
      {
        id: "fp-ex1",
        type: "info_card",
        question: "What are filler phrases?",
        term: "Filler Phrases",
        definition: "Short, versatile expressions that help maintain rhythm when freestyling and give you time to think of your next line",
        xpReward: 5
      },
      {
        id: "fp-ex2",
        type: "info_card",
        question: "Filler Phrase of the Day",
        term: "You already know",
        definition: "A confidence-boosting filler that works at the beginning or end of a bar",
        xpReward: 5
      },
      {
        id: "fp-ex3",
        type: "multiple-choice",
        question: "When should you use filler phrases?",
        options: [
          { id: "fp-opt1", text: "Never, they show weakness", isCorrect: false },
          { id: "fp-opt2", text: "Sparingly, to maintain flow when needed", isCorrect: true },
          { id: "fp-opt3", text: "Constantly, in every line", isCorrect: false }
        ],
        explanation: "Filler phrases are tools to help maintain flow, but shouldn't dominate your freestyle",
        xpReward: 5
      },
      {
        id: "fp-ex4",
        type: "multiple-choice",
        question: "Which of these is a common filler phrase?",
        options: [
          { id: "fp-opt4", text: "Listen to what I'm saying", isCorrect: true },
          { id: "fp-opt5", text: "I don't know what to say next", isCorrect: false },
          { id: "fp-opt6", text: "Sorry for the awkward pause", isCorrect: false }
        ],
        xpReward: 5
      },
      {
        id: "fp-ex5",
        type: "rhyme_match",
        question: "Match these filler phrases with appropriate contexts",
        pairs: [
          { id: "fp-pair1", left: "Check it", right: "Starting a verse" },
          { id: "fp-pair2", left: "That's how it goes", right: "Ending a verse" },
          { id: "fp-pair3", left: "Coming through", right: "Mid-verse transition" }
        ],
        xpReward: 5
      },
      {
        id: "fp-ex6",
        type: "info_card",
        question: "Your Freestyle Arsenal",
        term: "You know what I'm saying",
        definition: "A versatile filler that creates audience connection and buys thinking time",
        xpReward: 5
      }
    ]
  }
};

// Function to get lesson data
export function getLessonData(lessonId: string): Lesson {
  return lessons[lessonId] || lessons["intro-rhymes"];
}

// Function to get all available lessons
export function getAllLessons(): Lesson[] {
  return Object.values(lessons);
}

// Calculate user level based on XP
export function calculateLevel(xp: number): number {
  if (xp < 50) return 1;
  if (xp < 150) return 2;
  if (xp < 300) return 3;
  if (xp < 500) return 4;
  return 5;
}

// Function to check if a lesson is unlocked
export function isLessonUnlocked(lessonId: string, userXp: number, completedLessons: string[]): boolean {
  const lesson = lessons[lessonId];
  if (!lesson) return false;
  
  // If no requirement, lesson is unlocked
  if (!lesson.unlockRequirement) return true;
  
  const { lessonId: requiredLessonId, minLevel } = lesson.unlockRequirement;
  
  // Check if user completed required lesson
  const completedRequired = completedLessons.includes(requiredLessonId);
  
  // Check if user has required level
  const userLevel = calculateLevel(userXp);
  const hasLevel = !minLevel || userLevel >= minLevel;
  
  return completedRequired && hasLevel;
}
