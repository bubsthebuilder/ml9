import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProfileFormData } from '@/types/profile';
import { Team } from '@/types/teams';

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const [profile, setProfile] = useState<ProfileFormData | null>(null);
  const [userTeam, setUserTeam] = useState<Team | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (profile?.teamId) {
      fetchUserTeam();
    }
  }, [profile]);

  const fetchProfile = async () => {
    if (!user?.uid) return;
    const docRef = doc(db, 'profiles', user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setProfile(docSnap.data() as ProfileFormData);
    }
  };

  const fetchUserTeam = async () => {
    if (!profile?.teamId) return;
    const teamRef = doc(db, 'teams', profile.teamId);
    const teamSnap = await getDoc(teamRef);
    if (teamSnap.exists()) {
      setUserTeam(teamSnap.data() as Team);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{profile.username}</h1>
                <p className="text-gray-400">Game ID: {profile.gameId}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Rank</div>
                <div className="font-bold">{profile.rank}</div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <h2 className="text-lg font-semibold mb-2">Main Role</h2>
              <p>{profile.role}</p>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <h2 className="text-lg font-semibold mb-2">Top Heroes</h2>
              <ul className="list-disc list-inside">
                {profile.favoriteHeroes.map((hero, index) => (
                  <li key={index}>{hero}</li>
                ))}
              </ul>
            </div>

            {userTeam && (
              <div className="border-t border-gray-700 pt-4">
                <h2 className="text-lg font-semibold mb-2">Team</h2>
                <div className="flex items-center space-x-2">
                  <span>{userTeam.name}</span>
                  <span className="text-gray-400">[{userTeam.tag}]</span>
                </div>
              </div>
            )}

            <div className="border-t border-gray-700 pt-4">
              <h2 className="text-lg font-semibold mb-2">Bio</h2>
              <p>{profile.bio}</p>
            </div>

            {profile.isTeamLeader && (
              <div className="border-t border-gray-700 pt-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">
                  Team Leader
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}