import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Menu, X, User, Map, LogOut, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "text-forest bg-green-50" : "text-gray-600 hover:text-forest hover:bg-green-50";

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-sand/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-forest p-2 rounded-lg text-cream">
                <Leaf size={24} />
              </div>
              <span className="text-2xl font-bold text-forest tracking-tight">Velopola</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/find" className={`px-4 py-2 rounded-lg font-medium transition ${isActive('/find')}`}>Find Skills</Link>
                <Link to="/map" className={`px-4 py-2 rounded-lg font-medium transition ${isActive('/map')}`}>Map</Link>
                <Link to="/dashboard" className={`px-4 py-2 rounded-lg font-medium transition ${isActive('/dashboard')}`}>Dashboard</Link>
                <div className="h-6 w-px bg-gray-200 mx-2"></div>
                <div className="flex items-center gap-3 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                  <Wallet size={16} className="text-forest" />
                  <span className="font-bold text-forest">{user.credits} Hrs</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-gray-500 hover:text-red-600 transition"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-forest font-medium hover:text-moss px-4">Log in</Link>
                <Link to="/register" className="bg-forest text-white px-5 py-2.5 rounded-full font-bold hover:bg-moss transition shadow-lg shadow-green-900/20">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-forest p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-sand/30 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-forest hover:bg-green-50">Dashboard</Link>
                  <Link to="/find" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-gray-600 hover:bg-green-50">Find Skills</Link>
                  <Link to="/map" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-gray-600 hover:bg-green-50">Community Map</Link>
                  <button onClick={onLogout} className="w-full text-left px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50">Log out</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-50">Log in</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium bg-forest text-white">Sign up</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-white border-t border-sand/30 py-12 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-forest p-1.5 rounded text-cream">
              <Leaf size={20} />
            </div>
            <span className="text-xl font-bold text-forest">Velopola</span>
          </div>
          <p className="text-gray-500 max-w-xs leading-relaxed">
            A time-banking community where skills are the currency. Trade 1 hour of coding for 1 hour of guitar lessons.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-forest mb-4">Platform</h3>
          <ul className="space-y-2 text-gray-500">
            <li><Link to="/find" className="hover:text-moss transition">Find Skills</Link></li>
            <li><Link to="/map" className="hover:text-moss transition">Community Map</Link></li>
            <li><Link to="/how-it-works" className="hover:text-moss transition">How it Works</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-forest mb-4">Legal</h3>
          <ul className="space-y-2 text-gray-500">
            <li><a href="#" className="hover:text-moss transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-moss transition">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100 mt-12 pt-8 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Velopola Inc. All rights reserved.
      </div>
    </div>
  </footer>
);

const Layout = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream/30 font-sans text-gray-900">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;