import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function GoogleSignIn() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const handleSignIn = async () => {
    try {
      setError('');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        navigate('/profile/setup');
      }
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        setError('Please allow popups for this website to sign in with Google');
      } else {
        setError('Failed to sign in. Please try again.');
      }
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleSignIn}
        className="btn-primary flex items-center justify-center space-x-2 w-full"
      >
        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
        <span>Sign in with Google</span>
      </button>
      
      {error && (
        <div className="flex items-center space-x-2 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}