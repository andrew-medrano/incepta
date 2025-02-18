# Incepta Search

A modern web application for technology transfer and patent search, built with Vite, React, TypeScript, and Tailwind CSS.

## Features

- 🔍 Intelligent search across 200+ US universities and research institutions
- 🤖 AI-powered query analysis and refinement
- 📊 Interactive knowledge graph visualization
- 📱 Responsive design for all devices
- 📄 PDF report generation
- ⚡ Real-time search results
- 🎨 Modern UI with Tailwind CSS and shadcn/ui

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router
- **Data Fetching**: TanStack React Query
- **Notifications**: Sonner + shadcn/ui toasts
- **Graph Visualization**: react-force-graph-2d
- **PDF Generation**: html2pdf.js
- **Markdown Rendering**: ReactMarkdown

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/incepta-harmony-search.git
cd incepta-harmony-search
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Preview production build:
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
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_URL=your_api_url
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_HOSTNAME=your_pinecone_hostname
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for the blazing fast build tool
- [React](https://reactjs.org/) for the awesome frontend library
