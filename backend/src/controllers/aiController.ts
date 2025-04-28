import { Request, Response } from 'express';
import openai from '../services/openaiService.js';

export const generateResponse = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    res.json({ response: completion.choices[0].message.content });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const generateEmbedding = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const embedding = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });
    res.json({ embedding: embedding.data[0].embedding });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};