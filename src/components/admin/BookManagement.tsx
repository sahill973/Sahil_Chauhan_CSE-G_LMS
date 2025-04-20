
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface BookData {
  title: string;
  author: string;
  category: string;
  isbn: string;
  description: string;
}

const BookManagement = () => {
  const [book, setBook] = useState<BookData>({ title: "", author: "", category: "", isbn: "", description: "" });
  const queryClient = useQueryClient();

  const { data: books = [], isLoading: booksLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      let { data } = await supabase.from("books").select("*").order("added_at", { ascending: false });
      return data || [];
    }
  });

  const addBookMutation = useMutation({
    mutationFn: async (newBook: BookData) => {
      const { data, error } = await supabase.from("books").insert([newBook]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Book added!");
      setBook({ title: "", author: "", category: "", isbn: "", description: "" });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const deleteBookMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("books").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Book deleted");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  function handleBookSubmit(e: React.FormEvent) {
    e.preventDefault();
    addBookMutation.mutate(book);
  }
  function handleDeleteBook(id: string) {
    if (!confirm("Delete this book?")) return;
    deleteBookMutation.mutate(id);
  }

  return (
    <div>
      {/* Add Book Form */}
      <form className="bg-white border p-5 rounded mb-6 space-y-3" onSubmit={handleBookSubmit}>
        <h3 className="font-semibold mb-2">Add New Book</h3>
        <Input value={book.title} name="title" onChange={e => setBook(b => ({ ...b, title: e.target.value }))} placeholder="Title" required />
        <Input value={book.author} name="author" onChange={e => setBook(b => ({ ...b, author: e.target.value }))} placeholder="Author" required />
        <Input value={book.category} name="category" onChange={e => setBook(b => ({ ...b, category: e.target.value }))} placeholder="Category" required />
        <Input value={book.isbn} name="isbn" onChange={e => setBook(b => ({ ...b, isbn: e.target.value }))} placeholder="ISBN" />
        <Input value={book.description} name="description" onChange={e => setBook(b => ({ ...b, description: e.target.value }))} placeholder="Description" />
        <Button 
          type="submit" 
          disabled={addBookMutation.isPending}
          className="bg-primary hover:bg-primary/90"
        >
          {addBookMutation.isPending ? "Saving..." : "Add Book"}
        </Button>
      </form>
      {/* Books List */}
      <div className="mb-7">
        <h3 className="font-semibold mb-4">All Books ({books.length})</h3>
        {booksLoading ? <div>Loading...</div> : (
          <div className="border rounded overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book: any) => (
                  <TableRow key={book.id}>
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
                        variant="destructive" 
                        size="sm"
                        disabled={deleteBookMutation.isPending} 
                        onClick={() => handleDeleteBook(book.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookManagement;
