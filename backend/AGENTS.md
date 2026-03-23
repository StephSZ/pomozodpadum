# Backend Agents

## Tech stack
Node.js, Express, TypeScript, SQLite, Prisma ORM, Multer pro upload souboru a LLM adapter vrstvu s vychozim OpenAI providerem pro analyzu obrazku. AI analyza pouziva OpenAI nebo mock rezim bez klice. Stejna LLM abstrakce slouzi i pro generovani sezonnich tipu trideni odpadu.

## Spusteni
`npm install && npx prisma generate && npx prisma db push && npm run dev` -> `http://localhost:3001`

Z korene repozitare lze pouzit `npm run dev` pro soubezny start backendu a frontendu.

## Produkcni build
- `npm run build` vytvori `dist/`
- `npm run start:prod` spusti buildnutou verzi z `dist/index.js`
- Z korene repozitare lze pouzit `npm run build` pro build backendu i frontendu

## Stav API
Backend je funkcni REST API. Server je v [backend/src/index.ts](C:\Users\shura\pomozodpadum\backend\src\index.ts) a endpointy jsou rozdelene do `src/routes/`, `src/controllers/` a `src/services/`.

## LLM architektura
- `src/services/aiService.ts` obsahuje domenovou logiku analyzy odpadu a je jedine misto, ktere vola LLM service.
- `src/services/seasonalTipsService.ts` generuje 5 sezonnich tipu pro aktualni rocni obdobi, uklada je do 24h in-memory cache a pri chybe nebo chybejici konfiguraci vraci fallback data.
- `src/services/llm/llmService.ts` vraci aktivni implementaci LLM adapteru.
- `src/services/llm/openAiLlmAdapter.ts` obsahuje jedinou primou integraci na OpenAI SDK.
- Provider-specific konfigurace se nacita z environment variables `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_TEMPERATURE` a `OPENAI_MAX_TOKENS`.
- Pri vymene providera ma stacit zmenit implementaci adapteru nebo factory v `src/services/llm/`.
- Chyby pri konfiguraci, prazdne odpovedi nebo selhani API se prevadeji na aplikacni chyby a vraceji se pres centralni error handler.

## Struktura API endpointu
| Metoda | Endpoint | Popis |
|--------|----------|-------|
| GET | /api/health | Health check |
| POST | /api/analyze | Analyza fotky odpadu (AI) |
| GET | /api/waste/:id | Detail odpadu |
| GET | /api/history | Seznam historie skenu |
| DELETE | /api/history/:id | Smazani zaznamu z historie |
| POST | /api/corrections | Odeslani korekce |
| GET | /api/tips/today | Stridave denni nebo sezonni tip pro dnes |
| GET | /api/tips/seasonal | 5 sezonnich tipu pro aktualni obdobi |
| GET | /api/tips | Seznam vsech tipu |
| GET | /api/stats | Statistiky uzivatele |
| GET | /api/containers | Pruvodce trideni - vsechny kontejnery |
| GET | /api/containers/:type | Detail kontejneru |
| GET | /api/catalog | Katalog odpadu s fulltextem a filtry podle pismene a kategorie |
| GET | /api/catalog/:id | Detail polozky katalogu odpadu |
| DELETE | /api/history | Smazani cele historie pri `confirm=true` |
| GET | /api/corrections | Seznam korekci |

## Databazove schema
- `WasteRecord`: uklada rozpoznany odpad, primarni kontejner, popis, obrazek, instrukce, slozeni, zabavny fakt, podobne odpady a cas skenu.
- `UserCorrection`: uklada uzivatelske korekce rozpoznani odpadu a kontejneru.
- `DailyTip`: uklada edukacni denni tipy pro uzivatele.
- Sezonni tipy se neukladaji do databaze. Zdroj je LLM + 24h cache + fallback data v `src/data/seasonalTips.ts`.

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
- `OPENAI_MODEL`
- `OPENAI_TEMPERATURE`
- `OPENAI_MAX_TOKENS`
- `FRONTEND_URL`

Pouzivej pouze environment variables. NIKDY necommituj `.env`, API klice ani jine secrets. Sabona patri do `.env.example`.

## Mock rezim
Pokud `OPENAI_API_KEY` chybi nebo ma sablonovou hodnotu, `src/services/aiService.ts` vraci mock analyzu odpadu. Sezonni tipy v tomtez rezimu pouziji staticky fallback dataset rozdeleny po 5 tipech pro jaro, leto, podzim a zimu.

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
