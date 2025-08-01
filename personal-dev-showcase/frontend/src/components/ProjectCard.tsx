import { Link } from 'react-router-dom';
import { Project } from '../types/project';
import { getTechStackById } from '../data/techStack';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Project Image */}
      {project.imageUrl ? (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.parentElement!.style.display = 'none';
            }}
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
          <svg
            className="h-12 w-12 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        </div>
      )}

      {/* Project Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            <Link
              to={`/projects/${project.id}`}
              className="hover:text-indigo-600 transition-colors"
            >
              {project.title}
            </Link>
          </h3>
          {!project.isPublic && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 ml-2 flex-shrink-0">
              Private
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Technology Stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {project.techStack.slice(0, 4).map((techId) => {
                const tech = getTechStackById(techId);
                if (!tech) return null;
                return (
                  <span
                    key={techId}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium text-white"
                    style={{ backgroundColor: tech.color }}
                  >
                    {tech.name}
                  </span>
                );
              })}
              {project.techStack.length > 4 && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                  +{project.techStack.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Project Links */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="View Source Code"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                </svg>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-indigo-600 transition-colors"
                title="View Live Demo"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>

          {/* Author & Date */}
          <div className="text-xs text-gray-500">
            <Link
              to={`/developers/${project.user.id}`}
              className="font-medium hover:text-indigo-600 transition-colors"
            >
              {project.user.displayName || project.user.username}
            </Link>
            <span className="mx-1">•</span>
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;