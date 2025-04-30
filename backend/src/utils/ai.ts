import { Configuration, OpenAIApi } from 'openai';
import { ApiError } from './error';

export class AIManager {
  private static instance: AIManager;
  private openai: OpenAIApi;

  private constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  public static getInstance(): AIManager {
    if (!AIManager.instance) {
      AIManager.instance = new AIManager();
    }
    return AIManager.instance;
  }

  public async generateDAOStructure(
    name: string,
    description: string,
    industry: string
  ): Promise<{
    structure: {
      name: string;
      description: string;
      roles: Array<{
        name: string;
        description: string;
        responsibilities: string[];
      }>;
      votingRules: {
        quorum: number;
        votingPeriod: number;
        proposalThreshold: number;
      };
      tokenomics: {
        initialSupply: number;
        distribution: {
          [key: string]: number;
        };
      };
    };
  }> {
    try {
      const prompt = `Generate a DAO structure for a ${industry} organization named "${name}" with the following description: "${description}". Include roles, voting rules, and tokenomics.`;

      const completion = await this.openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a DAO structure expert. Generate a detailed DAO structure based on the given information.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const response = completion.data.choices[0].message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      // Parse the response into a structured format
      const structure = JSON.parse(response);
      return { structure };
    } catch (error) {
      console.error('Error generating DAO structure:', error);
      throw new ApiError(500, 'Failed to generate DAO structure');
    }
  }

  public async generateProposalContent(
    title: string,
    context: string,
    type: 'funding' | 'governance' | 'operation'
  ): Promise<{
    content: {
      title: string;
      description: string;
      rationale: string;
      impact: string;
      implementation: string;
    };
  }> {
    try {
      const prompt = `Generate a detailed proposal for a ${type} proposal titled "${title}" with the following context: "${context}". Include description, rationale, impact, and implementation details.`;

      const completion = await this.openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a DAO proposal expert. Generate a detailed proposal based on the given information.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const response = completion.data.choices[0].message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      // Parse the response into a structured format
      const content = JSON.parse(response);
      return { content };
    } catch (error) {
      console.error('Error generating proposal content:', error);
      throw new ApiError(500, 'Failed to generate proposal content');
    }
  }

  public async generatePostContent(
    topic: string,
    tone: 'professional' | 'casual' | 'technical',
    length: 'short' | 'medium' | 'long'
  ): Promise<{
    content: {
      title: string;
      body: string;
      tags: string[];
    };
  }> {
    try {
      const prompt = `Generate a ${tone} ${length} post about "${topic}". Include a title, body, and relevant tags.`;

      const completion = await this.openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a content creation expert. Generate engaging content based on the given information.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const response = completion.data.choices[0].message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      // Parse the response into a structured format
      const content = JSON.parse(response);
      return { content };
    } catch (error) {
      console.error('Error generating post content:', error);
      throw new ApiError(500, 'Failed to generate post content');
    }
  }

  public async analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    aspects: Array<{
      aspect: string;
      sentiment: 'positive' | 'negative' | 'neutral';
      score: number;
    }>;
  }> {
    try {
      const prompt = `Analyze the sentiment of the following text: "${text}". Include overall sentiment, score, and specific aspects.`;

      const completion = await this.openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a sentiment analysis expert. Analyze the sentiment of the given text.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const response = completion.data.choices[0].message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      // Parse the response into a structured format
      const analysis = JSON.parse(response);
      return analysis;
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      throw new ApiError(500, 'Failed to analyze sentiment');
    }
  }

  public async summarizeText(text: string): Promise<{
    summary: string;
    keyPoints: string[];
  }> {
    try {
      const prompt = `Summarize the following text: "${text}". Include a concise summary and key points.`;

      const completion = await this.openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a text summarization expert. Generate a concise summary of the given text.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const response = completion.data.choices[0].message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      // Parse the response into a structured format
      const summary = JSON.parse(response);
      return summary;
    } catch (error) {
      console.error('Error summarizing text:', error);
      throw new ApiError(500, 'Failed to summarize text');
    }
  }
} 