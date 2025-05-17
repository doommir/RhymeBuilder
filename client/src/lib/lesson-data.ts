interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  question: string;
  options: Option[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

// Mock lesson data for MVP
const lessons: Record<string, Lesson> = {
  "intro-rhymes": {
    id: "intro-rhymes",
    title: "Intro to Rhymes",
    description: "Learn the basics of rhyming patterns",
    questions: [
      {
        id: "q1",
        question: "Select the word that rhymes with \"flow\"",
        options: [
          {
            id: "q1-opt1",
            text: "Glow",
            isCorrect: true
          },
          {
            id: "q1-opt2",
            text: "Beat",
            isCorrect: false
          },
          {
            id: "q1-opt3",
            text: "Rhyme",
            isCorrect: false
          }
        ]
      },
      {
        id: "q2",
        question: "Which of these is NOT a rhyming pair?",
        options: [
          {
            id: "q2-opt1",
            text: "Cat - Hat",
            isCorrect: false
          },
          {
            id: "q2-opt2",
            text: "Night - Light",
            isCorrect: false
          },
          {
            id: "q2-opt3",
            text: "Word - Beat",
            isCorrect: true
          }
        ]
      },
      {
        id: "q3",
        question: "What makes a good rhyme in rap?",
        options: [
          {
            id: "q3-opt1",
            text: "Using the same word twice",
            isCorrect: false
          },
          {
            id: "q3-opt2",
            text: "Matching similar sounds at word endings",
            isCorrect: true
          },
          {
            id: "q3-opt3",
            text: "Always using simple one-syllable words",
            isCorrect: false
          }
        ]
      }
    ]
  }
};

export function getLessonData(lessonId: string): Lesson {
  return lessons[lessonId] || lessons["intro-rhymes"];
}
