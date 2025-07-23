import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectService } from '../services/projectService';
import ProjectList from '../components/ProjectList';
import ProjectSearch from '../components/ProjectSearch';

const ProjectsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const {
    data: projectsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['projects', { page: currentPage, limit: itemsPerPage }],
    queryFn: () => projectService.getProjects({ page: currentPage, limit: itemsPerPage }),
  });

  // Filter projects based on search and tech stack
  const filteredProjects = useMemo(() => {
    if (!projectsData?.projects) return [];

    return projectsData.projects.filter(project => {
      const matchesSearch = searchQuery === '' || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTechStack = selectedTechStack.length === 0 ||
        selectedTechStack.some(tech => project.techStack.includes(tech));

      return matchesSearch && matchesTechStack;
    });
  }, [projectsData?.projects, searchQuery, selectedTechStack]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleTechStackFilter = (techStack: string[]) => {
    setSelectedTechStack(techStack);
    setCurrentPage(1);
  };

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
            We encountered an error while loading projects. Please try again later.
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Projects</h1>
        <p className="text-gray-600">
          Explore innovative projects built by developers around the world
        </p>
      </div>

      {/* Search and Filters */}
      <ProjectSearch
        onSearch={handleSearch}
        onTechStackFilter={handleTechStackFilter}
        searchQuery={searchQuery}
        selectedTechStack={selectedTechStack}
      />

      {/* Results Summary */}
      {!isLoading && projectsData && (
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            {filteredProjects.length === projectsData.projects.length ? (
              <>Showing {filteredProjects.length} of {projectsData.total} projects</>
            ) : (
              <>Showing {filteredProjects.length} filtered results from {projectsData.total} total projects</>
            )}
          </p>
        </div>
      )}

      {/* Project List */}
      <ProjectList
        projects={filteredProjects}
        isLoading={isLoading}
        emptyMessage={
          searchQuery || selectedTechStack.length > 0 
            ? "No projects match your search" 
            : "No projects available"
        }
        emptyDescription={
          searchQuery || selectedTechStack.length > 0
            ? "Try adjusting your search criteria or explore different technology stacks."
            : "Be the first to share your project with the community!"
        }
      />

      {/* Pagination */}
      {projectsData && projectsData.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>

            {Array.from({ length: Math.min(5, projectsData.totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`
                    relative inline-flex items-center px-4 py-2 border text-sm font-medium
                    ${pageNum === currentPage
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }
                  `}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(Math.min(projectsData.totalPages, currentPage + 1))}
              disabled={currentPage === projectsData.totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;