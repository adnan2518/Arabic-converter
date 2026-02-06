
import React, { useState } from 'react';
import { LetterConverter } from './components/LetterConverter';
import { NumberConverter } from './components/NumberConverter';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'letters' | 'numbers'>('letters');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      {/* Premium Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center lg:items-start">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Arabic <span className="text-emerald-600 font-serif italic">Converter</span> Pro
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-0.5 w-6 bg-emerald-500 rounded-full"></span>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-black text-slate-500">
                WEBBUILDER: MD OMAR ADNAN
              </span>
            </div>
          </div>

          <nav className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full lg:w-auto overflow-x-auto no-scrollbar">
            {[
              { id: 'letters', label: 'Letters', color: 'emerald' },
              { id: 'numbers', label: 'Numbers', color: 'blue' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 lg:flex-none px-12 py-2.5 rounded-xl transition-all duration-300 text-sm font-bold whitespace-nowrap ${
                  activeTab === tab.id 
                  ? `bg-white text-${tab.color}-700 shadow-sm ring-1 ring-slate-200` 
                  : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8 sm:py-12">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-200 overflow-hidden min-h-[500px]">
          <div className="p-6 md:p-12">
            {activeTab === 'letters' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <HeaderSection icon="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" color="emerald" title="Letters to Arabic" desc="ইংরেজী লেটার গুলো আরবী তে কনভার্ট হবে। কোনো নম্বর ইনপুট দেওয়া যাবে না।" />
                <LetterConverter />
              </div>
            )}

            {activeTab === 'numbers' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <HeaderSection icon="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" color="blue" title="Numbers to Arabic" desc="শুধুমাত্র ইংরেজী নম্বরগুলো আরবী তে কনভার্ট হবে, লেটার পরিবর্তন হবে না।" />
                <NumberConverter />
              </div>
            )}
          </div>
        </div>

        {/* Builder Profile */}
        <section className="mt-16 bg-white p-8 sm:p-16 rounded-[3rem] border border-slate-200 text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Professional Webbuilder
          </div>
          <h3 className="text-3xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tighter">MD OMAR ADNAN</h3>
          <p className="text-slate-500 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto font-medium">
            এটি একটি প্রফেশনাল এবং নির্ভুল আরবি কনভার্টার টুল। এর মাধ্যমে আপনি ইংরেজি লেটার এবং নম্বরগুলোকে কোনো ঝামেলা ছাড়াই দ্রুত আরবিতে রূপান্তর করতে পারবেন।
          </p>
        </section>
      </main>

      <footer className="py-12 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-xs font-black tracking-[0.3em] uppercase">
            Designed & Developed by <span className="text-slate-900">MD OMAR ADNAN</span> &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

const HeaderSection: React.FC<{ icon: string, color: string, title: string, desc: string }> = ({ icon, color, title, desc }) => (
  <div className="mb-10">
    <div className="flex items-center gap-5 mb-4">
      <div className={`p-4 bg-${color}-50 text-${color}-600 rounded-2xl shadow-sm ring-1 ring-${color}-100`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={icon} />
        </svg>
      </div>
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
    </div>
    <p className="text-slate-500 text-lg font-medium max-w-2xl leading-relaxed">{desc}</p>
  </div>
);

export default App;
