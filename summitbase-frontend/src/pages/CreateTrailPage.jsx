import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTrail } from '../api/trailApi';

const CreateTrailPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    distanceKm: '',
    elevationGainM: '',
    estimatedDurationMinutes: '',
    difficulty: 'MODERATE',
    trailType: 'TREKKING',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...form,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        distanceKm: form.distanceKm ? parseFloat(form.distanceKm) : null,
        elevationGainM: form.elevationGainM ? parseFloat(form.elevationGainM) : null,
        estimatedDurationMinutes: form.estimatedDurationMinutes
          ? parseInt(form.estimatedDurationMinutes)
          : null,
      };

      const res = await createTrail(payload);
      navigate(`/trails/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create trail.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-summit-light py-10">
      <div className="max-w-2xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/trails')}
            className="text-summit-primary hover:underline text-sm mb-4 flex items-center"
          >
            ← Back to Trails
          </button>
          <h1 className="text-3xl font-bold text-summit-dark">Add New Trail</h1>
          <p className="text-gray-600 mt-1">Share your favourite route with the community</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trail Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Everest Base Camp Trek"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-summit-primary transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the trail experience..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-summit-primary transition resize-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Solukhumbu, Nepal"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-summit-primary transition"
              />
            </div>

            {/* GPS */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input
                  type="number"
                  name="latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  placeholder="27.9881"
                  step="any"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-summit-primary transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input
                  type="number"
                  name="longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  placeholder="86.9250"
                  step="any"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-summit-primary transition"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
                <input
                  type="number"
                  name="distanceKm"
                  value={form.distanceKm}
                  onChange={handleChange}
                  placeholder="130"
                  step="any"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-summit-primary transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Elevation (m)</label>
                <input
                  type="number"
                  name="elevationGainM"
                  value={form.elevationGainM}
                  onChange={handleChange}
                  placeholder="3500"
                  step="any"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-summit-primary transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                <input
                  type="number"
                  name="estimatedDurationMinutes"
                  value={form.estimatedDurationMinutes}
                  onChange={handleChange}
                  placeholder="8640"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-summit-primary transition"
                />
              </div>
            </div>

            {/* Difficulty + Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty *</label>
                <select
                  name="difficulty"
                  value={form.difficulty}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-summit-primary bg-white transition"
                >
                  <option value="EASY">Easy</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="HARD">Hard</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trail Type *</label>
                <select
                  name="trailType"
                  value={form.trailType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-summit-primary bg-white transition"
                >
                  <option value="TREKKING">🥾 Trekking</option>
                  <option value="BIKING">🚵 Biking</option>
                  <option value="HIKING">🏔️ Hiking</option>
                  <option value="ADVENTURE">🧗 Adventure</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 pt-2">
              <button
                type="button"
                onClick={() => navigate('/trails')}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-summit-primary text-white py-3 rounded-lg font-semibold hover:bg-summit-dark transition disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Trail'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTrailPage;