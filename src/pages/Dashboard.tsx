
import React from "react";
import { useUser } from "@/hooks/useUser";
import BooksList from "@/components/BooksList";
import StudyMaterialsList from "@/components/StudyMaterialsList";
import AdminPanel from "@/components/AdminPanel";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, profile, loading } = useUser();
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (!user) { navigate("/auth"); return null; }

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Welcome, {profile?.full_name || "User"}</h2>
        <Button
          variant="outline"
          onClick={async () => {
            await supabase.auth.signOut();
            navigate("/auth");
          }}
        >Logout</Button>
      </div>
      {profile?.department === "admin" && <AdminPanel />}
      <div className="my-10">
        <h3 className="font-semibold mb-2">All Available Books</h3>
        <BooksList />
      </div>
      <div className="my-10">
        <h3 className="font-semibold mb-2">All Study Materials</h3>
        <StudyMaterialsList />
      </div>
      {/* TODO: Add Borrow, Return, My Borrowings features for users */}
    </div>
  );
};
export default Dashboard;
