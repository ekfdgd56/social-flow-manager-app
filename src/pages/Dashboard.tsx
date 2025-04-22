
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Post } from "@/types";
import { postService, analyticsService } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { Plus, BarChart2, Edit, Calendar } from "lucide-react";
import PostList from "@/components/posts/PostList";
import AnalyticsChart from "@/components/analytics/AnalyticsChart";

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [analytics, setAnalytics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, analyticsData] = await Promise.all([
          postService.getPosts(),
          analyticsService.getAnalytics()
        ]);
        
        setPosts(postsData);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const scheduledPosts = posts.filter(post => post.status === "scheduled");
  const recentPosts = posts.filter(post => post.status === "published").slice(0, 3);
  
  const handleEditPost = (post: Post) => {
    navigate(`/posts/edit/${post.id}`);
  };
  
  const handleDeletePost = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await postService.deletePost(postId);
        setPosts(posts.filter(post => post.id !== postId));
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };
  
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => navigate("/posts/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Posts</CardTitle>
            <CardDescription>All posts across platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{posts.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Posts</CardTitle>
            <CardDescription>Posts waiting to be published</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{scheduledPosts.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Engagement</CardTitle>
            <CardDescription>Likes, comments, and shares</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {posts.reduce((total, post) => {
                if (post.stats) {
                  return total + post.stats.likes + post.stats.comments + post.stats.shares;
                }
                return total;
              }, 0)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsChart 
            data={analytics} 
            title="Engagement Overview" 
            description="Likes, comments, and shares over time"
          />
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg">Recent Posts</CardTitle>
                <CardDescription>Your latest content</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/posts")}>
                View all
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPosts.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No published posts yet
                  </div>
                ) : (
                  recentPosts.map(post => (
                    <div key={post.id} className="flex justify-between items-start border-b pb-4 last:border-0">
                      <div>
                        <p className="font-medium line-clamp-1">{post.content.slice(0, 40)}{post.content.length > 40 ? '...' : ''}</p>
                        {post.stats && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {post.stats.likes} likes • {post.stats.comments} comments
                          </p>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleEditPost(post)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
