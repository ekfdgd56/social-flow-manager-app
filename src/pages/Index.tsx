
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/50 to-background">
      <header className="container mx-auto py-6 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="rounded-full bg-primary p-2 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
          </div>
          <span className="text-2xl font-bold">SocialFlow</span>
        </div>
        <nav>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link to="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 pt-20 pb-16">
        <div className="flex flex-col lg:flex-row items-center max-w-6xl mx-auto">
          <div className="lg:w-1/2 lg:pr-12 mb-12 lg:mb-0">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Simplify Your <span className="text-primary">Social Media</span> Management
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Schedule posts, analyze performance, and grow your audience across multiple platforms from one intuitive dashboard.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img 
              src="https://placehold.co/600x400/9b87f5/FFFFFF?text=SocialFlow+Dashboard" 
              alt="SocialFlow Dashboard" 
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>

        <div className="py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Content Scheduling</h3>
                <p className="text-muted-foreground">
                  Plan and schedule your content across multiple platforms from a single calendar interface.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M3 3v18h18" />
                    <path d="M18 9l-1.3-1.3c-1.8-1.8-4.9-1.8-6.7 0-1.8 1.8-1.8 4.9 0 6.7C11.8 16.2 14.9 16.2 16.7 14.4L18 13" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
                <p className="text-muted-foreground">
                  Track engagement, growth, and content performance with intuitive visual reports.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z" />
                    <path d="M10 2c1 .5 2 2 2 5" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Multi-Platform Integration</h3>
                <p className="text-muted-foreground">
                  Connect and manage all your social accounts from a single dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="py-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your social media workflow?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of brands and creators who are saving time and growing their audience with SocialFlow.
          </p>
          <Link to="/register">
            <Button size="lg">Get Started for Free</Button>
          </Link>
        </div>
      </main>

      <footer className="bg-secondary/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="rounded-full bg-primary p-1.5 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
              </div>
              <span className="text-lg font-bold">SocialFlow</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2023 SocialFlow. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
