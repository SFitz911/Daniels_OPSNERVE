# OpsNerve Landing Stack

Immersive four-page landing experience for OpsNerve, pairing a neon-inspired visual language with a lightweight Node/Express backend that captures interest signals locally.

## What we've built so far
- **Full multi-page front end:** Home, Sign Up, DevOps Squadron, and AI + Cloud Studio, each sharing the supplied logo, lime-framed cards, and responsive navigation.
- **Signup-first flow:** Primary CTA now routes to a dedicated signup page with a high-contrast intake panel and mission brief form wired to the backend.
- **Dynamic hero pulse:** `/api/pulse` feeds live statements into the home-page signal board to keep the narrative feeling active.
- **Local lead capture:** `/api/interest` appends submissions to `server/data/leads.json`, keeping data on-device until you export it.
- **Operational polish:** Health check endpoint, README instructions, and nodemon-ready scripts make it easy to keep the stack running locally.

## Stack
- **Client:** Vanilla HTML/CSS/JS with custom gradients, purposeful typography, and reusable components.
- **Server:** Node.js + Express serving the static bundle and JSON APIs with CORS + JSON parsing enabled.
- **Storage:** JSON file at `server/data/leads.json` (extendable to any datastore).

## Project structure
```
client/
  assets/opsnerve-logo.jpeg
  css/styles.css
  js/app.js
  index.html
  signup.html
  devops.html
  ai-cloud.html
server/
  data/leads.json
  server.js
  package.json
README.md
```

## Getting started
1. **Install dependencies**
   ```powershell
   cd server
   npm install
   ```
2. **Run the local host**
   ```powershell
   npm start
   ```
   The server listens on [http://localhost:4000](http://localhost:4000) and serves every page from the `client` folder.
3. **Visit the site**
   - Home: http://localhost:4000/index.html
   - Sign Up: http://localhost:4000/signup.html
   - DevOps Squadron: http://localhost:4000/devops.html
   - AI + Cloud Studio: http://localhost:4000/ai-cloud.html

## Available endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Simple heartbeat for monitoring. |
| GET | `/api/pulse` | Returns rotating narrative statements injected into the hero signal cards. |
| POST | `/api/interest` | Accepts `{ name, email, focus, message }` and appends to `leads.json`. |

## Customizing
- Update copy/sections in `client/*.html` and the look & feel in `client/css/styles.css`.
- Replace or add imagery in `client/assets`. The provided `opsnerve-logo.jpeg` mirrors the supplied brand mark.
- Extend the backend by swapping the local JSON store for your preferred database or SaaS webhook inside `server/server.js`.
