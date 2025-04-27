
import React from "react";
import { format, isAfter } from "date-fns";

interface BorrowStatusProps {
  dueAt: string;
  returnedAt: string | null;
}

const BorrowStatus = ({ dueAt, returnedAt }: BorrowStatusProps) => {
  if (returnedAt) {
    return (
      <span className="text-green-600 font-medium">
        Returned on {format(new Date(returnedAt), 'MMM dd, yyyy')}
      </span>
    );
  }

  if (isAfter(new Date(), new Date(dueAt))) {
    return <span className="text-red-600 font-medium">Overdue</span>;
  }

  return <span className="text-amber-600 font-medium">Borrowed</span>;
};

export default BorrowStatus;
