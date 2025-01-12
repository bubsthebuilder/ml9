import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Team } from '@/types/teams';
import { ProfileFormData } from '@/types/profile';
import TeamApplications from './TeamApplications';
import { useAuthStore } from '@/stores/authStore';
import ScrimSettings from './ScrimSettings';

interface TeamMember extends ProfileFormData {
  uid: string;
}

interface TeamDetailsProps {
  teamId: string;
  onBack: () => void;
}

export default function TeamDetails({ teamId, onBack }: TeamDetailsProps) {
  const user = useAuthStore((state) => state.user);
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [activeTab, setActiveTab] = useState<'members' | 'applications' | 'settings'>('members');

  useEffect(() => {
    fetchTeamDetails();
  }, [teamId]);

  const fetchTeamDetails = async () => {
    try {
      const teamDoc = await getDoc(doc(db, 'teams', teamId));
      if (teamDoc.exists()) {
        const teamData = { id: teamDoc.id, ...teamDoc.data() } as Team;
        setTeam(teamData);

        const memberProfiles: TeamMember[] = [];
        for (const memberId of teamData.members) {
          const memberDoc = await getDoc(doc(db, 'profiles', memberId));
          if (memberDoc.exists()) {
            memberProfiles.push({
              uid: memberId,
              ...memberDoc.data() as ProfileFormData
            });
          }
        }
        setMembers(memberProfiles);
      }
    } catch (error) {
      console.error('Error fetching team details:', error);
    }
  };

  if (!team) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading team details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="btn-secondary">
          Back to Teams
        </button>
        <h2 className="text-2xl font-bold">{team?.name} [{team?.tag}]</h2>
      </div>

      <div className="glass-card p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-gray-400">Members</p>
            <p className="text-2xl font-bold">{team?.members.length}</p>
          </div>
          <div>
            <p className="text-gray-400">Wins</p>
            <p className="text-2xl font-bold">{team?.wins}</p>
          </div>
          <div>
            <p className="text-gray-400">Losses</p>
            <p className="text-2xl font-bold">{team?.losses}</p>
          </div>
          <div>
            <p className="text-gray-400">Win Rate</p>
            <p className="text-2xl font-bold">
            {team ? ((team.wins / (team.wins + team.losses)) * 100 || 0).toFixed(1) : 'N/A'}%
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-600">
        <div className="flex space-x-4">
          <button
            className={`py-2 px-4 ${activeTab === 'members' ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-400'}`}
            onClick={() => setActiveTab('members')}
          >
            Members
          </button>
          {team?.leaderId === user?.uid && (
            <button
              className={`py-2 px-4 ${activeTab === 'applications' ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-400'}`}
              onClick={() => setActiveTab('applications')}
            >
              Applications
            </button>
          )}
          {team?.leaderId === user?.uid && (
            <button
              className={`py-2 px-4 ${activeTab === 'settings' ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-400'}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          )}
        </div>
      </div>

      {activeTab === 'members' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <div key={member.uid} className="glass-card p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <p className="font-bold">{member.username}</p>
                  <p className="text-sm text-gray-400">Rank: {member.rank}</p>
                  <p className="text-sm text-gray-400">Role: {member.role}</p>
                </div>
                {member.uid === team?.leaderId && (
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                    Leader
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'applications' && team?.leaderId === user?.uid && (
        <TeamApplications teamId={teamId} />
      )}

    {activeTab === 'settings' && team?.leaderId === user?.uid && (
      <ScrimSettings 
        teamId={team.id!} 
        onUpdate={fetchTeamDetails}
      />
    )}

    </div>
  );
}
