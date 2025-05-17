import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import Remix icon CSS from CDN
const remixiconLink = document.createElement('link');
remixiconLink.rel = 'stylesheet';
remixiconLink.href = 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css';
document.head.appendChild(remixiconLink);

// Import Google Fonts
const googleFontsLink = document.createElement('link');
googleFontsLink.rel = 'stylesheet';
googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Inter:wght@400;500&display=swap';
document.head.appendChild(googleFontsLink);

// Preload sound effects
const correctAudio = new Audio('/correct.mp3');
const incorrectAudio = new Audio('/incorrect.mp3');
const completeAudio = new Audio('/complete.mp3');

// Define sound effects interface to extend Window
interface SoundEffects {
  playCorrect: () => Promise<void>;
  playIncorrect: () => Promise<void>;
  playComplete: () => Promise<void>;
}

// Extend Window interface
declare global {
  interface Window {
    sfx: SoundEffects;
  }
}

// Add sound effects to window object
window.sfx = {
  playCorrect: () => correctAudio.play().catch(e => console.warn('Audio playback error:', e)),
  playIncorrect: () => incorrectAudio.play().catch(e => console.warn('Audio playback error:', e)),
  playComplete: () => completeAudio.play().catch(e => console.warn('Audio playback error:', e))
};

// Set page title
document.title = "FlowTrainer - Learn to Freestyle Rap";

createRoot(document.getElementById("root")!).render(<App />);
