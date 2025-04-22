
export interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  scheduledAt?: Date | string;
  status: 'draft' | 'scheduled' | 'published';
  platform: 'facebook' | 'instagram';
  stats?: {
    likes: number;
    comments: number;
    shares: number;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface AnalyticsData {
  date: string;
  likes: number;
  comments: number;
  shares: number;
}

export interface Platform {
  id: string;
  name: 'facebook' | 'instagram';
  connected: boolean;
  pages?: {
    id: string;
    name: string;
    imageUrl?: string;
  }[];
}
