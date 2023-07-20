import { invoke } from '@tauri-apps/api';
import { readTextFile } from '@tauri-apps/api/fs';
import { join, localDataDir } from '@tauri-apps/api/path';

const parseLockfile = async () => {
  const localDataDirPath = await localDataDir();
  const lockfilePath = await join(
    localDataDirPath,
    'Riot Games',
    'Riot Client',
    'Config',
    'lockfile'
  );

  const lockfile = await readTextFile(lockfilePath);
  const [client, pid, port, secret, protocol] = lockfile.split(':');
  return { client, pid, port, secret, protocol };
};

export const login = async (username: string, password: string) => {
  const { port, secret, protocol } = await parseLockfile();
  const url = `${protocol}://127.0.0.1:${port}/rso-auth/v1/session/credentials`;
  await invoke('login', { url, secret, username, password });
};
