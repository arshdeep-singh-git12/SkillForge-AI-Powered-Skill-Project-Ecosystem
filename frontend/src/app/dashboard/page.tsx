'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProjects, createProject } from '../../services/project.service';
import ProjectModal from '../../components/dashboard/ProjectModal';

export default function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Failed to load projects', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleAddProject = async (projectData: any) => {
    try {
      const newProject = await createProject(projectData);
      setProjects([newProject, ...projects]);
    } catch (error) {
      console.error('Failed to create project', error);
      alert('Failed to upload project. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-machined-900 text-machined-100 p-6 md:p-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] rounded-full bg-cyan-dim blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Header & Quick Shortcuts */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-machined-800/50 backdrop-blur-md p-8 rounded-2xl border border-machined-600 shadow-xl">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-machined-100 to-machined-400 mb-2">
              Dashboard Overview
            </h1>
            <p className="text-machined-400 font-mono">Welcome back to SkillForge. Here's what's happening.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-cyan hover:bg-cyan-hover text-machined-900 font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(12,189,232,0.3)] hover:shadow-[0_0_20px_rgba(12,189,232,0.5)] flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Upload Project
            </button>
            <Link href="/teams" className="bg-machined-700 hover:bg-machined-600 text-machined-100 border border-machined-500 font-bold py-3 px-6 rounded-xl transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              Find a Team
            </Link>
            <Link href="/assessments" className="bg-machined-700 hover:bg-machined-600 text-machined-100 border border-machined-500 font-bold py-3 px-6 rounded-xl transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
              Coding Challenges
            </Link>
          </div>
        </div>

        {/* Project Grid */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-machined-100">Community Projects</h2>
            <div className="text-sm font-mono text-cyan">{projects.length} Projects Live</div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1,2,3].map(i => (
                <div key={i} className="h-64 bg-machined-800 rounded-2xl border border-machined-700"></div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 bg-machined-800/30 rounded-2xl border border-dashed border-machined-600">
              <p className="text-machined-400 font-mono mb-4">No projects have been uploaded yet.</p>
              <button onClick={() => setIsModalOpen(true)} className="text-cyan hover:underline">Be the first to upload one!</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div key={project._id} className="bg-machined-800 border border-machined-600 hover:border-cyan transition-colors rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(12,189,232,0.15)] flex flex-col group">
                  <div className="p-6 flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-machined-700 border border-machined-500 flex items-center justify-center overflow-hidden">
                        {project.owner?.avatar ? (
                          <img src={project.owner.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold text-machined-300">{project.owner?.name?.charAt(0) || '?'}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-machined-100 leading-tight group-hover:text-cyan transition-colors">{project.title}</h3>
                        <p className="text-xs font-mono text-machined-400">by {project.owner?.name}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-machined-300 mb-6 line-clamp-3">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.techStack?.map((tech: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-machined-900 border border-machined-700 text-cyan text-xs font-mono rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {project.githubUrl && (
                    <div className="px-6 py-4 bg-machined-900 border-t border-machined-700">
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-machined-400 hover:text-cyan font-mono text-sm flex items-center gap-2 transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
                        View Source
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddProject} 
      />
    </div>
  );
}
