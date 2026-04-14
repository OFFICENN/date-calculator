import { useState } from "react";
import {
  addDaysToDate,
  formatDateWithDay,
  formatDateInput,
} from "../utils/dateUtils";

export function DateAddCalculator() {
  const todayStr = formatDateInput(new Date());
  const [baseDate, setBaseDate] = useState(todayStr);
  const [amount, setAmount] = useState("0");
  const [unit, setUnit] = useState<"days" | "weeks" | "months" | "years">("days");
  const [direction, setDirection] = useState<"add" | "subtract">("add");
  const [resultDate, setResultDate] = useState<Date | null>(null);

  const handleCalculate = () => {
    if (!baseDate || !amount) return;
    const base = new Date(baseDate);
    if (isNaN(base.getTime())) return;

    const num = parseInt(amount, 10);
    if (isNaN(num)) return;

    const sign = direction === "add" ? 1 : -1;
    const result = new Date(base);

    switch (unit) {
      case "days":
        result.setDate(result.getDate() + num * sign);
        break;
      case "weeks":
        result.setDate(result.getDate() + num * 7 * sign);
        break;
      case "months":
        result.setMonth(result.getMonth() + num * sign);
        break;
      case "years":
        result.setFullYear(result.getFullYear() + num * sign);
        break;
    }

    setResultDate(result);
  };

  const daysFromToday = resultDate
    ? Math.round(
        (resultDate.getTime() - new Date(baseDate).getTime()) / 86400000
      )
    : null;

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            基準日
          </label>
          <input
            type="date"
            value={baseDate}
            onChange={(e) => setBaseDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setDirection("add")}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              direction === "add"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600"
            }`}
          >
            + 加算
          </button>
          <button
            onClick={() => setDirection("subtract")}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              direction === "subtract"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600"
            }`}
          >
            − 減算
          </button>
        </div>

        <div className="flex gap-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as typeof unit)}
            className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="days">日</option>
            <option value="weeks">週</option>
            <option value="months">ヶ月</option>
            <option value="years">年</option>
          </select>
        </div>

        <button
          onClick={handleCalculate}
          className="w-full px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-sm"
        >
          計算
        </button>
      </div>

      {resultDate && (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg text-center animate-slide-up">
          <p className="text-sm opacity-80 mb-1">計算結果</p>
          <p className="text-2xl sm:text-3xl font-bold">
            {formatDateWithDay(resultDate)}
          </p>
          {daysFromToday !== null && (
            <p className="text-sm opacity-80 mt-2">
              基準日から {daysFromToday >= 0 ? "+" : ""}
              {daysFromToday.toLocaleString()} 日
            </p>
          )}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          よく使う計算
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "1週間後", days: 7 },
            { label: "2週間後", days: 14 },
            { label: "30日後", days: 30 },
            { label: "90日後", days: 90 },
            { label: "半年後", days: 180 },
            { label: "1年後", days: 365 },
          ].map(({ label, days }) => {
            const base = baseDate ? new Date(baseDate) : new Date();
            const date = addDaysToDate(base, days);
            return (
              <button
                key={label}
                onClick={() => setResultDate(date)}
                className="text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-xs text-gray-500 dark:text-gray-400 block">
                  {label}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatDateWithDay(date)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
