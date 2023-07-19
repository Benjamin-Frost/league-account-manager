import { useState } from 'react';
import { AccountModal } from './components/account-modal';
import { AccountsTable } from './components/accounts-table';
import { Header } from './components/header';

export function App() {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-6 lg:py-8">
      <Header onAddAccountClick={() => setIsAccountModalOpen(true)} />
      <AccountsTable />
      <AccountModal
        isOpen={isAccountModalOpen}
        setIsOpen={setIsAccountModalOpen}
        onAddAccount={() => {}}
      />
    </div>
  );
}
