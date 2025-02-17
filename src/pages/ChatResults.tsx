import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Send, ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SearchState {
  query: string;
  file?: File;
  image?: File;
}

const ChatResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchState = location.state as SearchState | null;

  useEffect(() => {
    if (!searchState?.query) {
      navigate('/');
    }
  }, [searchState, navigate]);

  if (!searchState?.query) {
    return null;
  }

  const [messages, setMessages] = useState([
    { type: 'system', content: `Here are the results for "${searchState.query}"` },
    { type: 'result', content: 'I found several relevant patents and research papers related to your query.' }
  ]);
  const [refinement, setRefinement] = useState("");

  const handleRefinement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinement.trim()) return;

    setMessages([
      ...messages,
      { type: 'user', content: refinement },
      { type: 'system', content: 'Analyzing your refinement...' },
      { type: 'result', content: 'Based on your refinement, here are more specific results...' }
    ]);
    setRefinement("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-200 to-purple-100">
      <header className="bg-white/70 backdrop-blur-md border-b border-purple-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <ArrowLeft className="w-5 h-5 text-purple-900" />
              <span className="text-purple-900">Back to Search</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="px-6 py-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-sm">
            <p className="text-lg text-purple-900 font-medium">{searchState.query}</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 min-h-[600px] flex flex-col">
          <ScrollArea className="flex-1 mb-6">
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl max-w-[80%] ${
                    message.type === 'user' 
                      ? 'bg-purple-600 text-white ml-auto' 
                      : message.type === 'system'
                      ? 'bg-gray-200 text-gray-700'
                      : 'bg-purple-100 text-purple-900'
                  }`}
                >
                  {message.content}
                </div>
              ))}
            </div>
          </ScrollArea>

          <form onSubmit={handleRefinement} className="relative">
            <input
              type="text"
              value={refinement}
              onChange={(e) => setRefinement(e.target.value)}
              placeholder="Refine your search..."
              className="w-full px-6 py-4 text-gray-800 border-0 rounded-xl
                        bg-white/90 shadow-md
                        focus:outline-none focus:ring-2 focus:ring-purple-400
                        focus:ring-opacity-50 pr-12"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2
                         bg-purple-600 text-white rounded-lg
                         hover:bg-purple-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatResults;
