import { Router } from 'express';
import { validate } from '../middleware/validate';
import { mintTokensSchema, transferTokensSchema } from '../schemas/validation';
import { TokenController } from '../controllers/token.controller';
import { auth } from '../middleware/auth';

const router = Router();
const tokenController = new TokenController();

// Mint tokens
router.post(
  '/:daoId/tokens/mint',
  auth,
  validate(mintTokensSchema),
  tokenController.mintTokens
);

// Transfer tokens
router.post(
  '/:daoId/tokens/transfer',
  auth,
  validate(transferTokensSchema),
  tokenController.transferTokens
);

// Get token balance
router.get('/:daoId/tokens/balance/:address', tokenController.getBalance);

// Get token holders
router.get('/:daoId/tokens/holders', tokenController.getTokenHolders);

export default router; 