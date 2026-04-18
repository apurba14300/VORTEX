
import React, { useState } from 'react';
import { useCODQITState } from './hooks/useCODQITState';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import Discovery from './components/Discovery';
import AIStarter from './components/AIStarter';
import Chat from './components/Chat';
import CallingUI from './components/CallingUI';
import UserProfile from './components/UserProfile';
import Subscription from './components/Subscription';
import Auth from './components/Auth';

const App: React.FC = () => {
  const CODQIT = useCODQITState();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [isAssistantCallOpen, setIsAssistantCallOpen] = useState(false);

  const handleViewProfile = (userId: string) => {
    setViewingUserId(userId);
    setActiveTab('profile');
  };

  const handleMessage = (userId: string) => {
    setActiveTab('chat');
  };

  const handleTalkToAssistant = () => {
    setIsAssistantCallOpen(true);
  };

  if (!CODQIT.currentUser) {
    return (
      <Auth 
        isDark={CODQIT.theme !== 'light'} 
        onLogin={CODQIT.login} 
        onSignup={CODQIT.signup} 
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard state={CODQIT as any} onReact={CODQIT.reactToProject} onViewProfile={handleViewProfile} />;
      case 'discovery':
        return (
          <Discovery 
            state={CODQIT} 
            onReact={CODQIT.reactToProject} 
            onFollow={CODQIT.toggleFollow} 
            onViewProfile={handleViewProfile}
          />
        );
      case 'projects':
        const myProjects = CODQIT.projects.filter(p => p.ownerId === CODQIT.currentUser?.id);
        return (
          <ProjectList 
            projects={myProjects} 
            onReact={CODQIT.reactToProject} 
            onAddProject={CODQIT.addProject} 
            currentUser={CODQIT.currentUser}
            isDark={CODQIT.theme !== 'light'}
          />
        );
      case 'ai-starter':
        return <AIStarter state={CODQIT} onProjectCreated={CODQIT.addProject} />;
      case 'chat':
        return (
          <Chat 
            state={{
              ...CODQIT,
              toggleStarUser: (CODQIT as any).toggleStarUser || (() => {}),
              setUserNickname: (CODQIT as any).setUserNickname || (() => {})
            }} 
            onSendMessage={CODQIT.sendMessage} 
            onViewProfile={handleViewProfile} 
          />
        );
      case 'subscription':
        return <Subscription state={CODQIT} onPurchase={(CODQIT as any).purchasePrime} onActivateDirectly={(CODQIT as any).activatePrimeDirectly} />;
      case 'profile':
        const displayUser = viewingUserId 
          ? CODQIT.users.find(u => u.id === viewingUserId) 
          : CODQIT.currentUser;
        
        if (!displayUser) return (
          <div className="flex items-center justify-center h-full text-center p-20 opacity-20">
            <div>
              <span className="text-9xl mb-10 block">📡</span>
              <p className="text-xl font-black uppercase tracking-widest">Architect Signal Lost</p>
              <button onClick={() => setActiveTab('dashboard')} className="mt-8 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Return to Base</button>
            </div>
          </div>
        );

        const userProjects = CODQIT.projects.filter(p => p.ownerId === displayUser.id);
        const isSelf = CODQIT.currentUser?.id === displayUser.id;
        const isFollowing = CODQIT.currentUser?.following.includes(displayUser.id) || false;
        const globalIndex = CODQIT.getUserGlobalIndex(displayUser.id);

        return (
          <>
            <UserProfile 
              user={displayUser}
              isSelf={isSelf}
              isFollowing={isFollowing}
              onFollow={CODQIT.toggleFollow}
              onMessage={handleMessage}
              onTalkToAssistant={handleTalkToAssistant}
              onTogglePrivacy={(CODQIT as any).toggleProfilePrivacy}
              projects={userProjects}
              isDark={CODQIT.theme !== 'light'}
              allUsers={CODQIT.users}
              globalIndex={globalIndex}
              onUpdateProfile={CODQIT.updateProfile}
            />
            
            {!isSelf && (
              <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
                <button 
                  onClick={() => setViewingUserId(null)}
                  className="bg-black/80 backdrop-blur-md text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] border border-white/20 shadow-4xl hover:bg-indigo-600 transition-all hover:scale-105 active:scale-95"
                >
                  Return to my Identity
                </button>
              </div>
            )}

            <CallingUI 
              isOpen={isAssistantCallOpen} 
              onClose={() => setIsAssistantCallOpen(false)} 
              contactName={displayUser.name + " Assistant"} 
              contactAvatar={displayUser.avatar}
            />
          </>
        );
      default:
        return <Dashboard state={CODQIT as any} onReact={CODQIT.reactToProject} onViewProfile={handleViewProfile} />;
    }
  };

  const handleTabChange = (tab: string) => {
    if (tab !== 'profile') setViewingUserId(null);
    setActiveTab(tab);
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={handleTabChange} 
      theme={CODQIT.theme} 
      setTheme={CODQIT.setTheme}
      user={CODQIT.currentUser}
      onSubmitFeedback={CODQIT.submitFeedback}
    >
      {renderContent()}
    </Layout>
  );
};


export default App;
