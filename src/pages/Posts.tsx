
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PostList from "@/components/posts/PostList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Post } from "@/types";
import { postService } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  
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
  
  const filteredPosts = posts.filter(post => {
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    const matchesPlatform = platformFilter === "all" || post.platform === platformFilter;
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesPlatform && matchesSearch;
  });
  
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Button onClick={() => navigate("/posts/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </div>
      
      <div className="mb-6">
        <Tabs defaultValue="all">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setStatusFilter("all")}>All</TabsTrigger>
              <TabsTrigger value="published" onClick={() => setStatusFilter("published")}>Published</TabsTrigger>
              <TabsTrigger value="scheduled" onClick={() => setStatusFilter("scheduled")}>Scheduled</TabsTrigger>
              <TabsTrigger value="draft" onClick={() => setStatusFilter("draft")}>Drafts</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-xs"
              />
            </div>
          </div>
          
          <TabsContent value="all">
            {isLoading ? (
              <div className="text-center py-10">Loading posts...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                {searchTerm ? "No posts matching your search" : "No posts yet"}
              </div>
            ) : (
              <PostList
                posts={filteredPosts}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            )}
          </TabsContent>
          
          <TabsContent value="published">
            {isLoading ? (
              <div className="text-center py-10">Loading posts...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No published posts yet
              </div>
            ) : (
              <PostList
                posts={filteredPosts}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            )}
          </TabsContent>
          
          <TabsContent value="scheduled">
            {isLoading ? (
              <div className="text-center py-10">Loading posts...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No scheduled posts yet
              </div>
            ) : (
              <PostList
                posts={filteredPosts}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            )}
          </TabsContent>
          
          <TabsContent value="draft">
            {isLoading ? (
              <div className="text-center py-10">Loading posts...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No draft posts yet
              </div>
            ) : (
              <PostList
                posts={filteredPosts}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
