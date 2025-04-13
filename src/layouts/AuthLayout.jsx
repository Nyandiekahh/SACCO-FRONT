import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img
            className="h-20 w-auto"
            src="/logo.png" // Add your logo here
            alt="SACCO Logo"
          />
        </div>
      </div>
      
      {children}
      
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} SACCO Management System. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AuthLayout;