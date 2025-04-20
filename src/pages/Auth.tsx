
import React from "react";
import AuthForm from "@/components/auth/AuthForm";
import LibraryInfo from "@/components/auth/LibraryInfo";

const Auth = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-primary via-[#ea384c11] to-background py-8 relative transition-colors">
      <AuthForm />
      <LibraryInfo />
    </div>
  );
};

export default Auth;
