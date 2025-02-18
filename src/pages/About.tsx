import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-200 to-purple-100 text-purple-900">
      <header className="backdrop-blur-md border-b border-purple-200/50 sticky top-0 z-50">
        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/lovable-uploads/b7a6d977-e43d-451e-8150-3eb9173e99e2.png" alt="Incepta Logo" className="w-7 h-7 logo-glow" />
              <span className="text-xl font-semibold">Incepta</span>
            </div>
            <div className="flex items-center space-x-8">
              <Link to="/about" className="text-purple-600 transition-colors">About</Link>
              <Link to="/pricing" className="hover:text-purple-600 transition-colors">Pricing</Link>
              <Link to="/contact" className="hover:text-purple-600 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="px-5 py-12 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Incepta</h1>
            <p className="text-lg text-purple-600">Revolutionizing Research and Innovation Discovery</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-purple-800 leading-relaxed mb-6">
              At Incepta, we're dedicated to bridging the gap between innovators and opportunities. Our AI-powered platform 
              transforms the way researchers, entrepreneurs, and organizations discover funding opportunities and breakthrough technologies.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">What Sets Us Apart</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xl font-medium text-purple-700">Advanced AI Technology</h3>
                <p className="text-purple-800">Our sophisticated AI algorithms understand context and nuance, delivering highly relevant results.</p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-medium text-purple-700">Comprehensive Database</h3>
                <p className="text-purple-800">Access to millions of grants, patents, and research papers from around the world.</p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-medium text-purple-700">Real-Time Updates</h3>
                <p className="text-purple-800">Stay ahead with constant updates on new opportunities and technological developments.</p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-medium text-purple-700">Expert Support</h3>
                <p className="text-purple-800">Our team of research specialists is always ready to assist you in your journey.</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">Our Impact</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-600">$2.5B+</div>
                <div className="text-purple-800">Grants Discovered</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-600">50K+</div>
                <div className="text-purple-800">Researchers Supported</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-600">1M+</div>
                <div className="text-purple-800">Patents Analyzed</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About; 