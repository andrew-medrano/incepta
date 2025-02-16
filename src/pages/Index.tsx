
import { useState } from "react";
import { motion } from "framer-motion";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Will implement search functionality in next iteration
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <img 
            src="/lovable-uploads/b7a6d977-e43d-451e-8150-3eb9173e99e2.png"
            alt="Incepta Logo"
            className="w-24 h-24 mx-auto mb-8"
          />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Welcome to Incepta
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover government grants and university IP through our intelligent search platform
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
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for grants or university IP..."
                className="w-full px-6 py-4 text-lg border-2 border-purple-200 rounded-xl 
                          bg-white bg-opacity-80 backdrop-blur-sm shadow-lg
                          focus:outline-none focus:border-purple-400 focus:ring-2 
                          focus:ring-purple-400 focus:ring-opacity-50 transition-all
                          search-input"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2
                         px-6 py-2 bg-purple-600 text-white rounded-lg
                         hover:bg-purple-700 transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-purple-400 
                         focus:ring-opacity-50"
              >
                Search
              </button>
            </div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center text-gray-500"
          >
            <p>Try searching for "renewable energy grants" or "biotechnology patents"</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
