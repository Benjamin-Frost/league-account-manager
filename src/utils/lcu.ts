import { invoke } from '@tauri-apps/api';
import { readTextFile } from '@tauri-apps/api/fs';
import { join, sep } from '@tauri-apps/api/path';
import { RankedStats } from '../interfaces/ranked';

interface Session {
  username: string;
}

interface Summoner {
  displayName: string;
}

const parseLockfile = async () => {
  const lockfilePath = await join(
    sep,
    'Riot Games',
    'League of Legends',
    'lockfile'
  );

  const lockfile = await readTextFile(lockfilePath);
  const [client, pid, port, secret, protocol] = lockfile.split(':');
  return { client, pid, port, secret, protocol };
};

export const getAccountInfo = async () => {
  const { port, secret, protocol } = await parseLockfile();

  const sessionUrl = `${protocol}://127.0.0.1:${port}/lol-login/v1/session`;
  const session = await invoke<Session>('get_session', {
    url: sessionUrl,
    secret,
  });

  const summonerUrl = `${protocol}://127.0.0.1:${port}/lol-summoner/v1/current-summoner`;
  const summoner = await invoke<Summoner>('get_summoner', {
    url: summonerUrl,
    secret,
  });

  const rankedStatsUrl = `${protocol}://127.0.0.1:${port}/lol-ranked/v1/current-ranked-stats`;
  const rankedStats = await invoke<RankedStats>('get_ranked', {
    url: rankedStatsUrl,
    secret,
  });

  const rankedSolo = rankedStats.queues.find(
    (queue) => queue.queueType === 'RANKED_SOLO_5x5'
  );

  const rankedFlex = rankedStats.queues.find(
    (queue) => queue.queueType === 'RANKED_FLEX_SR'
  );

  return {
    username: session.username,
    summonerName: summoner.displayName,
    rankedSolo,
    rankedFlex,
  };
};
