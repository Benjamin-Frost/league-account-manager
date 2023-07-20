export interface Account {
  username: string;
  password: string;
  isLoggedIn?: boolean;
  summonerName?: string;
  tier?: number;
  rank?: number;
  lp?: number;
  wins?: number;
  losses?: number;
}
