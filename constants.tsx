
import React from 'react';

export const Icons = {
  Dashboard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
    </svg>
  ),
  Projects: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  Chat: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  AI: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Profile: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
};

export const RANK_METRICS = [
  { tier: 'Grandmaster', icon: '🏆', bg: 'bg-purple-500/20', border: 'border-purple-500/40', color: 'text-purple-400', glow: 'shadow-purple-500/20' },
  { tier: 'Master', icon: '🥇', bg: 'bg-blue-500/20', border: 'border-blue-500/40', color: 'text-blue-400', glow: 'shadow-blue-500/20' },
  { tier: 'Elite', icon: '🥈', bg: 'bg-teal-500/20', border: 'border-teal-500/40', color: 'text-teal-400', glow: 'shadow-teal-500/20' },
  { tier: 'Drone', icon: '🥉', bg: 'bg-gray-500/20', border: 'border-gray-500/40', color: 'text-gray-400', glow: 'shadow-gray-500/10' },
];

// Added PROFESSIONAL_ROLES for Discovery and Profile components
export const PROFESSIONAL_ROLES = [
  { role: 'Lead Architect', icon: '🏛️', bg: 'bg-indigo-500/20', color: 'text-indigo-400' },
  { role: 'Fullstack Developer', icon: '🛠️', bg: 'bg-emerald-500/20', color: 'text-emerald-400' },
  { role: 'Security Researcher', icon: '🛡️', bg: 'bg-red-500/20', color: 'text-red-400' },
];
