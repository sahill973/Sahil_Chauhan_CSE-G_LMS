
import React from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";

const Preview = () => {
  const location = useLocation();
  const bookData = location.state?.bookData;

  return (
    <div className="min-h-screen flex flex-col relative">
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: "url('https://th.bing.com/th/id/OIP.kCpBGI4eFvBUuAfXs2P-ygAAAA?w=165&h=155&c=7&r=0&o=5&dpr=1.4&pid=1.7')",
          backgroundSize: "100% auto",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.4
        }}
      />
      
      <div className="relative z-10">
        <Navigation />
        <div className="max-w-6xl mx-auto p-5 mt-8">
          {bookData ? (
            <div className="bg-white shadow-lg rounded-lg p-8 border-t-4 border-primary">
              <h1 className="text-3xl font-bold font-playfair text-primary mb-4">{bookData.title}</h1>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <div className="bg-gray-200 h-64 w-full rounded-md flex items-center justify-center">
                    <span className="text-gray-500">Book Cover</span>
                  </div>
                </div>
                <div className="md:w-2/3 space-y-4">
                  <p><span className="font-semibold">Author:</span> {bookData.author || "Unknown"}</p>
                  <p><span className="font-semibold">ISBN:</span> {bookData.isbn || "Not available"}</p>
                  <p><span className="font-semibold">Published:</span> {bookData.publishedYear || "Unknown"}</p>
                  <p><span className="font-semibold">Category:</span> {bookData.category || "Uncategorized"}</p>
                  <p className="mt-6 text-gray-700">
                    {bookData.description || "No description available for this book."}
                  </p>
                  <div className="pt-4">
                    <button 
                      className="bg-gradient-to-r from-primary to-[#ea384c] text-white font-bold py-2 px-6 rounded-md hover:scale-105 transition"
                    >
                      Request Book
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <h2 className="text-xl font-medium text-gray-600">No book preview available</h2>
              <p className="mt-2 text-gray-500">Please select a book to preview from the catalog.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;
