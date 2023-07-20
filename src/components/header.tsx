import githubLogo from '../assets/github-mark-white.svg';

interface HeaderProps {
  onAddAccountClick: () => void;
}

export function Header({ onAddAccountClick }: HeaderProps) {
  return (
    <div className="md:flex md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
          League Account Manager
        </h2>
      </div>
      <div className="mt-4 flex md:ml-4 md:mt-0">
        <a
          href="https://github.com/Benjamin-Frost/league-account-manager"
          target="_blank"
          className="inline-flex items-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
        >
          <img src={githubLogo} alt="Github Logo" className="w-5 h-5" />
        </a>
        <button
          type="button"
          className="ml-3 inline-flex items-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          onClick={onAddAccountClick}
        >
          Add Account
        </button>
      </div>
    </div>
  );
}
