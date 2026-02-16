import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { topicId, answers, mode } = await req.body ? await req.json() : {};

    if (!topicId || !answers) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    let score = 0;
    const results = [];

    for (const [questionId, selectedAnswer] of Object.entries(answers)) {
      const question = await prisma.question.findUnique({
        where: { id: questionId }
      });

      if (!question) continue;

      const isCorrect = question.correctAnswer === selectedAnswer;
      if (isCorrect) score++;

      // Update User Progress
      await prisma.userProgress.create({
        data: {
          questionId: questionId,
          status: isCorrect ? 'CORRECT' : 'INCORRECT',
          attempts: 1, // In a real app, we'd increment this
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
  } catch (error: any) {
    console.error('Submit error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
