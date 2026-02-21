import { Radio } from 'lucide-react'

interface DataSourceToggleProps {
  isDemo: boolean
  onToggle: (isDemo: boolean) => void
}

const DataSourceToggle = ({ isDemo, onToggle }: DataSourceToggleProps) => {
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow p-1 border border-gray-200 dark:border-gray-700">
      <button
        onClick={() => onToggle(false)}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors font-medium text-sm ${
          !isDemo
            ? 'bg-orange-600 text-white'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        <Radio className="w-4 h-4" />
        Live Data
      </button>
      <button
        onClick={() => onToggle(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors font-medium text-sm ${
          isDemo
            ? 'bg-purple-600 text-white'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        <Radio className="w-4 h-4" />
        Demo Data
      </button>
    </div>
  )
}

export default DataSourceToggle
