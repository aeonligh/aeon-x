'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string;
}

function TestContent() {
  const { topicId } = useParams();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'PRACTICE';
  const isExam = mode === 'EXAM';
  
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(isExam ? 600 : 0); // 10 minutes for exam
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    fetch(`/api/questions?topicId=${topicId}&limit=${isExam ? 20 : 10}`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      });
  }, [topicId, isExam]);

  useEffect(() => {
    if (!isExam || loading) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExam, loading]);

  const handleSelect = (answer: string) => {
    if (isExam && answers[questions[currentIndex].id]) return; // Lock answers in Exam Mode
    
    setAnswers({ ...answers, [questions[currentIndex].id]: answer });
    if (!isExam) {
      setShowFeedback(true);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId,
          answers,
          mode
        }),
      });
      const data = await response.json();
      router.push(`/results/${data.sessionId}`);
    } catch (error) {
      console.error('Submission failed', error);
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="p-8 text-center">Loading questions...</div>;
  if (questions.length === 0) return <div className="p-8 text-center text-error font-bold">No questions found for this topic.</div>;

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = answers[currentQuestion.id];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)]">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Question {currentIndex + 1} of {questions.length}</h1>
        </div>
        <div className={`flex items-center gap-2 font-mono px-3 py-1 rounded-full ${isExam ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
          <Clock size={16} />
          <span className="font-bold">{isExam ? formatTime(timeLeft) : 'PRACTICE'}</span>
        </div>
      </header>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-grow">
        <p className="text-xl font-medium leading-relaxed mb-8 text-primary">
          {currentQuestion.text}
        </p>

        <div className="space-y-4">
          {['A', 'B', 'C', 'D'].map((letter) => {
            const optionKey = `option${letter}` as keyof Question;
            const isSelected = selectedAnswer === letter;
            const isCorrectOption = letter === currentQuestion.correctAnswer;
            
            let btnClass = 'border-gray-100 hover:border-gray-200';
            let circleClass = 'bg-gray-100 text-gray-500';

            if (isSelected) {
              if (!isExam && showFeedback) {
                btnClass = isCorrect ? 'border-green-500 bg-green-50' : 'border-error bg-red-50';
                circleClass = isCorrect ? 'bg-green-500 text-white' : 'bg-error text-white';
              } else {
                btnClass = 'border-primary bg-primary/5';
                circleClass = 'bg-primary text-white';
              }
            } else if (!isExam && showFeedback && isCorrectOption) {
              btnClass = 'border-green-500 bg-green-50/50';
              circleClass = 'bg-green-500 text-white';
            }

            return (
              <button
                key={letter}
                onClick={() => handleSelect(letter)}
                disabled={!isExam && showFeedback}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${btnClass}`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 ${circleClass}`}>
                  {letter}
                </span>
                <span className={`text-sm ${isSelected ? 'font-bold' : ''}`}>
                  {currentQuestion[optionKey] as string}
                </span>
              </button>
            );
          })}
        </div>

        {!isExam && showFeedback && (
          <div className={`mt-8 p-4 rounded-xl animate-in slide-in-from-bottom-2 duration-300 ${isCorrect ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? <CheckCircle2 className="text-green-600" size={20} /> : <XCircle className="text-error" size={20} />}
              <span className={`font-bold ${isCorrect ? 'text-green-800' : 'text-error'}`}>
                {isCorrect ? 'Correct!' : `Incorrect. Answer is ${currentQuestion.correctAnswer}`}
              </span>
            </div>
            <p className="text-sm text-gray-600 italic">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      <footer className="mt-8 flex justify-between gap-4">
        <button
          onClick={() => {
            setCurrentIndex(prev => Math.max(0, prev - 1));
            setShowFeedback(false);
          }}
          disabled={currentIndex === 0 || submitting}
          className="flex-1 bg-white border border-gray-200 py-4 rounded-xl font-bold text-gray-600 flex items-center justify-center gap-2 disabled:opacity-30"
        >
          <ChevronLeft size={20} /> Back
        </button>
        
        {currentIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 bg-primary text-white py-4 rounded-xl font-bold active:scale-95 transition-transform disabled:opacity-50"
          >
            {submitting ? 'Finishing...' : 'Submit Test'}
          </button>
        ) : (
          <button
            onClick={() => {
              setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1));
              setShowFeedback(false);
            }}
            className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform ${(!isExam && !showFeedback) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary text-white'}`}
          >
            Next <ChevronRight size={20} />
          </button>
        )}
      </footer>
    </div>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-primary font-bold">Loading Test...</div>}>
      <TestContent />
    </Suspense>
  );
}
