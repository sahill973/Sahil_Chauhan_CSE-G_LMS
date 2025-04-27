
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isAfter } from "date-fns";

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

const OverdueBooks = () => {
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
          books:book_id(id, title, author),
          profiles:user_id(full_name, college_id)
        `)
        .order("due_at", { ascending: true });
        
      if (error) {
        console.error("Error fetching borrowings:", error);
        toast.error("Failed to load overdue books");
        throw error;
      }
      
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

  // Filter for overdue books
  const overdueBooks = (borrowings as BorrowRow[]).filter(b => 
    !b.returned_at && isAfter(new Date(), new Date(b.due_at))
  );

  function handleReturnBook(id: string, book_id: string) {
    if (!confirm("Mark this book as returned?")) return;
    returnBookMutation.mutate({ id, book_id });
  }

  return (
    <div>
      <h3 className="font-semibold mb-4 text-red-600">
        Overdue Books ({overdueBooks.length})
      </h3>
      {borrowingsLoading ? (
        <div className="py-8 text-center">Loading overdue books data...</div>
      ) : (
        <div className="border rounded overflow-hidden border-red-200">
          {overdueBooks.length === 0 ? (
            <div className="p-6 text-center">No overdue books!</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Days Overdue</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overdueBooks.map((borrow: BorrowRow) => {
                  const daysOverdue = Math.floor(
                    (new Date().getTime() - new Date(borrow.due_at).getTime()) / (1000 * 3600 * 24)
                  );
                  return (
                    <TableRow key={borrow.id} className="bg-red-50">
                      <TableCell className="font-medium">{borrow.books?.title || "Unknown book"}</TableCell>
                      <TableCell>
                        {borrow.profiles?.full_name || "Unknown user"} 
                        {borrow.profiles?.college_id ? `(${borrow.profiles.college_id})` : ""}
                      </TableCell>
                      <TableCell>{format(new Date(borrow.due_at), 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="font-bold text-red-600">{daysOverdue} days</TableCell>
                      <TableCell>
                        <Button 
                          size="sm"
                          disabled={isLoading || returnBookMutation.isPending}
                          onClick={() => handleReturnBook(borrow.id, borrow.book_id)}
                        >
                          Mark as Returned
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
};

export default OverdueBooks;
