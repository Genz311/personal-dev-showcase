export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  techStack: string[];
  isPublic: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    username: string;
    displayName?: string;
  };
}

export interface CreateProjectData {
  title: string;
  description: string;
  longDescription?: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  techStack: string[];
  isPublic: boolean;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  id: string;
}

export interface ProjectListResponse {
  projects: Project[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ProjectSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  techStack?: string[];
  userId?: string;
}