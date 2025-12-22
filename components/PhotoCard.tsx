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
      className={`group relative bg-white dark:bg-zinc-900 border transition-all duration-300 cursor-pointer overflow-hidden ${
        selected 
          ? 'border-pk-orange ring-1 ring-pk-orange shadow-lg scale-[0.98]' 
          : 'border-slate-200 dark:border-white/10 hover:border-pk-orange dark:hover:border-pk-orange hover:shadow-xl'
      }`}
      style={{ borderRadius: '12px' }}
      onClick={() => onClick(photo)}
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-black/20 relative">
        <img 
          src={photo.thumbnailUrl || photo.url} 
          alt={photo.title} 
          className={`w-full h-full object-cover transform transition-transform duration-500 ease-in-out ${selected ? 'opacity-80' : 'group-hover:scale-105 group-hover:opacity-90'}`}
          loading="lazy"
        />
        
        {/* Selection Indicator - Top Right */}
        {(selectionMode || selected) && (
          <div className={`absolute top-2 right-2 w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 z-10 ${selected ? 'bg-pk-orange border-pk-orange text-white' : 'bg-black/40 border-white/50'}`}>
            {selected && <IconCheck className="w-3 h-3" />}
          </div>
        )}

        {/* Technical Data Overlay (Hover) */}
        {!selectionMode && (
          <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
             <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex justify-between items-end mb-1">
                   <span className="text-[10px] font-mono text-pk-orange uppercase tracking-wider">IMG_DATA</span>
                </div>
                <div className="h-[1px] w-full bg-white/20 mb-2"></div>
                <div className="flex gap-2 text-white/80 text-[10px] font-mono">
                   <span>{photo.dimensions.width}x{photo.dimensions.height}</span>
                   <span>|</span>
                   <span>{(photo.fileSize / 1024 / 1024).toFixed(1)}MB</span>
                </div>
             </div>
          </div>
        )}
      </div>
      
      {/* Label */}
      <div className="p-3 bg-white dark:bg-black border-t border-slate-100 dark:border-white/10">
        <h3 className="text-xs font-bold uppercase tracking-wide text-pk-black dark:text-white truncate">{photo.title}</h3>
        <div className="flex justify-between items-center mt-1">
           <p className="text-[10px] font-mono text-slate-400">{photo.category}</p>
           <p className="text-[10px] font-mono text-slate-400">{photo.dateTaken}</p>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;