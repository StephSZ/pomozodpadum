import type { Season, TipResponse } from "../types";

type SeasonalTipSeed = Omit<TipResponse, "type" | "season" | "aiGenerated">;

export const seasonalTipFallbacks: Record<Season, SeasonalTipSeed[]> = {
  spring: [
    {
      id: "seasonal-spring-1",
      title: "Jarní úklid s rozdělením",
      content:
        "Při jarním úklidu oddělte textil, elektro a nebezpečný odpad zvlášť. Nepatří do směsného odpadu jen proto, že se uklízí najednou.",
      emoji: "🌱",
      source: "fallback",
    },
    {
      id: "seasonal-spring-2",
      title: "Sazenice bez plastů",
      content:
        "Plastové kelímky od sadby vytřiďte do plastu jen čisté. Zbytky hlíny a organického materiálu nejprve vyklepejte do bioodpadu nebo kompostu.",
      emoji: "🪴",
      source: "fallback",
    },
    {
      id: "seasonal-spring-3",
      title: "Barvy a chemie po renovaci",
      content:
        "Zbytky barev, laků a ředidel po jarních opravách odevzdejte jako nebezpečný odpad. Do běžné popelnice ani do kanalizace nepatří.",
      emoji: "🎨",
      source: "fallback",
    },
    {
      id: "seasonal-spring-4",
      title: "Velikonoční obaly",
      content:
        "Alobal od čokolád a kovové fólie třiďte do kovů, papírové krabičky do papíru. Mastné nebo silně znečištěné části patří do směsného odpadu.",
      emoji: "🐣",
      source: "fallback",
    },
    {
      id: "seasonal-spring-5",
      title: "Semena a sáčky",
      content:
        "Papírové sáčky od semínek dejte do papíru, pokud nejsou laminované. Lesklé vícevrstvé obaly obvykle patří do směsného odpadu.",
      emoji: "🌼",
      source: "fallback",
    },
  ],
  summer: [
    {
      id: "seasonal-summer-1",
      title: "Grilování bez chyb",
      content:
        "Jednorázové hliníkové misky a čistý alobal patří do kovů. Pokud jsou silně mastné a plné zbytků jídla, patří do směsného odpadu.",
      emoji: "🔥",
      source: "fallback",
    },
    {
      id: "seasonal-summer-2",
      title: "PET lahve na cestách",
      content:
        "Po výletě PET lahev sešlápněte a uzavřete víčkem. V kontejneru zabere méně místa a svoz je efektivnější.",
      emoji: "🧴",
      source: "fallback",
    },
    {
      id: "seasonal-summer-3",
      title: "Opalovací krémy a spreje",
      content:
        "Prázdné plastové obaly od opalovacích krémů patří do plastu. Tlakové nádoby se zbytkem obsahu odevzdejte ve sběrném dvoře.",
      emoji: "☀️",
      source: "fallback",
    },
    {
      id: "seasonal-summer-4",
      title: "Meloun a bioodpad",
      content:
        "Slupky z ovoce patří do bioodpadu, pokud to místní systém umožňuje. Gumové pásky a samolepky z nich ale odstraňte.",
      emoji: "🍉",
      source: "fallback",
    },
    {
      id: "seasonal-summer-5",
      title: "Festivalový odpad",
      content:
        "Kelímky, plechovky a papírové obaly třiďte hned na místě. Smíchaný odpad z pikniku nebo festivalu se dotřiďuje mnohem hůř.",
      emoji: "🎪",
      source: "fallback",
    },
  ],
  autumn: [
    {
      id: "seasonal-autumn-1",
      title: "Zavařování a víčka",
      content:
        "Sklenice od zavařenin patří do skla, kovová víčka do kovů. Před tříděním je stačí vyprázdnit, není nutné je dokonale mýt.",
      emoji: "🍂",
      source: "fallback",
    },
    {
      id: "seasonal-autumn-2",
      title: "Listí není směsný odpad",
      content:
        "Listí, drobné větve a zbytky ze zahrady patří do bioodpadu nebo kompostu. Do černé popelnice tím zbytečně zaplníte kapacitu.",
      emoji: "🍁",
      source: "fallback",
    },
    {
      id: "seasonal-autumn-3",
      title: "Svíčky po Dušičkách",
      content:
        "Skleněný kalíšek od hřbitovní svíčky vytřiďte podle materiálu až po oddělení vosku a kovových částí. Znečištěné kusy často patří do směsného odpadu.",
      emoji: "🕯️",
      source: "fallback",
    },
    {
      id: "seasonal-autumn-4",
      title: "Školní sešity a obaly",
      content:
        "Papírové sešity bez plastových desek patří do papíru. Plastové obaly, fólie a euroobaly třiďte zvlášť do plastu.",
      emoji: "📚",
      source: "fallback",
    },
    {
      id: "seasonal-autumn-5",
      title: "Dýně a dekorace",
      content:
        "Přírodní podzimní dekorace lze často kompostovat, ale glitry, drátky a umělé části je nutné předem odstranit a vytřídit zvlášť.",
      emoji: "🎃",
      source: "fallback",
    },
  ],
  winter: [
    {
      id: "seasonal-winter-1",
      title: "Vánoční balicí papír",
      content:
        "Čistý balicí papír patří do papíru, ale metalický, voskovaný nebo silně třpytivý papír většinou do směsného odpadu.",
      emoji: "🎁",
      source: "fallback",
    },
    {
      id: "seasonal-winter-2",
      title: "Světýlka a elektro",
      content:
        "Nefunkční světelné řetězy patří do elektroodpadu. Nevyhazujte je do směsného odpadu ani je nerozebírejte doma na materiály.",
      emoji: "💡",
      source: "fallback",
    },
    {
      id: "seasonal-winter-3",
      title: "Ohňostroje a pyrotechnika",
      content:
        "Nevystřelenou nebo poškozenou pyrotechniku řešte jako nebezpečný odpad podle pokynů obce. Zbytky po oslavách vždy nechte nejprve vychladnout.",
      emoji: "🎆",
      source: "fallback",
    },
    {
      id: "seasonal-winter-4",
      title: "Krabice od online nákupů",
      content:
        "Kartonové krabice rozložte a výplně rozdělte podle materiálu. Bublinková fólie patří do plastu, papírové výplně do papíru.",
      emoji: "📦",
      source: "fallback",
    },
    {
      id: "seasonal-winter-5",
      title: "Tuk po smažení",
      content:
        "Použitý olej a tuk po vánočním smažení slijte do PET lahve a odneste na sběrné místo. Do dřezu ani do bioodpadu nepatří.",
      emoji: "🍳",
      source: "fallback",
    },
  ],
};
