import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dailyTips = [
  {
    id: "daily-tip-1",
    emoji: "💡",
    title: "Víte, že...?",
    content:
      "Hliníkovou fólii vyčistěte od zbytků jídla a pak patří do kontejneru na kovy.",
    source: "samosebou.cz",
  },
  {
    id: "daily-tip-2",
    emoji: "♻️",
    title: "Recyklační tip",
    content:
      "Z 30 PET lahví se dá vyrobit fleecová bunda. Sešlápněte je a sundejte víčko!",
    source: "samosebou.cz",
  },
  {
    id: "daily-tip-3",
    emoji: "📦",
    title: "Složený odpad",
    content:
      "Krabici od pizzy rozřízněte. Čistou část dejte do papíru, mastnou do směsného odpadu.",
    source: "samosebou.cz",
  },
  {
    id: "daily-tip-4",
    emoji: "🔋",
    title: "Nebezpečný odpad",
    content:
      "Baterie nikdy nepatří do směsného odpadu. Odevzdejte je na místech zpětného odběru.",
    source: "samosebou.cz",
  },
  {
    id: "daily-tip-5",
    emoji: "🧴",
    title: "Speciální odpad",
    content:
      "Přepálený olej nalijte do PET lahve a odevzdejte ho do sběru olejů.",
    source: "samosebou.cz",
  },
  {
    id: "daily-tip-6",
    emoji: "👟",
    title: "Textilní odpad",
    content:
      "Funkční boty patří do kontejneru na textil. Značně zničené boty dejte do směsného odpadu.",
    source: "samosebou.cz",
  },
  {
    id: "daily-tip-7",
    emoji: "🌿",
    title: "Bio tip",
    content: "Kávový filtr i se sedlinou můžete dát do bioodpadu.",
    source: "samosebou.cz",
  },
] as const;

async function main() {
  for (const tip of dailyTips) {
    await prisma.dailyTip.upsert({
      where: { id: tip.id },
      update: {
        title: tip.title,
        content: tip.content,
        emoji: tip.emoji,
        source: tip.source,
      },
      create: tip,
    });
  }

  console.log(`Seeded ${dailyTips.length} daily tips.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
