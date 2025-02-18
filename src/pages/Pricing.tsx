import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-200 to-purple-100 text-purple-900">
      <header className="backdrop-blur-md border-b border-purple-200/50 sticky top-0 z-50">
        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/images/logo.png" alt="Incepta Logo" className="w-7 h-7 logo-glow" />
              <span className="text-xl font-semibold">Incepta</span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link to="/about" className="hover:text-purple-600 transition-colors">About</Link>
              <Link to="/pricing" className="text-purple-600 transition-colors">Pricing</Link>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-lg text-purple-600 max-w-2xl mx-auto">
            Choose the plan that best fits your research and innovation needs
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8"
        >
          {/* Starter Plan */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Starter</h2>
              <div className="text-3xl font-bold mb-2">$49<span className="text-lg font-normal text-purple-600">/mo</span></div>
              <p className="text-purple-600">Perfect for individual researchers</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-purple-600" />
                <span>100 searches per month</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-purple-600" />
                <span>Basic analytics</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-purple-600" />
                <span>Email support</span>
              </li>
            </ul>
            <button className="w-full py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors">
              Get Started
            </button>
          </div>

          {/* Professional Plan */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm">Most Popular</span>
            </div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Professional</h2>
              <div className="text-3xl font-bold mb-2">$99<span className="text-lg font-normal text-purple-600">/mo</span></div>
              <p className="text-purple-600">For research teams and organizations</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-purple-600" />
                <span>Unlimited searches</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-purple-600" />
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-purple-600" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-purple-600" />
                <span>Team collaboration</span>
              </li>
            </ul>
            <button className="w-full py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors">
              Get Started
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Enterprise</h2>
              <div className="text-3xl font-bold mb-2">Custom</div>
              <p className="text-purple-600">For large institutions</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-purple-600" />
                <span>Everything in Professional</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-purple-600" />
                <span>Custom integrations</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-purple-600" />
                <span>Dedicated account manager</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-purple-600" />
                <span>SLA guarantee</span>
              </li>
            </ul>
            <button className="w-full py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors">
              Contact Sales
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing; 