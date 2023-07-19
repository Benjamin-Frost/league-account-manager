import {
  BaseDirectory,
  createDir,
  exists,
  readTextFile,
  writeTextFile,
} from '@tauri-apps/api/fs';
import { Account } from '../interfaces/account';

export async function loadAccounts(): Promise<Account[]> {
  const fileExists = await exists('accounts.json', {
    dir: BaseDirectory.AppData,
  });
  if (!fileExists) {
    await createDir('', { dir: BaseDirectory.AppData });
    await writeTextFile('accounts.json', '[]', { dir: BaseDirectory.AppData });
  }

  const accounts = await readTextFile('accounts.json', {
    dir: BaseDirectory.AppData,
  });
  return JSON.parse(accounts);
}

export async function storeAccounts(accounts: Account[]) {
  await writeTextFile('accounts.json', JSON.stringify(accounts), {
    dir: BaseDirectory.AppData,
  });
}
