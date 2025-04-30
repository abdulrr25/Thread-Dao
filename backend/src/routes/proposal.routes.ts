import { Router } from 'express';
import { validate } from '../middleware/validate';
import { createProposalSchema, voteSchema } from '../schemas/validation';
import { ProposalController } from '../controllers/proposal.controller';
import { auth } from '../middleware/auth';

const router = Router();
const proposalController = new ProposalController();

// Create a new proposal
router.post(
  '/',
  auth,
  validate(createProposalSchema),
  proposalController.createProposal
);

// Get all proposals
router.get('/', proposalController.getAllProposals);

// Get a specific proposal
router.get('/:id', proposalController.getProposal);

// Vote on a proposal
router.post(
  '/:id/vote',
  auth,
  validate(voteSchema),
  proposalController.vote
);

// Get proposal votes
router.get('/:id/votes', proposalController.getVotes);

// Execute a proposal
router.post('/:id/execute', auth, proposalController.executeProposal);

export default router; 