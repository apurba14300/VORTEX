
import React, { useState, useEffect } from 'react';

interface AuthProps {
  onLogin: (email: string, password: string) => boolean;
  onSignup: (name: string, email: string, password: string) => void;
  isDark: boolean;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onSignup, isDark }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isBooting, setIsBooting] = useState(true);
  const [isAbducting, setIsAbducting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsAbducting(true);

    // Short delay for the "abduction" effect
    setTimeout(() => {
      if (isLogin) {
        const success = onLogin(email, password);
        if (!success) {
          setError("AUTHENTICATION FAILED: Please check your credentials.");
          setIsAbducting(false);
        }
      } else {
        if (!name || !email || !password) {
          setError("DATA MISSING: All fields are required to forge identity.");
          setIsAbducting(false);
          return;
        }
        onSignup(name, email, password);
      }
    }, 1200);
  };

  if (isBooting) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-8 overflow-hidden relative">
        <div className="absolute inset-0 abduction-warp opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[length:50px_50px] animate-warp-speed"></div>
        </div>
        <div className="relative">
          <div className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_100px_rgba(79,70,229,0.6)] animate-glitch rotate-6">
            <span className="text-white text-6xl font-black italic select-none">C</span>
          </div>
        </div>
        <p className="font-mono text-[10px] text-indigo-500 tracking-[1.5em] uppercase font-black animate-pulse">BOOTING_CODQIT_CORE</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-mono ${isDark ? 'bg-black text-indigo-500' : 'bg-slate-50 text-indigo-900'}`}>
      
      {/* Background Visuals: Starfield & Grid */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 hologram-grid opacity-20"></div>
        <div className="absolute inset-0 star-field opacity-10 animate-warp-speed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(79,70,229,0.1)_0%,transparent_70%)] animate-glow-pulse"></div>
      </div>

      <div className={`relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center transition-all duration-700 ${isAbducting ? 'scale-110 opacity-0 blur-2xl' : 'scale-100 opacity-100'}`}>
        
        {/* Left Side: Brand Identity */}
        <div className="hidden lg:flex lg:col-span-5 flex-col space-y-16 animate-fade-in">
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_80px_rgba(79,70,229,0.4)] rotate-6">
                <span className="text-white text-6xl font-black italic">C</span>
              </div>
              <div className="space-y-1">
                <h1 className="text-7xl font-black tracking-tighter leading-none text-glitch">CODQIT</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.8em] opacity-40">System Access</p>
              </div>
            </div>
            <p className="text-xl font-bold opacity-60 leading-tight italic max-w-sm">
              "The premier ecosystem for architectural manifestation."
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-8 rounded-[3rem] border border-indigo-500/20 bg-indigo-500/5 backdrop-blur-xl">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] mb-6 opacity-40 underline">Live System Metrics</p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[8px] font-black uppercase opacity-30 mb-1">Grid Status</p>
                  <p className="text-lg font-black text-white">OPTIMAL</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase opacity-30 mb-1">Encrypted Link</p>
                  <p className="text-lg font-black text-indigo-400">ACTIVE</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: The Terminal Form */}
        <div className="lg:col-span-7 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-lg">
            
            {/* Form Container */}
            <div className={`relative rounded-[4.5rem] p-10 md:p-16 space-y-12 backdrop-blur-3xl border-2 shadow-4xl transition-all duration-700 ${isDark ? 'bg-CODQIT-darkCard/90 border-indigo-500/30' : 'bg-white border-slate-200'}`}>
              
              {/* HUD Decoration */}
              <div className="absolute top-8 right-12 flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-20"></div>
              </div>

              <div className="text-center">
                <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">
                  {isLogin ? 'LOGIN // LOGIN' : 'SIGN UP // JOIN'}
                </h2>
                <p className="text-[9px] font-black uppercase tracking-[0.5em] opacity-40">Section: Authentication_Protocol</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {!isLogin && (
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 px-2 flex justify-between group-focus-within:opacity-100 transition-opacity">
                      <span>Full Name</span>
                      <span className="text-indigo-500">USER_HANDLE</span>
                    </label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Architect"
                      className={`w-full px-8 py-5 rounded-3xl text-sm font-black outline-none border-2 transition-all ${isDark ? 'bg-black/50 border-white/5 focus:border-indigo-500 text-white placeholder:text-white/10' : 'bg-slate-50 border-slate-200 focus:border-indigo-500 text-slate-900'}`}
                    />
                  </div>
                )}

                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 px-2 flex justify-between group-focus-within:opacity-100 transition-opacity">
                    <span>Email Address</span>
                    <span className="text-indigo-500">ACCESS_ID</span>
                  </label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="architect@CODQIT.dev"
                    className={`w-full px-8 py-5 rounded-3xl text-sm font-black outline-none border-2 transition-all ${isDark ? 'bg-black/50 border-white/5 focus:border-indigo-500 text-white placeholder:text-white/10' : 'bg-slate-50 border-slate-200 focus:border-indigo-500 text-slate-900'}`}
                  />
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 px-2 flex justify-between group-focus-within:opacity-100 transition-opacity">
                    <span>Password</span>
                    <span className="text-indigo-500">CIPHER</span>
                  </label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full px-8 py-5 rounded-3xl text-sm font-black outline-none border-2 transition-all ${isDark ? 'bg-black/50 border-white/5 focus:border-indigo-500 text-white placeholder:text-white/10' : 'bg-slate-50 border-slate-200 focus:border-indigo-500 text-slate-900'}`}
                  />
                </div>

                {error && (
                  <div className="bg-red-500/10 border-l-4 border-red-500 p-4 animate-glitch-2">
                    <p className="text-[10px] font-black uppercase text-red-500 leading-tight">ERROR: {error}</p>
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full py-7 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.5em] shadow-2xl shadow-indigo-600/40 transition-all hover:scale-[1.02] active:scale-95 relative overflow-hidden group/btn"
                >
                  <span className="relative z-10">{isLogin ? 'LOGIN // INITIALIZE' : 'SIGN UP // CREATE'}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                </button>
              </form>

              <div className="pt-10 border-t border-gray-500/10 flex flex-col items-center gap-6">
                <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em]">
                  {isLogin ? "No account yet?" : "Already have an identity?"}
                </p>
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className={`px-12 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] border transition-all hover:bg-indigo-600 hover:text-white ${isDark ? 'bg-white/5 border-white/10 text-indigo-400' : 'bg-slate-100 border-slate-200 text-indigo-600'}`}
                >
                  {isLogin ? "Create Account" : "Back to Login"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Ticker at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-10 bg-black/40 backdrop-blur-3xl flex items-center overflow-hidden border-t border-white/5">
        <div className="flex animate-ticker whitespace-nowrap text-[8px] font-black uppercase tracking-[0.5em] text-indigo-500/40">
           {[...Array(5)].map((_, i) => (
             <span key={i} className="mx-20">
               NEURAL CONNECTION STABLE // ARCHITECT_CONNECTED // SECURITY_VERSION_4.2 // ENCRYPTION: AES-256 // SESSION_ESTABLISHED //
             </span>
           ))}
        </div>
      </div>

      {/* Full screen abduction effect on login */}
      {isAbducting && (
        <div className="fixed inset-0 z-[100] bg-white animate-fade-in flex items-center justify-center">
          <div className="space-y-4 text-center">
             <div className="w-16 h-16 bg-black rounded-2xl animate-spin mx-auto"></div>
             <p className="font-mono text-black font-black uppercase tracking-[1em] animate-pulse">SYNCHRONIZING...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
