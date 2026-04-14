import { useState, useEffect, useRef, useCallback } from "react";

const STORAGE_KEY = "date-calculator-countdowns";

interface CountdownItem {
  id: string;
  name: string;
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calcTimeLeft(targetDate: string): TimeLeft {
  const now = Date.now();
  const target = new Date(targetDate + "T00:00:00").getTime();
  const total = target - now;

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
    total,
  };
}

function loadCountdowns(): CountdownItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCountdowns(items: CountdownItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function formatDateInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

interface Props {
  onToast: (msg: string) => void;
}

export function CountdownTimer({ onToast }: Props) {
  const [items, setItems] = useState<CountdownItem[]>(loadCountdowns);
  const [name, setName] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [, setTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    saveCountdowns(items);
  }, [items]);

  useEffect(() => {
    const activeItems = items.filter(
      (item) => calcTimeLeft(item.targetDate).total > 0
    );
    if (activeItems.length > 0) {
      intervalRef.current = setInterval(() => {
        setTick((t) => t + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [items]);

  const handleAdd = useCallback(() => {
    if (!name.trim() || !targetDate) return;
    const newItem: CountdownItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      targetDate,
    };
    setItems((prev) => [...prev, newItem]);
    setName("");
    setTargetDate("");
    onToast("カウントダウンを追加しました");
  }, [name, targetDate, onToast]);

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    onToast("カウントダウンを削除しました");
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = formatDateInput(tomorrow);

  const sorted = [...items].sort((a, b) => {
    const aLeft = calcTimeLeft(a.targetDate).total;
    const bLeft = calcTimeLeft(b.targetDate).total;
    if (aLeft === 0 && bLeft === 0) return 0;
    if (aLeft === 0) return 1;
    if (bLeft === 0) return -1;
    return aLeft - bLeft;
  });

  return (
    <div className="space-y-5 animate-slide-up">
      {/* 入力フォーム */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 space-y-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          ⏳ カウントダウンを追加
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="イベント名（例：プロジェクト納期）"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            min={minDate}
            className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={!name.trim() || !targetDate}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors shadow-sm"
        >
          追加
        </button>
      </div>

      {/* カウントダウン一覧 */}
      {items.length > 0 ? (
        <div className="space-y-4">
          {sorted.map((item) => {
            const tl = calcTimeLeft(item.targetDate);
            const isFinished = tl.total <= 0;

            return (
              <div
                key={item.id}
                className={`rounded-2xl shadow-sm border overflow-hidden animate-slide-up ${
                  isFinished
                    ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="px-5 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {item.targetDate.replace(/-/g, "/")}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500 transition-colors text-sm"
                      title="削除"
                    >
                      🗑
                    </button>
                  </div>

                  {isFinished ? (
                    <div className="text-center py-2">
                      <p className="text-lg font-bold text-gray-400 dark:text-gray-500">
                        🎉 完了しました！
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      <TimeBox value={tl.days} unit="日" />
                      <TimeBox value={tl.hours} unit="時間" />
                      <TimeBox value={tl.minutes} unit="分" />
                      <TimeBox value={tl.seconds} unit="秒" />
                    </div>
                  )}
                </div>

                {!isFinished && (
                  <div className="px-5 pb-3">
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-1000"
                        style={{
                          width: `${Math.max(
                            2,
                            100 -
                              (tl.days /
                                Math.max(
                                  1,
                                  Math.ceil(
                                    (new Date(item.targetDate).getTime() -
                                      Date.now()) /
                                      86400000
                                  ) + tl.days
                                )) *
                                100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400 dark:text-gray-500 text-sm">
          <p className="text-3xl mb-3">⏳</p>
          <p>カウントダウンを追加してみましょう</p>
          <p className="text-xs mt-1">
            イベント、締め切り、旅行の予定など
          </p>
        </div>
      )}
    </div>
  );
}

function TimeBox({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-3 text-white text-center shadow">
      <p className="text-2xl sm:text-3xl font-bold tabular-nums leading-none">
        {String(value).padStart(2, "0")}
      </p>
      <p className="text-xs opacity-80 mt-1">{unit}</p>
    </div>
  );
}
