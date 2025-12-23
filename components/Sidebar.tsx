import React from 'react';
import { CATEGORIES } from '../constants';
import { PhotoFilter } from '../types';
import { IconGrid, IconTag, IconTrash } from './Icons';

interface SidebarProps {
  filters: PhotoFilter;
  setFilters: React.Dispatch<React.SetStateAction<PhotoFilter>>;
  availableTags: string[];
  user: {
    displayName: string;
    licenseId: string;
    initials: string;
  };
  onSwitchUser: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ filters, setFilters, availableTags, user, onSwitchUser }) => {
  
  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category: prev.category === category ? 'All' : category }));
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    setFilters(prev => ({ ...prev, tags: newTags }));
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'All',
      photographer: 'All',
      dateRange: 'All',
      tags: []
    });
  };

  const hasActiveFilters = filters.category !== 'All' || filters.tags.length > 0 || filters.dateRange !== 'All';

  return (
    <div className="h-full flex flex-col pt-8 pb-4 backdrop-blur-xl bg-white/30 dark:bg-black/30 border-r border-white/20 dark:border-white/10">
      <div className="px-6 mb-8">
        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Current View</div>
        <div className="flex items-center gap-3 bg-white/40 dark:bg-black/40 backdrop-blur-md rounded-xl px-4 py-3 border border-white/30 dark:border-white/10 shadow-lg">
            <div className="w-2.5 h-2.5 rounded-full bg-pk-orange shadow-[0_0_8px_rgba(255,136,51,0.6)] animate-pulse"></div>
            <span className="text-sm font-bold uppercase tracking-widest text-pk-black dark:text-white">Active</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-8 scrollbar-thin">
        
        {/* Categories Group */}
        <div className="relative bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 dark:border-white/10 shadow-lg">
          <h3 className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 uppercase mb-4 flex items-center gap-2">
            <span className="w-4 h-[2px] bg-gradient-to-r from-pk-orange to-transparent rounded"></span>
            Category
          </h3>
          <div className="space-y-1.5">
            <button
              onClick={() => handleCategoryChange('All')}
              className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-between group rounded-lg ${
                filters.category === 'All'
                ? 'text-pk-orange bg-white/40 dark:bg-black/40 backdrop-blur-sm shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-pk-black dark:hover:text-white hover:bg-white/20 dark:hover:bg-white/10'
              }`}
            >
              All Assets
              <span className={`w-1.5 h-1.5 rounded-full transition-all ${filters.category === 'All' ? 'bg-pk-orange shadow-[0_0_6px_rgba(255,136,51,0.6)]' : 'bg-transparent group-hover:bg-slate-400'}`}></span>
            </button>
            {CATEGORIES.slice(0, 6).map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-between group rounded-lg ${
                  filters.category === cat
                  ? 'text-pk-orange bg-white/40 dark:bg-black/40 backdrop-blur-sm shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-pk-black dark:hover:text-white hover:bg-white/20 dark:hover:bg-white/10'
                }`}
              >
                {cat}
                <span className={`w-1.5 h-1.5 rounded-full transition-all ${filters.category === cat ? 'bg-pk-orange shadow-[0_0_6px_rgba(255,136,51,0.6)]' : 'bg-transparent group-hover:bg-slate-400'}`}></span>
              </button>
            ))}
          </div>
        </div>

        {/* Tags Group */}
        <div className="relative bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 dark:border-white/10 shadow-lg">
          <h3 className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 uppercase mb-4 flex items-center gap-2">
            <span className="w-4 h-[2px] bg-gradient-to-r from-pk-orange to-transparent rounded"></span>
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.slice(0, 10).map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`text-[10px] font-mono px-3 py-1.5 border transition-all duration-300 uppercase rounded-lg backdrop-blur-sm ${
                  filters.tags.includes(tag)
                    ? 'bg-pk-orange/90 text-white border-pk-orange shadow-lg shadow-pk-orange/30 hover:shadow-pk-orange/50'
                    : 'bg-white/20 dark:bg-black/20 text-slate-600 dark:text-slate-400 border-white/30 dark:border-white/20 hover:border-pk-orange hover:text-pk-orange hover:bg-white/30 dark:hover:bg-white/10'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Date Filter */}
        <div className="relative bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 dark:border-white/10 shadow-lg">
           <h3 className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 uppercase mb-4 flex items-center gap-2">
            <span className="w-4 h-[2px] bg-gradient-to-r from-pk-orange to-transparent rounded"></span>
            Time Range
          </h3>
           <div className="relative">
             <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({...prev, dateRange: e.target.value as any}))}
              className="w-full bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/30 dark:border-white/20 rounded-lg text-xs font-bold uppercase text-pk-black dark:text-white px-3 py-2.5 focus:border-pk-orange focus:outline-none focus:ring-2 focus:ring-pk-orange/20 appearance-none tracking-wider cursor-pointer transition-all duration-300"
             >
               <option value="All">Any Time</option>
               <option value="Last 7 Days">Last 7 Days</option>
               <option value="Last 30 Days">Last 30 Days</option>
               <option value="This Year">This Year</option>
             </select>
           </div>
        </div>

      </div>

      {/* Footer / User */}
      <div className="mt-auto px-6 pt-6 space-y-4">
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="w-full flex items-center justify-center space-x-2 text-[10px] font-bold uppercase text-slate-600 dark:text-slate-300 hover:text-pk-orange py-2.5 border border-white/30 dark:border-white/20 hover:border-pk-orange transition-all duration-300 rounded-lg bg-white/20 dark:bg-black/20 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-white/10 shadow-md"
          >
            <span>Reset All</span>
          </button>
        )}

        {/* Clickable User Switcher */}
        <button
          onClick={onSwitchUser}
          className="w-full flex items-center space-x-3 bg-white/30 dark:bg-black/30 backdrop-blur-lg p-4 rounded-xl hover:bg-white/40 dark:hover:bg-black/40 transition-all duration-300 cursor-pointer group text-left border border-white/40 dark:border-white/20 hover:border-pk-orange shadow-lg hover:shadow-xl active:scale-[0.98]"
          title="Switch User"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pk-orange to-pk-orange/70 group-hover:shadow-lg group-hover:shadow-pk-orange/30 transition-all duration-300 text-white flex items-center justify-center font-bold text-sm ring-2 ring-white/30">
            {user.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-pk-black dark:text-white truncate uppercase group-hover:text-pk-orange transition-colors">
              {user.displayName}
            </p>
            <p className="text-[9px] font-mono text-slate-500 dark:text-slate-400 truncate">{user.licenseId}</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;