# Pomoz Odpadum

## Přehled projektu
Pomoz Odpadum je mobilně orientovaná webová aplikace pro rozpoznávání odpadu z fotek pomocí AI. Aplikace je určená pro české uživatele. Uživatel vyfotí nebo nahraje fotku odpadu, AI rozpozná předmět a přečte etiketu, aplikace poradí kam odpad patří, zobrazí barvu kontejneru a instrukce, uloží záznam do historie a edukuje pomocí denních tipů.

## Struktura repozitáře
```text
/
 frontend/          # React + Vite + TypeScript
 backend/           # Node.js + Express + TypeScript + SQLite (Prisma)
 docker-compose.yml # Docker Compose pro produkční/společné spuštění
 AGENTS.md          # Tento soubor - přehled projektu
 .gitignore
```

## Jak spustit projekt
- Frontend: `cd frontend && npm install && npm run dev` -> `http://localhost:5173` nebo `http://localhost:8080`
- Backend: `cd backend && npm install && npx prisma generate && npx prisma db push && npm run dev` -> `http://localhost:3001`
- Databáze seed: `cd backend && npm run db:seed`
- Obě části najednou z kořene: `npm install` a potom `npm run dev`
- Produkční build obou částí: `npm run build`
- Docker konfigurace je připravená přes `backend/Dockerfile`, `frontend/Dockerfile` a `docker-compose.yml` v kořeni; produkční nasazení používá Traefik jako reverse proxy, frontend běží přes nginx a `/api` provoz je směrovaný na backend

## Konvence
- Jazyk kódu: angličtina pro názvy proměnných, funkcí, komponent a souborů.
- Jazyk UI: čeština pro texty, hlášky, labely a uživatelský obsah.
- Commity: anglicky, stručně, konvenční formát `feat:`, `fix:`, `docs:`, `chore:`.

## Bezpečnostní pravidla
- NIKDY necommituj soubory `.env` ani API klíče.
- Soubory `.env` musí být v `.gitignore`.
- Používej environment variables pro všechny secrets, včetně API klíčů a connection stringů.
- Soubor `.env.example` obsahuje pouze šablonu bez skutečných hodnot.
- Backend používá `helmet`, globální rate limiting 100 požadavků za 15 minut na IP a zvláštní limit 10 požadavků za 15 minut pro `/api/analyze`.

## API architektura
Backend používá REST API s prefixem `/api/`, komunikace probíhá přes JSON a CORS je v developmentu povolený pro `localhost:5173`, `localhost:8080` a `localhost:3000`. V produkci je povolená pouze doména z `FRONTEND_URL`.

LLM komunikace je abstrahovaná pouze v backendu. Doménová AI logika volá `backend/src/services/aiService.ts`, ta používá `backend/src/services/llm/llmService.ts` a konkrétní provider adapter. Aktuálně je výchozí adapter OpenAI, ale zbytek aplikace nemá volat OpenAI SDK napřímo.

## Environment variables
- Backend: `PORT`, `DATABASE_URL`, `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_TEMPERATURE`, `OPENAI_MAX_TOKENS`, `FRONTEND_URL`
- Frontend: `VITE_API_URL`

## Datové typy
Sdílené typy jsou definované v [backend/src/types/index.ts](C:\Users\shura\git_bash\pomozodpadum\backend\src\types\index.ts). Klíčové typy jsou `ContainerType`, `WasteItem`, `DailyTip` a `UserCorrection`.

## Poznámky ke stavu projektu
- `frontend/` obsahuje funkční SPA s routami `/`, `/scan`, `/waste/:id`, `/history`, `/stats` a `/info`. Domovská stránka načítá `/api/tips/today` a informační stránka zobrazuje sezónní tipy z `/api/tips/seasonal`. Detaily jsou v [frontend/AGENTS.md](C:\Users\shura\git_bash\pomozodpadum\frontend\AGENTS.md).
- `backend/` obsahuje kompletní REST API, mock režim bez OpenAI klíče, rate limiting, `helmet`, validaci vstupu, LLM adapter vrstvu a produkční build. `backend/src/services/seasonalTipsService.ts` generuje sezónní tipy přes stávající LLM abstrakci, cachuje je na 24 hodin a při nedostupnosti AI používá statický fallback dataset. Backend nově obsahuje také ekologický slovníček dostupný přes `/api/glossary`, `/api/glossary/search?q=...` a `/api/glossary/:id`. Detaily jsou v [backend/AGENTS.md](C:\Users\shura\git_bash\pomozodpadum\backend\AGENTS.md).
- Produkční Docker nasazení používá multi-stage build pro backend i frontend, `docker compose` síť mezi kontejnery a pojmenované volume `backend_data` a `backend_uploads` pro SQLite data a uploady.
- `docker-compose.yml` nově obsahuje službu `traefik` s entrypointy `web` (80) a `websecure` (443), automatickým HTTP -> HTTPS redirectem, Let's Encrypt ACME HTTP challenge a persistentním volume `letsencrypt` pro `/letsencrypt/acme.json`.
- Produkční routing je definovaný v `traefik/dynamic.yml`; `https://zhao.aibr.cz` směřuje na frontend a `https://zhao.aibr.cz/api` na backend. Traefik labels zůstávají u služeb připravené, ale v aktuálním serverovém prostředí je routing aktivně řešený přes file provider kvůli nekompatibilitě Traefik Docker provideru s místní verzí Docker Engine.
- Služby `frontend`, `backend` i `traefik` sdílí síť `traefik-network` a mají `restart: always`.

## Údržba dokumentace
Pokud přidáš novou funkci, endpoint nebo změníš strukturu projektu, aktualizuj příslušný `AGENTS.md` soubor.
