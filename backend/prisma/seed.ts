import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const password = await hash('password123', 12);
  
  const user1 = await prisma.user.create({
    data: {
      name: 'Test User 1',
      handle: 'testuser1',
      email: 'test1@example.com',
      password,
      walletAddress: '0x1234567890123456789012345678901234567890',
      role: 'admin'
    }
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Test User 2',
      handle: 'testuser2',
      email: 'test2@example.com',
      password,
      walletAddress: '0x2345678901234567890123456789012345678901'
    }
  });

  // Create test DAOs
  const dao1 = await prisma.dao.create({
    data: {
      name: 'Test DAO 1',
      description: 'A test DAO for development',
      category: 'governance',
      creatorId: user1.id,
      tokenSymbol: 'TEST1',
      votingPeriod: 7,
      quorum: 50,
      members: {
        connect: [{ id: user1.id }, { id: user2.id }]
      }
    }
  });

  const dao2 = await prisma.dao.create({
    data: {
      name: 'Test DAO 2',
      description: 'Another test DAO',
      category: 'defi',
      creatorId: user2.id,
      tokenSymbol: 'TEST2',
      votingPeriod: 3,
      quorum: 30,
      members: {
        connect: [{ id: user1.id }]
      }
    }
  });

  // Create test proposals
  await prisma.proposal.create({
    data: {
      title: 'Test Proposal 1',
      description: 'A test proposal for development',
      type: 'GENERAL',
      daoId: dao1.id,
      creatorId: user1.id,
      startTime: new Date(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  // Create test posts
  await prisma.post.create({
    data: {
      content: 'Test post 1',
      authorId: user1.id,
      daoId: dao1.id
    }
  });

  await prisma.post.create({
    data: {
      content: 'Test post 2',
      authorId: user2.id,
      daoId: dao2.id
    }
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 