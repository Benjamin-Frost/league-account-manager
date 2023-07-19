import { AccountsTable } from './components/accounts-table';
import { Header } from './components/header';

export function App() {
  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-6 lg:py-8">
      <Header />
      <AccountsTable />
    </div>
  );
}
