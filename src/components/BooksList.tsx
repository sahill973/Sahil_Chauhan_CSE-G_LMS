
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
import { useUser } from "@/hooks/useUser";
import { format, addDays } from "date-fns";

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  available: boolean;
  description?: string;
  isbn?: string;
  cover_image?: string;
}

interface BooksListProps {
  searchQuery?: string;
  departmentFilter?: string;
}

const BooksList = ({ searchQuery = "", departmentFilter }: BooksListProps) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  
  // Fetch all books with search and department filters
  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books", searchQuery, departmentFilter],
    queryFn: async () => {
      let query = supabase.from("books").select("*");
      
      // Apply search if provided
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%,isbn.ilike.%${searchQuery}%`);
      }
      
      // Apply department filter if provided
      if (departmentFilter && departmentFilter !== "admin") {
        query = query.eq("category", departmentFilter);
      }
      
      const { data } = await query.order("title");
      return data || [];
    }
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
      // Invalidate and refetch books queries
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["borrowings"] });
      toast.success("Book borrowed successfully! Due in 14 days.");
    },
    onError: (error) => {
      toast.error(`Failed to borrow book: ${error.message}`);
    }
  });

  if (isLoading) return <div>Loading books...</div>;
  if (!books?.length) return <div className="text-muted-foreground">No books found matching your search criteria.</div>;

  return (
    <div>
      <h3 className="font-semibold mb-4">Books in Catalogue ({books.length})</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book: Book) => (
              <TableRow key={book.id}>
                <TableCell>
                  {book.cover_image ? (
                    <img 
                      src={book.cover_image} 
                      alt={book.title} 
                      className="w-12 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-16 bg-slate-200 flex items-center justify-center rounded">
                      <span className="text-xs text-slate-500">No Cover</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.category}</TableCell>
                <TableCell>
                  {book.available ? 
                    <span className="text-green-600 font-medium">Available</span> : 
                    <span className="text-red-600 font-medium">Borrowed</span>}
                </TableCell>
                <TableCell>
                  <Button 
                    size="sm" 
                    disabled={!book.available || borrowMutation.isPending}
                    onClick={() => borrowMutation.mutate(book.id)}
                  >
                    {borrowMutation.isPending ? "Processing..." : "Borrow"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BooksList;
