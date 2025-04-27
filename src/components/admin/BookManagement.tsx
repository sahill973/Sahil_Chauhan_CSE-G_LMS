
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Book categories
const BOOK_CATEGORIES = [
  "Fiction",
  "Non-Fiction",
  "Science",
  "Mathematics",
  "History",
  "Biography",
  "Technology",
  "Literature",
  "Art & Design",
  "Business & Management",
  "Engineering",
  "Philosophy",
  "Psychology",
  "Religion & Spirituality",
  "Health & Fitness",
  "Children's Books",
  "Fantasy",
  "Mystery & Thriller",
  "Romance",
  "Travel",
  "Education",
  "Self-Help",
  "Comics & Graphic Novels",
  "Political Science",
  "Environmental Science",
  "Sports & Recreation",
  "Cooking & Food",
  "Language & Grammar",
  "Music",
  "Law"
];

interface BookData {
  title: string;
  author: string;
  category: string;
  isbn: string;
  description: string;
  cover_image?: string;
}

const BookManagement = () => {
  const [book, setBook] = useState<BookData>({ 
    title: "", 
    author: "", 
    category: "", 
    isbn: "", 
    description: "", 
    cover_image: "" 
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  // Get books grouped by category
  const { data: books = [], isLoading: booksLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      let { data } = await supabase.from("books").select("*").order("category", { ascending: true });
      return data || [];
    }
  });

  // Group books by category
  const booksByCategory = books.reduce((acc: Record<string, any[]>, book: any) => {
    if (!acc[book.category]) {
      acc[book.category] = [];
    }
    acc[book.category].push(book);
    return acc;
  }, {});

  const addBookMutation = useMutation({
    mutationFn: async (newBook: BookData) => {
      const { data, error } = await supabase.from("books").insert([newBook]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Book added!");
      setBook({ title: "", author: "", category: "", isbn: "", description: "", cover_image: "" });
      setCoverImage(null);
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

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }
    
    setCoverImage(file);
  }

  async function handleBookSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Check if required fields are filled
    if (!book.title || !book.author || !book.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      setUploading(true);
      
      // If there's an image to upload
      if (coverImage) {
        const fileExt = coverImage.name.split('.').pop();
        const filePath = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('book-covers')
          .upload(filePath, coverImage);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data } = supabase.storage
          .from('book-covers')
          .getPublicUrl(filePath);
          
        // Add the image URL to the book data
        book.cover_image = data.publicUrl;
      }
      
      // Add the book to the database
      addBookMutation.mutate(book);
      
    } catch (error: any) {
      toast.error(`Error uploading image: ${error.message}`);
    } finally {
      setUploading(false);
    }
  }

  function handleDeleteBook(id: string) {
    if (!confirm("Delete this book?")) return;
    deleteBookMutation.mutate(id);
  }

  return (
    <div>
      {/* Add Book Form */}
      <form className="bg-white border p-5 rounded mb-6 space-y-4" onSubmit={handleBookSubmit}>
        <h3 className="font-semibold mb-2">Add New Book</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input 
              id="title"
              value={book.title} 
              onChange={e => setBook(b => ({ ...b, title: e.target.value }))} 
              placeholder="Book Title" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input 
              id="author"
              value={book.author} 
              onChange={e => setBook(b => ({ ...b, author: e.target.value }))} 
              placeholder="Author Name" 
              required 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select 
              value={book.category}
              onValueChange={(value) => setBook(b => ({ ...b, category: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {BOOK_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN</Label>
            <Input 
              id="isbn"
              value={book.isbn} 
              onChange={e => setBook(b => ({ ...b, isbn: e.target.value }))} 
              placeholder="ISBN (Optional)" 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description"
            value={book.description} 
            onChange={e => setBook(b => ({ ...b, description: e.target.value }))} 
            placeholder="Book Description (Optional)" 
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cover">Cover Image</Label>
          <Input 
            id="cover"
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            className="cursor-pointer"
          />
          <p className="text-xs text-muted-foreground">Recommended size: 300x450 pixels. Max 5MB.</p>
        </div>
        
        {coverImage && (
          <div className="mt-2">
            <p className="text-sm font-medium">Preview:</p>
            <img 
              src={URL.createObjectURL(coverImage)} 
              alt="Cover preview" 
              className="mt-1 w-24 h-36 object-cover border rounded"
            />
          </div>
        )}
        
        <Button 
          type="submit" 
          disabled={addBookMutation.isPending || uploading}
          className="bg-primary hover:bg-primary/90 w-full"
        >
          {addBookMutation.isPending || uploading ? "Saving..." : "Add Book"}
        </Button>
      </form>
      
      {/* Books List By Category */}
      <div className="mb-7">
        <h3 className="font-semibold mb-4">All Books by Category ({books.length})</h3>
        {booksLoading ? <div>Loading...</div> : (
          <div className="space-y-8">
            {Object.entries(booksByCategory).map(([category, categoryBooks]) => (
              <div key={category} className="border rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 font-semibold text-slate-800">
                  {category} ({categoryBooks.length})
                </div>
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
                    {categoryBooks.map((book: any) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookManagement;
