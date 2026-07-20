import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllTrips, getMyTrips } from '../api/tripApi';
import TripCard from '../components/TripCard';
import { useAuth } from '../context/AuthContext';

const TripsPage = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const fetchTrips = async (tab) => {
    setLoading(true);
    setError('');
    try {
      const res = tab === 'my' ? await getMyTrips() : await getAllTrips();
      setTrips(res.data);
    } catch {
      setError('Failed to load trips.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips(activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-summit-light">

      {/* Header */}
      <div className="bg-summit-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Group Trips</h1>
              <p className="text-summit-light mt-1">Find your next adventure crew</p>
            </div>
            <Link
              to="/trips/create"
              className="bg-white text-summit-primary px-5 py-3 rounded-xl font-semibold hover:bg-summit-light transition"
            >
              + Plan Trip
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2">
            {['all', 'my'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg font-medium text-sm transition ${
                  activeTab === tab
                    ? 'bg-white text-summit-primary'
                    : 'text-white hover:bg-summit-dark'
                }`}
              >
                {tab === 'all' ? '🌍 All Trips' : '👤 My Trips'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl">🏕️</span>
            <p className="mt-4 text-gray-500 text-lg">No trips found</p>
            <Link
              to="/trips/create"
              className="mt-4 inline-block text-summit-primary font-semibold hover:underline"
            >
              Plan the first one!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripsPage;