
import React, { useMemo, useState } from 'react';
import { AppState, Project, User } from '../types';

interface DashboardProps {
  state: AppState;
  onReact: (id: string, type: string) => void;
  onViewProfile: (userId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, onReact, onViewProfile }) => {
  const { currentUser, projects, theme, users } = state;
  const isDark = theme !== 'light';
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<User | null>(null);

  const timeContext = useMemo(() => {
    const now = new Date();
    const month = now.getMonth(); // 0-indexed
    const date = now.getDate();
    const hour = now.getHours();

    // 1. Holiday Check (Priority)
    if (month === 0 && date === 1) {
      return {
        id: 'holiday-newyear',
        greeting: "Happy Epoch Reset",
        status: "SYSTEM_REBOOT_2025",
        icon: "🎆",
        accent: "text-cyan-400",
        bg: "from-cyan-900/40 via-blue-900/20 to-transparent",
        description: "A fresh global stack awaits manifestation. May your uptime be 99.99% this year.",
        extraClass: "festive-confetti"
      };
    }
    if (month === 6 && date === 4) {
      return {
        id: 'holiday-july4',
        greeting: "Liberty Protocol Active",
        status: "INDEPENDENCE_DAY",
        icon: "🦅",
        accent: "text-red-500",
        bg: "from-red-600/20 via-blue-600/10 to-transparent",
        description: "Celebrating the freedom of source code and decentralized architectures.",
        extraClass: "animate-firework"
      };
    }
    if (month === 11 && date >= 24 && date <= 26) {
      return {
        id: 'holiday-christmas',
        greeting: "Winter Manifestation",
        status: "FROST_PAYLOAD_DEPLOYED",
        icon: "❄️",
        accent: "text-emerald-400",
        bg: "from-emerald-900/40 via-white/5 to-transparent",
        description: "The grid is blanketed in serene frost. Perfect conditions for holiday synthesis.",
        extraClass: "snow-overlay"
      };
    }

    // 2. Witty Time-Based Greetings
    if (hour >= 5 && hour < 9) {
      return { 
        id: 'morning-early',
        greeting: "Rise and Grate", 
        status: "COFFEE_INJECTION_PENDING", 
        icon: "☕", 
        accent: "text-amber-500",
        bg: "from-amber-500/25 via-orange-400/5 to-transparent",
        description: "The sun is up, and your brain is still compiling. Time to manifest some breakfast code."
      };
    } else if (hour >= 9 && hour < 12) {
      return { 
        id: 'morning-late',
        greeting: "Peak Productivity", 
        status: "SYNTAX_OPTIMAL", 
        icon: "🚀", 
        accent: "text-indigo-500",
        bg: "from-indigo-500/15 via-blue-500/5 to-transparent",
        description: "The ecosystem is fully synchronized. Your technical roadmap is prime for high-frequency deployment."
      };
    } else if (hour >= 12 && hour < 17) {
      return { 
        id: 'afternoon',
        greeting: "Afternoon Sync", 
        status: "THERMAL_THROTTLING_NEAR", 
        icon: "🥪", 
        accent: "text-blue-500",
        bg: "from-blue-500/15 via-indigo-500/5 to-transparent",
        description: "Lunch payload processed. Re-engaging architectural focus before the evening cool-down."
      };
    } else if (hour >= 17 && hour < 21) {
      return { 
        id: 'evening',
        greeting: "Post-Build Review", 
        status: "DUSK_MODE_ENGAGED", 
        icon: "🌆", 
        accent: "text-rose-500",
        bg: "from-rose-500/20 via-purple-500/10 to-transparent",
        description: "Reviewing the day's manifest. The sector is cooling, but your reputation is still heating up."
      };
    } else if (hour >= 21 || hour < 2) {
      return { 
        id: 'night-owl',
        greeting: "Night Owl Protocol", 
        status: "VOID_SYNCHRONIZED", 
        icon: "🦉", 
        accent: "text-purple-400",
        bg: "from-purple-900/40 via-indigo-900/15 to-transparent",
        description: "The world sleeps. The grid is yours. Infinite focus, zero interruptions. Manifest the impossible."
      };
    } else {
      return { 
        id: 'witching-hour',
        greeting: "Why Are You Awake?", 
        status: "GHOSTS_IN_THE_SHELL", 
        icon: "👻", 
        accent: "text-red-400",
        bg: "from-red-900/40 via-black/40 to-transparent",
        description: "Staring into the void? The void is checking your PRs. Go to bed or manifestations may hallucinate."
      };
    }
  }, []);

  const handleStartScan = () => {
    setIsScannerOpen(true);
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      const otherUsers = users.filter(u => u.id !== currentUser?.id);
      const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
      setScanResult(randomUser || null);
    }, 2500);
  };

  const closeScanner = () => {
    setIsScannerOpen(false);
    setIsScanning(false);
    setScanResult(null);
  };

  return (
    <div className="space-y-8 md:space-y-12 animate-fade-in pb-32">
      {/* Immersive Dynamic Header */}
      <section className={`relative rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-16 overflow-hidden border transition-all duration-1000 ${isDark ? 'bg-CODQIT-darkCard border-CODQIT-darkBorder' : 'bg-white border-slate-200 shadow-2xl'} ${timeContext.extraClass || ''}`}>
        
        {/* Dynamic Background Layers */}
        <div className={`absolute inset-0 bg-gradient-to-br ${timeContext.bg} pointer-events-none transition-all duration-1000`}></div>
        {timeContext.id === 'holiday-christmas' && <div className="snow-overlay opacity-20"></div>}
        
        {/* Scan QR Button - Top Right Positioning */}
        <div className="absolute top-8 right-8 z-30">
          <button 
            onClick={handleStartScan}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all hover:scale-105 active:scale-95 shadow-xl backdrop-blur-md group ${isDark ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-600 hover:text-white' : 'bg-white/80 border-slate-200 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 transition-transform group-hover:rotate-12 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-widest">Scan QR</span>
          </button>
        </div>

        <div className="relative z-10 space-y-6 md:space-y-10 max-w-5xl">
          <div className="flex flex-wrap items-center gap-4">
            <div className={`px-4 md:px-5 py-1.5 md:py-2 rounded-2xl border border-current bg-current/10 text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-3 ${timeContext.accent} shadow-xl backdrop-blur-md`}>
              <span className="text-sm md:text-lg leading-none">{timeContext.icon}</span>
              <span className="animate-pulse">{timeContext.status}</span>
            </div>
          </div>

          <div className="space-y-3 md:space-y-4">
            <h1 className="text-4xl md:text-8xl font-black tracking-tighter leading-[0.9] transition-all duration-700">
              {timeContext.greeting},<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600">
                {currentUser?.name.split(' ')[0]}
              </span>.
            </h1>
            <p className="text-base md:text-2xl opacity-60 font-medium leading-relaxed tracking-tight max-w-2xl italic">
              {timeContext.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2 md:pt-4">
            <button className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-8 md:px-12 py-4 md:py-5 rounded-[1.5rem] md:rounded-3xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-indigo-600/40 active:scale-95">
              Initiate Build
            </button>
          </div>
        </div>
      </section>

      {/* Feed Section */}
      <div className="space-y-6 md:space-y-10 px-1 md:px-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-500/10 pb-6 md:pb-8 gap-4">
          <div className="space-y-1">
            <h2 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.6em] text-indigo-500">Neural Feed</h2>
            <p className="text-xl md:text-2xl font-black tracking-tighter">Active Manifestations</p>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {projects.map(p => {
            const owner = users.find(u => u.id === p.ownerId);
            return (
              <div key={p.id} className={`group rounded-[2.5rem] md:rounded-[3rem] border overflow-hidden transition-all hover:-translate-y-3 ${isDark ? 'bg-CODQIT-darkCard border-CODQIT-darkBorder hover:border-indigo-500/40' : 'bg-white border-slate-200 shadow-xl'}`}>
                <div className="h-48 md:h-56 overflow-hidden relative">
                  <img src={p.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={p.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 md:bottom-6 left-6 md:left-8 flex items-center gap-3 md:gap-4">
                     <div className="relative">
                       <img src={owner?.avatar} className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl border-2 border-white/20 shadow-2xl" alt="" />
                     </div>
                     <div className="space-y-0.5">
                       <p className="text-[11px] md:text-xs font-black text-white">{owner?.name}</p>
                       <p className="text-[7px] md:text-[8px] font-black uppercase text-white/50 tracking-widest">Architect</p>
                     </div>
                  </div>
                </div>
                <div className="p-8 md:p-10 space-y-5 md:space-y-6">
                  <div className="space-y-2 md:space-y-3">
                    <h3 className="text-xl md:text-2xl font-black tracking-tight leading-tight group-hover:text-indigo-500 transition-colors">{p.title}</h3>
                    <p className="text-xs md:text-sm opacity-50 line-clamp-2 leading-relaxed font-medium">{p.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-6 md:pt-8 border-t border-gray-500/10">
                    <div className="flex gap-4 md:gap-8">
                      <button onClick={() => onReact(p.id, 'like')} className="flex items-center gap-2 text-[10px] md:text-xs font-black opacity-30 hover:opacity-100 hover:text-indigo-500 transition-all group/btn">
                        <span className="text-base md:text-lg group-hover/btn:scale-125 transition-transform">🚀</span> {p.likes.toLocaleString()}
                      </button>
                    </div>
                    <button className="text-[8px] md:text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:translate-x-2 transition-transform">Enter Node</button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>

      {/* QR Scanner Modal - HUD Style */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className={`w-full max-w-lg rounded-[4rem] border-2 p-10 space-y-8 animate-in zoom-in-95 relative overflow-hidden ${isDark ? 'bg-CODQIT-darkCard border-indigo-500/20' : 'bg-white border-slate-200'}`}>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-tighter">Neural Identity Scan</h3>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Locking on architect frequency</p>
            </div>

            <div className="relative aspect-square rounded-[3.5rem] overflow-hidden bg-black border-4 border-indigo-500/30 group">
              <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center grayscale contrast-150"></div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <div className="w-64 h-64 border-2 border-indigo-500/50 rounded-3xl relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-xl"></div>
                    
                    {isScanning && (
                      <div className="absolute inset-x-0 h-1 bg-indigo-500 shadow-[0_0_30px_rgba(99,102,241,1)] animate-scan"></div>
                    )}
                    
                    {scanResult && !isScanning && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-600/80 backdrop-blur-md animate-in zoom-in-50 duration-500 rounded-2xl p-6 text-white text-center">
                        <img src={scanResult.avatar} className="w-20 h-20 rounded-2xl border-2 border-white/50 mb-3 shadow-2xl" alt="" />
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">TARGET_ACQUIRED</p>
                        <h4 className="text-xl font-black uppercase tracking-tighter mb-4">{scanResult.name}</h4>
                        <button 
                          onClick={() => {
                            onViewProfile(scanResult.id);
                            closeScanner();
                          }}
                          className="w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all"
                        >
                          SYNC_PROFILE
                        </button>
                      </div>
                    )}
                 </div>
              </div>

              <div className="absolute top-6 left-6 text-[8px] font-mono text-indigo-400 opacity-60">
                POS: 37.7749° N, 122.4194° W<br />
                FRQ: 440.12MHz
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/80 rounded-full border border-white/10 backdrop-blur-md z-10">
                 <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400">
                   {isScanning ? 'SEARCHING_NEURAL_SPACE...' : scanResult ? 'NODE_LOCKED' : 'POINT_AT_IDENTITY_QR'}
                 </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <button 
                  onClick={closeScanner}
                  className="flex-1 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest border border-gray-500/10 hover:bg-red-500/10 transition-all"
                >
                  ABORT
                </button>
                <button 
                  onClick={handleStartScan}
                  disabled={isScanning}
                  className="flex-[2] py-5 bg-indigo-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isScanning ? 'SCANNING...' : 'RE-SCAN_NODE'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
