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
    return <div className="text-gray-400 font-sans text-sm animate-pulse text-center py-8">Loading skills...</div>;
  }

  return (
    <div className="mt-8 interior-panel p-8 bg-white shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 font-sans">Technical Skills</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="interior-pill interior-pill-active shadow-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Add Skill
        </button>
      </div>

      {skills.length === 0 ? (
        <p className="text-gray-400 font-sans text-sm text-center py-8 border border-dashed border-gray-200 rounded-xl bg-gray-50">
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
