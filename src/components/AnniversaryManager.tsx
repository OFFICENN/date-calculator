import { useState, useEffect, useCallback } from "react";
import { formatDateWithDay } from "../utils/dateUtils";

interface Anniversary {
  id: string;
  name: string;
  date: string;
}

const STORAGE_KEY = "date-calculator-anniversaries";

function loadAnniversaries(): Anniversary[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAnniversaries(items: Anniversary[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function daysBetweenDates(a: Date, b: Date): number {
  const msPerDay = 86400000;
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utcB - utcA) / msPerDay);
}

function getNextOccurrence(dateStr: string): { date: Date; daysUntil: number } {
  const today = new Date();
  const orig = new Date(dateStr);
  const thisYear = new Date(
    today.getFullYear(),
    orig.getMonth(),
    orig.getDate()
  );

  if (daysBetweenDates(today, thisYear) >= 0) {
    return { date: thisYear, daysUntil: daysBetweenDates(today, thisYear) };
  }
  const nextYear = new Date(
    today.getFullYear() + 1,
    orig.getMonth(),
    orig.getDate()
  );
  return { date: nextYear, daysUntil: daysBetweenDates(today, nextYear) };
}

function getYearsSince(dateStr: string): number {
  const today = new Date();
  const orig = new Date(dateStr);
  let years = today.getFullYear() - orig.getFullYear();
  const monthDiff = today.getMonth() - orig.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < orig.getDate())) {
    years--;
  }
  return years;
}

interface Props {
  onToast: (msg: string) => void;
}

export function AnniversaryManager({ onToast }: Props) {
  const [items, setItems] = useState<Anniversary[]>(loadAnniversaries);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    saveAnniversaries(items);
  }, [items]);

  const handleAdd = useCallback(() => {
    if (!name.trim() || !date) return;

    if (editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, name: name.trim(), date } : item
        )
      );
      onToast("記念日を更新しました");
      setEditingId(null);
    } else {
      const newItem: Anniversary = {
        id: crypto.randomUUID(),
        name: name.trim(),
        date,
      };
      setItems((prev) => [...prev, newItem]);
      onToast("記念日を追加しました");
    }
    setName("");
    setDate("");
  }, [name, date, editingId, onToast]);

  const handleEdit = (item: Anniversary) => {
    setName(item.name);
    setDate(item.date);
    setEditingId(item.id);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setName("");
      setDate("");
    }
    onToast("記念日を削除しました");
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setDate("");
  };

  const sorted = [...items].sort((a, b) => {
    const aDays = getNextOccurrence(a.date).daysUntil;
    const bDays = getNextOccurrence(b.date).daysUntil;
    return aDays - bDays;
  });

  const upcoming = sorted.length > 0 ? sorted[0] : null;
  const upcomingInfo = upcoming ? getNextOccurrence(upcoming.date) : null;

  return (
    <div className="space-y-5 animate-slide-up">
      {/* 入力フォーム */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 space-y-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {editingId ? "✏️ 記念日を編集" : "📝 記念日を追加"}
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="記念日の名前（例：結婚記念日）"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            disabled={!name.trim() || !date}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors shadow-sm"
          >
            {editingId ? "更新" : "追加"}
          </button>
          {editingId && (
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-medium text-sm transition-colors"
            >
              キャンセル
            </button>
          )}
        </div>
      </div>

      {/* 直近の記念日ハイライト */}
      {upcoming && upcomingInfo && (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg text-center animate-slide-up">
          <p className="text-sm opacity-80 mb-1">直近の記念日</p>
          <p className="text-lg font-bold">{upcoming.name}</p>
          {upcomingInfo.daysUntil === 0 ? (
            <p className="text-3xl font-bold mt-1">🎉 今日です！</p>
          ) : (
            <p className="text-3xl font-bold mt-1">
              あと {upcomingInfo.daysUntil.toLocaleString()} 日
            </p>
          )}
          <p className="text-sm opacity-80 mt-1">
            {formatDateWithDay(upcomingInfo.date)}
          </p>
        </div>
      )}

      {/* 記念日一覧 */}
      {items.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-slide-up">
          <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              登録済み記念日（{items.length}件）
            </h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {sorted.map((item) => {
              const { daysUntil, date: nextDate } = getNextOccurrence(
                item.date
              );
              const years = getYearsSince(item.date);
              const elapsed = daysBetweenDates(new Date(item.date), new Date());

              return (
                <div
                  key={item.id}
                  className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {formatDateWithDay(new Date(item.date))}
                        {years > 0 && `（${years}年目）`}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                          経過 {elapsed.toLocaleString()} 日
                        </span>
                        {daysUntil === 0 ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 font-medium">
                            🎉 今日！
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                            次回まで {daysUntil} 日（
                            {formatDateWithDay(nextDate)}）
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-indigo-500 transition-colors text-sm"
                        title="編集"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500 transition-colors text-sm"
                        title="削除"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400 dark:text-gray-500 text-sm">
          <p className="text-3xl mb-3">📅</p>
          <p>記念日を追加してみましょう</p>
          <p className="text-xs mt-1">
            結婚記念日、入社日、出会った日など
          </p>
        </div>
      )}
    </div>
  );
}
