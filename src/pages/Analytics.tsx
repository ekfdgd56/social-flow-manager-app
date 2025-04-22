
import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AnalyticsChart from "@/components/analytics/AnalyticsChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnalyticsData } from "@/types";
import { analyticsService, postService } from "@/services/api";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { startOfDay, subDays, subMonths, subYears, format } from "date-fns";
import { Loader2 } from "lucide-react";

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [postCounts, setPostCounts] = useState({ total: 0, facebook: 0, instagram: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("week");
  
  // Mock data generation for different date ranges
  const generateMockData = (range: string) => {
    const today = startOfDay(new Date());
    let dates: Date[] = [];
    let data: AnalyticsData[] = [];
    
    switch (range) {
      case "week":
        // Generate data for past 7 days
        for (let i = 6; i >= 0; i--) {
          dates.push(subDays(today, i));
        }
        break;
      case "month":
        // Generate data for past 30 days (sampling every 3 days)
        for (let i = 30; i >= 0; i -= 3) {
          dates.push(subDays(today, i));
        }
        break;
      case "year":
        // Generate data for past 12 months (monthly)
        for (let i = 11; i >= 0; i--) {
          dates.push(subMonths(today, i));
        }
        break;
      default:
        // Default to week
        for (let i = 6; i >= 0; i--) {
          dates.push(subDays(today, i));
        }
    }
    
    // Create data points
    data = dates.map(date => {
      // Randomize values based on date range (bigger range = bigger numbers)
      const multiplier = range === "year" ? 30 : range === "month" ? 5 : 1;
      return {
        date: format(date, "yyyy-MM-dd"),
        likes: Math.floor(Math.random() * 50 * multiplier + 30),
        comments: Math.floor(Math.random() * 20 * multiplier + 5),
        shares: Math.floor(Math.random() * 15 * multiplier + 2)
      };
    });
    
    return data;
  };
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Instead of fetching a fixed dataset, we'll generate data based on the range
        const analyticsData = generateMockData(dateRange);
        setAnalyticsData(analyticsData);
        
        const posts = await postService.getPosts();
        
        const publishedPosts = posts.filter(post => post.status === "published");
        setPostCounts({
          total: publishedPosts.length,
          facebook: publishedPosts.filter(post => post.platform === "facebook").length,
          instagram: publishedPosts.filter(post => post.platform === "instagram").length
        });
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [dateRange]);
  
  const getTotalEngagement = useMemo(() => {
    return analyticsData.reduce((total, day) => {
      return total + day.likes + day.comments + day.shares;
    }, 0);
  }, [analyticsData]);
  
  const getAverageEngagementPerPost = useMemo(() => {
    if (postCounts.total === 0) return 0;
    return Math.round(getTotalEngagement / postCounts.total);
  }, [getTotalEngagement, postCounts.total]);
  
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Total Engagement</CardTitle>
                <CardDescription>Likes, comments, and shares</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{getTotalEngagement}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Published Posts</CardTitle>
                <CardDescription>Across all platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{postCounts.total}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Avg. Engagement</CardTitle>
                <CardDescription>Per published post</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{getAverageEngagementPerPost}</div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <AnalyticsChart
                data={analyticsData}
                title={`Performance Overview - ${dateRange === "week" ? "Last 7 Days" : dateRange === "month" ? "Last 30 Days" : "Last Year"}`}
                description="Engagement metrics across all social platforms"
              />
            </TabsContent>
            
            <TabsContent value="engagement">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Trends</CardTitle>
                  <CardDescription>How your audience interacts with your content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={analyticsData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          angle={-45} 
                          textAnchor="end"
                          height={70}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="likes" name="Likes" stroke="#9b87f5" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="comments" name="Comments" stroke="#7E69AB" />
                        <Line type="monotone" dataKey="shares" name="Shares" stroke="#6E59A5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="platforms">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Published Posts by Platform</CardTitle>
                    <CardDescription>Distribution across social networks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { name: 'Facebook', value: postCounts.facebook },
                            { name: 'Instagram', value: postCounts.instagram }
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="value" name="Posts" stroke="#9b87f5" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Performance</CardTitle>
                    <CardDescription>Engagement metrics by platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Facebook</h3>
                        <div className="flex items-center justify-between text-sm">
                          <span>Engagement Rate</span>
                          <span className="font-medium">12.4%</span>
                        </div>
                        <div className="w-full bg-secondary mt-1 rounded-full h-2">
                          <div className="bg-primary rounded-full h-2" style={{ width: '12.4%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Instagram</h3>
                        <div className="flex items-center justify-between text-sm">
                          <span>Engagement Rate</span>
                          <span className="font-medium">18.7%</span>
                        </div>
                        <div className="w-full bg-secondary mt-1 rounded-full h-2">
                          <div className="bg-accent rounded-full h-2" style={{ width: '18.7%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </DashboardLayout>
  );
}
