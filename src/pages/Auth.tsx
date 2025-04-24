
import React from "react";
import AuthForm from "@/components/auth/AuthForm";
import LibraryInfo from "@/components/auth/LibraryInfo";

const Auth = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center py-8 relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 opacity-5"
        style={{
          backgroundImage: "url('/lovable-uploads/9272eac6-df7d-4e6c-9a91-c0fde72cb56c.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "grayscale(30%)"
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
