
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
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded px-8 py-8 w-full max-w-md space-y-5"
      >
        <h1 className="text-2xl font-bold text-center mb-2">
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
                <SelectTrigger required>
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
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Processing..." : mode === "signup" ? "Sign Up" : "Login"}
        </Button>
        <div className="flex justify-between mt-2">
          <span>
            {mode === "signup" ? "Already have an account?" : "New user?"}
          </span>
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto"
            onClick={toggleMode}
          >
            {mode === "signup" ? "Login" : "Sign Up"}
          </Button>
        </div>
      </form>
    </div>
  );
};
export default Auth;

