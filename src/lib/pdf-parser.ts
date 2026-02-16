import { PDFParse } from 'pdf-parse';

export interface ParsedQuestion {
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
  explanation?: string;
}

export async function parsePDF(buffer: Buffer): Promise<ParsedQuestion[]> {
  const parser = new PDFParse({ data: buffer });
  try {
    const textResult = await parser.getText();
    const text = textResult.text;

    const questions: ParsedQuestion[] = [];
    const questionBlocks = text.split(/\n(?=\d+\.)/);

    for (const block of questionBlocks) {
      const lines = block.trim().split('\n');
      if (lines.length < 5) continue;

      const questionText = lines[0].replace(/^\d+\.\s*/, '').trim();
      let optionA = '', optionB = '', optionC = '', optionD = '', correctAnswer = 'A', explanation = '';

      let currentSection: 'OPTIONS' | 'EXPLANATION' | 'NONE' = 'NONE';

      lines.forEach(line => {
        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith('A.')) {
          optionA = trimmedLine.replace(/^A\.\s*/, '').trim();
          currentSection = 'OPTIONS';
        } else if (trimmedLine.startsWith('B.')) {
          optionB = trimmedLine.replace(/^B\.\s*/, '').trim();
          currentSection = 'OPTIONS';
        } else if (trimmedLine.startsWith('C.')) {
          optionC = trimmedLine.replace(/^C\.\s*/, '').trim();
          currentSection = 'OPTIONS';
        } else if (trimmedLine.startsWith('D.')) {
          optionD = trimmedLine.replace(/^D\.\s*/, '').trim();
          currentSection = 'OPTIONS';
        } else if (trimmedLine.toLowerCase().startsWith('answer:')) {
          const ans = trimmedLine.replace(/^answer:\s*/i, '').trim().toUpperCase()[0];
          if (['A', 'B', 'C', 'D'].includes(ans)) correctAnswer = ans;
          currentSection = 'NONE';
        } else if (trimmedLine.toLowerCase().startsWith('explanation:')) {
          explanation = trimmedLine.replace(/^explanation:\s*/i, '').trim();
          currentSection = 'EXPLANATION';
        } else if (currentSection === 'EXPLANATION') {
          explanation += ' ' + trimmedLine;
        }
      });

      if (questionText && optionA && optionB) {
        questions.push({
          text: questionText,
          options: { A: optionA, B: optionB, C: optionC, D: optionD },
          correctAnswer,
          explanation: explanation || `This is a ${correctAnswer} question based on pharmacy principles.`
        });
      }
    }

    return questions;
  } finally {
    await parser.destroy();
  }
}
