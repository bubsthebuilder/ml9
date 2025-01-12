import React from 'react';
import { Shield } from 'lucide-react';
import EmailAuth from '@/components/auth/EmailAuth';

export default function Auth() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="glass-card p-8">
          <div className="flex flex-col items-center mb-8">
            <Shield className="h-12 w-12 text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
              Welcome to MLBB Nigeria
            </h1>
            <p className="text-gray-400 text-center mt-2">
              Sign in to connect with fellow Nigerian MLBB players
            </p>
          </div>
          
          <EmailAuth />
        </div>
      </div>
    </div>
  );
}