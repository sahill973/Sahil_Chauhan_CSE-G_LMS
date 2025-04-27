
import React from "react";
import { isAfter } from "date-fns";
import { useOverdueBooks } from "./borrowings/useOverdueBooks";
import OverdueTable from "./borrowings/OverdueTable";

const OverdueBooks = () => {
  const { borrowings, borrowingsLoading, isLoading, returnBookMutation } = useOverdueBooks();

  // Filter for overdue books
  const overdueBooks = borrowings.filter(b => 
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
            <OverdueTable 
              overdueBooks={overdueBooks}
              onReturnBook={handleReturnBook}
              isLoading={isLoading}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default OverdueBooks;
