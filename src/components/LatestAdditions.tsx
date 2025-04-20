
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const books = [
  {
    title: "The Future of AI",
    author: "Dr. Sarah Johnson",
    date: "Added on Apr 15, 2025"
  },
  {
    title: "Quantum Computing Basics",
    author: "Prof. Michael Chen",
    date: "Added on Apr 14, 2025"
  },
  {
    title: "Modern Web Development",
    author: "Alex Thompson",
    date: "Added on Apr 13, 2025"
  }
];

const LatestAdditions = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-playfair text-3xl font-bold text-primary mb-8">Latest Additions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <Card key={book.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{book.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{book.author}</p>
                <p className="text-sm text-muted-foreground mt-2">{book.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestAdditions;
