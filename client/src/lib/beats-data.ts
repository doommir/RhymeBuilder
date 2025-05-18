// Import the custom beats from FlowVault
import beatData from './flowvault_beats.json';

// Beats library for freestyle practice
export type Beat = {
  id: string;
  title: string;
  bpm: number;
  vibe: string;
  fileUrl: string;
  isPremium?: boolean;
  unlockLevel?: number;
};

// Convert the imported JSON data to our Beat type
export const beats: Beat[] = beatData as Beat[];

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