import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="backdrop-blur-md border-b-2 border-purple-300/50 shadow-sm">
      <div className="px-5 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/images/logo.png"
              alt="Incepta Logo"
              className="w-7 h-7 logo-glow"
            />
            <span className="text-xl font-semibold">Incepta</span>
          </Link>
          <div className="flex items-center space-x-8">
            <Link to="/about" className="hover:text-purple-600 transition-colors">
              About
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 