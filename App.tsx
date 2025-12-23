import React, { useState, useEffect, useMemo } from 'react';
import { Photo, PhotoFilter } from './types';
import { photoService } from './services/mockService';
import { MOCK_USERS } from './constants';
import Sidebar from './components/Sidebar';
import PhotoCard from './components/PhotoCard';
import UploadModal from './components/UploadModal';
import DetailModal from './components/DetailModal';
import BulkEditModal from './components/BulkEditModal';
import { IconSearch, IconPlus, IconFilter, IconCheck, IconX, IconLayers, IconFileText, IconEdit, IconSun, IconMoon } from './components/Icons';

function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // User State
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const currentUser = MOCK_USERS[currentUserIndex];

  const handleSwitchUser = () => {
    setCurrentUserIndex((prev) => (prev + 1) % MOCK_USERS.length);
  };
  
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

  // Handle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
      await loadPhotos(); 
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
        `"${p.title.replace(/"/g, '""')}"`, 
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
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        photo.title.toLowerCase().includes(query) || 
        photo.tags.some(t => t.toLowerCase().includes(query)) ||
        photo.photographer.toLowerCase().includes(query) ||
        (photo.fileName && photo.fileName.toLowerCase().includes(query));

      const matchesCategory = filters.category === 'All' || photo.category === filters.category;
      const matchesTags = filters.tags.length === 0 || filters.tags.every(t => photo.tags.includes(t));

      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [photos, filters]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    photos.forEach(p => p.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [photos]);

  return (
    // Main "Device" Container - The white rounded card from the screenshot
    <div className="w-full h-full max-w-[1600px] max-h-[95vh] bg-pk-panel/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-device overflow-hidden border border-white/40 dark:border-white/5 flex flex-col relative ring-1 ring-black/5">
      
      {/* Decorative Blur Top Right (screenshot glow) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-pk-orange/20 to-transparent rounded-full blur-3xl pointer-events-none -z-0 mix-blend-multiply dark:mix-blend-screen" />
      
      {/* Header - Pill Style Navigation */}
      <header className="h-24 flex items-center justify-between px-8 z-20 shrink-0">
        
        {/* Left: Brand / Pill Nav */}
        <div className="flex items-center gap-4">
           {/* Logo */}
           <div className="h-14 w-14 rounded-xl bg-white dark:bg-black flex items-center justify-center shadow-lg border border-black/10 dark:border-white/10 p-2 hover:scale-105 transition-transform">
             <img src="/public/images/photokit-icon.svg" alt="PhotoKIT" className="w-full h-full" />
           </div>

           {/* Nav Pills */}
           <div className="hidden md:flex bg-white/50 dark:bg-black/20 p-1.5 rounded-full backdrop-blur-sm border border-black/5 dark:border-white/5 shadow-inner-light gap-1">
             <button className="px-5 py-2 rounded-full bg-pk-orange text-white text-xs font-bold tracking-wider shadow-sm transition-all hover:scale-105 uppercase">
               Library
             </button>
             <button className="px-5 py-2 rounded-full text-slate-600 dark:text-slate-400 text-xs font-bold tracking-wider hover:bg-white/50 dark:hover:bg-white/5 transition-all uppercase">
               Albums
             </button>
             <button className="px-5 py-2 rounded-full text-slate-600 dark:text-slate-400 text-xs font-bold tracking-wider hover:bg-white/50 dark:hover:bg-white/5 transition-all uppercase">
               Analytics
             </button>
           </div>
        </div>

        {/* Center: Search Pill (Floating) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 hidden lg:block w-96 z-30">
          <div className="relative group">
            <input
              type="text"
              placeholder="SEARCH DATABASE..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({...prev, searchQuery: e.target.value}))}
              className="w-full h-14 bg-white/40 dark:bg-black/40 backdrop-blur-xl border-2 border-white/30 dark:border-white/20 focus:border-pk-orange rounded-full pl-14 pr-6 text-sm font-mono text-pk-black dark:text-white focus:outline-none transition-all duration-300 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-pk-orange/10 placeholder-slate-500 dark:placeholder-slate-400 uppercase tracking-widest focus:ring-4 focus:ring-pk-orange/20"
            />
            <IconSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 w-5 h-5 group-focus-within:text-pk-orange group-focus-within:scale-110 transition-all duration-300" />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
            {/* Dark Mode Toggle - Tiny Pill */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-12 h-12 rounded-full bg-white dark:bg-black border border-black/5 dark:border-white/10 flex items-center justify-center text-slate-500 hover:text-pk-orange transition-colors shadow-sm"
            >
              {darkMode ? <IconSun className="w-5 h-5" /> : <IconMoon className="w-5 h-5" />}
            </button>

            {/* Selection Toolbar */}
            {selectionMode ? (
               <div className="flex items-center bg-pk-black text-white rounded-full pl-5 pr-2 py-2 gap-4 shadow-xl animate-in fade-in slide-in-from-top-4">
                 <span className="text-xs font-mono font-bold uppercase tracking-wider">{selectedIds.size} SELECTED</span>
                 <div className="flex gap-1">
                  {selectedIds.size > 0 && (
                    <button 
                      onClick={() => setIsBulkEditOpen(true)}
                      className="h-8 px-4 rounded-full bg-pk-orange text-white text-xs font-bold uppercase hover:bg-white hover:text-pk-orange transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  <button onClick={toggleSelectionMode} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors">
                    <IconX className="w-4 h-4" />
                  </button>
                 </div>
               </div>
            ) : (
               <>
                 <button 
                  onClick={toggleSelectionMode}
                  className="h-12 px-5 rounded-full bg-white dark:bg-black border border-black/5 dark:border-white/10 text-xs font-bold tracking-widest uppercase hover:bg-slate-100 dark:hover:bg-white/10 transition-all flex items-center gap-2"
                 >
                   Select
                 </button>
                 <button 
                  onClick={handleExportCSV}
                  className="h-12 w-12 rounded-full bg-white dark:bg-black border border-black/5 dark:border-white/10 flex items-center justify-center hover:text-pk-orange transition-colors"
                  title="Export"
                 >
                   <IconFileText className="w-5 h-5" />
                 </button>
               </>
            )}

            {/* Upload Button - The Primary Call to Action */}
            <button 
              onClick={() => setIsUploadOpen(true)}
              className="h-12 px-6 rounded-full bg-pk-black dark:bg-white text-white dark:text-pk-black text-xs font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2 group"
            >
              Upload <IconPlus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            </button>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Sidebar */}
        <div className={`
          absolute lg:relative z-40 h-full w-72 bg-white/40 dark:bg-black/40 backdrop-blur-xl border-r border-white/20 dark:border-white/5 transition-transform duration-300
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <Sidebar 
            filters={filters} 
            setFilters={setFilters} 
            availableTags={allTags}
            user={currentUser}
            onSwitchUser={handleSwitchUser}
          />
        </div>

        {/* Content Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-transparent">
          
          {/* Content Header */}
          <div className="h-16 flex items-center justify-between px-8 border-b border-black/5 dark:border-white/5">
            <h2 className="text-4xl font-black tracking-tighter uppercase text-pk-black dark:text-white opacity-90">
              Assets <span className="text-pk-orange">.</span>
            </h2>
            
            <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
               <span>TOTAL: {filteredPhotos.length}</span>
               {selectionMode && (
                 <button 
                    onClick={() => {
                        if (selectedIds.size === filteredPhotos.length) setSelectedIds(new Set());
                        else setSelectedIds(new Set(filteredPhotos.map(p => p.id)));
                    }}
                    className="text-pk-orange hover:underline font-bold"
                  >
                    {selectedIds.size === filteredPhotos.length ? 'DESELECT ALL' : 'SELECT ALL'}
                  </button>
               )}
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-16 h-16 border-4 border-pk-black/10 border-t-pk-orange rounded-full animate-spin"></div>
              </div>
            ) : filteredPhotos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
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
            ) : (
              <div className="flex flex-col items-center justify-center h-3/4 text-center opacity-60">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-400 flex items-center justify-center mb-6">
                  <IconSearch className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-wider mb-2">No Assets Found</h3>
                <button 
                  onClick={() => setFilters({searchQuery: '', category: 'All', photographer: 'All', dateRange: 'All', tags: []})}
                  className="text-pk-orange font-mono text-xs font-bold hover:underline"
                >
                  RESET_FILTERS
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Overlay for Mobile Sidebar */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </div>

      {/* Modals */}
      {isUploadOpen && (
        <UploadModal 
          onClose={() => setIsUploadOpen(false)} 
          onUpload={handleUpload} 
          existingPhotos={photos} 
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
    </div>
  );
}

export default App;