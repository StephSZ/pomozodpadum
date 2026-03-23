# Pomoz Odpadum

## Prehled projektu
Pomoz Odpadum je mobilne orientovana webova aplikace pro rozpoznavani odpadu z fotek pomoci AI. Aplikace je urcena pro ceske uzivatele. Uzivatel vyfoti nebo nahraje fotku odpadu, AI rozpozna predmet a precte etiketu, aplikace poradi kam odpad patri, zobrazi barvu kontejneru a instrukce, ulozi zaznam do historie a edukuje pomoci dennih tipuu.

## Struktura repozitare
```text
/
 frontend/          # React + Vite + TypeScript
 backend/           # Node.js + Express + TypeScript + SQLite (Prisma)
 AGENTS.md          # Tento soubor - prehled projektu
 .gitignore
```

## Jak spustit projekt
- Frontend: `cd frontend && npm install && npm run dev` -> `http://localhost:5173` nebo `http://localhost:8080`
- Backend: `cd backend && npm install && npx prisma generate && npx prisma db push && npm run dev` -> `http://localhost:3001`
- Databaze seed: `cd backend && npm run db:seed`
- Obe casti najednou z korene: `npm install` a potom `npm run dev`
- Produkcni build obou casti: `npm run build`

## Konvence
- Jazyk kodu: anglictina pro nazvy promennych, funkci, komponent a souboru.
- Jazyk UI: cestina pro texty, hlasky, labely a uzivatelsky obsah.
- Commity: anglicky, strucne, konvencni format `feat:`, `fix:`, `docs:`, `chore:`.

## Bezpecnostni pravidla
- NIKDY necommituj soubory `.env` ani API klice.
- Soubory `.env` musi byt v `.gitignore`.
- Pouzivej environment variables pro vsechny secrets, vcetne API klicu a connection stringu.
- Soubor `.env.example` obsahuje pouze sablonu bez skutecnych hodnot.
- Backend pouziva `helmet`, globalni rate limiting 100 pozadavku za 15 minut na IP a zvlastni limit 10 pozadavku za 15 minut pro `/api/analyze`.

## API architektura
Backend pouziva REST API s prefixem `/api/`, komunikace probiha pres JSON a CORS je v developmentu povoleny pro `localhost:5173`, `localhost:8080` a `localhost:3000`. V produkci je povolena pouze domena z `FRONTEND_URL`.

LLM komunikace je abstrahovana pouze v backendu. Domnova AI logika vola `backend/src/services/aiService.ts`, ta pouziva `backend/src/services/llm/llmService.ts` a konkretni provider adapter. Aktualne je vychozi adapter OpenAI, ale zbytek aplikace nema volat OpenAI SDK naprimo.

## Environment variables
- Backend: `PORT`, `DATABASE_URL`, `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_TEMPERATURE`, `OPENAI_MAX_TOKENS`, `FRONTEND_URL`
- Frontend: `VITE_API_URL`

## Datove typy
Sdilene typy jsou definovany v [backend/src/types/index.ts](C:\Users\shura\pomozodpadum\backend\src\types\index.ts). Klicove typy jsou `ContainerType`, `WasteItem`, `DailyTip` a `UserCorrection`.

## Poznamky ke stavu projektu
- `frontend/` obsahuje funkcni SPA s routami `/`, `/scan`, `/waste/:id`, `/history`, `/stats` a `/info`. Detaily jsou v [frontend/AGENTS.md](C:\Users\shura\pomozodpadum\frontend\AGENTS.md).
- `backend/` obsahuje kompleti REST API, mock rezim bez OpenAI klice, rate limiting, `helmet`, validaci vstupu, LLM adapter vrstvu a produkcni build. Detaily jsou v [backend/AGENTS.md](C:\Users\shura\pomozodpadum\backend\AGENTS.md).

## Udrzba dokumentace
Pokud pridas novou funkci, endpoint nebo zmenis strukturu projektu, aktualizuj prislusny `AGENTS.md` soubor.
