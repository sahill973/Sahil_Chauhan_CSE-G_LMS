
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const BooksList = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      let { data } = await supabase.from("books").select("*").eq("available", true).order("added_at", { ascending: false });
      return data || [];
    }
  });

  if (isLoading) return <div>Loading books...</div>;
  if (!data?.length) return <div className="text-muted-foreground">No books available.</div>;

  return (
    <ul className="space-y-3">
      {data.map((book: any) => (
        <li key={book.id} className="border p-3 rounded flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <span className="font-semibold">{book.title}</span> — {book.author} <span className="text-sm text-muted-foreground">({book.category})</span>
          </div>
          {/* TODO: Borrow logic here */}
        </li>
      ))}
    </ul>
  );
};

export default BooksList;
