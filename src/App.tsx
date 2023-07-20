import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AccountModal } from './components/account-modal';
import { AccountsTable } from './components/accounts-table';
import { Header } from './components/header';
import { ToastType, showToast } from './components/toast';
import { Account } from './interfaces/account';
import { loadAccounts, storeAccounts } from './utils/io';
import { getAccountInfo } from './utils/lcu';
import { login } from './utils/riot-client';

export function App() {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editingAccountId, setEditingAccountId] = useState<number | null>(null);

  useEffect(() => {
    const loadAccountsAsync = async () => {
      const accounts = await loadAccounts();
      setAccounts(accounts);
    };
    loadAccountsAsync();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const accountInfo = await getAccountInfo();

        const newAccounts = [...accounts];
        const index = newAccounts.findIndex(
          (account) => account.username === accountInfo.username
        );
        if (index !== -1) {
          newAccounts[index] = {
            ...newAccounts[index],
            isLoggedIn: true,
            summonerName: accountInfo.summonerName,
            tier: accountInfo.rankedStats?.tier,
            division: accountInfo.rankedStats?.division,
            lp: accountInfo.rankedStats?.leaguePoints,
            wins: accountInfo.rankedStats?.wins,
            losses: accountInfo.rankedStats?.losses,
          };
          setAccounts(newAccounts);
          await storeAccounts(newAccounts);
        }
      } catch (e) {}
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAddAccount = async (username: string, password: string) => {
    setAccounts((accounts) => [...accounts, { username, password }]);
    await storeAccounts([...accounts, { username, password }]);
  };

  const handleEditAccount = async (username: string, password: string) => {
    if (editingAccountId === null) return;
    const newAccounts = [...accounts];
    newAccounts[editingAccountId] = { username, password };
    setAccounts(newAccounts);
    await storeAccounts(newAccounts);
  };

  const handleDeleteAccount = async (index: number) => {
    const newAccounts = [...accounts];
    newAccounts.splice(index, 1);
    setAccounts(newAccounts);
    await storeAccounts(newAccounts);
  };

  const handleLoginAccount = async (index: number) => {
    const account = accounts[index];

    try {
      await login(account.username, account.password);
      showToast(
        'Login successful!',
        'You have been logged in',
        ToastType.Success
      );
    } catch (e) {
      const message =
        typeof e === 'string' || e instanceof String
          ? e.toString()
          : 'An unknown error occurred';
      showToast('Login failed!', message, ToastType.Error);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-6 lg:py-8">
        <Header
          onAddAccountClick={() => {
            setEditingAccountId(null);
            setIsAccountModalOpen(true);
          }}
        />
        <AccountsTable
          accounts={accounts}
          onLoginClick={handleLoginAccount}
          onEditClick={(index) => {
            setEditingAccountId(index);
            setIsAccountModalOpen(true);
          }}
          onDeleteClick={handleDeleteAccount}
        />
        <AccountModal
          isOpen={isAccountModalOpen}
          setIsOpen={setIsAccountModalOpen}
          onSubmit={
            editingAccountId === null ? handleAddAccount : handleEditAccount
          }
          initialData={
            editingAccountId === null ? undefined : accounts[editingAccountId]
          }
        />
      </div>
      <Toaster position="bottom-right" />
    </>
  );
}
