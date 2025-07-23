import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { projectService } from '../services/projectService';
import { CreateProjectData } from '../types/project';
import ProjectForm from '../components/ProjectForm';

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const createProjectMutation = useMutation({
    mutationFn: projectService.createProject,
    onSuccess: (project) => {
      navigate(`/projects/${project.id}`);
    },
    onError: (err) => {
      const error = err as { response?: { data?: { message?: string }; status?: number } };
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred while creating the project. Please try again.');
      }
    },
  });

  const handleSubmit = async (data: CreateProjectData) => {
    setError(null);
    await createProjectMutation.mutateAsync(data);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
        <p className="text-gray-600 mt-2">
          Share your project with the developer community
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg p-6">
        <ProjectForm
          onSubmit={handleSubmit}
          isLoading={createProjectMutation.isPending}
          submitText="Create Project"
        />
      </div>
    </div>
  );
};

export default CreateProjectPage;