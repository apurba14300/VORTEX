
import React, { useState } from 'react';
import { Project, ProjectMilestone } from '../types';

interface ProjectListProps {
  projects: Project[];
  onAddProject?: (p: Project) => void;
  onReact?: (projectId: string, type: string) => void;
  currentUser?: any;
  isDark?: boolean;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, isDark = true, onReact }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects[0]?.id || null);
  const activeProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="flex h-[calc(100vh-160px)] gap-8 animate-fade-in">
      {/* Project Selector Sidebar */}
      <div className={`w-80 border-r flex flex-col p-6 space-y-4 ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
        <h2 className="text-xl font-black uppercase tracking-tighter mb-4">Workspaces</h2>
        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
          {projects.map(p => (
            <button 
              key={p.id}
              onClick={() => setSelectedProjectId(p.id)}
              className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-4 ${selectedProjectId === p.id ? 'bg-indigo-600 text-white shadow-xl' : 'hover:bg-indigo-500/10'}`}
            >
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center font-black">
                {p.title.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-bold truncate text-sm">{p.title}</p>
                <p className="text-[9px] uppercase tracking-widest opacity-60">Status: Passing</p>
              </div>
            </button>
          ))}
          {projects.length === 0 && <p className="text-xs opacity-30 text-center py-10">No workspaces established.</p>}
        </div>
      </div>

      {/* Workspace Dashboard */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 pb-20">
        {activeProject ? (
          <div className="space-y-10">
            {/* Project Header */}
            <div className={`p-10 rounded-[2.5rem] border ${isDark ? 'bg-CODQIT-darkCard border-CODQIT-darkBorder' : 'bg-white border-slate-200 shadow-xl'}`}>
               <div className="flex items-start justify-between mb-8">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tighter">{activeProject.title}</h1>
                    <p className="text-sm opacity-50 max-w-2xl">{activeProject.description}</p>
                  </div>
                  <div className="flex gap-4">
                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg">Deployment Docs</button>
                    <button className="px-6 py-2 border border-white/10 rounded-xl text-xs font-bold">Settings</button>
                  </div>
               </div>
               
               <div className="grid grid-cols-4 gap-4">
                  <Metric icon="🐙" label="Repo Link" value="GitHub Established" />
                  <Metric icon="⚖️" label="Compliance" value="SOC2 Compliant" />
                  <Metric icon="📦" label="Registry" value="Docker Node Active" />
                  <Metric icon="🚀" label="Environment" value="Production V3.1" />
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Technical Lifecycle Metrics */}
              <div className={`lg:col-span-2 p-10 rounded-[2.5rem] border ${isDark ? 'bg-CODQIT-darkCard border-CODQIT-darkBorder' : 'bg-white border-slate-200 shadow-xl'}`}>
                 <h3 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-500 mb-8">Engineering Health Graph</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <HealthIndicator label="Code Coverage" value={activeProject.metrics.testCoverage} />
                       <HealthIndicator label="Maintainability" value={88} />
                       <HealthIndicator label="Performance" value={94} />
                    </div>
                    <div className="space-y-6">
                       <div className="p-6 rounded-2xl bg-black/10 dark:bg-white/5 border border-transparent">
                          <p className="text-[10px] opacity-30 uppercase font-black mb-2">Technical Debt Assessment</p>
                          <p className="text-3xl font-black text-amber-500">{activeProject.metrics.techDebt}h</p>
                          <p className="text-[9px] opacity-50 mt-1 uppercase tracking-widest font-bold">Trend: Improving (-2h)</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Roadmap Sidebar */}
              <div className={`p-10 rounded-[2.5rem] border ${isDark ? 'bg-CODQIT-darkCard border-CODQIT-darkBorder' : 'bg-white border-slate-200 shadow-xl'}`}>
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-500 mb-8">Roadmap & Milestones</h3>
                <div className="space-y-6">
                  {activeProject.roadmap.map(m => (
                    <div key={m.id} className="flex gap-4 items-start group">
                      <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${m.status === 'completed' ? 'bg-indigo-600 border-indigo-600' : 'border-gray-500/20'}`}>
                        {m.status === 'completed' && <span className="text-[10px] text-white">✓</span>}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${m.status === 'completed' ? 'opacity-30 line-through' : ''}`}>{m.label}</p>
                        <p className="text-[9px] opacity-40 uppercase tracking-widest mt-1">Due: {m.dueDate || 'Unscheduled'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Architecture Reports */}
            <div className={`p-10 rounded-[2.5rem] border ${isDark ? 'bg-CODQIT-darkCard border-CODQIT-darkBorder' : 'bg-white border-slate-200 shadow-xl'}`}>
               <div className="flex items-center justify-between mb-10">
                 <h3 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-500">Professional Architecture Review</h3>
                 <button className="text-[10px] font-black bg-indigo-500 text-white px-6 py-2 rounded-xl shadow-lg">Export Report (PDF)</button>
               </div>
               
               {activeProject.reviews.length > 0 ? (
                 <div className="space-y-8">
                   <div className="flex gap-10 items-center border-b border-gray-500/10 pb-8">
                      <div className="text-center">
                        <p className="text-6xl font-black text-emerald-500">{activeProject.reviews[0].healthScore}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mt-2">Core Quality Score</p>
                      </div>
                      <p className="text-lg font-medium italic opacity-60">"{activeProject.reviews[0].summary}"</p>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {activeProject.reviews[0].findings.map((f, i) => (
                        <div key={i} className={`p-6 rounded-2xl border ${f.severity === 'critical' ? 'bg-red-500/5 border-red-500/20' : 'bg-indigo-500/5 border-indigo-500/20'}`}>
                           <div className="flex items-center gap-2 mb-2">
                             <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${f.severity === 'critical' ? 'bg-red-500 text-white' : 'bg-indigo-600 text-white'}`}>{f.severity}</span>
                             <span className="text-[9px] font-black uppercase opacity-40 tracking-widest">{f.category}</span>
                           </div>
                           <p className="text-sm font-bold opacity-80">{f.description}</p>
                        </div>
                      ))}
                   </div>
                 </div>
               ) : (
                 <div className="py-20 text-center opacity-30">
                    <p className="text-sm font-black uppercase tracking-widest">No AI Review Synchronized</p>
                 </div>
               )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
             <span className="text-9xl mb-10">🏛️</span>
             <p className="text-xl font-black uppercase tracking-widest">Select Workspace Context</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Metric = ({ icon, label, value }: any) => (
  <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-transparent">
    <div className="flex items-center gap-2 mb-1">
      <span className="text-xs">{icon}</span>
      <p className="text-[9px] font-black uppercase tracking-widest opacity-40">{label}</p>
    </div>
    <p className="text-xs font-black truncate">{value}</p>
  </div>
);

const HealthIndicator = ({ label, value }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
      <span className="opacity-40">{label}</span>
      <span className="text-indigo-500">{value}%</span>
    </div>
    <div className="w-full h-1.5 bg-gray-500/10 rounded-full overflow-hidden">
      <div className="h-full bg-indigo-600" style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

export default ProjectList;
