
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { format, addDays } from "date-fns";
import type { BorrowRequest } from "./types";

export const useBorrowRequests = () => {
  const queryClient = useQueryClient();

  // Fetch all borrow requests
  const { data: requests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ["borrow_requests"],
    queryFn: async () => {
      console.log("Fetching borrow requests");
      const { data, error } = await supabase
        .from("borrow_requests")
        .select(`
          id,
          created_at,
          status,
          book_id,
          user_id,
          books:book_id(id, title, author, available)
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false });
        
      if (error) {
        console.error("Error fetching borrow requests:", error);
        toast.error("Failed to load borrow requests");
        throw error;
      }
      
      const requestsWithProfiles = await Promise.all(
        (data || []).map(async (request) => {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name, college_id, department")
            .eq("id", request.user_id)
            .maybeSingle();
            
          return {
            ...request,
            profiles: profileData || { full_name: "Unknown User", college_id: "", department: "" }
          };
        })
      );
      
      return requestsWithProfiles as BorrowRequest[];
    }
  });

  // Approve request mutation
  const approveRequestMutation = useMutation({
    mutationFn: async ({ id, book_id, user_id }: { id: string, book_id: string, user_id: string }) => {
      try {
        // Calculate due date (14 days from now)
        const dueDate = addDays(new Date(), 14);
        
        // Update request status
        const { error: requestError } = await supabase
          .from("borrow_requests")
          .update({ status: "approved" })
          .eq("id", id);
          
        if (requestError) throw requestError;

        // Insert borrowing record
        const { error: borrowError } = await supabase
          .from("borrowings")
          .insert({
            book_id: book_id,
            user_id: user_id,
            due_at: dueDate.toISOString()
          });
          
        if (borrowError) throw borrowError;
        
        // Update book availability
        const { error: bookError } = await supabase
          .from("books")
          .update({ available: false })
          .eq("id", book_id);
          
        if (bookError) throw bookError;
      } catch (error) {
        console.error("Error approving request:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Request approved and book borrowed");
      queryClient.invalidateQueries({ queryKey: ["borrow_requests"] });
      queryClient.invalidateQueries({ queryKey: ["all_borrowings"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error) => {
      console.error("Error approving request:", error);
      toast.error("Failed to approve request: " + error.message);
    }
  });

  // Reject request mutation
  const rejectRequestMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      try {
        const { error } = await supabase
          .from("borrow_requests")
          .update({ status: "rejected" })
          .eq("id", id);
          
        if (error) throw error;
      } catch (error) {
        console.error("Error rejecting request:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Request rejected");
      queryClient.invalidateQueries({ queryKey: ["borrow_requests"] });
    },
    onError: (error) => {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject request: " + error.message);
    }
  });

  return {
    requests,
    requestsLoading,
    approveRequestMutation,
    rejectRequestMutation
  };
};
