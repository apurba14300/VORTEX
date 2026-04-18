
import React, { useMemo, useState } from 'react';
import { User, Project } from '../types';
import { RANK_METRICS } from '../constants';

interface UserProfileProps {
  user: User;
  isSelf: boolean;
  isFollowing: boolean;
  onFollow: (id: string) => void;
  onMessage: (id: string) => void;
  onTalkToAssistant: () => void;
  onTogglePrivacy?: () => void;
  projects: Project[];
  isDark: boolean;
  allUsers: User[];
  globalIndex: number;
  onUpdateProfile?: (userId: string, updates: Partial<User>) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  user, isSelf, isFollowing, onFollow, onMessage, 
  onTalkToAssistant, projects, isDark, globalIndex, onUpdateProfile 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Local temporary state for editing
  const [editName, setEditName] = useState(user.name);
  const [editAvatar, setEditAvatar] = useState(user.avatar);
  const [editBio, setEditBio] = useState(user.bio);
  const [editBanner, setEditBanner] = useState(user.banner);
  const [editSkills, setEditSkills] = useState(user.skills.join(', '));

  const rankDef = useMemo(() => {
    return RANK_METRICS.find(r => r.tier === user.rank) || RANK_METRICS[RANK_METRICS.length - 1];
  }, [user.rank]);

  const daysSinceNameChange = useMemo(() => {
    if (!user.lastNameChangeDate) return 999;
    const lastDate = new Date(user.lastNameChangeDate).getTime();
    const now = new Date().getTime();
    const diff = now - lastDate;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }, [user.lastNameChangeDate]);

  const canChangeName = daysSinceNameChange >= 30;
  const daysRemaining = 30 - daysSinceNameChange;

  const handleSave = () => {
    const updates: Partial<User> = {
      avatar: editAvatar,
      bio: editBio,
      banner: editBanner,
      skills: editSkills.split(',').map(s => s.trim()).filter(s => s),
    };

    if (canChangeName && editName !== user.name) {
      updates.name = editName;
    }

    onUpdateProfile?.(user.id, updates);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(user.name);
    setEditAvatar(user.avatar);
    setEditBio(user.bio);
    setEditBanner(user.banner);
    setEditSkills(user.skills.join(', '));
    setIsEditing(false);
  };

  const shareUrl = `CODQIT.io/node/${user.name.toLowerCase().replace(/\s+/g, '-')}-${user.id.slice(0, 4)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const isProfileLocked = user.isPrivate && !isSelf;
  const qrColor = user.isPrime ? 'f59e0b' : '6366f1';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(shareUrl)}&color=${qrColor}&bgcolor=ffffff&margin=20&qzone=2`;

