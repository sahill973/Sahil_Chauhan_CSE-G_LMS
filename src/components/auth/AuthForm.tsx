
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

const AuthForm = () => {
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

    // Special check for librarian
    if (mode === "login" && form.email === "librarian@krmu.edu.in" && form.password === "lib@krmu") {
      // Create a session for the librarian with admin privileges
      const { error } = await supabase.auth.signInWithPassword({ 
        email: form.email, 
        password: form.password
      });
      
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Welcome, Librarian!");
      navigate("/dashboard");
      return;
    }

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
    // Regular Login
    const { email, password } = form;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Login successful!");
    navigate("/dashboard");
  };

  return (
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
  );
};

export default AuthForm;
