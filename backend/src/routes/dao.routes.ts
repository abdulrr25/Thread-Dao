import { Router } from 'express';
import { daoController } from '../controllers/dao.controller';
import { auth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', daoController.getAllDAOs);
router.get('/trending', daoController.getTrendingDAOs);
router.get('/:id', daoController.getDAO);
router.get('/:id/members', daoController.getDAOMembers);
router.get('/:id/proposals', daoController.getDAOProposals);

// Protected routes
router.use(auth);
router.post('/', daoController.createDAO);
router.put('/:id', daoController.updateDAO);
router.delete('/:id', daoController.deleteDAO);
router.post('/:id/join', daoController.joinDAO);
router.post('/:id/leave', daoController.leaveDAO);
router.post('/:id/proposal', daoController.createProposal);
router.put('/:id/proposal/:proposalId', daoController.updateProposal);
router.delete('/:id/proposal/:proposalId', daoController.deleteProposal);
router.post('/:id/proposal/:proposalId/vote', daoController.voteOnProposal);

export default router; 