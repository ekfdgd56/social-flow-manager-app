import { Post, Platform, AnalyticsData } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Mock data
const MOCK_POSTS: Post[] = [
  {
    id: "post1",
    content: "Excited to announce our new product launch! #innovation #tech",
    imageUrl: "https://placehold.co/600x400/9b87f5/FFFFFF",
    scheduledAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    status: "scheduled",
    platform: "facebook",
    stats: {
      likes: 0,
      comments: 0,
      shares: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "post2",
    content: "Check out our latest blog post on social media trends in 2023!",
    imageUrl: "https://placehold.co/600x400/9b87f5/FFFFFF",
    status: "published",
    platform: "instagram",
    stats: {
      likes: 45,
      comments: 12,
      shares: 5
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "post3",
    content: "Working on a draft for next week's big announcement...",
    status: "draft",
    platform: "facebook",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const MOCK_PLATFORMS: Platform[] = [
  {
    id: "platform1",
    name: "facebook",
    connected: true,
    pages: [
      {
        id: "page1",
        name: "Business Page",
        imageUrl: "https://placehold.co/100x100/9b87f5/FFFFFF"
      }
    ]
  },
  {
    id: "platform2",
    name: "instagram",
    connected: true,
    pages: [
      {
        id: "page2",
        name: "Instagram Business",
        imageUrl: "https://placehold.co/100x100/9b87f5/FFFFFF"
      }
    ]
  }
];

const MOCK_ANALYTICS: AnalyticsData[] = [
  { date: "2023-04-15", likes: 45, comments: 12, shares: 5 },
  { date: "2023-04-16", likes: 38, comments: 8, shares: 3 },
  { date: "2023-04-17", likes: 62, comments: 15, shares: 8 },
  { date: "2023-04-18", likes: 43, comments: 9, shares: 4 },
  { date: "2023-04-19", likes: 54, comments: 11, shares: 7 },
  { date: "2023-04-20", likes: 74, comments: 18, shares: 12 },
  { date: "2023-04-21", likes: 82, comments: 24, shares: 15 }
];

// In a real app, this would be stored in a user-specific way
const userPosts = new Map<string, Post[]>();

// API service for posts
export const postService = {
  getPosts: async (): Promise<Post[]> => {
    // Try to get the current user
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    // If we have a logged-in user and they have posts, return those
    if (userId && userPosts.has(userId)) {
      return [...userPosts.get(userId)!];
    }
    
    // Otherwise return mock data (or in a real app, fetch from database)
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // If user is logged in, associate these posts with them
    if (userId) {
      userPosts.set(userId, [...MOCK_POSTS]);
    }
    
    return [...MOCK_POSTS];
  },
  
  getPostById: async (id: string): Promise<Post> => {
    // Try to get the current user
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    // If we have a logged-in user and they have posts, search those
    if (userId && userPosts.has(userId)) {
      const post = userPosts.get(userId)!.find(post => post.id === id);
      if (post) {
        return { ...post };
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    const post = MOCK_POSTS.find(post => post.id === id);
    
    if (!post) {
      throw new Error("Post not found");
    }
    
    return { ...post };
  },
  
  createPost: async (postData: Omit<Post, "id" | "createdAt" | "updatedAt" | "stats">): Promise<Post> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newPost: Post = {
      id: `post${Date.now()}`,
      ...postData,
      stats: { likes: 0, comments: 0, shares: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    // If we have a logged-in user, associate the post with them
    if (userId) {
      if (!userPosts.has(userId)) {
        userPosts.set(userId, []);
      }
      userPosts.get(userId)!.push(newPost);
    } else {
      // Fallback to mock data if not logged in
      MOCK_POSTS.push(newPost);
    }
    
    return { ...newPost };
  },
  
  updatePost: async (id: string, postData: Partial<Post>): Promise<Post> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    let targetPosts = MOCK_POSTS;
    
    // If we have a logged-in user and they have posts, update those
    if (userId && userPosts.has(userId)) {
      targetPosts = userPosts.get(userId)!;
    }
    
    const postIndex = targetPosts.findIndex(post => post.id === id);
    
    if (postIndex === -1) {
      throw new Error("Post not found");
    }
    
    const updatedPost = {
      ...targetPosts[postIndex],
      ...postData,
      updatedAt: new Date().toISOString()
    };
    
    targetPosts[postIndex] = updatedPost;
    
    return { ...updatedPost };
  },
  
  deletePost: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    let targetPosts = MOCK_POSTS;
    
    // If we have a logged-in user and they have posts, delete from those
    if (userId && userPosts.has(userId)) {
      targetPosts = userPosts.get(userId)!;
    }
    
    const postIndex = targetPosts.findIndex(post => post.id === id);
    
    if (postIndex === -1) {
      throw new Error("Post not found");
    }
    
    targetPosts.splice(postIndex, 1);
  }
};

// API service for platforms
export const platformService = {
  getPlatforms: async (): Promise<Platform[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...MOCK_PLATFORMS];
  }
};

// API service for analytics
export const analyticsService = {
  getAnalytics: async (period = 'week'): Promise<AnalyticsData[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, we'd fetch data for the specific period
    // For now, we'll just return mock data
    return [...MOCK_ANALYTICS];
  }
};
