import { useState } from "react";
import { Header } from "./components/Header";
import { DarkModeToggle } from "./components/DarkModeToggle";
import { TabButton } from "./components/TabButton";
import { AgeCalculator } from "./components/AgeCalculator";
import { DateDiffCalculator } from "./components/DateDiffCalculator";
import { DateAddCalculator } from "./components/DateAddCalculator";
import { MilestoneCalculator } from "./components/MilestoneCalculator";
import { Toast } from "./components/Toast";
import { NameSettingModal } from "./components/NameSettingModal";
import { useUserName } from "./hooks/useUserName";
import { useDarkMode } from "./hooks/useDarkMode";

type TabId = "age" | "diff" | "add" | "milestone";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "age", label: "年齢計算", icon: "🎂" },
  { id: "diff", label: "日数計算", icon: "📅" },
  { id: "add", label: "日付加算", icon: "➕" },
  { id: "milestone", label: "記念日", icon: "🎉" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("age");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);

  const { userName, updateUserName, isLocked } = useUserName();
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <DarkModeToggle isDark={isDark} onToggle={toggleDarkMode} />

      <div className="max-w-2xl mx-auto px-4 pb-12">
        <Header
          userName={userName}
          isLocked={isLocked}
          onOpenSettings={() => setShowNameModal(true)}
        />

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

        <footer className="mt-10 text-center text-xs text-gray-400 dark:text-gray-500">
          {!isLocked && (
            <button
              onClick={() => setShowNameModal(true)}
              className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
            >
              名前を設定する
            </button>
          )}
          <p className="mt-2">&copy; OFFICENN</p>
        </footer>
      </div>

      {showNameModal && !isLocked && (
        <NameSettingModal
          currentName={userName}
          onSave={updateUserName}
          onClose={() => setShowNameModal(false)}
        />
      )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
