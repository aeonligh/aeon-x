const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const topic = await prisma.topic.findUnique({ where: { name: 'Pharmacology' } })
  if (!topic) return;

  const questions = [
    {
      text: 'Which of the following is a primary mechanism of action for Penicillin?',
      optionA: 'Inhibition of protein synthesis',
      optionB: 'Inhibition of cell wall synthesis',
      optionC: 'Inhibition of DNA replication',
      optionD: 'Disruption of cell membrane',
      correctAnswer: 'B',
      explanation: 'Penicillin works by inhibiting the cross-linking of peptidoglycan in the bacterial cell wall.',
      topicId: topic.id
    },
    {
      text: 'Atropine is classified as a:',
      optionA: 'Muscarinic agonist',
      optionB: 'Muscarinic antagonist',
      optionC: 'Nicotinic agonist',
      optionD: 'Adrenergic antagonist',
      correctAnswer: 'B',
      explanation: 'Atropine is a competitive antagonist of muscarinic acetylcholine receptors.',
      topicId: topic.id
    },
    {
      text: 'Which route of administration has 100% bioavailability?',
      optionA: 'Oral',
      optionB: 'Subcutaneous',
      optionC: 'Intravenous',
      optionD: 'Intramuscular',
      correctAnswer: 'C',
      explanation: 'Intravenous administration bypasses absorption barriers and first-pass metabolism.',
      topicId: topic.id
    }
  ]

  for (const q of questions) {
    await prisma.question.create({ data: q })
  }

  console.log('Test questions added.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
