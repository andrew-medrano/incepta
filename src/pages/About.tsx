import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-200 to-purple-100 text-purple-900">
      <header className="backdrop-blur-md border-b border-purple-200/50 sticky top-0 z-50">
        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/lovable-uploads/b7a6d977-e43d-451e-8150-3eb9173e99e2.png" alt="Incepta Logo" className="w-7 h-7 logo-glow" />
              <span className="text-xl font-semibold">Incepta</span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link to="/about" className="text-purple-600 transition-colors">About</Link>
              <Link to="/pricing" className="hover:text-purple-600 transition-colors">Pricing</Link>
              <Link to="/contact" className="hover:text-purple-600 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <img
            src="/lovable-uploads/b7a6d977-e43d-451e-8150-3eb9173e99e2.png"
            alt="Incepta Logo"
            className="w-24 h-24 mx-auto mb-5 logo-glow"
          />
          <h1 className="text-4xl font-bold mb-4">About Incepta</h1>
          <p className="text-lg text-purple-700">
            Revolutionizing research and innovation through intelligent search
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-purple mx-auto"
        >
          <p className="text-lg mb-6">
            Incepta is a cutting-edge search platform designed to bridge the gap between researchers, 
            innovators, and funding opportunities. Our advanced AI-powered search technology helps you 
            discover relevant grants, patents, and research opportunities in seconds.
          </p>
          
          <p className="text-lg">
            Whether you're a researcher seeking funding, an innovator exploring patents, 
            or an organization looking to support groundbreaking projects, Incepta provides 
            the tools and insights you need to make informed decisions and accelerate innovation.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About; 