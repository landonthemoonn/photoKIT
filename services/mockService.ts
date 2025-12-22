import { Photo } from '../types';
import { INITIAL_PHOTOS_SEED } from '../constants';

// In a real app, this would be `firebase/firestore` and `firebase/storage` code.
// We are simulating persistence with localStorage for the demo.

const STORAGE_KEY = 'photokit_library_v1';

export const photoService = {
  getAllPhotos: async (): Promise<Photo[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600)); 
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Seed initial data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PHOTOS_SEED));
      return INITIAL_PHOTOS_SEED as Photo[];
    }
    return JSON.parse(stored) as Photo[];
  },

  uploadPhoto: async (file: File, metadata: Partial<Photo>): Promise<Photo> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate slightly faster upload for multi-file

    // Create a local object URL to simulate a hosted image URL
    // In a real app: const snapshot = await uploadBytes(storageRef, file); const url = await getDownloadURL(snapshot.ref);
    const objectUrl = URL.createObjectURL(file);
    
    // Auto-extract dimensions (simple version)
    const dimensions = await new Promise<{width: number, height: number}>((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.src = objectUrl;
    });

    const newPhoto: Photo = {
      id: `ph_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url: objectUrl,
      title: metadata.title || file.name.split('.')[0],
      fileName: file.name,
      photographer: metadata.photographer || 'Unknown',
      dateTaken: metadata.dateTaken || new Date().toISOString().split('T')[0],
      uploadedAt: new Date().toISOString(),
      tags: metadata.tags || [],
      category: metadata.category || 'Uncategorized',
      notes: metadata.notes || '',
      fileSize: file.size,
      dimensions: dimensions,
      fileType: file.type,
    };

    // Update local storage
    const currentPhotos = await photoService.getAllPhotos();
    const updatedPhotos = [newPhoto, ...currentPhotos];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPhotos));

    return newPhoto;
  },

  deletePhoto: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const currentPhotos = await photoService.getAllPhotos();
    const updatedPhotos = currentPhotos.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPhotos));
  },

  updatePhoto: async (id: string, updates: Partial<Photo>): Promise<Photo> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const currentPhotos = await photoService.getAllPhotos();
    const index = currentPhotos.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Photo not found");
    
    const updatedPhoto = { ...currentPhotos[index], ...updates };
    currentPhotos[index] = updatedPhoto;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPhotos));
    return updatedPhoto;
  }
};