import { Project } from '../types/project';
import ProjectCard from './ProjectCard';

interface ProjectListProps {
  projects: Project[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
}

const ProjectList = ({ 
  projects, 
  isLoading = false, 
  emptyMessage = "No projects found",
  emptyDescription = "Try adjusting your search criteria or explore different technology stacks."
}: ProjectListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
          >
            <div className="aspect-video w-full bg-gray-200" />
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-3" />
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
              <div className="flex space-x-2 mb-4">
                <div className="h-6 w-16 bg-gray-200 rounded" />
                <div className="h-6 w-20 bg-gray-200 rounded" />
                <div className="h-6 w-14 bg-gray-200 rounded" />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <div className="h-5 w-5 bg-gray-200 rounded" />
                  <div className="h-5 w-5 bg-gray-200 rounded" />
                </div>
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
        <p className="text-gray-500 max-w-md mx-auto">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectList;