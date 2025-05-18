// Beats library for freestyle practice
export type Beat = {
  id: string;
  title: string;
  bpm: number;
  vibe: string; // e.g. "laid-back", "battle", "upbeat" 
  fileUrl: string;
};

// Use online audio sources for our beat library
export const beats: Beat[] = [
  { 
    id: "battle-bounce", 
    title: "Battle Bounce", 
    bpm: 90, 
    vibe: "battle", 
    fileUrl: "https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-621.mp3" 
  },
  { 
    id: "lofi-flow", 
    title: "Lofi Flow", 
    bpm: 80, 
    vibe: "laid-back", 
    fileUrl: "https://assets.mixkit.co/music/preview/mixkit-hazy-after-hours-132.mp3" 
  },
  { 
    id: "trap-snap", 
    title: "Trap Snap", 
    bpm: 140, 
    vibe: "hype", 
    fileUrl: "https://assets.mixkit.co/music/preview/mixkit-hip-hop-fight-loop-688.mp3"
  },
  { 
    id: "boom-bap", 
    title: "Boom Bap Classic", 
    bpm: 93, 
    vibe: "classic", 
    fileUrl: "https://assets.mixkit.co/music/preview/mixkit-driving-ambition-32.mp3" 
  },
  { 
    id: "jazzy-vibe", 
    title: "Jazzy Vibes", 
    bpm: 85, 
    vibe: "chill", 
    fileUrl: "https://assets.mixkit.co/music/preview/mixkit-jazzy-lounge-81.mp3"
  },
  { 
    id: "drill-time", 
    title: "Drill Time", 
    bpm: 145, 
    vibe: "hard", 
    fileUrl: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3"
  },
  { 
    id: "cloud-rap", 
    title: "Cloud Rapper", 
    bpm: 75, 
    vibe: "ethereal", 
    fileUrl: "https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3"
  },
  { 
    id: "underground", 
    title: "Underground Pulse", 
    bpm: 95, 
    vibe: "dark", 
    fileUrl: "https://assets.mixkit.co/music/preview/mixkit-hip-hop-radio-night-show-intro-2907.mp3"
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