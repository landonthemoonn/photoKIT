import React, { useCallback, useState } from 'react';
import { CATEGORIES } from '../constants';
import { IconUpload, IconX, IconCheck } from './Icons';
import { Photo } from '../types';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (file: File, metadata: any) => Promise<void>;
  existingPhotos: Photo[];
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload, existingPhotos }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState<string[]>([]);
  const [duplicates, setDuplicates] = useState<string[]>([]);
  
  // Metadata state
  const [photographer, setPhotographer] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tags, setTags] = useState('');
  const [dateTaken, setDateTaken] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const checkDuplicates = (newFiles: File[]) => {
    const dupes: string[] = [];
    const validFiles: File[] = [];

    newFiles.forEach(file => {
      // Check for duplicate based on filename and size
      const isDupe = existingPhotos.some(
        p => (p.fileName === file.name || p.title === file.name.split('.')[0]) && p.fileSize === file.size
      );
      if (isDupe) {
        dupes.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    setDuplicates(prev => [...prev, ...dupes]);
    return validFiles;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files) as File[];
      const uniqueFiles = checkDuplicates(selectedFiles);
      setFiles(prev => [...prev, ...uniqueFiles]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = (Array.from(e.dataTransfer.files) as File[]).filter(f => f.type.startsWith('image/'));
      const uniqueFiles = checkDuplicates(droppedFiles);
      setFiles(prev => [...prev, ...uniqueFiles]);
    }
  }, [existingPhotos]);

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;

    setLoading(true);
    
    // Process files sequentially to show individual progress
    for (const file of files) {
      if (completed.includes(file.name)) continue;

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => ({
          ...prev,
          [file.name]: Math.min((prev[file.name] || 0) + 10, 90)
        }));
      }, 100);

      try {
        await onUpload(file, {
          title: file.name.split('.')[0], // Use filename as title by default
          photographer,
          category,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          dateTaken,
          notes
        });
        
        clearInterval(progressInterval);
        setProgress(prev => ({ ...prev, [file.name]: 100 }));
        setCompleted(prev => [...prev, file.name]);
      } catch (error) {
        console.error(`Failed to upload ${file.name}`, error);
        clearInterval(progressInterval);
      }
    }
    
    setLoading(false);
    setTimeout(onClose, 1000); // Close after brief delay
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xl w-full max-w-4xl rounded-2xl shadow-2xl border border-white/50 dark:border-white/10 flex flex-col max-h-[90vh] overflow-hidden transition-all ring-1 ring-black/5">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200/60 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
            <div className="p-2 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-lg mr-3 shadow-sm border border-indigo-200/20">
              <IconUpload className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            Upload Photos
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full">
            <IconX className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Side: File List & Drop Zone */}
          <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/5 flex flex-col bg-slate-50 dark:bg-black/20">
            
            {/* Drop Zone */}
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="group border-2 border-dashed border-slate-300 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 rounded-xl p-8 text-center transition-all duration-300 cursor-pointer mb-6"
            >
              <input 
                type="file" 
                accept="image/*" 
                multiple
                className="hidden" 
                id="file-upload"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                <div className="bg-white dark:bg-white/5 group-hover:bg-white dark:group-hover:bg-white/10 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4 text-indigo-500 dark:text-indigo-400 border border-slate-200 dark:border-transparent transition-colors shadow-sm">
                  <IconUpload className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-white mb-1">Click to upload or drag files</h3>
                <p className="text-slate-400 text-xs">JPG, PNG, GIF (Max 10MB)</p>
              </label>
            </div>

            {/* Duplicates Warning */}
            {duplicates.length > 0 && (
              <div className="mb-4 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 text-yellow-800 dark:text-yellow-200 text-xs p-3 rounded-xl">
                <p className="font-semibold mb-1 flex items-center">
                   <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2"></span>
                   Duplicates Skipped:
                </p>
                <p className="truncate text-yellow-600 dark:text-yellow-500/80 pl-3.5">{duplicates.join(', ')}</p>
              </div>
            )}

            {/* File List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
               {files.map((file, idx) => (
                 <div key={idx} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl p-3 flex items-center gap-3 relative overflow-hidden group hover:border-slate-300 dark:hover:border-white/10 transition-colors shadow-sm">
                    
                    {/* Thumbnail */}
                    <div className="w-12 h-12 bg-slate-100 dark:bg-black/50 rounded-lg flex-shrink-0 overflow-hidden ring-1 ring-slate-100 dark:ring-white/10">
                      <img src={URL.createObjectURL(file)} className="w-full h-full object-cover opacity-90" alt="" />
                    </div>
                    
                    {/* File Info */}
                    <div className="flex-1 min-w-0 z-10">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{file.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[10px] text-slate-400 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        {progress[file.name] !== undefined && (
                          <span className={`text-[10px] font-bold ${progress[file.name] === 100 ? 'text-emerald-500 dark:text-emerald-400' : 'text-indigo-500 dark:text-indigo-400'}`}>
                            {progress[file.name] === 100 ? 'Complete' : `${progress[file.name]}%`}
                          </span>
                        )}
                      </div>
                      
                      {/* Visual Progress Bar */}
                      {progress[file.name] !== undefined && (
                        <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                           <div 
                              className={`h-full transition-all duration-300 ${progress[file.name] === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                              style={{ width: `${progress[file.name]}%` }}
                           />
                        </div>
                      )}
                    </div>

                    {!loading && completed.indexOf(file.name) === -1 && (
                      <button 
                        onClick={() => removeFile(idx)}
                        className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 p-1.5 hover:bg-red-50 dark:hover:bg-white/5 rounded-full transition-colors"
                      >
                        <IconX className="w-4 h-4" />
                      </button>
                    )}
                    {completed.includes(file.name) && (
                      <div className="bg-emerald-500/10 dark:bg-emerald-500/20 p-1.5 rounded-full border border-emerald-500/20">
                        <IconCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    )}
                 </div>
               ))}
               {files.length === 0 && (
                 <div className="text-center text-slate-400 dark:text-slate-500 py-12 text-sm italic font-medium">
                   No files selected yet
                 </div>
               )}
            </div>
          </div>

          {/* Right Side: Metadata Form */}
          <div className="w-full md:w-1/2 p-6 overflow-y-auto bg-white dark:bg-transparent">
             <div className="mb-6">
               <h3 className="text-slate-800 dark:text-white font-bold mb-1 text-lg">Common Metadata</h3>
               <p className="text-xs text-slate-500 dark:text-slate-400">This metadata will be applied to all uploaded photos.</p>
             </div>

             <div className="space-y-5">
                 <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wide">Photographer</label>
                    <input 
                      type="text" 
                      value={photographer} 
                      onChange={e => setPhotographer(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white dark:focus:bg-black/40 focus:outline-none transition-all shadow-sm"
                    />
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wide">Category</label>
                    <div className="relative group">
                      <select 
                        value={category} 
                        onChange={e => setCategory(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white dark:focus:bg-black/40 focus:outline-none appearance-none transition-all shadow-sm"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{c}</option>)}
                      </select>
                      <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wide">Date Taken</label>
                    <input 
                      type="date" 
                      value={dateTaken} 
                      onChange={e => setDateTaken(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white dark:focus:bg-black/40 focus:outline-none transition-all shadow-sm"
                    />
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wide">Tags</label>
                    <input 
                      type="text" 
                      value={tags} 
                      onChange={e => setTags(e.target.value)}
                      placeholder="nature, project-alpha, 2023..."
                      className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white dark:focus:bg-black/40 focus:outline-none transition-all shadow-sm"
                    />
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wide">Notes</label>
                    <textarea 
                      value={notes} 
                      onChange={e => setNotes(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white dark:focus:bg-black/40 focus:outline-none resize-none transition-all shadow-sm"
                    />
                 </div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200/60 dark:border-white/5 flex justify-end gap-3 bg-slate-50/50 dark:bg-white/[0.02]">
          <button 
            type="button" 
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={files.length === 0 || loading || (files.length === completed.length)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all flex items-center shadow-lg ${
              files.length === 0 || loading || (files.length === completed.length)
                ? 'bg-slate-300 dark:bg-slate-700/50 cursor-not-allowed opacity-50' 
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <>
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                 Uploading...
              </>
            ) : completed.length > 0 ? 'All Uploaded' : `Upload ${files.length} Photos`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;