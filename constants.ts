
export const CATEGORIES = [
  'Portrait',
  'Landscape',
  'Urban',
  'Nature',
  'Event',
  'Product',
  'Architecture',
  'Abstract',
  'Other'
];

export const MOCK_USERS = [
  {
    uid: 'user_001',
    displayName: 'Alex Shooter',
    email: 'alex@photokit.com',
    licenseId: 'PRO_LICENSE_8842',
    initials: 'AS'
  },
  {
    uid: 'user_002',
    displayName: 'Sarah Lens',
    email: 'sarah@photokit.com',
    licenseId: 'STD_LICENSE_9910',
    initials: 'SL'
  }
];

export const INITIAL_PHOTOS_SEED = [
  {
    id: 'ph_001',
    title: 'Mountain Sunrise',
    fileName: 'mountain_sunrise_001.jpg',
    url: 'https://picsum.photos/seed/mountain/1200/800',
    photographer: 'Jane Doe',
    dateTaken: '2023-10-15',
    uploadedAt: '2023-10-16T10:00:00Z',
    tags: ['nature', 'mountain', 'morning', 'fog'],
    category: 'Landscape',
    notes: 'Shot with 85mm lens at dawn.',
    fileSize: 2500000,
    dimensions: { width: 1200, height: 800 },
    fileType: 'image/jpeg'
  },
  {
    id: 'ph_002',
    title: 'Urban Geometry',
    fileName: 'urban_geo_v2.jpg',
    url: 'https://picsum.photos/seed/architecture/1200/800',
    photographer: 'Alex Shooter',
    dateTaken: '2023-11-02',
    uploadedAt: '2023-11-03T14:20:00Z',
    tags: ['city', 'building', 'lines', 'concrete'],
    category: 'Architecture',
    notes: 'Looking up from the financial district.',
    fileSize: 1800000,
    dimensions: { width: 1200, height: 800 },
    fileType: 'image/jpeg'
  },
  {
    id: 'ph_003',
    title: 'Neon Portraits',
    fileName: 'neon_portraits_final.jpg',
    url: 'https://picsum.photos/seed/portrait/1200/800',
    photographer: 'Sarah Lee',
    dateTaken: '2023-09-20',
    uploadedAt: '2023-09-21T09:15:00Z',
    tags: ['portrait', 'neon', 'night', 'cyberpunk'],
    category: 'Portrait',
    notes: 'Experimental lighting setup.',
    fileSize: 3200000,
    dimensions: { width: 1200, height: 800 },
    fileType: 'image/jpeg'
  }
];
