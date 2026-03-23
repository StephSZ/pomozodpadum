export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  relatedTerms?: string[];
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: "bioodpad",
    term: "Bioodpad",
    definition:
      "Biologicky rozložitelný odpad z kuchyně, zahrady nebo veřejné zeleně. Patří sem například slupky, kávová sedlina, tráva nebo listí, pokud to místní systém sběru umožňuje.",
    relatedTerms: ["kompostování", "tříděný sběr"],
  },
  {
    id: "cirkularni-ekonomika",
    term: "Cirkulární ekonomika",
    definition:
      "Přístup, který se snaží udržet materiály a výrobky co nejdéle v oběhu. Upřednostňuje prevenci vzniku odpadu, opravy, opětovné použití a recyklaci před vyhazováním.",
    relatedTerms: ["recyklát", "upcycling", "reuse"],
  },
  {
    id: "cerny-kontejner",
    term: "Černý kontejner",
    definition:
      "Nádoba na směsný komunální odpad, tedy na to, co už nelze vytřídit do jiných složek. Patří do něj jen zbytky, které nejsou recyklovatelné ani vhodné pro sběrný dvůr.",
    relatedTerms: ["směsný komunální odpad", "tříděný sběr"],
  },
  {
    id: "eko-design",
    term: "Eko design",
    definition:
      "Navrhování výrobků s ohledem na nižší spotřebu materiálů, delší životnost a jednodušší recyklaci. Cílem je snižovat dopady na životní prostředí už ve fázi návrhu.",
    relatedTerms: ["cirkulární ekonomika", "reuse"],
  },
  {
    id: "elektroodpad",
    term: "Elektroodpad",
    definition:
      "Vyřazené elektrické a elektronické zařízení, například rychlovarná konvice, kabel nebo mobilní telefon. Odevzdává se do sběrného dvora, specializovaných boxů nebo zpětného odběru.",
    relatedTerms: ["zpětný odběr", "sběrný dvůr"],
  },
  {
    id: "greenwashing",
    term: "Greenwashing",
    definition:
      "Marketingová praxe, kdy firma nebo výrobek působí ekologičtěji, než jaká je skutečnost. Často jde o vágní tvrzení bez důkazů nebo o zdůraznění drobného ekologického detailu.",
    relatedTerms: ["cirkulární ekonomika"],
  },
  {
    id: "hazardni-odpad",
    term: "Nebezpečný odpad",
    definition:
      "Odpad obsahující látky, které mohou škodit zdraví lidí nebo přírodě, například barvy, rozpouštědla, chemikálie či některé baterie. Nevyhazuje se do běžných kontejnerů, ale odevzdává se na určených místech.",
    relatedTerms: ["sběrný dvůr", "zpětný odběr"],
  },
  {
    id: "kompost",
    term: "Kompost",
    definition:
      "Přírodní materiál vznikající rozkladem bioodpadu. Dá se využít jako kvalitní hnojivo pro půdu na zahradě nebo v komunitních kompostérech.",
    relatedTerms: ["bioodpad", "kompostování"],
  },
  {
    id: "kompostovani",
    term: "Kompostování",
    definition:
      "Proces řízeného rozkladu bioodpadu za přístupu vzduchu a mikroorganismů. Pomáhá snižovat množství směsného odpadu a vrací organickou hmotu zpět do půdy.",
    relatedTerms: ["bioodpad", "kompost"],
  },
  {
    id: "kovovy-odpad",
    term: "Kovový odpad",
    definition:
      "Kovové obaly a předměty, jako jsou plechovky, víčka nebo prázdné konzervy. V mnoha obcích se třídí do šedého kontejneru nebo společně s plasty a nápojovými kartony.",
    relatedTerms: ["tříděný sběr", "nápojový karton"],
  },
  {
    id: "mikroplasty",
    term: "Mikroplasty",
    definition:
      "Velmi malé plastové částice, které vznikají rozpadem větších plastů nebo se uvolňují z textilu či kosmetiky. Snadno se dostávají do vody, půdy i potravního řetězce.",
    relatedTerms: ["plastový odpad"],
  },
  {
    id: "napojovy-karton",
    term: "Nápojový karton",
    definition:
      "Vícevrstvý obal používaný například na mléko nebo džus. Obvykle se třídí samostatně nebo společně s plasty, podle pravidel konkrétní obce.",
    relatedTerms: ["tříděný sběr", "recyklace"],
  },
  {
    id: "plastovy-odpad",
    term: "Plastový odpad",
    definition:
      "Plastové obaly a výrobky určené k vytřídění, typicky PET lahve, fólie nebo kelímky. Před vyhozením je vhodné je vyprázdnit, případně sešlápnout, aby zabraly méně místa.",
    relatedTerms: ["mikroplasty", "recyklace", "žlutý kontejner"],
  },
  {
    id: "recyklace",
    term: "Recyklace",
    definition:
      "Zpracování odpadu na nový materiál nebo výrobek. Má smysl hlavně tehdy, když je odpad správně vytříděný a materiál není zbytečně znečištěný.",
    relatedTerms: ["recyklát", "tříděný sběr"],
  },
  {
    id: "recyklat",
    term: "Recyklát",
    definition:
      "Materiál vzniklý recyklací odpadu, který se znovu používá při výrobě. Může jít například o plastové granule, recyklovaný papír nebo stavební materiál.",
    relatedTerms: ["recyklace", "cirkulární ekonomika"],
  },
  {
    id: "reuse",
    term: "Reuse",
    definition:
      "Opětovné použití výrobku bez zásadního přepracování. Typické je darování, oprava nebo další používání obalu či věci místo jejího vyhození.",
    relatedTerms: ["upcycling", "cirkulární ekonomika"],
  },
  {
    id: "sberny-dvur",
    term: "Sběrný dvůr",
    definition:
      "Místo, kam lze odevzdat objemný, nebezpečný, elektro nebo jinak specifický odpad. Přesná pravidla přijímaných druhů odpadu se liší podle obce nebo provozovatele.",
    relatedTerms: ["elektroodpad", "nebezpečný odpad", "objemný odpad"],
  },
  {
    id: "skladkovani",
    term: "Skládkování",
    definition:
      "Ukládání odpadu na skládku bez dalšího materiálového využití. Jde o jednu z nejméně žádoucích možností nakládání s odpady, protože zabírá prostor a zatěžuje životní prostředí.",
    relatedTerms: ["směsný komunální odpad", "spalovna"],
  },
  {
    id: "skleneny-odpad",
    term: "Skleněný odpad",
    definition:
      "Skleněné lahve, sklenice a další obaly, které patří do kontejneru na sklo. Často se dělí na čiré a barevné sklo podle místních pravidel.",
    relatedTerms: ["zelený kontejner", "recyklace"],
  },
  {
    id: "smesny-komunalni-odpad",
    term: "Směsný komunální odpad",
    definition:
      "Zbytkový odpad z domácnosti, který nejde rozumně vytřídit do jiných složek. Měl by tvořit co nejmenší část domácího odpadu, pokud se třídí správně.",
    relatedTerms: ["černý kontejner", "skládkování"],
  },
  {
    id: "spalovna",
    term: "Spalovna",
    definition:
      "Zařízení na energetické využití odpadu spalováním. V Česku se často rozlišuje mezi běžnou spalovnou a moderním zařízením pro energetické využití odpadu.",
    relatedTerms: ["ZEVO", "směsný komunální odpad"],
  },
  {
    id: "trideny-sber",
    term: "Tříděný sběr",
    definition:
      "Oddělené shromažďování jednotlivých druhů odpadu podle materiálu nebo způsobu zpracování. Je základem kvalitní recyklace i nižšího množství směsného odpadu.",
    relatedTerms: ["recyklace", "žlutý kontejner", "modrý kontejner"],
  },
  {
    id: "upcycling",
    term: "Upcycling",
    definition:
      "Vytváření nového výrobku s vyšší hodnotou ze starého nebo odpadního materiálu. Na rozdíl od běžné recyklace často zachovává část původní podoby věci.",
    relatedTerms: ["reuse", "cirkulární ekonomika"],
  },
  {
    id: "vicevrstvy-obal",
    term: "Vícevrstvý obal",
    definition:
      "Obal složený z více materiálů, například plastu, papíru a hliníku. Třídění a recyklace takových obalů bývá složitější a často závisí na místním systému sběru.",
    relatedTerms: ["nápojový karton", "recyklace"],
  },
  {
    id: "zevo",
    term: "ZEVO",
    definition:
      "Zkratka pro zařízení pro energetické využití odpadu. Takové zařízení využívá nerecyklovatelný odpad k výrobě tepla a elektřiny za přísně kontrolovaných podmínek.",
    relatedTerms: ["spalovna", "směsný komunální odpad"],
  },
  {
    id: "zeleny-kontejner",
    term: "Zelený kontejner",
    definition:
      "Kontejner určený na skleněný odpad, nejčastěji na barevné sklo nebo na sklo obecně podle systému obce. Do něj nepatří keramika, zrcadla ani autosklo.",
    relatedTerms: ["skleněný odpad", "tříděný sběr"],
  },
  {
    id: "zluty-kontejner",
    term: "Žlutý kontejner",
    definition:
      "Kontejner určený hlavně na plastový odpad, někde také na kovy a nápojové kartony. Konkrétní pravidla svozu je vždy dobré ověřit podle obce nebo svozové společnosti.",
    relatedTerms: ["plastový odpad", "kovový odpad", "nápojový karton"],
  },
  {
    id: "modry-kontejner",
    term: "Modrý kontejner",
    definition:
      "Kontejner na papír, například noviny, krabice nebo kancelářský papír. Mastný, mokrý nebo jinak silně znečištěný papír do něj nepatří.",
    relatedTerms: ["tříděný sběr", "recyklace"],
  },
  {
    id: "objemny-odpad",
    term: "Objemný odpad",
    definition:
      "Rozměrné věci z domácnosti, které se nevejdou do běžné popelnice, například starý nábytek nebo matrace. Obvykle se odevzdávají do sběrného dvora nebo při speciálních svozech.",
    relatedTerms: ["sběrný dvůr", "směsný komunální odpad"],
  },
  {
    id: "zpetny-odber",
    term: "Zpětný odběr",
    definition:
      "Systém, ve kterém výrobce nebo prodejce zajišťuje převzetí vybraných výrobků po skončení jejich životnosti. Typicky se týká elektrozařízení, baterií nebo světelných zdrojů.",
    relatedTerms: ["elektroodpad", "nebezpečný odpad"],
  },
];
