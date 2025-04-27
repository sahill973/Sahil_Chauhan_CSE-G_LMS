
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import type { BorrowRow } from "./types";

export const useBorrowings = () => {
  const queryClient = useQueryClient();

  const { data: borrowings = [], isLoading: borrowingsLoading } = useQuery({
    queryKey: ["all_borrowings"],
    queryFn: async () => {
      console.log("Fetching all borrowings");
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
        toast.error("Failed to load borrowings");
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
      } catch (error) {
        console.error("Error returning book:", error);
        throw error;
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
    returnBookMutation
  };
};
