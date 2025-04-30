# ThreadDao

A decentralized autonomous organization (DAO) platform built with modern web technologies.

## Features

- User authentication and authorization
- DAO creation and management
- Proposal creation and voting
- Real-time updates via WebSocket
- AI-powered content generation and analysis
- Rate limiting and caching
- Comprehensive error handling and logging

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- WebSocket
- OpenAI GPT-4

### Frontend
- React with TypeScript
- Vite
- TanStack Query
- Tailwind CSS
- Shadcn UI

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Redis
- OpenAI API key

## Environment Variables

### Backend (.env)
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/threaddao"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/threaddao.git
cd threaddao
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up the database:
```bash
# In the backend directory
npx prisma migrate dev
```

4. Start the development servers:

```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

## Development

### Backend Structure
```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── prisma/            # Database schema and migrations
└── tests/             # Test files
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/    # React components
│   ├── context/       # React context
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Utility functions
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── styles/        # Global styles
│   └── types/         # TypeScript types
└── public/           # Static assets
```

## Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
