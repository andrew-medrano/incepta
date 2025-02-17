import { useState } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Link, useNavigate } from "react-router-dom";
import { Upload, Search } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/components/ui/use-toast";

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-200 to-purple-100 text-purple-900">
      <header className="bg-white/70 backdrop-blur-md border-b border-purple-200 sticky top-0 z-50">
        <div className="px-5 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/b7a6d977-e43d-451e-8150-3eb9173e99e2.png" alt="Incepta Logo" className="w-6 h-6 logo-glow" />
              <span className="text-lg font-semibold">Incepta</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/" className="hover:text-purple-600 transition-colors">Home</Link>
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
            src="/lovable-uploads/b7a6d977-e43d-451e-8150-3eb9173e99e2.png"
            alt="Incepta Logo"
            className="w-24 h-24 mx-auto mb-5 logo-glow"
          />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">
            Idea to funding and technology in seconds
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
                    value="grants" 
                    className="w-[100px] px-3 py-1.5 rounded-md data-[state=on]:bg-purple-600 data-[state=on]:text-white text-sm cursor-not-allowed opacity-50"
                  >
                    Grants
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="technology" 
                    className="w-[100px] px-3 py-1.5 rounded-md data-[state=on]:bg-purple-600 data-[state=on]:text-white text-sm"
                  >
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
            className="mt-6"
          >
            <div className="text-purple-600 mb-3">Try searching for:</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(suggestion)}
                  className="px-3 py-1.5 bg-white/50 text-purple-700 rounded-lg
                           hover:bg-white/70 transition-colors duration-200 text-xs
                           backdrop-blur-sm border border-purple-300/30"
                >
                  {suggestion}
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
