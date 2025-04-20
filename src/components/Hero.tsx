
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6">
          Discover Knowledge
        </h1>
        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
          Access thousands of books, journals, and academic resources from our comprehensive library collection
        </p>
        <div className="flex max-w-md mx-auto gap-2">
          <Input 
            type="search" 
            placeholder="Search for books, journals, articles..."
            className="flex-1"
          />
          <Button>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
