
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const AdminPanel = () => {
  // Book form state
  const [book, setBook] = useState({
    title: "", author: "", category: "", isbn: "", description: ""
  });
  const [material, setMaterial] = useState({
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

  // Add book
  async function handleBookSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoadingBook(true);
    const { data, error } = await supabase.from("books").insert([book]);
    setLoadingBook(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Book added!");
    setBook({ title: "", author: "", category: "", isbn: "", description: "" });
    queryClient.invalidateQueries({ queryKey: ["books"] });
  }
  // Delete book
  async function handleDeleteBook(id: string) {
    if (!confirm("Delete this book?")) return;
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Book deleted");
    queryClient.invalidateQueries({ queryKey: ["books"] });
  }
  // Add study material
  async function handleMatSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoadingMat(true);
    const { data, error } = await supabase.from("study_materials").insert([material]);
    setLoadingMat(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Material added!");
    setMaterial({ title: "", subject: "", file_url: "", description: "" });
    queryClient.invalidateQueries({ queryKey: ["study_materials"] });
  }
  // Delete material
  async function handleDeleteMaterial(id: string) {
    if (!confirm("Delete this material?")) return;
    const { error } = await supabase.from("study_materials").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Material deleted");
    queryClient.invalidateQueries({ queryKey: ["study_materials"] });
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-5">Admin Panel</h2>
      {/* ----------- Add Book ---------- */}
      <form className="bg-white border p-5 rounded mb-6 space-y-3" onSubmit={handleBookSubmit}>
        <h3 className="font-semibold mb-2">Add Book</h3>
        <Input value={book.title} name="title" onChange={e => setBook(b => ({ ...b, title: e.target.value }))} placeholder="Title" required />
        <Input value={book.author} name="author" onChange={e => setBook(b => ({ ...b, author: e.target.value }))} placeholder="Author" required />
        <Input value={book.category} name="category" onChange={e => setBook(b => ({ ...b, category: e.target.value }))} placeholder="Category" required />
        <Input value={book.isbn} name="isbn" onChange={e => setBook(b => ({ ...b, isbn: e.target.value }))} placeholder="ISBN" />
        <Input value={book.description} name="description" onChange={e => setBook(b => ({ ...b, description: e.target.value }))} placeholder="Description" />
        <Button type="submit" disabled={loadingBook}>{loadingBook ? "Saving..." : "Add Book"}</Button>
      </form>
      <div className="mb-7">
        <h3 className="font-semibold mb-2">All Books</h3>
        {booksLoading ? <div>Loading...</div> : (
          <ul>
            {books.map((book: any) => (
              <li key={book.id} className="flex justify-between items-center border p-2 mb-2 rounded">
                <div>{book.title} — {book.author} ({book.category})</div>
                <Button variant="destructive" onClick={() => handleDeleteBook(book.id)}>Delete</Button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* ----------- Add Study Material ---------- */}
      <form className="bg-white border p-5 rounded mb-6 space-y-3" onSubmit={handleMatSubmit}>
        <h3 className="font-semibold mb-2">Add Study Material</h3>
        <Input value={material.title} name="title" onChange={e => setMaterial(m => ({ ...m, title: e.target.value }))} placeholder="Title" required />
        <Input value={material.subject} name="subject" onChange={e => setMaterial(m => ({ ...m, subject: e.target.value }))} placeholder="Subject" required />
        <Input value={material.file_url} name="file_url" onChange={e => setMaterial(m => ({ ...m, file_url: e.target.value }))} placeholder="File URL" />
        <Input value={material.description} name="description" onChange={e => setMaterial(m => ({ ...m, description: e.target.value }))} placeholder="Description" />
        <Button type="submit" disabled={loadingMat}>{loadingMat ? "Saving..." : "Add Material"}</Button>
      </form>
      <div>
        <h3 className="font-semibold mb-2">All Study Materials</h3>
        {materialsLoading ? <div>Loading...</div> : (
          <ul>
            {materials.map((mat: any) => (
              <li key={mat.id} className="flex justify-between items-center border p-2 mb-2 rounded">
                <div>{mat.title} — {mat.subject}</div>
                <Button variant="destructive" onClick={() => handleDeleteMaterial(mat.id)}>Delete</Button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* ---- EXTENSION: AI API, email, payments & scheduled tasks go here ---- */}
      {/* TODO: Connect with OpenAI for AI features (via Edge Functions) */}
      {/* TODO: Add email notifications using Supabase Edge Functions */}
      {/* TODO: Add payment functionality (Stripe or RazorPay API) */}
      {/* TODO: Implement scheduled tasks, if needed */}
    </div>
  );
};
export default AdminPanel;
