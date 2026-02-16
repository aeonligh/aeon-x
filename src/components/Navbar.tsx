import Link from 'next/link';
import { Home, BookOpen, Upload, BarChart2, Info } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around md:max-w-4xl">
        <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-primary">
          <Home size={24} />
          <span className="text-[10px] mt-1 font-medium">Home</span>
        </Link>
        <Link href="/topics" className="flex flex-col items-center text-gray-500 hover:text-primary">
          <BookOpen size={24} />
          <span className="text-[10px] mt-1 font-medium">Topics</span>
        </Link>
        <Link href="/upload" className="flex flex-col items-center text-gray-500 hover:text-primary">
          <Upload size={24} />
          <span className="text-[10px] mt-1 font-medium">Upload</span>
        </Link>
        <Link href="/progress" className="flex flex-col items-center text-gray-500 hover:text-primary">
          <BarChart2 size={24} />
          <span className="text-[10px] mt-1 font-medium">Mastery</span>
        </Link>
        <Link href="/about" className="flex flex-col items-center text-gray-500 hover:text-primary">
          <Info size={24} />
          <span className="text-[10px] mt-1 font-medium">About</span>
        </Link>
      </div>
    </nav>
  );
}
