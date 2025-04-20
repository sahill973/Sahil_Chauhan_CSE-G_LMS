
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, isPast, formatDistanceToNow } from "date-fns";

interface BorrowingHistoryProps {
  userId: string;
}

interface Borrowing {
  id: string;
  borrowed_at: string;
  due_at: string;
  returned_at: string | null;
  book: {
    id: string;
    title: string;
    author: string;
  };
}

const BorrowingHistory = ({ userId }: BorrowingHistoryProps) => {
  const queryClient = useQueryClient();
  
  const { data: borrowings = [], isLoading } = useQuery({
    queryKey: ["borrowings", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("borrowings")
        .select(`
          *,
          book:book_id(id, title, author)
        `)
        .eq("user_id", userId)
        .order("borrowed_at", { ascending: false });
      return data || [];
    }
  });

  // Return book mutation
  const returnMutation = useMutation({
    mutationFn: async (borrowingId: string) => {
      const borrowing = borrowings.find(b => b.id === borrowingId);
      if (!borrowing) throw new Error("Borrowing not found");
      
      // Update borrowing to mark as returned
      const { error: updateBorrowingError } = await supabase
        .from("borrowings")
        .update({ returned_at: new Date().toISOString() })
        .eq("id", borrowingId);
      
      if (updateBorrowingError) throw updateBorrowingError;
      
      // Update book to mark as available
      const { error: updateBookError } = await supabase
        .from("books")
        .update({ available: true })
        .eq("id", borrowing.book.id);
      
      if (updateBookError) throw updateBookError;
      
      return borrowingId;
    },
    onSuccess: () => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ["borrowings"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Book returned successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to return book: ${error.message}`);
    }
  });

  if (isLoading) return <div>Loading your borrowing history...</div>;
  
  // Group borrowings by status (active vs. returned)
  const activeBorrowings = borrowings.filter(b => !b.returned_at);
  const returnedBorrowings = borrowings.filter(b => b.returned_at);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold mb-4">Currently Borrowed Books ({activeBorrowings.length})</h3>
        {activeBorrowings.length === 0 ? (
          <p className="text-muted-foreground">You don't have any books currently borrowed.</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Borrowed On</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeBorrowings.map((borrowing: Borrowing) => {
                  const isDue = isPast(new Date(borrowing.due_at));
                  return (
                    <TableRow key={borrowing.id}>
                      <TableCell className="font-medium">{borrowing.book.title}</TableCell>
                      <TableCell>{borrowing.book.author}</TableCell>
                      <TableCell>{format(new Date(borrowing.borrowed_at), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <span className={isDue ? "text-red-500 font-semibold" : ""}>
                          {format(new Date(borrowing.due_at), "MMM d, yyyy")}
                        </span>
                      </TableCell>
                      <TableCell>
                        {isDue ? (
                          <span className="text-red-500 font-semibold">Overdue</span>
                        ) : (
                          <span>
                            Due in {formatDistanceToNow(new Date(borrowing.due_at))}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          onClick={() => returnMutation.mutate(borrowing.id)}
                          disabled={returnMutation.isPending}
                        >
                          Return
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {returnedBorrowings.length > 0 && (
        <div>
          <h3 className="font-semibold mb-4">Return History ({returnedBorrowings.length})</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Borrowed On</TableHead>
                  <TableHead>Returned On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returnedBorrowings.map((borrowing: Borrowing) => (
                  <TableRow key={borrowing.id}>
                    <TableCell className="font-medium">{borrowing.book.title}</TableCell>
                    <TableCell>{borrowing.book.author}</TableCell>
                    <TableCell>{format(new Date(borrowing.borrowed_at), "MMM d, yyyy")}</TableCell>
                    <TableCell>{format(new Date(borrowing.returned_at!), "MMM d, yyyy")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowingHistory;
