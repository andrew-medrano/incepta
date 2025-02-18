import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Send, ArrowLeft, Search, Loader2, LayoutGrid, Network } from "lucide-react";
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

import Header from "@/components/Header";
import ChatSidebar from "@/components/chat-results/ChatSidebar";
import SearchResults from "@/components/chat-results/SearchResults";
import ResultDetailsDialog from "@/components/chat-results/ResultDetailsDialog";
import PDFGenerationDialog from "@/components/chat-results/PDFGenerationDialog";

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
    // Show user's query first
    setMessages([{ type: "user", content: query }]);
    setIsLoading(true);
    setIsSearching(true);
    
    // Show initial loading message
    setMessages((prev) => [
      ...prev,
      {
        type: "system",
        content: "Analyzing your request...",
        isSearching: true,
      },
    ]);

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
        setMessages((prev) => [
          ...prev.filter(msg => !msg.isSearching),
          { type: "system", content: chatData.message }
        ]);
        setIsSearching(false);
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
      // Clear loading state and message on error
      setMessages((prev) => prev.filter(msg => !msg.isSearching));
      setIsSearching(false);
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

    // Show user's refinement immediately
    const newMessage = { type: "user" as const, content: refinement };
    setMessages((prev) => [...prev, newMessage]);
    
    // Show loading state immediately
    setMessages((prev) => [
      ...prev,
      {
        type: "system",
        content: "Processing your refinement...",
        isSearching: true,
      },
    ]);
    
    setRefinement("");
    setIsLoading(true);
    setIsSearching(true);

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
      // Clear loading state and message on error
      setMessages((prev) => prev.filter(msg => !msg.isSearching));
      setIsSearching(false);
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
                src="/images/logo.png" 
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
      <Header />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <ChatSidebar
          messages={messages}
          refinement={refinement}
          isLoading={isLoading}
          selectedResults={selectedResults}
          setRefinement={setRefinement}
          handleRefinement={handleRefinement}
          setSelectedResults={setSelectedResults}
          generatePDF={generatePDF}
        />

        <main className="flex-1 h-[60vh] md:h-[calc(100vh-4rem)] overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6 md:space-y-10 p-4 md:p-6">
              <SearchResults
                searchResults={searchResults}
                isSearching={isSearching}
                setSelectedResult={setSelectedResult}
                toggleResultSelection={toggleResultSelection}
                isResultSelected={isResultSelected}
              />
            </div>
          </div>
        </main>
      </div>

      <ResultDetailsDialog
        selectedResult={selectedResult}
        isSelected={selectedResult ? isResultSelected(selectedResult) : false}
        onSelect={() => selectedResult && toggleResultSelection(selectedResult)}
        onOpenChange={(open) => !open && setSelectedResult(null)}
      />

      <PDFGenerationDialog
        isGeneratingPDF={isGeneratingPDF}
        generatedPDFBlob={generatedPDFBlob}
        onOpenChange={(open) => {
          if (!open) {
            setGeneratedPDFBlob(null);
            setIsGeneratingPDF(false);
          }
        }}
        onDownload={downloadPDF}
      />
    </div>
  );
};

export default ChatResults;