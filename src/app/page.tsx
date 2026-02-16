'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, BookOpen, AlertCircle, Zap } from 'lucide-react';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-primary flex flex-col items-center justify-center text-white z-50">
        <div className="mb-6 animate-pulse">
          <Zap size={64} className="text-accent" fill="currentColor" />
        </div>
        <h1 className="text-5xl font-black tracking-tighter">AEON X</h1>
        <div className="absolute bottom-12 text-center opacity-80">
          <p className="text-xs uppercase tracking-[0.3em]">Built by Anthony Adogbeji Odjegba</p>
          <p className="text-accent font-bold mt-1">(AEONLight ✨)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="text-center py-4">
        <h1 className="text-4xl font-bold text-primary tracking-tight">AEON X</h1>
        <p className="text-gray-500 mt-2 font-medium italic">Mastery is the only option.</p>
      </header>

      <section className="bg-primary rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Zap size={120} />
        </div>
        <h2 className="text-xl font-bold mb-2">Academic Mastery</h2>
        <p className="opacity-80 text-sm mb-6 max-w-[240px]">Convert past examination data into guaranteed outcomes.</p>
        
        <div className="grid grid-cols-2 gap-3">
          <Link 
            href="/topics?mode=PRACTICE" 
            className="bg-white text-primary px-4 py-3 rounded-xl font-bold text-sm flex flex-col items-center gap-1 active:scale-95 transition-transform"
          >
            <Play size={18} fill="currentColor" />
            Practice
          </Link>
          <Link 
            href="/topics?mode=EXAM" 
            className="bg-accent text-white px-4 py-3 rounded-xl font-bold text-sm flex flex-col items-center gap-1 active:scale-95 transition-transform"
          >
            <Zap size={18} fill="currentColor" />
            Exam Mode
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
          <div className="bg-error/10 p-3 rounded-xl text-error">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Failure Risk</h3>
            <p className="text-xs text-gray-500">3 Topics require immediate reinforcement.</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
          <div className="bg-primary/10 p-3 rounded-xl text-primary">
            <BookOpen size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Learning Path</h3>
            <p className="text-xs text-gray-500">Syllabus coverage: 12% complete.</p>
          </div>
        </div>
      </div>
      
      <div className="text-center opacity-40 py-4">
        <p className="text-[10px] font-bold uppercase tracking-widest">UNIBEN Pharmacy Academic Engine</p>
      </div>
    </div>
  );
}
