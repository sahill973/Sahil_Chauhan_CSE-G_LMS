
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const DEPARTMENTS = [
  "School of Engineering and Technology (SOET)",
  "School of Management and Commerce (SOMC)",
  "School of Law (SOL)",
  "School of Humanities and Social Sciences (SHSS)",
  "School of Sciences (SOS)",
  "School of Computer Applications (SOCA)",
  "School of Design and Architecture (SODA)",
  "School of Education (SOE)",
  "School of Medical and Allied Sciences (SMAS)",
  "School of Agriculture (SOA)",
  "School of Media and Communication (SOMC)",
  "School of Hospitality and Tourism (SOHT)",
];

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

const aboutLibraryText = `
KR Mangalam University Library provides a serene and resourceful environment for students, faculty, and researchers.
With a vast collection spanning thousands of books, journals, and digital resources, our library is the heart of academic excellence and collaborative learning at the university.
We offer advanced digital facilities, access to online journals and databases, and a comfortable space to inspire lifelong learning.
`;


const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    college_id: "",
    full_name: "",
    department: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleDeptChange = (value: string) => {
    setForm((f) => ({ ...f, department: value }));
  };

  const toggleMode = () => setMode((prev) => (prev === "login" ? "signup" : "login"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "signup") {
      const { email, password, college_id, full_name, department } = form;
      if (!department) {
        setLoading(false);
        toast.error("Please select your department.");
        return;
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { college_id, full_name, department },
        },
      });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Signup successful! Please check your email to confirm.");
      return;
    }
    // Login
    const { email, password } = form;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Login successful!");
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-primary via-[#ea384c11] to-background py-8 relative transition-colors">
      <form
        onSubmit={handleSubmit}
        className="bg-white border-t-4 border-primary/80 shadow-xl rounded-xl px-10 py-10 w-full max-w-md space-y-6 animate-fade-in"
      >
        <h1 className="text-3xl font-bold font-playfair text-center mb-2 text-primary">
          {mode === "signup" ? "Sign Up" : "Login"}
        </h1>
        <Input
          name="email"
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        {mode === "signup" && (
          <>
            <Input
              name="college_id"
              placeholder="College ID"
              value={form.college_id}
              onChange={handleChange}
              required
            />
            <Input
              name="full_name"
              placeholder="Full Name"
              value={form.full_name}
              onChange={handleChange}
              required
            />
            <div>
              <Select value={form.department} onValueChange={handleDeptChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        <Button
          type="submit"
          className="w-full transition duration-150 bg-gradient-to-r from-primary to-[#ea384c] hover:from-[#ea384c] hover:to-primary hover:scale-105"
          disabled={loading}
        >
          {loading ? "Processing..." : mode === "signup" ? "Sign Up" : "Login"}
        </Button>
        <div className="flex justify-between mt-2">
          <span>
            {mode === "signup" ? "Already have an account?" : "New user?"}
          </span>
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto text-primary hover:text-[#ea384c]"
            onClick={toggleMode}
          >
            {mode === "signup" ? "Login" : "Sign Up"}
          </Button>
        </div>
      </form>

      {/* Library Info Sections */}
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
    </div>
  );
};

export default Auth;
