import React from 'react';
import { Photo } from '../types';
import { IconCalendar, IconUser, IconCheck } from './Icons';

interface PhotoCardProps {
  photo: Photo;
  onClick: (photo: Photo) => void;
  selected: boolean;
  selectionMode: boolean;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onClick, selected, selectionMode }) => {
  return (
    <div 
      className={`group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-lg transition-all duration-300 cursor-pointer ${
        selected 
          ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900 shadow-indigo-500/20' 
          : 'hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-white/20 hover:-translate-y-1'
      }`}
      onClick={() => onClick(photo)}
    >
      <div className="aspect-[3/2] w-full overflow-hidden bg-slate-900/50 relative">
        <img 
          src={photo.thumbnailUrl || photo.url} 
          alt={photo.title} 
          className={`w-full h-full object-cover transform transition-transform duration-700 ease-out ${selected ? 'scale-95 opacity-80' : 'group-hover:scale-110'}`}
          loading="lazy"
        />
        
        {/* Selection Indicator */}
        {(selectionMode || selected) && (
          <div className={`absolute top-3 right-3 w-6 h-6 rounded-full border border-white/20 flex items-center justify-center transition-all duration-200 z-10 backdrop-blur-sm ${selected ? 'bg-indigo-500 border-indigo-500 shadow-lg shadow-indigo-500/40' : 'bg-black/40 hover:bg-black/60'}`}>
            {selected && <IconCheck className="w-3.5 h-3.5 text-white" />}
          </div>
        )}
      </div>
      
      {/* Overlay on hover (only when not in selection mode) */}
      {!selectionMode && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
          <h3 className="text-white font-semibold truncate drop-shadow-md text-lg">{photo.title}</h3>
          <div className="flex items-center text-xs text-slate-300 mt-2 space-x-3">
            <span className="flex items-center bg-black/30 rounded-full px-2 py-0.5 backdrop-blur-md">
              <IconCalendar className="w-3 h-3 mr-1.5 opacity-70" />
              {photo.dateTaken}
            </span>
            <span className="flex items-center bg-black/30 rounded-full px-2 py-0.5 backdrop-blur-md">
              <IconUser className="w-3 h-3 mr-1.5 opacity-70" />
              {photo.photographer}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {photo.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] font-medium bg-white/20 text-white px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10">
                #{tag}
              </span>
            ))}
            {photo.tags.length > 3 && (
              <span className="text-[10px] font-medium bg-white/20 text-white px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10">
                +{photo.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Basic info for mobile/non-hover state or selection mode */}
      <div className={`p-4 block bg-white/[0.02] backdrop-blur-sm border-t border-white/5 ${!selectionMode ? 'group-hover:hidden' : ''}`}>
        <h3 className="text-slate-100 text-sm font-semibold truncate">{photo.title}</h3>
        <p className="text-slate-400 text-xs mt-1 font-medium tracking-wide">{photo.category}</p>
      </div>
    </div>
  );
};

export default PhotoCard;