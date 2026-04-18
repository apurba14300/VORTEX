
import { useState, useEffect, useCallback } from 'react';
import { User, Project, Message, Theme, AppState, SubscriptionEvent } from '../types';

const STORAGE_KEY = 'CODQIT_app_state_v1';

const initialUsers: User[] = [
  {
    id: 'u1',
    name: 'Apurba Sikder',
    avatar: 'https://picsum.photos/seed/CODQIT/200',
    banner: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1600',
    bio: 'Lead Architect manifesting high-performance neural networks. Exploring the edges of code and consciousness.',
    role: 'Lead Architect',
    skills: ['React', 'TypeScript', 'Node.js', 'Rust', 'Web3'],
    coins: 500000,
    reputation: 95,
    rank: 'Grandmaster',
    isVerified: true,
    followers: [],
    following: [],
    isPrime: true,
    isPrivate: false,
    lastNameChangeDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), // Changed 40 days ago
  }
];

const initialProjects: Project[] = [
  {
    id: 'p1',
    ownerId: 'u1',
    title: 'CODQIT Engine V3',
    description: 'A revolutionary low-latency state synchronization engine for distributed manifestations.',
    techStack: ['Rust', 'WASM', 'WebRTC'],
    image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800',
    likes: 1242,
    views: 8900,
    createdAt: new Date().toISOString(),
    isPublic: true,
    roadmap: [],
    files: [],
    metrics: {
      testCoverage: 92,
      techDebt: 5,
      deploymentFrequency: 14
    },
    reviews: []
  }
];

export function useCODQITState() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed;
      } catch(e) { console.error(e); }
    }
    return {
      currentUser: null,
      users: initialUsers,
      projects: initialProjects,
      messages: [],
      theme: Theme.DARK,
      subscriptionEvents: []
    };
  });

  const login = useCallback((email: string) => {
    const existingUser = state.users.find(u => u.name.toLowerCase().includes(email.split('@')[0].toLowerCase()));
    if (existingUser) {
      setState(prev => ({ ...prev, currentUser: existingUser }));
      return true;
    }
    return false;
  }, [state.users]);

  const signup = useCallback((name: string, email: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      avatar: `https://picsum.photos/seed/${name}/200`,
      banner: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1600',
      bio: 'New architect entering the mesh.',
      role: 'Junior Architect',
      skills: ['Genesis'],
      coins: 1000,
      reputation: 50,
      rank: 'Drone',
      isVerified: false,
      followers: [],
      following: [],
      isPrime: false,
      isPrivate: false,
      lastNameChangeDate: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUser: newUser
    }));
  }, []);

  const logout = useCallback(() => {
    setState(prev => ({ ...prev, currentUser: null }));
  }, []);

  const updateProfile = useCallback((userId: string, updates: Partial<User>) => {
    setState(prev => {
      const existing = prev.users.find(u => u.id === userId);
      if (!existing) return prev;

      // If name is being changed, update the timestamp
      const finalUpdates = { ...updates };
      if (updates.name && updates.name !== existing.name) {
        finalUpdates.lastNameChangeDate = new Date().toISOString();
      }

      const updatedUsers = prev.users.map(u => u.id === userId ? { ...u, ...finalUpdates } : u);
      const updatedCurrentUser = prev.currentUser?.id === userId ? { ...prev.currentUser, ...finalUpdates } : prev.currentUser;
      return { ...prev, users: updatedUsers, currentUser: updatedCurrentUser };
    });
  }, []);

  const toggleFollow = useCallback((targetId: string) => {
    setState(prev => {
      if (!prev.currentUser) return prev;
      const isFollowing = prev.currentUser.following.includes(targetId);
      const updatedFollowing = isFollowing 
        ? prev.currentUser.following.filter(id => id !== targetId)
        : [...prev.currentUser.following, targetId];
      
      const updatedCurrentUser = { ...prev.currentUser, following: updatedFollowing };
      const updatedUsers = prev.users.map(u => u.id === prev.currentUser?.id ? updatedCurrentUser : u);
      
      return { ...prev, currentUser: updatedCurrentUser, users: updatedUsers };
    });
  }, []);

  const addProject = useCallback((p: Project) => {
    setState(prev => ({ ...prev, projects: [p, ...prev.projects] }));
  }, []);

  const sendMessage = useCallback((msg: Message) => {
    setState(prev => ({ ...prev, messages: [...prev.messages, msg] }));
  }, []);

  const reactToProject = useCallback((projectId: string, type: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === projectId ? { ...p, likes: p.likes + 1 } : p)
    }));
  }, []);

  const purchasePrime = useCallback((cost: number) => {
    setState(prev => {
      if (!prev.currentUser || prev.currentUser.coins < cost) return prev;
      const updatedUser = { 
        ...prev.currentUser, 
        coins: prev.currentUser.coins - cost, 
        isPrime: true,
      };
      return { ...prev, currentUser: updatedUser, users: prev.users.map(u => u.id === prev.currentUser?.id ? updatedUser : u) };
    });
  }, []);

  const activatePrimeDirectly = useCallback((days: number, tierLabel: string) => {
    setState(prev => {
      if (!prev.currentUser) return prev;
      const updatedUser = { ...prev.currentUser, isPrime: true };
      const newEvent: SubscriptionEvent = {
        id: Math.random().toString(36).substr(2, 9),
        userId: prev.currentUser.id,
        userName: prev.currentUser.name,
        userAvatar: prev.currentUser.avatar,
        tierName: tierLabel,
        timestamp: new Date().toISOString()
      };
      return { 
        ...prev, 
        currentUser: updatedUser, 
        users: prev.users.map(u => u.id === prev.currentUser?.id ? updatedUser : u),
        subscriptionEvents: [newEvent, ...prev.subscriptionEvents]
      };
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return {
    ...state,
    setTheme: (theme: Theme) => setState(p => ({ ...p, theme })),
    updateProfile,
    toggleFollow,
    addProject,
    sendMessage,
    reactToProject,
    login,
    signup,
    logout,
    getUserGlobalIndex: (id: string) => state.users.findIndex(u => u.id === id) + 1,
    submitFeedback: (content: string) => { console.log('Feedback:', content); }
  };
}
