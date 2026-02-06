
import React, { useState, useEffect } from 'react';

type Mode = 'G2H' | 'H2G';

export const HijriConverter: React.FC = () => {
  const [mode, setMode] = useState<Mode>('G2H');
  const [day, setDay] = useState(new Date().getDate().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [result, setResult] = useState('');
  const [weekday, setWeekday] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const hijriMonths = [
    "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
    "Jumada al-Ula", "Jumada al-Akhira", "Rajab", "Sha'ban",
    "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
  ];

  const getDaysInMonth = (m: number, y: number) => {
    return new Date(y, m, 0).getDate();
  };

  const currentDaysInMonth = mode === 'G2H' ? getDaysInMonth(Number(month), Number(year)) : 30;
  const daysArr = Array.from({ length: currentDaysInMonth }, (_, i) => (i + 1).toString());
  const monthsArr = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  
  const yearsArr = mode === 'G2H' 
    ? Array.from({ length: 151 }, (_, i) => (1950 + i).toString())
    : Array.from({ length: 151 }, (_, i) => (1370 + i).toString());

  useEffect(() => {
    if (mode === 'H2G') {
      setYear('1446');
      setMonth('1');
      setDay('1');
    } else {
      const now = new Date();
      setYear(now.getFullYear().toString());
      setMonth((now.getMonth() + 1).toString());
      setDay(now.getDate().toString());
    }
  }, [mode]);

  const convert = () => {
    try {
      if (mode === 'G2H') {
        const gregorianDate = new Date(Number(year), Number(month) - 1, Number(day));
        if (gregorianDate.getFullYear() !== Number(year) || gregorianDate.getMonth() !== Number(month) - 1 || gregorianDate.getDate() !== Number(day)) {
          setResult('Invalid Gregorian Date');
          setWeekday('');
          return;
        }

        const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-uma-nu-latn', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric',
          weekday: 'long'
        });
        
        const parts = formatter.formatToParts(gregorianDate);
        const hDay = parts.find(p => p.type === 'day')?.value;
        const hMonth = parts.find(p => p.type === 'month')?.value;
        const hYear = parts.find(p => p.type === 'year')?.value;
        const wDay = parts.find(p => p.type === 'weekday')?.value;

        setWeekday(wDay || '');
        setResult(`${hDay} ${hMonth} ${hYear} AH`);
      } else {
        const targetYear = Number(year);
        const targetMonth = Number(month);
        const targetDay = Number(day);

        let testDate = new Date(targetYear + 621, 0, 1);
        let matchedDate: Date | null = null;

        for (let j = 0; j < 1000; j++) {
          const parts = new Intl.DateTimeFormat('en-u-ca-islamic-uma-nu-latn', { 
            day: 'numeric', 
            month: 'numeric', 
            year: 'numeric' 
          }).formatToParts(testDate);
          
          const hY = parseInt(parts.find(p => p.type === 'year')?.value || '0');
          const hM = parseInt(parts.find(p => p.type === 'month')?.value || '0');
          const hD = parseInt(parts.find(p => p.type === 'day')?.value || '0');

          if (hY === targetYear && hM === targetMonth && hD === targetDay) {
            matchedDate = new Date(testDate);
            break;
          }
          testDate.setDate(testDate.getDate() + 1);
          if (hY > targetYear + 1) break;
        }

        if (matchedDate) {
          const gregFormatter = new Intl.DateTimeFormat('en-GB', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric', 
            weekday: 'long' 
          });
          const parts = gregFormatter.formatToParts(matchedDate);
          const gDay = parts.find(p => p.type === 'day')?.value;
          const gMonth = parts.find(p => p.type === 'month')?.value;
          const gYear = parts.find(p => p.type === 'year')?.value;
          const wDay = parts.find(p => p.type === 'weekday')?.value;

          setWeekday(wDay || '');
          setResult(`${gDay} ${gMonth} ${gYear} AD`);
        } else {
          setResult('Invalid Hijri Date');
          setWeekday('');
        }
      }
    } catch (e) {
      setResult('Conversion Error');
      setWeekday('');
    }
  };

  const handleCopy = () => {
    const fullText = weekday ? `${weekday}, ${result}` : result;
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  useEffect(() => {
    convert();
  }, [day, month, year, mode]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-fit mb-10 shadow-sm mx-auto">
        <button 
          onClick={() => setMode('G2H')}
          className={`px-8 py-3 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${
            mode === 'G2H' 
            ? 'bg-white text-teal-700 shadow-sm ring-1 ring-slate-200' 
            : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${mode === 'G2H' ? 'bg-teal-500' : 'bg-slate-300'}`}></span>
          Gregorian to Hijri
        </button>
        <button 
          onClick={() => setMode('H2G')}
          className={`px-8 py-3 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${
            mode === 'H2G' 
            ? 'bg-white text-teal-700 shadow-sm ring-1 ring-slate-200' 
            : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${mode === 'H2G' ? 'bg-teal-500' : 'bg-slate-300'}`}></span>
          Hijri to Gregorian
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
            {mode === 'G2H' ? 'Year (AD)' : 'Year (AH)'}
          </label>
          <select 
            value={year} 
            onChange={e => setYear(e.target.value)} 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all outline-none font-bold text-slate-700 shadow-inner"
          >
            {yearsArr.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Month</label>
          <select 
            value={month} 
            onChange={e => setMonth(e.target.value)} 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all outline-none font-bold text-slate-700 shadow-inner"
          >
            {monthsArr.map(m => (
              <option key={m} value={m}>
                {mode === 'G2H' 
                  ? new Date(2000, Number(m)-1).toLocaleString('default', { month: 'long' })
                  : `${m}. ${hijriMonths[Number(m)-1]}`
                }
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Day</label>
          <select 
            value={day} 
            onChange={e => setDay(e.target.value)} 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all outline-none font-bold text-slate-700 shadow-inner"
          >
            {daysArr.map(d => (
              <option key={d} value={d}>{d.padStart(2, '0')}</option>
            ))}
          </select>
        </div>
      </div>

      {result && !result.includes('Invalid') ? (
        <div className="bg-teal-50/50 border border-teal-100 p-12 rounded-[3rem] text-center shadow-sm relative overflow-hidden group">
          <div className="mb-3 text-teal-600 font-black uppercase tracking-[0.5em] text-[10px] opacity-80">
            {weekday}
          </div>
          <div className="text-teal-950 font-bold text-3xl sm:text-5xl arabic-font mb-6 leading-tight">
            {result}
          </div>
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-teal-100/60 text-teal-800 rounded-full text-[10px] font-black uppercase tracking-[0.25em]">
            <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
            Umm al-Qura Standard
          </div>
          <div className="mt-8 flex justify-center">
            <button 
              onClick={handleCopy}
              className={`px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 ${
                isCopied 
                ? 'bg-emerald-600 text-white' 
                : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              {isCopied ? 'Copied Silently' : 'Copy Result'}
            </button>
          </div>
        </div>
      ) : result ? (
        <div className="bg-red-50 border border-red-100 p-12 rounded-[2.5rem] text-center">
           <div className="text-red-900 font-black text-xl mb-2 uppercase tracking-tight">{result}</div>
           <p className="text-red-600 font-medium">নির্বাচিত তারিখটি সঠিক নয়।</p>
        </div>
      ) : null}
    </div>
  );
};
