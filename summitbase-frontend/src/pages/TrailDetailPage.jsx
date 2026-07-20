import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTrailById, deleteTrail, uploadTrailPhoto } from '../api/trailApi';
import { useAuth } from '../context/AuthContext';

const difficultyColors = {
  EASY: 'bg-green-100 text-green-700',
  MODERATE: 'bg-yellow-100 text-yellow-700',
  HARD: 'bg-orange-100 text-orange-700',
  EXPERT: 'bg-red-100 text-red-700',
};

const typeIcons = {
  TREKKING: '🥾',
  BIKING: '🚵',
  HIKING: '🏔️',
  ADVENTURE: '🧗',
};

const TrailDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileRef = useRef();

  const [trail, setTrail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchTrail();
  }, [id]);

  const fetchTrail = async () => {
    setLoading(true);
    try {
      const res = await getTrailById(id);
      setTrail(res.data);
    } catch {
      setError('Trail not found.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadTrailPhoto(id, file);
      setTrail(res.data);
    } catch {
      setError('Failed to upload photo.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this trail?')) return;
    setDeleting(true);
    try {
      await deleteTrail(id);
      navigate('/trails');
    } catch {
      setError('Failed to delete trail.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-summit-light flex items-center justify-center">
        <div className="text-summit-primary font-semibold text-lg">Loading trail...</div>
      </div>
    );
  }

  if (error || !trail) {
    return (
      <div className="min-h-screen bg-summit-light flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl">😕</span>
          <p className="mt-4 text-gray-600">{error || 'Trail not found'}</p>
          <button onClick={() => navigate('/trails')} className="mt-4 text-summit-primary hover:underline">
            Back to Trails
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && trail.createdByUserId === user.id;

  return (
    <div className="min-h-screen bg-summit-light pb-12">

      {/* Hero Photo */}
      <div className="h-72 bg-gradient-to-br from-summit-primary to-summit-secondary relative">
        {trail.photoUrls && trail.photoUrls.length > 0 ? (
          <img
            src={trail.photoUrls[0]}
            alt={trail.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-8xl">{typeIcons[trail.trailType] || '🏔️'}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="absolute bottom-6 left-6 text-white">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${difficultyColors[trail.difficulty]}`}>
            {trail.difficulty}
          </span>
          <h1 className="text-3xl font-bold mt-2">{trail.name}</h1>
          <p className="text-white text-opacity-90">📍 {trail.location}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">

        {/* Back */}
        <button
          onClick={() => navigate('/trails')}
          className="text-summit-primary hover:underline text-sm mb-6 flex items-center"
        >
          ← Back to Trails
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — Main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-summit-dark text-lg mb-4">Trail Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: '📏', label: 'Distance', value: `${trail.distanceKm} km` },
                  { icon: '⬆️', label: 'Elevation', value: `${trail.elevationGainM} m` },
                  { icon: '⏱️', label: 'Duration', value: `${Math.round(trail.estimatedDurationMinutes / 60)}h` },
                  { icon: typeIcons[trail.trailType], label: 'Type', value: trail.trailType },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-3 bg-summit-light rounded-xl">
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                    <div className="font-semibold text-summit-dark text-sm mt-1">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {trail.description && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-summit-dark text-lg mb-3">About this Trail</h2>
                <p className="text-gray-600 leading-relaxed">{trail.description}</p>
              </div>
            )}

            {/* GPS */}
            {trail.latitude && trail.longitude && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-summit-dark text-lg mb-3">GPS Coordinates</h2>
                <div className="flex space-x-6 text-sm text-gray-600">
                  <span>🌐 Lat: {trail.latitude}</span>
                  <span>🌐 Lng: {trail.longitude}</span>
                </div>
                
                <a
                  href={`https://www.google.com/maps?q=${trail.latitude},${trail.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-summit-primary text-sm font-medium hover:underline"
                >
                  Open in Google Maps →
                </a>
              </div>
            )}

            {/* Photos */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-summit-dark text-lg">Photos</h2>
                {user && (
                  <>
                    <button
                      onClick={() => fileRef.current.click()}
                      disabled={uploading}
                      className="text-sm text-summit-primary font-semibold hover:underline disabled:opacity-50"
                    >
                      {uploading ? 'Uploading...' : '+ Upload Photo'}
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileRef}
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </>
                )}
              </div>

              {trail.photoUrls && trail.photoUrls.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {trail.photoUrls.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Trail photo ${i + 1}`}
                      className="w-full h-32 object-cover rounded-xl"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <span className="text-4xl">📸</span>
                  <p className="mt-2 text-sm">No photos yet</p>
                </div>
              )}
            </div>

          </div>

          {/* Right — Sidebar */}
          <div className="space-y-4">

            {/* Plan Trip CTA */}
            <div className="bg-summit-primary text-white rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-2">Plan a Trip</h3>
              <p className="text-summit-light text-sm mb-4">
                Create a group adventure on this trail and invite friends.
              </p>
              <button
                onClick={() => navigate('/trips/create', { state: { trailId: trail.id, trailName: trail.name } })}
                className="w-full bg-white text-summit-primary py-3 rounded-xl font-semibold hover:bg-summit-light transition"
              >
                Create Trip →
              </button>
            </div>

            {/* Owner actions */}
            {isOwner && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-summit-dark mb-4">Manage Trail</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate(`/trails/${id}/edit`)}
                    className="w-full border border-summit-primary text-summit-primary py-2 rounded-lg font-medium hover:bg-summit-light transition"
                  >
                    ✏️ Edit Trail
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full border border-red-300 text-red-500 py-2 rounded-lg font-medium hover:bg-red-50 transition disabled:opacity-50"
                  >
                    {deleting ? 'Deleting...' : '🗑️ Delete Trail'}
                  </button>
                </div>
              </div>
            )}

            {/* Trail info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm text-sm text-gray-600 space-y-2">
              <p>📅 Added {new Date(trail.createdAt).toLocaleDateString()}</p>
              <p>🔄 Updated {new Date(trail.updatedAt).toLocaleDateString()}</p>
              <p>✅ Status: {trail.isActive ? 'Active' : 'Inactive'}</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailDetailPage;