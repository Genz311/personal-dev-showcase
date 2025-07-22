import { prisma } from '../lib/prisma';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test query execution (this will fail until migrations are run)
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ Database queries working - Users count: ${userCount}`);
    } catch (error) {
      console.log('⚠️  Database connected but tables not yet migrated');
      console.log('   Run "npx prisma migrate dev" to create tables');
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.log('\n💡 To start PostgreSQL with Docker:');
    console.log('   docker-compose up -d');
    console.log('\n💡 Or install PostgreSQL locally:');
    console.log('   brew install postgresql');
    console.log('   brew services start postgresql');
    console.log('   createdb devshowcase');
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();