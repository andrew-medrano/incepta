
import { useState } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Link, useNavigate } from "react-router-dom";
import { Upload, Search, Image } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/chat', { 
      state: { 
        query: searchQuery,
        file: selectedFile,
        image: selectedImage
      } 
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.accept.includes('image')) {
        setSelectedImage(e.target.files[0]);
      } else {
        setSelectedFile(e.target.files[0]);
      }
    }
  };

  const suggestions = [
    "University patents in AI",
    "Renewable energy grants",
    "Biotech research funding",
    "Smart city projects"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-200 to-purple-100 text-purple-900">
      <header className="bg-white/70 backdrop-blur-md border-b border-purple-200 sticky top-0 z-50">
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
            Welcome to Incepta
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
            <div className="relative group mb-4">
              <div className="relative">
                <TypeAnimation
                  sequence={[
                    "Ask Incepta to find AI patents in healthcare...",
                    2000,
                    "Ask Incepta to discover green energy research grants...",
                    2000,
                    "Ask Incepta to analyze biotech funding opportunities...",
                    2000,
                    "Ask Incepta to explore quantum computing innovations...",
                    2000
                  ]}
                  wrapper="div"
                  speed={50}
                  repeat={Infinity}
                  className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  style={{ display: searchQuery ? 'none' : 'block' }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-8 py-8 text-xl text-gray-800 border-0 rounded-2xl 
                            bg-white/90 backdrop-blur-sm shadow-2xl
                            focus:outline-none focus:ring-2 focus:ring-purple-400 
                            focus:ring-opacity-50 transition-all
                            search-input"
                />
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                <label className="cursor-pointer p-3 bg-purple-100 text-purple-700 rounded-xl
                                hover:bg-purple-200 transition-colors duration-200">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <Image className="w-5 h-5" />
                </label>
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
            {(selectedFile || selectedImage) && (
              <div className="mb-4 text-sm text-purple-600">
                {selectedFile && <div>Document: {selectedFile.name}</div>}
                {selectedImage && <div>Image: {selectedImage.name}</div>}
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
