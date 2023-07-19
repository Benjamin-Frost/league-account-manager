import { useEffect, useState } from 'react';
import { AccountModal } from './components/account-modal';
import { AccountsTable } from './components/accounts-table';
import { Header } from './components/header';
import { Account } from './interfaces/account';
import { loadAccounts, storeAccounts } from './utils/io';
import { login } from './utils/lcu';

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

  const handleLoginAccount = (index: number) => {
    const account = accounts[index];
    login(account.username, account.password);
  };

  return (
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
  );
}
