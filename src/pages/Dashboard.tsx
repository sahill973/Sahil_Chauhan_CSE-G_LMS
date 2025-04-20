
import React, { useState } from "react";
import { useUser } from "@/hooks/useUser";
import BooksList from "@/components/BooksList";
import StudyMaterialsList from "@/components/StudyMaterialsList";
import AdminPanel from "@/components/AdminPanel";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import BookRecommendations from "@/components/BookRecommendations";
import BorrowingHistory from "@/components/BorrowingHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { book as BookIcon } from "lucide-react";

const Dashboard = () => {
  const { user, profile, loading } = useUser();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const isLibrarian = profile?.email === "librarian@krmu.edu.in" || profile?.department === "admin";

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-primary via-[#ea384c11] to-secondary/10">
      <div className="animate-pulse text-xl text-primary">Loading...</div>
    </div>
  );
  
  if (!user) { 
    navigate("/auth"); 
    return null; 
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-[#ea384c11] to-secondary/10">
      <div className="max-w-6xl mx-auto p-5">
        <div className="text-center mt-8 mb-10">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-primary drop-shadow tracking-tight">
            KR MANGALAM UNIVERSITY LIBRARY
          </h1>
          <p className="text-muted-foreground">
            {isLibrarian 
              ? "Welcome, Library Administrator" 
              : `Welcome, ${profile?.full_name || "User"}`}
          </p>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={(query) => setSearchQuery(query)} />
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <BookIcon size={18} />
            {isLibrarian ? "Library Administration" : "My Library"}
          </h2>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-[#ea384c] hover:text-white transition"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/auth");
            }}
          >Logout</Button>
        </div>

        {/* Show Admin Panel for librarian */}
        {isLibrarian && <AdminPanel />}

        {/* Show regular user interface for non-librarians */}
        {!isLibrarian && (
          <Tabs defaultValue="recommendations" className="w-full mt-6">
            <TabsList className="grid w-full grid-cols-4 bg-secondary/50 border border-primary rounded-md">
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="catalogue">Full Catalogue</TabsTrigger>
              <TabsTrigger value="borrowings">My Borrowings</TabsTrigger>
              <TabsTrigger value="materials">Study Materials</TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations" className="mt-6">
              <BookRecommendations department={profile?.department} searchQuery={searchQuery} />
            </TabsContent>

            <TabsContent value="catalogue" className="mt-6">
              <BooksList searchQuery={searchQuery} />
            </TabsContent>

            <TabsContent value="borrowings" className="mt-6">
              <BorrowingHistory userId={user.id} />
            </TabsContent>

            <TabsContent value="materials" className="mt-6">
              <StudyMaterialsList />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
