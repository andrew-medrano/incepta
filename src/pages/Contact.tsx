import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";

const Contact = () => {
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
              <Link to="/about" className="hover:text-purple-600 transition-colors">About</Link>
              <Link to="/pricing" className="hover:text-purple-600 transition-colors">Pricing</Link>
              <Link to="/contact" className="text-purple-600 transition-colors">Contact</Link>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="text-lg text-purple-600 max-w-2xl mx-auto">
            Have questions? We're here to help you find the perfect solution for your needs
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8"
        >
          {/* Contact Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <textarea
                  className="w-full px-4 py-2 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 h-32 resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-purple-600">support@incepta.ai</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-purple-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-medium">Office</h3>
                    <p className="text-purple-600">123 Innovation Drive<br />San Francisco, CA 94105</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <div className="flex items-start space-x-4">
                <MessageSquare className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-medium mb-2">Live Chat Support</h3>
                  <p className="text-purple-600 mb-4">Our team is available Monday through Friday, 9am-6pm PT</p>
                  <button className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                    Start Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact; 