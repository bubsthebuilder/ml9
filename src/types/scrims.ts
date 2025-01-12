export interface ScrimSettings {
  teamId: string;
  maxDailyScrims: number;
  availability: {
    [key: string]: { // day of week (0-6)
      start: string; // HH:mm format
      end: string;
    };
  };
}

export interface ScrimRequest {
  id?: string;
  requestingTeamId: string;
  targetTeamId: string;
  date: Date;
  time: string;
  bestOf: 1 | 3 | 5 | 7;
  isPublic: boolean;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: Date;
}