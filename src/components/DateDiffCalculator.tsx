import { useState } from "react";
import {
  calculateDateDiff,
  formatDateInput,
  type DateDiffResult,
} from "../utils/dateUtils";

export function DateDiffCalculator() {
  const todayStr = formatDateInput(new Date());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(todayStr);
  const [result, setResult] = useState<DateDiffResult | null>(null);

  const handleCalculate = () => {
    if (!startDate || !endDate) return;
    const a = new Date(startDate);
    const b = new Date(endDate);
    if (isNaN(a.getTime()) || isNaN(b.getTime())) return;
    setResult(calculateDateDiff(a, b));
  };

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            開始日
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            終了日
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
        <button
          onClick={handleCalculate}
          disabled={!startDate || !endDate}
          className="w-full px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors shadow-sm"
        >
          日数を計算
        </button>
      </div>

      {result && (
        <div className="space-y-4 animate-slide-up">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg text-center">
            <p className="text-sm opacity-80 mb-1">2つの日付の差</p>
            <p className="text-4xl font-bold">
              {result.totalDays.toLocaleString()}
              <span className="text-lg font-normal ml-1">日</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <DiffCard label="年月日" value={`${result.years}年${result.months}ヶ月${result.days}日`} />
            <DiffCard label="週数" value={`${result.totalWeeks.toLocaleString()} 週`} />
            <DiffCard label="時間" value={`${result.totalHours.toLocaleString()} 時間`} />
            <DiffCard label="分" value={`${(result.totalHours * 60).toLocaleString()} 分`} />
          </div>
        </div>
      )}
    </div>
  );
}

function DiffCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-base font-bold text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  );
}
