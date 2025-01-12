import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function EmailAuth() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate('/profile/setup');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/profile');
      }
    } catch (error: any) {
      const errorMessages: { [key: string]: string } = {
        'auth/email-already-in-use': 'Email already registered',
        'auth/invalid-email': 'Invalid email address',
        'auth/weak-password': 'Password should be at least 6 characters',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password'
      };
      setError(errorMessages[error.code] || 'Authentication failed');
      console.error('Auth error:', error);
    }
  };

  return (
    <form onSubmit={handleAuth} className="space-y-4">
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          required
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          required
        />
      </div>
      
      <button type="submit" className="btn-primary w-full">
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </button>
      
      <button
        type="button"
        onClick={() => setIsSignUp(!isSignUp)}
        className="text-sm text-gray-400 hover:text-white"
      >
        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
      </button>
      
      {error && (
        <div className="flex items-center space-x-2 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
}