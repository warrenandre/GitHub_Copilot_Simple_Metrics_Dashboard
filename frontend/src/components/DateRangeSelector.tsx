import { Calendar } from 'lucide-react'

export type DateRange = 'daily' | 'weekly' | 'monthly'

interface DateRangeSelectorProps {
  selectedRange: DateRange
  onRangeChange: (range: DateRange) => void
}

const DateRangeSelector = ({ selectedRange, onRangeChange }: DateRangeSelectorProps) => {
  const ranges: { value: DateRange; label: string; days: number }[] = [
    { value: 'daily', label: 'Daily', days: 7 },
    { value: 'weekly', label: 'Weekly', days: 28 },
    { value: 'monthly', label: 'Monthly', days: 90 }
  ]

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-400 light:text-gray-600">
        <Calendar className="w-4 h-4" />
        <span className="text-sm font-medium">View:</span>
      </div>
      <div className="flex gap-2 bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-gray-200 rounded-lg p-1">
        {ranges.map((range) => (
          <button
            key={range.value}
            onClick={() => onRangeChange(range.value)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              selectedRange === range.value
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 dark:text-slate-400 light:text-gray-700 hover:text-white dark:hover:text-white light:hover:text-gray-900 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-gray-100'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default DateRangeSelector
