import { Request, Response } from 'express';
import openai from '../services/openaiService';

export const aiWrite = async (req: Request, res: Response) => {
  const { prompt } = req.body;
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });
    res.json({ response: completion.data.choices[0].message?.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const semanticSearch = async (req: Request, res: Response) => {
  const { query } = req.body;
  try {
    const embedding = await openai.createEmbedding({
      model: 'text-embedding-ada-002',
      input: query,
    });
    res.json({ embedding: embedding.data.data[0].embedding });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};