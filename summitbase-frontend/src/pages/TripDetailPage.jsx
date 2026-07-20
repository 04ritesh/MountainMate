import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getTripById,
  joinTrip,
  updateRsvp,
  updateTripStatus,
  removeMember,
} from '../api/tripApi';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  PLANNED: 'bg-blue-100 text-blue-700',
  ONGOING: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const rsvpColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  DECLINED: 'bg-red-100 text-red-700',
};

const TripDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    setLoading(true);
    try {
      const res = await getTripById(id);
      setTrip(res.data);
    } catch {
      setError('Trip not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    setActionLoading(true);
    try {
      const res = await joinTrip(id);
      setTrip(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join trip.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRsvp = async (status) => {
    setActionLoading(true);
    try {
      const res = await updateRsvp(id, status);
      setTrip(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update RSVP.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    setActionLoading(true);
    try {
      const res = await updateTripStatus(id, status);
      setTrip(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member from the trip?')) return;
    setActionLoading(true);
    try {
      const res = await removeMember(id, userId);
      fetchTrip();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove member.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-summit-light flex items-center justify-center">
        <div className="text-summit-primary font-semibold">Loading trip...</div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-summit-light flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl">😕</span>
          <p className="mt-4 text-gray-600">{error || 'Trip not found'}</p>
          <button onClick={() => navigate('/trips')} className="mt-4 text-summit-primary hover:underline">
            Back to Trips
          </button>
        </div>
      </div>
    );
  }

  const isOrganizer = user && trip.organizerUserId === user.id;
  const myMembership = trip.members?.find((m) => m.userId === user?.id);
  const isMember = !!myMembership;
  const isFull = trip.maxMembers && trip.members?.length >= trip.maxMembers;

  return (
    <div className="min-h-screen bg-summit-light pb-12">

      {/* Hero */}
      <div className="h-56 bg-gradient-to-br from-summit-dark to-summit-primary flex items-center justify-center relative">
        <span className="text-7xl">🏕️</span>
        <span className={`absolute top-4 right-4 text-sm font-semibold px-3 py-1 rounded-full ${statusColors[trip.status]}`}>
          {trip.status}
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">

        <button
          onClick={() => navigate('/trips')}
          className="text-summit-primary hover:underline text-sm mb-6 flex items-center"
        >
          ← Back to Trips
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left */}
          <div className="lg:col-span-2 space-y-6">

            {/* Title */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-summit-dark mb-2">{trip.name}</h1>
              <p className="text-summit-primary font-medium">🥾 {trip.trailName}</p>
              <p className="text-gray-500 text-sm mt-1">📍 {trip.trailLocation}</p>
              {trip.description && (
                <p className="text-gray-600 mt-4 leading-relaxed">{trip.description}</p>
              )}
            </div>

            {/* Trip Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-summit-dark text-lg mb-4">Trip Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  { icon: '📅', label: 'Start Date', value: trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'TBD' },
                  { icon: '📅', label: 'End Date', value: trip.endDate ? new Date(trip.endDate).toLocaleDateString() : 'TBD' },
                  { icon: '📍', label: 'Meeting Point', value: trip.meetingPoint || 'TBD' },
                  { icon: '👥', label: 'Max Members', value: trip.maxMembers || 'Unlimited' },
                ].map((d) => (
                  <div key={d.label} className="bg-summit-light rounded-xl p-4">
                    <span className="text-xl">{d.icon}</span>
                    <p className="text-xs text-gray-500 mt-1">{d.label}</p>
                    <p className="font-semibold text-summit-dark">{d.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Members */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-summit-dark text-lg mb-4">
                Members ({trip.members?.length || 0}{trip.maxMembers ? ` / ${trip.maxMembers}` : ''})
              </h2>

              {trip.members && trip.members.length > 0 ? (
                <div className="space-y-3">
                  {trip.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-summit-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {member.userId.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {member.userId === trip.organizerUserId ? '👑 Organizer' : 'Member'}
                            {member.userId === user?.id ? ' (You)' : ''}
                          </p>
                          <p className="text-xs text-gray-400">
                            Joined {new Date(member.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${rsvpColors[member.rsvpStatus]}`}>
                          {member.rsvpStatus}
                        </span>
                        {isOrganizer && member.userId !== user?.id && (
                          <button
                            onClick={() => handleRemoveMember(member.userId)}
                            disabled={actionLoading}
                            className="text-red-400 hover:text-red-600 text-xs"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No members yet</p>
              )}
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">

            {/* Join / RSVP actions */}
            {user && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-summit-dark mb-4">Your Status</h3>

                {!isMember ? (
                  <button
                    onClick={handleJoin}
                    disabled={actionLoading || isFull || trip.status === 'CANCELLED'}
                    className="w-full bg-summit-primary text-white py-3 rounded-xl font-semibold hover:bg-summit-dark transition disabled:opacity-50"
                  >
                    {isFull ? 'Trip is Full' : actionLoading ? 'Joining...' : 'Join Trip'}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 mb-2">
                      Your RSVP:{' '}
                      <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${rsvpColors[myMembership.rsvpStatus]}`}>
                        {myMembership.rsvpStatus}
                      </span>
                    </p>
                    {myMembership.rsvpStatus !== 'ACCEPTED' && (
                      <button
                        onClick={() => handleRsvp('ACCEPTED')}
                        disabled={actionLoading}
                        className="w-full bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition disabled:opacity-50"
                      >
                        ✅ Accept
                      </button>
                    )}
                    {myMembership.rsvpStatus !== 'DECLINED' && (
                      <button
                        onClick={() => handleRsvp('DECLINED')}
                        disabled={actionLoading}
                        className="w-full bg-red-100 text-red-600 py-2 rounded-lg font-medium hover:bg-red-200 transition disabled:opacity-50"
                      >
                        ❌ Decline
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Organizer controls */}
            {isOrganizer && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-summit-dark mb-4">Manage Trip</h3>
                <div className="space-y-2">
                  {['PLANNED', 'ONGOING', 'COMPLETED', 'CANCELLED'].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusUpdate(s)}
                      disabled={actionLoading || trip.status === s}
                      className={`w-full py-2 rounded-lg text-sm font-medium transition disabled:opacity-40 ${
                        trip.status === s
                          ? 'bg-summit-light text-summit-primary border border-summit-primary'
                          : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {trip.status === s ? `✓ ${s}` : `Set ${s}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trail link */}
            <div className="bg-white rounded-2xl p-6 shadow-sm text-sm">
              <h3 className="font-bold text-summit-dark mb-3">Trail</h3>
              <p className="text-gray-600 mb-3">{trip.trailName}</p>
              <button
                onClick={() => navigate(`/trails/${trip.trailId}`)}
                className="w-full border border-summit-primary text-summit-primary py-2 rounded-lg font-medium hover:bg-summit-light transition"
              >
                View Trail →
              </button>
            </div>

            {/* Info */}
            <div className="bg-white rounded-2xl p-4 shadow-sm text-xs text-gray-400 space-y-1">
              <p>📅 Created {new Date(trip.createdAt).toLocaleDateString()}</p>
              <p>🔄 Updated {new Date(trip.updatedAt).toLocaleDateString()}</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailPage;