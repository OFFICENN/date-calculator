import { useState } from "react";
import {
  calculateAge,
  formatDateWithDay,
  formatDateInput,
  type AgeResult,
} from "../utils/dateUtils";

export function AgeCalculator() {
  const [birthday, setBirthday] = useState("");
  const [result, setResult] = useState<AgeResult | null>(null);

  const handleCalculate = () => {
    if (!birthday) return;
    const date = new Date(birthday);
    if (isNaN(date.getTime())) return;
    setResult(calculateAge(date));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCalculate();
  };

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          生年月日
        </label>
        <div className="flex gap-3">
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            onKeyDown={handleKeyDown}
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

      {result && (
        <div className="space-y-4 animate-slide-up">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-sm opacity-80 mb-1">現在の年齢</p>
            <p className="text-4xl font-bold">
              {result.years}
              <span className="text-lg font-normal ml-1">歳</span>
              <span className="text-xl ml-3">
                {result.months}ヶ月 {result.days}日
              </span>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatCard label="生きた日数" value={result.totalDays.toLocaleString()} unit="日" />
            <StatCard label="生きた週数" value={result.totalWeeks.toLocaleString()} unit="週" />
            <StatCard label="生きた月数" value={result.totalMonths.toLocaleString()} unit="ヶ月" />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 space-y-3">
            <InfoRow label="次の誕生日" value={formatDateWithDay(result.nextBirthday)} />
            <InfoRow label="誕生日まで" value={`あと ${result.daysUntilBirthday} 日`} highlight />
            <InfoRow label="星座" value={result.zodiacSign} />
            <InfoRow label="干支" value={result.chineseZodiac} />
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {value}
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">{unit}</span>
      </p>
    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span
        className={`text-sm font-medium ${
          highlight
            ? "text-indigo-600 dark:text-indigo-400"
            : "text-gray-900 dark:text-gray-100"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
