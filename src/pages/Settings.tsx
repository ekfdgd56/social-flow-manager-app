import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { platformService } from "@/services/api";
import { Platform } from "@/types";
import { Facebook, Instagram, Settings as SettingsIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    notifications: true
  });
  
  const { toast } = useToast();
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        notifications: true
      });
    }
  }, [user]);
  
  useEffect(() => {
    const fetchPlatforms = async () => {
      setIsLoading(true);
      try {
        const data = await platformService.getPlatforms();
        setPlatforms(data);
      } catch (error) {
        console.error("Error fetching platforms:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlatforms();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email
      });
      
      toast({
        title: "Settings saved",
        description: "Your profile has been updated successfully"
      });
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const connectPlatform = (platformId: string) => {
    setPlatforms(platforms.map(platform => 
      platform.id === platformId 
        ? { ...platform, connected: true } 
        : platform
    ));
  };
  
  const disconnectPlatform = (platformId: string) => {
    if (window.confirm("Are you sure you want to disconnect this platform? This will remove all associated pages.")) {
      setPlatforms(platforms.map(platform => 
        platform.id === platformId 
          ? { ...platform, connected: false, pages: [] } 
          : platform
      ));
    }
  };
  
  const getPlatformIcon = (name: string) => {
    switch (name) {
      case "facebook":
        return <Facebook className="h-5 w-5" />;
      case "instagram":
        return <Instagram className="h-5 w-5" />;
      default:
        return <SettingsIcon className="h-5 w-5" />;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and connections</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveChanges}>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={formData.name} 
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave blank to keep your current password
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="notifications" className="block mb-1">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about your account activity
                    </p>
                  </div>
                  <Switch 
                    id="notifications" 
                    checked={formData.notifications}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, notifications: checked})
                    }
                  />
                </div>
                
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardContent>
            </form>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Connected Platforms</CardTitle>
              <CardDescription>Manage your social media connections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="text-center py-4">Loading platforms...</div>
              ) : (
                platforms.map((platform) => (
                  <div key={platform.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getPlatformIcon(platform.name)}
                        <div>
                          <h3 className="text-lg font-medium capitalize">{platform.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {platform.connected 
                              ? `Connected with ${platform.pages?.length || 0} pages` 
                              : "Not connected"}
                          </p>
                        </div>
                      </div>
                      
                      {platform.connected ? (
                        <Button 
                          variant="outline" 
                          onClick={() => disconnectPlatform(platform.id)}
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => connectPlatform(platform.id)}
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                    
                    {platform.connected && platform.pages && platform.pages.length > 0 && (
                      <div className="mt-4 ml-8 space-y-3">
                        {platform.pages.map((page) => (
                          <div key={page.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
                            <div className="flex items-center space-x-3">
                              {page.imageUrl && (
                                <img 
                                  src={page.imageUrl} 
                                  alt={page.name} 
                                  className="w-8 h-8 rounded-full"
                                />
                              )}
                              <span>{page.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <Separator className="my-4" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
