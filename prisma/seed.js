const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
  datasourceUrl: 'file:./dev.db'
})

async function main() {
  const topics = [
    { name: 'Pharmacology', description: 'Study of drugs and their actions on living systems.' },
    { name: 'Pharmaceutical Chemistry', description: 'Chemistry of drug design and development.' },
    { name: 'Pharmacognosy', description: 'Study of medicinal drugs derived from plants or other natural sources.' },
    { name: 'Pharmaceutics', description: 'Science of dosage form design.' },
    { name: 'Clinical Pharmacy', description: 'Pharmacy practice in clinical settings.' },
    { name: 'Pharmaceutical Microbiology', description: 'Study of microorganisms related to the manufacture of pharmaceuticals.' },
    { name: 'Forensic Pharmacy', description: 'Application of pharmacy knowledge to legal issues.' },
  ]

  for (const topic of topics) {
    await prisma.topic.upsert({
      where: { name: topic.name },
      update: {},
      create: topic,
    })
  }

  console.log('Seed completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
