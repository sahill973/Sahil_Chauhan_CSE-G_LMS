
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import type { BorrowRow } from "./types";

export const useOverdueBooks = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: borrowings = [], isLoading: borrowingsLoading } = useQuery({
    queryKey: ["all_borrowings"],
    queryFn: async () => {
      console.log("Fetching all borrowings for overdue section");
      const { data, error } = await supabase
        .from("borrowings")
        .select(`
          id,
          borrowed_at,
          due_at,
          returned_at,
          book_id,
          user_id,
          books:book_id(id, title, author)
        `)
        .order("due_at", { ascending: true });
        
      if (error) {
        console.error("Error fetching borrowings:", error);
        toast.error("Failed to load overdue books");
        throw error;
      }
      
      const borrowingsWithProfiles = await Promise.all(
        (data || []).map(async (borrow) => {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name, college_id")
            .eq("id", borrow.user_id)
            .maybeSingle();
            
          return {
            ...borrow,
            profiles: profileData || { full_name: "Unknown User", college_id: "" }
          };
        })
      );
      
      return borrowingsWithProfiles as BorrowRow[];
    }
  });

  const returnBookMutation = useMutation({
    mutationFn: async ({ id, book_id }: { id: string, book_id: string }) => {
      setIsLoading(true);
      try {
        const { error: borrowError } = await supabase
          .from("borrowings")
          .update({ returned_at: new Date().toISOString() })
          .eq("id", id);
        if (borrowError) throw borrowError;
        
        const { error: bookError } = await supabase
          .from("books")
          .update({ available: true })
          .eq("id", book_id);
        if (bookError) throw bookError;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      toast.success("Book marked as returned");
      queryClient.invalidateQueries({ queryKey: ["all_borrowings"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error) => {
      console.error("Error returning book:", error);
      toast.error("Failed to return book: " + error.message);
    }
  });

  return {
    borrowings,
    borrowingsLoading,
    isLoading,
    returnBookMutation
  };
};
