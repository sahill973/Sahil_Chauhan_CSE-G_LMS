
import React, { useMemo } from "react";
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

  // Request to borrow book mutation
  const borrowRequestMutation = useMutation({
    mutationFn: async (bookId: string) => {
      // Create borrow request record
      const { error } = await supabase
        .from("borrow_requests")
        .insert({
          book_id: bookId,
          user_id: user?.id,
          status: 'pending'
        });
      
      if (error) throw error;
      
      return { bookId };
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["borrow_requests"] });
      toast.success("Borrow request submitted successfully! Awaiting librarian approval.");
    },
    onError: (error) => {
      toast.error(`Failed to request book: ${error.message}`);
    }
  });

  // Check if user already has a pending request for a book
  const { data: userRequests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ["borrow_requests", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("borrow_requests")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "pending");

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  // Group books by category
  const booksByCategory = useMemo(() => {
    const grouped: Record<string, Book[]> = {};
    
    books.forEach((book: Book) => {
      if (!grouped[book.category]) {
        grouped[book.category] = [];
      }
      grouped[book.category].push(book);
    });
    
    return grouped;
  }, [books]);

  const isPendingRequest = (bookId: string) => {
    return userRequests.some(request => request.book_id === bookId);
  };

  if (isLoading) return <div>Loading books...</div>;
  if (!books?.length) return <div className="text-muted-foreground">No books found matching your search criteria.</div>;

  return (
    <div>
      <h3 className="font-semibold mb-4">Books in Catalogue ({books.length})</h3>
      
      {Object.keys(booksByCategory).length === 0 ? (
        <p className="text-muted-foreground">No books found matching your criteria.</p>
      ) : (
        Object.entries(booksByCategory).map(([category, categoryBooks]) => (
          <div key={category} className="mb-8">
            <h4 className="text-lg font-semibold mb-3 text-primary">{category}</h4>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cover</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryBooks.map((book: Book) => (
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
                      <TableCell>
                        {!book.available ? (
                          <span className="text-red-600 font-medium">Borrowed</span>
                        ) : isPendingRequest(book.id) ? (
                          <span className="text-amber-600 font-medium">Request Pending</span>
                        ) : (
                          <span className="text-green-600 font-medium">Available</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          disabled={!book.available || borrowRequestMutation.isPending || isPendingRequest(book.id)}
                          onClick={() => borrowRequestMutation.mutate(book.id)}
                        >
                          {isPendingRequest(book.id) 
                            ? "Request Pending" 
                            : borrowRequestMutation.isPending 
                              ? "Processing..." 
                              : "Request Book"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BooksList;
