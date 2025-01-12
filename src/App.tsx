import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ProfileSetup from './pages/ProfileSetup';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Teams from './pages/Teams';
import Scrims from './pages/Scrims';
import Leaderboard from './pages/Leaderboard';
import AuthProvider from './components/auth/AuthProvider';


function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  return user ? <>{children}</> : <Navigate to="/auth" />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Features />
              </>
            } />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile/setup" element={
              <PrivateRoute>
                <ProfileSetup />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/teams" element={
              <PrivateRoute>
                <Teams /> 
              </PrivateRoute>
            } />
            <Route path="/scrims" element={
              <PrivateRoute>
                <Scrims />
              </PrivateRoute>
            } />
            <Route path="/leaderboard" element={
              <Leaderboard />
            } />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;