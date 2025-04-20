
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, isAfter } from "date-fns";

// Type definitions for books and materials
interface BookData {
  title: string;
  author: string;
  category: string;
  isbn: string;
  description: string;
}

interface MaterialData {
  title: string;
  subject: string;
  file_url: string;
  description: string;
}

const AdminPanel = () => {
  // Book form state
  const [book, setBook] = useState<BookData>({
    title: "", author: "", category: "", isbn: "", description: ""
  });
  const [material, setMaterial] = useState<MaterialData>({
    title: "", subject: "", file_url: "", description: ""
  });
  const [loadingBook, setLoadingBook] = useState(false);
  const [loadingMat, setLoadingMat] = useState(false);
  const queryClient = useQueryClient();

  // Books
  const { data: books = [], isLoading: booksLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      let { data } = await supabase.from("books").select("*").order("added_at", { ascending: false });
      return data || [];
    }
  });

  // Study Materials
  const { data: materials = [], isLoading: materialsLoading } = useQuery({
    queryKey: ["study_materials"],
    queryFn: async () => {
      let { data } = await supabase.from("study_materials").select("*").order("added_at", { ascending: false });
      return data || [];
    }
  });

  // Borrowings with user information
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

  // Add book
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

  // Delete book
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

  // Mark book as returned
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

  // Add study material
  const addMaterialMutation = useMutation({
    mutationFn: async (newMaterial: MaterialData) => {
      const { data, error } = await supabase.from("study_materials").insert([newMaterial]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Material added!");
      setMaterial({ title: "", subject: "", file_url: "", description: "" });
      queryClient.invalidateQueries({ queryKey: ["study_materials"] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  // Delete material
  const deleteMaterialMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("study_materials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Material deleted");
      queryClient.invalidateQueries({ queryKey: ["study_materials"] });
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

  function handleMatSubmit(e: React.FormEvent) {
    e.preventDefault();
    addMaterialMutation.mutate(material);
  }

  function handleDeleteMaterial(id: string) {
    if (!confirm("Delete this material?")) return;
    deleteMaterialMutation.mutate(id);
  }

  function handleReturnBook(id: string, book_id: string) {
    if (!confirm("Mark this book as returned?")) return;
    returnBookMutation.mutate({ id, book_id });
  }

  // Filter for overdue books (due date is before today and not returned)
  const overdueBooks = borrowings.filter(b => 
    !b.returned_at && isAfter(new Date(), new Date(b.due_at))
  );

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h2 className="text-3xl font-bold mb-5 text-primary">Librarian Dashboard</h2>

      <Tabs defaultValue="books" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="books">Manage Books</TabsTrigger>
          <TabsTrigger value="materials">Study Materials</TabsTrigger>
          <TabsTrigger value="borrowings">All Borrowings</TabsTrigger>
          <TabsTrigger value="overdue" className="relative">
            Overdue Books
            {overdueBooks.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {overdueBooks.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="books">
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
        </TabsContent>

        <TabsContent value="materials">
          {/* Add Study Material */}
          <form className="bg-white border p-5 rounded mb-6 space-y-3" onSubmit={handleMatSubmit}>
            <h3 className="font-semibold mb-2">Add Study Material</h3>
            <Input value={material.title} name="title" onChange={e => setMaterial(m => ({ ...m, title: e.target.value }))} placeholder="Title" required />
            <Input value={material.subject} name="subject" onChange={e => setMaterial(m => ({ ...m, subject: e.target.value }))} placeholder="Subject" required />
            <Input value={material.file_url} name="file_url" onChange={e => setMaterial(m => ({ ...m, file_url: e.target.value }))} placeholder="File URL" />
            <Input value={material.description} name="description" onChange={e => setMaterial(m => ({ ...m, description: e.target.value }))} placeholder="Description" />
            <Button 
              type="submit" 
              disabled={addMaterialMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {addMaterialMutation.isPending ? "Saving..." : "Add Material"}
            </Button>
          </form>

          {/* Materials List */}
          <div>
            <h3 className="font-semibold mb-4">All Study Materials ({materials.length})</h3>
            {materialsLoading ? <div>Loading...</div> : (
              <div className="border rounded overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materials.map((mat: any) => (
                      <TableRow key={mat.id}>
                        <TableCell className="font-medium">{mat.title}</TableCell>
                        <TableCell>{mat.subject}</TableCell>
                        <TableCell>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            disabled={deleteMaterialMutation.isPending} 
                            onClick={() => handleDeleteMaterial(mat.id)}
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
        </TabsContent>

        <TabsContent value="borrowings">
          <h3 className="font-semibold mb-4">All Borrowings</h3>
          {borrowingsLoading ? <div>Loading...</div> : (
            <div className="border rounded overflow-hidden">
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
                  {borrowings.map((borrow: any) => (
                    <TableRow key={borrow.id}>
                      <TableCell className="font-medium">{borrow.books?.title}</TableCell>
                      <TableCell>{borrow.profiles?.full_name} ({borrow.profiles?.college_id})</TableCell>
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
                            disabled={returnBookMutation.isPending}
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
            </div>
          )}
        </TabsContent>

        <TabsContent value="overdue">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
