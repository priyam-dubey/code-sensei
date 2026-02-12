'use client'; // Required for Next.js 16 to allow state and button clicks

import React, { useState } from 'react';
import axios from 'axios';
import { Play, Code2, BrainCircuit, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [code, setCode] = useState('// Paste code to analyze...\nfunction add(a, b) {\n  return a - b;\n}');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const analyzeCode = async () => {
    setLoading(true);
    setFeedback('');
    try {
      // Connects to your backend on port 5000
      const response = await axios.post('http://localhost:5000/api/analyze', {
        code,
        language: 'javascript'
      });
      setFeedback(response.data.feedback);
    } catch (error: any) {
      // Gracefully handles the 429 error if Gemini is at its limit
      const errorMsg = error.response?.data?.details || "The Sensei is meditating. Try again in 60 seconds.";
      setFeedback(`### ⚠️ System Message\n${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 p-4 flex justify-between items-center sticky top-0 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <BrainCircuit className="text-blue-400" size={28} />
          <h1 className="text-xl font-bold tracking-tighter uppercase">Code <span className="text-blue-400">Sensei</span></h1>
        </div>
        <button 
          onClick={analyzeCode}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
          {loading ? 'Consulting...' : 'Review Code'}
        </button>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Editor Area */}
        <div className="w-1/2 flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Source Code</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-6 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none shadow-2xl shadow-blue-900/5"
            spellCheck="false"
          />
        </div>

        {/* Feedback Area */}
        <div className="w-1/2 flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">AI Insights</label>
          <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl p-6 overflow-y-auto custom-scrollbar prose prose-invert max-w-none">
            {feedback ? (
              <ReactMarkdown>{feedback}</ReactMarkdown>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <Code2 size={48} className="mb-2" />
                <p className="text-sm italic">Waiting for input...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}