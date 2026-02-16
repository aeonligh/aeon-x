import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const topics = await prisma.topic.findMany({
      include: {
        _count: {
          select: { questions: true }
        }
      }
    });

    const topicsWithStats = await Promise.all(topics.map(async (topic) => {
      const incorrectQuestions = await prisma.userProgress.count({
        where: {
          question: { topicId: topic.id },
          status: 'INCORRECT'
        }
      });

      const totalAttempted = await prisma.userProgress.count({
        where: {
          question: { topicId: topic.id }
        }
      });

      let status = 'Not Started';
      if (totalAttempted > 0) {
        const accuracy = (totalAttempted - incorrectQuestions) / totalAttempted;
        if (accuracy > 0.8) status = 'Mastered';
        else if (accuracy > 0.5) status = 'Improving';
        else status = 'Weak';
      }

      return {
        ...topic,
        questionCount: topic._count.questions,
        status,
        failureRisk: incorrectQuestions > (topic._count.questions * 0.2)
      };
    }));

    return NextResponse.json(topicsWithStats);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
