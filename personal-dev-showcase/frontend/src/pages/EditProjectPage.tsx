import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { projectService } from '../services/projectService';
import { CreateProjectData } from '../types/project';
import ProjectForm from '../components/ProjectForm';

const EditProjectPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);

  const {
    data: project,
    isLoading: isProjectLoading,
    error: projectError,
  } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getProject(id!),
    enabled: !!id,
  });

  const updateProjectMutation = useMutation({
    mutationFn: (data: CreateProjectData) => 
      projectService.updateProject({ id: id!, ...data }),
    onSuccess: (project) => {
      navigate(`/projects/${project.id}`);
    },
    onError: (err) => {
      const error = err as { response?: { data?: { message?: string }; status?: number } };
      if (error.response?.status === 403) {
        setError('You do not have permission to edit this project.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred while updating the project. Please try again.');
      }
    },
  });

  const handleSubmit = async (data: CreateProjectData) => {
    setError(null);
    await updateProjectMutation.mutateAsync(data);
  };

  if (isProjectLoading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-6">
            The project you're looking for doesn't exist or you don't have permission to edit it.
          </p>
          <button
            onClick={() => navigate('/my-projects')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Go to My Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
        <p className="text-gray-600 mt-2">
          Update your project information
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg p-6">
        <ProjectForm
          project={project}
          onSubmit={handleSubmit}
          isLoading={updateProjectMutation.isPending}
          submitText="Update Project"
        />
      </div>
    </div>
  );
};

export default EditProjectPage;