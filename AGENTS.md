# Pomoz Odpadum

## Prehled projektu
Pomoz Odpadum je mobilne orientovana webova aplikace pro rozpoznavani odpadu z fotek pomoci AI. Aplikace je urcena pro ceske uzivatele. Uzivatel vyfoti nebo nahraje fotku odpadu, AI rozpozna predmet a precte etiketu, aplikace poradi kam odpad patri, zobrazi barvu kontejneru a instrukce, ulozi zaznam do historie a edukuje pomoci dennih tipuu.

## Struktura repozitare
```text
/
 frontend/          # React + Vite + TypeScript + Tailwind CSS
 backend/           # Node.js + Express + TypeScript + SQLite (Prisma)
 AGENTS.md          # Tento soubor - prehled projektu
 .gitignore
```

## Jak spustit projekt
- Frontend: `cd frontend && npm install && npm run dev` -> `http://localhost:5173` nebo `http://localhost:8080`
- Backend: `cd backend && npm install && npx prisma generate && npx prisma db push && npm run dev` -> `http://localhost:3001`
- Databaze seed: `cd backend && npm run db:seed`

## Konvence
- Jazyk kodu: anglictina pro nazvy promennych, funkci, komponent a souboru.
- Jazyk UI: cestina pro texty, hlasky, labely a uzivatelsky obsah.
- Commity: anglicky, strucne, konvencni format `feat:`, `fix:`, `docs:`, `chore:`.

## Bezpecnostni pravidla
- NIKDY necommituj soubory `.env` ani API klice.
- Soubory `.env` musi byt v `.gitignore`.
- Pouzivej environment variables pro vsechny secrets, vcetne API klicu a connection stringu.
- Soubor `.env.example` obsahuje pouze sablonu bez skutecnych hodnot.

## API architektura
Backend pouziva REST API s prefixem `/api/`, komunikace probiha pres JSON a CORS je povoleny pro frontend originy.

## Datove typy
Sdilene typy jsou definovany v [backend/src/types/index.ts](C:\Users\shura\pomozodpadum\backend\src\types\index.ts). Klicove typy jsou `ContainerType`, `WasteItem`, `DailyTip` a `UserCorrection`.

## Poznamky ke stavu projektu
- `frontend/` je aktualne minimalni Vite + React aplikace; cilova struktura je popsana detailne v [frontend/AGENTS.md](C:\Users\shura\pomozodpadum\frontend\AGENTS.md).
- `backend/` ma aktualne implementovany zaklad serveru, middleware a `GET /api/health`; planovane endpointy jsou popsane v [backend/AGENTS.md](C:\Users\shura\pomozodpadum\backend\AGENTS.md).

## Udrzba dokumentace
Pokud pridas novou funkci, endpoint nebo zmenis strukturu projektu, aktualizuj prislusny `AGENTS.md` soubor.
