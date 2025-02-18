import { useEffect, useRef } from "react";
import { Send, Search, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message, SearchResult } from "@/types/search";
import ReactMarkdown from "react-markdown";
import SelectedTechnologies from "@/components/chat-results/SelectedTechnologies";

interface ChatSidebarProps {
  messages: Message[];
  refinement: string;
  isLoading: boolean;
  selectedResults: SearchResult[];
  setRefinement: (value: string) => void;
  handleRefinement: (e: React.FormEvent) => void;
  setSelectedResults: (results: SearchResult[]) => void;
  generatePDF: () => void;
}

const ChatSidebar = ({
  messages,
  refinement,
  isLoading,
  selectedResults,
  setRefinement,
  handleRefinement,
  setSelectedResults,
  generatePDF
}: ChatSidebarProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages, refinement, or selectedResults change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, refinement, selectedResults]);

  const renderChatMessage = (message: Message) => {
    const isSearching = message.isSearching;
    if (isSearching) {
      return (
        <div className="flex items-center space-x-3">
          <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
          <span>{message.content}</span>
        </div>
      );
    }
    
    if (message.type === "system") {
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
            pre: ({ children }) => (
              <pre className="bg-black/10 rounded p-2 mb-2 overflow-x-auto">{children}</pre>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      );
    }

    return <span>{message.content}</span>;
  };

  return (
    <aside className="w-full md:w-1/3 lg:w-1/4 border-b md:border-b-0 md:border-r border-purple-200/50 flex flex-col h-[40vh] md:h-[calc(100vh-4rem)] bg-gray-50">
      <div className="flex-1 overflow-hidden" ref={scrollContainerRef}>
        <ScrollArea className="h-full">
          <div className="space-y-4 p-4">
            {messages
              .filter((m) => m.type !== "result")
              .map((message, index) => {
                const isUser = message.type === "user";
                const isSystem = message.type === "system";

                if (isSystem && message.content === "RESULTS_DONE") {
                  return (
                    <div key={index} className="flex items-center justify-center py-2">
                      <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Search Complete
                      </div>
                    </div>
                  );
                }

                const containerClasses = isUser
                  ? "bg-purple-600 text-white max-w-[90%] ml-auto"
                  : "bg-gray-200 text-gray-700 max-w-[90%]";

                return (
                  <div key={index} className={`p-4 rounded-xl ${containerClasses}`}>
                    <div className="prose prose-sm max-w-none">
                      {renderChatMessage(message)}
                    </div>
                    {message.searchQueries && (
                      <div className="mt-3 space-y-2 text-sm bg-white/80 p-3 rounded">
                        <p className="font-semibold mb-2">Search Queries:</p>
                        {message.searchQueries.map((q, idx) => (
                          <div key={idx} className="p-2 bg-purple-50 rounded">
                            <div className="flex items-center gap-2 text-purple-900">
                              <Search className="w-4 h-4 flex-shrink-0" />
                              <p className="font-medium">{q.query}</p>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{q.explanation}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

            <SelectedTechnologies
              selectedResults={selectedResults}
              setSelectedResults={setSelectedResults}
              generatePDF={generatePDF}
            />
            
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      <div className="p-3 md:p-4 border-t border-purple-200/50 bg-white/50 backdrop-blur-sm">
        <form onSubmit={handleRefinement} className="relative">
          <input
            type="text"
            value={refinement}
            onChange={(e) => setRefinement(e.target.value)}
            placeholder="Refine your search..."
            disabled={isLoading}
            className="w-full px-4 md:px-6 py-2 md:py-3 text-gray-800 border-0 rounded-xl
                     bg-white/90 shadow-md
                     focus:outline-none focus:ring-2 focus:ring-purple-400
                     focus:ring-opacity-50 pr-12
                     disabled:opacity-50 disabled:cursor-not-allowed
                     text-sm md:text-base"
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
    </aside>
  );
};

export default ChatSidebar; 