'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { CheckCircle2, XCircle, ChevronRight, BarChart3, RotateCcw, Zap } from 'lucide-react';

interface Result {
  session: {
    score: number;
    totalItems: number;
    topicId: string;
    mode: string;
  };
  topicName: string;
}

export default function ResultsPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/test/${sessionId}`)
      .then(res => res.json())
      .then(data => {
        setResult(data);
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) return <div className="p-8 text-center text-primary font-bold italic">Processing results...</div>;
  if (!result) return <div className="p-8 text-center">Result not found.</div>;

  const percentage = Math.round((result.session.score / result.session.totalItems) * 100);
  const isPass = percentage >= 70;
  const isExam = result.session.mode === 'EXAM';

  return (
    <div className="space-y-8 pb-12 animate-in zoom-in-95 duration-500">
      <header className="text-center py-6">
        <div className={`inline-flex p-4 rounded-full mb-4 ${isPass ? 'bg-green-100 text-green-600' : 'bg-red-100 text-error'}`}>
          {isPass ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
        </div>
        <div className="flex justify-center mb-1">
          <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase ${isExam ? 'bg-error text-white' : 'bg-primary text-white'}`}>
            {result.session.mode} RESULTS
          </span>
        </div>
        <h1 className="text-3xl font-bold text-primary">{isPass ? 'Mastery Insight' : 'Reinforcement Required'}</h1>
        <p className="text-gray-400 mt-2 font-medium">Performance summary for {result.topicName}</p>
      </header>

      <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm text-center relative overflow-hidden">
        {isPass && (
          <div className="absolute top-0 right-0 p-4 text-green-500 opacity-20">
             <Zap size={80} fill="currentColor" />
          </div>
        )}
        <div className={`text-7xl font-black mb-2 ${isPass ? 'text-primary' : 'text-error'}`}>{percentage}%</div>
        <p className="font-black text-gray-300 uppercase tracking-[0.2em] text-xs">Conceptual Accuracy</p>
        
        <div className="mt-10 pt-8 border-t border-gray-50 grid grid-cols-2 gap-4">
          <div>
            <div className="text-3xl font-bold text-gray-800">{result.session.score}</div>
            <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Correct</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-800">{result.session.totalItems - result.session.score}</div>
            <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Gaps Found</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-black text-gray-400 uppercase text-[10px] tracking-[0.3em] px-2">Next Steps</h3>
        
        <Link 
          href={`/test/${result.session.topicId}?mode=PRACTICE`}
          className="w-full bg-primary text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-primary/20"
        >
          <RotateCcw size={20} /> Target Weak Areas
        </Link>
        
        <Link 
          href="/progress"
          className="w-full bg-white border border-gray-100 text-primary py-5 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <BarChart3 size={20} /> View Mastery Dashboard
        </Link>
      </div>

      <div className={`rounded-2xl p-6 border ${isPass ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-error'}`}>
        <h4 className="font-bold mb-2 flex items-center gap-2 uppercase tracking-widest text-xs">
          <CheckCircle2 size={16} /> AEON Intelligence
        </h4>
        <p className="text-sm leading-relaxed font-medium">
          {isPass 
            ? `Excellent performance. You've demonstrated a professional grasp of ${result.topicName}. We will now reduce the frequency of these questions to focus on your remaining gaps.` 
            : `Your conceptual framework for ${result.topicName} has some gaps. AEON X has logged the incorrect items and will re-surface them in 24–72 hours to ensure long-term mastery.`}
        </p>
      </div>
    </div>
  );
}
