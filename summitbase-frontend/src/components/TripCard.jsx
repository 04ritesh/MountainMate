import React from 'react';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  PLANNED: 'bg-blue-100 text-blue-700',
  ONGOING: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const statusIcons = {
  PLANNED: '📅',
  ONGOING: '🏃',
  COMPLETED: '✅',
  CANCELLED: '❌',
};

const TripCard = ({ trip }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/trips/${trip.id}`)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden border border-gray-100"
    >
      {/* Header */}
      <div className="h-32 bg-gradient-to-br from-summit-dark to-summit-primary flex items-center justify-center relative">
        <span className="text-5xl">🏕️</span>
        <span className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full ${statusColors[trip.status]}`}>
          {statusIcons[trip.status]} {trip.status}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-summit-dark text-lg mb-1">{trip.name}</h3>

        <p className="text-summit-primary text-sm font-medium mb-2">
          🥾 {trip.trailName}
        </p>

        <p className="text-gray-500 text-sm mb-3 flex items-center">
          <span className="mr-1">📍</span> {trip.trailLocation}
        </p>

        {trip.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">{trip.description}</p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
          <span>📅 {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'TBD'}</span>
          <span>👥 {trip.members?.length || 0} {trip.maxMembers ? `/ ${trip.maxMembers}` : ''} members</span>
        </div>
      </div>
    </div>
  );
};

export default TripCard;