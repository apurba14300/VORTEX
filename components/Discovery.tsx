
import React, { useState, useMemo } from 'react';
import { AppState, Project, User, ProfessionalRole } from '../types';
import { PROFESSIONAL_ROLES } from '../constants';

interface DiscoveryProps {
  state: AppState;
  onReact: (id: string, type: string) => void;
  onFollow: (id: string) => void;
  onViewProfile?: (userId: string) => void;
}

const Discovery: React.FC<DiscoveryProps> = ({ state, onViewProfile }) => {
  const { projects, users, theme } = state;
  const isDark = theme !== 'light';
  const [searchQuery, setSearchQuery] = useState('');
  const [mode, setMode] = useState<'Projects' | 'Architects'>('Projects');
  const [isFocused, setIsFocused] = useState(false);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.techStack.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [projects, searchQuery]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [users, searchQuery]);

  return (
    <div className="space-y-16 animate-fade-in pb-48">
      {/* HUD-STYLE SEARCH HEADER */}
      <section className="relative py-20 px-6 overflow-hidden rounded-[4rem] flex flex-col items-center justify-center">
        {/* Ambient background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full animate-glow-pulse"></div>
          <div className="absolute bottom-1/2 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full animate-glow-pulse stagger-2"></div>
          <div className="absolute inset-0 hologram-grid opacity-10"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl space-y-12 text-center">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.8em] text-indigo-500 animate-slide-up">Global Mesh Scanner</h4>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none animate-slide-up stagger-1">
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400">Nodes</span>
            </h1>
          </div>

          {/* CRAZY SEARCH CONTAINER */}
          <div className={`relative group max-w-3xl mx-auto transition-all duration-700 animate-slide-up stagger-2 ${isFocused ? 'scale-105' : 'scale-100'}`}>
            {/* Outer Glow Ring */}
            <div className={`absolute -inset-1 rounded-[3rem] blur-xl opacity-20 transition-all duration-1000 group-hover:opacity-40 ${isFocused ? 'bg-indigo-500' : 'bg-gray-500'}`}></div>
            
            <div className={`relative flex items-center p-2 rounded-[2.8rem] border-2 backdrop-blur-3xl transition-all duration-500 shadow-4xl ${
              isFocused 
                ? 'border-indigo-500/50 bg-indigo-500/5 shadow-indigo-500/20' 
                : (isDark ? 'border-white/5 bg-black/40 shadow-black/50' : 'border-slate-200 bg-white/80 shadow-slate-200/50')
            }`}>
              <span className={`pl-8 text-2xl transition-all duration-500 ${isFocused ? 'scale-125 opacity-100' : 'opacity-20'}`}>🔍</span>
              
              <input 
                type="text" 
                value={searchQuery}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={mode === 'Projects' ? "Locate build patterns..." : "Locate lead architects..."}
                className="flex-1 bg-transparent border-none px-6 py-6 text-xl font-bold outline-none placeholder:opacity-20"
              />

              {/* CRAZY NEURAL SCAN BUTTON */}
              <button className="relative group/btn overflow-hidden px-10 py-5 rounded-[2.2rem] transition-all duration-500 active:scale-95">
                <div className="absolute inset-0 bg-indigo-600 transition-all duration-500 group-hover/btn:bg-indigo-500"></div>
                <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full duration-1000"></div>
                
                {/* Floating "Scanning" particle */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/30 animate-scan"></div>
                
                <div className="relative z-10 flex items-center gap-3">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Neural Scan</span>
                   <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                </div>
              </button>
            </div>

            {/* Sub-HUD Metrics */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-8 opacity-20 group-hover:opacity-50 transition-opacity whitespace-nowrap">
               <div className="flex gap-2 items-center text-[8px] font-black uppercase tracking-widest">
                 <span className="text-indigo-500">MESH_INDEX:</span> 4.8PB
               </div>
               <div className="flex gap-2 items-center text-[8px] font-black uppercase tracking-widest">
                 <span className="text-indigo-500">ACTIVE_PINGS:</span> {users.length * 124}
               </div>
               <div className="flex gap-2 items-center text-[8px] font-black uppercase tracking-widest">
                 <span className="text-indigo-500">LATENCY:</span> 12ms
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODE SELECTOR */}
      <section className="flex justify-center animate-slide-up stagger-3">
        <div className={`flex p-1.5 rounded-2xl border backdrop-blur-md shadow-xl transition-all duration-500 ${isDark ? 'bg-black/40 border-white/10' : 'bg-slate-100/50 border-slate-200'}`}>
          {(['Projects', 'Architects'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-12 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden group ${
                mode === m 
                  ? 'bg-indigo-600 text-white shadow-lg scale-105' 
                  : `opacity-40 hover:opacity-100 ${isDark ? 'text-white' : 'text-slate-900'}`
              }`}
            >
              <span className="relative z-10">{m}</span>
              {mode === m && <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>}
            </button>
          ))}
        </div>
      </section>

      {/* RESULTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-slide-up stagger-4">
        {mode === 'Projects' ? (
          filteredProjects.map(p => (
            <div key={p.id} className={`p-10 rounded-[3rem] border group cursor-pointer transition-all duration-500 hover:-translate-y-4 relative overflow-hidden ${
              isDark ? 'bg-CODQIT-darkCard border-CODQIT-darkBorder hover:border-indigo-500/40' : 'bg-white border-slate-200 shadow-xl'
            }`}>
               {/* Aesthetic corner accent */}
               <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>

               <div className="flex justify-between items-start mb-8 relative z-10">
                 <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl group-hover:rotate-6 transition-transform">
                   {p.title.charAt(0)}
                 </div>
                 <div className="flex gap-2">
                   <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[8px] font-black uppercase tracking-widest">Verified_Build</span>
                 </div>
               </div>
               
               <div className="space-y-4 relative z-10">
                 <h3 className="text-2xl font-black tracking-tight group-hover:text-indigo-500 transition-colors leading-none">{p.title}</h3>
                 <p className="text-sm opacity-40 leading-relaxed line-clamp-2 font-medium italic">"{p.description}"</p>
               </div>

               <div className="flex flex-wrap gap-2 pt-8 mt-8 border-t border-gray-500/5 relative z-10">
                 {p.techStack.map(s => (
                   <span key={s} className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-white/5 opacity-40 group-hover:opacity-100 group-hover:text-indigo-400' : 'bg-slate-50 opacity-60'}`}>{s}</span>
                 ))}
               </div>
            </div>
          ))
        ) : (
          filteredUsers.map(u => {
            const roleDef = PROFESSIONAL_ROLES.find(r => r.role === u.role) || PROFESSIONAL_ROLES[PROFESSIONAL_ROLES.length-1];
            return (
              <div key={u.id} onClick={() => onViewProfile?.(u.id)} className={`p-10 rounded-[3.5rem] border group cursor-pointer transition-all duration-500 hover:-translate-y-4 text-center relative overflow-hidden ${
                isDark ? 'bg-CODQIT-darkCard border-CODQIT-darkBorder hover:border-indigo-500/40' : 'bg-white border-slate-200 shadow-xl'
              }`}>
                {/* Background flare */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 blur-[80px] opacity-10 transition-opacity group-hover:opacity-20 ${roleDef.bg}`}></div>

                <div className="relative mb-8 flex justify-center">
                  <div className="relative">
                    <div className={`absolute -inset-2 rounded-[2.8rem] blur-lg opacity-0 group-hover:opacity-40 transition-opacity ${roleDef.bg}`}></div>
                    <img src={u.avatar} className="relative w-32 h-32 rounded-[2.5rem] border-4 border-white dark:border-CODQIT-dark shadow-2xl z-10 object-cover" alt="" />
                    <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl border-2 border-white dark:border-black flex items-center justify-center text-sm z-20 shadow-xl ${roleDef.bg} ${roleDef.color}`}>
                      {roleDef.icon}
                    </div>
                  </div>
                </div>

                <div className="space-y-1 relative z-10">
                  <h3 className="text-2xl font-black tracking-tighter uppercase group-hover:text-indigo-500 transition-colors">{u.name}</h3>
                  <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${roleDef.color}`}>{u.role}</p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mt-8 pt-8 border-t border-gray-500/5 relative z-10">
                   {u.skills.slice(0, 3).map(s => (
                     <span key={s} className="px-3 py-1 bg-black/5 dark:bg-white/5 rounded-xl text-[8px] font-black uppercase opacity-40 tracking-widest">{s}</span>
                   ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Discovery;
