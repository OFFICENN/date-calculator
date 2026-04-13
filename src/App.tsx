import { useState } from "react";
import { Header } from "./components/Header";
import { DarkModeToggle } from "./components/DarkModeToggle";
import { TabButton } from "./components/TabButton";
import { AgeCalculator } from "./components/AgeCalculator";
import { DateDiffCalculator } from "./components/DateDiffCalculator";
import { DateAddCalculator } from "./components/DateAddCalculator";
import { MilestoneCalculator } from "./components/MilestoneCalculator";
import { AnniversaryManager } from "./components/AnniversaryManager";
import { CountdownTimer } from "./components/CountdownTimer";
import { Toast } from "./components/Toast";
import { useUserName } from "./hooks/useUserName";
import { useDarkMode } from "./hooks/useDarkMode";

type TabId = "age" | "diff" | "add" | "milestone" | "anniversary" | "countdown";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "age", label: "年齢計算", icon: "🎂" },
  { id: "diff", label: "日数計算", icon: "📅" },
  { id: "add", label: "日付加算", icon: "➕" },
  { id: "milestone", label: "記念日", icon: "🎉" },
  { id: "anniversary", label: "記念日管理", icon: "💍" },
  { id: "countdown", label: "カウントダウン", icon: "⏳" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("age");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { userName } = useUserName();
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <DarkModeToggle isDark={isDark} onToggle={toggleDarkMode} />

      <div className="max-w-2xl mx-auto px-4 pb-12">
        <Header userName={userName} />

        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-1 px-1">
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              label={tab.label}
              icon={tab.icon}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>

        {activeTab === "age" && <AgeCalculator />}
        {activeTab === "diff" && <DateDiffCalculator />}
        {activeTab === "add" && <DateAddCalculator />}
        {activeTab === "milestone" && <MilestoneCalculator />}
        {activeTab === "anniversary" && (
          <AnniversaryManager onToast={setToastMessage} />
        )}
        {activeTab === "countdown" && (
          <CountdownTimer onToast={setToastMessage} />
        )}

        <footer className="mt-10 text-center text-xs text-gray-400 dark:text-gray-500">
          <p>&copy; OFFICENN</p>
        </footer>
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
