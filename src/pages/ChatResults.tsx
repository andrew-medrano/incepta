import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Send, ArrowLeft, Search, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { prompts } from "@/lib/prompts";
import ReactMarkdown from "react-markdown";
import { SearchQuery, SearchQueryResponse, SearchResult, Message } from "@/types/search";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import html2pdf from 'html2pdf.js';
import { marked } from 'marked';

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
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [selectedResults, setSelectedResults] = useState<SearchResult[]>([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [generatedPDFBlob, setGeneratedPDFBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (!searchState?.query) {
      navigate("/");
      return;
    }
    // Initiate the chat with the user query
    initiateChat(searchState.query);
  }, [searchState, navigate]);

  /**
   * Collect all queries from messages that contain 'searchQueries'.
   * We'll flatten them so we can display them at the top of the center panel.
   */
  const getAllSearchQueries = (msgs: Message[]): SearchQuery[] => {
    const allQueries: SearchQuery[] = [];
    msgs.forEach((m) => {
      if (m.searchQueries && m.searchQueries.length > 0) {
        allQueries.push(...m.searchQueries);
      }
    });
    return allQueries;
  };

  /**
   * Collect all results from messages of type 'result'.
   * Each 'result' message corresponds to searching a particular query.
   * The message content is typically "Results for: [QUERY]", and
   * the "results" field holds an array of SearchResult objects.
   */
  const getAllSearchResults = (msgs: Message[]) => {
    return msgs
      .filter((m) => m.type === "result" && m.results && m.results.length > 0)
      .map((m) => ({
        label: m.content.replace(/^Results for:\s?/, ""), // e.g. "Some Query"
        results: m.results,
      }));
  };

  const allSearchQueries = getAllSearchQueries(messages);
  const allSearchResults = getAllSearchResults(messages);

  // Initiate chat by analyzing the user's query
  const initiateChat = async (query: string) => {
    setIsLoading(true);
    try {
      // First request to analyze the query
      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [prompts.queryAnalysis, { role: "user", content: query }],
        }),
      });

      if (!chatResponse.ok) throw new Error("Chat request failed");
      const chatData = await chatResponse.json();

      // If the query needs clarification, show the question
      if (!chatData.message.includes("QUERY_READY")) {
        setMessages([{ type: "system", content: chatData.message }]);
      } else {
        // If the query is ready, go directly to search
        await generateAndSearch(query);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your query. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Generate search queries via LLM and then perform parallel searches
   */
  const generateAndSearch = async (query: string) => {
    try {
      const queryGenStartTime = Date.now();

      // Clear previous results when starting a new search
      setSearchResults([]);

      // Add a "loading" message in chat
      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          content: "Generating relevant search queries to analyze your request...",
          isSearching: true,
        },
      ]);

      // LLM to generate search queries
      const queryGenResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [prompts.searchQueryGeneration, { role: "user", content: query }],
        }),
      });
      if (!queryGenResponse.ok) throw new Error("Query generation failed");

      const queryGenData = await queryGenResponse.json();
      const searchQueries: SearchQueryResponse = JSON.parse(queryGenData.message);

      // Ensure at least 5s pass for "loading" effect
      const queryGenDuration = Date.now() - queryGenStartTime;
      if (queryGenDuration < 5000) {
        await new Promise((resolve) => setTimeout(resolve, 5000 - queryGenDuration));
      }

      // Remove the loading message and show the generated queries in the chat
      setMessages((prev) => [
        ...prev.filter((msg) => !msg.isSearching),
        {
          type: "system",
          content: "Generated targeted search queries:",
          searchQueries: searchQueries.queries,
        },
      ]);

      // Start searching
      setIsSearching(true);
      const searchStartTime = Date.now();

      // Perform parallel searches
      const searchPromises = searchQueries.queries.map(async (searchQuery) => {
        const searchResponse = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchQuery.query }),
        });
        if (!searchResponse.ok) throw new Error("Search request failed");
        const response = await searchResponse.json();
        return response.results;
      });

      // Show a "searching..." message in chat
      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          content: "Searching across 200+ US universities and research institutions...",
          isSearching: true,
        },
      ]);

      const allResults = await Promise.all(searchPromises);
      
      // Add debug logging
      console.log('Search results:', allResults);
      
      // Flatten and deduplicate results based on title
      const uniqueResults = Array.from(
        allResults.flat().reduce((map, result) => {
          if (!map.has(result.title)) {
            map.set(result.title, result);
          }
          return map;
        }, new Map<string, SearchResult>())
      ).map(([_, result]) => result);

      // Log the final unique results
      console.log('Unique results:', uniqueResults);

      // Ensure at least 5s pass for "loading" effect
      const searchDuration = Date.now() - searchStartTime;
      if (searchDuration < 5000) {
        await new Promise((resolve) => setTimeout(resolve, 5000 - searchDuration));
      }

      // Remove the searching message
      setMessages((prev) => prev.filter((msg) => !msg.isSearching));

      // Update the unified search results
      setSearchResults(uniqueResults);

      // Add a final system message that says "Search Complete"
      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          content: "RESULTS_DONE",
        },
      ]);

      setIsSearching(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search for technologies. Please try again.",
        variant: "destructive",
      });
      setIsSearching(false);
    }
  };

  /**
   * User refinement handler - user types a refinement and hits enter
   */
  const handleRefinement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinement.trim() || isLoading) return;

    const newMessage = { type: "user" as const, content: refinement };
    setMessages((prev) => [...prev, newMessage]);
    setRefinement("");

    setIsLoading(true);
    try {
      // Filter down to user/system messages for context
      const previousMessages = messages
        .filter((m) => m.type === "user" || m.type === "system")
        .map((m) => ({
          role: m.type === "user" ? "user" : "assistant",
          content: m.content,
        }));

      // Send user refinement to LLM
      const refinementResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            prompts.refinementAnalysis,
            ...previousMessages,
            { role: "user", content: refinement },
          ],
        }),
      });
      if (!refinementResponse.ok) throw new Error("Refinement request failed");
      const refinementData = await refinementResponse.json();

      // If it leads to new search queries, combine original + new user input
      if (searchState?.query) {
        const combinedQuery = `Original Query: ${searchState.query}\nClarification: ${refinement}`;
        await generateAndSearch(combinedQuery);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your refinement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Renders a message (Markdown if system, plain text if user).
   * If isSearching, we show a loading spinner with text.
   */
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
    // For normal system messages, render as Markdown
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
    // For user messages, plain text
    if (message.type === "user") {
      return <span>{message.content}</span>;
    }
    return <span>{message.content}</span>;
  };

  // Add helper function for selection
  const toggleResultSelection = (result: SearchResult) => {
    setSelectedResults(prev => {
      const isSelected = prev.some(r => r.title === result.title);
      if (isSelected) {
        return prev.filter(r => r.title !== result.title);
      } else {
        return [...prev, result];
      }
    });
  };

  // Add helper function to check if a result is selected
  const isResultSelected = (result: SearchResult) => {
    return selectedResults.some(r => r.title === result.title);
  };

  // Add new function to generate report markdown
  const generateReportMarkdown = async (results: SearchResult[]) => {
    try {
      // Prepare the messages for the LLM
      const messages = results.map(result => ({
        role: "user" as const,
        content: JSON.stringify({
          title: result.title,
          university: result.university,
          description: result.description,
          patents: result.patents,
          page_url: result.page_url,
          number: result.number
        })
      }));

      // Get markdown for each technology
      const reportPromises = messages.map(async (message) => {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [prompts.reportGeneration, message]
          }),
        });

        if (!response.ok) throw new Error("Failed to generate report");
        const data = await response.json();
        return data.message;
      });

      const reports = await Promise.all(reportPromises);
      return reports.join('\n\n---\n\n'); // Add separator between technologies
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  };

  // Add function to generate and download PDF
  const generatePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      setGeneratedPDFBlob(null);

      // Generate markdown
      const markdown = await generateReportMarkdown(selectedResults);
      
      // Convert markdown to HTML
      const html = marked(markdown);

      // Create styled HTML document
      const styledHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #E9D8FD;
            }
            .logo-container {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 12px;
              margin-bottom: 20px;
            }
            .logo {
              width: 40px;
              height: 40px;
            }
            .company-name {
              font-size: 24px;
              font-weight: 600;
              color: #4B0082;
            }
            h1 { 
              color: #4B0082; 
              margin-top: 40px;
              font-size: 28px;
              padding-bottom: 8px;
              border-bottom: 2px solid #E9D8FD;
            }
            h2 { 
              color: #663399; 
              margin-top: 20px; 
              font-size: 18px;
            }
            a { color: #6B46C1; }
            hr { margin: 40px 0; border: none; border-top: 2px solid #E9D8FD; }
            ul { padding-left: 20px; }
            li { margin-bottom: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-container">
              <img 
                src="/lovable-uploads/b7a6d977-e43d-451e-8150-3eb9173e99e2.png" 
                alt="Incepta Logo" 
                class="logo"
              />
              <span class="company-name">Incepta</span>
            </div>
            <h1 style="text-align: center; color: #4B0082; margin: 0;">
              Technology Transfer Report
            </h1>
          </div>
          ${html}
        </body>
        </html>
      `;

      // Configure PDF options
      const opt = {
        margin: [15, 15],
        filename: 'technology-report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Generate PDF
      const element = document.createElement('div');
      element.innerHTML = styledHtml;
      document.body.appendChild(element);
      
      const pdf = await html2pdf().set(opt).from(element).output('blob');
      setGeneratedPDFBlob(pdf);
      
      document.body.removeChild(element);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const downloadPDF = () => {
    if (!generatedPDFBlob) return;
    
    const url = window.URL.createObjectURL(generatedPDFBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'technology-report.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    setGeneratedPDFBlob(null);
    toast({
      title: "Success",
      description: "Your PDF report has been downloaded.",
    });
  };

  if (!searchState?.query) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-200 to-purple-100 text-purple-900">
      {/* Top Header */}
      <header className="backdrop-blur-md border-b-2 border-purple-300/50 shadow-sm">
        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/lovable-uploads/b7a6d977-e43d-451e-8150-3eb9173e99e2.png"
                alt="Incepta Logo"
                className="w-7 h-7 logo-glow"
              />
              <span className="text-xl font-semibold">Incepta</span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link to="/about" className="hover:text-purple-600 transition-colors">
                About
              </Link>
              <Link to="/pricing" className="hover:text-purple-600 transition-colors">
                Pricing
              </Link>
              <Link to="/contact" className="hover:text-purple-600 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content area: left sidebar with chat, center panel with queries & results */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar: Chat flow */}
        <aside className="w-full md:w-1/3 lg:w-1/4 border-b md:border-b-0 md:border-r border-purple-200/50 flex flex-col h-[40vh] md:h-[calc(100vh-4rem)] bg-gray-50">
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-4 p-4">
                {/* Show user message first (the actual query) */}
                <div className="p-4 bg-purple-600 text-white rounded-xl max-w-[90%] ml-auto">
                  <span>{searchState.query}</span>
                </div>

                {/* Show the rest of the messages (excluding final 'result' messages) */}
                {messages
                  .filter((m) => m.type !== "result")
                  .map((message, index) => {
                    const isUser = message.type === "user";
                    const isSystem = message.type === "system";

                    // Special handling for "RESULTS_DONE" message
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
                        {/* If this message has searchQueries, render them. */}
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

                {/* Selected Results Section - Now at the bottom of chat */}
                {selectedResults.length > 0 && (
                  <div className="mt-8 bg-purple-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-purple-900">Selected Technologies ({selectedResults.length})</h3>
                      <button
                        onClick={() => setSelectedResults([])}
                        className="text-xs text-purple-600 hover:text-purple-800"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-2">
                      {selectedResults.map((result, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-3 flex items-start gap-2 group">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-purple-900 truncate">{result.title}</p>
                            <p className="text-xs text-purple-700 truncate">{result.university}</p>
                          </div>
                          <button
                            onClick={() => toggleResultSelection(result)}
                            className="text-purple-400 hover:text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={generatePDF}
                      className="w-full mt-3 bg-purple-600 text-white rounded-lg py-2 px-4 text-sm font-medium
                               hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 10v6m-3-3h6" />
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      </svg>
                      Generate Report
                    </button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Refinement form at the bottom of the sidebar */}
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

        {/* Center panel: Show unified search results */}
        <main className="flex-1 h-[60vh] md:h-[calc(100vh-4rem)] overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6 md:space-y-10 p-4 md:p-6">
              {/* Display unified results list */}
              {searchResults.length > 0 && (
                <div className="bg-white/95 p-3 md:p-4 rounded-xl shadow-lg">
                  <h2 className="font-semibold text-xl text-purple-900 mb-4 px-1">Search Results</h2>
                  <div className="space-y-8">
                    {/* Top 6 Results */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                      {searchResults.slice(0, 6).map((result, idx) => (
                        <div 
                          key={idx} 
                          className="bg-white p-4 rounded-lg flex flex-col relative
                                   border-2 border-purple-300 shadow-md
                                   hover:border-purple-400 hover:shadow-md
                                   transition-all duration-200"
                        >
                          <div 
                            className="absolute top-2 right-2 z-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleResultSelection(result);
                            }}
                          >
                            <div className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer
                                          ${isResultSelected(result) 
                                            ? 'text-yellow-400' 
                                            : 'text-gray-300 hover:text-gray-400'}`}
                            >
                              <svg 
                                className="w-5 h-5" 
                                viewBox="0 0 24 24" 
                                fill={isResultSelected(result) ? "currentColor" : "none"} 
                                stroke="currentColor" 
                                strokeWidth="2"
                              >
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                              </svg>
                            </div>
                          </div>
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => setSelectedResult(result)}
                          >
                            <p className="font-semibold text-purple-900 text-lg mb-2 line-clamp-2 pr-8">{result.title}</p>
                            <p className="text-sm text-purple-700 mb-3 font-medium">{result.university}</p>
                            <p className="text-sm text-gray-600 line-clamp-3">
                              {result.llm_teaser || result.llm_summary || result.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Divider and Additional Results */}
                    {searchResults.length > 6 && (
                      <>
                        <div className="border-t-2 border-purple-200" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                          {searchResults.slice(6).map((result, idx) => (
                            <div 
                              key={idx} 
                              className="bg-white p-4 rounded-lg flex flex-col relative
                                       border border-purple-100 shadow-sm
                                       hover:border-purple-400 hover:shadow-md
                                       transition-all duration-200"
                            >
                              <div 
                                className="absolute top-2 right-2 z-10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleResultSelection(result);
                                }}
                              >
                                <div className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer
                                              ${isResultSelected(result) 
                                                ? 'text-yellow-400' 
                                                : 'text-gray-300 hover:text-gray-400'}`}
                                >
                                  <svg 
                                    className="w-5 h-5" 
                                    viewBox="0 0 24 24" 
                                    fill={isResultSelected(result) ? "currentColor" : "none"} 
                                    stroke="currentColor" 
                                    strokeWidth="2"
                                  >
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                  </svg>
                                </div>
                              </div>
                              <div 
                                className="flex-1 cursor-pointer"
                                onClick={() => setSelectedResult(result)}
                              >
                                <p className="font-semibold text-purple-900 text-lg mb-2 line-clamp-2 pr-8">{result.title}</p>
                                <p className="text-sm text-purple-700 mb-3 font-medium">{result.university}</p>
                                <p className="text-sm text-gray-600 line-clamp-3">
                                  {result.llm_teaser || result.llm_summary || result.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Loading Indicator for searching */}
              {isSearching && (
                <div className="flex items-center justify-center space-x-2 text-purple-700 mt-10">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading search results...</span>
                </div>
              )}

              {/* Result Details Dialog */}
              <Dialog open={!!selectedResult} onOpenChange={(open) => !open && setSelectedResult(null)}>
                <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
                  {selectedResult && (
                    <>
                      <DialogHeader>
                        <div className="flex items-center justify-between pr-8">
                          <DialogTitle className="text-lg md:text-xl text-purple-900">{selectedResult.title}</DialogTitle>
                          <div 
                            className="cursor-pointer"
                            onClick={() => toggleResultSelection(selectedResult)}
                          >
                            <div className={`w-5 h-5 rounded flex items-center justify-center
                                          ${isResultSelected(selectedResult) 
                                            ? 'text-yellow-400' 
                                            : 'text-gray-300 hover:text-gray-400'}`}
                            >
                              <svg 
                                className="w-5 h-5" 
                                viewBox="0 0 24 24" 
                                fill={isResultSelected(selectedResult) ? "currentColor" : "none"} 
                                stroke="currentColor" 
                                strokeWidth="2"
                              >
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center mt-2">
                          <p className="text-xs md:text-sm text-gray-600">{selectedResult.university}</p>
                        </div>
                      </DialogHeader>
                      <div className="mt-4 md:mt-6 space-y-4 md:space-y-6">
                        <div className="prose prose-purple max-w-none">
                          <div className="space-y-4">
                            <p className="text-gray-800 whitespace-pre-wrap">
                              {selectedResult.description}
                            </p>
                          </div>
                        </div>

                        {selectedResult.patents && (
                          <div className="p-4 bg-purple-50 rounded-lg">
                            <h3 className="text-sm font-semibold text-purple-800 mb-2">Related Patents</h3>
                            <div className="bg-white rounded p-2 text-sm text-purple-700 border border-purple-100">
                              {selectedResult.patents}
                            </div>
                          </div>
                        )}

                        <div className="p-4 bg-purple-50 rounded-lg">
                          <h3 className="text-sm font-semibold text-purple-800 mb-2">Technology Details</h3>
                          <div className="flex flex-col gap-2">
                            <p className="text-sm text-gray-600">
                              Reference Number: <span className="font-medium">{selectedResult.number}</span>
                            </p>
                            {selectedResult.page_url && (
                              <a
                                href={selectedResult.page_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-purple-700 hover:text-purple-900 rounded-md transition-colors border border-purple-100"
                              >
                                <span>View Full Technology Details</span>
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Licensing Inquiry Section */}
                        <div className="mt-8 p-6 bg-purple-50 rounded-lg border-2 border-purple-100">
                          <div className="text-center">
                            <h3 className="text-lg font-semibold text-purple-900 mb-2">
                              Interested in licensing this technology?
                            </h3>
                            <p className="text-sm text-purple-700 mb-4">
                              Connect with our team to discuss licensing opportunities and learn more about this innovation.
                            </p>
                            <button
                              onClick={() => {
                                toast({
                                  title: "Contact Form",
                                  description: "The contact form feature is coming soon!",
                                });
                              }}
                              className="inline-flex items-center justify-center gap-2 px-6 py-3 
                                       bg-purple-600 text-white rounded-lg font-medium
                                       hover:bg-purple-700 transition-colors"
                            >
                              <svg 
                                className="w-5 h-5" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                              Contact Us About Licensing
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </DialogContent>
              </Dialog>

              {/* PDF Generation Dialog */}
              <Dialog open={isGeneratingPDF || !!generatedPDFBlob} onOpenChange={(open) => {
                if (!open) {
                  setGeneratedPDFBlob(null);
                  setIsGeneratingPDF(false);
                }
              }}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {isGeneratingPDF ? "Generating Report" : "Report Ready"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col items-center justify-center p-4">
                    {isGeneratingPDF ? (
                      <>
                        <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
                        <p className="text-center text-sm text-gray-600">
                          Please wait while we prepare your report...
                        </p>
                      </>
                    ) : generatedPDFBlob ? (
                      <>
                        <svg 
                          className="h-8 w-8 text-green-600 mb-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <p className="text-center text-sm text-gray-600 mb-4">
                          Your report has been generated successfully!
                        </p>
                        <button
                          onClick={downloadPDF}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 
                                   bg-purple-600 text-white rounded-lg font-medium
                                   hover:bg-purple-700 transition-colors"
                        >
                          <svg 
                            className="w-5 h-5" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          Download Report
                        </button>
                      </>
                    ) : null}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatResults;