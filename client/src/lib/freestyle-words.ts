// Categories
const NOUNS = [
  "dream", "mirror", "crown", "street", "game", "fire", "flow", "mind",
  "city", "sky", "vision", "path", "rhyme", "truth", "light", "star",
  "home", "king", "power", "love", "time", "word", "world", "voice",
  "heart", "soul", "beat", "mic", "stage", "crowd", "chain", "money",
  "hustle", "grind", "life", "pain", "fame", "pride", "hope", "faith",
  "glory", "story", "battle", "victory", "journey", "legacy", "future", "past"
];

const VERBS = [
  "elevate", "flex", "flow", "shine", "grind", "hustle", "spit", "rise",
  "rule", "win", "move", "flip", "drop", "boost", "build", "break",
  "climb", "conquer", "create", "crush", "dominate", "drive", "fly", "focus",
  "grow", "ignite", "inspire", "jump", "launch", "lead", "level", "lift",
  "push", "reach", "rise", "run", "slay", "soar", "stand", "strive",
  "succeed", "take", "transform", "vibe", "visualize", "walk", "work", "write"
];

const ADJECTIVES = [
  "fierce", "fresh", "real", "raw", "dope", "lit", "sick", "sharp",
  "smooth", "strong", "true", "wild", "bold", "bright", "clear", "deep",
  "dynamic", "elite", "epic", "fire", "fly", "free", "gold", "great",
  "hard", "high", "hot", "huge", "icy", "infinite", "legendary", "loud",
  "major", "massive", "next", "original", "prime", "pure", "rare", "rich",
  "royal", "savage", "sharp", "slick", "solid", "supreme", "true", "unique"
];

const EMOTIONS = [
  "triumph", "rage", "passion", "hunger", "focus", "peace", "love", "confidence",
  "ambition", "desire", "energy", "faith", "gratitude", "hope", "joy", "drive",
  "motivation", "patience", "power", "pride", "respect", "strength", "trust", "vision",
  "wisdom", "wonder", "calm", "courage", "determination", "discipline", "empathy", "excitement",
  "freedom", "happiness", "harmony", "intensity", "optimism", "persistence", "purpose", "serenity",
  "spirit", "tranquility", "understanding", "unity", "valor", "vitality", "warmth", "zeal"
];

// All words combined
export const ALL_FREESTYLE_WORDS = [
  ...NOUNS,
  ...VERBS,
  ...ADJECTIVES,
  ...EMOTIONS
];

// Get a random word
export function getRandomWord(): string {
  const randomIndex = Math.floor(Math.random() * ALL_FREESTYLE_WORDS.length);
  return ALL_FREESTYLE_WORDS[randomIndex];
}

// Get a random word from a specific category
export function getRandomWordByCategory(category: 'nouns' | 'verbs' | 'adjectives' | 'emotions'): string {
  let wordList: string[] = [];
  
  switch (category) {
    case 'nouns':
      wordList = NOUNS;
      break;
    case 'verbs':
      wordList = VERBS;
      break;
    case 'adjectives':
      wordList = ADJECTIVES;
      break;
    case 'emotions':
      wordList = EMOTIONS;
      break;
  }
  
  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex];
}

// Get a set of random words
export function getRandomWords(count: number): string[] {
  const words: string[] = [];
  const allWords = [...ALL_FREESTYLE_WORDS]; // Copy to avoid modifying original
  
  for (let i = 0; i < count; i++) {
    if (allWords.length === 0) break;
    
    const randomIndex = Math.floor(Math.random() * allWords.length);
    words.push(allWords[randomIndex]);
    allWords.splice(randomIndex, 1); // Remove word to avoid duplicates
  }
  
  return words;
}