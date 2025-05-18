import { v4 as uuid } from 'uuid';
import { saveToRhymePad } from '@/hooks/use-rhymepad';

// New lesson phase types
export type LessonPhase = 'reading' | 'video' | 'practice' | 'recall' | 'complete';

// Exercise types for recall phase
export type RecallExerciseType = 'info_card' | 'multiple_choice' | 'fill_in_blank';

// Recall exercises
export interface BaseRecallExercise {
  id: string;
  type: RecallExerciseType;
  question: string;
  xpReward: number;
}

export interface InfoCardExercise extends BaseRecallExercise {
  type: 'info_card';
  content: string;
}

export interface MultipleChoiceExercise extends BaseRecallExercise {
  type: 'multiple_choice';
  options: string[];
  correctAnswer: string;
}

export interface FillInBlankExercise extends BaseRecallExercise {
  type: 'fill_in_blank';
  content: string;
  blankIndex: number;
  options: string[];
  correctAnswer: string;
}

export type RecallExercise = 
  | InfoCardExercise 
  | MultipleChoiceExercise 
  | FillInBlankExercise;

// Comprehensive lesson module structure
export interface LessonModule {
  id: string;
  title: string;
  description: string;
  level: number;
  totalXp: number;
  // Reading phase
  readingText: string;
  // Video phase
  videoUrl: string;
  observationChecklist: string[];
  // Practice phase
  practiceBeatUrl: string;
  // Recall phase
  recallExercises: RecallExercise[];
  // Optional requirement for lesson unlocking
  unlockRequirement?: {
    lessonId: string;
    minLevel?: number;
  };
}

