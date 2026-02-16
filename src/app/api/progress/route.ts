import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const totalQuestions = await prisma.question.count();
    const totalAttempted = await prisma.userProgress.count();
    const totalCorrect = await prisma.userProgress.count({
      where: { status: 'CORRECT' }
    });

    const topicStats = await prisma.topic.findMany({
      include: {
        _count: {
          select: { questions: true }
        }
      }
    });

    const masteryByTopic = await Promise.all(topicStats.map(async (topic) => {
      const correct = await prisma.userProgress.count({
        where: {
          question: { topicId: topic.id },
          status: 'CORRECT'
        }
      });
      
      const total = topic._count.questions;
      const mastery = total > 0 ? (correct / total) * 100 : 0;

      return {
        name: topic.name,
        mastery: Math.min(Math.round(mastery), 100),
        total
      };
    }));

    return NextResponse.json({
      overallMastery: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
      totalQuestions,
      totalAttempted,
      masteryByTopic
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
