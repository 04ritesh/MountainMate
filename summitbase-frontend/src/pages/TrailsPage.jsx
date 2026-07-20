import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllTrails, getTrailsByDifficulty, getTrailsByType, searchTrails } from '../api/trailApi';
import TrailCard from '../components/TrailCard';

const TrailsPage = () => {
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [type, setType] = useState('');

  const fetchTrails = async () => {
    setLoading(true);
    setError('');
    try {
      let res;
      if (search) {
        res = await searchTrails(search);
      } else if (difficulty) {
        res = await getTrailsByDifficulty(difficulty);
      } else if (type) {
        res = await getTrailsByType(type);
      } else {
        res = await getAllTrails();
      }
      setTrails(res.data);
    } catch (err) {
      setError('Failed to load trails. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrails();
  }, [difficulty, type]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTrails();
  };

  const clearFilters = () => {
    setSearch('');
    setDifficulty('');
    setType('');
  };

  return (
    <div className="min-h-screen bg-summit-light">

      {/* Header */}
      <div className="bg-summit-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Explore Trails</h1>
              <p className="text-summit-light mt-1">Discover your next adventure</p>
            </div>
            <Link
              to="/trails/create"
              className="bg-white text-summit-primary px-5 py-3 rounded-xl font-semibold hover:bg-summit-light transition"
            >
              + Add Trail
            </Link>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex space-x-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by location..."
              className="flex-1 px-4 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="bg-summit-dark px-6 py-3 rounded-xl font-semibold hover:bg-opacity-80 transition"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="text-sm font-medium text-gray-600">Filter by:</span>

          {/* Difficulty */}
          <select
            value={difficulty}
            onChange={(e) => { setDifficulty(e.target.value); setType(''); setSearch(''); }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-summit-primary bg-white"
          >
            <option value="">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MODERATE">Moderate</option>
            <option value="HARD">Hard</option>
            <option value="EXPERT">Expert</option>
          </select>

          {/* Type */}
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setDifficulty(''); setSearch(''); }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-summit-primary bg-white"
          >
            <option value="">All Types</option>
            <option value="TREKKING">🥾 Trekking</option>
            <option value="BIKING">🚵 Biking</option>
            <option value="HIKING">🏔️ Hiking</option>
            <option value="ADVENTURE">🧗 Adventure</option>
          </select>

          {(search || difficulty || type) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-red-500 hover:text-red-700 font-medium"
            >
              ✕ Clear filters
            </button>
          )}

          <span className="ml-auto text-sm text-gray-500">{trails.length} trails found</span>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : trails.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl">🏔️</span>
            <p className="mt-4 text-gray-500 text-lg">No trails found</p>
            <Link to="/trails/create" className="mt-4 inline-block text-summit-primary font-semibold hover:underline">
              Be the first to add one!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trails.map((trail) => (
              <TrailCard key={trail.id} trail={trail} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrailsPage;