import { prisma } from './prisma';

export async function classifyTopic(questionText: string): Promise<string> {
  const topics = await prisma.topic.findMany();
  
  const keywords: Record<string, string[]> = {
    'Pharmacology': ['drug', 'mechanism', 'receptor', 'action', 'side effect', 'pharmacokinetics', 'pharmacodynamics'],
    'Pharmaceutical Chemistry': ['structure', 'synthesis', 'chemical', 'molecule', 'assay', 'purity'],
    'Pharmacognosy': ['plant', 'herb', 'natural', 'extract', 'alkaloid', 'glycoside', 'botanical'],
    'Pharmaceutics': ['dosage', 'formulation', 'tablet', 'capsule', 'suspension', 'stability', 'excipient'],
    'Clinical Pharmacy': ['patient', 'hospital', 'therapy', 'diagnosis', 'interaction', 'dose', 'counseling'],
    'Pharmaceutical Microbiology': ['bacteria', 'virus', 'sterile', 'antibiotic', 'microorganism', 'infection'],
    'Forensic Pharmacy': ['law', 'ethics', 'regulation', 'poison', 'act', 'narcotic'],
  };

  const text = questionText.toLowerCase();
  
  for (const [topicName, words] of Object.entries(keywords)) {
    if (words.some(word => text.includes(word))) {
      const topic = topics.find(t => t.name === topicName);
      if (topic) return topic.id;
    }
  }

  // Default to a generic topic or the first one if no match
  return topics[0]?.id || '';
}
