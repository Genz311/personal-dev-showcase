import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Project } from '../types/project';
import { projectService } from '../services/projectService';
import { useAuthStore } from '../store/authStore';
import { getTechStackById } from '../data/techStack';
import Button from './Button';

interface ProjectDetailProps {
  project: Project;
}

const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwner = user?.id === project.userId;

  const deleteProjectMutation = useMutation({
    mutationFn: () => projectService.deleteProject(project.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['my-projects'] });
      navigate('/my-projects');
    },
  });

  const handleDelete = async () => {
    if (showDeleteConfirm) {
      await deleteProjectMutation.mutateAsync();
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Project Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Project Image */}
          {project.imageUrl && (
            <div className="lg:w-1/3">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-64 lg:h-48 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Project Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {project.title}
                </h1>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>by </span>
                  <Link
                    to={`/developers/${project.user.id}`}
                    className="ml-1 font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {project.user.displayName || project.user.username}
                  </Link>
                  <span className="mx-2">•</span>
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  {!project.isPublic && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Private
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {isOwner && (
                <div className="flex gap-2">
                  <Link
                    to={`/projects/${project.id}/edit`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDelete}
                    isLoading={deleteProjectMutation.isPending}
                  >
                    {showDeleteConfirm ? 'Confirm Delete' : 'Delete'}
                  </Button>
                  {showDeleteConfirm && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-4">{project.description}</p>

            {/* Links */}
            <div className="flex flex-wrap gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                  </svg>
                  View Code
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      {project.techStack && project.techStack.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Technology Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((techId) => {
              const tech = getTechStackById(techId);
              if (!tech) return null;
              return (
                <span
                  key={techId}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: tech.color }}
                >
                  <div
                    className="w-3 h-3 rounded-full mr-2 bg-white bg-opacity-30"
                  />
                  {tech.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Detailed Description */}
      {project.longDescription && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Project</h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {project.longDescription}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;