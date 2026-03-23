# Backend Agents

## Tech stack
Node.js, Express, TypeScript, SQLite, Prisma ORM, Multer pro upload souborů a LLM adapter vrstva s výchozím OpenAI providerem pro analýzu obrázků. AI analýza používá OpenAI nebo mock režim bez klíče. Stejná LLM abstrakce slouží i pro generování sezónních tipů třídění odpadu.

## Spuštění
`npm install && npx prisma generate && npx prisma db push && npm run dev` -> `http://localhost:3001`

Z kořene repozitáře lze použít `npm run dev` pro souběžný start backendu a frontendu.

## Produkční build
- `npm run build` vytvoří `dist/`
- `npm run start:prod` spustí buildnutou verzi z `dist/index.js`
- Z kořene repozitáře lze použít `npm run build` pro build backendu i frontendu

## Stav API
Backend je funkční REST API. Server je v [backend/src/index.ts](C:\Users\shura\git_bash\pomozodpadum\backend\src\index.ts) a endpointy jsou rozdělené do `src/routes/`, `src/controllers/` a `src/services/`.

Statická edukační data v `src/data/` zahrnují i ekologický slovníček v `src/data/glossary.ts`, který napájí read-only endpointy pro seznam pojmů, fulltextové hledání a detail pojmu.

## LLM architektura
- `src/services/aiService.ts` obsahuje doménovou logiku analýzy odpadu a je jediné místo, které volá LLM service.
- `src/services/seasonalTipsService.ts` generuje 5 sezónních tipů pro aktuální roční období, ukládá je do 24h in-memory cache a při chybě nebo chybějící konfiguraci vrací fallback data.
- `src/services/llm/llmService.ts` vrací aktivní implementaci LLM adapteru.
- `src/services/llm/openAiLlmAdapter.ts` obsahuje jedinou přímou integraci na OpenAI SDK.
- Provider-specific konfigurace se načítá z environment variables `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_TEMPERATURE` a `OPENAI_MAX_TOKENS`.
- Při výměně providera má stačit změnit implementaci adapteru nebo factory v `src/services/llm/`.
- Chyby při konfiguraci, prázdné odpovědi nebo selhání API se převádějí na aplikační chyby a vracejí se přes centrální error handler.

## Struktura API endpointů
| Metoda | Endpoint | Popis |
|--------|----------|-------|
| GET | /api/health | Health check |
| POST | /api/analyze | Analýza fotky odpadu (AI) |
| GET | /api/waste/:id | Detail odpadu |
| GET | /api/history | Seznam historie skenů |
| DELETE | /api/history/:id | Smazání záznamu z historie |
| POST | /api/corrections | Odeslání korekce |
| GET | /api/tips/today | Střídavě denní nebo sezónní tip pro dnešek |
| GET | /api/tips/seasonal | 5 sezónních tipů pro aktuální období |
| GET | /api/tips | Seznam všech tipů |
| GET | /api/stats | Statistiky uživatele |
| GET | /api/containers | Průvodce tříděním - všechny kontejnery |
| GET | /api/containers/:type | Detail kontejneru |
| GET | /api/catalog | Katalog odpadu s fulltextem a filtry podle písmene a kategorie |
| GET | /api/catalog/:id | Detail položky katalogu odpadu |
| GET | /api/glossary | Ekologický slovníček seřazený abecedně |
| GET | /api/glossary/search?q=... | Fulltextové hledání ve slovníčku podle názvu a definice |
| GET | /api/glossary/:id | Detail pojmu ze slovníčku |
| DELETE | /api/history | Smazání celé historie při `confirm=true` |
| GET | /api/corrections | Seznam korekcí |

## Databázové schema
- `WasteRecord`: ukládá rozpoznaný odpad, primární kontejner, popis, obrázek, instrukce, složení, zábavný fakt, podobné odpady a čas skenu.
- `UserCorrection`: ukládá uživatelské korekce rozpoznání odpadu a kontejneru.
- `DailyTip`: ukládá edukační denní tipy pro uživatele.
- Sezónní tipy se neukládají do databáze. Zdroj je LLM + 24h cache + fallback data v `src/data/seasonalTips.ts`.

Schema je definované v [backend/prisma/schema.prisma](C:\Users\shura\git_bash\pomozodpadum\backend\prisma\schema.prisma).

## Jak přidat nový endpoint
1. Vytvoř route v `src/routes/`.
2. Vytvoř controller v `src/controllers/`.
3. Pokud je potřeba, přidej service v `src/services/`.
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

Používej pouze environment variables. NIKDY necommituj `.env`, API klíče ani jiné secrets. Šablona patří do `.env.example`.

## Mock režim
Pokud `OPENAI_API_KEY` chybí nebo má šablonovou hodnotu, `src/services/aiService.ts` vrací mock analýzu odpadu. Sezónní tipy v tomtéž režimu použijí statický fallback dataset rozdělený po 5 tipech pro jaro, léto, podzim a zimu.

## Security middleware
- `helmet` přidává bezpečnostní HTTP hlavičky
- globální rate limiting je 100 požadavků za 15 minut na IP
- `/api/analyze` má zvláštní limit 10 požadavků za 15 minut na IP
- validace vstupu je sdílená v `src/middleware/validate.ts`

## uploads/
Složka `uploads/` obsahuje nahrané fotky, je v `.gitignore` a má se čistit periodicky.

## Bezpečnostní pravidla
- NIKDY necommituj `.env` soubory, API klíče ani jiné citlivé údaje.
- Všechny secrets musí jít přes environment variables.
- `.env.example` musí obsahovat pouze šablony bez reálných hodnot.

## Údržba dokumentace
Pokud přidáš novou funkci, endpoint nebo změníš strukturu projektu, aktualizuj příslušný `AGENTS.md` soubor.
