interface HeaderProps {
  userName: string;
}

export function Header({ userName }: HeaderProps) {
  return (
    <header className="text-center py-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">
        {userName ? `${userName}さんの` : ""}年齢・日数計算
      </h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        年齢・経過日数・記念日管理・カウントダウン
      </p>
    </header>
  );
}
