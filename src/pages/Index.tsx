import { useState } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Link, useNavigate } from "react-router-dom";
import { Upload, Search } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"grants" | "technology">("grants");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-200 to-purple-100 text-purple-900">
      <header className="bg-white/70 backdrop-blur-md border-b border-purple-200 sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4">
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
        </nav>
      </header>

      <div className="container mx-auto px-6 py-24 max-w-7xl">
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
              <div className="relative bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl">
                <TypeAnimation
                  sequence={typewriterSequences[mode]}
                  wrapper="div"
                  speed={50}
                  repeat={Infinity}
                  className="absolute left-8 top-8 text-gray-400 pointer-events-none text-xl"
                  style={{ 
                    display: searchQuery ? 'none' : 'block',
                    zIndex: 10
                  }}
                />
                <textarea
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder=""
                  rows={4}
                  className="w-full px-8 py-8 text-xl text-gray-800 border-0 rounded-2xl 
                            bg-transparent resize-none
                            focus:outline-none focus:ring-2 focus:ring-purple-400 
                            focus:ring-opacity-50 transition-all
                            search-input"
                />
                <div className="px-8 py-2 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <ToggleGroup
                      type="single"
                      defaultValue="grants"
                      value={mode}
                      onValueChange={(value) => value && setMode(value as "grants" | "technology")}
                      className="bg-white/50 backdrop-blur-sm p-1 rounded-lg border border-purple-200"
                    >
                      <ToggleGroupItem value="grants" className="px-4 py-1.5 rounded-md data-[state=on]:bg-purple-600 data-[state=on]:text-white text-sm">
                        Grants
                      </ToggleGroupItem>
                      <ToggleGroupItem value="technology" className="px-4 py-1.5 rounded-md data-[state=on]:bg-purple-600 data-[state=on]:text-white text-sm">
                        Technology
                      </ToggleGroupItem>
                    </ToggleGroup>
                    <label className="flex items-center space-x-2 cursor-pointer text-purple-700 hover:text-purple-800 transition-colors">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-sm">Upload file</span>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                      />
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="p-3 bg-purple-600 text-white rounded-xl
                             hover:bg-purple-700 transition-colors duration-200
                             focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <Search className="w-5 h-5" />
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
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
