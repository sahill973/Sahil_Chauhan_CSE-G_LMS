
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Navigation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user } = useUser();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/dashboard?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 
              onClick={() => navigate("/")}
              className="font-playfair text-2xl font-bold text-primary cursor-pointer hover:text-[#ea384c] transition"
            >
              KRMU Library
            </h1>
            
            <NavigationMenu className="ml-10 hidden sm:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>About</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[400px]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex flex-col h-full w-full rounded-md bg-gradient-to-b from-primary/50 to-primary p-6 no-underline outline-none focus:shadow-md"
                            href="https://krmangalam.edu.in"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium text-white">
                              KR Mangalam University
                            </div>
                            <p className="text-sm leading-tight text-white/90">
                              One of the top universities in Delhi NCR offering a wide range of courses across various disciplines
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            href="https://krmangalam.edu.in/facilities/library"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <div className="text-sm font-medium leading-none">Library</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Explore the extensive collection of academic resources available in our library
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button 
                    asChild 
                    variant="link" 
                    className="h-auto p-0"
                    onClick={() => navigate("/dashboard")}
                  >
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Catalog
                    </NavigationMenuLink>
                  </Button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="search"
                placeholder="Search catalog..."
                className="pl-10 w-72"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
            {!user ? (
              <>
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary hover:text-white transition"
                  onClick={() => navigate("/auth")}
                >
                  Login
                </Button>
                <Button 
                  className="bg-gradient-to-r from-primary to-[#ea384c] text-white hover:from-[#ea384c] hover:to-primary transition"
                  onClick={() => navigate("/auth")}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <Button 
                className="bg-gradient-to-r from-primary to-[#ea384c] text-white hover:from-[#ea384c] hover:to-primary transition"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
