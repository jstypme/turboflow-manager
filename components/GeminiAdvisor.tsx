import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, User } from 'lucide-react';
import { ChatMessage } from '../types';
import { askTechSupport } from '../services/geminiService';

const GeminiAdvisor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Console initialized. v3.0.0. Waiting for user input..." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await askTechSupport(input);
    
    setMessages(prev => [...prev, { role: 'model', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[500px] bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
      <div className="p-4 border-b border-slate-800 bg-slate-900/80">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-400" />
          System Command Console
        </h3>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 font-mono">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'model' ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-900' : 'bg-slate-700 text-slate-300'
            }`}>
              {msg.role === 'model' ? <Terminal size={14} /> : <User size={14} />}
            </div>
            <div className={`max-w-[85%] p-3 rounded-lg text-xs md:text-sm ${
              msg.role === 'user' 
                ? 'bg-blue-900/50 text-blue-200 border border-blue-800' 
                : 'bg-slate-950 text-emerald-400 border border-slate-800'
            }`}>
              <span className="opacity-50 mr-2">{msg.role === 'model' ? '>' : '$'}</span>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-900/20 text-emerald-400 border border-emerald-900 flex items-center justify-center">
              <Terminal size={14} />
            </div>
            <div className="bg-slate-950 text-emerald-500 border border-slate-800 p-3 rounded-lg text-xs animate-pulse">
              _processing_command...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900/80">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type 'help', 'cooling', 'ram'..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono text-sm"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiAdvisor;
