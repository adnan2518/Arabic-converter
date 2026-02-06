
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; uri: string }[];
}

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'আসসালামু আলাইকুম! আমি আপনার এআই সহকারী। আরবি ভাষা, সংস্কৃতি বা যেকোনো ইসলামিক তারিখ সম্পর্কে আমি আপনাকে তথ্য দিতে পারি। কি জানতে চান?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: "You are a helpful and expert Arabic language and culture assistant. You provide accurate translations and information about Islamic dates. Respond primarily in Bengali, but use Arabic for scripts. Always clarify that information is grounded in Google Search results.",
        },
      });

      const text = response.text || "দুঃখিত, আমি উত্তরটি খুঁজে পাইনি।";
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundingChunks
        .filter(chunk => chunk.web)
        .map(chunk => ({ title: chunk.web!.title, uri: chunk.web!.uri }));

      setMessages(prev => [...prev, { role: 'assistant', content: text, sources }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "সার্ভারের সাথে সংযোগে সমস্যা হচ্ছে। দয়া করে আবার চেষ্টা করুন।" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border border-slate-200 rounded-[2.5rem] overflow-hidden bg-slate-50/30 shadow-inner">
      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-grow p-6 overflow-y-auto space-y-6 no-scrollbar"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-3xl shadow-sm ${
              msg.role === 'user' 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed font-medium">
                {msg.content}
              </p>
              
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((s, i) => (
                      <a 
                        key={i} 
                        href={s.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-full font-bold transition-colors truncate max-w-[200px]"
                      >
                        {s.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-5 rounded-3xl rounded-tl-none border border-slate-100 flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="কিছু জিজ্ঞাসা করুন (যেমন: রমজান কবে?)..."
            className="flex-grow bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 outline-none font-medium transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white p-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
