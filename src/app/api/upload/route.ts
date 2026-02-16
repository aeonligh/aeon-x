import { NextRequest, NextResponse } from 'next/server';
import { parsePDF } from '@/lib/pdf-parser';
import { classifyTopic } from '@/lib/topic-classifier';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parsedQuestions = await parsePDF(buffer);

    const savedQuestions = [];
    for (const q of parsedQuestions) {
      const topicId = await classifyTopic(q.text);
      
      const saved = await prisma.question.create({
        data: {
          text: q.text,
          optionA: q.options.A,
          optionB: q.options.B,
          optionC: q.options.C,
          optionD: q.options.D,
          correctAnswer: q.correctAnswer,
          topicId: topicId,
          explanation: `This is a ${q.correctAnswer} question based on pharmacy principles.`, // Placeholder explanation
        },
      });
      savedQuestions.push(saved);
    }

    return NextResponse.json({ 
      message: `Successfully uploaded ${savedQuestions.length} questions`,
      count: savedQuestions.length 
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
