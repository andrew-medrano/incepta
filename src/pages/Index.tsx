import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Link, useNavigate } from "react-router-dom";
import { Upload, Search, Clock } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface PreviousQuery {
  query: string;
  timestamp: number;
  mode: "grants" | "technology";
}

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"grants" | "technology">("grants");
  const [previousQueries, setPreviousQueries] = useState<PreviousQuery[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('previousQueries');
    if (stored) {
      setPreviousQueries(JSON.parse(stored));
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const newQuery = {
      query: searchQuery.trim(),
      timestamp: Date.now(),
      mode
    };

    const updatedQueries = [newQuery, ...previousQueries].slice(0, 8);
    localStorage.setItem('previousQueries', JSON.stringify(updatedQueries));
    setPreviousQueries(updatedQueries);
    
    navigate('/chat', { 
      state: { 
        query: searchQuery,
        file: selectedFile,
        mode: mode
      } 
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const grantSuggestions = [
    "Renewable energy grants",
    "Biotech research funding",
    "AI development grants",
    "Smart city project funding"
  ];

  const techSuggestions = [
    "University patents in AI",
    "Quantum computing innovations",
    "Biotech breakthroughs",
    "Green energy technologies"
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

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'less than a minute ago';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-200 to-purple-100 text-purple-900">
      <header className="bg-white/70 backdrop-blur-md border-b border-purple-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/lovable-uploads/b7a6d977-e43d-451e-8150-3eb9173e99e2.png" alt="Incepta Logo" className="w-8 h-8" />
              <span className="text-xl font-semibold">Incepta</span>
            </div>
            <div className="flex items-center space-x-8">
              <Link to="/" className="hover:text-purple-600 transition-colors">Home</Link>
              <Link to="/about" className="hover:text-purple-600 transition-colors">About</Link>
              <Link to="/pricing" className="hover:text-purple-600 transition-colors">Pricing</Link>
              <Link to="/contact" className="hover:text-purple-600 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <img 
            src="/lovable-uploads/b7a6d977-e43d-451e-8150-3eb9173e99e2.png"
            alt="Incepta Logo"
            className="w-32 h-32 mx-auto mb-8"
          />
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            Idea to funding and technology in seconds
          </h1>
          <p className="text-xl md:text-2xl text-purple-600 max-w-3xl mx-auto">
            Unlocking Innovation Through Intelligent Search
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <form onSubmit={handleSearch} className="relative">
            <div className="relative group">
              <div className="flex justify-center mb-4">
                <ToggleGroup
                  type="single"
                  defaultValue="grants"
                  value={mode}
                  onValueChange={(value) => value && setMode(value as "grants" | "technology")}
                  className="bg-white/50 backdrop-blur-sm p-0.5 rounded-lg border border-purple-200"
                >
                  <ToggleGroupItem value="grants" className="w-[100px] px-4 py-1 rounded-md data-[state=on]:bg-purple-600 data-[state=on]:text-white text-sm">
                    Grants
                  </ToggleGroupItem>
                  <ToggleGroupItem value="technology" className="w-[100px] px-4 py-1 rounded-md data-[state=on]:bg-purple-600 data-[state=on]:text-white text-sm">
                    Technology
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
                    className="absolute left-8 top-8 text-gray-400 pointer-events-none text-xl"
                  />
                )}
                <textarea
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder=""
                  rows={4}
                  className="w-full px-8 py-8 text-xl text-gray-800 border-0 rounded-2xl 
                            bg-transparent resize-none
                            focus:outline-none focus:ring-0
                            transition-all
                            search-input"
                />
                <div className="px-8 pb-2 pt-0 flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer text-purple-700 hover:text-purple-800 transition-colors">
                    <div className="p-1.5 bg-purple-100 rounded-lg">
                      <Upload className="w-4 h-4" />
                    </div>
                    <span className="text-sm">Upload file</span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                    />
                  </label>
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
            className="mt-8"
          >
            <div className="text-purple-600 mb-4">Try searching for:</div>
            <div className="flex flex-wrap gap-3">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(suggestion)}
                  className="px-4 py-2 bg-white/50 text-purple-700 rounded-xl
                           hover:bg-white/70 transition-colors duration-200 text-sm
                           backdrop-blur-sm border border-purple-300/30"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>

          {previousQueries.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-16"
            >
              <div className="flex items-center space-x-2 text-purple-600 mb-6">
                <Clock className="w-4 h-4" />
                <span>Previous searches</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {previousQueries.map((query, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm 
                             hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSearchQuery(query.query);
                      setMode(query.mode);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-purple-900 font-medium truncate">{query.query}</p>
                        <p className="text-sm text-purple-500 mt-1">{formatTimeAgo(query.timestamp)}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        query.mode === 'grants' 
                          ? 'bg-purple-100 text-purple-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {query.mode}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
