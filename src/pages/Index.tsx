
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";

const Index = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  console.log("Index page rendered", { user, loading });
  console.log("Background image URL:", 'https://th.bing.com/th/id/OIP.kCpBGI4eFvBUuAfXs2P-ygAAAA?w=165&h=155&c=7&r=0&o=5&dpr=1.4&pid=1.7');

  useEffect(() => {
    const createLibrarianAccount = async () => {
      try {
        const { data: existingUser, error: searchError } = await supabase
          .from('profiles')
          .select('department')
          .eq('department', 'admin')
          .maybeSingle();

        if (searchError) throw searchError;

        if (!existingUser) {
          const { data, error } = await supabase.auth.signUp({
            email: 'librarian@krmu.edu.in',
            password: 'lib@krmu',
            options: {
              data: { 
                college_id: 'ADMIN-LIB', 
                full_name: 'Library Administrator',
                department: 'admin' 
              }
            }
          });

          if (error) console.error("Error creating librarian account:", error);
          else console.log("Librarian account created");
        }
      } catch (error) {
        console.error("Error checking for librarian account:", error);
      }
    };

    createLibrarianAccount();
  }, []);

  useEffect(() => {
    if (!loading && user) navigate("/dashboard");
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: "url('https://th.bing.com/th/id/OIP.kCpBGI4eFvBUuAfXs2P-ygAAAA?w=165&h=155&c=7&r=0&o=5&dpr=1.4&pid=1.7')",
          backgroundSize: "100% auto",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.4
        }}
      />
      
      <div className="relative z-10">
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
    </div>
  );
};

export default Index;
