import { RankedQueue } from './ranked';

export interface Account {
  username: string;
  password: string;
  isLoggedIn?: boolean;
  summonerName?: string;
  rankedSolo?: RankedQueue;
  rankedFlex?: RankedQueue;
}
