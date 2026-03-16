import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dailyTips = [
  {
    id: "daily-tip-1",
    emoji: "💡",
    title: "Vite, ze...?",
    content:
      "Hlinikovou folii vycistete od zbytku jidla a pak patri do kontejneru na kovy.",
    source: "samosebou.cz",
  },
  {
    id: "daily-tip-2",
    emoji: "♻️",
    title: "Recyklacni tip",
    content:
      "Z 30 PET lahvi se da vyrobit fleecova bunda. Seslapnete je a sundejte vicko!",
    source: "samosebou.cz",
  },
  {
    id: "daily-tip-3",
    emoji: "📦",
    title: "Slozeny odpad",
    content:
      "Krabici od pizzy rozriznete. Cistou cast dejte do papiru, mastnou do smesneho odpadu.",
    source: "samosebou.cz",
  },
  {
    id: "daily-tip-4",
    emoji: "🔋",
    title: "Nebezpecny odpad",
    content:
      "Baterie nikdy nepatri do smesneho odpadu. Odevzdejte je na mistech zpetneho odberu.",
    source: "samosebou.cz",
  },
  {
    id: "daily-tip-5",
    emoji: "🧴",
    title: "Specialni odpad",
    content:
      "Prepaleny olej nalijte do PET lahve a odevzdejte ho do sberu oleju.",
    source: "samosebou.cz",
  },
  {
    id: "daily-tip-6",
    emoji: "👟",
    title: "Textilni odpad",
    content:
      "Funkcni boty patri do kontejneru na textil. Znacne znicene boty dejte do smesneho odpadu.",
    source: "samosebou.cz",
  },
  {
    id: "daily-tip-7",
    emoji: "🌿",
    title: "Bio tip",
    content: "Kavovy filtr i se sedlinou muzete dat do bioodpadu.",
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
