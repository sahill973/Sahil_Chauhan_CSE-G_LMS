
import React from "react";
import AuthForm from "@/components/auth/AuthForm";
import LibraryInfo from "@/components/auth/LibraryInfo";

const Auth = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center py-8 relative">
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
      
      {/* Content */}
      <div className="relative z-10">
        <AuthForm />
        <LibraryInfo />
      </div>
    </div>
  );
};

export default Auth;
