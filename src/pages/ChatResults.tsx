import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Send, ArrowLeft, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { prompts } from "@/lib/prompts";
import ReactMarkdown from 'react-markdown';
import { SearchQuery, SearchQueryResponse, SearchResult, Message } from "@/types/search";

interface SearchState {
  query: string;
  file?: File;
  image?: File;
}

const ChatResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const searchState = location.state as SearchState | null;
  const [messages, setMessages] = useState<Message[]>([]);
  const [refinement, setRefinement] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!searchState?.query) {
      navigate('/');
      return;
    }
    
    initiateChat(searchState.query);
  }, [searchState, navigate]);

  const initiateChat = async (query: string) => {
    setIsLoading(true);
    try {
      // Initial chat to analyze query
      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            prompts.queryAnalysis,
            {
              role: 'user',
              content: query
            }
          ]
        })
      });

      if (!chatResponse.ok) throw new Error('Chat request failed');
      const chatData = await chatResponse.json();
      
      // If the query needs clarification, show the question
      if (!chatData.message.includes('QUERY_READY')) {
        setMessages([
          { type: 'system', content: chatData.message }
        ]);
      } else {
        // If query is ready, proceed directly to search
        await generateAndSearch(query);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your query. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAndSearch = async (query: string) => {
    try {
      // Generate search queries
      const queryGenResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            prompts.searchQueryGeneration,
            {
              role: 'user',
              content: query
            }
          ]
        })
      });

      if (!queryGenResponse.ok) throw new Error('Query generation failed');
      const queryGenData = await queryGenResponse.json();
      const searchQueries: SearchQueryResponse = JSON.parse(queryGenData.message);

      // Add search queries to messages
      setMessages(prev => [
        ...prev,
        {
          type: 'system',
          content: 'Generating targeted search queries...',
          searchQueries: searchQueries.queries
        }
      ]);

      // Perform parallel searches
      const searchPromises = searchQueries.queries.map(async (searchQuery) => {
        const searchResponse = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchQuery.query })
        });

        if (!searchResponse.ok) throw new Error('Search request failed');
        const response = await searchResponse.json();
        
        // Take top 4 results for each query
        return {
          query: searchQuery,
          results: response.results.slice(0, 4)
        };
      });

      setMessages(prev => [...prev, { type: 'system', content: 'Searching across multiple aspects...' }]);
      
      const searchResults = await Promise.all(searchPromises);
      
      // Add results message for each query
      searchResults.forEach(({ query, results }) => {
        setMessages(prev => [
          ...prev,
          {
            type: 'result',
            content: `Results for: ${query.query}\n${query.explanation}`,
            results: results
          }
        ]);
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search for technologies. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRefinement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinement.trim() || isLoading) return;

    const newMessage = { type: 'user' as const, content: refinement };
    setMessages(prev => [...prev, newMessage]);
    setRefinement("");
    
    setIsLoading(true);
    try {
      // Get previous context
      const previousMessages = messages
        .filter(m => m.type === 'user' || m.type === 'system')
        .map(m => ({
          role: m.type === 'user' ? 'user' as const : 'assistant' as const,
          content: m.content
        }));

      const refinementResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            prompts.refinementAnalysis,
            ...previousMessages,
            { role: 'user', content: refinement }
          ]
        })
      });

      if (!refinementResponse.ok) throw new Error('Refinement request failed');
      const refinementData = await refinementResponse.json();
      
      // If it's a clarifying response, proceed directly to search with combined context
      if (searchState?.query) {
        const combinedQuery = `Original Query: ${searchState.query}\nClarification: ${refinement}`;
        await generateAndSearch(combinedQuery);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your refinement. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (content: string) => {
    return (
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-4 mb-2 last:mb-0">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 last:mb-0">{children}</ol>,
          li: ({ children }) => <li className="mb-1">{children}</li>,
          h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-md font-bold mb-2">{children}</h3>,
          code: ({ children }) => <code className="bg-black/10 rounded px-1">{children}</code>,
          pre: ({ children }) => <pre className="bg-black/10 rounded p-2 mb-2 overflow-x-auto">{children}</pre>,
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  if (!searchState?.query) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white/70 backdrop-blur-md border-b border-purple-200 sticky top-0 z-50 h-16 flex-shrink-0">
        <div className="px-6 h-full flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3">
              <ArrowLeft className="w-5 h-5 text-purple-900" />
              <span className="text-purple-900">Back to Home</span>
            </Link>
            <Link to="/" className="text-2xl font-bold text-purple-900">
              Incepta
            </Link>
          </div>
          
          <nav className="flex items-center space-x-8">
            <Link to="/about" className="text-purple-900 hover:text-purple-700 transition-colors">
              About
            </Link>
            <Link to="/pricing" className="text-purple-900 hover:text-purple-700 transition-colors">
              Pricing
            </Link>
            <Link to="/contact" className="text-purple-900 hover:text-purple-700 transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex-1 flex flex-col bg-gradient-to-b from-purple-200 to-purple-100 overflow-hidden">
        <div className="h-4"></div>

        <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-4 min-h-0">
          <div className="max-w-6xl mx-auto h-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl flex flex-col">
            <ScrollArea className="flex-1 h-full">
              <div className="p-6 space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl ${
                      message.type === 'user' 
                        ? 'bg-purple-600 text-white max-w-[80%] ml-auto prose-invert' 
                        : message.type === 'system'
                        ? 'bg-gray-200 text-gray-700 max-w-[80%]'
                        : 'bg-purple-100 text-purple-900 max-w-[90%]'
                    }`}
                  >
                    <div className="prose prose-sm max-w-none">
                      {renderMessage(message.content)}
                    </div>
                    {message.searchQueries && (
                      <div className="mt-4 space-y-3">
                        <p className="font-medium text-sm">Search Queries:</p>
                        {message.searchQueries.map((query, idx) => (
                          <div key={idx} className="bg-white/80 p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-purple-900">
                              <Search className="w-4 h-4" />
                              <p className="font-medium">{query.query}</p>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{query.explanation}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {message.results && (
                      <div className="mt-4 space-y-4">
                        {message.results.map((result, idx) => (
                          <div key={idx} className="bg-white/90 p-3 rounded-lg">
                            <h3 className="font-semibold text-purple-900">{result.title}</h3>
                            <p className="text-sm text-gray-600">{result.university}</p>
                            <div className="mt-2 text-sm prose prose-sm max-w-none">
                              {renderMessage(result.llm_teaser)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="p-4 rounded-xl bg-gray-200 text-gray-700 max-w-[80%]">
                    Processing...
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex-shrink-0 p-4 border-t border-purple-100 bg-white/50 backdrop-blur-sm rounded-b-2xl">
              <form onSubmit={handleRefinement} className="relative max-w-6xl mx-auto">
                <input
                  type="text"
                  value={refinement}
                  onChange={(e) => setRefinement(e.target.value)}
                  placeholder="Refine your search..."
                  disabled={isLoading}
                  className="w-full px-6 py-4 text-gray-800 border-0 rounded-xl
                            bg-white/90 shadow-md
                            focus:outline-none focus:ring-2 focus:ring-purple-400
                            focus:ring-opacity-50 pr-12
                            disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2
                           bg-purple-600 text-white rounded-lg
                           hover:bg-purple-700 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatResults;
