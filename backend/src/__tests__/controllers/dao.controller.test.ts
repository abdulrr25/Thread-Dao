import { prisma } from '../../lib/prisma';
import { createDAO, getDAO, updateDAO, deleteDAO } from '../../controllers/dao.controller';
import { hash } from 'bcryptjs';

describe('DAO Controller', () => {
  let testUser: any;
  let testDAO: any;

  beforeAll(async () => {
    // Create test user
    const password = await hash('password123', 12);
    testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        handle: 'testuser',
        email: 'test@example.com',
        password,
        walletAddress: '0x1234567890123456789012345678901234567890',
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.dao.deleteMany();
  });

  describe('createDAO', () => {
    it('should create a new DAO', async () => {
      const daoData = {
        name: 'Test DAO',
        description: 'A test DAO',
        category: 'governance',
        tokenSymbol: 'TEST',
        votingPeriod: 7,
        quorum: 50,
      };

      const req = {
        user: testUser,
        body: daoData,
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await createDAO(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          name: daoData.name,
          description: daoData.description,
        })
      );

      testDAO = await prisma.dao.findFirst({
        where: { name: daoData.name },
      });
    });
  });

  describe('getDAO', () => {
    it('should get a DAO by ID', async () => {
      const req = {
        params: { id: testDAO.id },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await getDAO(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: testDAO.id,
          name: testDAO.name,
        })
      );
    });
  });

  describe('updateDAO', () => {
    it('should update a DAO', async () => {
      const updateData = {
        name: 'Updated DAO',
        description: 'An updated test DAO',
      };

      const req = {
        user: testUser,
        params: { id: testDAO.id },
        body: updateData,
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await updateDAO(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: testDAO.id,
          name: updateData.name,
          description: updateData.description,
        })
      );
    });
  });

  describe('deleteDAO', () => {
    it('should delete a DAO', async () => {
      const req = {
        user: testUser,
        params: { id: testDAO.id },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await deleteDAO(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
}); 