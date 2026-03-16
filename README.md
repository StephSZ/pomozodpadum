# Pomoz Odpadum

Mobilne orientovana webova aplikace pro rozpoznavani odpadu z fotek pomoci AI.

## Funkce
- Vyfotit nebo nahrat fotku odpadu
- AI rozpoznani odpadu a OCR etikety
- Doporuceni spravneho kontejneru v 9 kategoriich
- Historie skenu s vyhledavanim a filtrovani
- Statistiky tridicich navyku
- Denni tipy o trideni odpadu
- Pruvodce trideni se statickymi daty o kontejnerech

## Tech Stack
- Frontend: React 18 + TypeScript + Vite + React Router
- Backend: Node.js + Express + TypeScript + SQLite + Prisma
- AI: OpenAI GPT-4o Vision API

## Spusteni

### Pozadavky
- Node.js 18+
- npm
- OpenAI API klic je volitelny; bez nej backend automaticky pouzije mock analyzu

### Instalace
```bash
# Backend
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run db:seed

# Frontend
cd ../frontend
npm install
```

### Development
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

### Obe casti najednou
```bash
npm install
npm run dev
```

### Produkcni build
```bash
npm run build

# Backend produkcne
cd backend && npm run start:prod
```

## Environment variables

### Backend
- `PORT`
- `DATABASE_URL`
- `OPENAI_API_KEY`
- `FRONTEND_URL`

### Frontend
- `VITE_API_URL`

## Mock rezim
Pokud `OPENAI_API_KEY` neni nastaveny nebo obsahuje sablonovou hodnotu, backend vraci mock analyzu odpadu. To umoznuje otestovat cely flow bez pristupu k OpenAI API.
