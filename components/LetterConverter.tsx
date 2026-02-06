
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

export const LetterConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [isCopiedAr, setIsCopiedAr] = useState(false);
  const [isCopiedEn, setIsCopiedEn] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const debounceTimer = useRef<any>(null);

  const processWithAI = async (text: string) => {
    if (!text.trim()) {
      setOutput('');
      setPronunciation('');
      return;
    }

    const hasLetters = /[a-zA-Z]/.test(text);
    
    if (!hasLetters) {
      setOutput(text);
      setPronunciation('');
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Input Text: "${text}"
        Instructions:
        1. Distinguish between human names (Proper Nouns) and general words.
        2. If the input is a NAME (like Md Omar, Adnan, John, etc.), DO NOT translate the meaning. Only provide the Arabic phonetical transliteration (How the name is written in Arabic).
        3. If the input contains GENERAL WORDS or sentences (like Doctor, Teacher, I am going, etc.), provide the actual meaningful Arabic TRANSLATION.
        4. If it's a mix, handle accordingly (Names -> Transliterated, Words -> Translated).
        5. Keep all English numbers (0-9) exactly as they are.
        6. Format your response exactly like this: "Arabic Result | Pronunciation in English"`,
        config: {
          temperature: 0.1,
          topP: 0.8,
          thinkingConfig: { thinkingBudget: 0 }
        }
      });

      const textResult = response.text || "";
      const result = textResult.split('|') || [];
      
      if (result.length >= 2) {
        setOutput(result[0].trim());
        setPronunciation(result[1].trim());
      } else {
        setOutput(result[0]?.trim() || text);
      }
    } catch (err) {
      console.error("AI Error:", err);
      setOutput(text);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  const playAudio = async () => {
    if (!output) return;
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: output }] }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
        
        const dataInt16 = new Int16Array(bytes.buffer);
        const buffer = audioCtx.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;

        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start();
      }
    } catch (e) {
      console.error("Audio error:", e);
    }
  };

  const handleCopyAr = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setIsCopiedAr(true);
    setTimeout(() => setIsCopiedAr(false), 2000);
  };

  const handleCopyEn = () => {
    if (!input) return;
    navigator.clipboard.writeText(input);
    setIsCopiedEn(true);
    setTimeout(() => setIsCopiedEn(false), 2000);
  };

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (!input.trim()) {
      setOutput('');
      setPronunciation('');
      return;
    }
    debounceTimer.current = setTimeout(() => processWithAI(input), 400);
    return () => clearTimeout(debounceTimer.current);
  }, [input]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 transition-all duration-300">
        <div className="flex-1 p-8 relative border-b md:border-b-0 md:border-r border-slate-100 flex flex-col min-h-[350px]">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-black text-emerald-600 uppercase tracking-widest px-4 py-1.5 bg-emerald-50 rounded-full">Meaning Translation</span>
          </div>
          <div className="flex-grow bg-slate-50/40 rounded-3xl border border-slate-200/50 p-6 shadow-inner">
            <textarea
              className="w-full h-full text-xl font-bold bg-transparent outline-none resize-none placeholder-slate-300 text-slate-800"
              placeholder="Type names or sentences here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="mt-6 flex items-center gap-4">
            <button onClick={startVoiceInput} className={`p-4 rounded-2xl border transition-all shadow-md ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-slate-600'}`}><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" /></svg></button>
            <button onClick={handleCopyEn} disabled={!input} className="p-4 rounded-2xl border bg-white font-bold text-sm active:scale-95 transition-all">Copy Input</button>
          </div>
        </div>

        <div className="flex-1 p-8 bg-slate-50/30 relative flex flex-col min-h-[350px]">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-black text-emerald-600 uppercase tracking-widest px-4 py-1.5 bg-emerald-50 rounded-full">Arabic Output</span>
          </div>
          <div className="flex-grow bg-white rounded-3xl border border-slate-200/70 p-6 shadow-xl flex flex-col justify-center">
            <div className="text-3xl text-right dir-rtl arabic-font font-black text-slate-900 mb-2">
              {output || <span className="opacity-10">...</span>}
            </div>
            <div className="text-md text-emerald-600/70 font-bold italic text-right">
              {pronunciation}
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <button onClick={playAudio} disabled={!output} className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-emerald-50 shadow-md transition-all active:scale-95"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.414 4.243 1 1 0 01-1.415-1.415A3.983 3.983 0 0013 10a3.983 3.983 0 00-1.414-2.828a1 1 0 010-1.415z"/></svg></button>
            <button onClick={handleCopyAr} disabled={!output} className={`p-4 rounded-2xl border transition-all shadow-md active:scale-95 font-bold text-sm flex-grow ${isCopiedAr ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'}`}>
              {isCopiedAr ? 'Copied Successfully' : 'Copy Arabic'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
