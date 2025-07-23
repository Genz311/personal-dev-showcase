import { useState } from 'react';
import { techStackOptions } from '../data/techStack';

interface ProjectSearchProps {
  onSearch: (query: string) => void;
  onTechStackFilter: (techStack: string[]) => void;
  searchQuery: string;
  selectedTechStack: string[];
}

const ProjectSearch = ({ 
  onSearch, 
  onTechStackFilter, 
  searchQuery, 
  selectedTechStack 
}: ProjectSearchProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleTechToggle = (techId: string) => {
    const isSelected = selectedTechStack.includes(techId);
    if (isSelected) {
      onTechStackFilter(selectedTechStack.filter(id => id !== techId));
    } else {
      onTechStackFilter([...selectedTechStack, techId]);
    }
  };

  const clearFilters = () => {
    onSearch('');
    onTechStackFilter([]);
  };

  const hasActiveFilters = searchQuery.length > 0 || selectedTechStack.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      {/* Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search projects by title or description..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`
              inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium
              ${selectedTechStack.length > 0 
                ? 'text-indigo-700 bg-indigo-50 border-indigo-300' 
                : 'text-gray-700 bg-white hover:bg-gray-50'
              }
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            `}
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            Tech Stack
            {selectedTechStack.length > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {selectedTechStack.length}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {selectedTechStack.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {selectedTechStack.map(techId => {
              const tech = techStackOptions.find(t => t.id === techId);
              if (!tech) return null;
              return (
                <span
                  key={techId}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: tech.color }}
                >
                  {tech.name}
                  <button
                    type="button"
                    onClick={() => handleTechToggle(techId)}
                    className="ml-2 hover:bg-black hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Technology Filter Dropdown */}
      {isFilterOpen && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Filter by Technology</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
            {techStackOptions.map(tech => {
              const isSelected = selectedTechStack.includes(tech.id);
              return (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => handleTechToggle(tech.id)}
                  className={`
                    flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isSelected 
                      ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-300'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }
                  `}
                >
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: tech.color }}
                  />
                  <span className="truncate">{tech.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSearch;