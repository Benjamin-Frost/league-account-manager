import {
  ArrowRightCircleIcon,
  DocumentDuplicateIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import { Account } from '../interfaces/account';
import { RankedQueue } from '../interfaces/ranked';
import { accountToClipboard } from '../utils/clipboard';
import { ToastType, showToast } from './toast';

interface AccountsTableProps {
  accounts: Account[];
  onLoginClick: (index: number) => void;
  onEditClick: (index: number) => void;
  onDeleteClick: (index: number) => void;
}

const getRankString = (rq: RankedQueue) =>
  `${rq.tier} ${rq.division} ${rq.leaguePoints} LP`;
const getWinLossString = (rq: RankedQueue) => {
  const winrate =
    rq.wins + rq.losses === 0 ? 0 : (rq.wins / (rq.wins + rq.losses)) * 100;
  return `${rq.wins}W / ${rq.losses}L (${winrate.toFixed(0)}%)`;
};

export function AccountsTable({
  accounts,
  onLoginClick,
  onEditClick,
  onDeleteClick,
}: AccountsTableProps) {
  const onToClipboardClick = async (account: Account) => {
    await accountToClipboard(account);
    showToast(
      'Copy successful!',
      'The account credentials were copied to your clipboard.',
      ToastType.Success
    );
  };

  return (
    <table className="min-w-full mt-8 divide-y divide-gray-700">
      <thead>
        <tr>
          <th scope="col" className="py-3.5 pl-4 sm:pl-0">
            <span className="sr-only">Status</span>
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
          >
            Username
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
          >
            Summoner Name
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
          >
            Ranked Solo
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
          >
            Ranked Flex
          </th>
          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-800">
        {accounts.map((account, index) => (
          <tr key={index}>
            <td className="py-4 pl-4 text-sm leading-6 sm:pl-0">
              <div className="flex items-center justify-center">
                <div
                  className={`${
                    account.isLoggedIn
                      ? 'text-green-400 bg-green-400/10'
                      : 'text-rose-400 bg-rose-400/10'
                  } flex-none rounded-full p-1`}
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-current" />
                </div>
              </div>
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
              {account.username}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
              {account.summonerName ?? '–'}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
              {account.rankedSolo ? (
                <>
                  <div>{getRankString(account.rankedSolo)}</div>
                  <div className="text-gray-400">
                    {getWinLossString(account.rankedSolo)}
                  </div>
                </>
              ) : (
                '–'
              )}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
              {account.rankedFlex ? (
                <>
                  <div>{getRankString(account.rankedFlex)}</div>
                  <div className="text-gray-400">
                    {getWinLossString(account.rankedFlex)}
                  </div>
                </>
              ) : (
                '–'
              )}
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
                onClick={() => onToClipboardClick(account)}
              >
                <DocumentDuplicateIcon className="w-5 h-5" />
                <span className="sr-only">Copy {account.username}</span>
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
