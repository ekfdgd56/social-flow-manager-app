
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PostForm from "@/components/posts/PostForm";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const navigate = useNavigate();
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <p className="text-muted-foreground">Craft content for your social media channels</p>
      </div>
      
      <PostForm 
        onSuccess={() => navigate("/posts")}
      />
    </DashboardLayout>
  );
}
