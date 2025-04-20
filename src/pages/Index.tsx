
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import LatestAdditions from "@/components/LatestAdditions";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <Categories />
      <LatestAdditions />
    </div>
  );
};

export default Index;
