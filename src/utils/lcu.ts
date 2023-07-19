import { readTextFile } from '@tauri-apps/api/fs';
import { join, localDataDir } from '@tauri-apps/api/path';
import axios from 'axios';

const parseLockfile = async () => {
  const dataDirPath = await localDataDir();
  const lockfilePath = await join(
    dataDirPath,
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

  const response = await axios.put(
    `${protocol}://127.0.0.1:${port}/rso-auth/v1/session/credentials`,
    {
      username,
      password,
      persistLogin: false,
    },
    {
      auth: {
        username: 'riot',
        password: secret,
      },
    }
  );

  return response.data;
};
