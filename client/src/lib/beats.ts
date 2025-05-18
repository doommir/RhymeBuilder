// FlowTrainer Beat Library
export type Beat = {
  id: string;
  title: string;
  bpm: number;
  vibe: string;
  fileUrl: string;
  isPremium?: boolean;
  unlockLevel?: number;
};

const BUCKET_URL = "https://replitusercontent.com/api/v1/9a4fac51-e7a7-4f87-87c0-f84b4da487c3/objects/FlowVaultBeats";

// Beat categories/vibes for filtering
export const BEAT_VIBES = [
  'battle',
  'lo-fi',
  'boom-bap',
  'trap',
  'melodic',
  'chill',
  'dark',
  'energetic'
];

// Beat library with metadata
export const beats: Beat[] = [
  {
    id: "mic-assassin",
    title: "Mic Assassin",
    bpm: 90,
    vibe: "battle",
    fileUrl: `${BUCKET_URL}/Mic%20Assassin%20-%20AI%20Music.mp3`
  },
  {
    id: "808-ambush",
    title: "808 Ambush",
    bpm: 95,
    vibe: "trap",
    fileUrl: `${BUCKET_URL}/808%20Ambush%20-%20AI%20Music.mp3`
  },
  {
    id: "bar-hop",
    title: "Bar Hop",
    bpm: 88,
    vibe: "boom-bap",
    fileUrl: `${BUCKET_URL}/Bar%20Hop%20-%20AI%20Music.mp3`
  },
  {
    id: "boogie-bars",
    title: "Boogie Bars",
    bpm: 90,
    vibe: "boom-bap",
    fileUrl: `${BUCKET_URL}/Boogie%20Bars%20-%20AI%20Music.mp3`
  },
  {
    id: "chrome-daydream",
    title: "Chrome Daydream",
    bpm: 75,
    vibe: "lofi",
    fileUrl: `${BUCKET_URL}/Chrome%20Daydream%20-%20AI%20Music.mp3`
  },
  {
    id: "cold-mirror",
    title: "Cold Mirror",
    bpm: 70,
    vibe: "chill",
    fileUrl: `${BUCKET_URL}/Cold%20Mirror%20-%20AI%20Music.mp3`
  },
  {
    id: "concrete-jungle",
    title: "Concrete Jungle",
    bpm: 85,
    vibe: "dark",
    fileUrl: `${BUCKET_URL}/Concrete%20Jungle%20-%20AI%20Music.mp3`
  },
  {
    id: "drip-code",
    title: "Drip Code",
    bpm: 140,
    vibe: "trap",
    fileUrl: `${BUCKET_URL}/Drip%20Code%20-%20AI%20Music.mp3`
  },
  {
    id: "echoes-block",
    title: "Echoes of the Block",
    bpm: 88,
    vibe: "boom-bap",
    fileUrl: `${BUCKET_URL}/Echoes%20of%20the%20Block%20-%20AI%20Music.mp3`
  },
  {
    id: "fist-flow",
    title: "Fist of Flow",
    bpm: 93,
    vibe: "battle",
    fileUrl: `${BUCKET_URL}/Fist%20of%20Flow%20-%20AI%20Music.mp3`
  }
];

// Get all beats
export function getAllBeats(): Beat[] {
  return beats;
}

// Get a beat by ID
export function getBeatById(id: string): Beat | undefined {
  return beats.find(beat => beat.id === id);
}

// Get beats by vibe category
export function getBeatsByVibe(vibe: string): Beat[] {
  return beats.filter(beat => beat.vibe === vibe);
}

// Get beats within a BPM range
export function getBeatsByBpmRange(minBpm: number, maxBpm: number): Beat[] {
  return beats.filter(beat => beat.bpm >= minBpm && beat.bpm <= maxBpm);
}

// Get random beat
export function getRandomBeat(): Beat {
  const randomIndex = Math.floor(Math.random() * beats.length);
  return beats[randomIndex];
}

// Get beat vibes for filtering
export function getBeatVibes(): string[] {
  return BEAT_VIBES;
}