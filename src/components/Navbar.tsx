import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Trophy, Users, Calendar, Home, LogOut, UserRound, ClipboardList } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { auth } from '@/lib/firebase';

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="glass sticky top-0 z-50 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Menu className="h-6 w-6 text-gray-400" />
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
            MLBB Nigeria
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/" icon={<Home className="h-5 w-5" />} text="Home" />
          <NavLink to="/tournaments" icon={<Trophy className="h-5 w-5" />} text="Tournaments" />
          <NavLink to="/teams" icon={<Users className="h-5 w-5" />} text="Teams" />
          <NavLink to="/scrims" icon={<Calendar className="h-5 w-5" />} text="Scrims" />
          <NavLink to="/leaderboard" icon={<ClipboardList className="h-5 w-5" />} text="Leaderboards" />
          <NavLink to="/profile" icon={<UserRound className="h-5 w-5" />} text="Profile" />
        </div>
        
        {user ? (
          <button onClick={handleSignOut} className="btn-secondary flex items-center space-x-2">
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        ) : (
          <Link to="/auth" className="btn-primary">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, icon, text }: { to: string; icon: React.ReactNode; text: string }) {
  return (
    <Link to={to} className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
      {icon}
      <span>{text}</span>
    </Link>
  );
}