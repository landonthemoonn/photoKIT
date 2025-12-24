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
      className={`group relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border transition-all duration-500 cursor-pointer overflow-hidden ${
        selected
          ? 'border-pk-orange ring-2 ring-pk-orange shadow-2xl shadow-pk-orange/20 scale-[0.97]'
          : 'border-white/40 dark:border-white/10 hover:border-pk-orange dark:hover:border-pk-orange hover:shadow-2xl hover:shadow-pk-orange/10 hover:scale-[1.03] hover:-translate-y-1'
      }`}
      style={{ borderRadius: '16px' }}
      onClick={() => onClick(photo)}
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-black/30 relative rounded-t-2xl">
        <img
          src={photo.thumbnailUrl || photo.url}
          alt={photo.title}
          className={`w-full h-full object-cover transform transition-all duration-700 ease-out ${selected ? 'opacity-80 scale-105' : 'group-hover:scale-110 group-hover:opacity-95 group-hover:brightness-105'}`}
          loading="lazy"
        />
        
        {/* Selection Indicator - Top Right */}
        {(selectionMode || selected) && (
          <div className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 backdrop-blur-sm ${selected ? 'bg-pk-orange border-pk-orange text-white shadow-lg shadow-pk-orange/40 scale-110' : 'bg-black/30 border-white/60 hover:scale-110'}`}>
            {selected && <IconCheck className="w-3.5 h-3.5" />}
          </div>
        )}

        {/* Technical Data Overlay (Hover) */}
        {!selectionMode && (
          <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-t from-black/95 via-black/40 to-transparent backdrop-blur-sm">
             <div className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out">
                <div className="flex justify-between items-end mb-2">
                   <span className="text-[10px] font-mono text-pk-orange uppercase tracking-wider font-bold">Image Data</span>
                </div>
                <div className="h-[2px] w-full bg-gradient-to-r from-pk-orange via-white/40 to-transparent mb-3 rounded-full"></div>
                <div className="flex gap-3 text-white/90 text-[10px] font-mono font-medium">
                   <span>{photo.dimensions.width}x{photo.dimensions.height}</span>
                   <span className="text-white/40">•</span>
                   <span>{(photo.fileSize / 1024 / 1024).toFixed(1)}MB</span>
                </div>
             </div>
          </div>
        )}
      </div>
      
      {/* Label */}
      <div className="p-4 bg-white/60 dark:bg-black/60 backdrop-blur-md border-t border-white/40 dark:border-white/10 rounded-b-2xl">
        <h3 className="text-xs font-bold uppercase tracking-wide text-pk-black dark:text-white truncate group-hover:text-pk-orange transition-colors duration-300">{photo.title}</h3>
        <div className="flex justify-between items-center mt-2 gap-2">
           <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-white/40 dark:bg-black/40 px-2 py-1 rounded-md">{photo.category}</p>
           <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{photo.dateTaken}</p>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;