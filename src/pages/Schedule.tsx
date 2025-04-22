
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ScheduleCalendar from "@/components/schedule/ScheduleCalendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Post } from "@/types";
import { postService } from "@/services/api";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

export default function Schedule() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPostDialog, setShowPostDialog] = useState(false);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const data = await postService.getPosts();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectPost = (post: Post) => {
    setSelectedPost(post);
    setShowPostDialog(true);
  };
  
  const handleEditPost = () => {
    if (selectedPost) {
      navigate(`/posts/edit/${selectedPost.id}`);
    }
  };
  
  const handleDeletePost = async () => {
    if (!selectedPost) return;
    
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await postService.deletePost(selectedPost.id);
        setPosts(posts.filter(post => post.id !== selectedPost.id));
        setShowPostDialog(false);
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };
  
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Content Schedule</h1>
        <Button onClick={() => navigate("/posts/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="text-center py-10">Loading schedule...</div>
        ) : (
          <ScheduleCalendar 
            posts={posts} 
            onSelectPost={handleSelectPost}
          />
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Posts</CardTitle>
            <CardDescription>Posts scheduled for publication</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts.filter(post => post.status === "scheduled").length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No scheduled posts yet
                </div>
              ) : (
                posts
                  .filter(post => post.status === "scheduled")
                  .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime())
                  .map(post => (
                    <div 
                      key={post.id}
                      className="flex items-start justify-between p-3 border rounded-md cursor-pointer hover:bg-secondary/20"
                      onClick={() => handleSelectPost(post)}
                    >
                      <div>
                        <p className="font-medium line-clamp-1">{post.content}</p>
                        <div className="flex space-x-2 text-xs text-muted-foreground mt-1">
                          <span>{post.platform}</span>
                          <span>•</span>
                          <span>{post.scheduledAt && format(new Date(post.scheduledAt), "MMM d, yyyy 'at' h:mm a")}</span>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scheduled Post</DialogTitle>
            <DialogDescription>
              {selectedPost?.scheduledAt && format(new Date(selectedPost.scheduledAt), "MMMM d, yyyy 'at' h:mm a")}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPost && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                    {selectedPost.platform}
                  </div>
                </div>
                <p>{selectedPost.content}</p>
                
                {selectedPost.imageUrl && (
                  <div className="mt-2 rounded-md overflow-hidden border">
                    <img src={selectedPost.imageUrl} alt="Post" className="w-full max-h-48 object-cover" />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowPostDialog(false)}>
                  Close
                </Button>
                <Button onClick={handleEditPost}>
                  Edit Post
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
