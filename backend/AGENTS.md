# Backend Agents

## Tech stack
Node.js, Express, TypeScript, SQLite, Prisma ORM, Multer pro upload souboru a OpenAI API pro analyzu obrazku. Pro AI analyzu je planovany model GPT-4o.

## Spusteni
`npm install && npx prisma generate && npx prisma db push && npm run dev` -> `http://localhost:3001`

Z korene repozitare lze pouzit `npm run dev` pro soubezny start backendu a frontendu.

## Produkcni build
- `npm run build` vytvori `dist/`
- `npm run start:prod` spusti buildnutou verzi z `dist/index.js`
- Z korene repozitare lze pouzit `npm run build` pro build backendu i frontendu

## Stav API
Aktualne je implementovany server v [backend/src/index.ts](C:\Users\shura\pomozodpadum\backend\src\index.ts) a endpoint [backend/src/routes/health.ts](C:\Users\shura\pomozodpadum\backend\src\routes\health.ts). Nize uvedena tabulka kombinuje existujici endpointy a planovane MVP endpointy, ktere maji byt pri rozsireni backendu doplneny.

## Struktura API endpointu
| Metoda | Endpoint | Popis |
|--------|----------|-------|
| GET | /api/health | Health check |
| POST | /api/analyze | Analyza fotky odpadu (AI) |
| GET | /api/waste/:id | Detail odpadu |
| GET | /api/history | Seznam historie skenu |
| DELETE | /api/history/:id | Smazani zaznamu z historie |
| POST | /api/corrections | Odeslani korekce |
| GET | /api/tips/today | Denni tip |
| GET | /api/tips | Seznam vsech tipu |
| GET | /api/stats | Statistiky uzivatele |
| GET | /api/containers | Pruvodce trideni - vsechny kontejnery |
| GET | /api/containers/:type | Detail kontejneru |

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
- `FRONTEND_URL`

Pouzivej pouze environment variables. NIKDY necommituj `.env`, API klice ani jine secrets. Sabona patri do `.env.example`.

## Security middleware
- `helmet` pridava bezpecnostni HTTP hlavicky
- globalni rate limiting je 100 pozadavku za 15 minut na IP
- `/api/analyze` ma zvlastni limit 10 pozadavku za 15 minut na IP
- validace vstupu je sdilena v `src/middleware/validate.ts`

## uploads/
Slozka `uploads/` obsahuje nahrane fotky, je v `.gitignore` a ma se cistit periodicky.

## Bezpecnostni pravidla
- NIKDY necommituj `.env` soubory, API klice ani jine citlive udaje.
- Vsechny secrets musi jit pres environment variables.
- `.env.example` musi obsahovat pouze sablony bez realnych hodnot.

## Udrzba dokumentace
Pokud pridas novou funkci, endpoint nebo zmenis strukturu projektu, aktualizuj prislusny `AGENTS.md` soubor.
