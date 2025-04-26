# ThreadDAO Backend

This is the backend server for ThreadDAO, a decentralized social platform built with Express.js, Solana, and Supabase.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Solana CLI tools
- Supabase account
- OpenAI API key
- IPFS/Arweave account

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
OPENAI_API_KEY=your_openai_api_key
IPFS_API_KEY=your_ipfs_api_key
IPFS_API_SECRET=your_ipfs_api_secret
ARWEAVE_KEY=your_arweave_key
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

- `GET /` - Welcome message
- `POST /api/posts` - Create a new post/DAO
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get a specific post
- `POST /api/ai/writing-assistant` - Get AI writing suggestions
- `POST /api/ai/semantic-search` - Perform semantic search
- `POST /api/ai/founder-matching` - Get founder matching suggestions
- `GET /api/users/:id` - Get user profile
- `POST /api/daos/:id/vote` - Vote on a DAO proposal
- `POST /api/daos/:id/chat` - Send a message to DAO chat

## Development

- The server uses TypeScript for type safety
- Express.js for the web framework
- Supabase for database and authentication
- Solana Web3.js for blockchain interactions
- OpenAI for AI features
- IPFS/Arweave for decentralized storage

## Testing

Run tests with:
```bash
npm test
```

## Deployment

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
``` 