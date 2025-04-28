import axios from 'axios';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key');
}

export const openaiService = {
  async getEmbedding(text: string): Promise<number[]> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/embeddings',
        {
          input: text,
          model: 'text-embedding-ada-002',
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.data[0].embedding;
    } catch (error) {
      console.error('Error getting embedding:', error);
      throw error;
    }
  },

  async semanticSearch(query: string, items: any[], field: string): Promise<any[]> {
    try {
      const queryEmbedding = await this.getEmbedding(query);
      
      // Calculate similarity scores
      const results = items.map(item => {
        const itemEmbedding = item.embedding;
        const similarity = this.cosineSimilarity(queryEmbedding, itemEmbedding);
        return { ...item, similarity };
      });

      // Sort by similarity
      return results.sort((a, b) => b.similarity - a.similarity);
    } catch (error) {
      console.error('Error performing semantic search:', error);
      throw error;
    }
  },

  async findFounderMatches(profile: any, otherProfiles: any[]): Promise<any[]> {
    try {
      const profileEmbedding = await this.getEmbedding(
        `${profile.skills.join(', ')} ${profile.interests.join(', ')} ${profile.bio}`
      );

      const matches = otherProfiles.map(otherProfile => {
        const otherEmbedding = otherProfile.embedding;
        const similarity = this.cosineSimilarity(profileEmbedding, otherEmbedding);
        return { ...otherProfile, similarity };
      });

      return matches
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5);
    } catch (error) {
      console.error('Error finding founder matches:', error);
      throw error;
    }
  },

  async generatePostDraft(topic: string, style: string = 'professional'): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a professional content writer. Write a ${style} post about ${topic}.`
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating post draft:', error);
      throw error;
    }
  },

  // Helper function to calculate cosine similarity
  cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  },
}; 