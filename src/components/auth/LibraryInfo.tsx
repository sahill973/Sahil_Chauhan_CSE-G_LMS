
import React from "react";

// Sample information text
const aboutLibraryText = `
KR Mangalam University Library provides a serene and resourceful environment for students, faculty, and researchers.
With a vast collection spanning thousands of books, journals, and digital resources, our library is the heart of academic excellence and collaborative learning at the university.
We offer advanced digital facilities, access to online journals and databases, and a comfortable space to inspire lifelong learning.
`;

// Placeholder book images and data for "Top Circulating" and "New Arrivals"
const topCirculatingBooks = [
  {
    title: "Data Structures and Algorithms",
    author: "Narasimha Karumanchi",
    img: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    img: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400&q=80",
  },
];

const newArrivals = [
  {
    title: "Machine Learning",
    author: "Tom M. Mitchell",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "The Art of Computer Programming",
    author: "Donald Knuth",
    img: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Deep Learning",
    author: "Ian Goodfellow",
    img: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=400&q=80",
  },
];

const LibraryInfo = () => {
  return (
    <div className="w-full max-w-3xl mt-14 flex flex-col gap-12">
      {/* About Our Library */}
      <section className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow px-6 py-8 gap-6 border-t-4 border-primary/70">
        <img
          src="https://sgtuniversity.ac.in/wp-content/uploads/2022/06/library_inside_2.jpeg"
          alt="Library Hall"
          className="rounded-lg w-full max-w-[160px] md:w-[180px] object-cover shadow"
        />
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-2 text-primary">About Our Library</h2>
          <p className="text-muted-foreground">{aboutLibraryText}</p>
        </div>
      </section>

      {/* Top Circulating */}
      <section>
        <h2 className="text-lg font-semibold text-primary mb-4">Top Circulating</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {topCirculatingBooks.map((book, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center bg-secondary/10 rounded-lg p-4 shadow hover:shadow-md hover:scale-105 transition"
            >
              <img
                src={book.img}
                alt={book.title}
                className="h-36 w-28 object-cover rounded mb-3 border-2 border-primary/30"
              />
              <span className="font-semibold text-primary">{book.title}</span>
              <span className="text-xs text-muted-foreground">{book.author}</span>
            </div>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section>
        <h2 className="text-lg font-semibold text-primary mb-4">New Arrivals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {newArrivals.map((book, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center bg-secondary/10 rounded-lg p-4 shadow hover:shadow-md hover:scale-105 transition"
            >
              <img
                src={book.img}
                alt={book.title}
                className="h-36 w-28 object-cover rounded mb-3 border-2 border-accent"
              />
              <span className="font-semibold text-primary">{book.title}</span>
              <span className="text-xs text-muted-foreground">{book.author}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LibraryInfo;
