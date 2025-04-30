import { execSync } from 'child_process';
import { join } from 'path';

const prismaBinary = join(__dirname, '..', 'node_modules', '.bin', 'prisma');

async function main() {
  try {
    // Run migrations
    console.log('Running database migrations...');
    execSync(`${prismaBinary} migrate deploy`, { stdio: 'inherit' });

    // Generate Prisma client
    console.log('Generating Prisma client...');
    execSync(`${prismaBinary} generate`, { stdio: 'inherit' });

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main(); 