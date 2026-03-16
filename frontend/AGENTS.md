# Frontend Agents

## Tech stack
React 18, TypeScript, Vite a React Router.

## Spusteni
`npm install && npm run dev` -> `http://localhost:5173` nebo `http://localhost:8080`

Z korene repozitare lze pouzit `npm run dev` pro soubezny start backendu a frontendu.

## Produkcni build
`npm run build` vytvori produkcni vystup. API base URL se bere z `VITE_API_URL`. Pro produkci udrzujte realnou hodnotu mimo Git a v `.env.example` pouze sablonu.

## Aktualni stav
Frontend je funkcni SPA nad backend API. Vstup je v [frontend/src/main.tsx](C:\Users\shura\pomozodpadum\frontend\src\main.tsx), routy jsou v [frontend/src/App.tsx](C:\Users\shura\pomozodpadum\frontend\src\App.tsx), centralni API klient v [frontend/src/lib/api.ts](C:\Users\shura\pomozodpadum\frontend\src\lib\api.ts) a stranky v `src/pages/`.

## Struktura komponent
- `pages/` - stranky aplikace
- `components.tsx` - sdilene UI bloky jako karty, loading a error stavy
- `lib/` - API klient
- `utils.ts` - cache helpery a `useAsyncData`
- `types.ts` - frontend typy odpovidajici backend API

## Stranky a routy
- `/` - domovska stranka s dennim tipem, statistikami a poslednim skenem
- `/scan` - skenovani nebo nahrani fotky
- `/waste/:id` - detail odpadu
- `/history` - historie skenu
- `/stats` - statistiky
- `/map` - mapa kontejnerů z KamTridit.cz s fallback odkazem do nového okna
- `/catalog` - katalog odpadů s fulltextem, abecedou a kategoriovými filtry
- `/info` - informace a pruvodce trideni

## Konvence pojmenovani
- PascalCase pro React komponenty
- camelCase pro funkce a promenne
- kebab-case pro soubory CSS modulu

## State management
Sdilena data se nactou pres API a lehka cache je ulozena do `localStorage`, aby frontend umel zobrazit posledni data i pri docasnem vypadku backendu.

## Mock data
Frontend nema vlastni mock datasety. Mock rezim je resen na backendu: bez `OPENAI_API_KEY` vraci `/api/analyze` mock odpad.

## API integrace
Soubor [frontend/src/lib/api.ts](C:\Users\shura\pomozodpadum\frontend\src\lib\api.ts) obsahuje volani vsech backend endpointu. Stranky nacitaji data pres API a zobrazuji loading, error i empty states.

## Environment variables
- `VITE_API_URL` - adresa backend API, napr. `http://localhost:3001/api`

## Design system
- Primarni zelena: `#16A34A`
- Accent amber: `#F59E0B`
- Podpora 9 barev kontejneru
- Zaoblene karty a mobile-first rozlozeni

## Bezpecnostni pravidla
- NIKDY necommituj `.env` soubory, API klice ani jine secrets.
- Frontend nesmi obsahovat natvrdo zapsane produkcni klice.
- Konfiguraci pro API endpointy a podobne citlive udaje res pres environment variables.
- Pokud backend vraci `429`, frontend ma uzivateli srozumitelne oznamit, ze narazil na rate limiting.

## Udrzba dokumentace
Pokud pridas novou funkci, endpoint nebo zmenis strukturu projektu, aktualizuj prislusny `AGENTS.md` soubor.
