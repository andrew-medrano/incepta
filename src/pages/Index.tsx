
import { useState } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Link } from "react-router-dom";
import { Upload, Search } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    console.log("Attached file:", selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const suggestions = [
    "University patents in AI",
    "Renewable energy grants",
    "Biotech research funding",
    "Smart city projects"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-800 text-white">
      {/* Header Navigation */}
      <header className="bg-purple-900/50 backdrop-blur-md border-b border-purple-700/50 sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/b7a6d977-e43d-451e-8150-3eb9173e99e2.png"
                alt="Incepta Logo"
                className="w-8 h-8"
              />
              <span className="text-xl font-semibold">Incepta</span>
            </div>
            <div className="flex items-center space-x-8">
              <Link to="/" className="hover:text-purple-200 transition-colors">Home</Link>
              <Link to="/about" className="hover:text-purple-200 transition-colors">About</Link>
              <Link to="/pricing" className="hover:text-purple-200 transition-colors">Pricing</Link>
              <Link to="/contact" className="hover:text-purple-200 transition-colors">Contact</Link>
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
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
            Welcome to Incepta
          </h1>
          <div className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto h-20">
            <TypeAnimation
              sequence={[
                "Discover groundbreaking university patents...",
                2000,
                "Find relevant government grants...",
                2000,
                "Access cutting-edge research...",
                2000
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <form onSubmit={handleSearch} className="relative">
            <div className="relative group mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask Incepta to search for grants or university IP..."
                className="w-full px-8 py-6 text-xl text-gray-800 border-0 rounded-2xl 
                          bg-white/90 backdrop-blur-sm shadow-2xl
                          focus:outline-none focus:ring-2 focus:ring-purple-400 
                          focus:ring-opacity-50 transition-all
                          search-input"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                <label className="cursor-pointer p-3 bg-purple-100 text-purple-700 rounded-xl
                                hover:bg-purple-200 transition-colors duration-200">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                  />
                  <Upload className="w-5 h-5" />
                </label>
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
            {selectedFile && (
              <div className="mb-4 text-sm text-purple-200">
                Attached: {selectedFile.name}
              </div>
            )}
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <div className="text-purple-300 mb-4">Try searching for:</div>
            <div className="flex flex-wrap gap-3">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(suggestion)}
                  className="px-4 py-2 bg-purple-700/50 text-purple-100 rounded-xl
                           hover:bg-purple-600/50 transition-colors duration-200 text-sm
                           backdrop-blur-sm border border-purple-600/30"
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
