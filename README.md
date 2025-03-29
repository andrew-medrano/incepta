# Incepta Search

A modern web application for technology transfer and patent search, built with Vite, React, TypeScript, and Tailwind CSS.

## Features

- 🔍 Intelligent search across 200+ US universities and research institutions
- 🤖 AI-powered query analysis and refinement
- 📱 Responsive design for all devices
- 📄 PDF report generation
- ⚡ Real-time search results with Edge Functions
- 🎨 Modern UI with Tailwind CSS and shadcn/ui

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router
- **Data Fetching**: TanStack React Query
- **Notifications**: Sonner + shadcn/ui toasts
- **PDF Generation**: html2pdf.js
- **Markdown Rendering**: ReactMarkdown
- **API Runtime**: Vercel Edge Functions
- **Vector Search**: Pinecone
- **LLM Integration**: OpenAI GPT-4

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/incepta-search.git
cd incepta-search
```

2. Install dependencies:
```bash
npm install
```

3. Install Vercel CLI (required for Edge Functions):
```bash
npm install -g vercel
```

4. Link your project to Vercel:
```bash
vercel link
```

5. Pull environment variables:
```bash
vercel env pull
```

6. Start the development server:

For frontend-only development (no Edge Functions):
```bash
npm run dev
```

For full-stack development with Edge Functions:
```bash
vercel dev
```

Note: Edge Functions (`/api` endpoints) will only work when using `vercel dev`. The regular Vite dev server (`npm run dev`) can't execute Edge Functions locally.

7. Build for production:
```bash
npm run build
```

8. Preview production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/     # React components
│   ├── ui/        # shadcn/ui components
│   └── ...        # Custom components
├── hooks/         # Custom React hooks
├── lib/          # Utility functions
├── pages/        # Page components
└── types/        # TypeScript types
api/              # Vercel Edge Functions
├── chat.ts       # OpenAI chat completion endpoint
└── search.ts     # Pinecone vector search endpoint
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_HOSTNAME=your_pinecone_hostname
```

## Deployment

This project is configured for deployment on Vercel with Edge Functions:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables in Vercel's dashboard
4. Deploy

The Edge Functions in the `/api` directory will be automatically detected and deployed by Vercel. They provide:
- Low-latency responses worldwide
- Automatic scaling
- No cold starts
- Real-time streaming for chat completions

## API Endpoints

### `/api/chat`
- **Runtime**: Edge Function
- **Purpose**: Handles chat completions via OpenAI
- **Features**: 
  - Query analysis
  - Search query generation
  - Result analysis
  - Report generation

### `/api/search`
- **Runtime**: Edge Function
- **Purpose**: Performs vector search via Pinecone
- **Features**:
  - Semantic search across technology database
  - Real-time embedding generation
  - Relevance scoring

