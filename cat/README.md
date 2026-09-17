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

## Roster

- Source: `STA2002 Fall2026/namelist.xlsx` with Child Course ID `STA200226103391`
- `src/data/roster.json` — public names (no student IDs); `NULL` name parts removed
- `server/data/credentials.json` — SHA-256 hashes of student IDs (server only)
