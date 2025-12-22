import React, { useState, useEffect, useMemo } from 'react';
import { Photo, PhotoFilter } from './types';
import { photoService } from './services/mockService';
import Sidebar from './components/Sidebar';
import PhotoCard from './components/PhotoCard';
import UploadModal from './components/UploadModal';
import DetailModal from './components/DetailModal';
import BulkEditModal from './components/BulkEditModal';
import { IconSearch, IconPlus, IconFilter, IconCheck, IconX, IconLayers, IconFileText, IconEdit } from './components/Icons';

function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Selection Mode State
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [filters, setFilters] = useState<PhotoFilter>({
    searchQuery: '',
    category: 'All',
    photographer: 'All',
    dateRange: 'All',
    tags: []
  });

  // Load photos on mount
  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    setLoading(true);
    try {
      const data = await photoService.getAllPhotos();
      setPhotos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File, metadata: any) => {
    try {
      await photoService.uploadPhoto(file, metadata);
      await loadPhotos(); // Refresh grid
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Photo>) => {
    try {
      const updated = await photoService.updatePhoto(id, updates);
      setPhotos(prev => prev.map(p => p.id === id ? updated : p));
      if (selectedPhoto && selectedPhoto.id === id) {
        setSelectedPhoto(updated);
      }
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await photoService.deletePhoto(id);
      setPhotos(prev => prev.filter(p => p.id !== id));
      setSelectedPhoto(null);
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  // Selection Logic
  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCardClick = (photo: Photo) => {
    if (selectionMode) {
      toggleSelection(photo.id);
    } else {
      setSelectedPhoto(photo);
    }
  };

  const toggleSelectionMode = () => {
    if (selectionMode) {
      setSelectionMode(false);
      setSelectedIds(new Set());
    } else {
      setSelectionMode(true);
    }
  };

  // Bulk Actions
  const handleBulkUpdate = async (updates: { category?: string; photographer?: string; addTags?: string[] }) => {
    try {
      const promises = (Array.from(selectedIds) as string[]).map(async (id) => {
        const photo = photos.find(p => p.id === id);
        if (!photo) return;
        
        const newMetadata: Partial<Photo> = {};
        if (updates.category) newMetadata.category = updates.category;
        if (updates.photographer) newMetadata.photographer = updates.photographer;
        if (updates.addTags && updates.addTags.length > 0) {
          // Merge tags unique
          newMetadata.tags = Array.from(new Set([...photo.tags, ...updates.addTags])) as string[];
        }

        if (Object.keys(newMetadata).length > 0) {
           await photoService.updatePhoto(id, newMetadata);
        }
      });
      
      await Promise.all(promises);
      await loadPhotos();
      setSelectionMode(false);
      setSelectedIds(new Set());
    } catch (error) {
      console.error("Bulk update failed", error);
      alert('Failed to update some photos');
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'File Name', 'Photographer', 'Date Taken', 'Category', 'Tags', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...photos.map(p => [
        p.id,
        `"${p.title.replace(/"/g, '""')}"`, // Escape quotes
        `"${(p.fileName || '').replace(/"/g, '""')}"`,
        `"${p.photographer.replace(/"/g, '""')}"`,
        p.dateTaken,
        p.category,
        `"${p.tags.join(';')}"`,
        `"${p.notes.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `photokit_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };


  // Filter Logic
  const filteredPhotos = useMemo(() => {
    return photos.filter(photo => {
      // Search
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        photo.title.toLowerCase().includes(query) || 
        photo.tags.some(t => t.toLowerCase().includes(query)) ||
        photo.photographer.toLowerCase().includes(query) ||
        (photo.fileName && photo.fileName.toLowerCase().includes(query));

      // Category
      const matchesCategory = filters.category === 'All' || photo.category === filters.category;

      // Tags
      const matchesTags = filters.tags.length === 0 || filters.tags.every(t => photo.tags.includes(t));

      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [photos, filters]);

  // Extract unique tags for sidebar
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    photos.forEach(p => p.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [photos]);

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans">
      
      {/* Sidebar - Desktop */}
      <Sidebar filters={filters} setFilters={setFilters} availableTags={allTags} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-transparent">
        
        {/* Top Navigation Bar */}
        <header className="h-20 border-b border-white/5 bg-slate-900/30 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center flex-1">
            {/* Mobile Menu Trigger */}
            <button className="lg:hidden mr-4" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <IconFilter className="w-6 h-6 text-slate-400" />
            </button>
            
            {/* Search Bar */}
            <div className="relative w-full max-w-lg hidden md:block group">
              <IconSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="text"
                placeholder="Search photos, tags, metadata..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({...prev, searchQuery: e.target.value}))}
                className="w-full bg-black/20 border border-white/5 hover:border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/50 focus:bg-black/40 focus:outline-none transition-all placeholder-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Selection/Bulk Actions Toolbar */}
            {selectionMode ? (
               <div className="flex items-center bg-indigo-500/10 backdrop-blur-md rounded-full px-4 py-1.5 border border-indigo-500/20 animate-in slide-in-from-top-2">
                 <span className="text-sm font-medium text-indigo-200 mr-3">{selectedIds.size} selected</span>
                 {selectedIds.size > 0 && (
                   <button 
                    onClick={() => setIsBulkEditOpen(true)}
                    className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-full mr-2 flex items-center shadow-lg shadow-indigo-500/20 transition-all"
                   >
                     <IconEdit className="w-3 h-3 mr-1" />
                     Edit
                   </button>
                 )}
                 <button onClick={toggleSelectionMode} className="text-slate-400 hover:text-white transition-colors">
                   <IconX className="w-4 h-4" />
                 </button>
               </div>
            ) : (
               <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/5 backdrop-blur-sm">
                 <button 
                  onClick={toggleSelectionMode}
                  className="text-slate-400 hover:text-indigo-300 p-2 rounded-full hover:bg-white/10 transition-colors relative group"
                  title="Select Photos"
                 >
                   <IconLayers className="w-5 h-5" />
                   <span className="absolute top-full right-0 mt-2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Select</span>
                 </button>
                 <button 
                  onClick={handleExportCSV}
                  className="text-slate-400 hover:text-emerald-300 p-2 rounded-full hover:bg-white/10 transition-colors relative group"
                  title="Export Metadata CSV"
                 >
                   <IconFileText className="w-5 h-5" />
                   <span className="absolute top-full right-0 mt-2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Export CSV</span>
                 </button>
               </div>
            )}

            <button 
              onClick={() => setIsUploadOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold flex items-center transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5"
            >
              <IconPlus className="w-4 h-4 mr-2" />
              Upload
            </button>
          </div>
        </header>

        {/* Scrollable Grid Area */}
        <main className="flex-1 overflow-y-auto p-8 scrollbar-thin">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
          ) : filteredPhotos.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center tracking-tight">
                   Library 
                   <span className="ml-3 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-slate-400 text-xs font-medium">{filteredPhotos.length} assets</span>
                </h2>
                {selectionMode && (
                  <button 
                    onClick={() => {
                        if (selectedIds.size === filteredPhotos.length) setSelectedIds(new Set());
                        else setSelectedIds(new Set(filteredPhotos.map(p => p.id)));
                    }}
                    className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    {selectedIds.size === filteredPhotos.length ? 'Deselect All' : 'Select All'}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 pb-12">
                {filteredPhotos.map(photo => (
                  <PhotoCard 
                    key={photo.id} 
                    photo={photo} 
                    onClick={handleCardClick}
                    selectionMode={selectionMode}
                    selected={selectedIds.has(photo.id)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-3/4 text-center">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/10">
                <IconSearch className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No photos found</h3>
              <p className="text-slate-400 max-w-sm mb-8 leading-relaxed">Try adjusting your filters or upload some new photos to populate your library.</p>
              <button 
                onClick={() => setFilters({searchQuery: '', category: 'All', photographer: 'All', dateRange: 'All', tags: []})}
                className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline underline-offset-4"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {isUploadOpen && (
        <UploadModal 
          onClose={() => setIsUploadOpen(false)} 
          onUpload={handleUpload} 
          existingPhotos={photos} // Pass photos for dup check
        />
      )}
      
      {selectedPhoto && (
        <DetailModal 
          photo={selectedPhoto} 
          onClose={() => setSelectedPhoto(null)} 
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      )}

      {isBulkEditOpen && (
        <BulkEditModal 
          count={selectedIds.size}
          onClose={() => setIsBulkEditOpen(false)}
          onSave={handleBulkUpdate}
        />
      )}

      {/* Mobile Sidebar (Overlay) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="absolute left-0 top-0 bottom-0 w-3/4 max-w-xs bg-slate-900 shadow-2xl z-50">
             <Sidebar filters={filters} setFilters={setFilters} availableTags={allTags} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;