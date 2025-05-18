// Beats library for freestyle practice
export type Beat = {
  id: string;
  title: string;
  bpm: number;
  vibe: string; // e.g. "laid-back", "battle", "upbeat" 
  fileUrl: string;
};

// For the current implementation, we'll use the default lesson beat for all beats
// In a production app, we would have actual beat files for each one
const DEFAULT_BEAT_URL = "https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-621.mp3";

export const beats: Beat[] = [
  { 
    id: "battle-bounce", 
    title: "Battle Bounce", 
    bpm: 90, 
    vibe: "battle", 
    fileUrl: DEFAULT_BEAT_URL 
  },
  { 
    id: "lofi-flow", 
    title: "Lofi Flow", 
    bpm: 80, 
    vibe: "laid-back", 
    fileUrl: DEFAULT_BEAT_URL 
  },
  { 
    id: "trap-snap", 
    title: "Trap Snap", 
    bpm: 140, 
    vibe: "hype", 
    fileUrl: DEFAULT_BEAT_URL
  },
  { 
    id: "boom-bap", 
    title: "Boom Bap Classic", 
    bpm: 93, 
    vibe: "classic", 
    fileUrl: DEFAULT_BEAT_URL 
  },
  { 
    id: "jazzy-vibe", 
    title: "Jazzy Vibes", 
    bpm: 85, 
    vibe: "chill", 
    fileUrl: DEFAULT_BEAT_URL
  },
  { 
    id: "drill-time", 
    title: "Drill Time", 
    bpm: 145, 
    vibe: "hard", 
    fileUrl: DEFAULT_BEAT_URL
  },
  { 
    id: "cloud-rap", 
    title: "Cloud Rapper", 
    bpm: 75, 
    vibe: "ethereal", 
    fileUrl: DEFAULT_BEAT_URL
  },
  { 
    id: "underground", 
    title: "Underground Pulse", 
    bpm: 95, 
    vibe: "dark", 
    fileUrl: DEFAULT_BEAT_URL
  }
];

// Get a beat by ID
export function getBeatById(id: string): Beat | undefined {
  return beats.find(beat => beat.id === id);
}

// Get beats by vibe
export function getBeatsByVibe(vibe: string): Beat[] {
  return beats.filter(beat => beat.vibe === vibe);
}

// Get beats by BPM range
export function getBeatsByBpmRange(minBpm: number, maxBpm: number): Beat[] {
  return beats.filter(beat => beat.bpm >= minBpm && beat.bpm <= maxBpm);
}

// Get all available beats
export function getAllBeats(): Beat[] {
  return beats;
}