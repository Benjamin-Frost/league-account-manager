import { Account } from '../interfaces/account';

interface AccountsTableProps {
  accounts: Account[];
}

export function AccountsTable({ accounts }: AccountsTableProps) {
  return (
    <table className="min-w-full mt-8 divide-y divide-gray-700">
      <thead>
        <tr>
          <th
            scope="col"
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0"
          >
            Username
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
          >
            Password
          </th>
          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
            <span className="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-800">
        {accounts.map((account, index) => (
          <tr key={index}>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
              {account.username}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
              {account.password}
            </td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
              <a href="#" className="text-blue-400 hover:text-blue-300">
                Edit<span className="sr-only">, {account.username}</span>
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
