// Beats library for freestyle practice
export type Beat = {
  id: string;
  title: string;
  bpm: number;
  vibe: string; // e.g. "laid-back", "battle", "upbeat" 
  fileUrl: string;
};

export const beats: Beat[] = [
  { 
    id: "battle-bounce", 
    title: "Battle Bounce", 
    bpm: 90, 
    vibe: "battle", 
    fileUrl: "/beats/battle-bounce.mp3" 
  },
  { 
    id: "lofi-flow", 
    title: "Lofi Flow", 
    bpm: 80, 
    vibe: "laid-back", 
    fileUrl: "/beats/lofi-flow.mp3" 
  },
  { 
    id: "trap-snap", 
    title: "Trap Snap", 
    bpm: 140, 
    vibe: "hype", 
    fileUrl: "/beats/trap-snap.mp3" 
  },
  { 
    id: "boom-bap", 
    title: "Boom Bap Classic", 
    bpm: 93, 
    vibe: "classic", 
    fileUrl: "/beats/boom-bap.mp3" 
  },
  { 
    id: "jazzy-vibe", 
    title: "Jazzy Vibes", 
    bpm: 85, 
    vibe: "chill", 
    fileUrl: "/beats/jazzy-vibe.mp3" 
  },
  { 
    id: "drill-time", 
    title: "Drill Time", 
    bpm: 145, 
    vibe: "hard", 
    fileUrl: "/beats/drill-time.mp3" 
  },
  { 
    id: "cloud-rap", 
    title: "Cloud Rapper", 
    bpm: 75, 
    vibe: "ethereal", 
    fileUrl: "/beats/cloud-rap.mp3" 
  },
  { 
    id: "underground", 
    title: "Underground Pulse", 
    bpm: 95, 
    vibe: "dark", 
    fileUrl: "/beats/underground.mp3" 
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