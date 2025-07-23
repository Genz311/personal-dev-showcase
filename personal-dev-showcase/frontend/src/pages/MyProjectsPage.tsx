import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectService } from '../services/projectService';
import ProjectList from '../components/ProjectList';
import ProjectSearch from '../components/ProjectSearch';

const MyProjectsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');

  const {
    data: projectsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['my-projects'],
    queryFn: () => projectService.getMyProjects(),
  });

  // Filter projects based on search, tech stack, and visibility
  const filteredProjects = useMemo(() => {
    if (!projectsData?.projects) return [];

    return projectsData.projects.filter(project => {
      const matchesSearch = searchQuery === '' || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTechStack = selectedTechStack.length === 0 ||
        selectedTechStack.some(tech => project.techStack.includes(tech));

      const matchesVisibility = filter === 'all' ||
        (filter === 'public' && project.isPublic) ||
        (filter === 'private' && !project.isPublic);

      return matchesSearch && matchesTechStack && matchesVisibility;
    });
  }, [projectsData?.projects, searchQuery, selectedTechStack, filter]);

  const stats = useMemo(() => {
    if (!projectsData?.projects) return { total: 0, public: 0, private: 0 };

    const total = projectsData.projects.length;
    const publicProjects = projectsData.projects.filter(p => p.isPublic).length;
    const privateProjects = total - publicProjects;

    return { total, public: publicProjects, private: privateProjects };
  }, [projectsData?.projects]);

  if (error) {
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Projects</h1>
          <p className="text-gray-600 mb-6">
            We encountered an error while loading your projects. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Projects</h1>
          <p className="text-gray-600">
            Manage and showcase your development projects
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <Link
            to="/projects/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Projects</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Public Projects</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.public}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Private Projects</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.private}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visibility Filter */}
      {!isLoading && stats.total > 0 && (
        <div className="mb-6">
          <div className="sm:hidden">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Projects</option>
              <option value="public">Public Only</option>
              <option value="private">Private Only</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="flex space-x-8">
              {[
                { key: 'all', label: 'All Projects', count: stats.total },
                { key: 'public', label: 'Public', count: stats.public },
                { key: 'private', label: 'Private', count: stats.private },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as typeof filter)}
                  className={`
                    whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm
                    ${filter === tab.key
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.label}
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-900">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      {!isLoading && stats.total > 0 && (
        <ProjectSearch
          onSearch={setSearchQuery}
          onTechStackFilter={setSelectedTechStack}
          searchQuery={searchQuery}
          selectedTechStack={selectedTechStack}
        />
      )}

      {/* Results Summary */}
      {!isLoading && projectsData && filteredProjects.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing {filteredProjects.length} of {stats.total} projects
          </p>
        </div>
      )}

      {/* Project List */}
      <ProjectList
        projects={filteredProjects}
        isLoading={isLoading}
        emptyMessage={
          stats.total === 0 
            ? "No projects yet" 
            : "No projects match your criteria"
        }
        emptyDescription={
          stats.total === 0
            ? "Start by creating your first project to showcase your work to the community."
            : "Try adjusting your search criteria or filters to find your projects."
        }
      />
    </div>
  );
};

export default MyProjectsPage;