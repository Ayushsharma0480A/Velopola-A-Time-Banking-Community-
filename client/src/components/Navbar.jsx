import { Link, useNavigate } from 'react-router-dom';
import { Leaf, LogOut } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')); // Check for logged-in user

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload(); // Refresh to clear Nav state
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 text-forest font-bold text-2xl">
        <Leaf className="fill-forest" /> Velopola
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <span className="text-gray-600 font-medium">Hello, {user.name}</span>
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-xl transition">
              <LogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <div className="gap-4 flex">
            <Link to="/login" className="text-gray-600 font-bold hover:text-forest">Login</Link>
            <Link to="/register" className="bg-forest text-white px-6 py-2 rounded-xl font-bold hover:bg-moss transition">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;