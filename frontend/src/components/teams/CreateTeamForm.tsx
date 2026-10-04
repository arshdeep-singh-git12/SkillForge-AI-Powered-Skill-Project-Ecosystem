'use client';

/**
 * CreateTeamForm Component
 *
 * Modal form to create a new team.
 * Submits to POST /api/teams via teamService.createTeam().
 * Uses the shared Modal component from components/ui/.
 *
 * @owner Team Member 7 — Teams & Dashboard
 */

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { teamService } from '@/services/team.service';
import type { CreateTeamData } from '@/services/team.service';

interface CreateTeamFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateTeamForm({ isOpen, onClose, onCreated }: CreateTeamFormProps) {
  const [formData, setFormData] = useState<CreateTeamData>({
    name: '',
    description: '',
    requiredSkills: [],
    maxMembers: 5,
    tags: [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      requiredSkills: [],
      maxMembers: 5,
      tags: [],
    });
    setSkillInput('');
    setTagInput('');
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !formData.requiredSkills?.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        requiredSkills: [...(prev.requiredSkills || []), skill],
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills?.filter((s) => s !== skill) || [],
    }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags?.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tag],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Team name is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Team description is required');
      return;
    }

    setSubmitting(true);
    try {
      await teamService.createTeam(formData);
      resetForm();
      onCreated();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create team';
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Team">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Team Name */}
        <div>
          <label
            htmlFor="create-team-name"
            className="font-mono text-[10px] uppercase tracking-wider text-[#7a889b] block mb-1.5"
          >
            Team Name *
          </label>
          <input
            id="create-team-name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Enter team name"
            className="input-field"
            maxLength={100}
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="create-team-desc"
            className="font-mono text-[10px] uppercase tracking-wider text-[#7a889b] block mb-1.5"
          >
            Description *
          </label>
          <textarea
            id="create-team-desc"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your team's goals and purpose"
            className="input-field min-h-[80px] resize-y"
            maxLength={1000}
          />
          <span className="font-mono text-[10px] text-[#7a889b] mt-1 block">
            {formData.description.length}/1000
          </span>
        </div>

        {/* Required Skills */}
        <div>
          <label
            htmlFor="create-team-skills"
            className="font-mono text-[10px] uppercase tracking-wider text-[#7a889b] block mb-1.5"
          >
            Required Skills
          </label>
          <div className="flex gap-2 mb-2">
            <input
              id="create-team-skills"
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Add a skill..."
              className="input-field flex-1"
            />
            <button
              type="button"
              onClick={addSkill}
              className="btn-secondary text-[10px] px-3"
            >
              Add
            </button>
          </div>
          {formData.requiredSkills && formData.requiredSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {formData.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="font-mono text-[10px] px-2 py-0.5 rounded-sm bg-[#0cbde8]/10 text-[#0cbde8] border border-[#0cbde8]/20 flex items-center gap-1"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-red-400 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Max Members */}
        <div>
          <label
            htmlFor="create-team-max"
            className="font-mono text-[10px] uppercase tracking-wider text-[#7a889b] block mb-1.5"
          >
            Max Members (2-20)
          </label>
          <input
            id="create-team-max"
            type="number"
            value={formData.maxMembers}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, maxMembers: parseInt(e.target.value, 10) || 5 }))
            }
            min={2}
            max={20}
            className="input-field w-24"
          />
        </div>

        {/* Tags */}
        <div>
          <label
            htmlFor="create-team-tags"
            className="font-mono text-[10px] uppercase tracking-wider text-[#7a889b] block mb-1.5"
          >
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              id="create-team-tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add a tag..."
              className="input-field flex-1"
            />
            <button
              type="button"
              onClick={addTag}
              className="btn-secondary text-[10px] px-3"
            >
              Add
            </button>
          </div>
          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] px-2 py-0.5 rounded-sm bg-[#232830] text-[#7a889b] border border-[#2d333b] flex items-center gap-1"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-400 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="p-2.5 rounded-sm bg-red-400/10 border border-red-400/20">
            <p className="font-mono text-[10px] text-red-400">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creating...' : 'Create Team'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
