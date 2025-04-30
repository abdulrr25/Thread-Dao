import { Router } from 'express';
import { DaoController } from '../controllers/dao.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createDaoSchema, updateDaoSchema, createProposalSchema, voteSchema } from '../schemas/validation';

const router = Router();
const daoController = new DaoController();

// Public routes
router.get('/', daoController.getDaos);
router.get('/:id', daoController.getDaoById);

// Protected routes
router.post('/', authenticate, validate(createDaoSchema), daoController.createDao);
router.put('/:id', authenticate, validate(updateDaoSchema), daoController.updateDao);
router.post('/:id/proposals', authenticate, validate(createProposalSchema), daoController.createProposal);
router.post('/:id/proposals/:proposalId/votes', authenticate, validate(voteSchema), daoController.voteOnProposal);

export default router; 