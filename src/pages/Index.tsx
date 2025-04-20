import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import LatestAdditions from "@/components/LatestAdditions";
import { useUser } from "@/hooks/useUser";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
    if (!loading && user) navigate("/dashboard");
  }, [user, loading]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="text-2xl font-bold tracking-tight">KRMU Library Dashboard</span>
    </div>
  );
};

export default Index;
