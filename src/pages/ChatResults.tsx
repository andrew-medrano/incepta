
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Send, ArrowLeft } from "lucide-react";

interface SearchState {
  query: string;
  file?: File;
  image?: File;
}

const ChatResults = () => {
  const location = useLocation();
  const searchState = location.state as SearchState;
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
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <ArrowLeft className="w-5 h-5 text-purple-900" />
              <span className="text-purple-900">Back to Search</span>
            </Link>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 min-h-[600px] flex flex-col">
          <div className="flex-1 space-y-6 overflow-auto mb-6">
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
