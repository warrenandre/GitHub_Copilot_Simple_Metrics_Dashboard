import { Clock } from 'lucide-react'

export type DateRangeType = 'daily' | 'weekly' | 'monthly' | 'all'

interface DateRangeFilterProps {
  selectedRange: DateRangeType
  onRangeChange: (range: DateRangeType) => void
  className?: string
}

const DateRangeFilter = ({ selectedRange, onRangeChange, className = '' }: DateRangeFilterProps) => {
  const ranges: { value: DateRangeType; label: string }[] = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'all', label: 'All Time' }
  ]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2 text-slate-400">
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">Period:</span>
      </div>
      <div className="flex gap-1 bg-slate-800 rounded-lg p-1 border border-slate-700">
        {ranges.map((range) => (
          <button
            key={range.value}
            onClick={() => onRangeChange(range.value)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              selectedRange === range.value
                ? 'bg-orange-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default DateRangeFilter
