
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PostForm from "@/components/posts/PostForm";
import { Post } from "@/types";
import { postService } from "@/services/api";

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await postService.getPostById(id);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to load post. It may have been deleted or you don't have permission to view it.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-10">Loading post...</div>
      </DashboardLayout>
    );
  }
  
  if (error || !post) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 rounded-lg text-center">
          <h2 className="text-lg font-medium text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error || "Post not found"}</p>
          <button 
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            onClick={() => navigate("/posts")}
          >
            Back to Posts
          </button>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <p className="text-muted-foreground">Update your social media content</p>
      </div>
      
      <PostForm 
        initialData={post}
        onSuccess={() => navigate("/posts")}
      />
    </DashboardLayout>
  );
}
