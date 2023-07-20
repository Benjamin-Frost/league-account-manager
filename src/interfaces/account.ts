export interface Account {
  username: string;
  password: string;
  isLoggedIn?: boolean;
  summonerName?: string;
  tier?: string;
  division?: string;
  lp?: number;
  wins?: number;
  losses?: number;
}
