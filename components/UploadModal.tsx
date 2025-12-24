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
      <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-2xl w-full max-w-4xl rounded-3xl shadow-2xl border border-white/40 dark:border-white/20 flex flex-col max-h-[90vh] overflow-hidden transition-all ring-1 ring-black/5">

        {/* Header */}
        <div className="p-6 border-b border-white/30 dark:border-white/10 flex justify-between items-center bg-gradient-to-r from-white/40 to-white/20 dark:from-black/40 dark:to-black/20 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-pk-black dark:text-white flex items-center">
            <div className="p-3 bg-pk-orange/20 dark:bg-pk-orange/30 rounded-xl mr-3 shadow-lg border border-pk-orange/30 backdrop-blur-sm">
              <IconUpload className="w-6 h-6 text-pk-orange dark:text-pk-orange" />
            </div>
            Upload Photos
          </h2>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-pk-orange dark:hover:text-pk-orange transition-all duration-300 p-3 hover:bg-white/30 dark:hover:bg-white/10 rounded-full hover:scale-110">
            <IconX className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Side: File List & Drop Zone */}
          <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-white/20 dark:border-white/10 flex flex-col bg-white/20 dark:bg-black/20 backdrop-blur-sm">

            {/* Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="group border-2 border-dashed border-white/40 dark:border-white/20 hover:border-pk-orange dark:hover:border-pk-orange hover:bg-pk-orange/5 dark:hover:bg-pk-orange/10 rounded-2xl p-10 text-center transition-all duration-500 cursor-pointer mb-6 backdrop-blur-sm hover:shadow-xl hover:shadow-pk-orange/10"
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
                <div className="bg-white/60 dark:bg-white/10 group-hover:bg-pk-orange group-hover:text-white dark:group-hover:bg-pk-orange rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-5 text-pk-orange dark:text-pk-orange border-2 border-white/40 dark:border-transparent transition-all duration-300 shadow-lg group-hover:shadow-pk-orange/30 group-hover:scale-110">
                  <IconUpload className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-pk-black dark:text-white mb-2 uppercase tracking-wide">Click to upload or drag files</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">JPG, PNG, GIF (Max 10MB)</p>
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
                 <div key={idx} className="bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-white/40 dark:border-white/10 rounded-xl p-4 flex items-center gap-3 relative overflow-hidden group hover:border-pk-orange dark:hover:border-pk-orange transition-all duration-300 shadow-md hover:shadow-lg">
                    
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
          <div className="w-full md:w-1/2 p-6 overflow-y-auto bg-white/20 dark:bg-transparent backdrop-blur-sm">
             <div className="mb-6">
               <h3 className="text-pk-black dark:text-white font-bold mb-2 text-xl uppercase tracking-tight">Common Metadata</h3>
               <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">This metadata will be applied to all uploaded photos.</p>
             </div>

             <div className="space-y-5">
                 <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">Photographer</label>
                    <input
                      type="text"
                      value={photographer}
                      onChange={e => setPhotographer(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-white/50 dark:bg-black/30 backdrop-blur-sm border border-white/40 dark:border-white/20 rounded-xl px-4 py-3 text-pk-black dark:text-white placeholder-slate-500 dark:placeholder-slate-500 focus:ring-2 focus:ring-pk-orange/30 focus:border-pk-orange focus:bg-white/70 dark:focus:bg-black/50 focus:outline-none transition-all duration-300 shadow-sm"
                    />
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">Category</label>
                    <div className="relative group">
                      <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full bg-white/50 dark:bg-black/30 backdrop-blur-sm border border-white/40 dark:border-white/20 rounded-xl px-4 py-3 text-pk-black dark:text-white focus:ring-2 focus:ring-pk-orange/30 focus:border-pk-orange focus:bg-white/70 dark:focus:bg-black/50 focus:outline-none appearance-none transition-all duration-300 shadow-sm cursor-pointer"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c} className="bg-white dark:bg-slate-900 text-pk-black dark:text-white">{c}</option>)}
                      </select>
                      <div className="absolute right-3 top-3.5 pointer-events-none text-slate-500 dark:text-slate-400 group-hover:text-pk-orange">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">Date Taken</label>
                    <input
                      type="date"
                      value={dateTaken}
                      onChange={e => setDateTaken(e.target.value)}
                      className="w-full bg-white/50 dark:bg-black/30 backdrop-blur-sm border border-white/40 dark:border-white/20 rounded-xl px-4 py-3 text-pk-black dark:text-white focus:ring-2 focus:ring-pk-orange/30 focus:border-pk-orange focus:bg-white/70 dark:focus:bg-black/50 focus:outline-none transition-all duration-300 shadow-sm"
                    />
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">Tags</label>
                    <input
                      type="text"
                      value={tags}
                      onChange={e => setTags(e.target.value)}
                      placeholder="nature, project-alpha, 2023..."
                      className="w-full bg-white/50 dark:bg-black/30 backdrop-blur-sm border border-white/40 dark:border-white/20 rounded-xl px-4 py-3 text-pk-black dark:text-white placeholder-slate-500 dark:placeholder-slate-500 focus:ring-2 focus:ring-pk-orange/30 focus:border-pk-orange focus:bg-white/70 dark:focus:bg-black/50 focus:outline-none transition-all duration-300 shadow-sm"
                    />
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">Notes</label>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      rows={3}
                      className="w-full bg-white/50 dark:bg-black/30 backdrop-blur-sm border border-white/40 dark:border-white/20 rounded-xl px-4 py-3 text-pk-black dark:text-white placeholder-slate-500 dark:placeholder-slate-500 focus:ring-2 focus:ring-pk-orange/30 focus:border-pk-orange focus:bg-white/70 dark:focus:bg-black/50 focus:outline-none resize-none transition-all duration-300 shadow-sm"
                    />
                 </div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/30 dark:border-white/10 flex justify-end gap-3 bg-gradient-to-r from-white/40 to-white/20 dark:from-black/40 dark:to-black/20 backdrop-blur-sm">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:text-pk-black dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/10 rounded-xl transition-all duration-300 disabled:opacity-50 border border-white/30 dark:border-white/20"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={files.length === 0 || loading || (files.length === completed.length)}
            className={`px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 flex items-center shadow-xl ${
              files.length === 0 || loading || (files.length === completed.length)
                ? 'bg-slate-400 dark:bg-slate-700/50 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-pk-orange to-pk-orange/80 hover:from-pk-orange/90 hover:to-pk-orange/70 shadow-pk-orange/30 hover:shadow-pk-orange/50 hover:scale-105 active:scale-95'
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