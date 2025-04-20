import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, isAfter } from "date-fns";
import BookManagement from "./admin/BookManagement";
import MaterialsManagement from "./admin/MaterialsManagement";
import BorrowingsManagement from "./admin/BorrowingsManagement";
import OverdueBooks from "./admin/OverdueBooks";

const AdminPanel = () => {
  return (
    <div className="max-w-4xl mx-auto py-10">
      <h2 className="text-3xl font-bold mb-5 text-primary">Librarian Dashboard</h2>
      <Tabs defaultValue="books" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="books">Manage Books</TabsTrigger>
          <TabsTrigger value="materials">Study Materials</TabsTrigger>
          <TabsTrigger value="borrowings">All Borrowings</TabsTrigger>
          <TabsTrigger value="overdue" className="relative">
            Overdue Books
          </TabsTrigger>
        </TabsList>
        <TabsContent value="books">
          <BookManagement />
        </TabsContent>
        <TabsContent value="materials">
          <MaterialsManagement />
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
