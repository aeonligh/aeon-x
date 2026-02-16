import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const topicId = searchParams.get('topicId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!topicId) {
      return NextResponse.json({ error: 'Topic ID is required' }, { status: 400 });
    }

    // Time-based reinforcement rule: 24-72 hours
    const now = new Date();
    const minDelay = new Date(now.getTime() - 72 * 60 * 60 * 1000);
    const maxDelay = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // 1. Get questions previously incorrect AND seen between 24-72 hours ago
    const reinforcementQuestions = await prisma.question.findMany({
      where: {
        topicId: topicId,
        userProgress: {
          some: {
            status: 'INCORRECT',
            lastSeen: {
              gte: minDelay,
              lte: maxDelay
            }
          }
        }
      },
      take: Math.floor(limit * 0.2), // 20% dedicated to 24-72h reinforcement
    });

    // 2. Get other weak questions (any incorrect)
    const otherWeakQuestions = await prisma.question.findMany({
      where: {
        topicId: topicId,
        userProgress: {
          some: { status: 'INCORRECT' }
        },
        NOT: {
          id: { in: reinforcementQuestions.map(q => q.id) }
        }
      },
      take: Math.floor(limit * 0.2), // another 20%
    });

    const totalWeak = [...reinforcementQuestions, ...otherWeakQuestions];

    // 3. Get random questions to fill the rest
    const otherQuestions = await prisma.question.findMany({
      where: {
        topicId: topicId,
        NOT: {
          id: { in: totalWeak.map(q => q.id) }
        }
      },
      take: limit - totalWeak.length,
    });

    const questions = [...totalWeak, ...otherQuestions].sort(() => Math.random() - 0.5);

    return NextResponse.json(questions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
