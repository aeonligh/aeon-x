import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const submitSchema = z.object({
  topicId: z.string(),
  answers: z.record(z.string(), z.string()),
  mode: z.enum(['PRACTICE', 'EXAM']),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = submitSchema.parse(body);
    const { topicId, answers, mode } = validatedData;

    let score = 0;
    const results = [];

    for (const [questionId, selectedAnswer] of Object.entries(answers)) {
      const question = await prisma.question.findUnique({
        where: { id: questionId }
      });

      if (!question) continue;

      const isCorrect = question.correctAnswer === selectedAnswer;
      if (isCorrect) score++;

      // Upsert User Progress
      await prisma.userProgress.upsert({
        where: { questionId },
        update: {
          status: isCorrect ? 'CORRECT' : 'INCORRECT',
          attempts: { increment: 1 },
          lastSeen: new Date(),
        },
        create: {
          questionId,
          status: isCorrect ? 'CORRECT' : 'INCORRECT',
          attempts: 1,
          lastSeen: new Date(),
        }
      });

      results.push({
        questionId,
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation
      });
    }

    const session = await prisma.testSession.create({
      data: {
        topicId,
        score,
        totalItems: Object.keys(answers).length,
        mode,
        endTime: new Date(),
      }
    });

    return NextResponse.json({
      sessionId: session.id,
      score,
      total: Object.keys(answers).length,
      results
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
