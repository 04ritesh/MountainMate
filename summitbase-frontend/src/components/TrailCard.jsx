import React from 'react';
import { useNavigate } from 'react-router-dom';

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

const TrailCard = ({ trail }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/trails/${trail.id}`)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden border border-gray-100"
    >
      {/* Photo */}
      <div className="h-48 bg-gradient-to-br from-summit-primary to-summit-secondary flex items-center justify-center">
        {trail.photoUrls && trail.photoUrls.length > 0 ? (
          <img
            src={trail.photoUrls[0]}
            alt={trail.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-6xl">{typeIcons[trail.trailType] || '🏔️'}</span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-summit-dark text-lg leading-tight">{trail.name}</h3>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ml-2 shrink-0 ${difficultyColors[trail.difficulty]}`}>
            {trail.difficulty}
          </span>
        </div>

        <p className="text-gray-500 text-sm mb-3 flex items-center">
          <span className="mr-1">📍</span> {trail.location}
        </p>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{trail.description}</p>

        <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
          <span>📏 {trail.distanceKm} km</span>
          <span>⬆️ {trail.elevationGainM} m</span>
          <span>⏱️ {Math.round(trail.estimatedDurationMinutes / 60)}h</span>
          <span>{typeIcons[trail.trailType]} {trail.trailType}</span>
        </div>
      </div>
    </div>
  );
};

export default TrailCard;