export interface RankedQueue {
  tier: string;
  division: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  queueType: string;
}

export interface RankedStats {
  queues: RankedQueue[];
}
