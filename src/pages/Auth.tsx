
import React from "react";
import AuthForm from "@/components/auth/AuthForm";
import LibraryInfo from "@/components/auth/LibraryInfo";

const Auth = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center py-8 relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-white z-0"
        style={{
          backgroundImage: "url('/lovable-uploads/798d159f-a7e7-4c37-8a6e-467197d21205.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.2  // Increased from 0.05 to 0.2
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <AuthForm />
        <LibraryInfo />
      </div>
    </div>
  );
};

export default Auth;
