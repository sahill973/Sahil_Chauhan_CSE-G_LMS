
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookManagement from "./admin/BookManagement";
import BorrowingsManagement from "./admin/BorrowingsManagement";
import OverdueBooks from "./admin/OverdueBooks";
import BorrowRequests from "./admin/BorrowRequests";

const AdminPanel = () => {
  return (
    <div className="max-w-4xl mx-auto py-10">
      <h2 className="text-3xl font-bold mb-5 text-primary">Librarian Dashboard</h2>
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="requests">Borrow Requests</TabsTrigger>
          <TabsTrigger value="books">Manage Books</TabsTrigger>
          <TabsTrigger value="borrowings">All Borrowings</TabsTrigger>
          <TabsTrigger value="overdue" className="relative">Overdue Books</TabsTrigger>
        </TabsList>
        <TabsContent value="requests">
          <BorrowRequests />
        </TabsContent>
        <TabsContent value="books">
          <BookManagement />
        </TabsContent>
        <TabsContent value="borrowings">
          <BorrowingsManagement />
        </TabsContent>
        <TabsContent value="overdue">
          <OverdueBooks />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
