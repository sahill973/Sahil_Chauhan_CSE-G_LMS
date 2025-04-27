
import React, { useState } from "react";
import { useBorrowings } from "./borrowings/useBorrowings";
import BorrowingsTable from "./borrowings/BorrowingsTable";

const BorrowingsManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { borrowings, borrowingsLoading, returnBookMutation } = useBorrowings();

  function handleReturnBook(id: string, book_id: string) {
    if (!confirm("Mark this book as returned?")) return;
    setIsLoading(true);
    returnBookMutation.mutate({ id, book_id }, {
      onSettled: () => setIsLoading(false)
    });
  }

  return (
    <div>
      <h3 className="font-semibold mb-4">All Borrowings</h3>
      {borrowingsLoading ? (
        <div className="py-8 text-center">Loading borrowings data...</div>
      ) : (
        <div className="border rounded overflow-hidden">
          {borrowings.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No borrowings found. When books are borrowed, they will appear here.
            </div>
          ) : (
            <BorrowingsTable 
              borrowings={borrowings}
              onReturnBook={handleReturnBook}
              isLoading={isLoading || returnBookMutation.isPending}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default BorrowingsManagement;
