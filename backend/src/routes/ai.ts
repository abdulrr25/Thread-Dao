import express from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validate';
import {
  getWritingSuggestions,
  semanticSearch,
  findFounderMatches,
} from '../services/ai';

const router = express.Router();

const writingAssistantSchema = z.object({
  content: z.string().min(1),
  style: z.string().optional(),
  tone: z.string().optional(),
});

const semanticSearchSchema = z.object({
  query: z.string().min(1),
  context: z.string().optional(),
});

const founderMatchingSchema = z.object({
  interests: z.array(z.string()),
  skills: z.array(z.string()),
  projectType: z.string(),
});

router.post(
  '/writing-assistant',
  validateRequest(writingAssistantSchema),
  async (req, res) => {
    try {
      const suggestions = await getWritingSuggestions(req.body);
      res.json({
        success: true,
        data: suggestions,
      });
    } catch (error) {
      console.error('Error in writing assistant:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get writing suggestions',
      });
    }
  }
);

router.post(
  '/semantic-search',
  validateRequest(semanticSearchSchema),
  async (req, res) => {
    try {
      const results = await semanticSearch(req.body);
      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      console.error('Error in semantic search:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to perform semantic search',
      });
    }
  }
);

router.post(
  '/founder-matching',
  validateRequest(founderMatchingSchema),
  async (req, res) => {
    try {
      const matches = await findFounderMatches(req.body);
      res.json({
        success: true,
        data: matches,
      });
    } catch (error) {
      console.error('Error in founder matching:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to find founder matches',
      });
    }
  }
);

export default router;