
import React from "react";
import Navigation from "@/components/Navigation";
import { useUser } from "@/hooks/useUser";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is logged in, redirect to dashboard
    if (!loading && user) navigate("/dashboard");
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-background to-secondary/10">
        <div className="max-w-3xl text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            KR MANGALAM UNIVERSITY LIBRARY
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Access thousands of books and study materials across all university departments.
            Borrow books, get recommendations, and manage your reading list in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button size="lg" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              Register
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
