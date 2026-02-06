
import React, { useState } from 'react';

const digitMap: { [key: string]: string } = {
  '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
  '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
};

export const NumberConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isCopiedAr, setIsCopiedAr] = useState(false);
  const [isCopiedEn, setIsCopiedEn] = useState(false);

  const convertDigitsOnly = (text: string) => {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (/[0-9]/.test(char)) {
        result += digitMap[char];
      } else {
        result += char; 
      }
    }
    return result;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const originalInput = e.target.value;
    setInput(originalInput);
    
    // Pattern to detect DD/MM/YYYY or DD-MM-YYYY
    const datePattern = /^(\d{1,2})([/-])(\d{1,2})([/-])(\d{4})$/;
    const match = originalInput.trim().match(datePattern);

    if (match) {
      const day = match[1].padStart(2, '0');
      const month = match[3].padStart(2, '0');
      const year = match[5];
      
      // Changed order to DD-MM-YYYY to match the screenshot request exactly
      const formattedDate = `${day}-${month}-${year}`;
      setOutput(convertDigitsOnly(formattedDate));
    } else {
      setOutput(convertDigitsOnly(originalInput));
    }
  };

  const handleCopyAr = () => {
    if (!output) return;
    
    const textToCopy = output;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setIsCopiedAr(true);
        setTimeout(() => setIsCopiedAr(false), 2000);
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setIsCopiedAr(true);
        setTimeout(() => setIsCopiedAr(false), 2000);
      } catch (err) {
        console.error('Fallback copy failed', err);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleCopyEn = () => {
    if (!input) return;
    navigator.clipboard.writeText(input);
    setIsCopiedEn(true);
    setTimeout(() => setIsCopiedEn(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 transition-all duration-300">
        
        {/* Input Section - Left Side */}
        <div className="flex-1 p-8 relative border-b md:border-b-0 md:border-r border-slate-100 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest px-4 py-1.5 bg-blue-50 rounded-full">Input Section</span>
            {input && (
              <button onClick={handleClear} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
          <div className="flex-grow bg-slate-50/40 rounded-3xl border border-slate-200/50 p-6 shadow-inner">
            <textarea
              className="w-full h-full text-2xl font-bold bg-transparent outline-none resize-none placeholder-slate-300 text-slate-800"
              placeholder="Ex: 25/03/1438"
              value={input}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-6">
            <button onClick={handleCopyEn} disabled={!input} className="p-4 w-full rounded-2xl border bg-white font-bold text-sm shadow-sm active:scale-95 transition-all text-slate-600">Copy Original</button>
          </div>
        </div>

        {/* Arabic Output Section - Right Side */}
        <div className="flex-1 p-8 bg-slate-50/30 relative flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-black text-blue-700 uppercase tracking-widest px-4 py-1.5 bg-blue-100 rounded-full">Arabic Date Format</span>
          </div>
          <div className="flex-grow bg-white rounded-3xl border border-slate-200/70 p-6 shadow-xl overflow-y-auto">
            <div 
              className="w-full text-2xl font-bold text-slate-800 break-all arabic-font" 
              style={{ direction: 'ltr', textAlign: 'right' }}
            >
              {output || <span className="opacity-10 italic font-normal text-sm block text-left">Output: DD-MM-YYYY</span>}
            </div>
          </div>
          <div className="mt-6">
            <button 
              onClick={handleCopyAr} 
              disabled={!output} 
              className={`p-4 w-full rounded-2xl border transition-all shadow-md active:scale-95 font-bold text-sm ${isCopiedAr ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'}`}
            >
              {isCopiedAr ? 'Copied Successfully' : 'Copy Arabic Numerals'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
