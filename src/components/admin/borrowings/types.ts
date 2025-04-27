
export interface BorrowRow {
  id: string;
  borrowed_at: string;
  due_at: string;
  returned_at: string | null;
  book_id: string;
  user_id: string;
  books: { title: string; author: string; id: string } | null;
  profiles: { full_name?: string; college_id?: string } | null | { error: boolean };
}
