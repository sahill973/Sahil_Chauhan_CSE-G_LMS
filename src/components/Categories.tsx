
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const categories = [
  { title: "Books", count: "25,000+" },
  { title: "Journals", count: "1,000+" },
  { title: "E-Resources", count: "10,000+" },
  { title: "Research Papers", count: "5,000+" }
];

const Categories = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-playfair text-3xl font-bold text-primary mb-8">Browse by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card key={category.title} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{category.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{category.count} resources</p>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
