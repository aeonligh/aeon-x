export default function AboutPage() {
  return (
    <div className="space-y-8 py-12 text-center">
      <header>
        <h1 className="text-3xl font-bold text-primary">AEON X</h1>
        <p className="text-gray-500 mt-2">The Recipe for Academic Mastery</p>
      </header>

      <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm max-w-sm mx-auto">
        <h2 className="text-xl font-bold text-primary mb-4">Core Philosophy</h2>
        <p className="text-gray-600 leading-relaxed text-sm">
          AEON X is not a revision app. It is a closed-loop learning system that ensures students do not repeatedly fail by learning by topic, testing by weakness, and reinforcing until mastery.
        </p>
      </section>

      <footer className="pt-12">
        <p className="text-sm text-gray-400">Built by Anthony Adogbeji Odjegba</p>
        <p className="text-accent font-bold text-lg tracking-widest">(AEONLight ✨)</p>
        <div className="mt-8">
          <p className="text-[10px] text-gray-300 uppercase tracking-tighter">Designed for UNIBEN Pharmacy Students</p>
        </div>
      </footer>
    </div>
  );
}
