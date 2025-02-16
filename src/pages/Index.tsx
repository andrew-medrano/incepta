
import { useState } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Link } from "react-router-dom";
import { Upload } from "lucide-react";

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
    "University research patents in AI",
    "Clean energy government grants",
    "Biotechnology innovation funding",
    "Smart city infrastructure projects"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header Navigation */}
      <header className="bg-white/70 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/b7a6d977-e43d-451e-8150-3eb9173e99e2.png"
                alt="Incepta Logo"
                className="w-8 h-8"
              />
              <span className="text-xl font-semibold text-purple-900">Incepta</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-purple-900 hover:text-purple-700 transition-colors">Home</Link>
              <Link to="/about" className="text-purple-900 hover:text-purple-700 transition-colors">About</Link>
              <Link to="/pricing" className="text-purple-900 hover:text-purple-700 transition-colors">Pricing</Link>
              <Link to="/contact" className="text-purple-900 hover:text-purple-700 transition-colors">Contact</Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-purple-900 mb-8">
            Welcome to Incepta
          </h1>
          <div className="text-xl md:text-2xl text-purple-700 max-w-3xl mx-auto h-20">
            <TypeAnimation
              sequence={[
                'Discover groundbreaking university patents...',
                2000,
                'Find relevant government grants...',
                2000,
                'Access cutting-edge research...',
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
                placeholder="Search for grants, patents, or research..."
                className="w-full px-8 py-6 text-xl border-2 border-purple-200 rounded-2xl 
                          bg-white/80 backdrop-blur-sm shadow-lg
                          focus:outline-none focus:border-purple-400 focus:ring-2 
                          focus:ring-purple-400 focus:ring-opacity-50 transition-all
                          search-input"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                <label className="cursor-pointer px-4 py-2 bg-purple-100 text-purple-700 rounded-lg
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
                  className="px-8 py-2 bg-purple-600 text-white rounded-lg
                           hover:bg-purple-700 transition-colors duration-200
                           focus:outline-none focus:ring-2 focus:ring-purple-400 
                           focus:ring-opacity-50 text-lg"
                >
                  Search
                </button>
              </div>
            </div>
            {selectedFile && (
              <div className="mb-4 text-sm text-purple-600">
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
            <div className="text-gray-500 mb-4">Popular searches:</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(suggestion)}
                  className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full
                           hover:bg-purple-100 transition-colors duration-200 text-sm"
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
