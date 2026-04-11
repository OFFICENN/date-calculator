import { useState } from "react";
import {
  getMilestones,
  formatDateWithDay,
  formatDateInput,
  type MilestoneItem,
} from "../utils/dateUtils";

export function MilestoneCalculator() {
  const [birthday, setBirthday] = useState("");
  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);

  const handleCalculate = () => {
    if (!birthday) return;
    const date = new Date(birthday);
    if (isNaN(date.getTime())) return;
    setMilestones(getMilestones(date));
  };

  const today = new Date();
  const nextMilestone = milestones.find((m) => !m.isPast);
  const daysUntilNext = nextMilestone
    ? Math.ceil(
        (nextMilestone.date.getTime() - today.getTime()) / 86400000
      )
    : null;

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          基準日（誕生日・記念日など）
        </label>
        <div className="flex gap-3">
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            max={formatDateInput(new Date())}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <button
            onClick={handleCalculate}
            disabled={!birthday}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors shadow-sm"
          >
            計算
          </button>
        </div>
      </div>

      {milestones.length > 0 && (
        <>
          {nextMilestone && daysUntilNext !== null && (
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg text-center animate-slide-up">
              <p className="text-sm opacity-80 mb-1">次の記念日</p>
              <p className="text-lg font-bold">{nextMilestone.label}目</p>
              <p className="text-3xl font-bold mt-1">
                あと {daysUntilNext.toLocaleString()} 日
              </p>
              <p className="text-sm opacity-80 mt-1">
                {formatDateWithDay(nextMilestone.date)}
              </p>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-slide-up">
            <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                記念日一覧
              </h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {milestones.map((m) => (
                <div
                  key={m.days}
                  className={`flex items-center justify-between px-5 py-3 ${
                    m.isPast ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        m.isPast
                          ? "bg-gray-400 dark:bg-gray-500"
                          : "bg-indigo-500"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {m.label}目
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDateWithDay(m.date)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      m.isPast
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        : "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
                    }`}
                  >
                    {m.isPast ? "済" : "これから"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
