import React, { useState } from 'react';
import { CATEGORIES } from '../constants';
import { IconX, IconLayers } from './Icons';

interface BulkEditModalProps {
  count: number;
  onClose: () => void;
  onSave: (updates: { category?: string; photographer?: string; addTags?: string[] }) => void;
}

const BulkEditModal: React.FC<BulkEditModalProps> = ({ count, onClose, onSave }) => {
  const [category, setCategory] = useState('');
  const [photographer, setPhotographer] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: any = {};
    if (category) updates.category = category;
    if (photographer) updates.photographer = photographer;
    if (tags) updates.addTags = tags.split(',').map(t => t.trim()).filter(Boolean);
    
    onSave(updates);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl w-full max-w-lg rounded-2xl shadow-2xl border border-white/50 dark:border-white/10 overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200/50 dark:border-white/5 flex justify-between items-center bg-white/40 dark:bg-white/[0.02]">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
            <div className="p-2 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-lg mr-3 shadow-sm border border-indigo-200/20">
               <IconLayers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="tracking-tight">Bulk Edit</span>
            <span className="ml-3 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 text-xs font-medium border border-slate-200 dark:border-white/5">{count} items</span>
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 transition-colors p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full">
            <IconX className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-indigo-50/50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 p-4 rounded-xl flex gap-3 items-start shadow-sm">
            <span className="text-indigo-500 dark:text-indigo-400 text-lg">ⓘ</span>
            <p className="text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed">
              Changes will apply to all <strong>{count}</strong> selected photos. Leave fields blank to keep existing metadata.
            </p>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Category</label>
              <div className="relative group">
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white dark:focus:bg-black/40 focus:outline-none appearance-none transition-all shadow-sm"
                >
                  <option value="">-- No Change --</option>
                  {CATEGORIES.map(c => <option key={c} value={c} className="bg-white dark:bg-zinc-900">{c}</option>)}
                </select>
                <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Photographer</label>
              <input 
                type="text" 
                value={photographer} 
                onChange={e => setPhotographer(e.target.value)}
                placeholder="Overwrite photographer name..."
                className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white dark:focus:bg-black/40 focus:outline-none transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Add Tags</label>
              <input 
                type="text" 
                value={tags} 
                onChange={e => setTags(e.target.value)}
                placeholder="nature, project-x, 2024..."
                className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white dark:focus:bg-black/40 focus:outline-none transition-all shadow-sm"
              />
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 ml-1 flex items-center">
                <span className="inline-block w-1 h-1 rounded-full bg-indigo-500 mr-1.5"></span>
                These tags will be appended to existing tags, not overwritten.
              </p>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-slate-200/50 dark:border-white/5 mt-8">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              Update {count} Photos
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkEditModal;