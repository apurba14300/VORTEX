
import React, { useState } from 'react';
import { geminiService } from '../services/gemini';
import { AppState, Project } from '../types';

interface AIStarterProps {
  state: AppState;
  onProjectCreated: (p: Project) => void;
}

const AIStarter: React.FC<AIStarterProps> = ({ state, onProjectCreated }) => {
  const [interest, setInterest] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { theme } = state;
  const isDark = theme === 'dark' || theme === 'dim';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      // Added cast to File for correctly accessing the name property
      setInterest(`Based on dropped file context: ${(files[0] as File).name}. Building an architecture around this conceptual payload.`);
    }
  };

  const handleGenerate = async () => {
    if (!interest || !state.currentUser) return;
    setLoading(true);
    try {
      // Fix: generateProjectGenesis instead of generateProjectStarter
      const result = await geminiService.generateProjectGenesis(state.currentUser.skills, interest);
      setSuggestion(result);
    } catch (e) {
      console.error(e);
      alert('Neural sync failed. Check API key integrity.');
    } finally {
      setLoading(false);
    }
  };

  const handleLaunch = () => {
    if (!suggestion || !state.currentUser) return;
    // Updated project object to match the Project interface in types.ts
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      ownerId: state.currentUser.id,
      title: suggestion.title,
      description: suggestion.description,
      techStack: suggestion.techStack || [],
      likes: 0,
      views: 0,
      files: (suggestion.starterFiles || []).map((f: any) => ({
        name: f.name,
        content: f.content,
        language: f.language
      })),
      roadmap: (suggestion.roadmap || []).map((r: any, idx: number) => ({
        id: `m-${idx}`,
        label: r.label,
        status: r.status === 'completed' ? 'completed' : 'pending'
      })),
      reviews: [],
      metrics: {
        testCoverage: 0,
        techDebt: 0,
        deploymentFrequency: 0
      },
      isPublic: true,
      createdAt: new Date().toISOString()
    };
    onProjectCreated(newProject);
    setSuggestion(null);
    setInterest('');
  };

  return (
    <div 
      className="max-w-7xl mx-auto space-y-12 animate-fade-in py-6 pb-48 perspective-2000"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Immersive Header */}
      <div className="text-center relative py-12 md:py-16 overflow-hidden rounded-[4rem] group border border-indigo-500/10">
        <div className="absolute inset-0 bg-indigo-600/5 blur-[120px] rounded-full animate-glow-pulse"></div>
        <div className="absolute inset-0 hologram-grid opacity-20 pointer-events-none transition-opacity duration-1000 group-hover:opacity-40"></div>
        
        <div className="relative z-10 space-y-6">
          <div className="inline-block px-8 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.6em] text-indigo-500 animate-slide-up stagger-1 shadow-xl backdrop-blur-md">
            COGNITIVE BLUEPRINT ENGINE
          </div>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none animate-slide-up stagger-2 transition-transform duration-1000 hover:scale-105">
            CODQIT <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-400 to-indigo-600">GENESIS</span>
          </h2>
          <p className="text-xl opacity-40 font-medium max-w-3xl mx-auto leading-relaxed animate-slide-up stagger-3 tracking-tight">
            Manifesting architecture from pure concept. Synthesize your roadmap and code structure through the neural network.
          </p>
        </div>
      </div>

      {/* Input Console */}
      <div className={`relative group p-1.5 rounded-[4rem] transition-all duration-1000 shadow-3xl animate-slide-up stagger-4 ${isDark ? 'bg-gradient-to-br from-indigo-500/20 via-transparent to-purple-500/20' : 'bg-indigo-50'}`}>
        <div className={`rounded-[3.8rem] p-12 md:p-16 space-y-12 transition-all duration-700 overflow-hidden relative ${isDark ? 'bg-CODQIT-darkCard' : 'bg-white'} ${isDragging ? 'scale-95 opacity-50 border-4 border-indigo-500' : ''}`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-40 animate-scan"></div>
          
          <div className="space-y-10 relative z-10">
            <div className="space-y-6">
              <label className="block text-[11px] font-black uppercase tracking-[0.4em] opacity-30 px-4">TRANSMIT INTENTIONALITY</label>
              <div className="relative group/input flex flex-col md:flex-row gap-6">
                <input 
                  type="text" 
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  placeholder={isDragging ? "DROP TO INJECT PAYLOAD" : "Describe your vision or drop a file..."}
                  className={`flex-1 px-8 py-6 text-2xl font-black rounded-[2.5rem] outline-none transition-all border-2 shadow-inner ${isDark ? 'bg-black/60 border-white/5 focus:border-indigo-500/60 text-white placeholder:text-white/10' : 'bg-slate-50 border-slate-200 focus:border-indigo-500 text-slate-900 placeholder:text-slate-300'}`}
                />
                <button 
                  onClick={handleGenerate}
                  disabled={loading || !interest}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-12 py-6 rounded-[2.5rem] font-black tracking-tighter text-xl shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 group-hover/input:shadow-indigo-500/40 min-w-[240px]"
                >
                  {loading ? (
                      <div className="flex items-center gap-4">
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="animate-pulse">SYNTHESIZING...</span>
                      </div>
                  ) : (
                    <>
                      <span>MANIFEST</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-gray-500/5">
              <span className="text-[10px] font-black uppercase opacity-20 tracking-[0.4em]">SYSTEM WEIGHTS:</span>
              {state.currentUser?.skills.map((s, idx) => (
                <span key={s} className={`px-4 py-1.5 rounded-xl text-[11px] font-black uppercase border animate-slide-up transition-all hover:scale-105 ${isDark ? 'bg-white/5 border-white/5 text-white/30 hover:text-white' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`} style={{ animationDelay: `${0.7 + idx * 0.05}s` }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Manifestation Result Output */}
      {suggestion && (
        <div className="animate-slide-up space-y-12 stagger-1 perspective-2000 pb-20">
          <div className={`rounded-[3.5rem] p-12 md:p-16 border-2 shadow-4xl transition-all relative overflow-hidden ${isDark ? 'bg-CODQIT-darkCard border-white/5' : 'bg-white border-slate-100'}`}>
            <div className="absolute -top-32 -right-32 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] animate-glow-pulse"></div>
            
            <div className="flex flex-col xl:flex-row justify-between items-start gap-12 mb-12">
              <div className="space-y-6 max-w-4xl">
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-green-500/10 text-green-500 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] border border-green-500/20">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                  CORE RESOLVED
                </div>
                <h3 className="text-5xl font-black tracking-tighter leading-none">{suggestion.title}</h3>
                <p className="text-xl opacity-40 leading-relaxed font-medium tracking-tight italic">"{suggestion.description}"</p>
              </div>
              <button 
                onClick={handleLaunch}
                className="bg-green-600 hover:bg-green-700 text-white px-12 py-6 rounded-[2rem] font-black tracking-tighter text-2xl shadow-3xl shadow-green-500/30 hover:scale-105 active:scale-95 transition-all w-full xl:w-auto"
              >
                DEPLOY ARCHITECTURE
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-10">
                <h4 className="text-[12px] font-black uppercase tracking-[0.6em] text-indigo-500 border-b-2 border-indigo-500/10 pb-4 inline-block">QUANTUM ROADMAP</h4>
                <ul className="space-y-8">
                  {suggestion.roadmap?.map((step: any, i: number) => (
                    <li key={i} className="flex gap-8 items-start group">
                      <span className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 shadow-lg ${isDark ? 'bg-white/5 text-white/30' : 'bg-slate-100 text-slate-400'}`}>
                        {i + 1}
                      </span>
                      <p className="text-lg font-bold pt-2 group-hover:translate-x-2 transition-transform duration-500 tracking-tight">{step.label}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-10">
                <h4 className="text-[12px] font-black uppercase tracking-[0.6em] text-indigo-500 border-b-2 border-indigo-500/10 pb-4 inline-block">SCAFFOLD</h4>
                <div className={`rounded-[2.5rem] p-8 font-mono text-sm max-h-[500px] overflow-y-auto custom-scrollbar border-2 shadow-inner transition-all ${isDark ? 'bg-black/60 border-white/5 text-indigo-400' : 'bg-slate-50 border-slate-200 text-indigo-600'}`}>
                  {suggestion.starterFiles?.map((f: any) => (
                    <div key={f.name} className="mb-10 last:mb-0 group/file animate-fade-in">
                      <div className="flex items-center justify-between mb-4 border-b border-current opacity-10 pb-2">
                        <span className="font-black tracking-tighter text-lg uppercase">{f.name}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest bg-current/10 px-3 py-1 rounded-md">{f.language}</span>
                      </div>
                      <pre className={`p-6 rounded-[1.5rem] border-l-[8px] border-indigo-500/40 overflow-x-auto text-xs leading-relaxed ${isDark ? 'bg-white/5' : 'bg-white shadow-lg'}`}>
                        <code>{f.content}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIStarter;
