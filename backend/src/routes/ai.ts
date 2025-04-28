import express from 'express';
import { z } from 'zod';
import {
  getWritingSuggestions,
  semanticSearch,
  findFounderMatches
} from '../services/ai';
import { supabase } from '../index';

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
  async (req, res) => {
    try {
      const suggestions = await getWritingSuggestions(req.body);
      res.json({
        success: true,
        data: suggestions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get writing suggestions',
      });
    }
  }
);

router.post(
  '/semantic-search',
  async (req, res) => {
    try {
      const results = await semanticSearch(req.body);
      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to perform semantic search',
      });
    }
  }
);

router.post(
  '/founder-matching',
  async (req, res) => {
    try {
      const matches = await findFounderMatches(req.body);
      res.json({
        success: true,
        data: matches,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to find founder matches',
      });
    }
  }
);

// Get AI suggestions for a post
router.get('/suggestions/:postId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ai_suggestions')
      .select('*')
      .eq('post_id', req.params.postId);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch AI suggestions' });
  }
});

// Generate AI content
router.post('/generate', async (req, res) => {
  try {
    const { prompt, type } = req.body;
    
    // TODO: Implement AI content generation logic
    // This is a placeholder response
    res.json({
      content: 'AI generated content based on prompt',
      type
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate AI content' });
  }
});

export default router;