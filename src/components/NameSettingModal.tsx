import { useState } from "react";

interface NameSettingModalProps {
  currentName: string;
  onSave: (name: string) => void;
  onClose: () => void;
}

export function NameSettingModal({ currentName, onSave, onClose }: NameSettingModalProps) {
  const [name, setName] = useState(currentName);

  const handleSave = () => {
    onSave(name.trim());
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          名前の設定
        </h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          placeholder="お名前を入力"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          autoFocus
        />
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          ヘッダーに「○○さんの年齢・日数計算」と表示されます
        </p>
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors shadow-sm"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