  return (
    <div className="max-w-6xl mx-auto animate-slide-up pb-32">
      <div className="relative mb-28 group/banner">
        {/* BANNER AREA */}
        <div className={`h-64 md:h-80 rounded-[3rem] shadow-2xl overflow-hidden relative transition-all duration-700 border-2 ${isEditing ? 'border-indigo-500/50' : 'border-transparent'} ${isDark ? 'bg-indigo-950/20' : 'bg-slate-100'}`}>
          <img 
            src={isProfileLocked ? 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1600' : (isEditing ? editBanner : user.banner)} 
            className={`w-full h-full object-cover transition-opacity duration-500 ${isProfileLocked ? 'blur-md opacity-40' : ''}`} 
            alt="Banner" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          {isEditing && (
            <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[1px] bg-black/10 opacity-0 hover:opacity-100 transition-opacity">
               <button 
                onClick={() => {
                  const url = prompt("SYNC_BANNER_PAYLOAD:", editBanner);
                  if (url) setEditBanner(url);
                }}
                className="px-6 py-3 bg-white text-black rounded-xl font-black text-[9px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform flex items-center gap-2"
               >
                 <span>🖼️ SYNC BANNER</span>
               </button>
            </div>
          )}
        </div>

        <div className="absolute -bottom-20 left-8 right-8 flex flex-col md:flex-row items-center md:items-end gap-8">
          {/* AVATAR AREA */}
          <div className="relative group shrink-0">
            <div className={`absolute -inset-1.5 bg-gradient-to-br ${user.isPrime ? 'from-amber-400 to-amber-600' : 'from-indigo-500 to-purple-600'} rounded-[2.5rem] blur-sm opacity-40 transition duration-700`}></div>
            <img 
              src={isProfileLocked ? 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' : (isEditing ? editAvatar : user.avatar)} 
              className="relative w-36 h-36 md:w-44 md:h-44 rounded-[2.3rem] border-4 border-black shadow-3xl object-cover z-10 transition-transform duration-700" 
              alt={user.name} 
            />
            {isEditing && (
              <button 
                onClick={() => {
                  const url = prompt("SYNC_AVATAR_SIGNAL:", editAvatar);
                  if (url) setEditAvatar(url);
                }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 rounded-[2.3rem] border-4 border-transparent opacity-0 hover:opacity-100 transition-all text-white font-black text-[8px] uppercase tracking-widest text-center"
              >
                UPDATE
              </button>
            )}
          </div>

          <div className="flex-1 text-center md:text-left pb-4 space-y-2">
            {isEditing ? (
              <div className="space-y-1">
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  disabled={!canChangeName}
                  className={`text-3xl md:text-5xl font-black tracking-tighter bg-transparent border-b-2 outline-none w-full max-w-sm transition-all ${
                    !canChangeName 
                    ? 'border-gray-500/10 opacity-40 cursor-not-allowed' 
                    : 'border-indigo-600 text-white focus:border-indigo-400'
                  }`}
                />
                {!canChangeName && <p className="text-[8px] font-black uppercase text-amber-500 tracking-widest">Locked: {daysRemaining} Days</p>}
              </div>
            ) : (
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-lg leading-none">
                {user.name}
              </h1>
            )}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-sm font-bold text-white/50 tracking-widest font-mono">@{user.name.toLowerCase().replace(/\s/g, '_')}</span>
              {user.isPrime && <span className="px-3 py-1 bg-amber-500 text-black rounded-full text-[8px] font-black uppercase tracking-widest shadow-md">PRIME</span>}
            </div>
          </div>

          {/* MINIMIZED BUTTON SECTION */}
          <div className="pb-6 flex gap-2 items-center">
             {isSelf ? (
               isEditing ? (
                 <>
                   <button onClick={handleCancel} className="px-3 py-2 bg-red-600/10 text-red-500 border border-red-500/10 rounded-xl font-black text-[8px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">ABORT</button>
                   <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-black text-[8px] uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all">SYNC</button>
                 </>
               ) : (
                 <>
                  <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl font-black text-[8px] uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all">RECONFIGURE_ID</button>
                  <button onClick={() => setIsSharing(true)} className={`px-3 py-1.5 rounded-xl font-black text-[8px] uppercase tracking-widest transition-all ${isDark ? 'bg-white/5 text-white border border-white/5 hover:bg-white/10' : 'bg-slate-50 text-slate-900 border border-slate-200'}`}>SHARE</button>
                 </>
               )
             ) : !isProfileLocked && (
                <button onClick={() => onFollow(user.id)} className={`px-5 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${isFollowing ? 'bg-slate-500/10 text-slate-500' : 'bg-indigo-600 text-white shadow-lg'}`}>
                  {isFollowing ? 'SYNCED' : 'FOLLOW'}
                </button>
             )}
          </div>
        </div>
      </div>

      {/* STATS & BIO SECTION - MINIMIZED */}
      <section className={`mt-24 p-8 rounded-[2.5rem] border shadow-2xl flex flex-col md:flex-row items-center gap-10 transition-all duration-500 ${isEditing ? 'border-indigo-500/30 bg-indigo-500/5' : (isDark ? 'bg-CODQIT-darkCard border-CODQIT-darkBorder' : 'bg-white border-slate-100')}`}>
        <div className="flex items-center gap-10 shrink-0">
          <Stat label="Rank" value={`#${globalIndex}`} sub="Global" isPrime={user.isPrime} />
          <div className="w-px h-12 bg-gray-500/10"></div>
          <Stat label="Rep" value={`${user.reputation}%`} sub="Verified" />
        </div>
        
        {!isProfileLocked && (
          <div className="flex-1 w-full">
             <div className="flex items-center gap-2 mb-2">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30">Neural Bio</p>
                {isEditing && <span className="text-[7px] font-bold text-indigo-500 uppercase animate-pulse">[EDIT]</span>}
             </div>
             {isEditing ? (
               <textarea 
                value={editBio} 
                onChange={(e) => setEditBio(e.target.value)}
                className={`w-full p-4 rounded-2xl text-sm font-medium outline-none border-2 transition-all h-20 leading-relaxed ${isDark ? 'bg-black/40 border-white/5 focus:border-indigo-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-indigo-500'}`}
               />
             ) : (
               <p className="text-base font-medium opacity-60 italic leading-relaxed">"{user.bio}"</p>
             )}
          </div>
        )}
      </section>

      {/* EDITING SKILLS - MINIMIZED */}
      {isEditing && (
        <div className="mt-6 p-8 rounded-[2.5rem] border-2 border-indigo-500/10 bg-indigo-500/5 animate-in slide-in-from-bottom-4">
           <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40">Tech Stack (CSV)</label>
              <input 
                type="text" 
                value={editSkills}
                onChange={(e) => setEditSkills(e.target.value)}
                className={`w-full px-6 py-4 rounded-2xl text-sm font-black outline-none border-2 transition-all ${isDark ? 'bg-black/40 border-white/5 focus:border-indigo-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-indigo-500'}`}
              />
           </div>
        </div>
      )}

      {/* NEURAL SIGNATURE MODAL */}
      {isSharing && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className={`w-full max-w-lg rounded-[3rem] border-2 p-8 text-center relative shadow-4xl animate-in zoom-in-95 duration-500 ${isDark ? 'bg-CODQIT-darkCard border-indigo-500/20' : 'bg-white border-slate-200'}`}>
            <div className="space-y-6 mb-8">
              <h3 className="text-3xl font-black tracking-tighter uppercase">{user.name.split(' ')[0]}'s Signature</h3>
              <div className="relative p-6 bg-white rounded-3xl shadow-xl mx-auto w-64 h-64 overflow-hidden border border-gray-100">
                 <img src={qrUrl} className="w-full aspect-square object-contain" alt="QR" />
              </div>
              <p className="font-mono text-[8px] opacity-30 break-all">{shareUrl}</p>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={handleCopyLink} className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${copySuccess ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white shadow-lg'}`}>
                {copySuccess ? 'COPIED ✓' : 'COPY NEURAL LINK'}
              </button>
              <button onClick={() => setIsSharing(false)} className="py-4 opacity-40 text-[9px] font-black uppercase tracking-widest hover:opacity-100">CLOSE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Stat = ({ label, value, sub, isPrime }: any) => (
  <div className="text-center md:text-left">
    <p className="text-[9px] font-black uppercase opacity-20 tracking-[0.4em] mb-1">{label}</p>
    <p className={`text-3xl font-black tracking-tighter leading-none ${isPrime ? 'text-amber-500' : ''}`}>{value}</p>
    <p className="text-[8px] font-bold opacity-30 uppercase tracking-widest mt-1">{sub}</p>
  </div>
);

export default UserProfile;
