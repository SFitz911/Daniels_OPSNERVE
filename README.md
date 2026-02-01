# OpsNerve Landing Stack

Immersive four-page landing experience for OpsNerve, pairing a neon-inspired visual language with a lightweight Node/Express backend that captures interest signals locally.

## What OpsNerve does
- OpsNerve builds reliable, scalable cloud infrastructure and applies DevOps best practices so teams deploy faster and operate with confidence.
- We design modern cloud architectures, automate CI/CD pipelines, and implement platform and observability practices that keep systems stable from development to production.
- The stack in this repo is a small landing experience and intake API that demonstrates how we capture interest signals locally; it is not a production control plane.

## Stack
- **Client:** Vanilla HTML/CSS/JS with custom gradients, purposeful typography, and reusable components.
- **Server:** Node.js + Express serving the static bundle and JSON APIs with CORS + JSON parsing enabled.
-- **Storage:** JSON file at `server/data/leads.json` (extendable to any datastore). For production, replace with a transactional store.

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
| POST | `/api/interest` | Accepts `{ email, phone, topic, message }` and appends to `server/data/leads.json`. |

## Customizing
- Update copy/sections in `client/*.html` and the look & feel in `client/css/styles.css`.
- Replace or add imagery in `client/assets`. The provided `opsnerve-logo.jpeg` mirrors the supplied brand mark.
- Extend the backend by swapping the local JSON store for your preferred database or SaaS webhook inside `server/server.js`.

## Deployment notes

- The Express server serves the static `client/` folder and exposes `PORT 4000` by default. For production:
   - Set `NODE_ENV=production` and run the server process under a process manager such as `pm2` or systemd.
   - Use a reverse proxy (nginx) to provide HTTPS and host static assets from the server root.
   - Replace `server/data/leads.json` with a proper datastore for durability and concurrency (Postgres, Mongo, or an external webhook).

### Docker

Build the container locally:
```powershell
docker build -t opsnerve:latest .
docker run -p 4000:4000 opsnerve:latest
```

The repository includes a basic `Dockerfile` and `.dockerignore` for simple container deployments.
