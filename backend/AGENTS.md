# Backend Agents

## Tech stack
Node.js, Express, TypeScript, SQLite, Prisma ORM, Multer pro upload souboru a OpenAI API pro analyzu obrazku. Pro AI analyzu je planovany model GPT-4o.

## Spusteni
`npm install && npx prisma generate && npx prisma db push && npm run dev` -> `http://localhost:3001`

## Stav API
Aktualne je implementovany server v [backend/src/index.ts](C:\Users\shura\pomozodpadum\backend\src\index.ts) a endpoint [backend/src/routes/health.ts](C:\Users\shura\pomozodpadum\backend\src\routes\health.ts). Nize uvedena tabulka kombinuje existujici endpointy a planovane MVP endpointy, ktere maji byt pri rozsireni backendu doplneny.

## Struktura API endpointu
| Metoda | Endpoint | Popis |
|--------|----------|-------|
| GET | /api/health | Health check |
| POST | /api/analyze | Analyza fotky odpadu (AI), planovano |
| GET | /api/waste/:id | Detail odpadu, planovano |
| GET | /api/history | Seznam historie skenu, planovano |
| DELETE | /api/history/:id | Smazani zaznamu z historie, planovano |
| POST | /api/corrections | Odeslani korekce, planovano |
| GET | /api/tips/today | Denni tip, planovano |
| GET | /api/stats | Statistiky uzivatele, planovano |

## Databazove schema
- `WasteRecord`: uklada rozpoznany odpad, primarni kontejner, popis, obrazek, instrukce, slozeni, zabavny fakt, podobne odpady a cas skenu.
- `UserCorrection`: uklada uzivatelske korekce rozpoznani odpadu a kontejneru.
- `DailyTip`: uklada edukacni denni tipy pro uzivatele.

Schma je definovane v [backend/prisma/schema.prisma](C:\Users\shura\pomozodpadum\backend\prisma\schema.prisma).

## Jak pridat novy endpoint
1. Vytvor route v `src/routes/`.
2. Vytvor controller v `src/controllers/`.
3. Pokud je potreba, pridej service v `src/services/`.
4. Zaregistruj route v `src/index.ts`.
5. Aktualizuj tuto dokumentaci.

## Environment variables
- `PORT`
- `DATABASE_URL`
- `OPENAI_API_KEY`

Pouzivej pouze environment variables. NIKDY necommituj `.env`, API klice ani jine secrets. Sabona patri do `.env.example`.

## uploads/
Slozka `uploads/` obsahuje nahrane fotky, je v `.gitignore` a ma se cistit periodicky.

## Bezpecnostni pravidla
- NIKDY necommituj `.env` soubory, API klice ani jine citlive udaje.
- Vsechny secrets musi jit pres environment variables.
- `.env.example` musi obsahovat pouze sablony bez realnych hodnot.

## Udrzba dokumentace
Pokud pridas novou funkci, endpoint nebo zmenis strukturu projektu, aktualizuj prislusny `AGENTS.md` soubor.
