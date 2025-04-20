
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const books = [
  {
    id: 1,
    title: "The Future of AI",
    author: "Dr. Sarah Johnson",
    date: "Added on Apr 15, 2025",
    category: "Technology",
    available: true,
    isbn: "978-0123456789"
  },
  {
    id: 2,
    title: "Quantum Computing Basics",
    author: "Prof. Michael Chen",
    date: "Added on Apr 14, 2025",
    category: "Science",
    available: true,
    isbn: "978-0123456790"
  },
  {
    id: 3,
    title: "Modern Web Development",
    author: "Alex Thompson",
    date: "Added on Apr 13, 2025",
    category: "Technology",
    available: false,
    isbn: "978-0123456791"
  },
  {
    id: 4,
    title: "Machine Learning Fundamentals",
    author: "Dr. Emily Parker",
    date: "Added on Apr 12, 2025",
    category: "Technology",
    available: true,
    isbn: "978-0123456792"
  },
  {
    id: 5,
    title: "Data Structures and Algorithms",
    author: "Prof. James Wilson",
    date: "Added on Apr 11, 2025",
    category: "Computer Science",
    available: true,
    isbn: "978-0123456793"
  },
  {
    id: 6,
    title: "Digital Marketing Strategy",
    author: "Lisa Anderson",
    date: "Added on Apr 10, 2025",
    category: "Business",
    available: true,
    isbn: "978-0123456794"
  }
];

const LatestAdditions = () => {
  const handleBorrow = (bookTitle: string) => {
    toast.success(`Successfully borrowed "${bookTitle}"`);
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-playfair text-3xl font-bold text-primary mb-8">Latest Additions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Card key={book.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{book.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-gray-600">{book.author}</p>
                  <p className="text-sm text-muted-foreground">{book.category}</p>
                  <p className="text-sm text-muted-foreground mt-1">{book.date}</p>
                  <p className="text-sm text-muted-foreground">ISBN: {book.isbn}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${book.available ? 'text-green-600' : 'text-red
-600'}`}>
                    {book.available ? 'Available' : 'Currently Borrowed'}
                  </span>
                  <Button 
                    onClick={() => handleBorrow(book.title)}
                    disabled={!book.available}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Borrow
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestAdditions;
