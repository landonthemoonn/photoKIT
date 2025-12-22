import React, { useState, useEffect, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { Photo } from '../types';
import { IconX, IconTrash, IconDownload, IconTag, IconCalendar, IconUser, IconCrop, IconCheck } from './Icons';

interface DetailModalProps {
  photo: Photo | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Photo>) => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ photo, onClose, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Photo>>({});
  
  // Cropper State
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  useEffect(() => {
    if (photo) {
      setEditForm({
        title: photo.title,
        photographer: photo.photographer,
        notes: photo.notes,
        tags: photo.tags,
      });
      setIsEditing(false);
      setIsCropping(false);
    }
  }, [photo]);

  if (!photo) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = photo.fileName || `${photo.title.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this asset?')) {
      onDelete(photo.id);
      onClose();
    }
  };

  const handleSaveMetadata = () => {
    onUpdate(photo.id, editForm);
    setIsEditing(false);
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: any) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        resolve(URL.createObjectURL(blob));
      }, 'image/jpeg');
    });
  };

  const handleSaveCrop = async () => {
    try {
      const croppedImageUrl = await getCroppedImg(photo.url, croppedAreaPixels);
      if (croppedImageUrl) {
        onUpdate(photo.id, { url: croppedImageUrl });
        setIsCropping(false);
      }
    } catch (e) {
      console.error(e);
      alert('Could not crop image');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-lg p-4 animate-in fade-in duration-300">
      <div className="bg-white/95 dark:bg-zinc-900/90 backdrop-blur-2xl w-full max-w-6xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/20 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5 transition-all">
        
        {/* Close Button Mobile */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full md:hidden hover:bg-black/70"
        >
          <IconX className="w-5 h-5" />
        </button>

        {/* Image Section */}
        <div className="flex-1 bg-slate-100 dark:bg-black/50 flex items-center justify-center p-4 relative overflow-hidden h-[50vh] md:h-auto border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/5">
          {isCropping ? (
            <div className="absolute inset-0 z-20">
               <Cropper
                image={photo.url}
                crop={crop}
                zoom={zoom}
                aspect={undefined}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                style={{ containerStyle: { background: 'rgba(0,0,0,0.8)' } }}
              />
              <div className="absolute bottom-6 left-0 right-0 flex justify-center z-30 pointer-events-none">
                  <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-3 rounded-xl flex items-center gap-4 border border-slate-200 dark:border-white/10 shadow-xl pointer-events-auto">
                     <span className="text-slate-700 dark:text-white text-xs font-bold uppercase tracking-wide">Zoom</span>
                     <input
                      type="range"
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      aria-labelledby="Zoom"
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-32 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
              </div>
            </div>
          ) : (
            <img 
              src={photo.url} 
              alt={photo.title} 
              className="max-w-full max-h-[85vh] object-contain shadow-2xl drop-shadow-2xl" 
            />
          )}
        </div>

        {/* Sidebar Info */}
        <div className="w-full md:w-96 bg-white/60 dark:bg-zinc-900/60 flex flex-col h-[50vh] md:h-auto z-10 relative">
          {/* Header */}
          <div className="p-5 border-b border-slate-200/60 dark:border-white/5 flex justify-between items-start bg-white/40 dark:bg-white/[0.02]">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate pr-4 leading-tight">
              {isEditing ? 'Edit Metadata' : (isCropping ? 'Crop Image' : photo.title)}
            </h2>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-800 dark:text-slate-500 dark:hover:text-white transition-colors hidden md:block hover:bg-slate-100 dark:hover:bg-white/10 p-1.5 rounded-full"
            >
              <IconX className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
            
            {/* Quick Actions (Hide when editing/cropping) */}
            {!isEditing && !isCropping && (
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleDownload}
                  className="bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 py-2.5 px-4 rounded-xl flex items-center justify-center text-sm font-semibold transition-colors border border-slate-200 dark:border-white/5 shadow-sm"
                >
                  <IconDownload className="w-4 h-4 mr-2 opacity-70" />
                  Download
                </button>
                <button 
                   onClick={() => setIsCropping(true)}
                   className="bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 py-2.5 px-4 rounded-xl flex items-center justify-center text-sm font-semibold transition-colors border border-slate-200 dark:border-white/5 shadow-sm"
                >
                  <IconCrop className="w-4 h-4 mr-2 opacity-70" />
                  Crop
                </button>
                <button 
                  onClick={handleDelete}
                  className="col-span-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 py-2.5 px-3 rounded-xl border border-red-200 dark:border-red-500/20 transition-colors flex items-center justify-center text-sm font-semibold hover:border-red-300 dark:hover:border-red-500/30"
                >
                  <IconTrash className="w-4 h-4 mr-2" />
                  Delete Asset
                </button>
              </div>
            )}

            {isCropping && (
               <div className="text-center py-4">
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 px-4">Adjust the crop by dragging the image or using the zoom slider.</p>
                  <div className="flex space-x-3">
                     <button 
                        onClick={() => setIsCropping(false)}
                        className="flex-1 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 transition-colors font-semibold text-sm"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveCrop}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-2.5 rounded-xl transition-colors flex items-center justify-center font-semibold text-sm shadow-lg shadow-indigo-500/20"
                      >
                        <IconCheck className="w-4 h-4 mr-2" />
                        Apply Crop
                      </button>
                  </div>
               </div>
            )}

            {/* Metadata Fields (Hidden when cropping) */}
            {!isCropping && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block">Title</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:outline-none focus:border-indigo-500 shadow-sm"
                  />
                ) : (
                  <p className="text-slate-800 dark:text-slate-100 text-lg leading-snug font-medium">{photo.title}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block">Photographer</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editForm.photographer}
                    onChange={(e) => setEditForm({...editForm, photographer: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:outline-none focus:border-indigo-500 shadow-sm"
                  />
                ) : (
                  <div className="flex items-center text-slate-700 dark:text-slate-300 font-medium">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center mr-3 text-indigo-600 dark:text-indigo-400">
                      <IconUser className="w-4 h-4" />
                    </div>
                    {photo.photographer}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block">Category</label>
                  <p className="text-slate-700 dark:text-slate-300 text-sm bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 px-3 py-2.5 rounded-xl font-medium">{photo.category}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block">Date Taken</label>
                  <p className="text-slate-700 dark:text-slate-300 text-sm bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 px-3 py-2.5 rounded-xl flex items-center font-medium">
                    <IconCalendar className="w-3.5 h-3.5 mr-2 opacity-60" />
                    {photo.dateTaken}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block">Tags</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editForm.tags?.join(', ')}
                    onChange={(e) => setEditForm({...editForm, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)})}
                    placeholder="Separate with commas"
                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:outline-none focus:border-indigo-500 shadow-sm"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {photo.tags.map(tag => (
                      <span key={tag} className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-100 dark:border-indigo-500/20 flex items-center">
                        <IconTag className="w-3 h-3 mr-1.5 opacity-70" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block">Technical Details</label>
                <div className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Filename</span>
                    <span className="text-slate-700 dark:text-slate-300 font-mono truncate max-w-[180px]">{photo.fileName || '-'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Dimensions</span>
                    <span className="text-slate-700 dark:text-slate-300 font-mono">{photo.dimensions.width} x {photo.dimensions.height}px</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">File Size</span>
                    <span className="text-slate-700 dark:text-slate-300 font-mono">{(photo.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Type</span>
                    <span className="text-slate-700 dark:text-slate-300 font-mono uppercase">{photo.fileType.split('/')[1] || 'Unknown'}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block">Notes</label>
                {isEditing ? (
                  <textarea 
                    value={editForm.notes}
                    onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                    rows={4}
                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:outline-none focus:border-indigo-500 resize-none text-sm shadow-sm"
                  />
                ) : (
                  <p className="text-slate-600 dark:text-slate-400 text-sm italic border-l-4 border-slate-200 dark:border-white/10 pl-4 py-1 leading-relaxed">
                    {photo.notes || 'No notes added.'}
                  </p>
                )}
              </div>
            </div>
            )}
          </div>

          {/* Footer Actions */}
          {!isCropping && (
          <div className="p-6 border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
            {isEditing ? (
              <div className="flex space-x-3">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 transition-colors font-semibold text-sm shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveMetadata}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-2.5 rounded-xl transition-colors shadow-lg shadow-indigo-500/20 font-semibold text-sm hover:-translate-y-0.5"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-200 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 transition-colors font-semibold text-sm shadow-sm"
              >
                Edit Metadata
              </button>
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailModal;