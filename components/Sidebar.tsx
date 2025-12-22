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
    <div className="w-64 bg-slate-900/40 backdrop-blur-xl border-r border-white/10 h-full hidden lg:flex flex-col flex-shrink-0 z-20">
      <div className="p-6 border-b border-white/5">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
          <span className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <IconGrid className="text-white w-5 h-5" />
          </span>
          PhotoKit
        </h1>
        <p className="text-[10px] text-slate-400 mt-2 font-medium tracking-[0.2em] uppercase ml-1">Asset Management</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        
        {/* Categories */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Categories</h3>
          <div className="space-y-1">
            <button
              onClick={() => handleCategoryChange('All')}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                filters.category === 'All' 
                ? 'bg-white/10 text-white font-medium shadow-inner' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              All Photos
            </button>
            {CATEGORIES.slice(0, 6).map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                  filters.category === cat 
                  ? 'bg-white/10 text-white font-medium shadow-inner' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tags Cloud */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2 flex items-center">
            <IconTag className="w-3 h-3 mr-1" />
            Popular Tags
          </h3>
          <div className="flex flex-wrap gap-2 px-2">
            {availableTags.slice(0, 10).map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-200 ${
                  filters.tags.includes(tag) 
                    ? 'bg-indigo-500/80 text-white border-indigo-400/50 shadow-lg shadow-indigo-500/20' 
                    : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/30 hover:text-white hover:bg-white/10'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Date Filter */}
        <div>
           <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Date Uploaded</h3>
           <div className="relative">
             <select 
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({...prev, dateRange: e.target.value as any}))}
              className="w-full bg-slate-900/50 border border-white/10 rounded-lg text-sm text-slate-300 p-2.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none appearance-none"
             >
               <option value="All">Any Time</option>
               <option value="Last 7 Days">Last 7 Days</option>
               <option value="Last 30 Days">Last 30 Days</option>
               <option value="This Year">This Year</option>
             </select>
             <div className="absolute right-3 top-3 pointer-events-none">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
             </div>
           </div>
        </div>

      </div>

      {hasActiveFilters && (
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={resetFilters}
            className="w-full flex items-center justify-center space-x-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 py-2 rounded-lg transition-colors border border-dashed border-slate-700 hover:border-slate-500"
          >
            <IconTrash className="w-4 h-4" />
            <span>Clear Filters</span>
          </button>
        </div>
      )}

      {/* User Mini Profile */}
      <div className="p-4 border-t border-white/5 flex items-center space-x-3 bg-black/20">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/10">
          AS
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">Alex Shooter</p>
          <p className="text-[10px] text-slate-500 truncate uppercase tracking-wider">Pro Account</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;