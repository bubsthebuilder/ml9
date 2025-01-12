export interface Player {
  id: string;
  username: string;
  rank: string;
  mainRole: Role;
  squad?: string;
  achievements: Achievement[];
  avatarUrl?: string;
}

export interface Team {
  id: string;
  name: string;
  leaderId: string;
  members: string[];
  wins: number;
  losses: number;
  createdAt: Date;
}

export interface Tournament {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  prizePool: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  participants: string[];
}

export interface Scrim {
  id: string;
  teamAId: string;
  teamBId: string;
  date: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  winner?: string;
  score?: string;
}

export type Role = 'Tank' | 'Fighter' | 'Assassin' | 'Mage' | 'Marksman' | 'Support';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: Date;
}