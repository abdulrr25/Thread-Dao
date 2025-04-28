import OpenAI from 'openai';
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
export const getWritingSuggestions = async (options) => {
    try {
        const prompt = `Please provide writing suggestions for the following content:
Content: ${options.content}
${options.style ? `Style: ${options.style}` : ''}
${options.tone ? `Tone: ${options.tone}` : ''}

Please provide:
1. Grammar and spelling corrections
2. Style improvements
3. Content enhancement suggestions
4. Alternative phrasing options`;
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful writing assistant that provides constructive feedback and suggestions.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });
        return response.choices[0].message.content;
    }
    catch (error) {
        console.error('Error getting writing suggestions:', error);
        throw new Error('Failed to get writing suggestions');
    }
};
export const semanticSearch = async (options) => {
    try {
        const prompt = `Perform a semantic search for the following query:
Query: ${options.query}
${options.context ? `Context: ${options.context}` : ''}

Please provide:
1. Relevant results
2. Related topics
3. Key concepts
4. Suggested resources`;
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are a semantic search assistant that provides relevant and contextual results.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });
        return response.choices[0].message.content;
    }
    catch (error) {
        console.error('Error performing semantic search:', error);
        throw new Error('Failed to perform semantic search');
    }
};
export const findFounderMatches = async (options) => {
    try {
        const prompt = `Find potential founder matches based on the following criteria:
Interests: ${options.interests.join(', ')}
Skills: ${options.skills.join(', ')}
Project Type: ${options.projectType}

Please provide:
1. Matching profiles
2. Complementary skills
3. Potential collaboration opportunities
4. Recommended next steps`;
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are a founder matching assistant that helps connect compatible entrepreneurs.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });
        return response.choices[0].message.content;
    }
    catch (error) {
        console.error('Error finding founder matches:', error);
        throw new Error('Failed to find founder matches');
    }
};
