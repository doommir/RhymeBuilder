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
    id: "battle-bounce",
    title: "Battle Bounce",
    bpm: 90,
    vibe: "battle",
    fileUrl: "https://storage.googleapis.com/replit/images/1683824466851_9a04f3bf5125b925c8eea0fc94e7a2e9.mp3"
  },
  {
    id: "lofi-waves",
    title: "Lofi Waves",
    bpm: 75,
    vibe: "lo-fi",
    fileUrl: "https://storage.googleapis.com/replit/images/1683824490370_c7eb83d393caa40f2c986e26baa4c7cd.mp3"
  },
  {
    id: "trap-heat",
    title: "Trap Heat",
    bpm: 140,
    vibe: "trap",
    fileUrl: "https://storage.googleapis.com/replit/images/1683824516932_a49afd97711defd8e74d62bb9e29be83.mp3"
  },
  {
    id: "classic-boom",
    title: "Classic Boom",
    bpm: 92,
    vibe: "boom-bap",
    fileUrl: "https://storage.googleapis.com/replit/images/1683824538234_1e57f7c71a424ef8c6f1fe9e4c4acc7c.mp3"
  },
  {
    id: "chill-vibes",
    title: "Chill Vibes",
    bpm: 80,
    vibe: "chill",
    fileUrl: "https://storage.googleapis.com/replit/images/1683824564182_c2f26fd4bfd49f1e9fd4fda47017b40b.mp3"
  },
  {
    id: "dark-matter",
    title: "Dark Matter",
    bpm: 95,
    vibe: "dark",
    fileUrl: "https://storage.googleapis.com/replit/images/1683824590726_e7e79a71d39c5c8499e91d13c89e171c.mp3"
  },
  {
    id: "melodic-flow",
    title: "Melodic Flow",
    bpm: 85,
    vibe: "melodic",
    fileUrl: "https://storage.googleapis.com/replit/images/1683824617823_d5f8db49f8b2a0d3f8e9b7ed8f1ee12a.mp3"
  },
  {
    id: "energy-boost",
    title: "Energy Boost",
    bpm: 105,
    vibe: "energetic",
    fileUrl: "https://storage.googleapis.com/replit/images/1683824643920_f4d5e2b8a8c0d162a2f57a12f6de0978.mp3"
  },
  {
    id: "smooth-operator",
    title: "Smooth Operator",
    bpm: 88,
    vibe: "chill",
    fileUrl: "https://storage.googleapis.com/replit/images/1683824669123_a2c8f9e3b8d6a4f7e9c1b5d3a7f9e1c4.mp3"
  },
  {
    id: "underground-pulse",
    title: "Underground Pulse",
    bpm: 93,
    vibe: "boom-bap",
    fileUrl: "https://storage.googleapis.com/replit/images/1683824693246_b7a9c5e3d1f6a8c4b2e5d9f7a3c8e1b7.mp3"
  },
  {
    id: "cloud-nine",
    title: "Cloud Nine",
    bpm: 70,
    vibe: "lo-fi",
    fileUrl: "https://storage.googleapis.com/replit/images/1683824714527_d8f2a6e9c7b5a3d1e6f9c2d8a4e6b9d3.mp3"
  },
  {
    id: "battle-arena",
    title: "Battle Arena",
    bpm: 95,
    vibe: "battle",
    fileUrl: "https://storage.googleapis.com/replit/images/1683824737863_f1e8d7c9a5b3e2d6f9a8c7e5d3b1a9c7.mp3"
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