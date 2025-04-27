
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { BorrowRequest } from "./types";
import BorrowerInfo from "./BorrowerInfo";

interface BorrowRequestsTableProps {
  requests: BorrowRequest[];
  onApproveRequest: (id: string, book_id: string, user_id: string) => void;
  onRejectRequest: (id: string) => void;
  isLoading: boolean;
}

const BorrowRequestsTable = ({ 
  requests, 
  onApproveRequest, 
  onRejectRequest, 
  isLoading 
}: BorrowRequestsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Book</TableHead>
          <TableHead>Borrower</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Requested Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id} className="bg-amber-50">
            <TableCell className="font-medium">{request.books?.title || "Unknown book"}</TableCell>
            <TableCell>
              <BorrowerInfo profile={request.profiles} />
            </TableCell>
            <TableCell>{request.profiles?.department || "Unknown"}</TableCell>
            <TableCell>{format(new Date(request.created_at), 'MMM dd, yyyy')}</TableCell>
            <TableCell className="space-x-2">
              <Button 
                size="sm"
                variant="default"
                disabled={isLoading}
                onClick={() => onApproveRequest(request.id, request.book_id, request.user_id)}
              >
                Approve
              </Button>
              <Button 
                size="sm"
                variant="destructive"
                disabled={isLoading}
                onClick={() => onRejectRequest(request.id)}
              >
                Reject
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BorrowRequestsTable;
