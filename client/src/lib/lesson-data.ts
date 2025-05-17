// Define different types of microlearning exercises
type ExerciseType = 
  | 'multiple-choice' 
  | 'fill-blank'
  | 'matching'
  | 'tap-word'
  | 'flashcard';

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

type Exercise = 
  | MultipleChoiceExercise
  | FillBlankExercise
  | MatchingExercise
  | TapWordExercise
  | FlashcardExercise;

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
    totalXp: 25,
    exercises: [
      {
        id: "ex1",
        type: "flashcard",
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
        type: "matching",
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
        type: "fill-blank",
        question: "Complete this rhyming line",
        sentence: "I'm dropping beats that make the crowd go _____",
        blankIndex: 7,
        options: [
          { id: "opt1", text: "wild", isCorrect: true },
          { id: "opt2", text: "home", isCorrect: false },
          { id: "opt3", text: "stop", isCorrect: false }
        ],
        explanation: "In rap, 'wild' rhymes with the implied preceding line ending that would rhyme with 'wild'",
        xpReward: 5
      },
      {
        id: "ex5",
        type: "tap-word",
        question: "Tap the words in order to create a rhyming couplet",
        correctSequence: ["My", "rhymes", "flow", "like", "a", "stream", "Making", "dope", "beats", "is", "my", "dream"],
        wordOptions: ["My", "rhymes", "flow", "like", "a", "stream", "Making", "dope", "beats", "is", "my", "dream", "stop", "going", "fast"],
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
        type: "flashcard",
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
      }
    ],
    unlockRequirement: {
      lessonId: "intro-rhymes",
      minLevel: 1
    }
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
