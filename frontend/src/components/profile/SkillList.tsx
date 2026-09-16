import React, { useEffect, useState } from 'react';
import { getUserSkills, addSkill } from '../../services/profile.service';
import ProgressBar from '../ui/ProgressBar';
import AddSkillModal from './AddSkillModal';

interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
}

interface SkillListProps {
  userId: string;
}

export default function SkillList({ userId }: SkillListProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getUserSkills(userId);
        setSkills(data);
      } catch (error) {
        console.error('Failed to fetch skills', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, [userId]);

  const handleAddSkill = async (skillData: { name: string; proficiency: number; category: string }) => {
    try {
      const newSkill = await addSkill(skillData);
      setSkills(prev => [newSkill, ...prev].sort((a, b) => b.proficiency - a.proficiency));
    } catch (error) {
      console.error('Failed to add skill', error);
      alert('Failed to add skill');
    }
  };

  if (loading) {
    return <div className="text-machined-400 font-mono text-sm animate-pulse">Loading skills...</div>;
  }

  return (
    <div className="mt-12 bg-machined-800/80 backdrop-blur-xl border border-machined-600 rounded-2xl shadow-2xl p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-machined-100">Technical Skills</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-machined-700 hover:bg-machined-600 text-cyan border border-machined-500 font-mono text-sm py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Add Skill
        </button>
      </div>

      {skills.length === 0 ? (
        <p className="text-machined-400 font-mono text-sm text-center py-8 border border-dashed border-machined-600 rounded-lg">
          No skills added yet. Showcase your expertise!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {skills.map(skill => (
            <ProgressBar 
              key={skill._id}
              label={skill.name}
              percentage={skill.proficiency}
            />
          ))}
        </div>
      )}

      <AddSkillModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddSkill}
      />
    </div>
  );
}
