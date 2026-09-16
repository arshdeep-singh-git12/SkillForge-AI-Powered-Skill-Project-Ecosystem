'use client';

import React, { useEffect, useState } from 'react';
import { getProjects, createProject } from '../../services/project.service';
import ProjectModal from '../../components/dashboard/ProjectModal';

export default function ProjectsPage() {
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
      <div className="absolute top-0 right-1/3 w-[50%] h-[50%] rounded-full bg-cyan-dim blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Header & Control */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-machined-100 to-machined-400 mb-2">
              Community Projects
            </h1>
            <p className="text-machined-400 font-mono">Explore amazing projects built by SkillForge students.</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-cyan hover:bg-cyan-hover text-machined-900 font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(12,189,232,0.3)] hover:shadow-[0_0_20px_rgba(12,189,232,0.5)] whitespace-nowrap"
          >
            + Add Your Project
          </button>
        </div>

        {/* Project Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-80 bg-machined-800 rounded-2xl border border-machined-700"></div>
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
              <div key={project._id} className="bg-machined-800 border border-machined-600 hover:border-cyan transition-all duration-300 rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(12,189,232,0.15)] flex flex-col group transform hover:-translate-y-1">
                
                {/* Thumbnail Header */}
                <div className="h-40 bg-machined-900 relative overflow-hidden border-b border-machined-600">
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-machined-800 to-machined-900">
                      <span className="text-4xl text-machined-700">🚀</span>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded backdrop-blur-md ${
                      project.status === 'completed' ? 'bg-green-500/80 text-white' : 
                      project.status === 'in-progress' ? 'bg-yellow-500/80 text-white' : 'bg-machined-600/80 text-white'
                    }`}>
                      {project.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  {/* Author Info */}
                  <div className="flex items-center gap-3 mb-4 -mt-10">
                    <div className="w-12 h-12 rounded-full bg-machined-800 border-4 border-machined-800 flex items-center justify-center overflow-hidden z-10 shadow-lg">
                      {project.owner?.avatar ? (
                        <img src={project.owner.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bold text-machined-300">{project.owner?.name?.charAt(0) || '?'}</span>
                      )}
                    </div>
                    <div className="pt-5">
                      <h3 className="font-bold text-lg text-machined-100 leading-tight group-hover:text-cyan transition-colors line-clamp-1">{project.title}</h3>
                      <p className="text-xs font-mono text-machined-400 truncate">by {project.owner?.name}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-machined-300 mb-6 flex-grow line-clamp-3">
                    {project.description}
                  </p>
                  
                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack?.map((tech: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-machined-900 border border-machined-700 text-cyan text-xs font-mono rounded">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-machined-700">
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex-1 bg-cyan hover:bg-cyan-hover text-machined-900 font-bold py-2 px-4 rounded-lg text-center text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex-1 bg-machined-900 border border-machined-600 hover:border-machined-400 hover:bg-machined-700 text-machined-100 font-bold py-2 px-4 rounded-lg text-center text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddProject} 
      />
    </div>
  );
}
