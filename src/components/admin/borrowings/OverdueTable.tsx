
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { BorrowRow } from "./types";
import BorrowerInfo from "./BorrowerInfo";

interface OverdueTableProps {
  overdueBooks: BorrowRow[];
  onReturnBook: (id: string, book_id: string) => void;
  isLoading: boolean;
}

const OverdueTable = ({ overdueBooks, onReturnBook, isLoading }: OverdueTableProps) => {
  return (
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
        {overdueBooks.map((borrow: BorrowRow) => {
          const daysOverdue = Math.floor(
            (new Date().getTime() - new Date(borrow.due_at).getTime()) / (1000 * 3600 * 24)
          );
          return (
            <TableRow key={borrow.id} className="bg-red-50">
              <TableCell className="font-medium">{borrow.books?.title || "Unknown book"}</TableCell>
              <TableCell>
                <BorrowerInfo profile={borrow.profiles} />
              </TableCell>
              <TableCell>{format(new Date(borrow.due_at), 'MMM dd, yyyy')}</TableCell>
              <TableCell className="font-bold text-red-600">{daysOverdue} days</TableCell>
              <TableCell>
                <Button 
                  size="sm"
                  disabled={isLoading}
                  onClick={() => onReturnBook(borrow.id, borrow.book_id)}
                >
                  Mark as Returned
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default OverdueTable;
