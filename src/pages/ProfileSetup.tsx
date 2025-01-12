import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProfileFormData } from '@/types/profile';
import ProfileForm from '@/components/forms/ProfileForm';

export default function ProfileSetup() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ProfileFormData>({
    username: '',
    gameId: '',
    role: '',
    rank: '',
    favoriteHeroes: ['', '', ''],
    bio: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;
    
    try {
      await setDoc(doc(db, 'profiles', user.uid), formData);
      navigate('/profile');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8">
          <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
            Complete Your Profile
          </h1>
          
          <ProfileForm
            formData={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}