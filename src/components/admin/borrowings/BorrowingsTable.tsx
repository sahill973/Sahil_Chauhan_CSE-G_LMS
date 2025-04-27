
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { BorrowRow } from "./types";
import BorrowerInfo from "./BorrowerInfo";
import BorrowStatus from "./BorrowStatus";

interface BorrowingsTableProps {
  borrowings: BorrowRow[];
  onReturnBook: (id: string, book_id: string) => void;
  isLoading: boolean;
}

const BorrowingsTable = ({ borrowings, onReturnBook, isLoading }: BorrowingsTableProps) => {
  return (
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
        {borrowings.map((borrow: BorrowRow) => (
          <TableRow key={borrow.id}>
            <TableCell className="font-medium">
              {borrow.books?.title || "Unknown book"}
            </TableCell>
            <TableCell>
              <BorrowerInfo profile={borrow.profiles} />
            </TableCell>
            <TableCell>{format(new Date(borrow.borrowed_at), 'MMM dd, yyyy')}</TableCell>
            <TableCell>{format(new Date(borrow.due_at), 'MMM dd, yyyy')}</TableCell>
            <TableCell>
              <BorrowStatus dueAt={borrow.due_at} returnedAt={borrow.returned_at} />
            </TableCell>
            <TableCell>
              {!borrow.returned_at && (
                <Button 
                  size="sm"
                  disabled={isLoading}
                  onClick={() => onReturnBook(borrow.id, borrow.book_id)}
                >
                  Mark as Returned
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BorrowingsTable;
