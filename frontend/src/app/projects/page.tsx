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
    <div className="p-6 md:p-8 space-y-8">
      {/* Header & Control */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 interior-card bg-white shadow-sm">
        <div>
          <h1 className="text-3xl interior-heading mb-1">
            Community Projects
          </h1>
          <p className="interior-text font-sans text-sm">Explore amazing projects built by SkillForge students.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="interior-pill interior-pill-active shadow-md flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Add Your Project
        </button>
      </div>

      {/* Project Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-80 bg-gray-100 rounded-[24px] border border-gray-200"></div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[24px] border border-dashed border-gray-300">
          <p className="interior-text font-sans mb-4">No projects have been uploaded yet.</p>
          <button onClick={() => setIsModalOpen(true)} className="text-gray-900 font-bold hover:underline">Be the first to upload one!</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="interior-panel flex flex-col group overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
              
              {/* Thumbnail Header */}
              <div className="h-40 bg-gray-100 relative overflow-hidden border-b border-gray-100">
                {project.thumbnail ? (
                  <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-4xl">🚀</span>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm ${
                    project.status === 'completed' ? 'bg-green-500 text-white' : 
                    project.status === 'in-progress' ? 'bg-yellow-500 text-white' : 'bg-gray-800 text-white'
                  }`}>
                    {project.status.replace('-', ' ')}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                {/* Author Info */}
                <div className="flex items-center gap-3 mb-4 -mt-10">
                  <div className="w-12 h-12 rounded-full bg-white border-4 border-white flex items-center justify-center overflow-hidden z-10 shadow-sm">
                    {project.owner?.avatar ? (
                      <img src={project.owner.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-gray-500 bg-gray-100 w-full h-full flex items-center justify-center">{project.owner?.name?.charAt(0) || '?'}</span>
                    )}
                  </div>
                  <div className="pt-6">
                    <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-cyan transition-colors line-clamp-1">{project.title}</h3>
                    <p className="text-xs font-sans text-gray-500 truncate">by {project.owner?.name}</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-6 flex-grow line-clamp-3">
                  {project.description}
                </p>
                
                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack?.map((tech: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-auto">
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-1 interior-pill interior-pill-active shadow-sm text-center flex items-center justify-center gap-2"
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
                      className="flex-1 interior-pill text-center flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
                      Source
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddProject} 
      />
    </div>
  );
}
