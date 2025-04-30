import { Router } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth';
import { proposalController } from '../controllers/proposal.controller';
import { tokenController } from '../controllers/token.controller';
import { memberController } from '../controllers/member.controller';

const router = Router();

// Proposal routes
router.post(
  '/daos/:daoId/proposals',
  authMiddleware,
  proposalController.createProposal
);

router.get(
  '/daos/:daoId/proposals',
  proposalController.getProposals
);

router.post(
  '/proposals/:proposalId/vote',
  authMiddleware,
  proposalController.vote
);

router.post(
  '/proposals/:proposalId/execute',
  authMiddleware,
  requireRole(['admin', 'creator']),
  proposalController.executeProposal
);

// Token routes
router.post(
  '/daos/:daoId/tokens/mint',
  authMiddleware,
  requireRole(['admin', 'creator']),
  tokenController.mintTokens
);

router.post(
  '/daos/:daoId/tokens/transfer',
  authMiddleware,
  tokenController.transferTokens
);

router.get(
  '/daos/:daoId/tokens/balance/:address',
  tokenController.getBalance
);

router.get(
  '/daos/:daoId/tokens/holders',
  tokenController.getTokenHolders
);

// Member routes
router.post(
  '/daos/:daoId/members/join',
  authMiddleware,
  memberController.joinDao
);

router.post(
  '/daos/:daoId/members/leave',
  authMiddleware,
  memberController.leaveDao
);

router.patch(
  '/daos/:daoId/members/:memberAddress/role',
  authMiddleware,
  requireRole(['admin', 'creator']),
  memberController.updateMemberRole
);

router.get(
  '/daos/:daoId/members',
  memberController.getMembers
);

router.get(
  '/daos/:daoId/members/:memberAddress',
  memberController.getMemberDetails
);

export default router; 