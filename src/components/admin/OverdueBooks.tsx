
import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isAfter } from "date-fns";

// Reuse BorrowRow definition from BorrowingsManagement if needed
const OverdueBooks = () => {
  const queryClient = useQueryClient();
  const { data: borrowings = [], isLoading: borrowingsLoading } = useQuery({
    queryKey: ["all_borrowings"],
    queryFn: async () => {
      let { data } = await supabase
        .from("borrowings")
        .select(`
          id,
          borrowed_at,
          due_at,
          returned_at,
          book_id,
          user_id,
          books:book_id(title, author),
          profiles:user_id(full_name, college_id)
        `)
        .order("due_at", { ascending: true });
      return data || [];
    }
  });

  const returnBookMutation = useMutation({
    mutationFn: async ({ id, book_id }: { id: string, book_id: string }) => {
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
    },
    onSuccess: () => {
      toast.success("Book marked as returned");
      queryClient.invalidateQueries({ queryKey: ["all_borrowings"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  // Filter for overdue books
  const overdueBooks = (borrowings as any[]).filter(b => !b.returned_at && isAfter(new Date(), new Date(b.due_at)));

  function handleReturnBook(id: string, book_id: string) {
    if (!confirm("Mark this book as returned?")) return;
    returnBookMutation.mutate({ id, book_id });
  }

  return (
    <div>
      <h3 className="font-semibold mb-4 text-red-600">
        Overdue Books ({overdueBooks.length})
      </h3>
      {borrowingsLoading ? <div>Loading...</div> : (
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
                {overdueBooks.map((borrow: any) => {
                  const daysOverdue = Math.floor(
                    (new Date().getTime() - new Date(borrow.due_at).getTime()) / (1000 * 3600 * 24)
                  );
                  return (
                    <TableRow key={borrow.id} className="bg-red-50">
                      <TableCell className="font-medium">{borrow.books?.title}</TableCell>
                      <TableCell>{borrow.profiles?.full_name} ({borrow.profiles?.college_id})</TableCell>
                      <TableCell>{format(new Date(borrow.due_at), 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="font-bold text-red-600">{daysOverdue} days</TableCell>
                      <TableCell>
                        <Button 
                          size="sm"
                          disabled={returnBookMutation.isPending}
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
