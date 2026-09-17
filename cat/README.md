# STA2002 Class Attending Table

Realtime seating board for lecture **L02** (instructor 曾家炜 / Ka Wai Tsang), classroom **TxA 402**.

Students find their name card on the side, tap it, then tap a seat. Empty seats are labeled `R{row}-{seat}` (e.g. `R1-10`). On a dense 11×20 board, use **🔍+ / 🔍− / ✋ Seat** to magnify a region before sitting.

## How students use it

1. Tap a name card, then tap a seat to sit
2. Enter **your student ID** when asked (IDs are never shown on the page)
3. Tap a seated card, then another empty seat to move
4. Double-tap a seated card to stand up
5. Press and hold a seat to see photo / college / country / hobbies
6. Use **Edit** to set a **nickname** (shown on the seat; true name stays underneath if different), photo, and profile fields
7. Search by nickname, true name, college, country, hobbies, etc.
8. Auditors can **Add temporary card** (session only; not saved to Redis)

## Instructor controls

Set environment variable `INSTRUCTOR_PIN` (on Render: Environment → `INSTRUCTOR_PIN`).

With that PIN you can manage any card, change row / seat counts, reset seats, and **Save attendance** (CSV).

Local default PIN if unset: `change-me-sta2002` — change it before class.

## Layout

1. Front row: Instructor
2. Second row: empty aisle
3. Remaining rows: students (`Row 1` …), default **11 rows × 20 seats**

## Run locally

From this `cat/` folder:

```bash
npm install
npm run dev
```

Or production mode:

```bash
npm run build
npm start
```

Open [http://localhost:3001](http://localhost:3001) after `npm start`.

## Lecture notes

https://kwtsang101016.github.io/sta2002/

## Deploy on Render

1. Repo: [kwtsang101016/sta2002-cat](https://github.com/kwtsang101016/sta2002-cat)
2. One-click Blueprint (reads `render.yaml`):  
   https://dashboard.render.com/blueprints/new?repo=https%3A%2F%2Fgithub.com%2Fkwtsang101016%2Fsta2002-cat&branch=main
3. Service name should be **`sta2002-cat`** so the URL is  
   https://sta2002-cat.onrender.com/
4. Set `INSTRUCTOR_PIN` in the Render dashboard (do not use the local default in class)
5. Optional but recommended for keeping name-card edits after redeploy: create a free [Upstash Redis](https://upstash.com/) database, then set:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
6. Confirm `/health` returns `"durableStore": true` when Redis is configured
7. Share the Render URL with the class

Manual Web Service settings (if not using Blueprint): Root Directory `cat`, Build `npm install && npm run build`, Start `npm start`, Health Check `/health`, Node 22.

Redis is written when someone **edits a name card**, and once more on graceful shutdown. Sit / move / stand stay in memory for the live class. Without Upstash, profile edits are lost on redeploy. Wake the free-tier service a few minutes before class.

## Roster files

- `cat/src/data/roster.json` — public names (no student IDs)
- `cat/server/data/credentials.json` — SHA-256 hashes used only on the server
