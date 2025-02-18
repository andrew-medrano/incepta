import { useState } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Link, useNavigate } from "react-router-dom";
import { Upload, Search } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/components/ui/use-toast";

interface Suggestion {
  display: string;
  query: string;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"grants" | "technology">("technology");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    navigate('/chat', { 
      state: { 
        query: searchQuery,
        file: selectedFile,
        mode: mode
      } 
    });
  };

  const handleModeChange = (value: string | undefined) => {
    if (value === "grants") {
      toast({
        title: "Coming Soon",
        description: "Grants search is currently under development.",
        duration: 3000,
      });
      return;
    }
    if (value) {
      setMode(value as "grants" | "technology");
    }
  };

  const handleFileUploadClick = () => {
    toast({
      title: "Coming Soon",
      description: "File upload functionality is currently under development.",
      duration: 3000,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep empty to prevent any file handling
  };

  const grantSuggestions: Suggestion[] = [
    {
      display: "Renewable energy grants",
      query: "Find available research grants and funding opportunities for renewable energy projects, specifically in solar and wind power technologies"
    },
    {
      display: "Biotech research funding",
      query: "Search for biotechnology research grants and funding programs focused on medical innovations and drug development"
    },
    {
      display: "AI development grants",
      query: "Locate funding opportunities for artificial intelligence research and development projects, including machine learning applications"
    },
    {
      display: "Smart city project funding",
      query: "Find government and private sector grants for smart city initiatives, focusing on IoT and urban infrastructure development"
    }
  ];

  const techSuggestions: Suggestion[] = [
    {
      display: "University patents in AI",
      query: "Search for university-owned patents related to artificial intelligence, machine learning, and neural networks in the last 5 years"
    },
    {
      display: "Quantum computing innovations",
      query: "Find recent technological breakthroughs and patent applications in quantum computing hardware and quantum algorithms"
    },
    {
      display: "Biotech breakthroughs",
      query: "Discover recent biotechnology innovations and patents in gene editing, therapeutic proteins, and synthetic biology"
    },
    {
      display: "Green energy technologies",
      query: "Search for emerging patents and technologies in renewable energy storage, solar efficiency, and sustainable power generation"
    }
  ];

  const suggestions = mode === "grants" ? grantSuggestions : techSuggestions;

  const typewriterSequences = {
    grants: [
      "Ask Incepta to find research grants in renewable energy...",
      2000,
      "Ask Incepta to discover funding for AI development...",
      2000,
      "Ask Incepta to explore biotech research grants...",
      2000,
      "Ask Incepta to find smart city project funding...",
      2000
    ],
    technology: [
      "Ask Incepta to find AI patents in healthcare...",
      2000,
      "Ask Incepta to explore quantum computing innovations...",
      2000,
      "Ask Incepta to discover new biotech patents...",
      2000,
      "Ask Incepta to analyze emerging technologies...",
      2000
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-200 to-purple-100 text-purple-900">
      <header className="backdrop-blur-md border-b border-purple-200/50 sticky top-0 z-50">
        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/images/logo.png" alt="Incepta Logo" className="w-7 h-7 logo-glow" />
              <span className="text-xl font-semibold">Incepta</span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link to="/about" className="hover:text-purple-600 transition-colors">About</Link>
              <Link to="/pricing" className="hover:text-purple-600 transition-colors">Pricing</Link>
              <Link to="/contact" className="hover:text-purple-600 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="px-5 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <img 
            src="/images/logo.png"
            alt="Incepta Logo"
            className="w-24 h-24 mx-auto mb-5 logo-glow"
          />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">
            Find funding and technology in seconds
          </h1>
          <p className="text-lg md:text-xl text-purple-600 max-w-2xl mx-auto">
            Unlocking Innovation Through Intelligent Search
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <form onSubmit={handleSearch} className="relative">
            <div className="relative group">
              <div className="flex justify-center mb-3">
                <ToggleGroup
                  type="single"
                  defaultValue="technology"
                  value={mode}
                  onValueChange={handleModeChange}
                  className="bg-white/50 backdrop-blur-sm p-0.5 rounded-lg border border-purple-200"
                >
                  <ToggleGroupItem 
                    value="technology" 
                    className="w-[100px] px-3 py-1.5 rounded-md data-[state=on]:bg-purple-600 data-[state=on]:text-white text-sm"
                  >
                    Technology
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="grants" 
                    className="w-[100px] px-3 py-1.5 rounded-md data-[state=on]:bg-purple-600 data-[state=on]:text-white text-sm cursor-not-allowed opacity-50"
                  >
                    Grants
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="relative bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl">
                {searchQuery.length === 0 && (
                  <TypeAnimation
                    sequence={typewriterSequences[mode]}
                    wrapper="div"
                    speed={50}
                    repeat={Infinity}
                    className="absolute left-4 top-4 text-gray-400 pointer-events-none text-lg"
                  />
                )}
                <textarea
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder=""
                  rows={3}
                  className="w-full px-4 py-4 text-lg text-gray-800 border-0 rounded-2xl 
                            bg-transparent resize-none
                            focus:outline-none focus:ring-0
                            transition-all
                            search-input"
                />
                <div className="px-8 pb-2 pt-0 flex items-center justify-between">
                  <button
                    onClick={handleFileUploadClick}
                    type="button"
                    className="flex items-center space-x-2 text-purple-700/50 hover:text-purple-800/50 transition-colors cursor-not-allowed"
                  >
                    <div className="p-1.5 bg-purple-100/50 rounded-lg">
                      <Upload className="w-4 h-4" />
                    </div>
                    <span className="text-sm">Upload file</span>
                  </button>
                  <button
                    type="submit"
                    disabled={!searchQuery.trim()}
                    className={`px-6 py-2 rounded-xl transition-colors duration-200
                             flex items-center space-x-2
                             focus:outline-none focus:ring-2 focus:ring-purple-400
                             ${searchQuery.trim() 
                               ? 'bg-purple-600 text-white hover:bg-purple-700' 
                               : 'bg-purple-300 text-white cursor-not-allowed'}`}
                  >
                    <Search className="w-4 h-4" />
                    <span className="text-sm font-medium">Search</span>
                  </button>
                </div>
              </div>
            </div>
            {selectedFile && (
              <div className="mt-4 text-sm text-purple-600">
                <div>Document: {selectedFile.name}</div>
              </div>
            )}
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6"
          >
            <div className="text-purple-600 mb-3">Try searching for:</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(suggestion.query)}
                  className="px-3 py-1.5 bg-white/50 text-purple-700 rounded-lg
                           hover:bg-white/70 transition-colors duration-200 text-xs
                           backdrop-blur-sm border border-purple-300/30"
                >
                  {suggestion.display}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
