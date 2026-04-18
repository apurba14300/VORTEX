
import React, { useState, useMemo } from 'react';
import { AppState, Message, User } from '../types';
import CallingUI from './CallingUI';

interface ChatProps {
  state: AppState & { 
    toggleStarUser: (id: string) => void;
    setUserNickname: (id: string, name: string) => void;
  };
  onSendMessage: (msg: Message) => void;
  onViewProfile?: (userId: string) => void;
}

const Chat: React.FC<ChatProps> = ({ state, onSendMessage, onViewProfile }) => {
  const { currentUser, theme, users, toggleStarUser, setUserNickname } = state;
  const isDark = theme === 'dark' || theme === 'dim';
  
  // Contacts are everyone except current user
  const contacts = useMemo(() => {
    return users.filter(u => u.id !== currentUser?.id).map(u => ({
      ...u,
      nickname: currentUser?.nicknames?.[u.id] || u.name,
      isStarred: currentUser?.starredUsers?.includes(u.id) || false
    })).sort((a, b) => {
      // Starred first, then by name
      if (a.isStarred && !b.isStarred) return -1;
      if (!a.isStarred && b.isStarred) return 1;
      return a.nickname.localeCompare(b.nickname);
    });
  }, [users, currentUser]);

  const [selectedContactId, setSelectedContactId] = useState(contacts[0]?.id);
  const selectedContact = contacts.find(c => c.id === selectedContactId) || contacts[0];

  const [text, setText] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [tempNickname, setTempNickname] = useState('');

  const chatMessages = state.messages.filter(m => 
    (m.senderId === state.currentUser?.id && m.receiverId === selectedContactId) ||
    (m.senderId === selectedContactId && m.receiverId === state.currentUser?.id)
  );

  const handleSend = () => {
    if (!text.trim() || !state.currentUser || !selectedContactId) return;
    const newMsg: Message = {
      id: Math.random().toString(),
      senderId: state.currentUser.id,
      receiverId: selectedContactId,
      content: text,
      timestamp: new Date().toISOString()
    };
    onSendMessage(newMsg);
    setText('');
  };

  const handleSaveNickname = () => {
    if (selectedContactId) {
      setUserNickname(selectedContactId, tempNickname);
      setIsEditingNickname(false);
    }
  };

  return (
    <div className={`flex h-[calc(100vh-180px)] rounded-[3rem] overflow-hidden border shadow-2xl animate-fade-in ${isDark ? 'bg-CODQIT-darkCard border-CODQIT-darkBorder' : 'bg-white border-slate-200'}`}>
      <CallingUI 
        isOpen={isCalling} 
        onClose={() => setIsCalling(false)} 
        contactName={selectedContact?.nickname || selectedContact?.name} 
        contactAvatar={selectedContact?.avatar} 
      />

      {/* Sidebar */}
      <div className={`w-80 border-r flex flex-col transition-all duration-700 ${isDark ? 'bg-black/40 border-CODQIT-darkBorder' : 'bg-slate-50/50 border-slate-200'}`}>
        <div className="p-8">
          <h2 className="text-2xl font-black tracking-tighter mb-6 uppercase">Sync Nodes</h2>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Locate node..." 
              className={`w-full pl-12 pr-4 py-4 rounded-2xl text-sm outline-none transition-all ${isDark ? 'bg-black/50 border-white/5 focus:border-indigo-500/50' : 'bg-white border-slate-200 focus:border-indigo-500'}`}
            />
            <span className="absolute left-4 top-4 opacity-30">🔍</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
          {contacts.map(c => {
            const isActive = selectedContactId === c.id;
            return (
              <div key={c.id} className="relative group/contact">
                <button 
                  onClick={() => setSelectedContactId(c.id)}
                  className={`w-full p-4 flex items-center gap-4 rounded-[1.5rem] transition-all duration-500 ${isActive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 scale-[1.02]' : `hover:bg-indigo-500/5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}`}
                >
                  <div className="relative flex-shrink-0">
                    <img src={c.avatar} className="w-12 h-12 rounded-2xl object-cover" alt="" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white dark:border-black rounded-full"></div>
                  </div>
                  <div className="text-left overflow-hidden flex-1">
                    <p className={`font-black text-sm tracking-tight truncate ${isActive ? 'text-white' : ''}`}>
                      {c.isStarred && <span className="mr-1 text-yellow-500">★</span>}
                      {c.nickname}
                    </p>
                    <p className={`text-[10px] font-medium truncate w-full mt-0.5 opacity-50 uppercase tracking-widest ${isActive ? 'text-indigo-100' : ''}`}>Active link...</p>
                  </div>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleStarUser(c.id); }}
                  className={`absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/contact:opacity-100 transition-opacity text-lg ${c.isStarred ? 'text-yellow-500 opacity-100' : 'text-slate-400 hover:text-yellow-500'}`}
                >
                  {c.isStarred ? '★' : '☆'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className={`p-8 border-b flex items-center justify-between z-10 ${isDark ? 'bg-CODQIT-darkCard border-CODQIT-darkBorder' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-5">
            <div className="relative cursor-pointer group" onClick={() => onViewProfile?.(selectedContact?.id)}>
              <div className="absolute -inset-1 bg-indigo-500 rounded-2xl blur opacity-0 group-hover:opacity-40 transition-opacity"></div>
              <img src={selectedContact?.avatar} className="w-14 h-14 rounded-2xl shadow-xl shadow-indigo-500/10 relative z-10" alt="" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white dark:border-black rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)] z-20"></div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <p className="font-black text-xl tracking-tight cursor-pointer hover:text-indigo-500 transition-colors" onClick={() => onViewProfile?.(selectedContact?.id)}>
                  {selectedContact?.nickname}
                </p>
                <button 
                  onClick={() => { setTempNickname(selectedContact?.nickname || ''); setIsEditingNickname(true); }}
                  className="text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 hover:text-indigo-500 transition-all"
                >
                  [EDIT NICKNAME]
                </button>
                <button 
                  onClick={() => toggleStarUser(selectedContact?.id)}
                  className={`text-xl transition-all ${selectedContact?.isStarred ? 'text-yellow-500 scale-125' : 'text-slate-300 hover:text-yellow-500'}`}
                >
                  {selectedContact?.isStarred ? '★' : '☆'}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500">Quantum Parity Established</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsCalling(true)}
              className="w-14 h-14 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">📞</span>
            </button>
            <button className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm group ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'}`}>
              <span className="text-2xl group-hover:scale-110 transition-transform">📹</span>
            </button>
          </div>
        </div>

        {/* Nickname Editor Overlay */}
        {isEditingNickname && (
          <div className="absolute inset-x-0 top-32 z-20 px-10 animate-slide-up">
            <div className={`p-6 rounded-[2rem] border-2 shadow-4xl flex items-center gap-4 ${isDark ? 'bg-CODQIT-darkCard border-indigo-500/30' : 'bg-white border-indigo-500'}`}>
              <input 
                type="text" 
                value={tempNickname}
                onChange={(e) => setTempNickname(e.target.value)}
                placeholder="Assign brief nickname..."
                className="flex-1 bg-transparent border-none outline-none font-black text-lg tracking-tight px-4"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveNickname()}
              />
              <button 
                onClick={handleSaveNickname}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95"
              >
                SAVE ID
              </button>
              <button 
                onClick={() => setIsEditingNickname(false)}
                className="text-xs font-black uppercase tracking-widest opacity-40 hover:opacity-100"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}

        <div className={`flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar ${isDark ? 'bg-black/20' : 'bg-slate-50/20'}`}>
          {!selectedContactId && (
            <div className="flex flex-col items-center justify-center h-full opacity-10 animate-fade-in">
              <span className="text-9xl mb-6">🛸</span>
              <p className="font-black uppercase tracking-[0.5em] text-sm">Waiting for first contact</p>
            </div>
          )}
          {chatMessages.map(m => {
            const isMe = m.senderId === state.currentUser?.id;
            return (
              <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                <div className={`max-w-[70%] p-6 rounded-[2.5rem] text-sm leading-relaxed shadow-xl ${
                  isMe 
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-500/20' 
                    : `${isDark ? 'bg-CODQIT-darkCard border-CODQIT-darkBorder' : 'bg-white border-slate-100'} rounded-bl-none`
                }`}>
                  <p className="font-medium text-base">{m.content}</p>
                  <p className={`text-[9px] font-black mt-3 uppercase tracking-[0.2em] ${isMe ? 'text-indigo-200' : 'opacity-20'}`}>
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Sync Confirmed
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`p-8 border-t z-10 ${isDark ? 'bg-CODQIT-darkCard border-CODQIT-darkBorder' : 'bg-white border-slate-200'}`}>
          <div className={`flex gap-4 items-center p-3 rounded-[2rem] border shadow-2xl transition-all ${isDark ? 'bg-black/40 border-white/5 focus-within:border-indigo-500/50' : 'bg-slate-50 border-slate-200 focus-within:border-indigo-500'}`}>
            <button className="w-14 h-14 flex items-center justify-center text-2xl opacity-30 hover:opacity-100 transition-opacity">📎</button>
            <input 
              type="text" 
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Inject payload here..."
              className="flex-1 bg-transparent border-none px-6 py-4 text-base focus:ring-0 outline-none font-medium"
            />
            <button 
              onClick={handleSend}
              className="bg-indigo-600 hover:bg-indigo-700 text-white h-14 px-10 rounded-[1.5rem] shadow-2xl shadow-indigo-600/40 transition-all font-black tracking-tight flex items-center gap-3 active:scale-95"
            >
              <span>SEND</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
