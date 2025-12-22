export interface Photo {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  fileName: string; // Added for duplicate detection
  photographer: string;
  dateTaken: string; // ISO Date string
  uploadedAt: string; // ISO Date string
  tags: string[];
  category: string;
  notes: string;
  fileSize: number; // in bytes
  dimensions: {
    width: number;
    height: number;
  };
  fileType: string;
}

export type PhotoFilter = {
  searchQuery: string;
  category: string | 'All';
  photographer: string | 'All';
  dateRange: 'All' | 'Last 7 Days' | 'Last 30 Days' | 'This Year';
  tags: string[];
};

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
}
