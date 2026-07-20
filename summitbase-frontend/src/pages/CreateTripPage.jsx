import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createTrip } from '../api/tripApi';

const CreateTripPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // pre-filled if coming from trail detail page
  const prefilledTrailId = location.state?.trailId || '';
  const prefilledTrailName = location.state?.trailName || '';

  const [form, setForm] = useState({
    name: '',
    description: '',
    trailId: prefilledTrailId,
    startDate: '',
    endDate: '',
    meetingPoint: '',
    maxMembers: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        maxMembers: form.maxMembers ? parseInt(form.maxMembers) : null,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      };

      const res = await createTrip(payload);
      navigate(`/trips/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create trip.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-summit-light py-10">
      <div className="max-w-2xl mx-auto px-4">

        <div className="mb-8">
          <button
            onClick={() => navigate('/trips')}
            className="text-summit-primary hover:underline text-sm mb-4 flex items-center"
          >
            ← Back to Trips
          </button>
          <h1 className="text-3xl font-bold text-summit-dark">Plan a Group Trip</h1>
          <p className="text-gray-600 mt-1">Organise an adventure and invite your crew</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Trail pre-fill notice */}
          {prefilledTrailName && (
            <div className="bg-summit-light border border-summit-secondary text-summit-dark px-4 py-3 rounded-lg mb-6 text-sm">
              🥾 Planning trip on: <strong>{prefilledTrailName}</strong>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Trip Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trip Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. EBC Trek October 2025"
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
                placeholder="Tell your crew what to expect..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-summit-primary transition resize-none"
              />
            </div>

            {/* Trail ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trail ID *</label>
              <input
                type="text"
                name="trailId"
                value={form.trailId}
                onChange={handleChange}
                placeholder="Paste trail UUID here"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-summit-primary transition font-mono text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">
                Go to a trail and copy its ID, or{' '}
                <span
                  onClick={() => navigate('/trails')}
                  className="text-summit-primary cursor-pointer hover:underline"
                >
                  browse trails
                </span>
              </p>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-summit-primary transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-summit-primary transition"
                />
              </div>
            </div>

            {/* Meeting point + max members */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Point</label>
                <input
                  type="text"
                  name="meetingPoint"
                  value={form.meetingPoint}
                  onChange={handleChange}
                  placeholder="e.g. Lukla Airport"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-summit-primary transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Members</label>
                <input
                  type="number"
                  name="maxMembers"
                  value={form.maxMembers}
                  onChange={handleChange}
                  placeholder="e.g. 10"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-summit-primary transition"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 pt-2">
              <button
                type="button"
                onClick={() => navigate('/trips')}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-summit-primary text-white py-3 rounded-lg font-semibold hover:bg-summit-dark transition disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Trip'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTripPage;