import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <nav className="bg-summit-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">⛰️</span>
            <span className="text-white font-bold text-xl">SummitBase</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-white text-sm">Hey, {user.name}</span>
                <Link to="/trails" className="text-white hover:text-summit-light text-sm">
                  Trails
                </Link>
                <Link to="/trips" className="text-white hover:text-summit-light text-sm">
                  Trips
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white text-summit-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-summit-light transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-summit-light text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-summit-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-summit-light transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;