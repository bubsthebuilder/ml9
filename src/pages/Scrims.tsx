import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/stores/authStore';
import { Team } from '@/types/teams';
import { ScrimRequest, ScrimSettings } from '@/types/scrims';

export default function Scrims() {
  const user = useAuthStore((state) => state.user);
  const [userTeam, setUserTeam] = useState<Team | null>(null);
  const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
  const [scrimRequests, setScrimRequests] = useState<ScrimRequest[]>([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamSettings, setTeamSettings] = useState<{[key: string]: ScrimSettings}>({});

  useEffect(() => {
    if (!user?.uid) return;
    fetchUserTeam();
    fetchAvailableTeams();
    fetchScrimRequests();
  }, [user]);

  const fetchUserTeam = async () => {
    if (!user?.uid) return;
    const teamsRef = collection(db, 'teams');
    const q = query(teamsRef, where('members', 'array-contains', user.uid));
    const snapshot = await getDocs(q);
    const userTeams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
    setUserTeam(userTeams[0] || null);
  };

  const fetchTeamSettings = async (teamId: string) => {
    const settingsDoc = await getDoc(doc(db, 'scrimSettings', teamId));
    if (settingsDoc.exists()) {
      return settingsDoc.data() as ScrimSettings;
    }
    return null;
  };

  const fetchAvailableTeams = async () => {
    const teamsRef = collection(db, 'teams');
    const snapshot = await getDocs(teamsRef);
    const teams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
    
    // Fetch settings for each team
    const settings: {[key: string]: ScrimSettings} = {};
    for (const team of teams) {
      const teamSettings = await fetchTeamSettings(team.id);
      if (teamSettings) {
        settings[team.id] = teamSettings;
      }
    }
    setTeamSettings(settings);
    setAvailableTeams(teams.filter(team => team.id !== userTeam?.id));
  };

  const fetchScrimRequests = async () => {
    if (!userTeam?.id) return;
    const scrimsRef = collection(db, 'scrims');
    const q = query(scrimsRef, 
      where('requestingTeamId', '==', userTeam.id)
    );
    const snapshot = await getDocs(q);
    setScrimRequests(snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      date: doc.data().date.toDate()
    } as ScrimRequest)));
  };

  const createScrimRequest = async (data: Omit<ScrimRequest, 'id' | 'status' | 'createdAt'>) => {
    if (!userTeam?.id) return;
    
    const scrimRequest = {
      ...data,
      status: 'pending',
      createdAt: new Date()
    };

    await addDoc(collection(db, 'scrims'), scrimRequest);
    fetchScrimRequests();
    setShowRequestModal(false);
  };

  const isTeamAvailable = (team: Team, date: Date) => {
    const settings = teamSettings[team.id];
    if (!settings) return true;

    // Check max daily scrims
    const dayRequests = scrimRequests.filter(req => 
      req.targetTeamId === team.id && 
      req.date.toDateString() === date.toDateString() &&
      ['accepted', 'pending'].includes(req.status)
    );
    
    if (dayRequests.length >= settings.maxDailyScrims) {
      return false;
    }

    // Check day availability
    const dayOfWeek = date.getDay().toString();
    if (!settings.availability[dayOfWeek]) {
      return false;
    }

    return true;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Scrims</h1>
        {userTeam?.leaderId === user?.uid && (
          <button 
            onClick={() => setShowRequestModal(true)}
            className="btn-primary"
          >
            Request Scrim
          </button>
        )}
      </div>

      {/* Available Teams */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableTeams.map((team) => (
          <div key={team.id} className="glass-card p-6">
            <h3 className="text-xl font-bold mb-2">{team.name}</h3>
            <p className="text-gray-400">[{team.tag}]</p>
            <div className="mt-4">
              <p>Record: {team.wins}W - {team.losses}L</p>
              {teamSettings[team.id] && (
                <p className="text-sm text-gray-400">
                  Max Daily Scrims: {teamSettings[team.id].maxDailyScrims}
                </p>
              )}
              {!isTeamAvailable(team, new Date()) && (
                <span className="inline-block mt-2 px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm">
                  Fully Booked
                </span>
              )}
            </div>
            {userTeam?.leaderId === user?.uid && (
              <button
                onClick={() => {
                  setSelectedTeam(team);
                  setShowRequestModal(true);
                }}
                disabled={!isTeamAvailable(team, new Date())}
                className="btn-secondary w-full mt-4 disabled:opacity-50"
              >
                Request Scrim
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Scrim Request Modal */}
      {showRequestModal && selectedTeam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="glass-card p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Request Scrim with {selectedTeam.name}</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              createScrimRequest({
                requestingTeamId: userTeam!.id,
                targetTeamId: selectedTeam.id,
                date: new Date(formData.get('date') as string),
                time: formData.get('time') as string,
                bestOf: parseInt(formData.get('bestOf') as string) as 1 | 3 | 5 | 7,
                isPublic: formData.get('isPublic') === 'true'
              });
            }} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Time</label>
                <input
                  type="time"
                  name="time"
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Best of</label>
                <select
                  name="bestOf"
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2"
                  required
                >
                  <option value="1">Best of 1</option>
                  <option value="3">Best of 3</option>
                  <option value="5">Best of 5</option>
                  <option value="7">Best of 7</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Visibility</label>
                <select
                  name="isPublic"
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2"
                  required
                >
                  <option value="true">Public</option>
                  <option value="false">Private</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowRequestModal(false);
                    setSelectedTeam(null);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}