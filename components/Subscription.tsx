
import React, { useMemo, useState, useEffect } from 'react';
import { AppState, SubscriptionEvent } from '../types';

interface SubscriptionProps {
  state: AppState;
  onPurchase: (cost: number) => void;
  onActivateDirectly?: (days: number, tierLabel: string) => void;
}

const Subscription: React.FC<SubscriptionProps> = ({ state, onPurchase, onActivateDirectly }) => {
  const { currentUser, theme, subscriptionEvents } = state;
  const isDark = theme === 'dark' || theme === 'dim';
  const PRIME_COST = 50000;
  const [processingTier, setProcessingTier] = useState<number | null>(null);
  const [activeBroadcast, setActiveBroadcast] = useState<SubscriptionEvent | null>(null);

  // Cycle through broadcasts for social proof
  useEffect(() => {
    if (subscriptionEvents.length === 0) return;
    let index = 0;
    const interval = setInterval(() => {
      setActiveBroadcast(subscriptionEvents[index]);
      index = (index + 1) % subscriptionEvents.length;
    }, 5000);
    return () => clearInterval(interval);
  }, [subscriptionEvents]);

  const timeRemainingText = useMemo(() => {
    if (!currentUser?.primeUntil) return null;
    const expiry = new Date(currentUser.primeUntil);
    const diff = expiry.getTime() - Date.now();
    if (diff <= 0) return "Expiring soon...";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days} Days, ${hours} Hours remaining`;
    if (hours > 0) return `${hours} Hours remaining`;
    return "Expiring soon...";
  }, [currentUser?.primeUntil]);

  const handleDirectActivation = (days: number, tierIndex: number, tierLabel: string) => {
    setProcessingTier(tierIndex);
    setTimeout(() => {
      onActivateDirectly?.(days, tierLabel);
      setProcessingTier(null);
    }, 2000);
  };

  const directTiers = [
    { name: "Monthly Pulse", price: "$4.99", days: 30, description: "Standard monthly synchronization cycle." },
    { name: "Quarterly Mesh", price: "$9.99", days: 90, description: "Extended link for consistent architectural presence." },
    { name: "Annual Infinite", price: "$19.99", days: 365, description: "Full solar cycle manifestation. Ultimate elite status." },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 animate-slide-up space-y-20 pb-48 relative">
      
      {/* Live System Broadcast Toast */}
      {activeBroadcast && (
        <div className="fixed bottom-12 right-12 z-50 animate-slide-up">
           <div className={`p-4 rounded-2xl border flex items-center gap-4 shadow-4xl backdrop-blur-xl ${isDark ? 'bg-indigo-600/20 border-indigo-500/40 text-white' : 'bg-indigo-600 text-white border-transparent'}`}>
              <img src={activeBroadcast.userAvatar} className="w-10 h-10 rounded-xl border-2 border-white/20" alt="" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">System Broadcast</p>
                <p className="text-xs font-bold"><span className="text-white">{activeBroadcast.userName}</span> has just upgraded to <span className="underline decoration-indigo-400">{activeBroadcast.tierName}</span></p>
              </div>
           </div>
        </div>
      )}

      <div className="text-center space-y-4">
        <h2 className="text-6xl md:text-7xl font-black tracking-tighter uppercase">Nexus Subscription</h2>
        <p className="text-xl opacity-40 max-w-2xl mx-auto font-medium italic">
          "Elevate your architectural footprint and unlock the full potential of the CODQIT Neural Mesh."
        </p>
      </div>

      {/* Main Coin Purchase Card */}
      <div className={`rounded-[4rem] border-4 p-12 relative overflow-hidden transition-all duration-1000 ${currentUser?.isPrime ? 'border-indigo-500 bg-indigo-500/5' : 'border-dashed border-gray-500/10'}`}>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] animate-glow-pulse"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="flex-1 space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                {currentUser?.isPrime ? 'CURRENT STATUS: PRIME' : 'TIER: TEMPORARY ELITE'}
              </div>
              <h3 className="text-5xl font-black tracking-tighter">CODQIT <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">PRIME</span></h3>
              <p className="text-sm font-black text-indigo-500 uppercase tracking-[0.3em]">⚡ ECOSYSTEM REWARD TIER</p>
            </div>

            <ul className="space-y-6">
              {[
                "Unlimited Neural Genesis Generations",
                "Verified Elite Badge & Profile Visibility",
                "Advanced AI Code Optimization Suite",
                "Priority Channel Access (No frequency lag)",
                "Custom Deployment Branding"
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-4 group">
                  <div className="w-6 h-6 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-xs font-black shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">✓</div>
                  <p className="text-lg font-bold opacity-70 group-hover:opacity-100 transition-opacity tracking-tight">{benefit}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className={`p-10 rounded-[3rem] text-center border shadow-3xl min-w-[320px] transition-all duration-700 ${isDark ? 'bg-black/60 border-white/5' : 'bg-white border-slate-100'}`}>
            <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-30 mb-2">Architect Credits</p>
            {/* Fixed: Use 'coins' instead of 'credits' to match User interface */}
            <h4 className="text-6xl font-black tracking-tighter mb-8">🪙 {currentUser?.coins.toLocaleString()}</h4>
            
            {currentUser?.isPrime ? (
              <div className="space-y-4">
                <div className="py-6 px-10 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/30">
                  ACTIVE PROTOCOL
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 animate-pulse">
                  {timeRemainingText}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <button 
                  onClick={() => onPurchase(PRIME_COST)}
                  disabled={currentUser!.coins < PRIME_COST}
                  className={`w-full py-6 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all active:scale-95 ${currentUser!.coins >= PRIME_COST ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/30' : 'bg-slate-500/10 text-slate-400 opacity-50 cursor-not-allowed'}`}
                >
                  UPGRADE (7 DAYS)
                </button>
                {currentUser!.coins < PRIME_COST && (
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                    Insufficient Credits • Need { (PRIME_COST - currentUser!.coins).toLocaleString() } more
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tiered Direct Link Section */}
      <div className="space-y-12">
        <div className="text-center space-y-2">
          <h3 className="text-4xl font-black tracking-tighter uppercase">Direct Neural Handshake</h3>
          <p className="text-sm font-bold opacity-30 uppercase tracking-[0.4em]">Establish immediate elite connectivity via secure currency bridge</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {directTiers.map((tier, idx) => (
            <div key={idx} className={`relative group p-10 rounded-[3rem] border transition-all duration-500 hover:scale-[1.03] flex flex-col items-center text-center space-y-6 ${isDark ? 'bg-CODQIT-darkCard border-white/5 hover:border-indigo-500/40' : 'bg-white border-slate-200 hover:border-indigo-500/40 shadow-xl'}`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-8 -mt-8 blur-2xl group-hover:bg-indigo-500/10 transition-colors"></div>
              
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30">{tier.name}</p>
                <h4 className="text-5xl font-black tracking-tighter">{tier.price}</h4>
              </div>

              <p className="text-xs opacity-50 font-medium italic leading-relaxed h-12">"{tier.description}"</p>
              
              <div className="w-full pt-6 border-t border-gray-500/10">
                <button 
                  onClick={() => handleDirectActivation(tier.days, idx, tier.name)}
                  disabled={currentUser?.isPrime || processingTier !== null}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${
                    currentUser?.isPrime 
                      ? 'bg-slate-500/10 text-slate-400 cursor-not-allowed opacity-50' 
                      : 'bg-indigo-600 text-white shadow-indigo-600/30 hover:bg-indigo-700'
                  }`}
                >
                  {processingTier === idx ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      SYNCING...
                    </>
                  ) : currentUser?.isPrime ? (
                    'ACTIVE'
                  ) : (
                    `ACTIVATE ${tier.days}D`
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WALL OF FAME - RECENT UPGRADES */}
      <div className="space-y-10 animate-fade-in pt-12 border-t border-indigo-500/10">
        <div className="text-center space-y-2">
          <h3 className="text-3xl font-black tracking-tighter uppercase">CODQIT Wall of Fame</h3>
          <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em]">Recent architects manifesting Prime frequency</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {subscriptionEvents.map((event) => (
            <div key={event.id} className={`group flex items-center gap-4 p-4 rounded-[2rem] border transition-all hover:scale-105 ${isDark ? 'bg-indigo-600/5 border-indigo-500/20' : 'bg-white border-slate-100 shadow-lg'}`}>
              <div className="relative">
                 <img src={event.userAvatar} className="w-12 h-12 rounded-[1.2rem] object-cover border-2 border-indigo-500/20" alt="" />
                 <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-600 text-[8px] flex items-center justify-center rounded-full text-white font-black shadow-lg">P</div>
              </div>
              <div className="text-left pr-4">
                <p className="text-sm font-black tracking-tighter">{event.userName}</p>
                <p className="text-[8px] font-black uppercase tracking-widest text-indigo-500">{event.tierName}</p>
                <p className="text-[7px] opacity-30 uppercase mt-0.5">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className={`p-10 rounded-[3rem] border shadow-2xl ${isDark ? 'bg-CODQIT-darkCard border-CODQIT-darkBorder' : 'bg-white border-slate-100'}`}>
           <h4 className="text-xl font-black tracking-tighter mb-4 text-indigo-500">Why manifest prime?</h4>
           <p className="text-sm opacity-50 leading-relaxed italic">
             "To maintain ecosystem entropy and high architectural turnover, elite access is granted in precise cycles. This ensures that only the most dedicated creators retain global mesh visibility."
           </p>
        </div>
        <div className={`p-10 rounded-[3rem] border shadow-2xl ${isDark ? 'bg-CODQIT-darkCard border-CODQIT-darkBorder' : 'bg-white border-slate-100'}`}>
           <h4 className="text-xl font-black tracking-tighter mb-4 text-purple-500">Renewal Frequency</h4>
           <p className="text-sm opacity-50 leading-relaxed italic">
             "Renewal is permitted immediately upon frequency lapse. All prime attributes are stackable. Maintain your manifestation to ensure you never lose architectural priority."
           </p>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