// Initial lesson modules
const lessonModules: Record<string, LessonModule> = {
  "setup-punchline": {
    id: "setup-punchline",
    title: "Setup & Punchline",
    description: "Learn how to craft effective setups and deliver powerful punchlines",
    level: 1,
    totalXp: 25,
    readingText: "One of the most important techniques in freestyle and battle rap is the setup + punchline combo.\n\nThe **setup** creates context — it may sound ordinary, but it leads the listener down a path.\nThe **punchline** then delivers the surprise — a joke, a threat, or a clever wordplay.\n\nThese often happen in **2-bar pairs**:\n- **Bar 1** = Setup\n- **Bar 2** = Punchline\n\nA master of this structure was **Big L**, one of Harlem's finest.\nHe was known for setting up calm, chill lines before dropping brutal or hilarious punches.\n\nExample:\n*\"Ask Beavis, I get nothing but-head\"*\n\nThe listener doesn't expect the wordplay flip until the final moment. That's the punch.\n\nBy learning to write with structure, you build tension — and deliver satisfaction.",
    videoUrl: "https://www.youtube.com/embed/qggxTtnKTMo", // Big L & Jay-Z Freestyle
    observationChecklist: [
      "What line sets up the punch?",
      "Is the punch humorous, threatening, or clever?",
      "How does Big L use calm delivery to build up tension?",
      "Which punchline made the crowd react most?"
    ],
    practiceBeatUrl: "/beats/battle-bounce.mp3", 
    recallExercises: [
      {
        id: uuid(),
        type: "info_card",
        question: "What's a punchline?",
        content: "A clever, funny, or aggressive bar that surprises the listener, usually delivered after a setup.",
        xpReward: 5
      },
      {
        id: uuid(),
        type: "multiple_choice",
        question: "What part of this is the punchline?",
        options: [
          "I walk into the club like what up",
          "I'm here to burn it down and light it up",
          "You already know the vibes",
          "I'm sipping soda, sober"
        ],
        correctAnswer: "I'm here to burn it down and light it up",
        xpReward: 5
      },
      {
        id: uuid(),
        type: "fill_in_blank",
        question: "A great punchline should feel both ______ and ______.",
        content: "A great punchline should feel both unexpected and _______.",
        blankIndex: 6,
        options: ["boring", "inevitable", "complex"],
        correctAnswer: "inevitable",
        xpReward: 5
      },
      {
        id: uuid(),
        type: "multiple_choice",
        question: "Who is featured in the video as a master of setup and punchline?",
        options: [
          "Kendrick Lamar",
          "Jay-Z",
          "Big L",
          "Tupac"
        ],
        correctAnswer: "Big L",
        xpReward: 5
      }
    ]
  },
  
  "filler-phrases": {
    id: "filler-phrases",
    title: "Filler Phrases",
    description: "Master the art of using filler phrases to maintain flow",
    level: 1,
    totalXp: 25,
    readingText: "Filler phrases are short transitions that keep your flow going when you're thinking of your next bar. They also give space to breathe and can become part of your signature style. Common examples include 'you know what I'm saying', 'check it out', and 'listen up'.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
    observationChecklist: [
      "How often do you hear repeated phrases?",
      "Do they fit the rhythm?",
      "Do different rappers have unique filler phrases?",
      "Are fillers used at specific points (beginning, middle, end of verses)?"
    ],
    practiceBeatUrl: "/beats/laidback-loop.mp3", // Placeholder
    recallExercises: [
      {
        id: uuid(),
        type: "info_card",
        question: "What are filler phrases?",
        content: "Filler phrases are short, repeatable expressions that maintain rhythm when freestyling and give you time to think of your next line.",
        xpReward: 5
      },
      {
        id: uuid(),
        type: "multiple_choice",
        question: "What is a filler phrase used for?",
        options: [
          "To show off vocabulary",
          "To maintain flow while thinking of the next line",
          "To replace actual lyrics"
        ],
        correctAnswer: "To maintain flow while thinking of the next line",
        xpReward: 5
      },
      {
        id: uuid(),
        type: "multiple_choice",
        question: "Choose the filler phrase:",
        options: [
          "You know what I mean",
          "I spit bars like fire",
          "My lyrics are deeper than the ocean"
        ],
        correctAnswer: "You know what I mean",
        xpReward: 5
      },
      {
        id: uuid(),
        type: "fill_in_blank",
        question: "Complete this common filler phrase",
        content: "Check it _____, yeah",
        blankIndex: 2,
        options: ["now", "out", "up"],
        correctAnswer: "out",
        xpReward: 5
      }
    ]
  },
  
  "cadence-flow": {
    id: "cadence-flow",
    title: "Cadence & Flow",
    description: "Learn to control your rhythmic patterns and flow",
    level: 2,
    totalXp: 30,
    readingText: "Cadence is your rhythmic pattern. It's what makes your bars sound musical. Changing cadence keeps the listener engaged and shows your versatility as an artist. Master rappers seamlessly switch between different cadences within a single verse.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
    observationChecklist: [
      "Where do they pause?",
      "Do they ride the beat or push against it?",
      "How does the cadence change with the content?",
      "Can you identify when they switch flow patterns?"
    ],
    practiceBeatUrl: "/beats/flowy-vibes.mp3", // Placeholder
    recallExercises: [
      {
        id: uuid(),
        type: "info_card",
        question: "What is cadence?",
        content: "Cadence is the rhythmic pattern of your words - the rise and fall, speed and emphasis of your delivery.",
        xpReward: 5
      },
      {
        id: uuid(),
        type: "multiple_choice",
        question: "Which is an example of syncopation?",
        options: [
          "Rapping directly on the beat",
          "Placing emphasis between beats",
          "Maintaining the same rhythm throughout"
        ],
        correctAnswer: "Placing emphasis between beats",
        xpReward: 5
      },
      {
        id: uuid(),
        type: "multiple_choice",
        question: "Why is changing cadence important?",
        options: [
          "It keeps the listener engaged",
          "It makes the song shorter",
          "It saves your breath"
        ],
        correctAnswer: "It keeps the listener engaged",
        xpReward: 5
      },
      {
        id: uuid(),
        type: "fill_in_blank",
        question: "Complete this statement about flow",
        content: "A good flow means staying in _____ with the beat",
        blankIndex: 6,
        options: ["front", "sync", "time"],
        correctAnswer: "sync",
        xpReward: 5
      }
    ],
    unlockRequirement: {
      lessonId: "filler-phrases",
      minLevel: 1
    }
  },
  
  "riding-the-beat": {
    id: "riding-the-beat",
    title: "Riding the Beat",
    description: "Master the art of flowing with instrumental rhythms",
    level: 2,
    totalXp: 30,
    readingText: "Riding the beat means aligning your words and pauses to the rhythm so that it feels natural and groovy. Some rappers glide with it, others bounce off it. The relationship between your voice and the beat is at the core of what makes rap music powerful.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
    observationChecklist: [
      "Does the rapper follow the kick or the snare?",
      "Are syllables landing on beat or behind?",
      "How does the flow change when the beat changes?",
      "What emotions does the beat-riding style convey?"
    ],
    practiceBeatUrl: "/beats/boom-bap-101.mp3", // Placeholder
    recallExercises: [
      {
        id: uuid(),
        type: "info_card",
        question: "What does it mean to 'ride the beat'?",
        content: "Riding the beat means aligning your words and pauses to the rhythm of the instrumental in a way that feels natural and complementary.",
        xpReward: 5
      },
      {
        id: uuid(),
        type: "multiple_choice",
        question: "Which percussion element do rappers often align their words with?",
        options: [
          "Hi-hat",
          "Snare",
          "Cymbal"
        ],
        correctAnswer: "Snare",
        xpReward: 5
      },
      {
        id: uuid(),
        type: "multiple_choice",
        question: "Which line best matches a slow beat?",
        options: [
          "Quick-fire-syllables-hitting-rapid-succession",
          "Draaaaawn ouuuut wooooords with spaaaace",
          "Normal pace regular rhythm everyday flow"
        ],
        correctAnswer: "Draaaaawn ouuuut wooooords with spaaaace",
        xpReward: 5
      },
      {
        id: uuid(),
        type: "fill_in_blank",
        question: "Complete this line about beat riding",
        content: "When I flow, I _____ the beat like a surfer rides waves",
        blankIndex: 3,
        options: ["fight", "ride", "ignore"],
        correctAnswer: "ride",
        xpReward: 5
      }
    ],
    unlockRequirement: {
      lessonId: "cadence-flow",
      minLevel: 2
    }
  },
  
  "multisyllabic-rhymes": {
    id: "multisyllabic-rhymes",
    title: "Multisyllabic Rhymes",
    description: "Create complex rhyme patterns with multiple syllables",
    level: 3,
    totalXp: 35,
    readingText: "Multisyllabic rhymes are the advanced form of rhyming multiple syllables across bars, like 'elevation' with 'meditation' or 'hologram' with 'follow them'. They're a hallmark of technical rap and can create intricate patterns that showcase your lyrical ability.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
    observationChecklist: [
      "How many syllables are rhyming?",
      "Do the rhymes land on the beat?",
      "Are the multisyllabic patterns consistent or varied?",
      "How does the rapper emphasize the rhyming syllables?"
    ],
    practiceBeatUrl: "/beats/technical-flow.mp3", // Placeholder
    recallExercises: [
      {
        id: uuid(),
        type: "info_card",
        question: "What are multisyllabic rhymes?",
        content: "Multisyllabic rhymes match multiple syllables across words or phrases, creating more complex and impressive rhyme patterns.",
        xpReward: 5
      },
      {
        id: uuid(),
        type: "multiple_choice",
        question: "Which is a multisyllabic rhyme?",
        options: [
          "Hop / Top",
          "Fight / Night",
          "Catastrophic / Philosophical"
        ],
        correctAnswer: "Catastrophic / Philosophical",
        xpReward: 5
      },
      {
        id: uuid(),
        type: "multiple_choice",
        question: "What's the benefit of using multisyllabic rhymes?",
        options: [
          "They're easier to come up with",
          "They create more complex and impressive patterns",
          "They use fewer words"
        ],
        correctAnswer: "They create more complex and impressive patterns",
        xpReward: 5
      },
      {
        id: uuid(),
        type: "fill_in_blank",
        question: "Complete this multisyllabic rhyme",
        content: "Higher level of _____, soul elevation",
        blankIndex: 3,
        options: ["dedication", "creation", "rotation"],
        correctAnswer: "dedication",
        xpReward: 5
      }
    ],
    unlockRequirement: {
      lessonId: "riding-the-beat",
      minLevel: 2
    }
  }
};

// Function to get new lesson module data
export function getLessonModule(moduleId: string): LessonModule {
  return lessonModules[moduleId] || lessonModules["setup-punchline"];
}

// Function to get all lesson modules
export function getAllLessonModules(): LessonModule[] {
  return Object.values(lessonModules);
}

// Calculate user level based on XP (reused from original lesson-data.ts)
export function calculateLevel(xp: number): number {
  if (xp < 50) return 1;
  if (xp < 150) return 2;
  if (xp < 300) return 3;
  if (xp < 500) return 4;
  return 5;
}

// Function to check if a lesson is unlocked
export function isLessonModuleUnlocked(
  moduleId: string, 
  userXp: number, 
  completedLessons: string[]
): boolean {
  const module = lessonModules[moduleId];
  if (!module) return false;
  
  // If no requirement, lesson is unlocked
  if (!module.unlockRequirement) return true;
  
  const { lessonId: requiredLessonId, minLevel } = module.unlockRequirement;
  
  // Check if user completed required lesson
  const completedRequired = completedLessons.includes(requiredLessonId);
  
  // Check if user has required level
  const userLevel = calculateLevel(userXp);
  const hasLevel = !minLevel || userLevel >= minLevel;
  
  return completedRequired && hasLevel;
}