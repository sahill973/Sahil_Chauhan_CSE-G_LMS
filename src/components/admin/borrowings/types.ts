
export interface Profile {
  full_name: string;
  college_id: string;
  department?: string;
}

export interface BookDetail {
  id: string;
  title: string;
  author: string;
  available?: boolean;
}

export interface BorrowRow {
  id: string;
  borrowed_at: string;
  due_at: string;
  returned_at: string | null;
  book_id: string;
  user_id: string;
  books?: BookDetail;
  profiles?: Profile;
}

export interface BorrowRequest {
  id: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  book_id: string;
  user_id: string;
  books?: BookDetail;
  profiles?: Profile;
}
