export interface Team {
    id: string;
    name: string;
    tag: string;
    leaderId: string;
    members: string[];
    wins: number;
    losses: number;
    winRate: number;
    createdAt: Date;
  }
  
  export interface TeamInvite {
    id: string;
    teamId: string;
    userId: string;
    status: 'pending' | 'accepted' | 'declined';
    createdAt: Date;
  }

  export interface TeamApplication {
    id: string;
    teamId: string;
    userId: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
  }