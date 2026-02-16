'use client';

import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Award, BookOpen } from 'lucide-react';

interface ProgressData {
  overallMastery: number;
  totalQuestions: number;
  totalAttempted: number;
  masteryByTopic: {
    name: string;
    mastery: number;
    total: number;
  }[];
}

export default function ProgressPage() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/progress')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Loading progress...</div>;
  if (!data) return <div className="p-8 text-center">No data available.</div>;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Mastery Dashboard</h1>
        <p className="text-gray-500">Visualizing your path to pharmacy excellence.</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-blue-600 mb-2"><TrendingUp size={24} /></div>
          <div className="text-3xl font-black text-gray-800">{data.overallMastery}%</div>
          <div className="text-xs text-gray-400 font-bold uppercase">Overall Mastery</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-green-600 mb-2"><Award size={24} /></div>
          <div className="text-3xl font-black text-gray-800">{data.totalAttempted}</div>
          <div className="text-xs text-gray-400 font-bold uppercase">Questions Solved</div>
        </div>
      </div>

      <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
          <BarChart3 size={20} className="text-blue-600" /> Topic Breakdown
        </h3>
        
        <div className="space-y-6">
          {data.masteryByTopic.map(topic => (
            <div key={topic.name}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-700">{topic.name}</span>
                <span className="text-sm font-bold text-blue-600">{topic.mastery}%</span>
              </div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    topic.mastery > 80 ? 'bg-green-500' : topic.mastery > 50 ? 'bg-blue-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${topic.mastery}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">
                {topic.total} total questions in library
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-black text-white p-6 rounded-2xl flex items-center gap-4">
        <div className="bg-white/20 p-3 rounded-xl">
          <BookOpen size={24} />
        </div>
        <div>
          <h4 className="font-bold">Failure Prevention Active</h4>
          <p className="text-xs text-gray-400">AEON X is tracking 12 weak concepts to re-surface in your next test.</p>
        </div>
      </div>
    </div>
  );
}
