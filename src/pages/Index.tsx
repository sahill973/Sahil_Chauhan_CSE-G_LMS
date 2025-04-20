
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary via-[#ea384c11] to-secondary/10">
      <Navigation />

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-3xl text-center space-y-8">
          <h1 className="text-5xl sm:text-6xl font-extrabold font-playfair bg-gradient-to-r from-primary to-[#ea384c] bg-clip-text text-transparent tracking-tight drop-shadow">
            KR MANGALAM UNIVERSITY LIBRARY
          </h1>
          <p className="text-xl text-muted-foreground animate-fade-in">
            Access thousands of books and study materials across all university departments.
            Borrow books, get recommendations, and manage your reading list in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-[#ea384c] text-white font-bold shadow-xl hover:scale-105 transition"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary font-bold hover:bg-primary hover:text-white hover:border-[#ea384c] hover:scale-105 transition"
              onClick={() => navigate("/auth")}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
