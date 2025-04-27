
import React, { useState } from "react";
import { useBorrowRequests } from "./borrowings/useBorrowRequests";
import BorrowRequestsTable from "./borrowings/BorrowRequestsTable";

const BorrowRequests = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { requests, requestsLoading, approveRequestMutation, rejectRequestMutation } = useBorrowRequests();

  function handleApproveRequest(id: string, book_id: string, user_id: string) {
    if (!confirm("Approve this borrow request?")) return;
    setIsLoading(true);
    approveRequestMutation.mutate({ id, book_id, user_id }, {
      onSettled: () => setIsLoading(false)
    });
  }

  function handleRejectRequest(id: string) {
    if (!confirm("Reject this borrow request?")) return;
    setIsLoading(true);
    rejectRequestMutation.mutate({ id }, {
      onSettled: () => setIsLoading(false)
    });
  }

  return (
    <div>
      <h3 className="font-semibold mb-4">Borrow Requests ({requests.length})</h3>
      {requestsLoading ? (
        <div className="py-8 text-center">Loading borrow requests...</div>
      ) : (
        <div className="border rounded overflow-hidden">
          {requests.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No pending requests. When students request books, they will appear here.
            </div>
          ) : (
            <BorrowRequestsTable 
              requests={requests}
              onApproveRequest={handleApproveRequest}
              onRejectRequest={handleRejectRequest}
              isLoading={isLoading || approveRequestMutation.isPending || rejectRequestMutation.isPending}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default BorrowRequests;
