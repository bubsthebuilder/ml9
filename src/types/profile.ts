export type GameRole = typeof import('@/config/constants').GAME_ROLES[number];
export type Rank = typeof import('@/config/constants').RANKS[number];

export interface UserProfile {
  uid: string;
  username: string;
  gameId: string;
  role: GameRole;
  rank: Rank;
  profilePicture: string;
  winRate: number;
  favoriteHeroes: string[];
  achievements: string[];
  squad?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileFormData {
  username: string;
  gameId: string;
  role: string;
  rank: string;
  favoriteHeroes: string[];
  bio: string;
  isTeamLeader: boolean;
  teamId?: string;
}