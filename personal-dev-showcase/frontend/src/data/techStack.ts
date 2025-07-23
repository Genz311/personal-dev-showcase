export interface TechStackItem {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'tool' | 'other';
  color: string;
}

export const techStackOptions: TechStackItem[] = [
  // Frontend
  { id: 'react', name: 'React', category: 'frontend', color: '#61DAFB' },
  { id: 'vue', name: 'Vue.js', category: 'frontend', color: '#4FC08D' },
  { id: 'angular', name: 'Angular', category: 'frontend', color: '#DD0031' },
  { id: 'svelte', name: 'Svelte', category: 'frontend', color: '#FF3E00' },
  { id: 'next', name: 'Next.js', category: 'frontend', color: '#000000' },
  { id: 'nuxt', name: 'Nuxt.js', category: 'frontend', color: '#00DC82' },
  { id: 'typescript', name: 'TypeScript', category: 'frontend', color: '#3178C6' },
  { id: 'javascript', name: 'JavaScript', category: 'frontend', color: '#F7DF1E' },
  { id: 'html', name: 'HTML', category: 'frontend', color: '#E34F26' },
  { id: 'css', name: 'CSS', category: 'frontend', color: '#1572B6' },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend', color: '#06B6D4' },
  { id: 'sass', name: 'Sass', category: 'frontend', color: '#CC6699' },

  // Backend
  { id: 'nodejs', name: 'Node.js', category: 'backend', color: '#339933' },
  { id: 'express', name: 'Express.js', category: 'backend', color: '#000000' },
  { id: 'fastify', name: 'Fastify', category: 'backend', color: '#000000' },
  { id: 'python', name: 'Python', category: 'backend', color: '#3776AB' },
  { id: 'django', name: 'Django', category: 'backend', color: '#092E20' },
  { id: 'flask', name: 'Flask', category: 'backend', color: '#000000' },
  { id: 'java', name: 'Java', category: 'backend', color: '#007396' },
  { id: 'spring', name: 'Spring Boot', category: 'backend', color: '#6DB33F' },
  { id: 'csharp', name: 'C#', category: 'backend', color: '#239120' },
  { id: 'dotnet', name: '.NET', category: 'backend', color: '#512BD4' },
  { id: 'php', name: 'PHP', category: 'backend', color: '#777BB4' },
  { id: 'laravel', name: 'Laravel', category: 'backend', color: '#FF2D20' },
  { id: 'ruby', name: 'Ruby', category: 'backend', color: '#CC342D' },
  { id: 'rails', name: 'Ruby on Rails', category: 'backend', color: '#CC0000' },
  { id: 'go', name: 'Go', category: 'backend', color: '#00ADD8' },
  { id: 'rust', name: 'Rust', category: 'backend', color: '#000000' },

  // Database
  { id: 'mysql', name: 'MySQL', category: 'database', color: '#4479A1' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', color: '#336791' },
  { id: 'mongodb', name: 'MongoDB', category: 'database', color: '#47A248' },
  { id: 'redis', name: 'Redis', category: 'database', color: '#DC382D' },
  { id: 'sqlite', name: 'SQLite', category: 'database', color: '#003B57' },
  { id: 'firebase', name: 'Firebase', category: 'database', color: '#FFCA28' },
  { id: 'supabase', name: 'Supabase', category: 'database', color: '#3ECF8E' },
  { id: 'prisma', name: 'Prisma', category: 'database', color: '#2D3748' },

  // Tools
  { id: 'git', name: 'Git', category: 'tool', color: '#F05032' },
  { id: 'github', name: 'GitHub', category: 'tool', color: '#181717' },
  { id: 'gitlab', name: 'GitLab', category: 'tool', color: '#FC6D26' },
  { id: 'docker', name: 'Docker', category: 'tool', color: '#2496ED' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'tool', color: '#326CE5' },
  { id: 'aws', name: 'AWS', category: 'tool', color: '#232F3E' },
  { id: 'gcp', name: 'Google Cloud', category: 'tool', color: '#4285F4' },
  { id: 'azure', name: 'Azure', category: 'tool', color: '#0078D4' },
  { id: 'vercel', name: 'Vercel', category: 'tool', color: '#000000' },
  { id: 'netlify', name: 'Netlify', category: 'tool', color: '#00C7B7' },
  { id: 'heroku', name: 'Heroku', category: 'tool', color: '#430098' },
  { id: 'webpack', name: 'Webpack', category: 'tool', color: '#8DD6F9' },
  { id: 'vite', name: 'Vite', category: 'tool', color: '#646CFF' },
  { id: 'jest', name: 'Jest', category: 'tool', color: '#C21325' },
  { id: 'cypress', name: 'Cypress', category: 'tool', color: '#17202C' },
];

export const getTechStackByCategory = () => {
  return techStackOptions.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, TechStackItem[]>);
};

export const getTechStackById = (id: string): TechStackItem | undefined => {
  return techStackOptions.find(tech => tech.id === id);
};