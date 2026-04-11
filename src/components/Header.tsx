interface HeaderProps {
  userName: string;
  isLocked: boolean;
  onOpenSettings: () => void;
}

export function Header({ userName, isLocked, onOpenSettings }: HeaderProps) {
  return (
    <header className="text-center py-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">
        {userName ? `${userName}さんの` : ""}年齢・日数計算
      </h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        生年月日から年齢・経過日数・記念日を計算
      </p>
      {userName && !isLocked && (
        <button
          onClick={onOpenSettings}
          className="mt-1 text-xs text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
        >
          名前を変更
        </button>
      )}
    </header>
  );
}
