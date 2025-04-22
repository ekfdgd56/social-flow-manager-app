
import React from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Post } from "@/types";
import { format } from "date-fns";

interface ScheduleCalendarProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

export default function ScheduleCalendar({ posts, onSelectPost }: ScheduleCalendarProps) {
  // Filter only scheduled posts
  const scheduledPosts = posts.filter(post => post.status === "scheduled" && post.scheduledAt);
  
  // Create a map of dates to post counts for easier lookup
  const postsByDate = scheduledPosts.reduce<Record<string, Post[]>>((acc, post) => {
    if (post.scheduledAt) {
      const dateKey = format(new Date(post.scheduledAt), "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(post);
    }
    return acc;
  }, {});
  
  // Custom day render function to show posts
  const renderDay = (date: Date, cellProps: any) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const postsForDay = postsByDate[dateKey] || [];
    const hasScheduledPosts = postsForDay.length > 0;
    
    return (
      <div 
        {...cellProps}
        className={`${cellProps.className} relative`}
      >
        {date.getDate()}
        {hasScheduledPosts && (
          <Popover>
            <PopoverTrigger asChild>
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-primary rounded-full cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-2">
                <h4 className="font-medium">
                  {postsForDay.length} post{postsForDay.length > 1 ? "s" : ""} for {format(date, "MMMM d, yyyy")}
                </h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {postsForDay.map((post) => (
                    <div 
                      key={post.id} 
                      className="p-2 text-xs bg-secondary/50 rounded cursor-pointer hover:bg-secondary"
                      onClick={() => onSelectPost(post)}
                    >
                      <p className="font-medium truncate">{post.content.substring(0, 30)}...</p>
                      <p className="text-muted-foreground">
                        {post.scheduledAt && format(new Date(post.scheduledAt), "h:mm a")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Calendar</CardTitle>
        <CardDescription>
          View and manage your scheduled posts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CalendarComponent 
          className="rounded-md border shadow-sm" 
          mode="default"
          selected={new Date()}
          month={new Date()}
          onDayClick={(date) => {
            const dateKey = format(date, "yyyy-MM-dd");
            const postsForDay = postsByDate[dateKey] || [];
            if (postsForDay.length > 0) {
              onSelectPost(postsForDay[0]);
            }
          }}
          components={{
            Day: ({ date, ...props }) => renderDay(date, props)
          }}
        />
      </CardContent>
    </Card>
  );
}
