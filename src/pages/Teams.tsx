import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/stores/authStore';
import { Team } from '@/types/teams';
import { ProfileFormData } from '@/types/profile';
import TeamDetails from '@/components/teams/TeamDetails';

export default function Teams() {
  const user = useAuthStore((state) => state.user);
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', tag: '' });
  const [userProfile, setUserProfile] = useState<ProfileFormData | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [invites, setInvites] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.uid) return;
    fetchUserProfile();
    fetchAllTeams();
    fetchUserTeams();
    fetchInvites();
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user?.uid) return;
    const docRef = doc(db, 'profiles', user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserProfile(docSnap.data() as ProfileFormData);
    }
  };

  const fetchAllTeams = async () => {
    const teamsRef = collection(db, 'teams');
    const snapshot = await getDocs(teamsRef);
    setAllTeams(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team)));
  };

  const fetchUserTeams = async () => {
    if (!user?.uid) return;
    const teamsRef = collection(db, 'teams');
    const q = query(teamsRef, where('members', 'array-contains', user.uid));
    const snapshot = await getDocs(q);
    setUserTeams(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team)));
  };

  const fetchInvites = async () => {
    if (!user?.uid) return;
    const invitesRef = collection(db, 'teamInvites');
    const q = query(invitesRef, 
      where('userId', '==', user.uid),
      where('status', '==', 'pending')
    );
    const snapshot = await getDocs(q);
    setInvites(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const createTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    try {
      const teamData = {
        name: newTeam.name,
        tag: newTeam.tag,
        leaderId: user.uid,
        members: [user.uid],
        wins: 0,
        losses: 0,
        createdAt: new Date()
      };

      const teamRef = await addDoc(collection(db, 'teams'), teamData);
      
      await updateDoc(doc(db, 'profiles', user.uid), {
        teamId: teamRef.id
      });

      setShowCreateModal(false);
      setNewTeam({ name: '', tag: '' });
      fetchAllTeams();
      fetchUserTeams();
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const applyToTeam = async (teamId: string) => {
    if (!user?.uid) return;
    
    try {
      const existingInvitesRef = collection(db, 'teamInvites');
      const q = query(existingInvitesRef, 
        where('userId', '==', user.uid),
        where('teamId', '==', teamId),
        where('status', '==', 'pending')
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        alert('You already have a pending application for this team');
        return;
      }

      await addDoc(collection(db, 'teamInvites'), {
        teamId,
        userId: user.uid,
        status: 'pending',
        createdAt: new Date()
      });
      alert('Application sent successfully');
    } catch (error) {
      console.error('Error applying to team:', error);
      alert('Failed to send application. Please try again.');
    }
  };

  if (selectedTeamId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <TeamDetails 
          teamId={selectedTeamId}
          onBack={() => setSelectedTeamId(null)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">Teams</h1>
      {userProfile?.isTeamLeader && !userTeams.length && (
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          Create Team
        </button>
      )}
    </div>

    {/* User's Teams Section */}
    {userTeams.length > 0 && (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">My Teams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userTeams.map((team: Team) => (
            <div 
              key={team.id} 
              className="glass-card p-6 cursor-pointer hover:bg-white/5 transition"
              onClick={() => setSelectedTeamId(team.id)}
            >
              <h3 className="text-xl font-bold mb-2">{team.name}</h3>
              <p className="text-gray-400">[{team.tag}]</p>
              <div className="mt-4">
                <p>Members: {team.members.length}</p>
                <p>Record: {team.wins}W - {team.losses}L</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* All Teams Section */}
    <div>
      <h2 className="text-xl font-bold mb-4">All Teams</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allTeams.map((team: Team) => (
          <div 
            key={team.id} 
            className="glass-card p-6 cursor-pointer hover:bg-white/5 transition"
            onClick={() => setSelectedTeamId(team.id)}
          >
            <h3 className="text-xl font-bold mb-2">{team.name}</h3>
            <p className="text-gray-400">[{team.tag}]</p>
            <div className="mt-4">
              <p>Members: {team.members.length}</p>
              <p>Record: {team.wins}W - {team.losses}L</p>
            </div>
            {!userTeams.some(t => t.id === team.id) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  applyToTeam(team.id);
                }}
                className="btn-secondary w-full mt-4"
              >
                Apply to Join
              </button>
            )}
          </div>
        ))}
      </div>
    </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="glass-card p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Team</h2>
            <form onSubmit={createTeam} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Team Name</label>
                <input
                  type="text"
                  value={newTeam.name}
                  onChange={e => setNewTeam({ ...newTeam, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Team Tag</label>
                <input
                  type="text"
                  value={newTeam.tag}
                  onChange={e => setNewTeam({ ...newTeam, tag: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2"
                  maxLength={4}
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}