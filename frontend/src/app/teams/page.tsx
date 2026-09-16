'use client';

import React, { useEffect, useState } from 'react';
import { getTeams, createTeam, joinTeam } from '../../services/team.service';
import CreateTeamModal from '../../components/teams/CreateTeamModal';
import { useAuth } from '../../context/AuthContext';

export default function TeamsPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchSkill, setSearchSkill] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await getTeams();
        setTeams(data);
      } catch (error) {
        console.error('Failed to load teams', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const handleCreateTeam = async (teamData: any) => {
    try {
      const newTeam = await createTeam(teamData);
      setTeams([newTeam, ...teams]);
    } catch (error) {
      console.error('Failed to create team', error);
      alert('Failed to launch team. Try again.');
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    try {
      await joinTeam(teamId);
      // Optimistically update the UI
      setTeams(teams.map(t => {
        if (t._id === teamId) {
          return { ...t, members: [...t.members, { _id: user?._id }] };
        }
        return t;
      }));
      alert('Successfully joined the team!');
    } catch (error: any) {
      console.error('Failed to join team', error);
      alert(error.response?.data?.message || 'Failed to join team.');
    }
  };

  const filteredTeams = searchSkill 
    ? teams.filter(t => t.requiredSkills?.some((s: string) => s.toLowerCase().includes(searchSkill.toLowerCase())))
    : teams;

  return (
    <div className="min-h-screen bg-machined-900 text-machined-100 p-6 md:p-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] rounded-full bg-cyan-dim blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-machined-100 to-machined-400 mb-2">
              Team Finder
            </h1>
            <p className="text-machined-400 font-mono">Connect with peers and build something amazing together.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-machined-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input 
                type="text" 
                placeholder="Search by skill (e.g. React)" 
                value={searchSkill}
                onChange={(e) => setSearchSkill(e.target.value)}
                className="w-full sm:w-64 bg-machined-800 border border-machined-600 rounded-xl pl-10 pr-4 py-3 text-machined-100 focus:border-cyan focus:outline-none transition-colors"
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-cyan hover:bg-cyan-hover text-machined-900 font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(12,189,232,0.3)] hover:shadow-[0_0_20px_rgba(12,189,232,0.5)] whitespace-nowrap"
            >
              + Create New Team
            </button>
          </div>
        </div>

        {/* Team Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-72 bg-machined-800 rounded-2xl border border-machined-700"></div>
            ))}
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="text-center py-20 bg-machined-800/30 rounded-2xl border border-dashed border-machined-600">
            <p className="text-machined-400 font-mono mb-4">No teams found looking for that skill.</p>
            <button onClick={() => setSearchSkill('')} className="text-cyan hover:underline">Clear Search</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTeams.map((team) => {
              const isFull = team.members.length >= team.maxMembers;
              const isMember = user && team.members.some((m: any) => m._id === user._id);

              return (
                <div key={team._id} className="bg-machined-800 border border-machined-600 hover:border-machined-500 transition-colors rounded-2xl p-6 shadow-lg flex flex-col group relative overflow-hidden">
                  
                  {isFull && <div className="absolute top-0 right-0 bg-red-500/20 text-red-400 font-mono text-xs px-3 py-1 rounded-bl-lg border-b border-l border-red-500/50">FULL</div>}
                  {isMember && <div className="absolute top-0 right-0 bg-cyan/20 text-cyan font-mono text-xs px-3 py-1 rounded-bl-lg border-b border-l border-cyan/50">MEMBER</div>}

                  <h3 className="font-bold text-xl text-machined-100 mb-2">{team.name}</h3>
                  <p className="text-sm text-machined-300 mb-6 flex-grow">{team.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-xs font-mono text-machined-400 uppercase tracking-wider block mb-2">Looking For</span>
                    <div className="flex flex-wrap gap-2">
                      {team.requiredSkills?.map((skill: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-machined-900 border border-machined-700 text-cyan text-xs font-mono rounded">
                          {skill}
                        </span>
                      ))}
                      {(!team.requiredSkills || team.requiredSkills.length === 0) && (
                        <span className="text-machined-500 text-sm italic">Any skills</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-machined-700">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {/* Display up to 3 member avatars/initials */}
                        {team.members.slice(0, 3).map((m: any, i: number) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-machined-700 border-2 border-machined-800 flex items-center justify-center overflow-hidden z-10" style={{ zIndex: 10 - i }}>
                            {m.avatar ? (
                              <img src={m.avatar} alt="Member" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs font-bold text-machined-300">{m.name ? m.name.charAt(0) : '?'}</span>
                            )}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs font-mono text-machined-400 ml-2">
                        {team.members.length} / {team.maxMembers}
                      </span>
                    </div>

                    {!isMember && !isFull && (
                      <button 
                        onClick={() => handleJoinTeam(team._id)}
                        className="bg-transparent hover:bg-cyan/10 text-cyan border border-cyan/50 hover:border-cyan text-sm font-bold py-2 px-4 rounded-lg transition-colors"
                      >
                        Request to Join
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CreateTeamModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateTeam} 
      />
    </div>
  );
}
