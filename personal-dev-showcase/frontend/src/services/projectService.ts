import { api } from './api';
import { 
  Project, 
  CreateProjectData, 
  UpdateProjectData, 
  ProjectListResponse, 
  ProjectSearchParams 
} from '../types/project';

export const projectService = {
  async createProject(data: CreateProjectData): Promise<Project> {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },

  async updateProject(data: UpdateProjectData): Promise<Project> {
    const { id, ...updateData } = data;
    const response = await api.put<Project>(`/projects/${id}`, updateData);
    return response.data;
  },

  async deleteProject(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },

  async getProject(id: string): Promise<Project> {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  async getProjects(params?: ProjectSearchParams): Promise<ProjectListResponse> {
    const response = await api.get<ProjectListResponse>('/projects', { params });
    return response.data;
  },

  async getMyProjects(params?: ProjectSearchParams): Promise<ProjectListResponse> {
    const response = await api.get<ProjectListResponse>('/projects/my', { params });
    return response.data;
  },

  async toggleProjectVisibility(id: string, isPublic: boolean): Promise<Project> {
    const response = await api.put<Project>(`/projects/${id}/visibility`, { isPublic });
    return response.data;
  },
};