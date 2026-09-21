/**
 * Team Service
 *
 * Handles team formation and matching API calls.
 * Maps to backend endpoints defined in backend/src/routes/team.routes.js.
 *
 * @owner Team Member 7 — Teams & Dashboard
 */

import api from './api';
import type { Team, TeamMatchResult, PaginatedResponse, ApiResponse } from '@/types';

// ──────────────────────────────────────────────
// DEV ONLY — Scoped auth workaround
// Sends x-dev-user-id header for mutating requests
// when the auth system is not yet implemented.
// Remove this block once real authentication is integrated.
// ──────────────────────────────────────────────
const DEV_USER_ID = '000000000000000000000001';

function getDevHeaders(): Record<string, string> {
  if (process.env.NODE_ENV === 'development') {
    return { 'x-dev-user-id': DEV_USER_ID };
  }
  return {};
}
// ──────────────────────────────────────────────

export interface TeamFilters {
  status?: string;
  skill?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateTeamData {
  name: string;
  description: string;
  requiredSkills?: string[];
  maxMembers?: number;
  tags?: string[];
  avatar?: string;
}

export interface UpdateTeamData {
  name?: string;
  description?: string;
  requiredSkills?: string[];
  maxMembers?: number;
  status?: string;
  tags?: string[];
  avatar?: string;
}

export const teamService = {
  /**
   * List all teams with optional filtering and pagination.
   * GET /api/teams
   */
  getAllTeams: async (filters?: TeamFilters): Promise<PaginatedResponse<Team>> => {
    const params: Record<string, string | number> = {};
    if (filters?.status) params.status = filters.status;
    if (filters?.skill) params.skill = filters.skill;
    if (filters?.search) params.search = filters.search;
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;

    const response = await api.get('/teams', { params });
    return response.data;
  },

  /**
   * Get single team details by ID.
   * GET /api/teams/:id
   */
  getTeamById: async (teamId: string): Promise<ApiResponse<Team>> => {
    const response = await api.get(`/teams/${teamId}`);
    return response.data;
  },

  /**
   * Create a new team.
   * POST /api/teams
   */
  createTeam: async (data: CreateTeamData): Promise<ApiResponse<Team>> => {
    const response = await api.post('/teams', data, {
      headers: getDevHeaders(),
    });
    return response.data;
  },

  /**
   * Update team details (owner only).
   * PUT /api/teams/:id
   */
  updateTeam: async (teamId: string, data: UpdateTeamData): Promise<ApiResponse<Team>> => {
    const response = await api.put(`/teams/${teamId}`, data, {
      headers: getDevHeaders(),
    });
    return response.data;
  },

  /**
   * Delete a team (owner only).
   * DELETE /api/teams/:id
   */
  deleteTeam: async (teamId: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/teams/${teamId}`, {
      headers: getDevHeaders(),
    });
    return response.data;
  },

  /**
   * Find matching teams by skills.
   * POST /api/teams/match
   */
  findMatches: async (skills: string[]): Promise<{ data: TeamMatchResult[] }> => {
    const response = await api.post('/teams/match', { skills }, {
      headers: getDevHeaders(),
    });
    return response.data;
  },

  /**
   * Join a team.
   * POST /api/teams/:id/join
   */
  joinTeam: async (teamId: string): Promise<ApiResponse<Team>> => {
    const response = await api.post(`/teams/${teamId}/join`, {}, {
      headers: getDevHeaders(),
    });
    return response.data;
  },

  /**
   * Leave a team.
   * POST /api/teams/:id/leave
   */
  leaveTeam: async (teamId: string): Promise<ApiResponse<Team>> => {
    const response = await api.post(`/teams/${teamId}/leave`, {}, {
      headers: getDevHeaders(),
    });
    return response.data;
  },
};

export default teamService;
