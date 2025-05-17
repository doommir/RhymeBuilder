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

// Set page title
document.title = "RhymeTime - Learn to Freestyle Rap";

createRoot(document.getElementById("root")!).render(<App />);
