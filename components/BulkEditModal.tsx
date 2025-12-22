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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900/80 backdrop-blur-xl w-full max-w-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-bold text-white flex items-center">
            <div className="p-2 bg-indigo-500/20 rounded-lg mr-3">
               <IconLayers className="w-5 h-5 text-indigo-400" />
            </div>
            Bulk Edit <span className="text-slate-400 text-sm font-normal ml-2">({count} Photos)</span>
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-full">
            <IconX className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <p className="text-sm text-slate-400 bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-lg flex items-start">
            <span className="text-indigo-400 mr-2 text-lg">ⓘ</span>
            Only filled fields will be updated. Leave fields blank to keep existing values.
          </p>
          
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Set Category</label>
            <div className="relative">
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/50 focus:bg-black/40 focus:outline-none appearance-none transition-all"
              >
                <option value="">-- No Change --</option>
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
              </select>
               <div className="absolute right-3 top-3.5 pointer-events-none">
                 <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
               </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Set Photographer</label>
            <input 
              type="text" 
              value={photographer} 
              onChange={e => setPhotographer(e.target.value)}
              placeholder="Keep existing"
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-slate-600 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/50 focus:bg-black/40 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Add Tags</label>
            <input 
              type="text" 
              value={tags} 
              onChange={e => setTags(e.target.value)}
              placeholder="tags, to, add..."
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-slate-600 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/50 focus:bg-black/40 focus:outline-none transition-all"
            />
            <p className="text-[10px] text-slate-500 mt-1.5 ml-1">These tags will be appended to existing tags.</p>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-white/5 mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
            >
              Update All
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkEditModal;