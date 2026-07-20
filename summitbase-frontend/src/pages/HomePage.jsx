import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-summit-light">

      {/* Hero */}
      <div className="bg-summit-primary text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Conquer Every Summit
          </h1>
          <p className="text-xl text-summit-light mb-10 max-w-2xl mx-auto">
            Discover trekking routes, plan group adventures, and connect with
            fellow explorers on SummitBase — your ultimate adventure companion.
          </p>

          {user ? (
            <Link
              to="/trails"
              className="bg-white text-summit-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-summit-light transition"
            >
              Explore Trails →
            </Link>
          ) : (
            <div className="flex justify-center space-x-4">
              <Link
                to="/register"
                className="bg-white text-summit-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-summit-light transition"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-summit-dark transition"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-summit-dark text-center mb-12">
          Everything for Your Adventure
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🗺️', title: 'Discover Trails', desc: 'Browse hundreds of trekking and biking routes with GPS, difficulty ratings, and elevation data.' },
            { icon: '👥', title: 'Plan Group Trips', desc: 'Create group adventures, invite friends, manage RSVPs, and coordinate meetup points.' },
            { icon: '📸', title: 'Share Experiences', desc: 'Upload trail photos, follow other adventurers, and build your trekking portfolio.' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <span className="text-5xl">{f.icon}</span>
              <h3 className="text-xl font-bold text-summit-dark mt-4 mb-3">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;