
import React from "react";
import AuthForm from "@/components/auth/AuthForm";
import LibraryInfo from "@/components/auth/LibraryInfo";

const Auth = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center py-8 relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: "url('/lovable-uploads/1aadf5d1-decb-4d5f-872e-cbfee9a935df.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.2
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
