
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isAfter } from "date-fns";

// Type matches borrowing with expanded book and user info
interface BorrowRow {
  id: string;
  borrowed_at: string;
  due_at: string;
  returned_at: string | null;
  book_id: string;
  user_id: string;
  books: { title: string; author: string; id: string } | null;
  profiles: { full_name: string; college_id: string } | null;
}

const BorrowingsManagement = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  
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
          books:book_id(id, title, author),
          profiles:user_id(full_name, college_id)
        `)
        .order("due_at", { ascending: true });
        
      if (error) {
        console.error("Error fetching borrowings:", error);
        toast.error("Failed to load borrowings");
        throw error;
      }
      
      console.log("Borrowings data:", data);
      return data || [];
    }
  });

  const returnBookMutation = useMutation({
    mutationFn: async ({ id, book_id }: { id: string, book_id: string }) => {
      setIsLoading(true);
      try {
        // Update borrowing record
        const { error: borrowError } = await supabase
          .from("borrowings")
          .update({ returned_at: new Date().toISOString() })
          .eq("id", id);
        if (borrowError) throw borrowError;
        
        // Update book availability
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

  function handleReturnBook(id: string, book_id: string) {
    if (!confirm("Mark this book as returned?")) return;
    returnBookMutation.mutate({ id, book_id });
  }

  return (
    <div>
      <h3 className="font-semibold mb-4">All Borrowings</h3>
      {borrowingsLoading ? (
        <div className="py-8 text-center">Loading borrowings data...</div>
      ) : (
        <div className="border rounded overflow-hidden">
          {borrowings.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No borrowings found. When books are borrowed, they will appear here.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Borrowed On</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {borrowings.map((borrow: BorrowRow) => (
                  <TableRow key={borrow.id}>
                    <TableCell className="font-medium">{borrow.books?.title || "Unknown book"}</TableCell>
                    <TableCell>
                      {borrow.profiles?.full_name || "Unknown user"} 
                      {borrow.profiles?.college_id ? `(${borrow.profiles.college_id})` : ""}
                    </TableCell>
                    <TableCell>{format(new Date(borrow.borrowed_at), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{format(new Date(borrow.due_at), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      {borrow.returned_at ? (
                        <span className="text-green-600 font-medium">
                          Returned on {format(new Date(borrow.returned_at), 'MMM dd, yyyy')}
                        </span>
                      ) : isAfter(new Date(), new Date(borrow.due_at)) ? (
                        <span className="text-red-600 font-medium">Overdue</span>
                      ) : (
                        <span className="text-amber-600 font-medium">Borrowed</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {!borrow.returned_at && (
                        <Button 
                          size="sm"
                          disabled={isLoading || returnBookMutation.isPending}
                          onClick={() => handleReturnBook(borrow.id, borrow.book_id)}
                        >
                          Mark as Returned
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
};

export default BorrowingsManagement;
