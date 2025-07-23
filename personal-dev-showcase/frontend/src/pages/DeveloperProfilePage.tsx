import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { projectService } from '../services/projectService';
import UserProfile from '../components/UserProfile';
import ProjectCard from '../components/ProjectCard';

const DeveloperProfilePage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: user,
    isLoading: userLoading,
    error: userError
  } = useQuery({
    queryKey: ['user-profile', id],
    queryFn: () => userService.getUserProfile(id!),
    enabled: !!id
  });

  const {
    data: projectsData,
    isLoading: projectsLoading,
    error: projectsError
  } = useQuery({
    queryKey: ['user-projects', id],
    queryFn: () => projectService.getProjects({ userId: id }),
    enabled: !!id
  });

  if (userLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-red-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Developer Not Found</h1>
          <p className="text-gray-600 mb-6">
            The developer you're looking for doesn't exist or isn't available.
          </p>
          <Link
            to="/developers"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Back to Developers
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Developer Not Found</h1>
          <p className="text-gray-600">Unable to load developer profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Link to="/developers" className="hover:text-gray-700">
            Developers
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900">{user.name || user.username}</span>
        </div>
      </nav>

      {/* User Profile */}
      <div className="mb-8">
        <UserProfile user={user} isOwnProfile={false} />
      </div>

      {/* Projects Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Public Projects
            {projectsData && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({projectsData.projects.length})
              </span>
            )}
          </h2>
        </div>

        {/* Projects Loading */}
        {projectsLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 aspect-video rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects Error */}
        {projectsError && (
          <div className="text-center py-8">
            <p className="text-gray-500">Unable to load projects at this time.</p>
          </div>
        )}

        {/* Projects Grid */}
        {!projectsLoading && projectsData && projectsData.projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* No Projects */}
        {!projectsLoading && projectsData && projectsData.projects.length === 0 && (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Public Projects</h3>
            <p className="text-gray-600">
              {user.name || user.username} hasn't shared any public projects yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperProfilePage;