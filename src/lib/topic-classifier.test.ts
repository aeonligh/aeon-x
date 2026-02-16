import { describe, it, expect, vi } from 'vitest';
import { classifyTopic } from './topic-classifier';

// Mock Prisma
vi.mock('./prisma', () => ({
  prisma: {
    topic: {
      findMany: vi.fn().mockResolvedValue([
        { id: '1', name: 'Pharmacology' },
        { id: '2', name: 'Pharmaceutical Chemistry' }
      ])
    }
  }
}));

describe('Topic Classifier', () => {
  it('should classify pharmacology questions correctly', async () => {
    const topicId = await classifyTopic('What is the mechanism of action of this drug?');
    expect(topicId).toBe('1');
  });

  it('should classify pharmaceutical chemistry questions correctly', async () => {
    const topicId = await classifyTopic('What is the chemical structure of aspirin?');
    expect(topicId).toBe('2');
  });

  it('should return default topic if no match found', async () => {
    const topicId = await classifyTopic('Unknown subject');
    expect(topicId).toBe('1');
  });
});
