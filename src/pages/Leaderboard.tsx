import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Team } from '@/types/teams';

export default function Leaderboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [sortBy, setSortBy] = useState<'winRate' | 'wins'>('winRate');

  useEffect(() => {
    fetchTeams();
  }, [sortBy]);

  const fetchTeams = async () => {
    const teamsRef = collection(db, 'teams');
    const snapshot = await getDocs(query(teamsRef, limit(50)));
    let fetchedTeams = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Team));

    fetchedTeams = fetchedTeams.map(team => ({
      ...team,
      winRate: team.wins / (team.wins + team.losses) || 0
    })).sort((a, b) => {
      if (sortBy === 'winRate') {
        return b.winRate - a.winRate;
      }
      return b.wins - a.wins;
    });

    setTeams(fetchedTeams);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Team Rankings</h1>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'winRate' | 'wins')}
            className="bg-white/5 border border-white/10 rounded px-3 py-2"
          >
            <option value="winRate">Win Rate</option>
            <option value="wins">Total Wins</option>
          </select>
        </div>

        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-3 text-left">Rank</th>
                <th className="px-6 py-3 text-left">Team</th>
                <th className="px-6 py-3 text-center">Matches</th>
                <th className="px-6 py-3 text-center">W/L</th>
                <th className="px-6 py-3 text-center">Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => (
                <tr key={team.id} className="border-b border-white/10">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-bold">{team.name}</div>
                      <div className="text-sm text-gray-400">[{team.tag}]</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {team.wins + team.losses}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {team.wins}/{team.losses}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {((team.winRate || 0) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}