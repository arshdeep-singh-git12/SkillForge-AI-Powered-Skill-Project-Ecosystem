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
    <div className="p-6 md:p-8 space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 interior-card bg-white shadow-sm">
        <div>
          <h1 className="text-3xl interior-heading mb-1">
            Team Finder
          </h1>
          <p className="interior-text font-sans text-sm">Connect with peers and build something amazing together.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Search by skill (e.g. React)" 
              value={searchSkill}
              onChange={(e) => setSearchSkill(e.target.value)}
              className="w-full sm:w-64 bg-gray-50 border border-gray-200 rounded-full pl-9 pr-4 py-2 text-sm text-gray-900 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="interior-pill interior-pill-active shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
          >
            + Create New Team
          </button>
        </div>
      </div>

      {/* Team Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-72 bg-gray-100 rounded-[24px] border border-gray-200"></div>
          ))}
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[24px] border border-dashed border-gray-300">
          <p className="interior-text font-sans mb-4">No teams found looking for that skill.</p>
          <button onClick={() => setSearchSkill('')} className="text-gray-900 font-bold hover:underline">Clear Search</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => {
            const isFull = team.members.length >= team.maxMembers;
            const isMember = user && team.members.some((m: any) => m._id === user._id);

            return (
              <div key={team._id} className="interior-panel flex flex-col group relative overflow-hidden p-6 transform hover:-translate-y-1 transition-all duration-300">
                
                {isFull && <div className="absolute top-0 right-0 bg-red-100 text-red-700 font-sans font-bold text-[10px] px-3 py-1 rounded-bl-[16px] shadow-sm">FULL</div>}
                {isMember && <div className="absolute top-0 right-0 bg-gray-900 text-white font-sans font-bold text-[10px] px-3 py-1 rounded-bl-[16px] shadow-sm">MEMBER</div>}

                <h3 className="font-bold text-xl text-gray-900 mb-2 mt-1">{team.name}</h3>
                <p className="text-sm text-gray-600 mb-6 flex-grow">{team.description}</p>
                
                <div className="mb-6">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2 font-sans">Looking For</span>
                  <div className="flex flex-wrap gap-2">
                    {team.requiredSkills?.map((skill: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-gray-50 border border-gray-100 text-gray-700 text-xs font-medium rounded-full">
                        {skill}
                      </span>
                    ))}
                    {(!team.requiredSkills || team.requiredSkills.length === 0) && (
                      <span className="text-gray-400 text-xs italic bg-gray-50 px-3 py-1 rounded-full border border-gray-100">Any skills</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {/* Display up to 3 member avatars/initials */}
                      {team.members.slice(0, 3).map((m: any, i: number) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center overflow-hidden z-10 shadow-sm" style={{ zIndex: 10 - i }}>
                          {m.avatar ? (
                            <img src={m.avatar} alt="Member" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-bold text-gray-500">{m.name ? m.name.charAt(0) : '?'}</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-500 ml-2 font-sans bg-gray-100 px-2 py-0.5 rounded-md">
                      {team.members.length} / {team.maxMembers}
                    </span>
                  </div>

                  {!isMember && !isFull && (
                    <button 
                      onClick={() => handleJoinTeam(team._id)}
                      className="interior-pill text-xs shadow-sm bg-gray-50 border border-gray-200"
                    >
                      Join Team
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateTeamModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateTeam} 
      />
    </div>
  );
}
