import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { TeamApplication } from '@/types/teams';
import { ProfileFormData } from '@/types/profile';

const TeamApplications = ({ teamId }: { teamId: string }) => {
  const [applications, setApplications] = useState<TeamApplication[]>([]);
  const [applicantProfiles, setApplicantProfiles] = useState<{[key: string]: ProfileFormData}>({});

  useEffect(() => {
    if (!teamId) return;
    fetchApplications();
  }, [teamId]);

  const fetchApplications = async () => {
    const invitesRef = collection(db, 'teamInvites');
    const q = query(invitesRef, 
      where('teamId', '==', teamId),
      where('status', '==', 'pending')
    );
    const snapshot = await getDocs(q);
    const apps = snapshot.docs.map(doc => ({ 
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    } as TeamApplication));
    setApplications(apps);
    
    // Fetch applicant profiles
    const profiles: {[key: string]: ProfileFormData} = {};
    for (const app of apps) {
      const profileDoc = await getDoc(doc(db, 'profiles', app.userId));
      if (profileDoc.exists()) {
        profiles[app.userId] = profileDoc.data() as ProfileFormData;
      }
    }
    setApplicantProfiles(profiles);
  };

  const handleApplication = async (applicationId: string, userId: string, accept: boolean) => {
    try {
      if (accept) {
        // Update team members
        const teamRef = doc(db, 'teams', teamId);
        const teamDoc = await getDoc(teamRef);
        if (teamDoc.exists()) {
          const currentMembers = teamDoc.data().members || [];
          await updateDoc(teamRef, {
            members: [...currentMembers, userId]
          });
        }
        
        // Update user's profile
        await updateDoc(doc(db, 'profiles', userId), {
          teamId: teamId
        });
      }
      
      // Delete the application
      await deleteDoc(doc(db, 'teamInvites', applicationId));
      
      // Refresh applications list
      fetchApplications();
    } catch (error) {
      console.error('Error handling application:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Team Applications</h3>
      {applications.length === 0 ? (
        <p className="text-gray-400">No pending applications</p>
      ) : (
        applications.map(app => (
          <div key={app.id} className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">{applicantProfiles[app.userId]?.username || 'Unknown Player'}</p>
                <p className="text-sm text-gray-400">Rank: {applicantProfiles[app.userId]?.rank || 'N/A'}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApplication(app.id, app.userId, true)}
                  className="btn-primary px-4 py-2"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleApplication(app.id, app.userId, false)}
                  className="btn-secondary px-4 py-2"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TeamApplications;