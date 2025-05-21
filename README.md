# RhymeBuilder

This project is a React + Express application. The default `npm run dev` script starts both the client and the API server on port `5000`.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and adjust the variables if desired. The repository includes a minimal `.env` with placeholder values so the server can start without external services.
3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be served at [http://localhost:5000](http://localhost:5000).

## Mobile Preview

To preview the app on a mobile device, open the running URL in your browser's developer tools and enable a mobile viewport (for example Chrome DevTools device emulation). The layout adapts to screens under 768px width.

