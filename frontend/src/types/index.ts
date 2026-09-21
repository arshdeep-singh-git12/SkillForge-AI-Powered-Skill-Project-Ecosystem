/**
 * SkillForge TypeScript Types
 *
 * Shared type definitions used across the frontend.
 * Add interfaces and types here as features are built.
 */

// ============ User Types ============

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  githubUsername?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// ============ Skill Types ============

export interface Skill {
  id: string;
  userId: string;
  name: string;
  category: string; // e.g., "Language", "Framework", "Tool"
  proficiency: number; // 0-100
}

// ============ Project Types ============

export interface Project {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  thumbnail?: string;
  status: 'in-progress' | 'completed' | 'archived';
  createdAt: string;
}

// ============ Assessment Types ============

export interface Assessment {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  points: number;
}

export interface Submission {
  id: string;
  assessmentId: string;
  userId: string;
  code: string;
  result: 'pass' | 'fail' | 'error';
  submittedAt: string;
}

// ============ Certification Types ============

export interface Certification {
  id: string;
  userId: string;
  title: string;
  issuer: string;
  dateEarned: string;
  expiryDate?: string;
  credentialUrl?: string;
  type: 'assessment' | 'course' | 'external';
}

// ============ Review Types ============

export interface Review {
  id: string;
  reviewerId: string;
  projectId: string;
  rating: number; // 1-5
  title: string;
  content: string;
  createdAt: string;
}

// ============ Team Types ============

export interface Team {
  id: string;
  _id?: string;
  name: string;
  description: string;
  owner: PopulatedUser;
  members: TeamMember[];
  requiredSkills: string[];
  maxMembers: number;
  status: 'recruiting' | 'active' | 'completed' | 'archived';
  project?: PopulatedProject | null;
  tags: string[];
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  user: PopulatedUser;
  role: 'owner' | 'admin' | 'lead' | 'member';
  joinedAt: string;
}

// Populated sub-document shapes (from backend .populate() calls)
export interface PopulatedUser {
  id: string;
  _id?: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface PopulatedProject {
  id: string;
  _id?: string;
  title: string;
  description: string;
}

// Match result from POST /api/teams/match
export interface TeamMatchResult {
  team: Team;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

// ============ API Types ============

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

export interface ApiError {
  status: 'error';
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
