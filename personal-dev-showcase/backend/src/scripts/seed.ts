import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Create technologies
    const technologies = [
      // Frontend
      { name: 'React', category: 'frontend', color: '#61DAFB' },
      { name: 'Vue.js', category: 'frontend', color: '#4FC08D' },
      { name: 'Angular', category: 'frontend', color: '#DD0031' },
      { name: 'Svelte', category: 'frontend', color: '#FF3E00' },
      { name: 'TypeScript', category: 'frontend', color: '#3178C6' },
      { name: 'JavaScript', category: 'frontend', color: '#F7DF1E' },
      { name: 'HTML5', category: 'frontend', color: '#E34F26' },
      { name: 'CSS3', category: 'frontend', color: '#1572B6' },
      { name: 'Sass', category: 'frontend', color: '#CC6699' },
      { name: 'TailwindCSS', category: 'frontend', color: '#06B6D4' },

      // Backend
      { name: 'Node.js', category: 'backend', color: '#339933' },
      { name: 'Express.js', category: 'backend', color: '#000000' },
      { name: 'FastAPI', category: 'backend', color: '#009688' },
      { name: 'Django', category: 'backend', color: '#092E20' },
      { name: 'Flask', category: 'backend', color: '#000000' },
      { name: 'Spring Boot', category: 'backend', color: '#6DB33F' },
      { name: 'NestJS', category: 'backend', color: '#E0234E' },
      { name: 'Go', category: 'backend', color: '#00ADD8' },
      { name: 'Rust', category: 'backend', color: '#CE422B' },
      { name: 'Python', category: 'backend', color: '#3776AB' },

      // Database
      { name: 'PostgreSQL', category: 'database', color: '#336791' },
      { name: 'MySQL', category: 'database', color: '#4479A1' },
      { name: 'MongoDB', category: 'database', color: '#47A248' },
      { name: 'Redis', category: 'database', color: '#DC382D' },
      { name: 'SQLite', category: 'database', color: '#003B57' },
      { name: 'Prisma', category: 'database', color: '#2D3748' },

      // Tools
      { name: 'Docker', category: 'tool', color: '#2496ED' },
      { name: 'Kubernetes', category: 'tool', color: '#326CE5' },
      { name: 'Git', category: 'tool', color: '#F05032' },
      { name: 'GitHub Actions', category: 'tool', color: '#2088FF' },
      { name: 'Webpack', category: 'tool', color: '#8DD6F9' },
      { name: 'Vite', category: 'tool', color: '#646CFF' },
      { name: 'ESLint', category: 'tool', color: '#4B32C3' },
      { name: 'Prettier', category: 'tool', color: '#F7B93E' },

      // Cloud/Other
      { name: 'AWS', category: 'other', color: '#232F3E' },
      { name: 'Vercel', category: 'other', color: '#000000' },
      { name: 'Netlify', category: 'other', color: '#00C7B7' },
      { name: 'Railway', category: 'other', color: '#0B0D0E' },
      { name: 'Cloudinary', category: 'other', color: '#3448C5' },
    ];

    console.log('Creating technologies...');
    for (const tech of technologies) {
      await prisma.technology.upsert({
        where: { name: tech.name },
        update: {},
        create: tech,
      });
    }
    console.log(`✅ Created ${technologies.length} technologies`);

    // Create sample user
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const sampleUser = await prisma.user.upsert({
      where: { email: 'demo@example.com' },
      update: {},
      create: {
        email: 'demo@example.com',
        username: 'demo_user',
        password: hashedPassword,
        name: 'Demo User',
        bio: 'A sample user for demonstration purposes',
        github: 'https://github.com/demo-user',
        isPublic: true,
      },
    });
    console.log('✅ Created sample user');

    // Get some technologies for the sample projects
    const react = await prisma.technology.findUnique({ where: { name: 'React' } });
    const typescript = await prisma.technology.findUnique({ where: { name: 'TypeScript' } });
    const nodejs = await prisma.technology.findUnique({ where: { name: 'Node.js' } });
    const postgresql = await prisma.technology.findUnique({ where: { name: 'PostgreSQL' } });
    const tailwind = await prisma.technology.findUnique({ where: { name: 'TailwindCSS' } });

    // Create sample projects
    const project1 = await prisma.project.upsert({
      where: { id: 'sample-project-1' },
      update: {},
      create: {
        id: 'sample-project-1',
        title: 'Personal Portfolio Website',
        description: 'A responsive portfolio website built with React and TailwindCSS',
        longDescription: 'This is a comprehensive portfolio website showcasing my projects and skills. Built with modern web technologies including React, TypeScript, and TailwindCSS for a fast and responsive user experience.',
        githubUrl: 'https://github.com/demo-user/portfolio',
        liveUrl: 'https://demo-portfolio.vercel.app',
        isPublic: true,
        featured: true,
        userId: sampleUser.id,
      },
    });

    const project2 = await prisma.project.upsert({
      where: { id: 'sample-project-2' },
      update: {},
      create: {
        id: 'sample-project-2',
        title: 'Task Management API',
        description: 'RESTful API for task management with user authentication',
        longDescription: 'A robust backend API built with Node.js and Express, featuring JWT authentication, PostgreSQL database with Prisma ORM, and comprehensive API documentation.',
        githubUrl: 'https://github.com/demo-user/task-api',
        isPublic: true,
        featured: false,
        userId: sampleUser.id,
      },
    });

    // Associate technologies with projects
    if (react && typescript && tailwind) {
      await prisma.projectTechnology.createMany({
        data: [
          { projectId: project1.id, technologyId: react.id },
          { projectId: project1.id, technologyId: typescript.id },
          { projectId: project1.id, technologyId: tailwind.id },
        ],
        skipDuplicates: true,
      });
    }

    if (nodejs && typescript && postgresql) {
      await prisma.projectTechnology.createMany({
        data: [
          { projectId: project2.id, technologyId: nodejs.id },
          { projectId: project2.id, technologyId: typescript.id },
          { projectId: project2.id, technologyId: postgresql.id },
        ],
        skipDuplicates: true,
      });
    }

    console.log('✅ Created sample projects with technology associations');

    console.log('🎉 Database seed completed successfully!');
    console.log('\nSample data created:');
    console.log(`- ${technologies.length} technologies`);
    console.log('- 1 sample user (demo@example.com / password123)');
    console.log('- 2 sample projects');

  } catch (error) {
    console.error('❌ Error during database seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });