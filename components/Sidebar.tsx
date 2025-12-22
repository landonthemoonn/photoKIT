import React from 'react';
import { CATEGORIES } from '../constants';
import { PhotoFilter } from '../types';
import { IconGrid, IconTag, IconTrash } from './Icons';

interface SidebarProps {
  filters: PhotoFilter;
  setFilters: React.Dispatch<React.SetStateAction<PhotoFilter>>;
  availableTags: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ filters, setFilters, availableTags }) => {
  
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
    <div className="h-full flex flex-col pt-8 pb-4">
      <div className="px-6 mb-8">
        <div className="text-[10px] font-mono text-slate-400 mb-1">CURRENT_VIEW</div>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pk-orange animate-pulse"></div>
            <span className="text-sm font-bold uppercase tracking-widest text-pk-black dark:text-white">Active</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-10 scrollbar-thin">
        
        {/* Categories Group */}
        <div className="relative">
          <h3 className="text-[10px] font-mono font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
            <span className="w-4 h-[1px] bg-slate-400"></span>
            Filter_01: Category
          </h3>
          <div className="space-y-1 pl-2 border-l border-slate-200 dark:border-white/10">
            <button
              onClick={() => handleCategoryChange('All')}
              className={`w-full text-left px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-between group ${
                filters.category === 'All' 
                ? 'text-pk-orange' 
                : 'text-slate-500 dark:text-slate-400 hover:text-pk-black dark:hover:text-white'
              }`}
            >
              All Assets
              <span className={`w-1.5 h-1.5 rounded-full ${filters.category === 'All' ? 'bg-pk-orange' : 'bg-transparent group-hover:bg-slate-300'}`}></span>
            </button>
            {CATEGORIES.slice(0, 6).map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`w-full text-left px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-between group ${
                  filters.category === cat 
                  ? 'text-pk-orange' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-pk-black dark:hover:text-white'
                }`}
              >
                {cat}
                <span className={`w-1.5 h-1.5 rounded-full ${filters.category === cat ? 'bg-pk-orange' : 'bg-transparent group-hover:bg-slate-300'}`}></span>
              </button>
            ))}
          </div>
        </div>

        {/* Tags Group */}
        <div>
          <h3 className="text-[10px] font-mono font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
            <span className="w-4 h-[1px] bg-slate-400"></span>
            Filter_02: Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.slice(0, 10).map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`text-[10px] font-mono px-2 py-1 border transition-all duration-200 uppercase ${
                  filters.tags.includes(tag) 
                    ? 'bg-pk-black text-white border-pk-black' 
                    : 'bg-transparent text-slate-500 dark:text-slate-400 border-slate-300 dark:border-white/20 hover:border-pk-orange hover:text-pk-orange'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Date Filter */}
        <div>
           <h3 className="text-[10px] font-mono font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
            <span className="w-4 h-[1px] bg-slate-400"></span>
            Filter_03: Time
          </h3>
           <div className="relative">
             <select 
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({...prev, dateRange: e.target.value as any}))}
              className="w-full bg-white/50 dark:bg-black/20 border-b-2 border-slate-200 dark:border-white/20 rounded-none text-xs font-bold uppercase text-pk-black dark:text-white p-2 focus:border-pk-orange focus:outline-none appearance-none tracking-wider cursor-pointer"
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
      <div className="mt-auto px-6 border-t border-slate-200/50 dark:border-white/5 pt-6 space-y-4">
        {hasActiveFilters && (
          <button 
            onClick={resetFilters}
            className="w-full flex items-center justify-center space-x-2 text-[10px] font-bold uppercase text-slate-500 hover:text-pk-orange py-2 border border-slate-300 dark:border-white/20 hover:border-pk-orange transition-all"
          >
            <span>Reset_All</span>
          </button>
        )}

        <div className="flex items-center space-x-3 bg-white/60 dark:bg-white/5 p-3 rounded-lg backdrop-blur-sm">
          <div className="w-8 h-8 rounded-full bg-pk-black text-white flex items-center justify-center font-bold text-xs ring-2 ring-white/20">
            AS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-pk-black dark:text-white truncate uppercase">Alex Shooter</p>
            <p className="text-[9px] font-mono text-slate-400 truncate">PRO_LICENSE_01</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;