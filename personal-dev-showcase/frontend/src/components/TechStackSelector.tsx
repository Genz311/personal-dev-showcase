import { useState } from 'react';
import { techStackOptions } from '../data/techStack';

interface TechStackSelectorProps {
  selectedTechStack: string[];
  onChange: (techStack: string[]) => void;
  error?: string;
}

const TechStackSelector = ({ selectedTechStack, onChange, error }: TechStackSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // const techStackByCategory = getTechStackByCategory();

  const filteredTechStack = techStackOptions.filter(tech => {
    const matchesSearch = tech.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tech.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTechToggle = (techId: string) => {
    const isSelected = selectedTechStack.includes(techId);
    if (isSelected) {
      onChange(selectedTechStack.filter(id => id !== techId));
    } else {
      onChange([...selectedTechStack, techId]);
    }
  };


  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search technologies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="database">Database</option>
            <option value="tool">Tools</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Selected Technologies */}
      {selectedTechStack.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Selected Technologies:</p>
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

      {/* Available Technologies */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-64 overflow-y-auto border rounded-md p-3">
        {filteredTechStack.map(tech => {
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
              {tech.name}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default TechStackSelector;