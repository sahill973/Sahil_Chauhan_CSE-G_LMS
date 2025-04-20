
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { addDays } from "date-fns";
import { useUser } from "@/hooks/useUser";

interface BookRecommendationsProps {
  department?: string | null;
  searchQuery?: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  available: boolean;
  description?: string | null;
}

const BookRecommendations = ({ department, searchQuery }: BookRecommendationsProps) => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { data: recommendations = [], isLoading: recommendationsLoading } = useQuery({
    queryKey: ["recommendations", department, searchQuery],
    queryFn: async () => {
      if (searchQuery && searchQuery.trim() !== "") {
        // First try to find exact matches
        let { data: exactMatches } = await supabase
          .from("books")
          .select("*")
          .or(`title.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`)
          .eq("available", true)
          .limit(5);

        // If no exact matches, try to find similar books that are available
        if (!exactMatches?.length) {
          let { data: similarBooks } = await supabase
            .from("books")
            .select("*")
            .eq("available", true)
            .eq("category", department || "")
            .limit(5);
          
          return similarBooks || [];
        }
        
        return exactMatches || [];
      } 
      else if (department && department !== "admin") {
        // If no search but we have department, recommend available books from that department
        let { data } = await supabase
          .from("books")
          .select("*")
          .eq("category", department)
          .eq("available", true)
          .limit(10);
        
        return data || [];
      }
      
      // Default: just show some available books
      let { data } = await supabase
        .from("books")
        .select("*")
        .eq("available", true)
        .limit(10);
      
      return data || [];
    }
  });

  // Similar books AI recommendation (when a book is not found or not available)
  const { data: aiRecommendations, isLoading: aiLoading } = useQuery({
    queryKey: ["ai-recommendations", searchQuery],
    queryFn: async () => {
      // Only get AI recommendations if we have a search query but no recommendations
      if (searchQuery && searchQuery.trim() !== "" && recommendations?.length === 0) {
        // Fetch all available books as potential alternatives
        const { data: availableBooks } = await supabase
          .from("books")
          .select("*")
          .eq("available", true)
          .limit(30);
        
        // Simple similarity matching as a fallback when no exact matches found
        if (availableBooks?.length) {
          // Sort books by similarity to the search query
          return availableBooks
            .map((book: Book) => ({
              ...book,
              relevance: calculateRelevance(book, searchQuery)
            }))
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, 5);
        }
      }
      return [];
    },
    // Only run this query if we have a search query but no recommendations
    enabled: Boolean(searchQuery && recommendations?.length === 0)
  });

  // Borrow book mutation
  const borrowMutation = useMutation({
    mutationFn: async (bookId: string) => {
      // Calculate due date (14 days from now)
      const dueDate = addDays(new Date(), 14);
      
      // Insert borrowing record
      const { error: borrowError } = await supabase
        .from("borrowings")
        .insert({
          book_id: bookId,
          user_id: user?.id,
          due_at: dueDate.toISOString()
        });
      
      if (borrowError) throw borrowError;
      
      // Update book availability
      const { error: updateError } = await supabase
        .from("books")
        .update({ available: false })
        .eq("id", bookId);
      
      if (updateError) throw updateError;
      
      return { bookId, dueDate };
    },
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      queryClient.invalidateQueries({ queryKey: ["borrowings"] });
      toast.success("Book borrowed successfully! Due in 14 days.");
    },
    onError: (error) => {
      toast.error(`Failed to borrow book: ${error.message}`);
    }
  });

  // Simple relevance calculation function
  const calculateRelevance = (book: Book, query: string) => {
    const lowerQuery = query.toLowerCase();
    const titleMatch = book.title.toLowerCase().includes(lowerQuery) ? 3 : 0;
    const authorMatch = book.author.toLowerCase().includes(lowerQuery) ? 2 : 0;
    const descriptionMatch = book.description?.toLowerCase().includes(lowerQuery) ? 1 : 0;
    return titleMatch + authorMatch + descriptionMatch;
  };

  // Show loading state
  if (recommendationsLoading) {
    return <div>Loading book recommendations...</div>;
  }

  // Determine what to show
  const booksToShow = recommendations?.length > 0 
    ? recommendations 
    : aiRecommendations?.length > 0 
      ? aiRecommendations 
      : [];

  if (booksToShow.length === 0) {
    return (
      <div className="text-center p-4">
        <h3 className="font-semibold mb-2">No books found</h3>
        <p className="text-muted-foreground">
          {searchQuery 
            ? "We couldn't find any books matching your search criteria." 
            : "We don't have specific recommendations for you yet."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold mb-4">
        {searchQuery && recommendations?.length === 0 && aiRecommendations?.length > 0
          ? "Similar books you might like"
          : department && department !== "admin"
          ? `Recommended books for ${department}`
          : "Recommended for you"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {booksToShow.map((book: Book) => (
          <Card key={book.id}>
            <CardHeader>
              <CardTitle className="line-clamp-2">{book.title}</CardTitle>
              <CardDescription>{book.author}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {book.description || "No description available."}
              </p>
              <p className="mt-2 text-sm font-medium">Category: {book.category}</p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                disabled={!book.available || borrowMutation.isPending} 
                onClick={() => borrowMutation.mutate(book.id)}
              >
                {borrowMutation.isPending ? "Processing..." : "Borrow Now"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookRecommendations;
