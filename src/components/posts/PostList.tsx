
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Post } from "@/types";
import { Edit, Trash2, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PostListProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
}

export default function PostList({ posts, onEdit, onDelete }: PostListProps) {
  const getStatusColor = (status: Post["status"]) => {
    switch (status) {
      case "published":
        return "bg-green-500";
      case "scheduled":
        return "bg-blue-500";
      case "draft":
      default:
        return "bg-gray-500";
    }
  };

  const formatScheduleDate = (date: Date | string | undefined) => {
    if (!date) return null;
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const truncateContent = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + "...";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          {post.imageUrl && (
            <div className="h-48 overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt="Post" 
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
          )}
          <CardHeader className={!post.imageUrl ? "pt-6" : "pt-4"}>
            <div className="flex justify-between items-start">
              <Badge className={getStatusColor(post.status) + " text-white"}>
                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
              </Badge>
              <Badge variant="outline">{post.platform}</Badge>
            </div>
            <CardTitle className="text-lg line-clamp-1">{truncateContent(post.content, 50)}</CardTitle>
            <CardDescription>
              {post.status === "scheduled" && post.scheduledAt && (
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{formatScheduleDate(post.scheduledAt)}</span>
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {truncateContent(post.content)}
            </p>
            {post.stats && post.status === "published" && (
              <div className="flex space-x-4 mt-4 text-xs text-muted-foreground">
                <div>{post.stats.likes} likes</div>
                <div>{post.stats.comments} comments</div>
                <div>{post.stats.shares} shares</div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit(post)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(post.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
