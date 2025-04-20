
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

const Dashboard = () => {
  const { user, profile, loading } = useUser();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!user) { navigate("/auth"); return null; }

  return (
    <div className="max-w-6xl mx-auto p-5">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary">KR MANGALAM UNIVERSITY LIBRARY</h1>
        <p className="text-muted-foreground">Welcome, {profile?.full_name || "User"}</p>
      </div>
      
      <div className="mb-8">
        <SearchBar onSearch={(query) => setSearchQuery(query)} />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">My Library</h2>
        <Button
          variant="outline"
          onClick={async () => {
            await supabase.auth.signOut();
            navigate("/auth");
          }}
        >Logout</Button>
      </div>

      {profile?.department === "admin" && <AdminPanel />}

      <Tabs defaultValue="recommendations" className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-4">
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
    </div>
  );
};

export default Dashboard;
