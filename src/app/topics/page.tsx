'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, Target, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Topic {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  status: string;
  failureRisk: boolean;
}

function TopicsContent() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'PRACTICE';

  useEffect(() => {
    fetch('/api/topics')
      .then(res => res.json())
      .then(data => {
        setTopics(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-primary font-bold">Loading syllabus...</div>;

  return (
    <div className="space-y-6">
      <header>
        <div className="flex justify-between items-center mb-1">
           <h1 className="text-2xl font-bold text-primary">Topic Library</h1>
           <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${mode === 'EXAM' ? 'bg-error text-white' : 'bg-primary text-white'}`}>
             {mode} MODE
           </span>
        </div>
        <p className="text-gray-500 text-sm italic">Master each concept to eliminate failure risk.</p>
      </header>

      <div className="space-y-4">
        {topics.map(topic => (
          <div 
            key={topic.id}
            className="block bg-white border border-gray-100 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-bold text-lg text-primary leading-tight">{topic.name}</h2>
              <StatusBadge status={topic.status} risk={topic.failureRisk} />
            </div>
            <p className="text-xs text-gray-400 line-clamp-2 mb-6">
              {topic.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                {topic.questionCount} Items extracted
              </span>
              <button 
                onClick={() => window.location.href = `/test/${topic.id}?mode=${mode}`}
                className={`px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-transform active:scale-95 ${mode === 'EXAM' ? 'bg-error text-white' : 'bg-primary text-white'}`}
              >
                Start <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status, risk }: { status: string; risk: boolean }) {
  if (risk) {
    return (
      <span className="bg-red-50 text-error px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1">
        <AlertTriangle size={12} /> FAILURE RISK
      </span>
    );
  }

  switch (status) {
    case 'Mastered':
      return (
        <span className="bg-green-50 text-green-600 px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1">
          <CheckCircle2 size={12} /> MASTERED
        </span>
      );
    case 'Improving':
      return (
        <span className="bg-yellow-50 text-accent px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1">
          <Target size={12} /> IMPROVING
        </span>
      );
    default:
      return (
        <span className="bg-gray-50 text-gray-300 px-2 py-1 rounded-lg text-[10px] font-black">
          NOT STARTED
        </span>
      );
  }
}

export default function TopicsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-primary font-bold">Loading...</div>}>
      <TopicsContent />
    </Suspense>
  );
}
