# Frontend Agents

## Tech stack
React 18, TypeScript, Vite, Tailwind CSS 3, React Router v6, Recharts a Lucide React icons.

## Spusteni
`npm install && npm run dev` -> `http://localhost:5173` nebo `http://localhost:8080`

Z korene repozitare lze pouzit `npm run dev` pro soubezny start backendu a frontendu.

## Produkcni build
`npm run build` vytvori produkcni vystup. API base URL se bere z `VITE_API_URL`. Pro produkci udrzujte realnou hodnotu mimo Git a v `.env.example` pouze sablonu.

## Aktualni stav
Aktualni frontend obsahuje zatim minimalni Vite + React kostru v [frontend/src/main.tsx](C:\Users\shura\pomozodpadum\frontend\src\main.tsx) a [frontend/src/Index.tsx](C:\Users\shura\pomozodpadum\frontend\src\Index.tsx). Nize je cilova doporucena struktura, kterou je vhodne dodrzet pri dalsim rozvoji aplikace.

## Struktura komponent
- `pages/` - stranky aplikace
- `components/` - sdilene komponenty
- `components/ui/` - low-level UI primitives
- `hooks/` - custom React hooks
- `context/` - React Context providery
- `lib/` - helpery a integrace, vcetne API klienta
- `data/` - mock data a staticke datasety

## Stranky a routy
- `/` - domovska stranka s dennim tipem, statistikami a poslednim skenem
- `/scan` - skenovani nebo nahrani fotky
- `/waste/:id` - detail odpadu
- `/history` - historie skenu
- `/stats` - statistiky
- `/info` - informace a pruvodce trideni

## Konvence pojmenovani
- PascalCase pro React komponenty
- camelCase pro funkce a promenne
- kebab-case pro soubory CSS modulu

## State management
Pouzivej React Context, zejmena `WasteContext` a `HistoryContext`, a `localStorage` pro perzistenci klientskych dat.

## Mock data
Mock data patri do `data/` slozky nebo docasne primo do context provideru. Format dat musi odpovidat typu `WasteItem` z backendu. MVP pocita s 12 mock odpady a 7 denniimi tipy.

## API integrace
Soubor `lib/api.ts` nebo ekvivalentni vrstva ma obsahovat funkce pro komunikaci s backendem. V MVP muze pouzivat mock data, po napojeni backendu ma volat realne endpointy.

## Environment variables
- `VITE_API_URL` - adresa backend API, napr. `http://localhost:3001/api`

## Design system
- Primarni zelena: `#16A34A`
- Accent amber: `#F59E0B`
- Podpora 9 barev kontejneru
- Karty se zaoblenim `rounded-2xl`
- Mobile-first rozlozeni

## Bezpecnostni pravidla
- NIKDY necommituj `.env` soubory, API klice ani jine secrets.
- Frontend nesmi obsahovat natvrdo zapsane produkcni klice.
- Konfiguraci pro API endpointy a podobne citlive udaje res pres environment variables.
- Pokud backend vraci `429`, frontend ma uzivateli srozumitelne oznamit, ze narazil na rate limiting.

## Udrzba dokumentace
Pokud pridas novou funkci, endpoint nebo zmenis strukturu projektu, aktualizuj prislusny `AGENTS.md` soubor.
