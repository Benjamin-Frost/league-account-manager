import { writeText } from '@tauri-apps/api/clipboard';
import { Account } from '../interfaces/account';

export const accountToClipboard = async (account: Account) => {
  await writeText(`${account.username} ${account.password}`);
};
