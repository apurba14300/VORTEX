
import React, { useState, useMemo } from 'react';
import { Icons, RANK_METRICS } from '../constants';
import { Theme, User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  user: User | null;
  onSubmitFeedback?: (content: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, theme, setTheme, user, onSubmitFeedback }) => {
  const isDark = theme === Theme.DARK;
  const isDim = theme === Theme.DIM;
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [guideChapter, setGuideChapter] = useState('01');
  const [feedbackContent, setFeedbackContent] = useState('');

  const userRankDef = useMemo(() => {
    return RANK_METRICS.find(r => r.tier === user?.rank) || RANK_METRICS[RANK_METRICS.length - 1];
  }, [user?.rank]);

  const getContainerStyles = () => {
    if (isDark) return "bg-CODQIT-dark text-white border-CODQIT-darkBorder";
    if (isDim) return "bg-CODQIT-dim text-slate-100 border-CODQIT-dimBorder";
    return "bg-CODQIT-light text-slate-900 border-slate-200";
  };

  const getSidebarStyles = () => {
    if (isDark) return "bg-CODQIT-dark text-white border-CODQIT-darkBorder";
    if (isDim) return "bg-CODQIT-dimCard text-slate-100 border-CODQIT-dimBorder";
    return "bg-white text-slate-900 border-slate-200";
  };

  const getHeaderStyles = () => {
    if (isDark) return "bg-CODQIT-dark/80 border-CODQIT-darkBorder glass";
    if (isDim) return "bg-CODQIT-dim/80 border-CODQIT-dimBorder glass";
    return "bg-white/80 border-slate-200 glass";
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackContent.trim()) return;
    onSubmitFeedback?.(feedbackContent);
    setFeedbackContent('');
    setShowFeedbackModal(false);
    alert("SIGNAL_TRANSMITTED: The anomaly report has been successfully routed for immediate rectification.");
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
    { id: 'discovery', label: 'Discovery', icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    )},
    { id: 'projects', label: 'My Builds', icon: Icons.Projects },
    { id: 'ai-starter', label: 'AI Starter', icon: Icons.AI },
    { id: 'chat', label: 'Messages', icon: Icons.Chat },
    { id: 'profile', label: 'Profile', icon: Icons.Profile },
  ];

  const chapters = [
    { id: '01', title: 'Core Infrastructure', icon: '🏛️' },
    { id: '02', title: 'Genesis Protocol', icon: '⚡' },
    { id: '03', title: 'Global Grid Mechanics', icon: '🌐' },
    { id: '04', title: 'Workspace Dynamics', icon: '🛠️' },
    { id: '05', title: 'Neural Uplink', icon: '📡' },
    { id: '06', title: 'Prime Manifestation', icon: '💎' },
  ];

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-all duration-700 ${getContainerStyles()}`}>
      {/* LEFT SIDEBAR */}
      <aside className={`w-20 md:w-72 flex flex-col border-r transition-all duration-700 z-30 ${getSidebarStyles()}`}>
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/40 transform -rotate-6 transition-transform hover:rotate-0 duration-500">
            <span className="text-white font-black text-2xl">C</span>
          </div>
          <div className="hidden md:block">
            <span className="font-black text-2xl tracking-tighter block leading-none">CODQIT</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 block mt-1">Platform</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.25rem] transition-all relative group overflow-hidden ${
                  isActive ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/40' : `hover:bg-indigo-500/10 ${isDark || isDim ? 'text-slate-400' : 'text-slate-600'}`
                }`}
              >
                <item.icon />
                <span className={`hidden md:block font-bold tracking-tight transition-all ${isActive ? 'translate-x-1' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="px-4 pb-4">
          <button
            onClick={() => setActiveTab('subscription')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.25rem] transition-all relative group overflow-hidden ${
              activeTab === 'subscription' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-2xl shadow-purple-500/30' : `bg-indigo-500/5 hover:bg-indigo-500/10 ${isDark || isDim ? 'text-indigo-400 border border-indigo-500/10' : 'text-indigo-600 border border-indigo-100'}`
            }`}
          >
            <div className="flex-shrink-0 text-xl group-hover:scale-110 transition-transform">💎</div>
            <div className="hidden md:block text-left">
              <span className="block font-black text-[10px] uppercase tracking-widest leading-none">CODQIT PRIME</span>
              <span className="text-[8px] font-bold opacity-40 uppercase tracking-tighter">
                {user?.isPrime ? 'Elite Manifested 👑' : 'Upgrade Access'}
              </span>
            </div>
          </button>
        </div>

        <div className="px-4 pb-8 flex gap-2">
          <button 
            onClick={() => setShowGuideModal(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-[8px] font-black uppercase tracking-widest text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all group"
          >
            <span className="group-hover:scale-110 transition-transform hidden md:inline">📘</span>
            GUIDE
          </button>
          <button 
            onClick={() => setShowFeedbackModal(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-500/5 border border-slate-500/10 rounded-xl text-[8px] font-black uppercase tracking-widest text-slate-400 hover:bg-red-600 hover:text-white transition-all group"
          >
            <span className="group-hover:scale-110 transition-transform hidden md:inline">🛡️</span>
            REPORT
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className={`h-20 flex items-center justify-between px-6 md:px-10 border-b transition-all duration-700 z-20 ${getHeaderStyles()}`}>
          <div className="flex items-center gap-4">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-30">{activeTab.replace('-', ' ')}</h2>
            <div className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 ${userRankDef.bg} animate-fade-in`}>
               <span className="text-xs">{userRankDef.icon}</span>
               <span className={`text-[8px] font-black uppercase tracking-widest ${userRankDef.color}`}>{userRankDef.tier}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
             <div className={`hidden lg:flex items-center gap-4 px-4 py-2 rounded-xl border ${isDark || isDim ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-yellow-500/10 border-yellow-500/20'}`}>
               <span className="text-lg">🪙</span>
               <p className="text-sm font-black text-yellow-600 leading-none">{user?.coins.toLocaleString()}</p>
             </div>

            <div 
              className="flex items-center gap-3 group cursor-pointer" 
              onClick={() => setActiveTab('profile')}
            >
              <div className="hidden md:flex flex-col items-end">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black tracking-tight uppercase truncate max-w-[100px] leading-none">
                    {user?.name.split(' ')[0]}
                  </span>
                  {user?.isPrime && (
                    <span className="text-xs animate-bounce drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">👑</span>
                  )}
                </div>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-30 leading-none mt-1">
                  {user?.isPrime ? 'Prime' : 'Node'}
                </span>
              </div>
              <div className="relative">
                <div className={`absolute -inset-1 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity ${user?.isPrime ? 'bg-amber-500' : 'bg-indigo-500'}`}></div>
                <img 
                  src={user?.avatar} 
                  alt="Profile" 
                  className={`relative w-9 h-9 md:w-11 md:h-11 rounded-xl border-2 transition-all duration-500 group-hover:scale-105 ${user?.isPrime ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'border-indigo-500/30'}`} 
                />
              </div>
            </div>
          </div>
        </header>

        <div className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-700 ${getContainerStyles()}`}>
          <div className="p-4 md:p-8 max-w-[1600px] mx-auto animate-slide-up">
            {children}
          </div>
        </div>
      </main>

      {/* OVERHAULED GUIDE MODAL - TECHNICAL MANUAL */}
      {showGuideModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className={`w-full max-w-6xl rounded-[3rem] border-2 animate-in zoom-in-95 duration-500 relative overflow-hidden shadow-4xl h-[85vh] flex flex-col md:flex-row ${isDark || isDim ? 'bg-CODQIT-darkCard border-indigo-500/30' : 'bg-white border-slate-200'}`}>
            
            {/* MANUAL SIDEBAR NAVIGATION */}
            <aside className={`w-full md:w-80 flex flex-col border-r overflow-hidden ${isDark || isDim ? 'bg-black/40 border-indigo-500/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="p-8 border-b border-gray-500/10">
                <h3 className="text-2xl font-black tracking-tighter uppercase leading-none">OPERATIONS</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mt-2 opacity-60">Manual v4.2.1</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {chapters.map(chap => (
                  <button 
                    key={chap.id}
                    onClick={() => setGuideChapter(chap.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-left transition-all group ${guideChapter === chap.id ? 'bg-indigo-600 text-white shadow-xl' : 'hover:bg-indigo-500/5 opacity-50 hover:opacity-100'}`}
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">{chap.icon}</span>
                    <div className="flex-1 overflow-hidden">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 leading-none mb-1">Chapter {chap.id}</p>
                       <p className="font-bold text-sm tracking-tight truncate">{chap.title}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-8 border-t border-gray-500/10">
                <button 
                  onClick={() => setShowGuideModal(false)}
                  className="w-full py-4 bg-red-600/10 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                >
                  Close Manual
                </button>
              </div>
            </aside>

            {/* MANUAL CONTENT PANEL */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative p-8 md:p-16">
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none"></div>
              
              <div className="max-w-4xl space-y-12 animate-fade-in" key={guideChapter}>
                {guideChapter === '01' && (
                  <>
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-500 border-l-4 border-indigo-600 pl-4">01. THE_NEURAL_MESH</h4>
                      <h2 className="text-5xl font-black tracking-tighter uppercase">Mechanical Core</h2>
                      <p className="text-xl opacity-60 font-medium leading-relaxed tracking-tight italic">
                        "Code is no longer static. It is a manifested signal within the CODQIT mesh."
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 space-y-4">
                        <p className="font-black text-indigo-400 text-xs uppercase tracking-widest">How It Works</p>
                        <p className="text-sm opacity-50 leading-relaxed">
                          CODQIT utilizes high-frequency AI synthesis (via Gemini 3 Pro) to bridge the gap between architectural vision and technical execution. Every action you take is logged into the Grid as a 'Manifestation'.
                        </p>
                      </div>
                      <div className="p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 space-y-4">
                        <p className="font-black text-indigo-400 text-xs uppercase tracking-widest">Ecosystem Rules</p>
                        <ul className="text-xs opacity-50 space-y-2 list-disc pl-4">
                          <li>Respect the manifest frequency.</li>
                          <li>Validate all architectural peer loops.</li>
                          <li>Climb the grid through technical verified status.</li>
                        </ul>
                      </div>
                    </div>
                  </>
                )}

                {guideChapter === '02' && (
                  <>
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-500 border-l-4 border-indigo-600 pl-4">02. GENESIS_PROTOCOL</h4>
                      <h2 className="text-5xl font-black tracking-tighter uppercase">AI Starter Mechanics</h2>
                      <p className="text-xl opacity-60 font-medium leading-relaxed tracking-tight italic">
                        "Transform raw conceptual intent into production-ready scaffolds."
                      </p>
                    </div>
                    <div className="space-y-8">
                       <div className="flex gap-8 items-start">
                         <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white shrink-0 shadow-xl">1</div>
                         <div className="space-y-2">
                           <p className="text-lg font-bold tracking-tight uppercase">Inject Payload</p>
                           <p className="text-sm opacity-50 leading-relaxed">Navigate to 'AI Starter'. Describe your project in the 'Transmit Intent' field. Be specific about tech stacks and architectural goals.</p>
                         </div>
                       </div>
                       <div className="flex gap-8 items-start">
                         <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white shrink-0 shadow-xl">2</div>
                         <div className="space-y-2">
                           <p className="text-lg font-bold tracking-tight uppercase">Neural Synthesis</p>
                           <p className="text-sm opacity-50 leading-relaxed">Click 'MANIFEST'. Our neural engine analyzes your current skill-set (from your profile) and mixes it with your intent to build a custom roadmap and initial code structure.</p>
                         </div>
                       </div>
                       <div className="flex gap-8 items-start">
                         <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white shrink-0 shadow-xl">3</div>
                         <div className="space-y-2">
                           <p className="text-lg font-bold tracking-tight uppercase">Instantiate Workspace</p>
                           <p className="text-sm opacity-50 leading-relaxed">Click 'DEPLOY ARCHITECTURE' to move the manifested project into your 'My Builds' workspace. You can now track technical debt and roadmap progress.</p>
                         </div>
                       </div>
                    </div>
                  </>
                )}

                {guideChapter === '03' && (
                  <>
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-500 border-l-4 border-indigo-600 pl-4">03. GRID_HIERARCHY</h4>
                      <h2 className="text-5xl font-black tracking-tighter uppercase">Reputation Loop</h2>
                      <p className="text-xl opacity-60 font-medium leading-relaxed tracking-tight italic">
                        "Ascend the rankings through technical verification."
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                       {RANK_METRICS.map(rank => (
                         <div key={rank.tier} className={`p-6 rounded-[2rem] border-2 ${rank.bg} ${rank.border} text-center space-y-4`}>
                            <span className="text-4xl block">{rank.icon}</span>
                            <div>
                               <p className={`text-xs font-black uppercase tracking-widest ${rank.color}`}>{rank.tier}</p>
                               <p className="text-[9px] opacity-40 uppercase tracking-tighter mt-1">Status: Verified</p>
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="p-10 rounded-[3rem] border border-gray-500/10 bg-black/5 dark:bg-white/5 space-y-6">
                       <p className="text-sm font-bold opacity-60">To climb the grid, you must:</p>
                       <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <li className="flex gap-3 text-xs font-medium opacity-50"><span className="text-indigo-500 font-black">✓</span> Complete roadmap milestones in 'My Builds'.</li>
                          <li className="flex gap-3 text-xs font-medium opacity-50"><span className="text-indigo-500 font-black">✓</span> Earn 'Likes' (Manifestation Boosts) from other nodes.</li>
                          <li className="flex gap-3 text-xs font-medium opacity-50"><span className="text-indigo-500 font-black">✓</span> Reach high test-coverage metrics.</li>
                          <li className="flex gap-3 text-xs font-medium opacity-50"><span className="text-indigo-500 font-black">✓</span> Maintain a low technical-debt score.</li>
                       </ul>
                    </div>
                  </>
                )}

                {guideChapter === '04' && (
                  <>
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-500 border-l-4 border-indigo-600 pl-4">04. WORKSPACE_DYNAMICS</h4>
                      <h2 className="text-5xl font-black tracking-tighter uppercase">Engineering Health</h2>
                      <p className="text-xl opacity-60 font-medium leading-relaxed tracking-tight italic">
                        "Professional-grade oversight for every build."
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="p-8 rounded-[2rem] border border-indigo-500/10 bg-indigo-500/5 space-y-4">
                          <p className="font-black text-indigo-400 text-[10px] uppercase tracking-widest">Health Score</p>
                          <p className="text-sm opacity-50">Calculated based on code structure, vulnerability scans, and modularity. Aim for 90%+.</p>
                       </div>
                       <div className="p-8 rounded-[2rem] border border-red-500/10 bg-red-500/5 space-y-4">
                          <p className="font-black text-red-400 text-[10px] uppercase tracking-widest">Tech Debt (h)</p>
                          <p className="text-sm opacity-50">Represents the hours required to refactor sub-optimal manifesting decisions. Keep this low.</p>
                       </div>
                       <div className="p-8 rounded-[2rem] border border-emerald-500/10 bg-emerald-500/5 space-y-4">
                          <p className="font-black text-emerald-400 text-[10px] uppercase tracking-widest">Test Coverage</p>
                          <p className="text-sm opacity-50">Ensures architectural stability. High coverage prevents neural link interruptions.</p>
                       </div>
                    </div>
                    <div className="p-10 rounded-[3rem] border border-gray-500/10 space-y-4">
                       <p className="font-black uppercase tracking-[0.4em] text-[10px] opacity-40">AI ARCHITECTURE REVIEW</p>
                       <p className="text-sm font-medium opacity-60 leading-relaxed">
                         Our Senior AI Reviewers scan your manifest and provide a report. These reports include 'Scalability Risks' and 'Security Vulnerabilities'. Read them carefully to avoid system anomalies.
                       </p>
                    </div>
                  </>
                )}

                {guideChapter === '05' && (
                  <>
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-500 border-l-4 border-indigo-600 pl-4">05. NEURAL_UPLINK</h4>
                      <h2 className="text-5xl font-black tracking-tighter uppercase">Communication Channels</h2>
                      <p className="text-xl opacity-60 font-medium leading-relaxed tracking-tight italic">
                        "High-latency voice and text sync across the mesh."
                      </p>
                    </div>
                    <div className="space-y-8">
                       <div className="p-8 rounded-[3rem] border border-indigo-500/20 bg-indigo-600/5 space-y-4">
                          <h5 className="text-xl font-black tracking-tighter">Real-Time Assistant Call</h5>
                          <p className="text-sm opacity-50 leading-relaxed">You can call any Architect's Assistant via voice. This uses raw PCM audio streaming (Gemini 2.5 Live) for instant technical consultation. Just hit the phone icon in chat or on a profile.</p>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="p-8 rounded-[2rem] border border-gray-500/10 space-y-3">
                             <p className="font-black text-[10px] uppercase tracking-widest opacity-40">Node Sync (Chat)</p>
                             <p className="text-xs opacity-50">Secure, end-to-end encrypted messaging with other developers. Supports code payload injection and nickname assignments.</p>
                          </div>
                          <div className="p-8 rounded-[2rem] border border-gray-500/10 space-y-3">
                             <p className="font-black text-[10px] uppercase tracking-widest opacity-40">Discovery Hub</p>
                             <p className="text-xs opacity-50">Scan the network for other elite nodes. Use filters to find architects by tech-stack weight or reputation score.</p>
                          </div>
                       </div>
                    </div>
                  </>
                )}

                {guideChapter === '06' && (
                  <>
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-500 border-l-4 border-indigo-600 pl-4">06. PRIME_MANIFESTATION</h4>
                      <h2 className="text-5xl font-black tracking-tighter uppercase">Subscription Elite</h2>
                      <p className="text-xl opacity-60 font-medium leading-relaxed tracking-tight italic">
                        "Unlock infinite architectural power."
                      </p>
                    </div>
                    <div className="p-12 rounded-[4rem] border-4 border-amber-500/30 bg-amber-500/5 space-y-8">
                       <div className="flex items-center gap-6">
                         <span className="text-6xl">👑</span>
                         <div>
                            <p className="text-3xl font-black tracking-tighter">CODQIT PRIME</p>
                            <p className="text-xs font-black uppercase tracking-[0.4em] text-amber-500">Elite Protocol Active</p>
                         </div>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            "Unlimited AI Generations",
                            "Elite Crown Badge Visibility",
                            "Priority Sync Speed",
                            "Advanced Security Scans",
                            "Prime-Only Discovery Channels",
                            "Custom Manifestation Icons"
                          ].map(ben => (
                            <div key={ben} className="flex gap-3 text-xs font-bold opacity-60"><span className="text-amber-500 font-black">★</span> {ben}</div>
                          ))}
                       </div>
                       <button 
                         onClick={() => { setActiveTab('subscription'); setShowGuideModal(false); }}
                         className="w-full py-5 bg-amber-500 text-black rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-amber-500/20"
                       >
                         Upgrade Now
                       </button>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className={`w-full max-w-xl rounded-[3rem] border-2 p-12 space-y-10 animate-in zoom-in-95 duration-500 relative overflow-hidden ${isDark || isDim ? 'bg-CODQIT-darkCard border-indigo-500/20' : 'bg-white border-slate-200 shadow-4xl'}`}>
            <h3 className="text-3xl font-black tracking-tighter uppercase">ANOMALY_REPORT</h3>
            <textarea 
              value={feedbackContent}
              onChange={(e) => setFeedbackContent(e.target.value)}
              placeholder="Describe the problem to be fixed..."
              className={`w-full px-8 py-6 rounded-3xl text-lg font-medium outline-none border-2 transition-all h-48 ${isDark || isDim ? 'bg-black/40 border-white/5 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 focus:border-indigo-500'}`}
            />
            <div className="flex gap-4">
              <button onClick={() => setShowFeedbackModal(false)} className="flex-1 py-6 rounded-3xl font-black text-xs uppercase tracking-widest border border-gray-500/10">ABORT</button>
              <button onClick={handleFeedbackSubmit} className="flex-[2] py-6 bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/30">FIX_ANOMALY</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
