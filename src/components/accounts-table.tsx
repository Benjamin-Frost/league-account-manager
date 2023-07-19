import {
  ArrowRightCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import { Account } from '../interfaces/account';

interface AccountsTableProps {
  accounts: Account[];
  onLoginClick: (index: number) => void;
  onEditClick: (index: number) => void;
  onDeleteClick: (index: number) => void;
}

export function AccountsTable({
  accounts,
  onLoginClick,
  onEditClick,
  onDeleteClick,
}: AccountsTableProps) {
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
            <span className="sr-only">Actions</span>
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
            <td className="relative whitespace-nowrap space-x-2 py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
              <button
                type="button"
                className="text-blue-400 hover:text-blue-300"
                onClick={() => onLoginClick(index)}
              >
                <ArrowRightCircleIcon className="w-5 h-5" />
                <span className="sr-only">Login {account.username}</span>
              </button>
              <button
                type="button"
                className="text-blue-400 hover:text-blue-300"
                onClick={() => onEditClick(index)}
              >
                <PencilSquareIcon className="w-5 h-5" />
                <span className="sr-only">Edit {account.username}</span>
              </button>
              <button
                type="button"
                className="text-blue-400 hover:text-blue-300"
                onClick={() => onDeleteClick(index)}
              >
                <TrashIcon className="w-5 h-5" />
                <span className="sr-only">Delete {account.username}</span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
