
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { postService } from "@/services/api";
import { Post } from "@/types";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface PostFormProps {
  initialData?: Partial<Post>;
  onSuccess?: () => void;
}

export default function PostForm({ initialData, onSuccess }: PostFormProps) {
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(initialData?.content || "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [platform, setPlatform] = useState<"facebook" | "instagram">(initialData?.platform || "facebook");
  const [status, setStatus] = useState<"draft" | "scheduled" | "published">(initialData?.status || "draft");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    initialData?.scheduledAt ? new Date(initialData.scheduledAt) : undefined
  );
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content) {
      alert("Please enter content for your post");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const postData: Omit<Post, "id" | "createdAt" | "updatedAt" | "stats"> = {
        content,
        imageUrl: imageUrl || undefined,
        platform,
        status,
        scheduledAt: status === "scheduled" && scheduledDate ? scheduledDate.toISOString() : undefined
      };
      
      if (initialData?.id) {
        await postService.updatePost(initialData.id, postData);
      } else {
        await postService.createPost(postData);
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/posts");
      }
    } catch (error) {
      console.error("Error saving post:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData?.id ? "Edit Post" : "Create New Post"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-32"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <Input
              id="imageUrl"
              type="text"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            {imageUrl && (
              <div className="mt-2 rounded-md overflow-hidden border">
                <img src={imageUrl} alt="Post preview" className="max-h-48 object-cover w-full" />
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select value={platform} onValueChange={(value: "facebook" | "instagram") => setPlatform(value)}>
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: "draft" | "scheduled" | "published") => setStatus(value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {status === "scheduled" && (
            <div className="space-y-2">
              <Label>Schedule Date & Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !scheduledDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? format(scheduledDate, "PPP p") : "Select date and time"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    initialFocus
                  />
                  <div className="p-3 border-t">
                    <Input
                      type="time"
                      value={scheduledDate ? format(scheduledDate, "HH:mm") : ""}
                      onChange={(e) => {
                        if (scheduledDate) {
                          const [hours, minutes] = e.target.value.split(':');
                          const newDate = new Date(scheduledDate);
                          newDate.setHours(parseInt(hours, 10));
                          newDate.setMinutes(parseInt(minutes, 10));
                          setScheduledDate(newDate);
                        }
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => navigate("/posts")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : initialData?.id ? "Update Post" : "Create Post"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
